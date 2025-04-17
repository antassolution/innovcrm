import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user';
import mongoose from 'mongoose';
import { userSchema } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    await dbConnect();
    const tenantId = params.tenantId;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: 'Invalid tenant ID' }, { status: 400 });
    }
    
    const users = await User.find({ tenantId: new mongoose.Types.ObjectId(tenantId) })
      .select('-password') // Exclude password from results
      .lean();
      
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    await dbConnect();
    const tenantId = params.tenantId;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: 'Invalid tenant ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Check if email already exists before validation
    if (body.email) {
      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        );
      }
    }
    
    // Validate the request body against the schema
    const validationResult = userSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid user data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Create new user with tenantId
    const userData = {
      ...validationResult.data,
      tenantId: new mongoose.Types.ObjectId(tenantId),
      // Generate a temporary password or handle password setting separately
      password: Math.random().toString(36).slice(-8), // Temporary solution - in real app use proper password handling
    };
    
    const newUser = await User.create(userData);
    
    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}