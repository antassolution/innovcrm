"use client";

import { useState, useEffect } from "react";
import { Contact, SortField, SortOrder, ContactFilters, PaginatedResult } from "@/types";
import { contactService } from "@/services/contactService";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactToolbar } from "@/components/contacts/ContactToolbar";
import { ContactBulkActions } from "@/components/contacts/ContactBulkActions";
import { useToast } from "@/hooks/use-toast";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

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

  const loadContacts = async (page?: number) => {
    setLoading(true);
    try {
      // Use the provided page parameter or fall back to filters.page or 1
      const currentPage = page !== undefined ? page : (filters.page || 1);
      const data = await contactService.getContacts(currentPage, 10);
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

  const handleSearchKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const query = (event.target as HTMLInputElement).value;
      setFilters({ ...filters, search: query });
      if (query.trim()) {
        let results;
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(query)) {
          // Search by email
          results = await contactService.searchContacts({ email: query });
        } else if (/^\+?\d+$/.test(query)) {
          // Search by phone number
          results = await contactService.searchContacts({ phone: query });
        } else {
          // Search by name
          results = await contactService.searchContacts({ name: query });
        }
        setContacts(results);
      } else {
        loadContacts();
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value });
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

  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
    loadContacts(page);
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
          onSearchKeyPress={handleSearchKeyPress}
          onSearchChange={handleSearchChange}
        />

        {selectedContacts.length > 0 && (
          <ContactBulkActions
            selectedCount={selectedContacts.length}
            onAction={handleBulkAction}
          />
        )}

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-8 w-20" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ContactList
              contacts={filteredContacts}
              loading={loading}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              selectedContacts={selectedContacts}
              onSelectionChange={setSelectedContacts}
            />
          )}

          <div className="flex justify-center my-4">
            {loading ? (
              <Skeleton className="h-10 w-72" />
            ) : (
              <Pagination
                className="flex items-center space-x-2"
                currentPage={contacts?.pagination.page || 1}
                totalPages={contacts?.pagination.totalPages || 1}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}