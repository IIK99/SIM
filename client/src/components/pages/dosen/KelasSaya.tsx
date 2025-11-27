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
    <div className="space-y-8 p-1">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Kelas Saya
          </h1>
          <p className="text-muted-foreground">
            Kelola kelas dan penilaian mahasiswa semester ini
          </p>
        </div>
      </div>

      {!data?.kelas || data.kelas.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
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
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg shadow-gray-100/50 overflow-hidden flex flex-col relative"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                <CardHeader className="pb-4 pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      {kelas.sks} SKS
                    </Badge>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] tracking-wider text-gray-500 uppercase"
                    >
                      SEMESTER {kelas.semester}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-primary transition-colors">
                    {kelas.mata_kuliah}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center text-xs font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Calendar className="mr-2 h-3.5 w-3.5 text-indigo-500" />
                      <span>{kelas.tahun_ajaran}</span>
                    </div>
                    <div className="flex items-center text-xs font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Users className="mr-2 h-3.5 w-3.5 text-indigo-500" />
                      <span>{kelas.total_mahasiswa} Mahasiswa</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 flex items-center font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                        Status Penilaian
                      </span>
                      <span className="font-bold text-gray-900">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5 bg-gray-100" />
                    <p className="text-[10px] text-right text-muted-foreground">
                      {kelas.sudah_dinilai} dari {kelas.total_mahasiswa}{" "}
                      mahasiswa dinilai
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6 px-6">
                  <Button
                    className="w-full bg-gray-900 hover:bg-primary text-white shadow-lg shadow-gray-200 group-hover:translate-y-[-2px] transition-all duration-300"
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
