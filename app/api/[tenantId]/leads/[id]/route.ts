import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/model/lead";
import User from "@/model/user";
import Settings from "@/model/settings";
import mongoose from "mongoose";
import { sendEmail, emailTemplates } from "@/lib/emailUtils";

export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  await dbConnect();
  
  try {
    const lead = await Lead.findById(params.id);
    
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
    
    // Get the current lead to check if assignedTo has changed
    const currentLead = await Lead.findById(params.id);
    if (!currentLead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }
    
    const previousAssigneeId = currentLead.assignedTo ? currentLead.assignedTo.toString() : null;
    const newAssigneeId = data.assignedTo || previousAssigneeId;
    const hasAssigneeChanged = previousAssigneeId !== newAssigneeId && newAssigneeId !== null;
    
    // Get user info from JWT token
    let currentUser = null;
    const authHeader = req.cookies.get('authToken')?.value;
    if (authHeader) {
      try {
        // Simple JWT token decoding without verification for getting user info
        const token = authHeader.split('.')[1];
        const payload = JSON.parse(atob(token));
        currentUser = await User.findById(payload.id).select('firstName lastName email');
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
      }
    }
    
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
    
    // Send email notification if a lead was assigned to someone
    if (hasAssigneeChanged) {
      try {
        const newAssignee = await User.findById(newAssigneeId);
        if (newAssignee && newAssignee.email) {
          const settings = await Settings.findOne({ tenantId: new mongoose.Types.ObjectId(params.tenantId) });
          const companyName = settings?.companyInfo?.name || 'Your Company';
          const assigneeName = `${newAssignee.firstName} ${newAssignee.lastName}`;
          
          // Generate the lead URL (assuming the app is hosted at the same domain as the API)
          const hostname = req.headers.get('host') || 'localhost:3000';
          const protocol = req.headers.get('x-forwarded-proto') || 'http';
          const leadUrl = `${protocol}://${hostname}/leads/${lead._id}`;
          
          const assignerName = currentUser 
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : 'System Admin';
          
          const leadName = `${lead.firstName} ${lead.lastName}`;
          
          const emailHtml = emailTemplates.leadUpdate(
            assigneeName,
            leadName,
            lead.company || 'N/A',
            'assigned',
            assignerName,
            companyName,
            leadUrl
          );
          
          await sendEmail(params.tenantId, {
            to: newAssignee.email,
            subject: `Lead Assignment: ${leadName}`,
            html: emailHtml
          });
        }
      } catch (emailError) {
        console.error('Error sending lead assignment email:', emailError);
        // Continue even if email fails
      }
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