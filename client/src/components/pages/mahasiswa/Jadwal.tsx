import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Skeleton } from "../../ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import { api } from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";
import { useToast } from "../../../hooks/useToast";

interface JadwalItem {
  mata_kuliah: string;
  waktu: string;
  ruang?: string;
  dosen: string;
}

interface JadwalPerHari {
  hari: string;
  mata_kuliah: JadwalItem[];
}

export const Jadwal: React.FC = () => {
  const [jadwal, setJadwal] = useState<JadwalPerHari[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => {
    const fetchJadwal = async () => {
      if (!user?.id_mahasiswa) return;

      try {
        setLoading(true);
        const response = await api.get(`/krs/jadwal/${user.id_mahasiswa}`);
        setJadwal(response.data.data.jadwal_per_hari || []);
      } catch (error) {
        console.error("Error fetching jadwal:", error);
        toast({
          title: "Error",
          description: "Gagal memuat jadwal",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, [user?.id_mahasiswa, toast]);

  if (loading) {
    return (
      <div className="space- y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Jadwal Kuliah</h1>
        <p className="text-gray-600">Jadwal perkuliahan semester ini</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {days.map((hari) => {
          const hariData = jadwal.find((j) => j.hari === hari);
          const hasSchedule = hariData && hariData.mata_kuliah.length > 0;

          return (
            <Card key={hari}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {hari}
                </CardTitle>
                <CardDescription>
                  {hasSchedule
                    ? `${hariData.mata_kuliah.length} mata kuliah`
                    : "Tidak ada jadwal"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hasSchedule ? (
                    hariData.mata_kuliah.map((mk, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {mk.mata_kuliah}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {mk.dosen}
                            </p>
                            {mk.ruang && (
                              <p className="text-sm text-gray-500">
                                📍 {mk.ruang}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {mk.waktu}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      Tidak ada kuliah
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
