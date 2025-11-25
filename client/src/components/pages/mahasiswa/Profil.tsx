import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useAuthStore } from "../../../store/authStore";
import { Skeleton } from "../../ui/skeleton";
import { User } from "lucide-react";

export const Profil: React.FC = () => {
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
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil Mahasiswa</h1>
        <p className="text-gray-600">Informasi data pribadi dan akademik</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Nama Lengkap
                </p>
                <p className="text-lg font-semibold">{user.nama}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">NIM</p>
                <p className="text-lg">{user.nim}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Username</p>
                <p className="text-lg">{user.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akademik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Program Studi
                </p>
                <p className="text-lg font-semibold">{user.prodi}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Angkatan</p>
                <p className="text-lg">{user.angkatan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Role</p>
                <p className="text-lg capitalize">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
