import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./useToast";
import { useAuthStore } from "../store/authStore";

interface DashboardData {
  ipk: number;
  total_sks: number;
  total_matakuliah: number;
  semester_berjalan: number;
  jadwal_hari_ini: {
    mata_kuliah: string;
    waktu: string;
    ruang: string;
  }[];
  nilai_terbaru: {
    mata_kuliah: string;
    grade: string;
    semester: number;
  }[];
}

interface JadwalItem {
  hari: string;
  mata_kuliah: {
    mata_kuliah: string;
    waktu?: string;
    ruang?: string;
  }[];
}

interface NilaiItem {
  id_nilai: number;
  mata_kuliah: string;
  nilai_huruf: string;
  semester: number;
}

export const useMahasiswaDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const fetchData = useCallback(async () => {
    if (!user?.id_mahasiswa) return;

    try {
      setLoading(true);

      // 1. Fetch IPK & Stats
      const ipkResponse = await api.get(`/khs/ipk/${user.id_mahasiswa}`);
      const ipkData = ipkResponse.data.data;

      // 2. Fetch Schedule (Jadwal)
      const jadwalResponse = await api.get(`/krs/jadwal/${user.id_mahasiswa}`);
      const jadwalData = jadwalResponse.data.data;

      // Filter schedule for today (mock logic for day matching)
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const today = days[new Date().getDay()];
      const todaySchedule =
        jadwalData.jadwal_per_hari.find((h: JadwalItem) => h.hari === today)
          ?.mata_kuliah || [];

      // 3. Fetch Recent Grades
      const nilaiResponse = await api.get(
        `/nilai/mahasiswa/${user.id_mahasiswa}`
      );
      const nilaiData: NilaiItem[] = nilaiResponse.data;

      // Sort by latest semester/id and take top 5
      const recentGrades = nilaiData
        .sort((a, b) => b.id_nilai - a.id_nilai)
        .slice(0, 5)
        .map((n) => ({
          mata_kuliah: n.mata_kuliah,
          grade: n.nilai_huruf,
          semester: n.semester,
        }));

      setData({
        ipk: ipkData.ipk,
        total_sks: ipkData.total_sks,
        total_matakuliah: ipkData.total_matakuliah,
        semester_berjalan: ipkData.semester_selesai + 1, // Estimate current semester
        jadwal_hari_ini: todaySchedule.map((j: { mata_kuliah: string }) => ({
          mata_kuliah: j.mata_kuliah,
          waktu: "08:00 - 10:00", // Mock time if not in DB
          ruang: "R.Kelas", // Mock room if not in DB
        })),
        nilai_terbaru: recentGrades,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id_mahasiswa, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};
