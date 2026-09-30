export type Role = { id: number; name: string; description: string | null };

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  staffId: string;
  phone: string | null;
  position: string | null;
  isActive: boolean;
  role?: Role;
  updatesCount?: number;
  lastLoginAt: string | null;
  can?: { update: boolean; toggleStatus: boolean };
};

export type MemberInput = {
  name: string;
  email: string;
  staff_id: string;
  phone: string | null;
  position: string | null;
  role_id: number;
  password?: string;
  password_confirmation?: string;
};

export type ListQuery = { search: string; status: string; page: number; perPage: number };
