import { api } from "../services/api";
import type { LoginData, AuthResponse } from "../types/auth";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log("🔄 Sending login request to:", "/auth/login");
      const response = await api.post<AuthResponse>("/auth/login", data);
      console.log("✅ Login API response:", response);
      return response.data;
    } catch (error) {
      console.error("❌ Login API error:", error);
      throw error;
    }
  },

  getProfile: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get<AuthResponse>("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Profile API error:", error);
      throw error;
    }
  },
};
