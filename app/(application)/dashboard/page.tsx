import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CustomerList } from "@/components/customers/CustomerList";
import { DealList } from "@/components/deals/DealList";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Sales Dashboard</h1>
      
      <div className="space-y-8">
        <DashboardStats />
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Deals</h2>
          <DealList />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Customers</h2>
          <CustomerList />
        </div>
      </div>
    </div>
  );
}