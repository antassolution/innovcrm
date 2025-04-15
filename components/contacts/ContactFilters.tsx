"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContactFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Contacts" },
  { id: "lead", label: "Leads" },
  { id: "prospect", label: "Prospects" },
  { id: "customer", label: "Customers" },
  { id: "partner", label: "Partners" },
];

export function ContactFilters({
  selectedCategory,
  onCategoryChange,
}: ContactFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}