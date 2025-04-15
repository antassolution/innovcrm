"use client";

import { useState } from "react";
import { Lead } from "@/types";
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
import { salesReps } from "./LeadForm";
import { Checkbox } from "@/components/ui/checkbox";
import { LeadAssignDialog } from "./LeadAssignDialog";

interface LeadListProps {
  leads: Lead[];
  loading: boolean;
  onRefresh: () => void;
}

const statusColors = {
  new: "default",
  contacted: "warning",
  qualified: "success",
  lost: "destructive",
} as const;

const scoreColors = {
  hot: "destructive",
  warm: "warning",
  cold: "secondary",
} as const;

export function LeadList({ leads, loading, onRefresh }: LeadListProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const { toast } = useToast();

  const handleConvert = async (id: string) => {
    try {
      await leadService.convertToOpportunity(id);
      toast({
        title: "Success",
        description: "Lead converted to opportunity successfully.",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
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

  if (leads.length === 0) {
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
                checked={selectedLeads.length === leads.length}
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
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={() => toggleLead(lead.id)}
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
                {lead.assignedTo ? salesReps?.find(rep => rep.id === lead.assignedTo)?.name : "-"}
              </TableCell>
              <TableCell>
                {format(new Date(lead.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/leads/${lead.id}`}>
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Convert to Opportunity"
                    onClick={() => handleConvert(lead.id)}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LeadAssignDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onSuccess={() => {
          setSelectedLeads([]);
          onRefresh();
        }}
        selectedLeads={selectedLeads}
      />
    </>
  );
}