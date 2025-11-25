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
import { Loader2, Save } from "lucide-react";

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
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Input Nilai</h1>
        <p className="text-gray-600">Kelola nilai mahasiswa per kelas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Kelas</CardTitle>
          <CardDescription>
            Pilih mata kuliah untuk mulai menginput nilai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedKelas} onValueChange={handleKelasChange}>
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Pilih Mata Kuliah" />
            </SelectTrigger>
            <SelectContent>
              {kelas.map((k) => (
                <SelectItem key={k.id_kelas} value={k.id_kelas.toString()}>
                  {k.mata_kuliah} - Semester {k.semester} ({k.total_mahasiswa}{" "}
                  Mhs)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedKelas && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead className="w-[100px]">Tugas (30%)</TableHead>
                    <TableHead className="w-[100px]">UTS (30%)</TableHead>
                    <TableHead className="w-[100px]">UAS (40%)</TableHead>
                    <TableHead className="w-[80px]">Akhir</TableHead>
                    <TableHead className="w-[80px]">Grade</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mahasiswa.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        Belum ada mahasiswa di kelas ini
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
                        <TableRow key={m.id_krs}>
                          <TableCell className="font-medium">{m.nim}</TableCell>
                          <TableCell>{m.nama}</TableCell>
                          <TableCell>
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
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
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
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
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
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>{finalScore.toFixed(1)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                letterGrade === "A" ? "default" : "secondary"
                              }
                            >
                              {letterGrade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              disabled={!isEdited || loading}
                              onClick={() => handleSave(m.id_krs)}
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
