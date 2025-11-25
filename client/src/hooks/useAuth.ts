import { useAuthStore } from "../store/authStore";
import { authService } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "./useToast";

export const useAuth = () => {
  const { login: storeLogin, logout: storeLogout, user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    try {
      console.log("🔐 Login attempt:", username);

      const response = await authService.login({ username, password });
      console.log("✅ Login success:", response);

      // Validasi response structure
      if (!response.user || !response.token) {
        throw new Error("Invalid response from server");
      }

      if (!response.user.role) {
        throw new Error("User role missing in response");
      }

      storeLogin(response.user, response.token);

      // Debug redirect
      console.log("🔄 Redirecting to:", response.user.role);

      // Show success toast
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${response.user.nama || username}!`,
      });

      switch (response.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "dosen":
          navigate("/dosen");
          break;
        case "mahasiswa":
          navigate("/mahasiswa");
          break;
        default:
          console.warn("Unknown role, redirecting to /");
          navigate("/");
      }
    } catch (error: unknown) {
      console.error("❌ Login failed:", error);

      // Detailed error analysis dengan type safety
      if (typeof error === "object" && error !== null) {
        // Type guard untuk axios error
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string };
          };
          request?: unknown;
          message?: string;
        };

        if (axiosError.response) {
          console.error(
            "Response error:",
            axiosError.response.status,
            axiosError.response.data
          );
        } else if (axiosError.request) {
          console.error("No response received:", axiosError.request);
        } else if (axiosError.message) {
          console.error("Error setting up request:", axiosError.message);
        }
      }

      // Get error message dengan type safety
      let errorMessage = "Login gagal";
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Login gagal",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  };

  const logout = () => {
    storeLogout();
    navigate("/login");
    toast({
      title: "Logout berhasil",
      description: "Sampai jumpa kembali!",
    });
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
