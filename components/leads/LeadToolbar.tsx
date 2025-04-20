"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LeadToolbarProps {
  onRefresh: (page: number, name: string) => void;
}

export function LeadToolbar({ onRefresh }: LeadToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("Search term:", searchTerm);
     // event.preventDefault();
      onRefresh(1, searchTerm);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          /> 
        </div>
      </div>

      <Link href="/leads/new" className="ml-auto">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </Link>
    </div>
  );
}