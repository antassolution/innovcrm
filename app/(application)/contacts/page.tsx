"use client";

import { useState, useEffect } from "react";
import { Contact, SortField, SortOrder, ContactFilters, PaginatedResult } from "@/types";
import { contactService } from "@/services/contactService";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactToolbar } from "@/components/contacts/ContactToolbar";
import { ContactBulkActions } from "@/components/contacts/ContactBulkActions";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<PaginatedResult<Contact>>();
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState<ContactFilters>({
    search: "",
    category: "all",
    tags: [],
    groups: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await contactService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error("Failed to load contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handleSearch = async (query: string) => {
    setFilters({ ...filters, search: query });
    if (query.trim()) {
      const results = await contactService.searchContacts(query);

      setContacts(results);
    } else {
      loadContacts();
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      switch (action) {
        case "export":
          const csvContent = await contactService.exportContacts(selectedContacts);
          // Create a blob and download it
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'contacts.csv';
          a.click();
          window.URL.revokeObjectURL(url);
          toast({
            title: "Success",
            description: "Contacts exported successfully",
          });
          break;
        case "delete":
          await contactService.deleteContacts(selectedContacts);
          loadContacts();
          toast({
            title: "Success",
            description: "Selected contacts deleted successfully",
          });
          break;
        case "refreshGroups":
          loadContacts();
          break;
      }
      setSelectedContacts([]);
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
      toast({
        title: "Error",
        description: "Failed to perform the action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sortedContacts = [...(contacts?.data || [])].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        const fullNameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const fullNameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return fullNameA.localeCompare(fullNameB) * modifier;
      case "company":
        return a.companyId.localeCompare(b.companyId) * modifier;
      case "lastContact":
        return (new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime()) * modifier;
      default:
        return 0;
    }
  });

  const filteredContacts = sortedContacts.filter(contact => {
    const matchesCategory = filters.category === "all" || contact.category === filters.category;
    const matchesTags = filters.tags.length === 0 || filters.tags.every(tag => contact.tags.includes(tag));
    const matchesGroups = filters.groups.length === 0 || filters.groups.every(group => contact.groups.includes(group));
    return matchesCategory && matchesTags && matchesGroups;
  });

  return (
    <div className="h-full bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <h1 className="text-2xl font-semibold">Contacts</h1>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <ContactToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
        />

        {selectedContacts.length > 0 && (
          <ContactBulkActions
            selectedCount={selectedContacts.length}
            onAction={handleBulkAction}
          />
        )}

        <div className="rounded-lg border bg-card">
          <ContactList
            contacts={filteredContacts}
            loading={loading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedContacts={selectedContacts}
            onSelectionChange={setSelectedContacts}
          />

          <div className="flex justify-center mt-4">
            <Pagination
              className="flex items-center space-x-2"
              currentPage={contacts?.pagination.page || 1}
              totalPages={contacts?.pagination.totalPages || 1}
              onPageChange={(page) => {
                setFilters({ ...filters, page });
                loadContacts();
              }}
            >
              <PaginationPrevious
                onClick={() => {
                  if (contacts?.pagination.page > 1) {
                    setFilters({ ...filters, page: contacts.pagination.page - 1 });
                    loadContacts();
                  }
                }}
              />
              {Array.from({ length: contacts?.pagination.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === contacts?.pagination.page}
                    onClick={() => {
                      setFilters({ ...filters, page });
                      loadContacts();
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() => {
                  if (contacts?.pagination.page < (contacts?.pagination.totalPages || 1)) {
                    setFilters({ ...filters, page: contacts.pagination.page + 1 });
                    loadContacts();
                  }
                }}
              />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}