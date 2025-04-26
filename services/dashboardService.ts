import httpClient from "@/lib/httpClient";

export const getDashboardData = async () => {
  try {
    const response = await httpClient.get(`/api/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data from API", error);
    throw error;
  }
};