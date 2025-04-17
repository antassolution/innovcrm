import { NextResponse } from 'next/server';
import { ContactActivityModel } from '@/model/contactActivity';
import dbConnect from '@/lib/dbConnect';

// GET: Fetch contact activity history
export async function GET(req: Request, { params }: { params: { tenantId: string; id: string } }) {
  const { id: contactId } = params;

  await dbConnect();

  try {
    const activities = await ContactActivityModel.find({ contactId }).sort({ date: -1 });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching contact activities:', error);
    return NextResponse.json({ error: 'Failed to fetch contact activities' }, { status: 500 });
  }
}

// POST: Add a new contact activity
export async function POST(req: Request, { params }: { params: { tenantId: string; id: string } }) {
  const body = await req.json();

  await dbConnect();

  try {
  const { id: contactId } = params;
  const newActivity = await ContactActivityModel.create({ ...body, contactId , tenantId: params.tenantId });
    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create contact activity' }, { status: 500 });
  }
}