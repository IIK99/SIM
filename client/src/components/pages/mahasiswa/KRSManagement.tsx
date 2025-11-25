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
import { BookOpen, Plus, Trash2, Search } from "lucide-react";
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
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Kartu Rencana Studi (KRS)
        </h1>
        <p className="text-gray-600">
          Kelola pengambilan mata kuliah semester ini
        </p>
      </div>

      {/* SKS Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total SKS Diambil
              </p>
              <p className="text-3xl font-bold text-gray-900">{totalSKS}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Maksimal SKS</p>
              <p className="text-xl font-semibold text-gray-700">{maxSKS}</p>
            </div>
            <div>
              <Badge variant={totalSKS <= maxSKS ? "default" : "destructive"}>
                {totalSKS <= maxSKS ? "Dalam Batas" : "Melebihi Batas"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Mata Kuliah yang Diambil
          </CardTitle>
          <CardDescription>
            Mata kuliah yang sudah didaftarkan untuk semester ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Mata Kuliah</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead className="w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledKelas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      Belum ada mata kuliah yang diambil
                    </TableCell>
                  </TableRow>
                ) : (
                  enrolledKelas.map((kelas) => (
                    <TableRow key={kelas.id_krs}>
                      <TableCell>{kelas.nama_mk}</TableCell>
                      <TableCell>{kelas.sks}</TableCell>
                      <TableCell>{kelas.dosen}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
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
      <Card>
        <CardHeader>
          <CardTitle>Mata Kuliah Tersedia</CardTitle>
          <CardDescription>
            Pilih mata kuliah yang ingin diambil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari mata kuliah, kode, atau dosen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSKS} onValueChange={setFilterSKS}>
              <SelectTrigger className="w-[150px]">
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Mata Kuliah</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAvailableKelas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchQuery || filterSKS !== "all"
                        ? "Tidak ada mata kuliah yang sesuai dengan pencarian"
                        : "Tidak ada mata kuliah tersedia"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAvailableKelas.map((kelas) => (
                    <TableRow key={kelas.id_kelas}>
                      <TableCell>{kelas.nama_mk}</TableCell>
                      <TableCell>{kelas.sks}</TableCell>
                      <TableCell>{kelas.dosen}</TableCell>
                      <TableCell>{kelas.kelas_semester}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleRegister(kelas.id_kelas)}
                          disabled={loading || kelas.sudah_diambil}
                        >
                          <Plus className="h-4 w-4" />
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
            <AlertDialogAction onClick={handleDrop}>
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
