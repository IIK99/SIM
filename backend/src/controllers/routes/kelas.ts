import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST buat kelas baru
router.post("/", async (req, res) => {
  const { id_mk, id_dosen, tahun_ajaran, semester, hari } = req.body;

  if (!id_mk || !id_dosen || !tahun_ajaran || !semester) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  try {
    // Validasi semester (1-8)
    if (semester < 1 || semester > 8) {
      return res.status(400).json({ 
        error: "Semester harus antara 1-8" 
      });
    }

    // Validasi format tahun ajaran
    const tahunAjaranRegex = /^\d{4}\/\d{4}$/;
    if (!tahunAjaranRegex.test(tahun_ajaran)) {
      return res.status(400).json({ 
        error: "Format tahun ajaran harus YYYY/YYYY (contoh: 2024/2025)" 
      });
    }

    // Validasi hari (jika diisi)
    const validHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if (hari && !validHari.includes(hari)) {
      return res.status(400).json({ 
        error: "Hari harus Senin, Selasa, Rabu, Kamis, Jumat, atau Sabtu" 
      });
    }

    // Cek apakah mata kuliah exists
    const mataKuliah = await prisma.matakuliah.findUnique({
      where: { id_mk: Number(id_mk) }
    });

    if (!mataKuliah) {
      return res.status(404).json({ 
        error: "Mata kuliah tidak ditemukan" 
      });
    }

    // Cek apakah dosen exists
    const dosen = await prisma.dosen.findUnique({
      where: { id_dosen: Number(id_dosen) }
    });

    if (!dosen) {
      return res.status(404).json({ 
        error: "Dosen tidak ditemukan" 
      });
    }

    // Cek duplikat kelas
    const existingKelas = await prisma.kelas.findFirst({
      where: {
        id_mk: Number(id_mk),
        id_dosen: Number(id_dosen),
        tahun_ajaran,
        semester: Number(semester)
      }
    });

    if (existingKelas) {
      return res.status(400).json({ 
        error: "Kelas sudah ada untuk tahun ajaran dan semester ini" 
      });
    }

    const kelas = await prisma.kelas.create({
      data: {
        id_mk: Number(id_mk),
        id_dosen: Number(id_dosen),
        tahun_ajaran,
        semester: Number(semester),
        hari: hari || null
      },
      include: {
        matakuliah: {
          select: {
            nama_mk: true,
            sks: true,
            semester: true
          }
        },
        dosen: {
          select: {
            nama: true,
            nidn: true
          }
        }
      }
    });

    res.status(201).json({ 
      success: true,
      message: "Kelas berhasil dibuat", 
      data: kelas 
    });
  } catch (error) {
    console.log("CREATE KELAS ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// GET semua kelas dengan filter dan sorting
router.get("/", async (req, res) => {
  try {
    const { tahun_ajaran, semester, id_dosen, hari } = req.query;

    const whereClause: any = {};

    if (tahun_ajaran) whereClause.tahun_ajaran = tahun_ajaran;
    if (semester) whereClause.semester = Number(semester);
    if (id_dosen) whereClause.id_dosen = Number(id_dosen);
    if (hari) whereClause.hari = hari;

    const kelas = await prisma.kelas.findMany({
      where: whereClause,
      include: {
        matakuliah: {
          select: {
            nama_mk: true,
            sks: true,
            semester: true
          }
        },
        dosen: {
          select: {
            nama: true,
            nidn: true
          }
        },
        krs: {
          select: {
            id_krs: true,
            mahasiswa: {
              select: {
                nama: true,
                nim: true
              }
            }
          }
        }
      },
      orderBy: [
        { tahun_ajaran: 'desc' },
        { semester: 'asc' },
        { matakuliah: { nama_mk: 'asc' } }
      ]
    });

    res.json({
      success: true,
      data: kelas,
      total: kelas.length
    });
  } catch (error) {
    console.log("GET KELAS ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// GET kelas by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const kelas = await prisma.kelas.findUnique({
      where: { id_kelas: Number(id) },
      include: {
        matakuliah: true,
        dosen: true,
        krs: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                nim: true,
                prodi: true
              }
            }
          }
        }
      }
    });

    if (!kelas) {
      return res.status(404).json({ 
        error: "Kelas tidak ditemukan" 
      });
    }

    res.json({
      success: true,
      data: kelas
    });
  } catch (error) {
    console.log("GET KELAS BY ID ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// PUT update kelas
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_mk, id_dosen, tahun_ajaran, semester, hari } = req.body;

    // Cek apakah kelas exists
    const existingKelas = await prisma.kelas.findUnique({
      where: { id_kelas: Number(id) }
    });

    if (!existingKelas) {
      return res.status(404).json({ 
        error: "Kelas tidak ditemukan" 
      });
    }

    // Validasi hari (jika diisi)
    const validHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if (hari && !validHari.includes(hari)) {
      return res.status(400).json({ 
        error: "Hari harus Senin, Selasa, Rabu, Kamis, Jumat, atau Sabtu" 
      });
    }

    const updatedKelas = await prisma.kelas.update({
      where: { id_kelas: Number(id) },
      data: {
        ...(id_mk && { id_mk: Number(id_mk) }),
        ...(id_dosen && { id_dosen: Number(id_dosen) }),
        ...(tahun_ajaran && { tahun_ajaran }),
        ...(semester && { semester: Number(semester) }),
        ...(hari !== undefined && { hari })
      },
      include: {
        matakuliah: {
          select: {
            nama_mk: true,
            sks: true
          }
        },
        dosen: {
          select: {
            nama: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Kelas berhasil diupdate",
      data: updatedKelas
    });
  } catch (error) {
    console.log("UPDATE KELAS ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// DELETE kelas
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah kelas exists
    const existingKelas = await prisma.kelas.findUnique({
      where: { id_kelas: Number(id) }
    });

    if (!existingKelas) {
      return res.status(404).json({ 
        error: "Kelas tidak ditemukan" 
      });
    }

    // Cek apakah kelas sudah memiliki KRS
    const krsCount = await prisma.krs.count({
      where: { id_kelas: Number(id) }
    });

    if (krsCount > 0) {
      return res.status(400).json({ 
        error: "Tidak dapat menghapus kelas karena sudah memiliki mahasiswa yang mengambil" 
      });
    }

    await prisma.kelas.delete({
      where: { id_kelas: Number(id) }
    });

    res.json({
      success: true,
      message: "Kelas berhasil dihapus"
    });
  } catch (error) {
    console.log("DELETE KELAS ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// GET data untuk form create kelas (dropdown mata kuliah dan dosen)
router.get("/form-data/create", async (req, res) => {
  try {
    const [mataKuliah, dosen] = await Promise.all([
      prisma.matakuliah.findMany({
        select: {
          id_mk: true,
          nama_mk: true,
          sks: true,
          semester: true
        },
        orderBy: {
          nama_mk: 'asc'
        }
      }),
      prisma.dosen.findMany({
        select: {
          id_dosen: true,
          nama: true,
          nidn: true
        },
        orderBy: {
          nama: 'asc'
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        mataKuliah,
        dosen,
        hari: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      }
    });
  } catch (error) {
    console.log("GET FORM DATA ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// PATCH - Set jadwal/hari untuk kelas
router.patch("/:id/set-jadwal", async (req, res) => {
  try {
    const { id } = req.params;
    const { hari } = req.body;

    // Validasi hari
    const validHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if (!hari || !validHari.includes(hari)) {
      return res.status(400).json({ 
        error: "Hari harus diisi dengan Senin, Selasa, Rabu, Kamis, Jumat, atau Sabtu" 
      });
    }

    // Cek apakah kelas exists
    const existingKelas = await prisma.kelas.findUnique({
      where: { id_kelas: Number(id) }
    });

    if (!existingKelas) {
      return res.status(404).json({ 
        error: "Kelas tidak ditemukan" 
      });
    }

    const updatedKelas = await prisma.kelas.update({
      where: { id_kelas: Number(id) },
      data: {
        hari: hari
      },
      include: {
        matakuliah: {
          select: {
            nama_mk: true,
            sks: true
          }
        },
        dosen: {
          select: {
            nama: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Jadwal kelas berhasil diupdate",
      data: updatedKelas
    });
  } catch (error) {
    console.log("SET JADWAL ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

export default router;