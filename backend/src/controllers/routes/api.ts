import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// ==================== DASHBOARD DATA ====================

// GET dashboard data for mahasiswa
router.get("/mahasiswa/dashboard/:id_mahasiswa", verifyToken, async (req: any, res) => {
  try {
    const { id_mahasiswa } = req.params;

    // Verify ownership
    if (req.user.role === "mahasiswa" && req.user.id_mahasiswa !== Number(id_mahasiswa)) {
      return res.status(403).json({ error: "Tidak dapat mengakses data mahasiswa lain" });
    }

    // Get mahasiswa data
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id_mahasiswa: Number(id_mahasiswa) },
      select: { nama: true, nim: true, prodi: true, angkatan: true }
    });

    if (!mahasiswa) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    }

    // Get current semester KRS count
    const currentSemesterKRS = await prisma.krs.findMany({
      where: { 
        id_mahasiswa: Number(id_mahasiswa),
        semester: 1 // Adjust based on your logic
      },
      include: {
        kelas: {
          include: {
            matakuliah: true
          }
        }
      }
    });

    // Get total SKS
    const totalSKS = currentSemesterKRS.reduce((total, krs) => total + krs.kelas.matakuliah.sks, 0);

    // Get today's schedule
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = days[new Date().getDay()];
    
    const jadwalHariIni = await prisma.krs.findMany({
      where: {
        id_mahasiswa: Number(id_mahasiswa),
        kelas: {
          hari: today
        }
      },
      include: {
        kelas: {
          include: {
            matakuliah: true,
            dosen: {
              select: { nama: true }
            }
          }
        }
      }
    });

    // Get recent grades
    const nilaiTerbaru = await prisma.nilai.findMany({
      where: {
        krs: {
          id_mahasiswa: Number(id_mahasiswa)
        }
      },
      include: {
        krs: {
          include: {
            kelas: {
              include: {
                matakuliah: true
              }
            }
          }
        }
      },
      orderBy: { updated_at: 'desc' },
      take: 3
    });

    res.json({
      success: true,
      data: {
        mahasiswa,
        statistik: {
          total_matakuliah: currentSemesterKRS.length,
          total_sks: totalSKS,
          jadwal_hari_ini: jadwalHariIni.length
        },
        jadwal_hari_ini: jadwalHariIni.map(j => ({
          mata_kuliah: j.kelas.matakuliah.nama_mk,
          dosen: j.kelas.dosen.nama,
          hari: j.kelas.hari
          // HAPUS RUANGAN
        })),
        nilai_terbaru: nilaiTerbaru.map(n => ({
          mata_kuliah: n.krs.kelas.matakuliah.nama_mk,
          nilai_huruf: n.nilai_huruf,
          nilai_akhir: n.nilai_akhir,
          updated_at: n.updated_at
        }))
      }
    });

  } catch (error) {
    console.error("DASHBOARD MAHASISWA ERROR:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// GET dashboard data for dosen
router.get("/dosen/dashboard/:id_dosen", verifyToken, async (req: any, res) => {
  try {
    const { id_dosen } = req.params;

    // Verify ownership
    if (req.user.role === "dosen" && req.user.id_dosen !== Number(id_dosen)) {
      return res.status(403).json({ error: "Tidak dapat mengakses data dosen lain" });
    }

    // Get dosen data
    const dosen = await prisma.dosen.findUnique({
      where: { id_dosen: Number(id_dosen) },
      select: { nama: true, nidn: true }
    });

    if (!dosen) {
      return res.status(404).json({ error: "Dosen tidak ditemukan" });
    }

    // Get classes taught
    const kelasDiajar = await prisma.kelas.findMany({
      where: { id_dosen: Number(id_dosen) },
      include: {
        matakuliah: true,
        krs: {
          include: {
            mahasiswa: true
          }
        }
      }
    });

    // Get today's classes
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = days[new Date().getDay()];
    
    const kelasHariIni = await prisma.kelas.findMany({
      where: {
        id_dosen: Number(id_dosen),
        hari: today
      },
      include: {
        matakuliah: true
      }
    });

    // Get grading statistics
    const totalMahasiswa = kelasDiajar.reduce((total, kelas) => total + kelas.krs.length, 0);
    const totalSudahDinilai = await prisma.nilai.count({
      where: {
        krs: {
          kelas: {
            id_dosen: Number(id_dosen)
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        dosen,
        statistik: {
          total_kelas: kelasDiajar.length,
          total_mahasiswa: totalMahasiswa,
          total_sudah_dinilai: totalSudahDinilai,
          kelas_hari_ini: kelasHariIni.length
        },
        kelas_hari_ini: kelasHariIni.map(k => ({
          mata_kuliah: k.matakuliah.nama_mk,
          hari: k.hari,
          // HAPUS RUANGAN
          tahun_ajaran: k.tahun_ajaran
        })),
        kelas_terbaru: kelasDiajar.slice(0, 3).map(k => ({
          mata_kuliah: k.matakuliah.nama_mk,
          total_mahasiswa: k.krs.length,
          semester: k.semester
        }))
      }
    });

  } catch (error) {
    console.error("DASHBOARD DOSEN ERROR:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// GET dashboard data for admin
router.get("/admin/dashboard", verifyToken, async (req: any, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Akses ditolak. Hanya admin yang bisa mengakses." });
    }

    // Get statistics
    const [
      totalMahasiswa,
      totalDosen,
      totalMatakuliah,
      totalKelas,
      recentUsers
    ] = await Promise.all([
      prisma.mahasiswa.count(),
      prisma.dosen.count(),
      prisma.matakuliah.count(),
      prisma.kelas.count(),
      prisma.user.findMany({
        orderBy: { id_user: 'desc' },
        take: 5,
        include: {
          mahasiswa: {
            select: { nama: true, nim: true }
          },
          dosen: {
            select: { nama: true, nidn: true }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        statistik: {
          total_mahasiswa: totalMahasiswa,
          total_dosen: totalDosen,
          total_matakuliah: totalMatakuliah,
          total_kelas: totalKelas
        },
        pengguna_terbaru: recentUsers.map(user => ({
          username: user.username,
          role: user.role,
          nama: user.mahasiswa?.nama || user.dosen?.nama || 'Administrator',
          identifier: user.mahasiswa?.nim || user.dosen?.nidn || '-'
        }))
      }
    });

  } catch (error) {
    console.error("DASHBOARD ADMIN ERROR:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// ==================== SEARCH ENDPOINTS ====================

// GET search mahasiswa
router.get("/search/mahasiswa", verifyToken, async (req: any, res) => {
  try {
    const { q, prodi } = req.query;

    const whereClause: any = {};
    
    if (q) {
      whereClause.OR = [
        { nama: { contains: q as string } },
        { nim: { contains: q as string } }
      ];
    }

    if (prodi) {
      whereClause.prodi = prodi;
    }

    const mahasiswa = await prisma.mahasiswa.findMany({
      where: whereClause,
      select: {
        id_mahasiswa: true,
        nama: true,
        nim: true,
        prodi: true,
        angkatan: true
      },
      orderBy: { nama: 'asc' },
      take: 20
    });

    res.json({
      success: true,
      data: mahasiswa
    });

  } catch (error) {
    console.error("SEARCH MAHASISWA ERROR:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// GET search dosen
router.get("/search/dosen", verifyToken, async (req: any, res) => {
  try {
    const { q } = req.query;

    const whereClause: any = {};
    
    if (q) {
      whereClause.OR = [
        { nama: { contains: q as string } },
        { nidn: { contains: q as string } }
      ];
    }

    const dosen = await prisma.dosen.findMany({
      where: whereClause,
      select: {
        id_dosen: true,
        nama: true,
        nidn: true
      },
      orderBy: { nama: 'asc' },
      take: 20
    });

    res.json({
      success: true,
      data: dosen
    });

  } catch (error) {
    console.error("SEARCH DOSEN ERROR:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// ==================== STATISTICS ====================

// GET statistics for charts
router.get("/statistics/overview", verifyToken, async (req: any, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const [
      mahasiswaPerProdi,
      kelasPerSemester,
      nilaiDistribution
    ] = await Promise.all([
      // Mahasiswa per prodi
      prisma.mahasiswa.groupBy({
        by: ['prodi'],
        _count: { id_mahasiswa: true }
      }),
      // Kelas per semester
      prisma.kelas.groupBy({
        by: ['semester'],
        _count: { id_kelas: true }
      }),
      // Distribusi nilai
      prisma.nilai.groupBy({
        by: ['nilai_huruf'],
        _count: { id_nilai: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        mahasiswa_per_prodi: mahasiswaPerProdi,
        kelas_per_semester: kelasPerSemester,
        distribusi_nilai: nilaiDistribution
      }
    });

  } catch (error) {
    console.error("STATISTICS ERROR:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

export default router;