import { MasterData, PaginatedResult } from "@/types";
import httpClient from "@/lib/httpClient";

export const masterDataService = {
  getMasterDataByCategory: async (category: string): Promise<MasterData[]> => {
    try {
      const response = await httpClient.get(`/api/master-data?category=${category}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching master data:", error);
      return [];
    }
  },

  getAllMasterData: async (page = 1, limit = 20, filter?: string): Promise<PaginatedResult<MasterData>> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (filter) {
        queryParams.append('filter', filter);
      }
      
      const response = await httpClient.get(`/api/master-data?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all master data:", error);
      return { data: [], pagination: { page, limit, totalPages: 0, totalItems: 0 } };
    }
  },

  createMasterData: async (data: Omit<MasterData, 'id' | 'createdAt' | 'updatedAt'>): Promise<MasterData> => {
    const response = await httpClient.post('/api/master-data', data);
    return response.data;
  },

  updateMasterData: async (id: string, data: Partial<MasterData>): Promise<MasterData> => {
    const response = await httpClient.put(`/api/master-data/${id}`, data);
    return response.data;
  },

  deleteMasterData: async (id: string): Promise<void> => {
    await httpClient.delete(`/api/master-data/${id}`);
  },
};