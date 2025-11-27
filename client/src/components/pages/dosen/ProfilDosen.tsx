import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useAuthStore } from "../../../store/authStore";
import { Skeleton } from "../../ui/skeleton";
import {
  User as UserIcon,
  GraduationCap,
  BadgeCheck,
  Mail,
  Phone,
} from "lucide-react";

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
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Profil Dosen
        </h1>
        <p className="text-muted-foreground">
          Informasi data pribadi dan akademik
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <Card className="lg:col-span-1 border-0 shadow-lg shadow-gray-100/50 overflow-hidden h-fit">
          <div className="h-32 bg-gradient-to-br from-primary/80 to-indigo-600/80 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-primary">
                  {user.nama?.charAt(0) || "D"}
                </div>
              </div>
            </div>
          </div>
          <CardContent className="pt-16 pb-8 px-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">{user.nama}</h2>
            <p className="text-sm text-gray-500 mt-1">{user.role}</p>

            <div className="mt-6 flex justify-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                Aktif
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <UserIcon className="h-5 w-5 mr-2 text-primary" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lengkap
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {user.nama}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIDN
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {user.nidn || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-base text-gray-900">
                      {user.email || "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Telepon
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-base text-gray-900">
                      {user.no_hp || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                Informasi Akun & Akademik
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {user.username}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </p>
                  <p className="text-base font-semibold text-gray-900 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex gap-3">
                  <div className="p-2 bg-blue-100 rounded-full h-fit">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">
                      Perlu Bantuan?
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Untuk perubahan data pribadi yang tidak dapat diubah
                      sendiri, silakan hubungi bagian kepegawaian atau
                      administrator sistem.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
