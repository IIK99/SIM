import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./useToast";
import { useAuthStore } from "../store/authStore";

export interface TranskripData {
  identitas: {
    nama: string;
    nim: string;
    prodi: string;
    angkatan: number;
  };
  transkrip: {
    semester: number;
    tahun_ajaran: string;
    mata_kuliah: {
      kode_mk: string;
      nama_mk: string;
      sks: number;
      nilai_huruf: string;
      nilai_angka: number;
      bobot: number;
    }[];
    ips: number;
    total_sks: number;
  }[];
  ipk: number;
  total_sks: number;
  total_semester: number;
}

export const useTranskrip = () => {
  const [data, setData] = useState<TranskripData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const fetchTranskrip = useCallback(async () => {
    if (!user?.id_mahasiswa) return;

    try {
      setLoading(true);
      const response = await api.get(`/transkrip/${user.id_mahasiswa}`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching transkrip:", error);
      toast({
        title: "Error",
        description: "Gagal memuat transkrip",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id_mahasiswa, toast]);

  useEffect(() => {
    fetchTranskrip();
  }, [fetchTranskrip]);

  return {
    data,
    loading,
    refetch: fetchTranskrip,
  };
};
