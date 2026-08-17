export type SystemRole = "SUPER_ADMIN" | "STAFF" | "USER";
export type UserCategory = "STUDENT" | "LECTURER" | "LIBRARY_STAFF" | "PUBLIC";

export interface ApiUser {
  id: number;
  identification_number: string;
  email: string;
  full_name: string;
  role: SystemRole;
  category: UserCategory;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiSession {
  user: ApiUser | null;
}

export interface LoginResponse {
  user: ApiUser;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}
