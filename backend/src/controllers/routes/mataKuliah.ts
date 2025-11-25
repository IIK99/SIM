import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { nama_mk, sks, semester } = req.body;

  if (!nama_mk || !sks || !semester) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  try {
    const mk = await prisma.matakuliah.create({
      data: { nama_mk, sks: Number(sks), semester: Number(semester) }
    });
    res.json({ message: "Mata kuliah berhasil ditambahkan", mk });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.get("/", async (req, res) => {
  try {
    const mk = await prisma.matakuliah.findMany();
    res.json(mk);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nama_mk, sks, semester } = req.body;

  try {
    await prisma.matakuliah.update({
      where: { id_mk: id },
      data: { nama_mk, sks: Number(sks), semester: Number(semester) }
    });

    res.json({ message: "Mata kuliah berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.matakuliah.delete({ where: { id_mk: id } });
    res.json({ message: "Mata kuliah berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default router;
