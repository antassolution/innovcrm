import { z } from "zod";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  lastContact: string;
}

// Deal schema definition
export const dealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  value: z.number().min(0, "Value cannot be negative"),
  customerId: z.string().min(1, "Customer is required"),
  stageId: z.string().min(1, "Pipeline stage is required"),
  probability: z.number().min(0, "Minimum is 0%").max(100, "Maximum is 100%"),
  expectedCloseDate: z.string().min(1, "Expected close date is required"),
  notes: z.string().optional(),
  assignedTo: z.string().min(1, "Deal must be assigned to a user"),
  status: z.enum(["active", "won", "lost"]),
  lostReason: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  nextActionDate: z.string().optional(),
  nextActionDescription: z.string().optional(),
});

// Deal type based on the schema and MongoDB structure
export interface Deal {
  _id: string;
  title: string;
  value: number;
  customerId: string;
  stageId: string;
  probability: number;
  expectedCloseDate: string;
  notes?: string;
  assignedTo: string;
  status: 'active' | 'won' | 'lost';
  lostReason?: string;
  lastContactDate?: string;
  nextActionDate?: string;
  nextActionDescription?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated fields
  customer?: any;
  stage?: any;
  assignedUser?: any;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  description: string;
  customerId: string;
  dealId?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface Contact {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  companyId: string;
  position: string;
  department?: string;
  category: 'lead' | 'prospect' | 'customer' | 'partner';
  status: 'active' | 'inactive';
  lastContact: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  tags: string[];
  groups: string[];
  assignedTo?: string;
}

export interface Lead {
  _id:string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  score: 'hot' | 'warm' | 'cold';
  assignedTo?: string | { id: string; firstName: string; lastName: string };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactNote {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  address: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ContactHistory {
  id: string;
  contactId: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  title: string;
  description: string;
  date: string;
  createdAt: string;
}

export type SortField = 'name' | 'company' | 'lastContact' | 'category';
export type SortOrder = 'asc' | 'desc';

export interface ContactFilters {
  search: string;
  category: string;
  tags: string[];
  groups: string[];
  assignedTo?: string;
  page?: number; // Added for pagination
  limit?: number; // Added for pagination
}

export const leadSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  company: z.string().min(2, "Company name is required"),
  source: z.string().min(1, "Lead source is required"),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  score: z.enum(['hot', 'warm', 'cold']),
  assignedTo: z.any().optional(),
  notes: z.string().optional(),
});

export interface User {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'sales-mgr' | 'sales-rep' | 'user';
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface MasterData {
  _id: string;
  id: string;
  category: string;
  name: string;
  value: string;
  displayOrder?: number;
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export const masterDataSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  displayOrder: z.number().optional(),
  isActive: z.boolean().default(true),
});

export interface SystemSettings {
  currency: string;
  dateFormat: string;
  timeZone: string;
  companyInfo: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    website?: string;
    email?: string;
  };
  salesSettings: {
    defaultSalesTax: number;
    fiscalYearStart: string;
  };
  emailSettings: {
    smtpServer?: string;
    smtpPort?: number;
    smtpUsername?: string;
    smtpPassword?: string;
    fromEmail?: string;
    emailSignature?: string;
  };
  emailNotifications: {
    newLeads: boolean;
    dealUpdates: boolean;
    taskReminders: boolean;
    dailyDigest: boolean;
  };
}

export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  role: z.enum(['admin', 'sales-mgr', 'sales-rep', 'user']),
  status: z.enum(['active', 'disabled']),
});

export const systemSettingsSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  timeZone: z.string().min(1, "Time zone is required"),
  companyInfo: z.object({
    name: z.string().min(1, "Company name is required"),
    logo: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    email: z.string().email().optional(),
  }),
  salesSettings: z.object({
    defaultSalesTax: z.number().min(0).max(100),
    fiscalYearStart: z.string(),
  }),
  emailSettings: z.object({
    smtpServer: z.string().optional(),
    smtpPort: z.number().optional(),
    smtpUsername: z.string().optional(),
    smtpPassword: z.string().optional(),
    fromEmail: z.string().email().optional(),
    emailSignature: z.string().optional(),
  }),
  emailNotifications: z.object({
    newLeads: z.boolean(),
    dealUpdates: z.boolean(),
    taskReminders: z.boolean(),
    dailyDigest: z.boolean(),
  }),
});

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}