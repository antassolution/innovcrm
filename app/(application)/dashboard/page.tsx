"use client"
import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CustomerList } from "@/components/customers/CustomerList";
import { DealList } from "@/components/deals/DealList";
import { getDashboardData } from "@/services/dashboardService";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getDashboardData("tenantId-placeholder"); // Replace with actual tenant ID logic
      setDashboardData(data);
    }
    fetchData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Sales Dashboard</h1>

      <div className="space-y-8">
        <DashboardStats stats={dashboardData.stats} />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Deals</h2>
          <DealList deals={dashboardData.recentDeals} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Customers</h2>
          <CustomerList customers={dashboardData.customers} />
        </div>
      </div>
    </div>
  );
}