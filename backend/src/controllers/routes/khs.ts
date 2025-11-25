import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET semua semester yang ada nilai (untuk dropdown)
router.get("/semester/:id_mahasiswa", async (req, res) => {
  const { id_mahasiswa } = req.params;

  try {
    // Validasi parameter
    if (!id_mahasiswa) {
      return res.status(400).json({
        error: "Parameter id_mahasiswa diperlukan"
      });
    }

    const semestersWithGrades = await prisma.krs.findMany({
      where: {
        id_mahasiswa: Number(id_mahasiswa),
        nilai: { isNot: null }
      },
      distinct: ['semester'],
      select: {
        semester: true,
        kelas: {
          select: {
            tahun_ajaran: true
          }
        }
      },
      orderBy: {
        semester: 'asc'
      }
    });

    // Format response
    const semesterList = semestersWithGrades.map(item => ({
      semester: item.semester,
      tahun_ajaran: item.kelas.tahun_ajaran,
      label: `Semester ${item.semester} - ${item.kelas.tahun_ajaran}`
    }));

    res.json({
      success: true,
      data: semesterList
    });

  } catch (error) {
    console.error("GET SEMESTER LIST ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// GET ringkasan IPK (Indeks Prestasi Kumulatif)
router.get("/ipk/:id_mahasiswa", async (req, res) => {
  const { id_mahasiswa } = req.params;

  try {
    // Validasi parameter
    if (!id_mahasiswa) {
      return res.status(400).json({
        error: "Parameter id_mahasiswa diperlukan"
      });
    }

    // Get semua nilai dengan KRS data
    const allNilai = await prisma.nilai.findMany({
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
      }
    });

    if (allNilai.length === 0) {
      return res.json({
        success: true,
        data: {
          ipk: 0,
          total_sks: 0,
          total_matakuliah: 0,
          semester_selesai: 0,
          predikat: "Belum ada nilai"
        }
      });
    }

    // Hitung IPK
    let totalSKS = 0;
    let totalBobot = 0;
    const completedSemesters = new Set();

    allNilai.forEach(item => {
      const sks = item.krs.kelas.matakuliah.sks;
      let bobot = 0;
      
      switch (item.nilai_huruf) {
        case "A": bobot = 4; break;
        case "B": bobot = 3; break;
        case "C": bobot = 2; break;
        case "D": bobot = 1; break;
        case "E": bobot = 0; break;
        default: bobot = 0;
      }

      totalSKS += sks;
      totalBobot += sks * bobot;
      completedSemesters.add(item.krs.semester);
    });

    const ipk = totalSKS > 0 ? (totalBobot / totalSKS) : 0;

    res.json({
      success: true,
      data: {
        ipk: Number(ipk.toFixed(2)),
        total_sks: totalSKS,
        total_matakuliah: allNilai.length,
        semester_selesai: completedSemesters.size,
        predikat: getPredikatIpk(ipk)
      }
    });

  } catch (error) {
    console.error("GET IPK ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

// Helper function untuk predikat IPK
function getPredikatIpk(ipk: number): string {
  if (ipk >= 3.5) return "Cum Laude";
  if (ipk >= 3.0) return "Sangat Memuaskan";
  if (ipk >= 2.5) return "Memuaskan";
  if (ipk >= 2.0) return "Cukup";
  return "Kurang";
}

// View KHS berdasarkan mahasiswa dan semester
router.get("/:id_mahasiswa/:semester", async (req, res) => {
  const { id_mahasiswa, semester } = req.params;

  try {
    // Validasi parameter
    if (!id_mahasiswa || !semester) {
      return res.status(400).json({
        error: "Parameter id_mahasiswa dan semester diperlukan"
      });
    }

    // Get data mahasiswa
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id_mahasiswa: Number(id_mahasiswa) },
      select: { nama: true, nim: true, prodi: true, angkatan: true }
    });

    if (!mahasiswa) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    }

    // Get data nilai
    const data = await prisma.nilai.findMany({
      where: {
        krs: {
          id_mahasiswa: Number(id_mahasiswa),
          semester: Number(semester)
        }
      },
      include: {
        krs: {
          include: {
            kelas: {
              include: { 
                matakuliah: true,
                dosen: {
                  select: {
                    nama: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        krs: {
          kelas: {
            matakuliah: {
              nama_mk: 'asc'
            }
          }
        }
      }
    });

    if (data.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Data KHS tidak ditemukan untuk semester tersebut" 
      });
    }

    // Format data KHS yang lebih rapi
    const mata_kuliah = data.map((item) => {
      const mk = item.krs.kelas.matakuliah;
      const sks = mk.sks;

      // Hitung bobot nilai
      let bobot = 0;
      switch (item.nilai_huruf) {
        case "A": bobot = 4; break;
        case "B": bobot = 3; break;
        case "C": bobot = 2; break;
        case "D": bobot = 1; break;
        case "E": bobot = 0; break;
        default: bobot = 0;
      }

      return {
        kode_mk: `MK${mk.id_mk.toString().padStart(3, '0')}`,
        nama_mk: mk.nama_mk,
        sks: sks,
        nilai: {
          angka: item.nilai_angka,
          huruf: item.nilai_huruf,
          tugas: item.nilai_tugas,
          uts: item.nilai_uts,
          uas: item.nilai_uas,
          akhir: item.nilai_akhir
        },
        dosen: item.krs.kelas.dosen.nama,
        bobot: bobot,
        total_bobot: sks * bobot
      };
    });

    // Hitung IPS
    const total_sks = mata_kuliah.reduce((acc, val) => acc + val.sks, 0);
    const total_bobot = mata_kuliah.reduce((acc, val) => acc + val.total_bobot, 0);
    const ips = total_sks > 0 ? (total_bobot / total_sks) : 0;

    // Get tahun ajaran
    const tahunAjaran = data[0]?.krs?.kelas?.tahun_ajaran || "2024/2025";

    res.json({ 
      success: true,
      data: {
        // Header info
        identitas: {
          nama: mahasiswa.nama,
          nim: mahasiswa.nim,
          prodi: mahasiswa.prodi,
          angkatan: mahasiswa.angkatan,
          semester: Number(semester),
          tahun_ajaran: tahunAjaran
        },
        
        // Data mata kuliah - format vertikal
        mata_kuliah: mata_kuliah,
        
        // Ringkasan
        ringkasan: {
          total_matakuliah: data.length,
          total_sks: total_sks,
          total_bobot: total_bobot,
          ips: Number(ips.toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error("GET KHS ERROR:", error);
    res.status(500).json({ 
      error: "Terjadi kesalahan server",
      details: error.message 
    });
  }
});

export default router;