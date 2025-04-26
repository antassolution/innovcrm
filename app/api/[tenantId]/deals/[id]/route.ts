import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/model/deals';
import User from '@/model/user';
import Settings from '@/model/settings';
import mongoose from 'mongoose';
import { sendEmail, emailTemplates } from '@/lib/emailUtils';

// GET handler - retrieve a specific deal by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    // Validate tenantId and dealId
    await dbConnect();

    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid deal ID' }, { status: 400 });
    }

    // Find the deal
    const deal = await Deal.findById(id)
      .populate('assignedTo', 'name email')
      .populate('stageId', 'name');

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ data: deal });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}

// PATCH handler - update a specific deal by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    await dbConnect();
    const { tenantId, id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid deal ID' }, { status: 400 });
    }

    const updateData = await request.json();
    
    // Get the current deal to check if assignedTo has changed
    const currentDeal = await Deal.findById(id);
    if (!currentDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const previousAssigneeId = currentDeal.assignedTo ? currentDeal.assignedTo.toString() : null;
    const newAssigneeId = updateData.assignedTo || previousAssigneeId;
    const hasAssigneeChanged = previousAssigneeId !== newAssigneeId && newAssigneeId !== null;

    // Get user info from JWT token
    let currentUser = null;
    const authHeader = request.cookies.get('authToken')?.value;
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
    
    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    // Send email notification if a deal was assigned to someone
    if (hasAssigneeChanged) {
      try {
        const newAssignee = await User.findById(newAssigneeId);
        if (newAssignee && newAssignee.email) {
          const settings = await Settings.findOne({ tenantId: new mongoose.Types.ObjectId(tenantId) });
          const companyName = settings?.companyInfo?.name || 'Your Company';
          const assigneeName = `${newAssignee.firstName} ${newAssignee.lastName}`;
          
          // Generate the deal URL (assuming the app is hosted at the same domain as the API)
          const hostname = request.headers.get('host') || 'localhost:3000';
          const protocol = request.headers.get('x-forwarded-proto') || 'http';
          const dealUrl = `${protocol}://${hostname}/deals/${updatedDeal._id}`;
          
          const assignerName = currentUser 
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : 'System Admin';
            
          const emailHtml = emailTemplates.dealUpdate(
            assigneeName,
            updatedDeal.title,
            updatedDeal.value,
            'assigned',
            assignerName,
            companyName,
            dealUrl
          );
          
          await sendEmail(tenantId, {
            to: newAssignee.email,
            subject: `Deal Assignment: ${updatedDeal.title}`,
            html: emailHtml
          });
        }
      } catch (emailError) {
        console.error('Error sending deal assignment email:', emailError);
        // Continue even if email fails
      }
    }
    
    return NextResponse.json({ data: updatedDeal });
  } catch (error: any) {
    console.error('Error updating deal:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json(
        { error: 'Validation error', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

// DELETE handler - delete a specific deal by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid deal ID' }, { status: 400 });
    }
    
    const deletedDeal = await Deal.findByIdAndDelete(id);
    
    if (!deletedDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}
