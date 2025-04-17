"use client";

import { useState, useEffect } from "react";
import { Lead, PaginatedResult } from "@/types";
import { leadService } from "@/services/leadService";
import { LeadList } from "@/components/leads/LeadList";
import { LeadToolbar } from "@/components/leads/LeadToolbar";
import { useToast } from "@/hooks/use-toast";

export default function LeadsPage() {
  const [leads, setLeads] = useState<PaginatedResult<Lead>>({
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLeads(currentPage);
  }, [currentPage]);

  const loadLeads = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await leadService.getLeads(page, 10);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-full bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <h1 className="text-2xl font-semibold">Leads Management</h1>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <LeadToolbar onRefresh={() => loadLeads(currentPage)} />
        <div className="rounded-lg border bg-card">
          <LeadList 
            leads={leads} 
            loading={loading} 
            onRefresh={() => loadLeads(currentPage)} 
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}