import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ==================== ADMIN ROUTES ====================

// POST create KRS (admin)
router.post("/create", async (req, res) => {
  const { id_mahasiswa, id_kelas, semester } = req.body;

  if (!id_mahasiswa || !id_kelas || !semester) {
    return res.status(400).json({
      error: "id_mahasiswa, id_kelas, dan semester wajib diisi",
    });
  }

  try {
    const existingKRS = await prisma.krs.findFirst({
      where: {
        id_mahasiswa: Number(id_mahasiswa),
        id_kelas: Number(id_kelas),
        semester: Number(semester),
      },
    });

    if (existingKRS) {
      return res.status(400).json({
        error: "Mahasiswa sudah mengambil kelas ini di semester tersebut",
      });
    }

    const krs = await prisma.krs.create({
      data: {
        id_mahasiswa: Number(id_mahasiswa),
        id_kelas: Number(id_kelas),
        semester: Number(semester),
      },
      include: {
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
          },
        },
        kelas: {
          include: {
            matakuliah: {
              select: {
                nama_mk: true,
                sks: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: "KRS berhasil ditambahkan",
      data: krs,
    });
  } catch (error) {
    console.log("CREATE KRS ERROR:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server",
      details: error.message,
    });
  }
});

// GET all KRS (admin)
router.get("/", async (req, res) => {
  try {
    const krs = await prisma.krs.findMany({
      include: {
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
            prodi: true,
          },
        },
        kelas: {
          include: {
            matakuliah: true,
            dosen: true,
          },
        },
        nilai: true,
      },
      orderBy: [{ semester: "desc" }, { mahasiswa: { nama: "asc" } }],
    });

    res.json({
      success: true,
      data: krs,
    });
  } catch (error) {
    console.log("GET ALL KRS ERROR:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server",
      details: error.message,
    });
  }
});

// ==================== MAHASISWA ROUTES ====================

// GET - Mata kuliah available untuk diambil (mahasiswa)
router.get("/available/:id_mahasiswa", async (req, res) => {
  try {
    const { id_mahasiswa } = req.params;
    const { semester, tahun_ajaran } = req.query;

    const currentSemester = semester || 1;
    const currentTahunAjaran = tahun_ajaran || "2024/2025";

    // Get mahasiswa data
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id_mahasiswa: Number(id_mahasiswa) },
      select: { prodi: true, angkatan: true },
    });

    if (!mahasiswa) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    }

    // Get kelas yang available
    const availableKelas = await prisma.kelas.findMany({
      where: {
        tahun_ajaran: currentTahunAjaran as string,
        semester: Number(currentSemester),
        krs: {
          none: {
            id_mahasiswa: Number(id_mahasiswa),
          },
        },
      },
      include: {
        matakuliah: {
          select: {
            nama_mk: true,
            sks: true,
            semester: true,
          },
        },
        dosen: {
          select: {
            nama: true,
            nidn: true,
          },
        },
      },
      orderBy: {
        matakuliah: {
          nama_mk: "asc",
        },
      },
    });

    res.json({
      success: true,
      data: {
        mahasiswa: {
          id_mahasiswa: Number(id_mahasiswa),
          prodi: mahasiswa.prodi,
          angkatan: mahasiswa.angkatan,
        },
        available_kelas: availableKelas.map((kelas) => ({
          id_kelas: kelas.id_kelas,
          nama_mk: kelas.matakuliah.nama_mk,
          sks: kelas.matakuliah.sks,
          semester: kelas.matakuliah.semester,
          dosen: kelas.dosen.nama,
          nidn: kelas.dosen.nidn,
          tahun_ajaran: kelas.tahun_ajaran,
          kelas_semester: kelas.semester,
          sudah_diambil: false,
        })),
      },
    });
  } catch (error) {
    console.error("GET AVAILABLE KELAS ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// POST - Ambil KRS (mahasiswa)
router.post("/ambil", async (req, res) => {
  try {
    const { id_mahasiswa, id_kelas } = req.body;

    if (!id_mahasiswa || !id_kelas) {
      return res.status(400).json({
        error: "id_mahasiswa dan id_kelas wajib diisi",
      });
    }

    // Get data mahasiswa dan kelas
    const [mahasiswa, kelas] = await Promise.all([
      prisma.mahasiswa.findUnique({
        where: { id_mahasiswa: Number(id_mahasiswa) },
      }),
      prisma.kelas.findUnique({
        where: { id_kelas: Number(id_kelas) },
        include: {
          matakuliah: true,
          krs: true,
        },
      }),
    ]);

    if (!mahasiswa) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    }

    if (!kelas) {
      return res.status(404).json({ error: "Kelas tidak ditemukan" });
    }

    // Cek apakah sudah mengambil kelas ini
    const existingKRS = await prisma.krs.findFirst({
      where: {
        id_mahasiswa: Number(id_mahasiswa),
        id_kelas: Number(id_kelas),
      },
    });

    if (existingKRS) {
      return res.status(400).json({
        error: "Anda sudah mengambil mata kuliah ini",
      });
    }

    // Cek SKS
    const krsSemesterIni = await prisma.krs.findMany({
      where: {
        id_mahasiswa: Number(id_mahasiswa),
        semester: kelas.semester,
      },
      include: {
        kelas: {
          include: {
            matakuliah: {
              select: {
                sks: true,
              },
            },
          },
        },
      },
    });

    const currentSKS = krsSemesterIni.reduce((total, krsItem) => {
      return total + (krsItem.kelas.matakuliah.sks || 0);
    }, 0);

    const newTotalSKS = currentSKS + kelas.matakuliah.sks;

    if (newTotalSKS > 24) {
      return res.status(400).json({
        error: "Total SKS melebihi batas maksimal (24 SKS)",
        sks_sekarang: currentSKS,
        sks_mata_kuliah: kelas.matakuliah.sks,
        total_akan_menjadi: newTotalSKS,
      });
    }

    // Buat KRS
    const krs = await prisma.krs.create({
      data: {
        id_mahasiswa: Number(id_mahasiswa),
        id_kelas: Number(id_kelas),
        semester: kelas.semester,
      },
      include: {
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
          },
        },
        kelas: {
          include: {
            matakuliah: {
              select: {
                nama_mk: true,
                sks: true,
              },
            },
            dosen: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: "KRS berhasil diambil",
      data: krs,
      sks: {
        sebelumnya: currentSKS,
        ditambah: kelas.matakuliah.sks,
        total_sekarang: newTotalSKS,
      },
    });
  } catch (error) {
    console.error("AMBIL KRS ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// DELETE - Drop KRS (mahasiswa)
router.delete("/drop/:id_krs", async (req, res) => {
  try {
    const { id_krs } = req.params;
    const { id_mahasiswa } = req.body;

    const krs = await prisma.krs.findFirst({
      where: {
        id_krs: Number(id_krs),
        id_mahasiswa: Number(id_mahasiswa),
      },
      include: {
        kelas: {
          include: {
            matakuliah: true,
          },
        },
        nilai: true,
      },
    });

    if (!krs) {
      return res.status(404).json({
        error: "KRS tidak ditemukan atau bukan milik Anda",
      });
    }

    if (krs.nilai) {
      return res.status(400).json({
        error: "Tidak bisa drop KRS karena sudah ada nilai",
      });
    }

    await prisma.krs.delete({
      where: { id_krs: Number(id_krs) },
    });

    res.json({
      success: true,
      message: "KRS berhasil di-drop",
      data: {
        mata_kuliah: krs.kelas.matakuliah.nama_mk,
        sks: krs.kelas.matakuliah.sks,
      },
    });
  } catch (error) {
    console.error("DROP KRS ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// GET - Jadwal kuliah mahasiswa
router.get("/jadwal/:id_mahasiswa", async (req, res) => {
  try {
    const { id_mahasiswa } = req.params;
    const { semester, tahun_ajaran } = req.query;

    const whereClause: any = {
      id_mahasiswa: Number(id_mahasiswa),
    };

    if (semester) whereClause.semester = Number(semester);
    if (tahun_ajaran) {
      whereClause.kelas = {
        tahun_ajaran: tahun_ajaran as string,
      };
    }

    const jadwal = await prisma.krs.findMany({
      where: whereClause,
      include: {
        kelas: {
          include: {
            matakuliah: {
              select: {
                nama_mk: true,
                sks: true,
              },
            },
            dosen: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });

    const hasilJadwal = jadwal.map((j) => ({
      id_krs: j.id_krs,
      id_kelas: j.id_kelas,
      nama_mk: j.kelas.matakuliah.nama_mk,
      sks: j.kelas.matakuliah.sks,
      dosen: j.kelas.dosen.nama,
      hari: j.kelas.hari || "Belum dijadwalkan",
      semester: j.kelas.semester,
      tahun_ajaran: j.kelas.tahun_ajaran,
    }));

    const hariOrder = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Belum dijadwalkan",
    ];
    hasilJadwal.sort((a, b) => {
      const indexA = hariOrder.indexOf(a.hari);
      const indexB = hariOrder.indexOf(b.hari);
      return indexA - indexB;
    });

    const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const jadwalPerHari = hari.map((hari) => ({
      hari,
      mata_kuliah: hasilJadwal.filter((j) => j.hari === hari),
    }));

    const belumDijadwalkan = hasilJadwal.filter((j) => !hari.includes(j.hari));
    if (belumDijadwalkan.length > 0) {
      jadwalPerHari.push({
        hari: "Belum dijadwalkan",
        mata_kuliah: belumDijadwalkan,
      });
    }

    res.json({
      success: true,
      data: {
        jadwal_per_hari: jadwalPerHari,
        semua_matakuliah: hasilJadwal,
        total_sks: jadwal.reduce(
          (total, j) => total + j.kelas.matakuliah.sks,
          0
        ),
        total_matakuliah: jadwal.length,
      },
    });
  } catch (error) {
    console.error("GET JADWAL ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// ==================== COMMON ROUTES ====================

// GET KRS by mahasiswa ID
router.get("/mahasiswa/:id_mahasiswa", async (req, res) => {
  const { id_mahasiswa } = req.params;
  try {
    const krs = await prisma.krs.findMany({
      where: { id_mahasiswa: Number(id_mahasiswa) },
      include: {
        kelas: {
          include: {
            matakuliah: true,
            dosen: true,
          },
        },
        nilai: true,
      },
      orderBy: {
        semester: "desc",
      },
    });

    res.json({
      success: true,
      data: krs,
    });
  } catch (error) {
    console.log("GET KRS ERROR:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server",
      details: error.message,
    });
  }
});

export default router;
