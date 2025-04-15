import { SystemSettings } from '@/types';

// Mock data for settings
let settings: SystemSettings = {
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeZone: 'America/New_York',
  emailNotifications: {
    newLeads: true,
    dealUpdates: true,
    taskReminders: true,
    dailyDigest: false,
  },
};

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return settings;
  },

  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    settings = {
      ...settings,
      ...data,
    };
    return settings;
  },
};