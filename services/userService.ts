import { User } from '@/types';
import httpClient from '@/lib/httpClient';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await httpClient.get('/api/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const response = await httpClient.get(`/api/users/${id}`);
    return response.data;
  },

  createUser: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const response = await httpClient.post('/api/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await httpClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await httpClient.patch(`/api/users/${id}`, { action: 'toggleStatus' });
    return response.data;
  },
};