"use client";

import { useEffect, useState } from "react";
import { Lead } from "@/types";
import { leadService } from "@/services/leadService";
import { LeadForm } from "@/components/leads/LeadForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function LeadDetails({ id }: { id: string }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadLead = async () => {
      try {
        const data = await leadService.getLeadById(id);
        setLead(data || null);
      } catch (error) {
        console.error("Failed to load lead:", error);
        toast({
          title: "Error",
          description: "Failed to load lead details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [id, toast]);

  const handleSuccess = () => {
    router.push("/leads");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading lead details...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-muted-foreground">Lead not found</div>
        <Link href="/leads">
          <Button variant="outline">Back to Leads</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4">
            <Link href="/leads">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Lead</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <LeadForm lead={lead} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}