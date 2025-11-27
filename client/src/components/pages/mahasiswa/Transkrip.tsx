import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { useTranskrip } from "../../../hooks/useTranskrip";
import { Skeleton } from "../../ui/skeleton";
import { Award, BookOpen, User } from "lucide-react";

export const Transkrip: React.FC = () => {
  const { data, loading } = useTranskrip();

  const getGradeColor = (huruf: string) => {
    switch (huruf) {
      case "A":
        return "bg-green-100 text-green-800 border-green-200";
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "D":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "E":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPredikat = (ipk: number) => {
    if (ipk >= 3.5)
      return {
        text: "Cum Laude",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    if (ipk >= 3.0)
      return {
        text: "Sangat Memuaskan",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    if (ipk >= 2.5)
      return {
        text: "Memuaskan",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    if (ipk >= 2.0)
      return {
        text: "Cukup",
        color: "bg-orange-100 text-orange-800 border-orange-200",
      };
    return { text: "Kurang", color: "bg-red-100 text-red-800 border-red-200" };
  };

  if (loading || !data) {
    return (
      <div className="space-y-8 p-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const predikat = getPredikat(data.ipk);

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Transkrip Akademik
        </h1>
        <p className="text-muted-foreground">
          Ringkasan prestasi akademik lengkap
        </p>
      </div>

      {/* Student Info & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center text-lg font-bold">
              <User className="h-5 w-5 mr-2 text-primary" />
              Informasi Mahasiswa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </p>
                <p className="font-bold text-lg text-gray-900">
                  {data.identitas.nama}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIM
                  </p>
                  <p className="font-semibold text-gray-900">
                    {data.identitas.nim}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Angkatan
                  </p>
                  <p className="font-semibold text-gray-900">
                    {data.identitas.angkatan}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program Studi
                </p>
                <p className="font-semibold text-gray-900">
                  {data.identitas.prodi}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-gray-100/50 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center text-lg font-bold">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Ringkasan Prestasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-blue-100">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Indeks Prestasi Kumulatif
                  </p>
                  <p className="text-4xl font-bold text-primary mt-1">
                    {data.ipk.toFixed(2)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`${predikat.color} px-3 py-1 text-sm font-semibold`}
                >
                  {predikat.text}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total SKS
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {data.total_sks}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {data.total_semester}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transkrip per Semester */}
      <div className="space-y-6">
        {data.transkrip.map((semester) => (
          <Card
            key={semester.semester}
            className="border-0 shadow-lg shadow-gray-100/50 overflow-hidden"
          >
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      Semester {semester.semester}
                    </CardTitle>
                    <CardDescription>{semester.tahun_ajaran}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-white border border-gray-200 text-gray-700"
                  >
                    {semester.total_sks} SKS
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 border border-blue-100 text-blue-700"
                  >
                    IPS: {semester.ips.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-none border-0">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="font-semibold">Kode MK</TableHead>
                      <TableHead className="font-semibold">
                        Nama Mata Kuliah
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        SKS
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Nilai Angka
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Nilai Huruf
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Bobot
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semester.mata_kuliah.map((mk, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-mono text-xs font-medium text-gray-500">
                          {mk.kode_mk}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {mk.nama_mk}
                        </TableCell>
                        <TableCell className="text-center">{mk.sks}</TableCell>
                        <TableCell className="text-center text-gray-600">
                          {mk.nilai_angka.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`${getGradeColor(
                              mk.nilai_huruf
                            )} font-bold`}
                          >
                            {mk.nilai_huruf}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {mk.bobot.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
