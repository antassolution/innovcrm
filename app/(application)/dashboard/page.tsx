"use client"
import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { SalesForecast } from "@/components/dashboard/SalesForecast";
import { RecentDeals } from "@/components/dashboard/RecentDeals";
import { getDashboardData } from "@/services/dashboardService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-[350px] rounded-lg" />
          <Skeleton className="h-[350px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* <div className="flex justify-between items-center mb-8">
        <Tabs defaultValue="overview" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deals" onClick={() => router.push("/deals")}>Deals</TabsTrigger>
            <TabsTrigger value="leads" onClick={() => router.push("/leads")}>Leads</TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}

      <div className="space-y-8">
        {/* Stats Cards */}
        <DashboardStats stats={dashboardData.stats} />

        {/* Charts Row */}
        <div className="grid gap-8 md:grid-cols-2">
          <RevenueChart data={dashboardData.charts.monthlyRevenue} />
          <PipelineChart data={dashboardData.charts.pipelineStageData} />
        </div>

        {/* Sales Forecast and Recent Deals */}
        <div className="grid gap-8 md:grid-cols-3">
          <SalesForecast data={dashboardData.charts.salesForecast} />
          <div className="md:col-span-1">
            <RecentDeals deals={dashboardData.recentActivity.recentDeals} />
          </div>
        </div>
      </div>
    </div>
  );
}