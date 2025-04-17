"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { leadService } from "@/services/leadService";
import { useUsers } from "@/hooks/useUsers";

interface LeadAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  selectedLeads: string[];
}

export function LeadAssignDialog({
  open,
  onOpenChange,
  onSuccess,
  selectedLeads,
}: LeadAssignDialogProps) {
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

    
    const { users, loading: loadingUsers } = useUsers();
  
    // Get lead sources from settings or use fallback
    const salesUsers = users?.filter(user => 
      user.role === 'sales-rep' || user.role === 'sales-mgr' || user.role === 'admin'
    ) || [];    

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selectedLeads.map((id) =>
          leadService.updateLead(id, { assignedTo })
        )
      );
      toast({
        title: "Success",
        description: `${selectedLeads.length} leads assigned successfully.`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Leads</DialogTitle>
          <DialogDescription>
            Assign {selectedLeads.length} selected lead(s) to a sales representative.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={assignedTo}
            onValueChange={setAssignedTo}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sales representative" />
            </SelectTrigger>
            <SelectContent>
              {salesUsers.map((rep) => (
                <SelectItem key={rep._id} value={rep._id}>
                  {rep.firstName} {rep.lastName} ({rep.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={loading || !assignedTo}
            onClick={handleSubmit}
          >
            Assign Leads
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}