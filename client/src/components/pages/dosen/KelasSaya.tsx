import React from "react";
import { useDosenDashboard } from "../../../hooks/useDosenDashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const KelasSaya: React.FC = () => {
  const { data, loading } = useDosenDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 h-full bg-gray-50/50">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Kelas Saya
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Kelola kelas dan penilaian mahasiswa semester ini
          </p>
        </div>
      </div>

      {!data?.kelas || data.kelas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum ada kelas
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Anda belum memiliki jadwal mengajar untuk semester ini. Silakan
              hubungi bagian akademik jika ini adalah kesalahan.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {data.kelas.map((kelas) => {
            const progress =
              kelas.total_mahasiswa > 0
                ? (kelas.sudah_dinilai / kelas.total_mahasiswa) * 100
                : 0;

            return (
              <Card
                key={kelas.id_kelas}
                className="group hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      {kelas.sks} SKS
                    </Badge>
                    <Badge
                      variant="outline"
                      className="font-mono text-xs text-gray-500"
                    >
                      SEMESTER {kelas.semester}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
                    {kelas.mata_kuliah}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                      <span className="font-medium">{kelas.tahun_ajaran}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <Users className="mr-2 h-4 w-4 text-indigo-500" />
                      <span className="font-medium">
                        {kelas.total_mahasiswa} Mahasiswa
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                        Sudah Dinilai
                      </span>
                      <span className="font-medium text-gray-900">
                        {kelas.sudah_dinilai} / {kelas.total_mahasiswa}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white group-hover:translate-y-[-2px] transition-transform"
                    onClick={() => navigate("/dosen/input-nilai")}
                  >
                    Input Nilai
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
