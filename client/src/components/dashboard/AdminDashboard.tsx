import { Card, CardContent } from "../ui/card";
import { Users, BookOpen, GraduationCap, Settings } from "lucide-react";
import { useMahasiswa } from "../../hooks/useMahasiswa";
import { useDosen } from "../../hooks/useDosen";
import { useMataKuliah } from "../../hooks/useMataKuliah";
import { useKelas } from "../../hooks/useKelas";
import { Skeleton } from "../ui/skeleton";

export const AdminDashboard: React.FC = () => {
  const { data: mahasiswaData, loading: loadingMahasiswa } = useMahasiswa();
  const { data: dosenData, loading: loadingDosen } = useDosen();
  const { data: matkulData, loading: loadingMatkul } = useMataKuliah();
  const { data: kelasData, loading: loadingKelas } = useKelas();

  const stats = [
    {
      title: "Total Mahasiswa",
      value: loadingMahasiswa ? "..." : mahasiswaData.length.toString(),
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Dosen",
      value: loadingDosen ? "..." : dosenData.length.toString(),
      icon: GraduationCap,
      color: "green",
    },
    {
      title: "Mata Kuliah",
      value: loadingMatkul ? "..." : matkulData.length.toString(),
      icon: BookOpen,
      color: "orange",
    },
    {
      title: "Kelas Aktif",
      value: loadingKelas ? "..." : kelasData.length.toString(),
      icon: Settings,
      color: "purple",
    },
  ];

  if (loadingMahasiswa || loadingDosen || loadingMatkul || loadingKelas) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">
          Selamat datang di Sistem Administrasi Akademik
        </p>
      </div>

      {/* Statistics Cards dengan real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <IconComponent
                      className={`h-6 w-6 text-${stat.color}-600`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ... rest of the dashboard content */}
    </div>
  );
};
