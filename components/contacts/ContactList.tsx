"use client";

import { Contact, SortField, SortOrder } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  selectedContacts: string[];
  onSelectionChange: (ids: string[]) => void;
}

const categoryColors = {
  lead: "secondary",
  prospect: "outline",
  customer: "success",
  partner: "default",
} as const;

export function ContactList({
  contacts,
  loading,
  sortField,
  sortOrder,
  onSort,
  selectedContacts,
  onSelectionChange,
}: ContactListProps) {
  const toggleAll = () => {
    if (selectedContacts.length === contacts.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(contacts.map(c => c.id));
    }
  };

  const toggleContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      onSelectionChange(selectedContacts.filter(cid => cid !== id));
    } else {
      onSelectionChange([...selectedContacts, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading contacts...</div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No contacts found</div>
      </div>
    );
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-8 flex items-center gap-1"
    >
      {children}
      {sortField === field && (
        <ArrowUpDown className={`h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
      )}
    </Button>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedContacts.length === contacts.length}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>
            <SortableHeader field="name">Name</SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader field="company">Company</SortableHeader>
          </TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>
            <SortableHeader field="lastContact">Last Contact</SortableHeader>
          </TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell>
              <Checkbox
                checked={selectedContacts.includes(contact.id)}
                onCheckedChange={() => toggleContact(contact.id)}
              />
            </TableCell>
            <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
            <TableCell>{contact.companyId}</TableCell>
            <TableCell>
              <Badge variant={categoryColors[contact.category] as "default" | "secondary" | "destructive" | "outline"}>
                {contact.category}
              </Badge>
            </TableCell>
            <TableCell>{contact.email}</TableCell>
            <TableCell>{contact.phone}</TableCell>
            <TableCell>
              {contact.lastContact && format(new Date(contact.lastContact), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <Link href={`/contacts/${contact._id}`}>
                <Button variant="ghost" size="icon" title="View Details">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}