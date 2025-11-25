import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      return res.status(400).json({ message: "Username tidak ditemukan" });
    }

    const cekPassword = await bcrypt.compare(password, user.password);
    if (!cekPassword) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return res.json({ message: "Login berhasil", token });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

// GET /auth/profile - Get user profile based on token
router.get("/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id_user: userId },
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Format response berdasarkan role
    let profileData;
    if (user.role === "mahasiswa" && user.mahasiswa) {
      profileData = {
        id_user: user.id_user,
        username: user.username,
        role: user.role,
        mahasiswa: user.mahasiswa,
      };
    } else if (user.role === "dosen" && user.dosen) {
      profileData = {
        id_user: user.id_user,
        username: user.username,
        role: user.role,
        dosen: user.dosen,
      };
    } else {
      profileData = {
        id_user: user.id_user,
        username: user.username,
        role: user.role,
      };
    }

    return res.json(profileData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
});

export default router;
