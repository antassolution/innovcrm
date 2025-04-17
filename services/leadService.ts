import { Lead, PaginatedResult } from '@/types';
import  httpClient from '@/lib/httpClient';

export const leadService = {
  getLeads: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResult<Lead>> => {
    try {
      const response = await httpClient.get('/api/leads', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  getLeadById: async (id: string): Promise<Lead | undefined> => {
    try {
      const response = await httpClient.get(`/api/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error);
      throw error;
    }
  },

  createLead: async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    try {
      const response = await httpClient.post('/api/leads', data);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    try {
      const response = await httpClient.put(`/api/leads/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
      throw error;
    }
  },

  deleteLead: async (id: string): Promise<void> => {
    try {
      await httpClient.delete(`/api/leads/${id}`);
    } catch (error) {
      console.error(`Error deleting lead ${id}:`, error);
      throw error;
    }
  },

  convertToOpportunity: async (id: string): Promise<void> => {
    try {
      // First, get the lead data
      const lead = await leadService.getLeadById(id);
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      // Update the lead status to qualified
      await leadService.updateLead(id, { status: 'qualified' });
      
      // In a real application, this would also create a new opportunity
      // based on the lead data and potentially connect to a deals API
    } catch (error) {
      console.error(`Error converting lead ${id} to opportunity:`, error);
      throw error;
    }
  },
  
  assignLeads: async (leadIds: string[], assignedTo: string): Promise<void> => {
    try {
      // For multiple leads, we make parallel requests to update each one
      const updatePromises = leadIds.map(id => 
        leadService.updateLead(id, { assignedTo })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error assigning leads:', error);
      throw error;
    }
  }
};