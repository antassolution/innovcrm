import { Contact, ContactHistory, PaginatedResult } from '@/types';

export const contactService = {
  getContacts: async (): Promise<PaginatedResult<Contact>> => {
    const response = await fetch('/api/contacts');
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return response.json();
  },

  getContactById: async (id: string): Promise<Contact | undefined> => {
    const response = await fetch(`/api/contacts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }
    return response.json();
  },

  createContact: async (data: Partial<Contact>): Promise<Contact> => {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    return response.json();
  },

  updateContact: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update contact');
    }
    return response.json();
  },

  deleteContacts: async (ids: string[]): Promise<void> => {
    const promises = ids.map(id => 
      fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    );
    await Promise.all(promises);
  },

  checkDuplicate: async (email: string, phone: string): Promise<boolean> => {
    const response = await fetch(`/api/contacts?email=${email}&phone=${phone}`);
    if (!response.ok) {
      throw new Error('Failed to check duplicates');
    }
    const data = await response.json();
    return data?.data.length>0;

  },

  getContactHistory: async (contactId: string): Promise<ContactHistory[]> => {
    const response = await fetch(`/api/contacts/${contactId}/history`);
    if (!response.ok) {
      throw new Error('Failed to fetch contact history');
    }
    return response.json();
  },

  searchContacts: async (query: string): Promise<Contact[]> => {
    const response = await fetch(`/api/contacts?query=${query}`);
    if (!response.ok) {
      throw new Error('Failed to search contacts');
    }
    return response.json();
  },

  exportContacts: async (selectedIds?: string[]): Promise<string> => {
    const response = await fetch('/api/contacts/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (!response.ok) {
      throw new Error('Failed to export contacts');
    }
    return response.text();
  },
};