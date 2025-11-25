import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { BookOpen, Users, Clock, FileText } from "lucide-react";
import { useDosenDashboard } from "../../hooks/useDosenDashboard";
import { Skeleton } from "../ui/skeleton";

import { useNavigate } from "react-router-dom";

export const DosenDashboard: React.FC = () => {
  const { data, loading } = useDosenDashboard();
  const navigate = useNavigate();

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Dosen</h1>
        <p className="text-gray-600">Kelola pengajaran dan nilai mahasiswa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Kelas Diajar
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.stats.total_kelas}
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
                <p className="text-sm font-medium text-gray-600">
                  Total Mahasiswa
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.stats.total_mahasiswa}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Nilai Perlu Input
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.stats.perlu_nilai}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
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
                      <p className="text-sm text-gray-500">
                        Semester {schedule.kelas_semester}
                      </p>
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
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Kelas Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.kelas.length > 0 ? (
                data.kelas.map((classItem, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{classItem.mata_kuliah}</p>
                      <p className="text-sm text-gray-500">
                        Semester {classItem.semester} • {classItem.tahun_ajaran}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {classItem.total_mahasiswa} mahasiswa
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={() => navigate("/dosen/input-nilai")}
                      >
                        Input Nilai
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
                  <p className="text-sm text-gray-400 mt-1">
                    Hubungi admin untuk assignment kelas
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
