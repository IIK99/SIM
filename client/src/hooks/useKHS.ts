import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./useToast";
import { useAuthStore } from "../store/authStore";

export interface KHSData {
  identitas: {
    nama: string;
    nim: string;
    prodi: string;
    angkatan: number;
    semester: number;
    tahun_ajaran: string;
  };
  mata_kuliah: {
    kode_mk: string;
    nama_mk: string;
    sks: number;
    nilai: {
      angka: number;
      huruf: string;
      tugas: number;
      uts: number;
      uas: number;
      akhir: number;
    };
    dosen: string;
    bobot: number;
    total_bobot: number;
  }[];
  ringkasan: {
    total_matakuliah: number;
    total_sks: number;
    total_bobot: number;
    ips: number;
  };
}

export const useKHS = () => {
  const [data, setData] = useState<KHSData | null>(null);
  const [semesters, setSemesters] = useState<
    { semester: number; tahun_ajaran: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const fetchSemesters = useCallback(async () => {
    if (!user?.id_mahasiswa) return;

    try {
      const response = await api.get(`/khs/semester/${user.id_mahasiswa}`);
      setSemesters(response.data.data || []);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      toast({
        title: "Error",
        description: "Gagal memuat daftar semester",
        variant: "destructive",
      });
    }
  }, [user?.id_mahasiswa, toast]);

  const fetchKHS = useCallback(
    async (semester: number) => {
      if (!user?.id_mahasiswa) return;

      try {
        setLoading(true);
        const response = await api.get(`/khs/${user.id_mahasiswa}/${semester}`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching KHS:", error);
        toast({
          title: "Error",
          description: "Gagal memuat KHS",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [user?.id_mahasiswa, toast]
  );

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  return {
    data,
    semesters,
    loading,
    fetchKHS,
  };
};
