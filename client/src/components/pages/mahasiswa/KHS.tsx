import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { useKHS } from "../../../hooks/useKHS";
import { Skeleton } from "../../ui/skeleton";
import { FileText, User, Calendar } from "lucide-react";

export const KHS: React.FC = () => {
  const { data, semesters, loading, fetchKHS } = useKHS();
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
    fetchKHS(Number(value));
  };

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

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Kartu Hasil Studi (KHS)
        </h1>
        <p className="text-muted-foreground">Lihat nilai per semester</p>
      </div>

      {/* Semester Selector */}
      <Card className="border-0 shadow-lg shadow-gray-100/50">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Pilih Semester
              </CardTitle>
              <CardDescription>
                Pilih semester untuk melihat nilai
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Select value={selectedSemester} onValueChange={handleSemesterChange}>
            <SelectTrigger className="w-full md:w-[400px] h-11 border-gray-200 focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Pilih Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem.semester} value={sem.semester.toString()}>
                  {sem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* KHS Content */}
      {selectedSemester && (
        <>
          {loading ? (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          ) : data ? (
            <>
              {/* Student Info */}
              <Card className="border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="flex items-center text-lg font-bold">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Informasi Mahasiswa
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </p>
                      <p className="font-semibold text-gray-900">
                        {data.identitas.nama}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NIM
                      </p>
                      <p className="font-semibold text-gray-900">
                        {data.identitas.nim}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program Studi
                      </p>
                      <p className="font-semibold text-gray-900">
                        {data.identitas.prodi}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Angkatan
                      </p>
                      <p className="font-semibold text-gray-900">
                        {data.identitas.angkatan}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grades Table */}
              <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Nilai Mata Kuliah
                      </CardTitle>
                      <CardDescription>
                        Semester {data.identitas.semester} -{" "}
                        {data.identitas.tahun_ajaran}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-none border-0">
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow>
                          <TableHead className="font-semibold">
                            Kode MK
                          </TableHead>
                          <TableHead className="font-semibold">
                            Nama Mata Kuliah
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            SKS
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            Tugas
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            UTS
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            UAS
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            Akhir
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            Huruf
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            Bobot
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.mata_kuliah.map((mk, index) => (
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
                            <TableCell className="text-center">
                              {mk.sks}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                              {mk.nilai.tugas}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                              {mk.nilai.uts}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                              {mk.nilai.uas}
                            </TableCell>
                            <TableCell className="text-center font-semibold text-gray-900">
                              {mk.nilai.akhir.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className={`${getGradeColor(
                                  mk.nilai.huruf
                                )} font-bold`}
                              >
                                {mk.nilai.huruf}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-medium">
                              {mk.total_bobot.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter className="bg-gray-50/80 border-t border-gray-200">
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="font-bold text-gray-900 pl-6"
                          >
                            Total
                          </TableCell>
                          <TableCell className="text-center font-bold text-gray-900">
                            {data.ringkasan.total_sks}
                          </TableCell>
                          <TableCell colSpan={5}></TableCell>
                          <TableCell className="text-center font-bold text-gray-900">
                            {data.ringkasan.total_bobot.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-primary/5">
                          <TableCell
                            colSpan={8}
                            className="text-right font-bold text-primary py-4"
                          >
                            IPS (Indeks Prestasi Semester):
                          </TableCell>
                          <TableCell className="text-center font-bold text-xl text-primary py-4">
                            {data.ringkasan.ips.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed border-2 shadow-none bg-gray-50/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Data KHS Tidak Ditemukan
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Tidak ada data Kartu Hasil Studi untuk semester yang dipilih.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
