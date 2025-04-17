import { NextRequest, NextResponse } from 'next/server';
import  dbConnect from '@/lib/dbConnect';
import Deal from '@/model/deals';

import mongoose from 'mongoose';



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
   //   .populate('customerId', 'name email company')
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
   

    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid deal ID' }, { status: 400 });
    }

    const updateData = await request.json();
    
    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
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
