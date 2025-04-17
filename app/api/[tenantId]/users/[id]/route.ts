import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user';
import mongoose from 'mongoose';
import { userSchema } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    await dbConnect();
    const { tenantId, id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId) || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(id),
      tenantId: new mongoose.Types.ObjectId(tenantId)
    }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error fetching user with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    await dbConnect();
    const { tenantId, id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId) || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate the request body - we use partial here as it's an update
    const validationResult = userSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid user data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Check if email is being changed and if it already exists
    if (body.email) {
      const existingUser = await User.findOne({ 
        email: body.email, 
        _id: { $ne: new mongoose.Types.ObjectId(id) }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        );
      }
    }
    
    // If updating password, handle it appropriately (omitted for simplicity)
    // In a real app, passwords should be hashed
    if (body.password) {
      delete body.password; // For security, don't allow password updates through this endpoint
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(id),
        tenantId: new mongoose.Types.ObjectId(tenantId)
      },
      { $set: validationResult.data },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    await dbConnect();
    const { tenantId, id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId) || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Check if this is a status toggle operation
    if (body.action === 'toggleStatus') {
      // Find the user first to get their current status
      const user = await User.findOne({ 
        _id: new mongoose.Types.ObjectId(id),
        tenantId: new mongoose.Types.ObjectId(tenantId)
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Toggle status between 'active' and 'disabled'
      const newStatus = user.status === 'active' ? 'disabled' : 'active';
      
      const updatedUser = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { status: newStatus } },
        { new: true }
      ).select('-password');
      
      return NextResponse.json(updatedUser);
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`Error updating user status with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    await dbConnect();
    const { tenantId, id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId) || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const deletedUser = await User.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      tenantId: new mongoose.Types.ObjectId(tenantId)
    });
    
    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(`Error deleting user with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}