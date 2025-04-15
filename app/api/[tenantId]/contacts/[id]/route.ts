import { NextResponse } from 'next/server';
import Contact from '@/model/contact';
import dbConnect from '@/lib/dbConnect';

// GET by ID: Fetch a single contact by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await dbConnect();
  const contact = await Contact.findById(id);

  if (!contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  return NextResponse.json(contact);
}

// PUT: Update an existing contact by ID
export async function PUT(req: Request, { params }: { params: { id: string, tenantId: string } }) {
  const { id } = params;
  const body = await req.json();

  await dbConnect();
  const updatedContact = await Contact.findByIdAndUpdate(id, body, { new: true });

  if (!updatedContact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  return NextResponse.json(updatedContact);
}

// DELETE: Remove a contact by ID
export async function DELETE(req: Request, { params }: { params: { id: string, tenantId: string } }) {
  const { id } = params;

  await dbConnect();
  const deletedContact = await Contact.findByIdAndDelete(id);

  if (!deletedContact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Contact deleted successfully' });
}