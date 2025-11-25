import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hash,
        role,
      },
    });

    return res.json({ message: "Register berhasil", user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { username: username },
      include: {
        dosen: {
          select: {
            id_dosen: true,
            nama: true,
            nidn: true,
          },
        },
        mahasiswa: {
          select: {
            id_mahasiswa: true,
            nama: true,
            nim: true,
            prodi: true,
            angkatan: true,
          },
        },
      },
    });

    if (!user)
      return res.status(400).json({ message: "Username tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: "Password salah" });

    // Prepare payload based on role
    let userPayload: any = {
      id_user: user.id_user,
      username: user.username,
      role: user.role,
    };

    // Add role-specific data
    if (user.role === "dosen" && user.dosen) {
      userPayload.id_dosen = user.dosen.id_dosen;
      userPayload.nama = user.dosen.nama;
      userPayload.nidn = user.dosen.nidn;
    } else if (user.role === "mahasiswa" && user.mahasiswa) {
      userPayload.id_mahasiswa = user.mahasiswa.id_mahasiswa;
      userPayload.nama = user.mahasiswa.nama;
      userPayload.nim = user.mahasiswa.nim;
      userPayload.prodi = user.mahasiswa.prodi;
      userPayload.angkatan = user.mahasiswa.angkatan;
    } else if (user.role === "admin") {
      userPayload.nama = "Administrator";
    }

    const token = jwt.sign(
      userPayload,
      process.env.JWT_SECRET || "rahasia_sangat_rahasia",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: userPayload,
      role: user.role, // Keep for backward compatibility if needed
    });
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
