"use client";

import { useState } from "react";
import { Deal } from "@/types";
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
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { salesReps } from "@/components/leads/LeadForm";
import { DealStatusDialog } from "./DealStatusDialog";

interface DealListProps {
  deals: Deal[];
  loading: boolean;
  onRefresh: () => void;
}

const statusColors = {
  'lead': 'secondary',
  'opportunity': 'default',
  'proposal': 'primary',
  'negotiation': 'warning',
  'closed-won': 'success',
  'closed-lost': 'destructive',
} as const;

export function DealList({ deals, loading, onRefresh }: DealListProps) {
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [statusAction, setStatusAction] = useState<"won" | "lost" | null>(null);

  const handleStatusChange = (dealId: string, action: "won" | "lost") => {
    setSelectedDeal(dealId);
    setStatusAction(action);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading deals...</div>
      </div>
    );
  }

  if (deals?.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No deals found</div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Probability</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Expected Close</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals?.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell className="font-medium">{deal.title}</TableCell>
              <TableCell>${deal.value.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {deal.stage}
                </Badge>
              </TableCell>
              <TableCell>{deal.probability}%</TableCell>
              <TableCell>
                {deal.assignedTo ? salesReps.find(rep => rep.id === deal.assignedTo)?.name : "-"}
              </TableCell>
              <TableCell>
                {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Badge variant={statusColors[deal.status]}>
                  {deal.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/deals/${deal.id}`}>
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  {!deal.status.startsWith('closed') && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Mark as Won"
                        onClick={() => handleStatusChange(deal.id, "won")}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Mark as Lost"
                        onClick={() => handleStatusChange(deal.id, "lost")}
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDeal && statusAction && (
        <DealStatusDialog
          open={true}
          onOpenChange={() => {
            setSelectedDeal(null);
            setStatusAction(null);
          }}
          onSuccess={onRefresh}
          dealId={selectedDeal}
          action={statusAction}
        />
      )}
    </>
  );
}