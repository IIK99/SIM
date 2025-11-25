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
import { FileText } from "lucide-react";

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
        return "bg-green-100 text-green-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "E":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Kartu Hasil Studi (KHS)
        </h1>
        <p className="text-gray-600">Lihat nilai per semester</p>
      </div>

      {/* Semester Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Semester</CardTitle>
          <CardDescription>Pilih semester untuk melihat nilai</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedSemester} onValueChange={handleSemesterChange}>
            <SelectTrigger className="w-full md:w-[400px]">
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
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : data ? (
            <>
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Informasi Mahasiswa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nama</p>
                      <p className="font-medium">{data.identitas.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">NIM</p>
                      <p className="font-medium">{data.identitas.nim}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Program Studi</p>
                      <p className="font-medium">{data.identitas.prodi}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Angkatan</p>
                      <p className="font-medium">{data.identitas.angkatan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grades Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Nilai Mata Kuliah</CardTitle>
                  <CardDescription>
                    Semester {data.identitas.semester} -{" "}
                    {data.identitas.tahun_ajaran}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode MK</TableHead>
                          <TableHead>Nama Mata Kuliah</TableHead>
                          <TableHead>SKS</TableHead>
                          <TableHead>Tugas</TableHead>
                          <TableHead>UTS</TableHead>
                          <TableHead>UAS</TableHead>
                          <TableHead>Akhir</TableHead>
                          <TableHead>Huruf</TableHead>
                          <TableHead>Bobot</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.mata_kuliah.map((mk, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {mk.kode_mk}
                            </TableCell>
                            <TableCell>{mk.nama_mk}</TableCell>
                            <TableCell>{mk.sks}</TableCell>
                            <TableCell>{mk.nilai.tugas}</TableCell>
                            <TableCell>{mk.nilai.uts}</TableCell>
                            <TableCell>{mk.nilai.uas}</TableCell>
                            <TableCell>{mk.nilai.akhir.toFixed(1)}</TableCell>
                            <TableCell>
                              <Badge className={getGradeColor(mk.nilai.huruf)}>
                                {mk.nilai.huruf}
                              </Badge>
                            </TableCell>
                            <TableCell>{mk.total_bobot.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-bold">
                            Total
                          </TableCell>
                          <TableCell className="font-bold">
                            {data.ringkasan.total_sks}
                          </TableCell>
                          <TableCell colSpan={5}></TableCell>
                          <TableCell className="font-bold">
                            {data.ringkasan.total_bobot.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-right font-bold"
                          >
                            IPS (Indeks Prestasi Semester):
                          </TableCell>
                          <TableCell className="font-bold text-lg">
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
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Data KHS tidak ditemukan untuk semester ini
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
