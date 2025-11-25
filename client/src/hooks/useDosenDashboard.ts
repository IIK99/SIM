import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./useToast";

interface KelasDiajar {
  id_kelas: number;
  mata_kuliah: string;
  sks: number;
  tahun_ajaran: string;
  semester: number;
  total_mahasiswa: number;
  sudah_dinilai: number;
}

interface DosenDashboardData {
  kelas: KelasDiajar[];
  stats: {
    total_kelas: number;
    total_mahasiswa: number;
    total_sks: number;
    perlu_nilai: number;
  };
  jadwal_hari_ini: {
    mata_kuliah: string;
    kelas_semester: number;
    waktu: string;
    ruang: string;
  }[];
}

export const useDosenDashboard = () => {
  const [data, setData] = useState<DosenDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch classes taught
      const response = await api.get("/nilai/kelas-saya");

      // Robust data extraction
      const rawData = response.data;
      const kelas: KelasDiajar[] = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      // Calculate stats
      const total_kelas = kelas.length;
      const total_mahasiswa = kelas.reduce(
        (acc, curr) => acc + curr.total_mahasiswa,
        0
      );
      const total_sks = kelas.reduce((acc, curr) => acc + curr.sks, 0);
      const perlu_nilai = kelas.reduce(
        (acc, curr) => acc + (curr.total_mahasiswa - curr.sudah_dinilai),
        0
      );

      // Mock schedule for now (since backend doesn't have full schedule logic yet)
      // In a real app, we would filter `kelas` by day of week
      const jadwal_hari_ini = kelas.slice(0, 2).map((k) => ({
        mata_kuliah: k.mata_kuliah,
        kelas_semester: k.semester,
        waktu: "08:00 - 10:00", // Mock time
        ruang: "R.301", // Mock room
      }));

      const dashboardData = {
        kelas,
        stats: {
          total_kelas,
          total_mahasiswa,
          total_sks,
          perlu_nilai,
        },
        jadwal_hari_ini,
      };

      setData(dashboardData);
    } catch (error) {
      console.error(
        "❌ [DosenDashboard] Error fetching dashboard data:",
        error
      );
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};
