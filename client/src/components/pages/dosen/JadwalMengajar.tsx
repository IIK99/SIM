import React from "react";
import { useDosenDashboard } from "../../../hooks/useDosenDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";

export const JadwalMengajar: React.FC = () => {
  const { data, loading } = useDosenDashboard();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat jadwal...</p>
        </div>
      </div>
    );
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
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Jadwal Mengajar
        </h1>
        <p className="text-muted-foreground">Jadwal perkuliahan semester ini</p>
      </div>

      <div className="grid gap-6">
        {days.map((day) => {
          const classesToday = mockWeeklySchedule.filter((k) => k.hari === day);

          if (classesToday.length === 0) return null;

          return (
            <Card
              key={day}
              className="border-0 shadow-lg shadow-gray-100/50 overflow-hidden"
            >
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                <CardTitle className="text-lg font-bold flex items-center text-gray-900">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {classesToday.map((kelas) => (
                    <div
                      key={kelas.id_kelas}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50/50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                            {kelas.mata_kuliah}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                              <Clock className="mr-1.5 h-3.5 w-3.5" />
                              {kelas.waktu}
                            </span>
                            <span className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                              <MapPin className="mr-1.5 h-3.5 w-3.5" />
                              {kelas.ruang}
                            </span>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-md border border-blue-200">
                              {kelas.sks} SKS
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:text-right pl-16 md:pl-0">
                        <p className="text-sm font-medium text-gray-900">
                          Semester {kelas.semester}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {kelas.total_mahasiswa} Mahasiswa Terdaftar
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
          <Card className="border-dashed border-2 shadow-none bg-gray-50/50">
            <CardContent className="py-16 text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-sm inline-block">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium text-lg">
                Belum ada jadwal
              </p>
              <p className="text-gray-500 mt-1">
                Jadwal mengajar Anda belum tersedia untuk saat ini.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
