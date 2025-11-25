import { useState, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./useToast";
import { AxiosError } from "axios";

export interface KelasDiajar {
  id_kelas: number;
  mata_kuliah: string;
  sks: number;
  tahun_ajaran: string;
  semester: number;
  total_mahasiswa: number;
  sudah_dinilai: number;
}

export interface MahasiswaKelas {
  id_krs: number;
  id_mahasiswa: number;
  nama: string;
  nim: string;
  prodi: string;
  nilai: {
    nilai_tugas: number;
    nilai_uts: number;
    nilai_uas: number;
    nilai_akhir: number;
    nilai_huruf: string;
  } | null;
}

export const useNilai = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getKelasDiajar = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/nilai/kelas-saya");
      return response.data.data as KelasDiajar[];
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Error",
        description: "Gagal memuat daftar kelas",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getMahasiswaKelas = useCallback(
    async (id_kelas: number) => {
      try {
        setLoading(true);
        const response = await api.get(`/nilai/kelas/${id_kelas}/mahasiswa`);
        return response.data.data.mahasiswa as MahasiswaKelas[];
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "Gagal memuat daftar mahasiswa",
          variant: "destructive",
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const inputNilai = useCallback(
    async (
      id_krs: number,
      nilai: { tugas: number; uts: number; uas: number }
    ) => {
      try {
        setLoading(true);
        const payload = {
          id_krs,
          nilai_tugas: nilai.tugas,
          nilai_uts: nilai.uts,
          nilai_uas: nilai.uas,
        };

        const response = await api.post("/nilai/input-komponen", payload);

        toast({
          title: "Berhasil",
          description: "Nilai berhasil disimpan",
        });

        return response.data.data;
      } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        console.error("Error saving grade:", err);
        toast({
          title: "Gagal",
          description: err.response?.data?.error || "Gagal menyimpan nilai",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    loading,
    getKelasDiajar,
    getMahasiswaKelas,
    inputNilai,
  };
};
