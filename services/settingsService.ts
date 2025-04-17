import { SystemSettings } from '@/types';
import  httpClient  from '@/lib/httpClient';

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    try {
      // Authenticate and get tenant ID from context
      const response = await httpClient.get('/api/settings');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      throw error;
    }
  },

  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    try {
      const response = await httpClient.put('/api/settings', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },
};