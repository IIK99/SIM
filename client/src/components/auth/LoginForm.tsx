import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Loader2, Lock, User } from "lucide-react";
import { useToast } from "../../hooks/useToast";

const loginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
      });
    } catch (error: unknown) {
      console.error("Login error:", error);

      let errorMessage = "Terjadi kesalahan saat login";

      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse delay-1000" />

      <Card className="w-full max-w-md mx-4 glass border-0 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            SIAKAD
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            Sistem Informasi Akademik Terpadu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  className="pl-10 h-11 bg-white/50 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                  {...register("username")}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="pl-10 h-11 bg-white/50 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                  {...register("password")}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          {/* Demo Accounts Info */}
          <div className="mt-8 p-4 bg-gray-50/80 rounded-xl border border-gray-100 backdrop-blur-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Akun Demo Tersedia
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                <span className="font-medium text-gray-700">Admin</span>
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                  admin / 123456
                </code>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                <span className="font-medium text-gray-700">Dosen</span>
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                  rinwaguri / 123456
                </code>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                <span className="font-medium text-gray-700">Mahasiswa</span>
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                  ikmal / 123456
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SIAKAD System. All rights reserved.
      </div>
    </div>
  );
};
