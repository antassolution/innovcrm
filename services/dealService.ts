import { Deal, PaginatedResult } from '@/types';
import httpClient from '@/lib/httpClient';


/**
 * Service for interacting with the deal-related API endpoints
 */
export const dealService = {
  /**
   * Fetch all deals with optional filtering
   */
  async getDeals(filters: Record<string, any> = {}, page = 1, limit = 10): Promise<PaginatedResult<Deal>> {
    console.log('Fetching deals with filters:', filters, 'Page:', page, 'Limit:', limit);
    const queryParams = new URLSearchParams({
      ...filters,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await httpClient.get(`/api/deals?${queryParams}`);
    return response.data;
  },
  
  /**
   * Fetch a specific deal by ID
   */
  async getDealById(id: string): Promise<Deal> {
    const response = await httpClient.get(`/api/deals/${id}`);
    return response.data.data;
  },
  
  /**
   * Create a new deal
   */
  async createDeal(dealData: Partial<Deal>): Promise<Deal> {
    const response = await httpClient.post('/api/deals', dealData);
    return response.data.data;
  },
  
  /**
   * Update an existing deal by ID
   */
  async updateDeal(id: string, dealData: Partial<Deal>): Promise<Deal> {
    const response = await httpClient.patch(`/api/deals/${id}`, dealData);
    return response.data.data;
  },
  
  /**
   * Delete a deal by ID
   */
  async deleteDeal(id: string): Promise<void> {
    await httpClient.delete(`/api/deals/${id}`);
  },
  
  /**
   * Get deals by customer ID
   */
  async getDealsByCustomer(customerId: string): Promise<Deal[]> {
    const response = await httpClient.get(`/api/deals?customerId=${customerId}`);
    return response.data.data;
  },
   
  /**
   * Get deals assigned to a specific user
   */
  async getDealsByAssignee(userId: string): Promise<Deal[]> {
    const response = await httpClient.get(`/api/deals?assignedTo=${userId}`);
    return response.data.data;
  },
  
  /**
   * Get deals by status (active, won, lost)
   */
  async getDealsByStatus(status: 'active' | 'won' | 'lost'): Promise<Deal[]> {
    const response = await httpClient.get(`/api/deals?status=${status}`);
    return response.data.data;
  },

  /**
   * Get forecast data for deals
   */
  async getForecast() {
    try {
      const response = await httpClient.get('/api/deals/forecast');
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }
};