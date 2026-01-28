export interface Organization {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  logo?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  settings: {
    timezone: string;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    language: string;
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'suspended' | 'cancelled';
    maxUsers: number;
    maxBranches: number;
    trialEndsAt?: any;
    renewsAt?: any;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  features: {
    appointments: boolean;
    queueManagement: boolean;
    smsReminders: boolean;
    emailReminders: boolean;
    reports: boolean;
    multiBranch: boolean;
    customBranding: boolean;
    apiAccess: boolean;
  };
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
  createdBy: string;
}

export interface CreateOrganizationData {
  name: string;
  displayName: string;
  description?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
}

export interface UpdateOrganizationData extends Partial<CreateOrganizationData> {
  settings?: Partial<Organization['settings']>;
  branding?: Partial<Organization['branding']>;
  features?: Partial<Organization['features']>;
}
