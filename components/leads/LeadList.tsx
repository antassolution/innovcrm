"use client";

import { useState } from "react";
import { Lead, PaginatedResult } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { leadService } from "@/services/leadService";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { LeadAssignDialog } from "./LeadAssignDialog";
import { Pagination } from "@/components/ui/pagination";
import { useUsers } from "@/hooks/useUsers";
import { masterDataService } from "@/services/masterDataService";

interface LeadListProps {
  leads: PaginatedResult<Lead>;
  loading: boolean;
  onRefresh: (page: number, name: string) => void;
  onPageChange: (page: number) => void;
}

const statusColors = {
  new: "default",
  contacted: "secondary",
  qualified: "outline",
  lost: "destructive",
} as const;

const scoreColors = {
  hot: "destructive",
  warm: "outline",
  cold: "secondary",
} as const;

export function LeadList({ leads, loading, onRefresh, onPageChange }: LeadListProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const { toast } = useToast();

   const { users, loading: loadingUsers } = useUsers();
  
    
    // Filter users to only include sales reps and management
    const salesUsers = users?.filter(user => 
      user.role === 'sales-rep' || user.role === 'sales-mgr' || user.role === 'admin'
    ) || [];
  

  const handleConvert = async (id: string) => {
    try {
      // Get lead stages from master data
      const leadStages = await masterDataService.getMasterDataByCategory('lead-stages');
      
      // Get the current lead to check its status
      const currentLead = await leadService.getLeadById(id);
      
      if (!currentLead) {
        throw new Error("Lead not found");
      }
      
      // Sort stages by display order to ensure correct progression
      const sortedStages = [...leadStages].sort((a, b) => 
        (a.displayOrder || 0) - (b.displayOrder || 0)
      );
      
      // Find the current stage index
      const currentStageIndex = sortedStages.findIndex(
        stage => stage.value === currentLead.status
      );
      
      // If current stage not found or it's the last stage, handle appropriately
      if (currentStageIndex === -1) {
        // If status doesn't match any stage, set to first stage
        await leadService.updateLead(id, { status: (sortedStages[0]?.value as 'new' | 'contacted' | 'qualified' | 'lost') || 'new' });
        toast({
          title: "Lead Stage Updated",
          description: `Lead set to ${sortedStages[0]?.name || 'new'} stage.`,
        });
      } else if (currentStageIndex >= sortedStages.length - 1) {
        // If it's the final stage, convert to opportunity
        await leadService.convertToOpportunity(id);
        toast({
          title: "Lead Converted",
          description: "Lead successfully converted to opportunity.",
        });
      } else {
        // Move to next stage
        const nextStage = sortedStages[currentStageIndex + 1];
        await leadService.updateLead(id, { status: nextStage.value as 'new' | 'contacted' | 'qualified' | 'lost' });
        toast({
          title: "Lead Stage Advanced",
          description: `Lead moved to ${nextStage.name} stage.`,
        });
      }
      
      onRefresh(leads.pagination.page, '');
    } catch (error) {
      console.error("Error converting lead:", error);
      toast({
        title: "Error",
        description: "Failed to advance lead stage. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleAll = () => {
    if (selectedLeads.length === leads.data.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.data.map(lead => lead._id));
    }
  };

  const toggleLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading leads...</div>
      </div>
    );
  }

  if (leads.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No leads found</div>
      </div>
    );
  }

  return (
    <>
      {selectedLeads.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
          <span className="text-sm text-muted-foreground">
            {selectedLeads.length} leads selected
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowAssignDialog(true)}
          >
            <UserPlus className="h-4 w-4" />
            Assign to Rep
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedLeads.length === leads.data.length}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.data.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell>
                <Checkbox
                  checked={selectedLeads.includes(lead._id)}
                  onCheckedChange={() => toggleLead(lead._id)}
                />
              </TableCell>
              <TableCell>
                {lead.firstName} {lead.lastName}
              </TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell>
                <Badge variant={statusColors[lead.status]}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={scoreColors[lead.score]}>
                  {lead.score}
                </Badge>
              </TableCell>
              <TableCell>
                {lead.assignedTo ? salesUsers?.find(rep => rep._id === lead.assignedTo)?.firstName : "-"}
              </TableCell>
              <TableCell>
                {format(new Date(lead.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/leads/${lead._id}`}>
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Convert to Opportunity"
                    onClick={() => handleConvert(lead._id)}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={leads?.pagination?.page}
        totalPages={leads?.pagination?.totalPages}
        onPageChange={onPageChange}
      />

      <LeadAssignDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onSuccess={() => {
          setSelectedLeads([]);
          onRefresh(leads.pagination.page, ''); 
        }}
        selectedLeads={selectedLeads}
      />
    </>
  );
}