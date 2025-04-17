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
  const newContact = new Contact({...body,tenantId: params.tenantId});
  await newContact.save();

  return NextResponse.json(newContact, { status: 201 });
}


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function insertWithRetry(model: any, docs: any[], label: string) {
  try {
    return await model.insertMany(docs, { ordered: false }); // ✅ return result
  } catch (err: any) {
    if (err.code === 16500 || err.status === 429) {
      const retryAfter = err.retryAfterMs || 3000;
      console.warn(`Throttled (${label}). Retrying after ${retryAfter} ms`);
      await delay(retryAfter);
      return insertWithRetry(model, docs, label);
    } else {
      console.error(`Insert failed for ${label}:`, err);
      throw err;
    }
  }
}


function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export async function PATCH(req: Request, { params }: { params: { tenantId: string } }) {
  await dbConnect();

  try {
    const batchSize = 10; // Contact insert per batch
    const totalContacts = 10000;
    const totalHistoriesPerContact = 10;
    const historyChunkSize = 50; // Split history inserts
    const delayBetweenChunks = 1500;

    for (let batchStart = 0; batchStart < totalContacts; batchStart += batchSize) {
      // 1. Create contacts
      const contacts = Array.from(
        { length: Math.min(batchSize, totalContacts - batchStart) },
        (_, i) => ({
          firstName: `First ${batchStart + i + 1}`,
          lastName: `Last ${batchStart + i + 1}`,
          email: `contact-${batchStart + i + 1}@example.com`,
          phone: `123451${(batchStart + i) % 10}`,
          tenantId:'67fe58cce758ff4f71356f41'
        })
      );

      const createdContacts = await insertWithRetry(Contact, contacts, 'contacts');

      // 2. Short delay before activities
      await delay(1000);

      // 3. Create activity records
      const historyRecords = createdContacts.flatMap((contact:any) =>
        Array.from({ length: totalHistoriesPerContact }, (_, j) => ({
          contactId: contact._id,
          type: 'call',
          title: `Action ${j + 1}`,
          description: `description ${j + 1}`,
          date: new Date(),
          tenentId:'67fe58cce758ff4f71356f41'
        }))
      );

      const chunks = chunkArray(historyRecords, historyChunkSize);

      for (const chunk of chunks) {
        await insertWithRetry(ContactActivityModel, chunk, 'contact activities');
        await delay(delayBetweenChunks);
      }

      console.log(`Batch ${batchStart + batchSize} / ${totalContacts} inserted.`);
    }
  } catch (error) {
    console.error('Error generating sample data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Sample data generated successfully in batches' }, { status: 201 });
}