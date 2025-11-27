import { useState, useEffect, useMemo } from "react";
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
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useKRS } from "../../../hooks/useKRS";
import { Skeleton } from "../../ui/skeleton";
import {
  BookOpen,
  Plus,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  BookMarked,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

export const KRSManagement: React.FC = () => {
  const {
    availableKelas,
    enrolledKelas,
    loading,
    fetchAvailableKelas,
    fetchEnrolledKelas,
    registerKelas,
    dropKelas,
  } = useKRS();

  const [selectedDropId, setSelectedDropId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSKS, setFilterSKS] = useState<string>("all");

  useEffect(() => {
    fetchAvailableKelas();
    fetchEnrolledKelas();
  }, [fetchAvailableKelas, fetchEnrolledKelas]);

  const totalSKS = enrolledKelas.reduce((sum, kelas) => sum + kelas.sks, 0);
  const maxSKS = 24;

  const handleRegister = async (id_kelas: number) => {
    await registerKelas(id_kelas);
  };

  const handleDrop = async () => {
    if (selectedDropId) {
      await dropKelas(selectedDropId);
      setSelectedDropId(null);
    }
  };

  // Filter and search logic
  const filteredAvailableKelas = useMemo(() => {
    return availableKelas.filter((kelas) => {
      const matchesSearch =
        searchQuery === "" ||
        kelas.nama_mk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kelas.dosen.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSKS =
        filterSKS === "all" ||
        (filterSKS === "2" && kelas.sks === 2) ||
        (filterSKS === "3" && kelas.sks === 3) ||
        (filterSKS === "4" && kelas.sks === 4);

      return matchesSearch && matchesSKS;
    });
  }, [availableKelas, searchQuery, filterSKS]);

  if (loading && enrolledKelas.length === 0) {
    return (
      <div className="space-y-8 p-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Kartu Rencana Studi (KRS)
        </h1>
        <p className="text-muted-foreground">
          Kelola pengambilan mata kuliah semester ini
        </p>
      </div>

      {/* SKS Summary */}
      <Card className="border-0 shadow-lg shadow-gray-100/50 bg-gradient-to-r from-white to-gray-50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <BookMarked className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Total SKS Diambil
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900">{totalSKS}</p>
                  <p className="text-lg text-gray-500">/ {maxSKS} SKS</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div
                className={`p-2 rounded-full ${
                  totalSKS <= maxSKS
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {totalSKS <= maxSKS ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Status Pengambilan
                </p>
                <p
                  className={`text-xs font-medium ${
                    totalSKS <= maxSKS ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalSKS <= maxSKS
                    ? "Dalam Batas SKS"
                    : "Melebihi Batas SKS"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${
                totalSKS > maxSKS ? "bg-red-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min((totalSKS / maxSKS) * 100, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <CardTitle className="flex items-center text-lg font-bold">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Mata Kuliah yang Diambil
          </CardTitle>
          <CardDescription>
            Mata kuliah yang sudah didaftarkan untuk semester ini
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-none border-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-semibold">
                    Nama Mata Kuliah
                  </TableHead>
                  <TableHead className="w-[100px] text-center font-semibold">
                    SKS
                  </TableHead>
                  <TableHead className="font-semibold">Dosen</TableHead>
                  <TableHead className="w-[100px] text-center font-semibold">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledKelas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="font-medium">Belum ada mata kuliah</p>
                        <p className="text-sm text-gray-400">
                          Silakan pilih mata kuliah dari daftar di bawah
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  enrolledKelas.map((kelas) => (
                    <TableRow
                      key={kelas.id_krs}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {kelas.nama_mk}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        >
                          {kelas.sks} SKS
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {kelas.dosen}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setSelectedDropId(kelas.id_krs)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Available Courses */}
      <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold">
                Mata Kuliah Tersedia
              </CardTitle>
              <CardDescription>
                Pilih mata kuliah yang ingin diambil
              </CardDescription>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari mata kuliah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-white"
                />
              </div>
              <Select value={filterSKS} onValueChange={setFilterSKS}>
                <SelectTrigger className="w-[130px] h-9 bg-white">
                  <SelectValue placeholder="Filter SKS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua SKS</SelectItem>
                  <SelectItem value="2">2 SKS</SelectItem>
                  <SelectItem value="3">3 SKS</SelectItem>
                  <SelectItem value="4">4 SKS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-none border-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-semibold">
                    Nama Mata Kuliah
                  </TableHead>
                  <TableHead className="w-[100px] text-center font-semibold">
                    SKS
                  </TableHead>
                  <TableHead className="font-semibold">Dosen</TableHead>
                  <TableHead className="w-[100px] text-center font-semibold">
                    Semester
                  </TableHead>
                  <TableHead className="w-[100px] text-center font-semibold">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAvailableKelas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-gray-500"
                    >
                      {searchQuery || filterSKS !== "all"
                        ? "Tidak ada mata kuliah yang sesuai dengan pencarian"
                        : "Tidak ada mata kuliah tersedia"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAvailableKelas.map((kelas) => (
                    <TableRow
                      key={kelas.id_kelas}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {kelas.nama_mk}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {kelas.sks} SKS
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {kelas.dosen}
                      </TableCell>
                      <TableCell className="text-center text-gray-600">
                        {kelas.kelas_semester}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleRegister(kelas.id_kelas)}
                          disabled={loading || kelas.sudah_diambil}
                          className={
                            kelas.sudah_diambil
                              ? "bg-gray-100 text-gray-400"
                              : "bg-primary hover:bg-primary/90"
                          }
                        >
                          {kelas.sudah_diambil ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Drop Confirmation Dialog */}
      <AlertDialog
        open={!!selectedDropId}
        onOpenChange={(open: boolean) => !open && setSelectedDropId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Mata Kuliah?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan mata kuliah ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDrop}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
