import { Card, CardContent } from "../ui/card";
import {
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  TrendingUp,
} from "lucide-react";
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
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Dosen",
      value: loadingDosen ? "..." : dosenData.length.toString(),
      icon: GraduationCap,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Mata Kuliah",
      value: loadingMatkul ? "..." : matkulData.length.toString(),
      icon: BookOpen,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "Kelas Aktif",
      value: loadingKelas ? "..." : kelasData.length.toString(),
      icon: Settings,
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  if (loadingMahasiswa || loadingDosen || loadingMatkul || loadingKelas) {
    return (
      <div className="space-y-8 p-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Selamat datang kembali di Sistem Administrasi Akademik
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="border-0 shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden relative group"
            >
              <div
                className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}
              >
                <IconComponent className={`w-24 h-24 ${stat.text}`} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <IconComponent className={`h-6 w-6 ${stat.text}`} />
                  </div>
                  <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {stat.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions or Charts could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg shadow-gray-100">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Update Data Mahasiswa
                    </p>
                    <p className="text-xs text-gray-500">2 jam yang lalu</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-gray-100 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold mb-2">SIAKAD Pro</h3>
              <p className="text-blue-100 mb-6">
                Kelola data akademik dengan lebih mudah dan efisien menggunakan
                fitur terbaru kami.
              </p>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm w-fit hover:bg-blue-50 transition-colors">
              Pelajari Lebih Lanjut
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
