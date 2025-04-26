import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/model/deals";
import Lead from "@/model/lead";

export async function GET(request: Request,{ params }: { params: { tenantId: string } }) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const tenantId = params.tenantId
    
    // Time periods for trending data
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    
    // Get overall stats
    const [
      totalDealsCount,
      wonDealsCount,
      totalRevenue,
      totalLeadsCount,
      conversionRate,
      avgDealSize,
      monthlyRevenue,
      pipelineStageData,
      salesForecast,
      recentDeals,
    ] = await Promise.all([
      Deal.countDocuments({ tenantId }),
      Deal.countDocuments({ tenantId, status: "won" }),
      Deal.aggregate([
        { $match: { tenantId: tenantId.toString(), status: "won" } },
        { $group: { _id: null, total: { $sum: "$value" } } },
      ]),
      Lead.countDocuments({ tenantId }),
      calculateConversionRate(tenantId),
      calculateAvgDealSize(tenantId),
      getMonthlyRevenue(tenantId),
      getPipelineData(tenantId),
      getSalesForecast(tenantId),
      getRecentDeals(tenantId),
    ]);
    
    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        totalDeals: totalDealsCount,
        wonDeals: wonDealsCount,
        totalLeads: totalLeadsCount,
        conversionRate: conversionRate || 0,
        avgDealSize: avgDealSize || 0,
      },
      charts: {
        monthlyRevenue,
        pipelineStageData,
        salesForecast,
      },
      recentActivity: {
        recentDeals,
      }
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// Helper functions for data aggregation
async function calculateConversionRate(tenantId: string) {
  const closedDeals = await Deal.countDocuments({ 
    tenantId, 
    $or: [{ status: "won" }, { status: "lost" }] 
  });
  const totalDeals = await Deal.countDocuments({ tenantId });
  
  return totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;
}

async function calculateAvgDealSize(tenantId: string) {
  const result = await Deal.aggregate([
    { $match: { tenantId: tenantId.toString(), status: "won" } },
    { $group: { _id: null, total: { $sum: "$value" }, count: { $sum: 1 } } },
  ]);
  
  return result.length > 0 ? result[0].total / result[0].count : 0;
}

async function getMonthlyRevenue(tenantId: string) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  
  const result = await Deal.aggregate([
    { 
      $match: { 
        tenantId: tenantId.toString(), 
        status: "won",
        createdAt: { $gte: sixMonthsAgo } 
      } 
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        revenue: { $sum: "$value" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
  
  // Format data for charting
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  const formattedData = [];
  for (let i = 5; i >= 0; i--) {
    const targetMonth = (currentMonth - i + 12) % 12;
    const targetYear = new Date().getFullYear() - (currentMonth < i ? 1 : 0);
    
    const monthData = result.find(item => 
      item._id.month === targetMonth + 1 && item._id.year === targetYear
    );
    
    formattedData.push({
      name: months[targetMonth],
      revenue: monthData ? monthData.revenue : 0,
      count: monthData ? monthData.count : 0
    });
  }
  
  return formattedData;
}

async function getPipelineData(tenantId: string) {
  const result = await Deal.aggregate([
    { 
      $match: { 
        tenantId: tenantId.toString(),
        status: "active"
      } 
    },
    {
      $group: {
        _id: "$stageId",
        count: { $sum: 1 },
        value: { $sum: "$value" }
      }
    },
    {
      $lookup: {
        from: "masterdata",
        localField: "_id",
        foreignField: "_id",
        as: "stageInfo"
      }
    },
    {
      $project: {
        stageName: { $arrayElemAt: ["$stageInfo.name", 0] },
        count: 1,
        value: 1
      }
    }
  ]);
  
  return result.map(stage => ({
    name: stage.stageName || "Unknown Stage",
    value: stage.value,
    count: stage.count
  }));
}

async function getSalesForecast(tenantId: string) {
  const nextThreeMonths = [0, 1, 2].map(i => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    };
  });
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const forecastData = await Promise.all(
    nextThreeMonths.map(async ({ month, year, startDate, endDate }) => {
      const deals = await Deal.find({
        tenantId,
        status: "active",
        expectedCloseDate: { $gte: startDate, $lte: endDate }
      });
      
      const projectedRevenue = deals.reduce((sum, deal) => {
        return sum + (deal.value * (deal.probability / 100));
      }, 0);
      
      const potentialRevenue = deals.reduce((sum, deal) => {
        return sum + deal.value;
      }, 0);
      
      return {
        name: months[month],
        projected: Math.round(projectedRevenue),
        potential: Math.round(potentialRevenue),
        count: deals.length
      };
    })
  );
  
  return forecastData;
}

async function getRecentDeals(tenantId: string) {
  return Deal.find({ tenantId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'customerId',
      model: 'Contact'
    })
    .populate({
      path: 'assignedTo',
      model: 'User',
      select: 'name email'
    })
    .lean();
}