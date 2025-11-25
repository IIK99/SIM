import { useState, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./useToast";
import { useAuthStore } from "../store/authStore";

export interface AvailableKelas {
  id_kelas: number;
  nama_mk: string;
  sks: number;
  dosen: string;
  nidn: string;
  tahun_ajaran: string;
  kelas_semester: number;
  sudah_diambil: boolean;
}

export interface EnrolledKelas {
  id_krs: number;
  id_kelas: number;
  nama_mk: string;
  sks: number;
  dosen: string;
  semester: number;
}

export const useKRS = () => {
  const [availableKelas, setAvailableKelas] = useState<AvailableKelas[]>([]);
  const [enrolledKelas, setEnrolledKelas] = useState<EnrolledKelas[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const fetchAvailableKelas = useCallback(
    async (semester?: number, tahunAjaran?: string) => {
      if (!user?.id_mahasiswa) return;

      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (semester) params.append("semester", semester.toString());
        if (tahunAjaran) params.append("tahun_ajaran", tahunAjaran);

        const response = await api.get(
          `/krs/available/${user.id_mahasiswa}?${params.toString()}`
        );
        setAvailableKelas(response.data.data.available_kelas || []);
      } catch (error) {
        console.error("Error fetching available kelas:", error);
        toast({
          title: "Error",
          description: "Gagal memuat mata kuliah tersedia",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [user?.id_mahasiswa, toast]
  );

  const fetchEnrolledKelas = useCallback(async () => {
    if (!user?.id_mahasiswa) return;

    try {
      setLoading(true);
      const response = await api.get(`/krs/jadwal/${user.id_mahasiswa}`);
      const jadwalData = response.data.data.semua_matakuliah || [];
      setEnrolledKelas(jadwalData);
    } catch (error) {
      console.error("Error fetching enrolled kelas:", error);
      toast({
        title: "Error",
        description: "Gagal memuat KRS",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id_mahasiswa, toast]);

  const registerKelas = async (id_kelas: number) => {
    if (!user?.id_mahasiswa) return false;

    try {
      setLoading(true);
      await api.post("/krs/ambil", {
        id_mahasiswa: user.id_mahasiswa,
        id_kelas,
      });

      toast({
        title: "Berhasil",
        description: "Mata kuliah berhasil diambil",
      });

      // Refresh both lists
      await fetchAvailableKelas();
      await fetchEnrolledKelas();
      return true;
    } catch (error: unknown) {
      console.error("Error registering kelas:", error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      toast({
        title: "Gagal",
        description:
          axiosError.response?.data?.error || "Gagal mengambil mata kuliah",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const dropKelas = async (id_krs: number) => {
    if (!user?.id_mahasiswa) return false;

    try {
      setLoading(true);
      await api.delete(`/krs/drop/${id_krs}`, {
        data: { id_mahasiswa: user.id_mahasiswa },
      });

      toast({
        title: "Berhasil",
        description: "Mata kuliah berhasil dibatalkan",
      });

      // Refresh both lists
      await fetchAvailableKelas();
      await fetchEnrolledKelas();
      return true;
    } catch (error: unknown) {
      console.error("Error dropping kelas:", error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      toast({
        title: "Gagal",
        description:
          axiosError.response?.data?.error || "Gagal membatalkan mata kuliah",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    availableKelas,
    enrolledKelas,
    loading,
    fetchAvailableKelas,
    fetchEnrolledKelas,
    registerKelas,
    dropKelas,
  };
};
