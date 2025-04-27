"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead, PaginatedResult, User } from "@/types";
import { leadService } from "@/services/leadService";
import { LeadList } from "@/components/leads/LeadList";
import { LeadToolbar } from "@/components/leads/LeadToolbar";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";

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
  const [currentName, setCurrentName] = useState('');
  const [currentAssignedTo, setCurrentAssignedTo] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { users, loading: loadingUsers } = useUsers();

  // Memoize the loadLeads function to prevent recreation on each render
  const loadLeads = useCallback(async (page: number = 1, name: string = '', assignedTo?: string) => {
    try {
      setLoading(true);
      setCurrentName(name);
      setCurrentAssignedTo(assignedTo);
      
      const data = await leadService.getLeads(page, 10, name, assignedTo);
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
  }, [toast]);

  // Memoize the page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Use the effect with proper dependencies
  useEffect(() => {
    loadLeads(currentPage, currentName, currentAssignedTo);
  }, [currentPage, loadLeads, currentName, currentAssignedTo]);

  // Memoize the refresh handler for LeadList
  const handleListRefresh = useCallback((page: number, name: string) => {
    loadLeads(page, name, currentAssignedTo);
  }, [loadLeads, currentAssignedTo]);

  return (
    <div className="h-full bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <h1 className="text-2xl font-semibold">Leads Management</h1>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <LeadToolbar 
          onRefresh={loadLeads} 
          users={users} 
          loadingUsers={loadingUsers} 
        />
        <div className="rounded-lg border bg-card">
          <LeadList 
            leads={leads} 
            loading={loading} 
            onRefresh={handleListRefresh} 
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}