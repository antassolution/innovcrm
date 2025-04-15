import { Customer } from '@/types';
import { customers } from './mockData';

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return customers;
  },

  getCustomerById: async (id: string): Promise<Customer | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return customers.find(customer => customer.id === id);
  },
};