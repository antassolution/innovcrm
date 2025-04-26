import httpClient from '@/lib/httpClient';

export const createCheckoutSession = async (plan: string) => {
  try {
    const response = await httpClient.post('/api/subscriptions/checkout', { plan });
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const validateSession = async (sessionId: string) => {
  try {
    const response = await httpClient.post(`/api/subscriptions/status?session_id=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error validating session:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const response = await httpClient.get(`/api/subscriptions/status`);
    return response.data?.paymentStatus;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};