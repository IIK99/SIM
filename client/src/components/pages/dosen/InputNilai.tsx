import { useState, useEffect } from "react";
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
} from "../../ui/table";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  useNilai,
  type KelasDiajar,
  type MahasiswaKelas,
} from "../../../hooks/useNilai";
import { Loader2, Save, BookOpen, GraduationCap, Users } from "lucide-react";

export const InputNilai: React.FC = () => {
  const { loading, getKelasDiajar, getMahasiswaKelas, inputNilai } = useNilai();

  const [kelas, setKelas] = useState<KelasDiajar[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<string>("");
  const [mahasiswa, setMahasiswa] = useState<MahasiswaKelas[]>([]);
  const [editedGrades, setEditedGrades] = useState<
    Record<number, { tugas: number; uts: number; uas: number }>
  >({});

  useEffect(() => {
    const loadKelas = async () => {
      const data = await getKelasDiajar();
      setKelas(data);
    };

    loadKelas();
  }, [getKelasDiajar]);

  const handleKelasChange = async (value: string) => {
    setSelectedKelas(value);
    const data = await getMahasiswaKelas(Number(value));
    setMahasiswa(data);
    setEditedGrades({}); // Reset edits when changing class
  };

  const handleGradeChange = (
    id_krs: number,
    field: "tugas" | "uts" | "uas",
    value: string
  ) => {
    const numValue = Math.min(100, Math.max(0, Number(value) || 0));

    setEditedGrades((prev) => {
      const current = prev[id_krs] || {
        tugas:
          mahasiswa.find((m) => m.id_krs === id_krs)?.nilai?.nilai_tugas || 0,
        uts: mahasiswa.find((m) => m.id_krs === id_krs)?.nilai?.nilai_uts || 0,
        uas: mahasiswa.find((m) => m.id_krs === id_krs)?.nilai?.nilai_uas || 0,
      };

      return {
        ...prev,
        [id_krs]: {
          ...current,
          [field]: numValue,
        },
      };
    });
  };

  const handleSave = async (id_krs: number) => {
    const grades = editedGrades[id_krs];
    if (!grades) return;

    const result = await inputNilai(id_krs, grades);
    if (result) {
      // Update local state to reflect saved data
      setMahasiswa((prev) =>
        prev.map((m) =>
          m.id_krs === id_krs
            ? {
                ...m,
                nilai: {
                  ...result,
                  nilai_tugas: result.nilai_tugas,
                  nilai_uts: result.nilai_uts,
                  nilai_uas: result.nilai_uas,
                  nilai_akhir: result.nilai_akhir,
                  nilai_huruf: result.nilai_huruf,
                },
              }
            : m
        )
      );

      // Remove from edited state
      setEditedGrades((prev) => {
        const newState = { ...prev };
        delete newState[id_krs];
        return newState;
      });
    }
  };

  const calculateFinal = (tugas: number, uts: number, uas: number) => {
    return tugas * 0.3 + uts * 0.3 + uas * 0.4;
  };

  const getGradeLetter = (final: number) => {
    if (final >= 85) return "A";
    if (final >= 75) return "B";
    if (final >= 65) return "C";
    if (final >= 55) return "D";
    return "E";
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Input Nilai
        </h1>
        <p className="text-muted-foreground">
          Kelola nilai mahasiswa per kelas
        </p>
      </div>

      <Card className="border-0 shadow-lg shadow-gray-100/50">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Pilih Kelas
              </CardTitle>
              <CardDescription>
                Pilih mata kuliah untuk mulai menginput nilai
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Select value={selectedKelas} onValueChange={handleKelasChange}>
            <SelectTrigger className="w-full md:w-[400px] h-11 border-gray-200 focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Pilih Mata Kuliah" />
            </SelectTrigger>
            <SelectContent>
              {kelas.map((k) => (
                <SelectItem key={k.id_kelas} value={k.id_kelas.toString()}>
                  {k.mata_kuliah} - Semester {k.semester} ({k.total_mahasiswa}{" "}
                  Mahasiswa)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedKelas && (
        <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Daftar Mahasiswa
                </CardTitle>
                <CardDescription>
                  Input nilai tugas, UTS, dan UAS
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-none border-0">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-[120px] font-semibold">
                      NIM
                    </TableHead>
                    <TableHead className="font-semibold">Nama</TableHead>
                    <TableHead className="w-[100px] text-center font-semibold">
                      Tugas (30%)
                    </TableHead>
                    <TableHead className="w-[100px] text-center font-semibold">
                      UTS (30%)
                    </TableHead>
                    <TableHead className="w-[100px] text-center font-semibold">
                      UAS (40%)
                    </TableHead>
                    <TableHead className="w-[80px] text-center font-semibold">
                      Akhir
                    </TableHead>
                    <TableHead className="w-[80px] text-center font-semibold">
                      Grade
                    </TableHead>
                    <TableHead className="w-[100px] text-center font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mahasiswa.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="font-medium">Belum ada mahasiswa</p>
                          <p className="text-sm text-gray-400">
                            Belum ada mahasiswa yang mengambil kelas ini
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    mahasiswa.map((m) => {
                      const currentGrades = editedGrades[m.id_krs] || {
                        tugas: m.nilai?.nilai_tugas || 0,
                        uts: m.nilai?.nilai_uts || 0,
                        uas: m.nilai?.nilai_uas || 0,
                      };

                      const isEdited = !!editedGrades[m.id_krs];
                      const finalScore = calculateFinal(
                        currentGrades.tugas,
                        currentGrades.uts,
                        currentGrades.uas
                      );
                      const letterGrade = getGradeLetter(finalScore);

                      return (
                        <TableRow
                          key={m.id_krs}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {m.nim}
                          </TableCell>
                          <TableCell className="font-medium text-gray-700">
                            {m.nama}
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={currentGrades.tugas}
                              onChange={(e) =>
                                handleGradeChange(
                                  m.id_krs,
                                  "tugas",
                                  e.target.value
                                )
                              }
                              className="w-20 text-center mx-auto h-9 focus:ring-primary focus:border-primary"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={currentGrades.uts}
                              onChange={(e) =>
                                handleGradeChange(
                                  m.id_krs,
                                  "uts",
                                  e.target.value
                                )
                              }
                              className="w-20 text-center mx-auto h-9 focus:ring-primary focus:border-primary"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={currentGrades.uas}
                              onChange={(e) =>
                                handleGradeChange(
                                  m.id_krs,
                                  "uas",
                                  e.target.value
                                )
                              }
                              className="w-20 text-center mx-auto h-9 focus:ring-primary focus:border-primary"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold text-gray-900">
                            {finalScore.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                letterGrade === "A" ? "default" : "secondary"
                              }
                              className={
                                letterGrade === "A"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                                  : letterGrade === "B"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                              }
                            >
                              {letterGrade}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              disabled={!isEdited || loading}
                              onClick={() => handleSave(m.id_krs)}
                              className={
                                isEdited ? "bg-primary hover:bg-primary/90" : ""
                              }
                            >
                              {loading && isEdited ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
