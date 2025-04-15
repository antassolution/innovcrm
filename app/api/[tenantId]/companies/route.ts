import { NextResponse, NextRequest } from 'next/server';
import { companies } from '@/services/mockData';

export async function GET(  req: NextRequest,
  { params }: { params: { tenantId: string } }) {
  try {
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}