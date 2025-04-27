"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { User } from "@/types";

interface LeadToolbarProps {
  onRefresh: (page: number, name: string, assignedTo?: string) => void;
  users: User[];
  loadingUsers: boolean;
}

export function LeadToolbar({ onRefresh, users, loadingUsers }: LeadToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAssignedTo, setCurrentAssignedTo] = useState<string>();
  const router = useRouter();

  // Memoize the search handler to prevent recreation on each render
  const handleSearch = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onRefresh(1, searchTerm, currentAssignedTo);
    }
  }, [searchTerm, currentAssignedTo, onRefresh]);

  // Memoize the assignedTo change handler
  const handleAssignedToChange = useCallback((assignedTo: string) => {
    setCurrentAssignedTo(assignedTo);
    onRefresh(1, searchTerm, assignedTo);
  }, [searchTerm, onRefresh]);

  // Memoize the search term change handler
  const handleSearchTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchTermChange}
            onKeyDown={handleSearch}
          /> 
        </div>
      </div>

      <Select onValueChange={handleAssignedToChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Assigned To" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">All Users</SelectItem>
          {!loadingUsers && users.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Link href="/leads/new" className="ml-auto">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </Link>
    </div>
  );
}