import { NextResponse, NextRequest } from 'next/server';

export async function GET(  req: NextRequest,
  { params }: { params: { tenantId: string } }) {
  try {
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}