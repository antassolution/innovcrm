import { ContactGroup } from '@/types';

const groups: ContactGroup[] = [
  {
    id: '1',
    name: 'VIP Clients',
    description: 'High-value customers requiring special attention',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    id: '2',
    name: 'Prospects',
    description: 'Potential customers in the sales pipeline',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];

export const contactGroupService = {
  getGroups: async (): Promise<ContactGroup[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return groups;
  },

  createGroup: async (data: Pick<ContactGroup, 'name' | 'description'>): Promise<ContactGroup> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newGroup: ContactGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    groups.push(newGroup);
    return newGroup;
  },

  updateGroup: async (id: string, data: Partial<ContactGroup>): Promise<ContactGroup> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = groups.findIndex(group => group.id === id);
    if (index === -1) throw new Error('Group not found');
    
    groups[index] = {
      ...groups[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return groups[index];
  },

  deleteGroup: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = groups.findIndex(group => group.id === id);
    if (index !== -1) {
      groups.splice(index, 1);
    }
  },

  assignContactsToGroup: async (groupId: string, contactIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real application, this would update the contacts in the database
  },

  removeContactsFromGroup: async (groupId: string, contactIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real application, this would update the contacts in the database
  },
};