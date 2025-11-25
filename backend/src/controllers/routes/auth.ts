import { Router, Request, Response } from "express";
import { login, register } from "../authController";
import { verifyToken } from "../../middleware/auth";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Auth routes
router.post("/login", login);
router.post("/register", register);

// GET user profile
router.get("/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id_user;

    const user = await prisma.user.findUnique({
      where: { id_user: userId },
      select: {
        id_user: true,
        username: true,
        role: true,
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

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Format response based on role
    let profileData: any = {
      id_user: user.id_user,
      username: user.username,
      role: user.role,
    };

    if (user.role === "dosen" && user.dosen) {
      profileData = {
        ...profileData,
        id_dosen: user.dosen.id_dosen,
        nama: user.dosen.nama,
        nidn: user.dosen.nidn,
      };
    } else if (user.role === "mahasiswa" && user.mahasiswa) {
      profileData = {
        ...profileData,
        id_mahasiswa: user.mahasiswa.id_mahasiswa,
        nama: user.mahasiswa.nama,
        nim: user.mahasiswa.nim,
        prodi: user.mahasiswa.prodi,
        angkatan: user.mahasiswa.angkatan,
      };
    } else if (user.role === "admin") {
      profileData.nama = "Administrator";
    }

    res.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server",
      details: error.message,
    });
  }
});

// GET all users (admin only)
router.get("/users", verifyToken, async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Akses ditolak. Hanya admin yang bisa mengakses." });
    }

    const users = await prisma.user.findMany({
      select: {
        id_user: true,
        username: true,
        role: true,
        dosen: {
          select: {
            nama: true,
            nidn: true,
          },
        },
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
            prodi: true,
          },
        },
      },
      orderBy: {
        id_user: "asc",
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server",
      details: error.message,
    });
  }
});

export default router;
