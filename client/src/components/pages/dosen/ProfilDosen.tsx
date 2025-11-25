import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useAuthStore } from "../../../store/authStore";
import { Skeleton } from "../../ui/skeleton";
import { User, GraduationCap, BadgeCheck } from "lucide-react";

export const ProfilDosen: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil Dosen</h1>
        <p className="text-gray-600">Informasi data pribadi dan akademik</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {user.nama?.charAt(0) || "D"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nama Lengkap
                  </p>
                  <p className="text-xl font-semibold">{user.nama}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-gray-500">NIDN</p>
                  <p className="text-lg font-medium">{user.nidn || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-lg font-medium">{user.username}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic/Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Status Akun
                </p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    Aktif
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Untuk perubahan data pribadi, silakan hubungi administrator
                  sistem atau bagian kepegawaian.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
