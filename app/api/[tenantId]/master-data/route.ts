import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MasterDataModel from "@/model/masterData";

export async function GET(req: NextRequest,{ params }: { params: { tenantId: string }}) {
  try {
    await dbConnect();


    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") || "";

    const skip = (page - 1) * limit;

    // Build query object based on parameters
    const query: any = {tenantId: params.tenantId};
    
    if (category) {
      query.category = category;
    }

    if (filter) {
      query.$or = [
        { name: { $regex: filter, $options: "i" } },
        { value: { $regex: filter, $options: "i" } },
      ];
    }

    
    // Execute query with pagination
    const totalItems = await MasterDataModel.countDocuments(query);
    const masterData = await MasterDataModel.find(query)
      
      .skip(skip)
      .limit(limit);

      masterData.sort((a, b) => {
        if (a.displayOrder === b.displayOrder) {
          return a.name.localeCompare(b.name);  
        }
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      });

    // Return paginated response if pagination params were provided
    if (searchParams.has("page") || searchParams.has("limit")) {
      const totalPages = Math.ceil(totalItems / limit);
      return NextResponse.json({
        data: masterData,
        pagination: {
          page,
          limit,
          totalPages,
          totalItems,
        },
      });
    }

    // Return simple array for category-filtered requests
    return NextResponse.json(masterData);
    
  } catch (error) {
    console.error("Error in GET /api/master-data:", error);
    return NextResponse.json(
      { error: "Failed to fetch master data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest,{ params }: { params: { tenantId: string }}) {
  try {
    await dbConnect();
  


    const data = await req.json();
    
    // Validate required fields
    if (!data.category || !data.name || !data.value) {
      return NextResponse.json(
        { error: "Category, name, and value are required" },
        { status: 400 }
      );
    }

    // Create new master data item
    const masterDataItem = await MasterDataModel.create({...data,tenantId: params.tenantId}); 

    return NextResponse.json(masterDataItem, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/master-data:", error);
    return NextResponse.json(
      { error: "Failed to create master data item" },
      { status: 500 }
    );
  }
}