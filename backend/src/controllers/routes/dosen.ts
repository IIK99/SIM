import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { verifyToken } from "../../middleware/auth";
import { roleGuard } from "../../middleware/roleGuard";

const router = Router();
const prisma = new PrismaClient();

router.post("/register", verifyToken, roleGuard("admin"), async (req, res) => {
  try {
    const { username, password, nama, nidn } = req.body;

    if (!username || !password || !nama || !nidn) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "dosen",
      },
    });

    await prisma.dosen.create({
      data: {
        nama,
        nidn,
        id_user: user.id_user,
      },
    });

    res.json({ message: "Dosen berhasil didaftarkan" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

// get all dosen
router.get("/", async (req, res) => {
  try {
    const data = await prisma.dosen.findMany({
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

// get dosen by id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.dosen.findUnique({
      where: { id_dosen: id },
      include: {
        user: { select: { username: true, role: true } },
      },
    });

    if (!data) return res.status(404).json({ error: "Dosen tidak ditemukan" });

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama, nidn } = req.body;

    if (!nama || !nidn) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    await prisma.dosen.update({
      where: { id_dosen: id },
      data: { nama, nidn },
    });

    res.json({ message: "Data dosen berhasil diupdate" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Ambil id_user berdasarkan id_dosen
    const dosen = await prisma.dosen.findUnique({
      where: { id_dosen: id },
    });

    if (!dosen) {
      return res.status(404).json({ error: "Dosen tidak ditemukan" });
    }

    await prisma.dosen.delete({
      where: { id_dosen: id },
    });

    await prisma.user.delete({
      where: { id_user: dosen.id_user },
    });

    return res.json({ message: "Dosen beserta akun user berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

export default router;
