"use client";

import { useEffect, useState } from "react";
import { Deal } from "@/types";
import { dealService } from "@/services/dealService";
import { DealForm } from "@/components/deals/DealForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function DealDetailsPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadDeal = async () => {
      try {
        const data = await dealService.getDealById(params.id);
        setDeal(data || null);
      } catch (error) {
        console.error("Failed to load deal:", error);
        toast({
          title: "Error",
          description: "Failed to load deal details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDeal();
  }, [params.id, toast]);

  const handleSuccess = () => {
    router.push("/deals/all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading deal details...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-muted-foreground">Deal not found</div>
        <Link href="/deals/all">
          <Button variant="outline">Back to Deals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Deal Information</h2>
          <DealForm deal={deal} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}