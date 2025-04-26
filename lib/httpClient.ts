// filepath: /Users/rafeeq/Projects/innovzone/innovcrm/services/httpClient.ts
import axios from "axios";

// Create an Axios instance
const httpClient = axios.create();

// Add a request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Get the auth token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const tenantId = localStorage.getItem("tenantId"); // Read tenantId from local storage
    if (!config.url?.startsWith("/api/auth")) {
      if (tenantId && config.url?.startsWith("/api/")) {
        // Replace the URL to include the tenantId
        config.url = `/api/${tenantId}${config.url.replace("/api", "")}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
