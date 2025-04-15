import { Deal } from '@/types';

// Mock data for deals
let deals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    value: 50000,
    customerId: '1',
    status: 'negotiation',
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: '2024-04-15',
    notes: 'Final contract review in progress',
    assignedTo: 'user1',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    title: 'Consulting Services',
    value: 25000,
    customerId: '2',
    status: 'proposal',
    stage: 'proposal',
    probability: 50,
    expectedCloseDate: '2024-04-30',
    notes: 'Proposal submitted, awaiting feedback',
    assignedTo: 'user2',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-18',
  },
];

export const dealService = {
  getDeals: async (): Promise<Deal[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return deals;
  },

  getDealById: async (id: string): Promise<Deal | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return deals.find(deal => deal.id === id);
  },

  createDeal: async (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDeal: Deal = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    deals.push(newDeal);
    return newDeal;
  },

  updateDeal: async (id: string, data: Partial<Deal>): Promise<Deal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = deals.findIndex(deal => deal.id === id);
    if (index === -1) throw new Error('Deal not found');
    
    deals[index] = {
      ...deals[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return deals[index];
  },

  deleteDeal: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    deals = deals.filter(deal => deal.id !== id);
  },

  getDealsByStatus: async (status: Deal['status']): Promise<Deal[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return deals.filter(deal => deal.status === status);
  },

  getForecast: async (): Promise<{ 
    totalValue: number;
    weightedValue: number;
    byStage: { stage: string; count: number; value: number }[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
    
    const byStage = Object.entries(
      deals.reduce((acc, deal) => {
        if (!acc[deal.stage]) {
          acc[deal.stage] = { count: 0, value: 0 };
        }
        acc[deal.stage].count++;
        acc[deal.stage].value += deal.value;
        return acc;
      }, {} as Record<string, { count: number; value: number }>)
    ).map(([stage, data]) => ({
      stage,
      ...data,
    }));

    return {
      totalValue,
      weightedValue,
      byStage,
    };
  },
};