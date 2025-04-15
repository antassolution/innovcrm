import { Activity } from '@/types';
import { activities } from './mockData';

export const activityService = {
  getActivities: async (): Promise<Activity[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return activities;
  },

  getActivitiesByCustomerId: async (customerId: string): Promise<Activity[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return activities.filter(activity => activity.customerId === customerId);
  },
};