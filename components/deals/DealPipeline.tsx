"use client";

import { useState } from "react";
import { Deal } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { dealService } from "@/services/dealService";
import { useToast } from "@/hooks/use-toast";
import { DealForm } from "./DealForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePipelineStages } from "@/hooks/usePipelineStages";

interface DealPipelineProps {
  deals: Deal[];
  onUpdate: () => void;
}

export function DealPipeline({ deals, onUpdate }: DealPipelineProps) {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDealForm, setShowDealForm] = useState(false);
  const { toast } = useToast();

  // Fetch pipeline stages dynamically
  const { data: stages } = usePipelineStages();

  console.log("Pipeline Stages", stages);

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    e.dataTransfer.setData('dealId', deal._id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    try {
      await dealService.updateDeal(dealId, { stage: stage as Deal['stage'] });
      onUpdate();
      toast({
        title: "Success",
        description: "Deal stage updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deal stage. Please try again.",
        variant: "destructive",
      });
    }
  };

  const dealsByStage = stages?.reduce((acc, stage) => {
    acc[stage.id] = deals?.filter(deal => deal.stageId === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {stages?.map((stage) => (
          <Card
            key={stage.id}
            className="h-[calc(100vh-300px)] overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {stage.name.toUpperCase()}
                <Badge variant="secondary" className="ml-2">
                  {dealsByStage[stage.id]?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 overflow-auto">
              <div className="space-y-2">
                {dealsByStage[stage.id]?.map((deal) => (
                  <div
                    key={deal._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onClick={() => {
                      setSelectedDeal(deal);
                      setShowDealForm(true);
                    }}
                    className="bg-white p-3 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-sm">{deal.title}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        ${deal.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Close: {format(new Date(deal.expectedCloseDate), "MMM d")}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {deal.probability}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDealForm} onOpenChange={setShowDealForm}>
        <DialogContent className="max-w-4xl mx-auto overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedDeal ? 'Edit Deal' : 'New Deal'}</DialogTitle>
          </DialogHeader>
          <DealForm
            deal={selectedDeal || undefined}
            onSuccess={() => {
              setShowDealForm(false);
              setSelectedDeal(null);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}