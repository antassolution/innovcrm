import { Company } from '@/types';

export const companyService = {
  getCompanies: async (): Promise<Company[]> => {
    const response = await fetch('/api/companies');
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    return response.json();
  },

  getCompanyById: async (id: string): Promise<Company | undefined> => {
    const companies = await companyService.getCompanies();
    return companies.find(company => company.id === id);
  },

  searchCompanies: async (query: string): Promise<Company[]> => {
    const companies = await companyService.getCompanies();
    const lowercaseQuery = query.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(lowercaseQuery) ||
      company.industry.toLowerCase().includes(lowercaseQuery)
    );
  }
};