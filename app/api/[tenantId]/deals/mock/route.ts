import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/model/deals';
import { faker } from '@faker-js/faker';

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    await dbConnect();

    const mockDeals = Array.from({ length: 1000 }, () => ({
      title: faker.company.catchPhrase(),
      customerId: '68013bb6b407fa3c8b35a70e',
      value: faker.number.int({ min: 1000, max: 100000 }),
      probability: faker.number.int({ min: 10, max: 100 }),
      expectedCloseDate: faker.date.future(),
      stageId: faker.helpers.arrayElement(['6801365fb407fa3c8b35a5a0', '68013689b407fa3c8b35a5c3', '6801368fb407fa3c8b35a5dc', '68013696b407fa3c8b35a5f5', '67fe58cce758ff4f71356f41']),
      tenantId: params.tenantId,
      assignedTo: faker.helpers.arrayElement([ '6800e8e5457c9f4428027ec9', '6800eefb234807fcc8df843d', '6801f78d03891e6b0e718e5c']),

    }));

    const createdDeals = await Deal.insertMany(mockDeals);

    return NextResponse.json({
      message: 'Mock deals generated successfully',
      count: createdDeals.length,
    });
  } catch (error) {
    console.error('Error generating mock deals:', error);
    return NextResponse.json(
      { error: 'Failed to generate mock deals' },
      { status: 500 }
    );
  }
}