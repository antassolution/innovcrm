import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/model/deals";

export async function GET(req: Request, { params }: { params: { tenantId: string } }) {
  const { tenantId } = params;

  try {
    await dbConnect();

    // Fetch relevant data for the dashboard
    const stats = await Deal.aggregate([
      { $match: { tenantId: tenantId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$value" },
          totalDeals: { $sum: 1 },
        },
      },
    ]);

    const recentDeals = await Deal.find({ tenantId: tenantId })
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      stats: stats[0] || { totalRevenue: 0, totalDeals: 0 },
      recentDeals,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}