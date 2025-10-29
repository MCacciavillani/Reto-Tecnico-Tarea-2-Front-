export enum Status {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
}

export enum Role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
  SUPPORT = "SUPPORT",
}

export type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  messageCount: number;
  role: Role;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  messageLimit: number;
  price: number;
  type: string;
  duration: number;
  status: Status;
  companies: Company[];
};

export type PlanHistories = {
  id: string;
  plan: Plan;
  startDate: string;
  endDate: string;
  status: Status;
};

export type Company = {
  id: string;
  name: string;
  description: string;
  planId?: string;
  plan?: Plan;
  planHistory: PlanHistories[];
  availableMessages: number;
  users: User[];
};
