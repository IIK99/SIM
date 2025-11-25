import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createDosen = async (req: Request, res: Response) => {
  try {
    const { username, password, nama, nidn } = req.body;

    if (!username || !password || !nama || !nidn) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    // Cek username apakah sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username sudah digunakan" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke tabel user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "dosen"
      }
    });

    // Simpan ke tabel dosen
    await prisma.dosen.create({
      data: {
        nama,
        nidn,
        id_user: user.id_user
      }
    });

    return res.json({ message: "Dosen berhasil ditambahkan" });

  } catch (error) {
    console.error("❌ ERROR CREATE DOSEN:", error);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};