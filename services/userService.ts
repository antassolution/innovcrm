import { User } from '@/types';

// Mock data for users
let users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const userService = {
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return users;
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return users.find(user => user.id === id);
  },

  createUser: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    
    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return users[index];
  },

  toggleUserStatus: async (id: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    
    users[index] = {
      ...users[index],
      status: users[index].status === 'active' ? 'disabled' : 'active',
      updatedAt: new Date().toISOString(),
    };
    return users[index];
  },
};