import { http } from "@/lib/api-client";
import type { ApiSession, LoginPayload, LoginResponse, RefreshTokenPayload } from "../types/api";

export const authApi = {
  profile() {
    return http.get<ApiSession>("/auth/profile");
  },
  login(payload: LoginPayload) {
    return http.post<LoginResponse>("/auth/login", payload);
  },
  logout(refreshToken?: string) {
    const body: RefreshTokenPayload | undefined = refreshToken ? { refreshToken } : undefined;
    return http.post<{ success: boolean }>("/auth/logout", body);
  },
};