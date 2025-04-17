import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/model/lead";

export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  await dbConnect();
  
  try {
    const lead = await Lead.findById(params.id);
     // .populate('assignedTo', 'firstName lastName');
      
    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  await dbConnect();
  
  try {
    const data = await req.json();
    
    const lead = await Lead.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  await dbConnect();
  
  try {
    const lead = await Lead.findByIdAndDelete(params.id);
    
    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Lead deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}