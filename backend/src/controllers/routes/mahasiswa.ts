import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { verifyToken } from "../../middleware/auth";
import { roleGuard } from "../../middleware/roleGuard";

const router = Router();
const prisma = new PrismaClient();

router.post("/register", verifyToken, roleGuard("admin"), async (req, res) => {
  try {
    const { username, password, nama, nim, prodi, angkatan } = req.body;

    if (!username || !password || !nama || !nim || !prodi || !angkatan) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "mahasiswa",
      },
    });

    await prisma.mahasiswa.create({
      data: {
        nama,
        nim,
        prodi,
        angkatan: Number(angkatan),
        id_user: user.id_user,
      },
    });

    res.json({ message: "Mahasiswa berhasil didaftarkan" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

// get all mahasiswa
router.get("/", async (req, res) => {
  try {
    const data = await prisma.mahasiswa.findMany({
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

// get mahasiswa by id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.mahasiswa.findUnique({
      where: { id_mahasiswa: id },
      include: {
        user: { select: { username: true, role: true } },
      },
    });

    if (!data)
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama, nim, prodi, angkatan } = req.body;

    if (!nama || !nim || !prodi || !angkatan) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    await prisma.mahasiswa.update({
      where: { id_mahasiswa: id },
      data: { nama, nim, prodi, angkatan: Number(angkatan) },
    });

    res.json({ message: "Data mahasiswa berhasil diupdate" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id_mahasiswa: id },
    });

    if (!mahasiswa) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    }

    await prisma.mahasiswa.delete({
      where: { id_mahasiswa: id },
    });

    await prisma.user.delete({
      where: { id_user: mahasiswa.id_user },
    });

    return res.json({
      message: "Mahasiswa beserta akun user berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

export default router;
