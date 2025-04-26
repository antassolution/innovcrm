import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user';
import Settings from '@/model/settings';
import mongoose from 'mongoose';
import { userSchema } from '@/types';
import bcrypt from 'bcryptjs';
import { sendEmail, emailTemplates } from '@/lib/emailUtils';

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
    
    const users = await User.find({ tenantId: new mongoose.Types.ObjectId(tenantId) }).select('-password');
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
    
    // Generate a random password if not provided
    const randomPassword = Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10);
    const password = body.password || randomPassword;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with tenantId
    const userData = {
      ...validationResult.data,
      tenantId: new mongoose.Types.ObjectId(tenantId),
      password: hashedPassword,
    };
    
    const newUser = await User.create(userData);
    
    // Send welcome email with login credentials
    try {
      // Get company name for email template
      const settings = await Settings.findOne({ tenantId: new mongoose.Types.ObjectId(tenantId) });
      const companyName = settings?.companyInfo?.name || 'Your Company';
      const userName = `${newUser.firstName} ${newUser.lastName}`;
      
      // Generate the login URL (assuming the app is hosted at the same domain as the API)
      const hostname = request.headers.get('host') || 'localhost:3000';
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const loginUrl = `${protocol}://${hostname}/login`;
      
      const emailHtml = emailTemplates.newUser(
        userName,
        newUser.email,
        password, // Send the unhashed password in the email
        companyName,
        loginUrl
      );
      
      await sendEmail(tenantId, {
        to: newUser.email,
        subject: `Welcome to ${companyName}`,
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails
    }
    
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