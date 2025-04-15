import { NextResponse } from 'next/server';
import Contact from '@/model/contact';
import dbConnect from '@/lib/dbConnect';

// GET: Fetch all contacts with pagination
export async function GET(req: Request,  { params }: { params: { tenantId: string } }) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  await dbConnect();

  const contacts = await Contact.find()
    .skip((page - 1) * limit)
    .limit(limit);

  const totalContacts = await Contact.countDocuments();

  return NextResponse.json({
    data: contacts,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalContacts / limit),
      totalContacts,
    },
  });
}

// POST: Create a new contact
export async function POST(req: Request,  { params }: { params: { tenantId: string } }) {
  const body = await req.json();
if(!body?.companyId)
{
    body.companyId = undefined
}
  await dbConnect();
  const newContact = new Contact(body);
  await newContact.save();

  return NextResponse.json(newContact, { status: 201 });
}