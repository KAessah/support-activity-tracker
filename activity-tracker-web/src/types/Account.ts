export type AuthUser = {
  id: number;
  name: string;
  email: string;
  staffId: string;
  phone: string | null;
  position: string | null;
  role: string;
  permissions: string[];
};
