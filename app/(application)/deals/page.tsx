"use client";

import { useState, useEffect } from "react";
import { Deal } from "@/types";
import { dealService } from "@/services/dealService";
import { DealPipeline } from "@/components/deals/DealPipeline";
import { DealForecast } from "@/components/deals/DealForecast";
import { useToast } from "@/hooks/use-toast";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await dealService.getDeals();
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

  if (loading) {
    return <div>Loading deals...</div>;
  }

  return (
    <div className="space-y-8">
      <DealForecast deals={deals} />
      <DealPipeline deals={deals} onUpdate={loadDeals} />
    </div>
  );
}