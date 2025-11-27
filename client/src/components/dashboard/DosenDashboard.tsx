import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  BookOpen,
  Users,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useDosenDashboard } from "../../hooks/useDosenDashboard";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router-dom";

export const DosenDashboard: React.FC = () => {
  const { data, loading } = useDosenDashboard();
  const navigate = useNavigate();

  if (loading || !data) {
    return (
      <div className="space-y-8 p-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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

  const stats = [
    {
      title: "Kelas Diajar",
      value: data.stats.total_kelas,
      icon: BookOpen,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Mahasiswa",
      value: data.stats.total_mahasiswa,
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Nilai Perlu Input",
      value: data.stats.perlu_nilai,
      icon: FileText,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Dosen
        </h1>
        <p className="text-muted-foreground">
          Kelola pengajaran dan nilai mahasiswa
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    Semester Ini
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden h-full">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Jadwal Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.jadwal_hari_ini.length > 0 ? (
                data.jadwal_hari_ini.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {schedule.waktu.split(" - ")[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {schedule.mata_kuliah}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Semester {schedule.kelas_semester}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                      {schedule.waktu}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    Tidak ada jadwal hari ini
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Nikmati waktu istirahat Anda
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden h-full">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg font-semibold">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Kelas Saya
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={() => navigate("/dosen/kelas")}
              >
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.kelas.length > 0 ? (
                data.kelas.slice(0, 3).map((classItem, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {classItem.mata_kuliah}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Semester {classItem.semester} • {classItem.tahun_ajaran}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {classItem.total_mahasiswa} Mahasiswa
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/5 p-0"
                        onClick={() => navigate("/dosen/input-nilai")}
                      >
                        Input Nilai <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    Belum ada kelas yang diajar
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
