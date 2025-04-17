import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MasterDataModel from "@/model/masterData";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string, tenantId: string  } }
) {
  try {
    await dbConnect();

   

    const masterDataItem = await MasterDataModel.findById(params.id);

    if (!masterDataItem) {
      return NextResponse.json(
        { error: "Master data item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(masterDataItem);
  } catch (error) {
    console.error(`Error in GET /api/master-data/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch master data item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    


    const data = await req.json();
    
    // Find and update the master data item
    const masterDataItem = await MasterDataModel.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!masterDataItem) {
      return NextResponse.json(
        { error: "Master data item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(masterDataItem);
  } catch (error) {
    console.error(`Error in PUT /api/master-data/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update master data item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
   

    // Find and delete the master data item
    const masterDataItem = await MasterDataModel.findByIdAndDelete(params.id);

    if (!masterDataItem) {
      return NextResponse.json(
        { error: "Master data item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Master data item deleted successfully" });
  } catch (error) {
    console.error(`Error in DELETE /api/master-data/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete master data item" },
      { status: 500 }
    );
  }
}