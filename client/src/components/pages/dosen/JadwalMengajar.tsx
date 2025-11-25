import React from "react";
import { useDosenDashboard } from "../../../hooks/useDosenDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

export const JadwalMengajar: React.FC = () => {
  const { data, loading } = useDosenDashboard();

  if (loading) {
    return <div className="p-8 text-center">Memuat jadwal...</div>;
  }

  // Mock schedule generation since backend doesn't provide full schedule yet
  // This distributes classes across the week for demonstration
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const mockWeeklySchedule =
    data?.kelas.map((kelas, index) => ({
      ...kelas,
      hari: days[index % days.length],
      waktu: "08:00 - 10:00",
      ruang: `R.${301 + index}`,
    })) || [];

  return (
    <div className="space-y-6 p-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadwal Mengajar</h1>
          <p className="text-muted-foreground">
            Jadwal perkuliahan semester ini
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {days.map((day) => {
          const classesToday = mockWeeklySchedule.filter((k) => k.hari === day);

          if (classesToday.length === 0) return null;

          return (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classesToday.map((kelas) => (
                    <div
                      key={kelas.id_kelas}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">
                          {kelas.mata_kuliah}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {kelas.waktu}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {kelas.ruang}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            {kelas.sks} SKS
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Semester {kelas.semester}
                        </p>
                        <p className="text-sm text-gray-500">
                          {kelas.total_mahasiswa} Mhs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {mockWeeklySchedule.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Belum ada jadwal mengajar yang tersedia.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
