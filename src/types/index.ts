export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: "customer" | "admin" | "super_admin";
  createdAt: Date;
  isActive?: boolean;
  assignedBranches?: string[]; // For admins - which branches they can manage
}

export interface Appointment {
  id: string;
  customerId: string;
  staffId: string;
  service: string;
  date: Date;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
}

export interface Queue {
  id: string;
  branchId: string;
  customers: QueueCustomer[];
  estimatedWaitTime: number;
  lastUpdated: Date;
}

export interface QueueCustomer {
  id: string;
  customerId: string;
  position: number;
  joinedAt: Date;
  status: "waiting" | "serving" | "completed";
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  staff: string[];
  operatingHours: {
    [key: string]: { open: string; close: string };
  };
}
