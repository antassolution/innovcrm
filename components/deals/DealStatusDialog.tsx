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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { dealService } from "@/services/dealService";
import { Loader2 } from "lucide-react";

interface DealStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  dealId: string;
  action: "won" | "lost";
}

export function DealStatusDialog({
  open,
  onOpenChange,
  onSuccess,
  dealId,
  action,
}: DealStatusDialogProps) {
  const [reason, setReason] = useState("");
  const [actualValue, setActualValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await dealService.updateDeal(dealId, {
        status: action === "won" ? "closed-won" : "closed-lost",
        actualCloseDate: new Date().toISOString(),
        ...(action === "won" 
          ? { winReason: reason, actualValue: Number(actualValue) }
          : { lossReason: reason }
        ),
      });
      
      toast({
        title: "Success",
        description: `Deal marked as ${action === "won" ? "won" : "lost"} successfully.`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deal status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Mark Deal as {action === "won" ? "Won" : "Lost"}
            </DialogTitle>
            <DialogDescription>
              {action === "won"
                ? "Provide details about winning this deal"
                : "Provide the reason for losing this deal"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {action === "won" && (
              <div className="grid gap-2">
                <Label htmlFor="actualValue">Actual Value</Label>
                <Input
                  id="actualValue"
                  type="number"
                  value={actualValue}
                  onChange={(e) => setActualValue(e.target.value)}
                  placeholder="Enter final deal value"
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="reason">
                {action === "won" ? "Win Reason" : "Loss Reason"}
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  action === "won"
                    ? "What helped win this deal?"
                    : "Why was this deal lost?"
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}