import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/model/deals';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    await dbConnect();

    const deals = await Deal.find({ tenantId: params.tenantId });

    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = deals.reduce(
      (sum, deal) => sum + deal.value * (deal.probability / 100),
      0
    );

    const byStage = deals.reduce((acc, deal) => {
      const stage = acc.find((s:any) => s.stage === deal.stage);
      if (stage) {
        stage.count += 1;
        stage.value += deal.value;
      } else {
        acc.push({ stage: deal.stage, count: 1, value: deal.value });
      }
      return acc;
    }, [] as { stage: string; count: number; value: number }[]);

    return NextResponse.json({ totalValue, weightedValue, byStage });
  } catch (error) {
    console.error('Error generating forecast:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    );
  }
}