import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET transkrip nilai lengkap mahasiswa
router.get("/:id_mahasiswa", async (req: any, res) => {
  try {
    const { id_mahasiswa } = req.params;

    // Validasi parameter
    if (!id_mahasiswa) {
      return res.status(400).json({
        error: "Parameter id_mahasiswa diperlukan",
      });
    }

    // Get data mahasiswa
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id_mahasiswa: Number(id_mahasiswa) },
      select: {
        nama: true,
        nim: true,
        prodi: true,
        angkatan: true,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({
        error: "Mahasiswa tidak ditemukan",
      });
    }

    // Get semua nilai mahasiswa
    const semuaNilai = await prisma.nilai.findMany({
      where: {
        krs: {
          id_mahasiswa: Number(id_mahasiswa),
        },
      },
      include: {
        krs: {
          include: {
            kelas: {
              include: {
                matakuliah: true,
                dosen: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { krs: { semester: "asc" } },
        { krs: { kelas: { matakuliah: { nama_mk: "asc" } } } },
      ],
    });

    if (semuaNilai.length === 0) {
      return res.json({
        success: true,
        data: {
          identitas: {
            nama: mahasiswa.nama,
            nim: mahasiswa.nim,
            prodi: mahasiswa.prodi,
            angkatan: mahasiswa.angkatan,
          },
          transkrip: [],
          ipk: 0,
          total_sks: 0,
          total_semester: 0,
        },
      });
    }

    // Group by semester
    const transkripPerSemester: any = {};
    let totalSKS = 0;
    let totalBobot = 0;
    const completedSemesters = new Set();

    semuaNilai.forEach((item) => {
      const semester = item.krs.semester;
      const mk = item.krs.kelas.matakuliah;
      const sks = mk.sks;

      // Hitung bobot nilai
      let bobot = 0;
      switch (item.nilai_huruf) {
        case "A":
          bobot = 4;
          break;
        case "B":
          bobot = 3;
          break;
        case "C":
          bobot = 2;
          break;
        case "D":
          bobot = 1;
          break;
        case "E":
          bobot = 0;
          break;
        default:
          bobot = 0;
      }

      const mataKuliahData = {
        nama_mk: mk.nama_mk,
        sks: sks,
        nilai_huruf: item.nilai_huruf,
        nilai_angka: item.nilai_angka,
        bobot: bobot,
      };

      if (!transkripPerSemester[semester]) {
        transkripPerSemester[semester] = {
          semester: semester,
          tahun_ajaran: item.krs.kelas.tahun_ajaran,
          mata_kuliah: [],
          total_sks: 0,
          total_bobot: 0,
          ips: 0,
        };
      }

      transkripPerSemester[semester].mata_kuliah.push(mataKuliahData);
      transkripPerSemester[semester].total_sks += sks;
      transkripPerSemester[semester].total_bobot += sks * bobot;

      // Hitung total untuk IPK
      totalSKS += sks;
      totalBobot += sks * bobot;
      completedSemesters.add(semester);
    });

    // Hitung IPS per semester dan format output
    const transkrip = Object.values(transkripPerSemester).map(
      (semester: any) => ({
        semester: semester.semester,
        tahun_ajaran: semester.tahun_ajaran,
        mata_kuliah: semester.mata_kuliah,
        ips:
          semester.total_sks > 0
            ? Number((semester.total_bobot / semester.total_sks).toFixed(2))
            : 0,
        total_sks: semester.total_sks,
      })
    );

    // Hitung IPK
    const ipk = totalSKS > 0 ? Number((totalBobot / totalSKS).toFixed(2)) : 0;

    res.json({
      success: true,
      data: {
        identitas: {
          nama: mahasiswa.nama,
          nim: mahasiswa.nim,
          prodi: mahasiswa.prodi,
          angkatan: mahasiswa.angkatan,
        },
        transkrip: transkrip,
        ipk: ipk,
        total_sks: totalSKS,
        total_semester: completedSemesters.size,
      },
    });
  } catch (error) {
    console.error("GET TRANSKRIP ERROR:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default router;
