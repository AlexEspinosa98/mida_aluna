export type UserRole = "medico" | "superadmin";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: UserRole;
  is_active: boolean;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: UserRole;
}

export interface UpdateUserPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  rol?: UserRole;
  is_active?: boolean;
}
