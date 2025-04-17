import { Contact, ContactHistory, PaginatedResult } from '@/types';
import httpClient from '@/lib/httpClient';

export const contactService = {
  getContacts: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResult<Contact>> => {
    const response = await httpClient.get('/api/contacts', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getContactById: async (id: string): Promise<Contact | undefined> => {
    const response = await httpClient.get(`/api/contacts/${id}`);
    return response.data;
  },

  createContact: async (data: Partial<Contact>): Promise<Contact> => {
    const response = await httpClient.post('/api/contacts', data);
    return response.data;
  },

  updateContact: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await httpClient.put(`/api/contacts/${id}`, data);
    return response.data;
  },

  deleteContacts: async (ids: string[]): Promise<void> => {
    const promises = ids.map(id => httpClient.delete(`/api/contacts/${id}`));
    await Promise.all(promises);
  },

  checkDuplicate: async (email: string, phone: string): Promise<boolean> => {
    const response = await httpClient.get(`/api/contacts`, { params: { email, phone } });
    return response.data?.data.length > 0;
  },

  getContactHistory: async (contactId: string): Promise<ContactHistory[]> => {
    const response = await httpClient.get(`/api/contacts/${contactId}/history`);
    return response.data;
  },

  searchContacts: async (query: string): Promise<PaginatedResult<Contact>> => {
    const response = await httpClient.get(`/api/contacts`, { params: { query } });
    return response.data;
  },

  exportContacts: async (selectedIds?: string[]): Promise<string> => {
    const response = await httpClient.post('/api/contacts/export', { ids: selectedIds });
    return response.data;
  },
};