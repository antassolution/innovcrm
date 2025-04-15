"use client";

import { LeadDetails } from "@/components/leads/LeadDetails";

export default function LeadDetailsPage({ params }: { params: { id: string } }) {
  return <LeadDetails id={params.id} />;
}