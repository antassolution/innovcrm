import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendEmail, emailTemplates } from '@/lib/emailUtils';
import Settings from '@/model/settings';

// Password update schema
const passwordUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

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
    
    // Validate request body
    const validationResult = passwordUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { userId, password } = validationResult.data;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    // Find the user
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
      tenantId: new mongoose.Types.ObjectId(tenantId)
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the user's password
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    
    // Get company name for email template
    const settings = await Settings.findOne({ tenantId: new mongoose.Types.ObjectId(tenantId) });
    const companyName = settings?.companyInfo?.name || 'Your Company';
    
    // Send password change notification email
    if (user.email) {
      const userName = `${user.firstName} ${user.lastName}`;
      const emailHtml = emailTemplates.passwordChange(userName, companyName);
      
      await sendEmail(tenantId, {
        to: user.email,
        subject: 'Password Changed',
        html: emailHtml
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}