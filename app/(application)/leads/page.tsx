"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/types";
import { leadService } from "@/services/leadService";
import { LeadList } from "@/components/leads/LeadList";
import { LeadToolbar } from "@/components/leads/LeadToolbar";
import { useToast } from "@/hooks/use-toast";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await leadService.getLeads();
      setLeads(data);
    } catch (error) {
      console.error("Failed to load leads:", error);
      toast({
        title: "Error",
        description: "Failed to load leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <h1 className="text-2xl font-semibold">Leads Management</h1>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <LeadToolbar onRefresh={loadLeads} />
        <div className="rounded-lg border bg-card">
          <LeadList leads={leads} loading={loading} onRefresh={loadLeads} />
        </div>
      </div>
    </div>
  );
}