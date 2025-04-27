import { NextResponse } from 'next/server';
import Contact from '@/model/contact';
import dbConnect from '@/lib/dbConnect';
import { ContactActivityModel } from '@/model/contactActivity';

// GET by ID: Fetch a single contact by ID
export async function GET(req: Request, { params }: { params: { id: string , tenantId: string} }) {
  const { id, tenantId } = params;

  await dbConnect();
  console.log('Fetching contact with ID:', id, 'and tenantId:', tenantId);
  const contact = await Contact.findOne({ _id: id, tenantId });
  console.log('Contact found:', contact);
  if (!contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  return NextResponse.json(contact);
}

// PUT: Update an existing contact by ID
export async function PUT(req: Request, { params }: { params: { id: string, tenantId: string } }) {
  const { id, tenantId } = params;
  const body = await req.json();

  await dbConnect();
  const updatedContact = await Contact.findOneAndUpdate({ _id: id, tenantId }, body, { new: true });

  if (!updatedContact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  // Create an activity log for the contact update
  // If a note is provided, use it as the description
  const description = body.note && body.note.trim() !== '' 
    ? body.note 
    : `Contact ${updatedContact.firstName} ${updatedContact.lastName || ''} was updated`;
  
  const contactActivity = new ContactActivityModel({
    contactId: id,
    type: 'note',
    title: 'Contact Updated',
    description: description,
    date: new Date(),
    tenantId: tenantId
  });
  await contactActivity.save();

  return NextResponse.json(updatedContact);
}

// DELETE: Remove a contact by ID
export async function DELETE(req: Request, { params }: { params: { id: string, tenantId: string } }) {
  const { id, tenantId } = params;

  await dbConnect();
  const deletedContact = await Contact.findOneAndDelete({ _id: id, tenantId });

  if (!deletedContact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Contact deleted successfully' });
}