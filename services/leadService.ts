import { Lead } from '@/types';

// Mock data for leads
let leads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    company: 'Tech Corp',
    source: 'Website',
    status: 'new',
    score: 'hot',
    assignedTo: 'user1',
    notes: 'Interested in enterprise solution',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const leadService = {
  getLeads: async (): Promise<Lead[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return leads;
  },

  getLeadById: async (id: string): Promise<Lead | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return leads.find(lead => lead.id === id);
  },

  createLead: async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    leads.push(newLead);
    return newLead;
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = leads.findIndex(lead => lead.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    leads[index] = {
      ...leads[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return leads[index];
  },

  deleteLead: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    leads = leads.filter(lead => lead.id !== id);
  },

  convertToOpportunity: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real application, this would create a new opportunity
    // and update the lead status
    const lead = leads.find(l => l.id === id);
    if (lead) {
      lead.status = 'qualified';
      lead.updatedAt = new Date().toISOString();
    }
  },
};