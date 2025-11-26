import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  BookOpen,
  Calendar,
  Award,
  FileText,
  Clock,
  ArrowRight,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { useMahasiswaDashboard } from "../../hooks/useMahasiswaDashboard";
import { Skeleton } from "../ui/skeleton";
import { NotificationBanner } from "../ui/notification-banner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

export const MahasiswaDashboard: React.FC = () => {
  const { data, loading } = useMahasiswaDashboard();
  const [showKRSNotif, setShowKRSNotif] = useState(true);
  const [showGradesNotif, setShowGradesNotif] = useState(true);
  const navigate = useNavigate();

  if (loading || !data) {
    return (
      <div className="space-y-6 p-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 h-full bg-gray-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard Mahasiswa
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Selamat datang kembali, semangat belajar hari ini!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">
            Semester {data.semester_berjalan} • T.A. 2024/2025
          </span>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {showKRSNotif && (
          <NotificationBanner
            type="info"
            title="Periode KRS Dibuka"
            message="Pengisian KRS untuk semester genap 2024/2025 telah dibuka. Segera lengkapi KRS Anda sebelum batas waktu."
            onDismiss={() => setShowKRSNotif(false)}
          />
        )}

        {showGradesNotif && data.nilai_terbaru.length > 0 && (
          <NotificationBanner
            type="success"
            title="Nilai Baru Tersedia"
            message={`Anda memiliki ${data.nilai_terbaru.length} nilai baru yang telah diinput oleh dosen. Lihat di bagian Nilai Terbaru.`}
            onDismiss={() => setShowGradesNotif(false)}
          />
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Indeks Prestasi Kumulatif
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {data.ipk}
                  </h3>
                  <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Top 10%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total SKS Diambil
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {data.total_sks}
                  </h3>
                  <span className="text-sm text-gray-500">SKS</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Mata Kuliah
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {data.total_matakuliah}
                  </h3>
                  <span className="text-sm text-gray-500">MK</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Semester Berjalan
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {data.semester_berjalan}
                  </h3>
                  <span className="text-sm text-gray-500">Genap</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Schedule & Grades) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Jadwal Hari Ini
                </CardTitle>
                <CardDescription>
                  Anda memiliki {data.jadwal_hari_ini.length} jadwal kuliah hari
                  ini
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                onClick={() => navigate("/mahasiswa/jadwal")}
              >
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {data.jadwal_hari_ini.length > 0 ? (
                  data.jadwal_hari_ini.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 rounded-lg text-indigo-700 font-bold border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                          <span className="text-xs uppercase">Ruang</span>
                          <span className="text-lg">
                            {schedule.ruang.replace("R.", "")}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {schedule.mata_kuliah}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{schedule.waktu} WIB</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-3 sm:mt-0 w-fit bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-700"
                      >
                        Wajib
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-dashed">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">
                      Tidak ada jadwal kuliah
                    </p>
                    <p className="text-sm text-gray-500">
                      Nikmati waktu luang Anda hari ini!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Nilai Terbaru
                </CardTitle>
                <CardDescription>
                  Update nilai dari semester ini
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => navigate("/mahasiswa/khs")}
              >
                Lihat KHS <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y">
                {data.nilai_terbaru.length > 0 ? (
                  data.nilai_terbaru.map((grade, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 hover:bg-gray-50 px-2 rounded-lg transition-colors -mx-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {grade.mata_kuliah}
                          </p>
                          <p className="text-xs text-gray-500">
                            Semester {grade.semester}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-500">Nilai Akhir</p>
                          <p className="font-mono font-medium text-gray-900">
                            85.50
                          </p>
                        </div>
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg border ${
                            grade.grade === "A"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : grade.grade.includes("B")
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {grade.grade}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Belum ada nilai yang dipublikasikan
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">Status Akademik</h3>
              <p className="text-indigo-100 text-sm mb-6">
                Anda berstatus <strong>Aktif</strong> pada semester ini.
                Pastikan untuk menyelesaikan administrasi sebelum UTS.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-xs text-indigo-200">Batas SKS</p>
                  <p className="text-xl font-bold">24</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-xs text-indigo-200">Dosen Wali</p>
                  <p className="text-sm font-medium truncate">
                    Dr. Budi Santoso
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Akses Cepat</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                onClick={() => navigate("/mahasiswa/krs")}
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-xs font-medium">Ambil KRS</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                onClick={() => navigate("/mahasiswa/khs")}
              >
                <FileText className="h-6 w-6" />
                <span className="text-xs font-medium">Lihat KHS</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all"
                onClick={() => navigate("/mahasiswa/transkrip")}
              >
                <Award className="h-6 w-6" />
                <span className="text-xs font-medium">Transkrip</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
                onClick={() => navigate("/mahasiswa/jadwal")}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs font-medium">Jadwal</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
