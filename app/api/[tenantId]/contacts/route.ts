import { NextResponse } from 'next/server';
import Contact from '@/model/contact';
import dbConnect from '@/lib/dbConnect';
import { ContactActivityModel } from '@/model/contactActivity';

// GET: Fetch all contacts with pagination
export async function GET(req: Request,  { params }: { params: { tenantId: string } }) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10); 
  const email= searchParams.get('email') || undefined;
  await dbConnect();

   // Build the query object
   const query: any = {};
   if (email) {
     query.email = email;
   }

  const contacts = await Contact.find(query)
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

// POST: Generate sample contacts and history in batches
export async function PATCH(req: Request, { params }: { params: { tenantId: string } }) {
  await dbConnect();

  try{
    const batchSize = 1000;
    const totalContacts = 10000;
    const totalHistoriesPerContact = 100;

    for (let batch = 1; batch < totalContacts / batchSize; batch++) {
      // Generate a batch of contacts
      const contacts = Array.from({ length: batchSize }, (_, i) => ({
        firstName: `First ${batch * batchSize + i + 1}`,
        lastName: `Last ${batch * batchSize + i + 1}`,
        email: `contact-new2${batch * batchSize + i + 1}@example.com`,
        phone: `123451${(batch * batchSize + i) % 10}`,
      }));

      // Insert the batch of contacts into the database
      const createdContacts = await Contact.insertMany(contacts);

      // Generate history records for the batch of contacts
      const historyRecords = createdContacts.flatMap((contact) => {
        return Array.from({ length: totalHistoriesPerContact }, (_, j) => ({
          contactId: contact._id,
          action: `Action ${j + 1}`,
          timestamp: new Date(),
        }));
      });

      // Use the correct model for inserting history records
      await ContactActivityModel.insertMany(historyRecords);
    }
  }
  catch (error) {
    console.error('Error generating sample data:', error);
    return NextResponse.json({ error: 'Failed to generate sample data' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Sample data generated successfully in batches' }, { status: 201 });
}