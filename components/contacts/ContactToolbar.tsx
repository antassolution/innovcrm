"use client";

import { ContactFilters } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface ContactToolbarProps {
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
  onSearch: (query: string) => void;
}

export function ContactToolbar({
  filters,
  onFiltersChange,
  onSearch,
}: ContactToolbarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={filters.search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filters.category}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contacts</SelectItem>
            <SelectItem value="lead">Leads</SelectItem>
            <SelectItem value="prospect">Prospects</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="partner">Partners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Link href="/contacts/new" className="ml-auto">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </Link>
    </div>
  );
}