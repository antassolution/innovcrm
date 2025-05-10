"use client";

import { useState, useEffect } from "react";
import { Deal } from "@/types";
import { dealService } from "@/services/dealService";
import { DealList } from "@/components/deals/DealList";
import { DealToolbar } from "@/components/deals/DealToolbar";
import { useToast } from "@/hooks/use-toast";

export default function WonDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await dealService.getDealsByStatus('won');
      setDeals(data);
    } catch (error) {
      console.error("Failed to load won deals:", error);
      toast({
        title: "Error",
        description: "Failed to load won deals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DealToolbar onRefresh={loadDeals} showNewDeal={false} />
      <div className="rounded-lg border bg-card">
      </div>
    </div>
  );
}