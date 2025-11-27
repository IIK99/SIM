import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Skeleton } from "../../ui/skeleton";
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";
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
      <div className="space-y-8 p-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Jadwal Kuliah
        </h1>
        <p className="text-muted-foreground">Jadwal perkuliahan semester ini</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {days.map((hari) => {
          const hariData = jadwal.find((j) => j.hari === hari);
          const hasSchedule = hariData && hariData.mata_kuliah.length > 0;

          return (
            <Card
              key={hari}
              className={`border-0 shadow-lg shadow-gray-100/50 overflow-hidden h-full ${
                !hasSchedule ? "opacity-70" : ""
              }`}
            >
              <CardHeader
                className={`border-b border-gray-100 pb-4 ${
                  hasSchedule ? "bg-gray-50/50" : "bg-gray-50/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg font-bold">
                    <Calendar
                      className={`h-5 w-5 mr-2 ${
                        hasSchedule ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    {hari}
                  </CardTitle>
                  <Badge
                    variant={hasSchedule ? "default" : "secondary"}
                    className={
                      hasSchedule
                        ? "bg-primary/10 text-primary hover:bg-primary/20 border-0"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {hasSchedule
                      ? `${hariData.mata_kuliah.length} Kelas`
                      : "Kosong"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {hasSchedule ? (
                    hariData.mata_kuliah.map((mk, index) => (
                      <div
                        key={index}
                        className="group p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                {mk.mata_kuliah}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                {mk.dosen}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1"
                              >
                                <Clock className="h-3 w-3" />
                                {mk.waktu}
                              </Badge>
                              {mk.ruang && (
                                <Badge
                                  variant="outline"
                                  className="bg-orange-50 text-orange-700 border-orange-100 flex items-center gap-1"
                                >
                                  <MapPin className="h-3 w-3" />
                                  {mk.ruang}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Calendar className="h-6 w-6 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Tidak ada jadwal kuliah
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Nikmati waktu istirahat Anda
                      </p>
                    </div>
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
