import axios from 'axios';

export const authService = {
  async register({ name, email, password, companyName }: { name: string; email: string; password: string; companyName: string }) {
    try {
      const response = await axios.post('/api/auth', {
        action: 'register',
        name,
        email,
        password,
        companyName,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed.');
    }
  },

  async login({ email, password }: { email: string; password: string }) {
    try {
        console.log('Logging in with:', { email, password });
      const response = await axios.post('/api/auth', {
        action: 'login',
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed.');
    }
  },
};