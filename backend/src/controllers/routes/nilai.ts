import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const router = Router();
const prisma = new PrismaClient();

const calculateNilaiAkhir = (tugas: number, uts: number, uas: number) => {
  const nilaiAkhir = tugas * 0.3 + uts * 0.3 + uas * 0.4;

  let nilaiHuruf = "E";
  if (nilaiAkhir >= 85) nilaiHuruf = "A";
  else if (nilaiAkhir >= 75) nilaiHuruf = "B";
  else if (nilaiAkhir >= 65) nilaiHuruf = "C";
  else if (nilaiAkhir >= 55) nilaiHuruf = "D";

  return { nilaiAkhir, nilaiHuruf };
};

// Fungsi konversi nilai_angka ke sistem komponen (backward compatibility)
const convertToComponentSystem = (nilai_angka: number) => {
  // Untuk migrasi: bagi nilai_angka menjadi 3 komponen
  const base = Math.floor(nilai_angka * 0.8); // Adjust factor
  return {
    nilai_tugas: base + 10,
    nilai_uts: base + 5,
    nilai_uas: base,
    nilai_akhir: nilai_angka,
  };
};

// POST - Input nilai (sistem lama - maintain compatibility)
router.post("/", async (req: Request, res: Response) => {
  const { id_krs, nilai_angka } = req.body;
  const user = req.user;

  try {
    const krs = await prisma.krs.findUnique({
      where: { id_krs: Number(id_krs) },
      include: {
        kelas: true,
      },
    });

    if (!krs) return res.status(404).json({ error: "KRS tidak ditemukan" });

    if (user.role === "dosen" && user.id_dosen !== krs.kelas.id_dosen) {
      return res.status(403).json({ error: "Anda tidak mengajar kelas ini" });
    }

    let nilai_huruf = "";
    if (nilai_angka >= 85) nilai_huruf = "A";
    else if (nilai_angka >= 75) nilai_huruf = "B";
    else if (nilai_angka >= 65) nilai_huruf = "C";
    else if (nilai_angka >= 55) nilai_huruf = "D";
    else nilai_huruf = "E";

    // Buat nilai dengan sistem lama + field baru
    const nilai = await prisma.nilai.create({
      data: {
        id_krs: Number(id_krs),
        nilai_angka: Number(nilai_angka),
        nilai_huruf,
        // Auto-convert ke sistem baru untuk migrasi
        ...convertToComponentSystem(nilai_angka),
      },
    });

    res.json({
      message: "Nilai berhasil diinput",
      nilai,
      system: "legacy",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// POST - Input nilai dengan sistem baru (tugas, uts, uas)
router.post("/input-komponen", async (req: any, res: Response) => {
  try {
    const { id_krs, nilai_tugas, nilai_uts, nilai_uas } = req.body;
    const user_id = req.user.id_user;

    // Validasi input
    if (
      !id_krs ||
      nilai_tugas === undefined ||
      nilai_uts === undefined ||
      nilai_uas === undefined
    ) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
        required: ["id_krs", "nilai_tugas", "nilai_uts", "nilai_uas"],
      });
    }

    // Validasi range nilai
    if (
      nilai_tugas < 0 ||
      nilai_tugas > 100 ||
      nilai_uts < 0 ||
      nilai_uts > 100 ||
      nilai_uas < 0 ||
      nilai_uas > 100
    ) {
      return res.status(400).json({
        error: "Nilai harus antara 0-100",
      });
    }

    // Cek apakah KRS exists dan dosen mengajar kelas tersebut
    const krs = await prisma.krs.findFirst({
      where: {
        id_krs: Number(id_krs),
        kelas: {
          dosen: {
            id_user: user_id,
          },
        },
      },
      include: {
        kelas: {
          include: {
            matakuliah: true,
          },
        },
        mahasiswa: true,
      },
    });

    if (!krs) {
      return res.status(403).json({
        error: "KRS tidak ditemukan atau Anda tidak mengajar kelas ini",
      });
    }

    // Hitung nilai akhir
    const { nilaiAkhir, nilaiHuruf } = calculateNilaiAkhir(
      nilai_tugas,
      nilai_uts,
      nilai_uas
    );

    // Input/update nilai dengan sistem baru
    const nilai = await prisma.nilai.upsert({
      where: {
        id_krs: Number(id_krs),
      },
      update: {
        nilai_tugas: Number(nilai_tugas),
        nilai_uts: Number(nilai_uts),
        nilai_uas: Number(nilai_uas),
        nilai_akhir: nilaiAkhir,
        nilai_huruf: nilaiHuruf,
        // Maintain backward compatibility
        nilai_angka: Math.round(nilaiAkhir),
      },
      create: {
        id_krs: Number(id_krs),
        nilai_tugas: Number(nilai_tugas),
        nilai_uts: Number(nilai_uts),
        nilai_uas: Number(nilai_uas),
        nilai_akhir: nilaiAkhir,
        nilai_huruf: nilaiHuruf,
        // Maintain backward compatibility
        nilai_angka: Math.round(nilaiAkhir),
      },
      include: {
        krs: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                nim: true,
              },
            },
            kelas: {
              include: {
                matakuliah: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Nilai berhasil diinput",
      data: {
        mahasiswa: nilai.krs.mahasiswa.nama,
        nim: nilai.krs.mahasiswa.nim,
        mata_kuliah: nilai.krs.kelas.matakuliah.nama_mk,
        nilai_tugas: nilai.nilai_tugas,
        nilai_uts: nilai.nilai_uts,
        nilai_uas: nilai.nilai_uas,
        nilai_akhir: nilai.nilai_akhir,
        nilai_huruf: nilai.nilai_huruf,
      },
      system: "new",
    });
  } catch (error) {
    console.error("INPUT NILAI KOMPONEN ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// GET - Daftar mahasiswa di kelas yang diajar dosen (sistem baru)
router.get("/kelas/:id_kelas/mahasiswa", async (req: any, res) => {
  try {
    const { id_kelas } = req.params;
    const user_id = req.user.id_user;

    // Cek apakah dosen mengajar kelas ini
    const kelas = await prisma.kelas.findFirst({
      where: {
        id_kelas: Number(id_kelas),
        dosen: {
          id_user: user_id,
        },
      },
      include: {
        matakuliah: true,
      },
    });

    if (!kelas) {
      return res.status(403).json({
        error: "Anda tidak mengajar kelas ini",
      });
    }

    // Get mahasiswa yang mengambil kelas ini
    const mahasiswaKelas = await prisma.krs.findMany({
      where: {
        id_kelas: Number(id_kelas),
      },
      include: {
        mahasiswa: {
          select: {
            id_mahasiswa: true,
            nama: true,
            nim: true,
            prodi: true,
          },
        },
        nilai: true,
      },
      orderBy: {
        mahasiswa: {
          nama: "asc",
        },
      },
    });

    res.json({
      success: true,
      data: {
        kelas: {
          id_kelas: kelas.id_kelas,
          mata_kuliah: kelas.matakuliah.nama_mk,
          tahun_ajaran: kelas.tahun_ajaran,
          semester: kelas.semester,
        },
        mahasiswa: mahasiswaKelas.map((mhs) => ({
          id_krs: mhs.id_krs,
          id_mahasiswa: mhs.mahasiswa.id_mahasiswa,
          nama: mhs.mahasiswa.nama,
          nim: mhs.mahasiswa.nim,
          prodi: mhs.mahasiswa.prodi,
          // Support both old and new system
          nilai: mhs.nilai
            ? {
                // Old system
                nilai_angka: mhs.nilai.nilai_angka,
                nilai_huruf: mhs.nilai.nilai_huruf,
                // New system
                nilai_tugas: mhs.nilai.nilai_tugas,
                nilai_uts: mhs.nilai.nilai_uts,
                nilai_uas: mhs.nilai.nilai_uas,
                nilai_akhir: mhs.nilai.nilai_akhir,
                system: mhs.nilai.nilai_tugas !== null ? "new" : "legacy",
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("GET MAHASISWA KELAS ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// GET nilai mahasiswa (maintain existing functionality)
router.get("/mahasiswa/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const nilai = await prisma.nilai.findMany({
      where: {
        krs: { id_mahasiswa: Number(id) },
      },
      include: {
        krs: {
          include: {
            kelas: {
              include: {
                matakuliah: true,
              },
            },
          },
        },
      },
    });

    // Format response untuk support both systems
    const formattedNilai = nilai.map((n) => ({
      id_nilai: n.id_nilai,
      id_krs: n.id_krs,
      nilai_angka: n.nilai_angka,
      nilai_huruf: n.nilai_huruf,
      nilai_tugas: n.nilai_tugas,
      nilai_uts: n.nilai_uts,
      nilai_uas: n.nilai_uas,
      nilai_akhir: n.nilai_akhir,
      system: n.nilai_tugas !== null ? "new" : "legacy",
      mata_kuliah: n.krs.kelas.matakuliah.nama_mk,
      sks: n.krs.kelas.matakuliah.sks,
      semester: n.krs.kelas.semester,
      tahun_ajaran: n.krs.kelas.tahun_ajaran,
    }));
    res.json(formattedNilai);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data nilai" });
  }
});

// GET - Daftar kelas yang diajar dosen
router.get("/kelas-saya", async (req: any, res) => {
  try {
    const user_id = req.user.id_user;

    const kelasDiajar = await prisma.kelas.findMany({
      where: {
        dosen: {
          id_user: user_id,
        },
      },
      include: {
        matakuliah: true,
        krs: {
          include: {
            mahasiswa: true,
            nilai: true,
          },
        },
      },
      orderBy: [{ tahun_ajaran: "desc" }, { semester: "desc" }],
    });

    const formattedKelas = kelasDiajar.map((kelas) => ({
      id_kelas: kelas.id_kelas,
      mata_kuliah: kelas.matakuliah.nama_mk,
      sks: kelas.matakuliah.sks,
      tahun_ajaran: kelas.tahun_ajaran,
      semester: kelas.semester,
      total_mahasiswa: kelas.krs.length,
      sudah_dinilai: kelas.krs.filter((k) => k.nilai !== null).length,
    }));

    res.json({
      success: true,
      data: formattedKelas,
    });
  } catch (error) {
    console.error("GET KELAS SAYA ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default router;
