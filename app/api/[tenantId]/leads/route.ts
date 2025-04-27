import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/model/lead";
import { ILead } from "@/model/lead";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  await dbConnect();
  
  try {
    // Pagination parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalLeads = await Lead.countDocuments();
    
    const query: any = {tenantId: params.tenantId};

    // Add name to query if provided
    const name = searchParams.get('name');
    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } }
      ]; // Case-insensitive search for title or description
    }

     // Add assignedTo filter if provided
     const assignedTo = searchParams.get('assignedTo');
     if (assignedTo) {
       // Check if the ID is valid MongoDB ObjectId to prevent errors
       if (mongoose.Types.ObjectId.isValid(assignedTo)) {
         query.assignedTo = assignedTo;
       }
     }

    // Get leads with pagination
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'firstName lastName');

    return NextResponse.json({
      data: leads,
      pagination: { 
        page,
        limit,
        totalItems: totalLeads,
        totalPages: Math.ceil(totalLeads / limit),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const lead = new Lead({...data,tenantId:params.tenantId});
    await lead.save();
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}