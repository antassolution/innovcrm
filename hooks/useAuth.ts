import { useState } from "react";
import { authService } from "@/services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: { name: string; email: string; password: string; companyName: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      if(response?.tenantId){
        localStorage.setItem('tenantId', response?.tenantId);
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, login, loading, error };
}