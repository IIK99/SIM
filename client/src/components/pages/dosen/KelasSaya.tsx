import React from "react";
import { useDosenDashboard } from "../../../hooks/useDosenDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BookOpen, Users, Calendar, GraduationCap } from "lucide-react";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";

export const KelasSaya: React.FC = () => {
  const { data, loading } = useDosenDashboard();
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-8 text-center">Memuat data kelas...</div>;
  }

  return (
    <div className="space-y-6 p-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelas Saya</h1>
          <p className="text-muted-foreground">
            Daftar kelas yang Anda ajar semester ini
          </p>
        </div>
      </div>

      {!data?.kelas || data.kelas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Belum ada kelas yang diajar
            </p>
            <p className="text-gray-500">
              Hubungi admin akademik untuk assignment kelas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.kelas.map((kelas) => (
            <Card
              key={kelas.id_kelas}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-primary">
                    {kelas.mata_kuliah}
                  </CardTitle>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    {kelas.sks} SKS
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Semester {kelas.semester}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>T.A. {kelas.tahun_ajaran}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{kelas.total_mahasiswa} Mahasiswa</span>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full"
                      onClick={() => navigate("/dosen/input-nilai")}
                    >
                      Input Nilai
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
