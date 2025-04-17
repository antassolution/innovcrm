"use client";

import { useState, useEffect } from "react";
import { Deal } from "@/types";
import { dealService } from "@/services/dealService";
import { DealList } from "@/components/deals/DealList";
import { DealToolbar } from "@/components/deals/DealToolbar";
import { useToast } from "@/hooks/use-toast";

export default function AllDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await dealService.getDeals();
      setDeals(data?.data);
    } catch (error) {
      console.error("Failed to load deals:", error);
      toast({
        title: "Error",
        description: "Failed to load deals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DealToolbar onRefresh={loadDeals} />
      <div className="rounded-lg border bg-card">
        <DealList deals={deals} loading={loading} onRefresh={loadDeals} />
      </div>
    </div>
  );
}