import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user';
import { jwtVerify } from 'jose';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    // Get authorization header
    const authHeader = request.cookies.get('authToken')?.value;
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(authHeader, secret);
    // Connect to database
    await dbConnect();
    
    // Get user by ID from token
    const user = await User.findOne({
      _id: payload.id,
      tenantId: params.tenantId
    }).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the response
    // const transformedUser = {
    //   id: user._id.toString(),
    //   _id: user._id.toString(),
    //   email: user.email,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   role: user.role,
    //   permissions: user.permissions || [],
    //   status: user.status,
    //   createdAt: user.createdAt.toISOString(),
    //   updatedAt: user.updatedAt.toISOString(),
    // };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    
    if ((error as Error).name === 'JsonWebTokenError' || (error as Error).name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}