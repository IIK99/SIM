import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { BookOpen, Calendar, Award, FileText } from "lucide-react";
import { useMahasiswaDashboard } from "../../hooks/useMahasiswaDashboard";
import { Skeleton } from "../ui/skeleton";
import { NotificationBanner } from "../ui/notification-banner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MahasiswaDashboard: React.FC = () => {
  const { data, loading } = useMahasiswaDashboard();
  const [showKRSNotif, setShowKRSNotif] = useState(true);
  const [showGradesNotif, setShowGradesNotif] = useState(true);
  const navigate = useNavigate();

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Mahasiswa
        </h1>
        <p className="text-gray-600">
          Selamat belajar! Semangat mengejar cita-cita
        </p>
      </div>

      {/* Notifications */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">IPK</p>
                <p className="text-2xl font-bold text-gray-900">{data.ipk}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SKS Diambil</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.total_sks}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mata Kuliah</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.total_matakuliah}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Semester</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.semester_berjalan}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Jadwal Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.jadwal_hari_ini.length > 0 ? (
                data.jadwal_hari_ini.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{schedule.mata_kuliah}</p>
                      <p className="text-sm text-gray-500">{schedule.ruang}</p>
                    </div>
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {schedule.waktu}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Tidak ada jadwal hari ini
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/mahasiswa/jadwal")}
            >
              Lihat Jadwal Lengkap
            </Button>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Nilai Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.nilai_terbaru.length > 0 ? (
                data.nilai_terbaru.map((grade, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{grade.mata_kuliah}</p>
                      <p className="text-sm text-gray-500">
                        Semester {grade.semester}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        grade.grade === "A"
                          ? "bg-green-100 text-green-800"
                          : grade.grade.includes("A")
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {grade.grade}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Belum ada nilai
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/mahasiswa/khs")}
            >
              Lihat Semua Nilai
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-16 flex flex-col"
              onClick={() => navigate("/mahasiswa/krs")}
            >
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-sm">Ambil KRS</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col"
              onClick={() => navigate("/mahasiswa/khs")}
            >
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-sm">Lihat KHS</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col"
              onClick={() => navigate("/mahasiswa/transkrip")}
            >
              <Award className="h-5 w-5 mb-1" />
              <span className="text-sm">Transkrip</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col"
              onClick={() => navigate("/mahasiswa/jadwal")}
            >
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-sm">Jadwal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
