"use client";

import { useState, useEffect } from "react";
import { Deal, PaginatedResult } from "@/types";
import { dealService } from "@/services/dealService";
import { DealList } from "@/components/deals/DealList";
import { DealToolbar } from "@/components/deals/DealToolbar";
import { useToast } from "@/hooks/use-toast";

export default function AllDealsPage() {
  const [deals, setDeals] = useState<PaginatedResult<Deal>>({
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
    },  
  });
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDeals(1, 10);
  }, []);

  const loadDeals = async (page: number, limit: number) => {
    try {
      console.log("Loading deals for page:", page, "with limit:", limit);
      const data = await dealService.getDeals({}, page, limit);
      setDeals(data);
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