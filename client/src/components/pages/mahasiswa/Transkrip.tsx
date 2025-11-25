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
import { Award, FileText } from "lucide-react";

export const Transkrip: React.FC = () => {
  const { data, loading } = useTranskrip();

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

  const getPredikat = (ipk: number) => {
    if (ipk >= 3.5)
      return { text: "Cum Laude", color: "bg-green-100 text-green-800" };
    if (ipk >= 3.0)
      return { text: "Sangat Memuaskan", color: "bg-blue-100 text-blue-800" };
    if (ipk >= 2.5)
      return { text: "Memuaskan", color: "bg-yellow-100 text-yellow-800" };
    if (ipk >= 2.0)
      return { text: "Cukup", color: "bg-orange-100 text-orange-800" };
    return { text: "Kurang", color: "bg-red-100 text-red-800" };
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const predikat = getPredikat(data.ipk);

  return (
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transkrip Akademik</h1>
        <p className="text-gray-600">Ringkasan prestasi akademik lengkap</p>
      </div>

      {/* Student Info & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Informasi Mahasiswa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium text-lg">{data.identitas.nama}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">NIM</p>
                  <p className="font-medium">{data.identitas.nim}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Angkatan</p>
                  <p className="font-medium">{data.identitas.angkatan}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Program Studi</p>
                <p className="font-medium">{data.identitas.prodi}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Ringkasan Prestasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">
                    Indeks Prestasi Kumulatif
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {data.ipk.toFixed(2)}
                  </p>
                </div>
                <Badge className={predikat.color}>{predikat.text}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total SKS</p>
                  <p className="text-xl font-bold">{data.total_sks}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded- lg">
                  <p className="text-sm text-gray-600">Semester</p>
                  <p className="text-xl font-bold">{data.total_semester}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transkrip per Semester */}
      {data.transkrip.map((semester) => (
        <Card key={semester.semester}>
          <CardHeader>
            <CardTitle>Semester {semester.semester}</CardTitle>
            <CardDescription>
              {semester.tahun_ajaran} • IPS: {semester.ips.toFixed(2)} •{" "}
              {semester.total_sks} SKS
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
                    <TableHead>Nilai Angka</TableHead>
                    <TableHead>Nilai Huruf</TableHead>
                    <TableHead>Bobot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semester.mata_kuliah.map((mk, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {mk.kode_mk}
                      </TableCell>
                      <TableCell>{mk.nama_mk}</TableCell>
                      <TableCell>{mk.sks}</TableCell>
                      <TableCell>{mk.nilai_angka.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(mk.nilai_huruf)}>
                          {mk.nilai_huruf}
                        </Badge>
                      </TableCell>
                      <TableCell>{mk.bobot.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
