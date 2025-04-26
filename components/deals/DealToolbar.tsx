"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUsers } from "@/hooks/useUsers";

interface DealToolbarProps {
  onRefresh: (page:number, limit:number, title?:string, status?:string, assignedTo?:string) => void;
  showNewDeal?: boolean;
} 

export function DealToolbar({ onRefresh, showNewDeal = true }: DealToolbarProps) {
  const { users } = useUsers();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputValue = (event.target as HTMLInputElement).value;
      onRefresh(1, 10, inputValue);
    }
  };

  const handleStatusChange = (status: string) => {
    onRefresh(1, 10, undefined, status, undefined);
  };

  const handleAssignedToChange = (assignedTo: string) => {
    onRefresh(1, 10, undefined, undefined, assignedTo);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search deals..."
          className="pl-10"
          onKeyDown={handleKeyDown}
        />
      </div>

      <Select onValueChange={handleStatusChange} className="w-48">
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="*">All </SelectItem>

          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="won">Won</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={handleAssignedToChange} className="w-48">
        <SelectTrigger>
          <SelectValue placeholder="Select User" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">All Users</SelectItem>
          {users.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showNewDeal && (
        <Link href="/deals/new" className="ml-auto">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Deal
          </Button>
        </Link>
      )}
    </div>
  );
}