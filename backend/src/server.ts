import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./controllers/routes/auth";
import apiRoutes from "./controllers/routes/api";
import dosenRoutes from "./controllers/routes/dosen";
import mahasiswaRoutes from "./controllers/routes/mahasiswa";
import mataKuliahRoutes from "./controllers/routes/mataKuliah";
import kelas from "./controllers/routes/kelas";
import krsRoutes from "./controllers/routes/krs";
import nilaiRoutes from "./controllers/routes/nilai";
import khsRoutes from "./controllers/routes/khs";
import transkripRoutes from "./controllers/routes/transkip";
import { requireRole, verifyToken } from "./middleware/auth";

console.log("🔧 Environment check:");
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ Loaded" : "❌ Missing"
);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", verifyToken, apiRoutes);
app.use("/auth", authRoutes);
app.use("/dosen", verifyToken, requireRole(["admin", "dosen"]), dosenRoutes);
app.use(
  "/mahasiswa",
  verifyToken,
  requireRole(["admin", "mahasiswa"]),
  mahasiswaRoutes
);
app.use(
  "/mata-kuliah",
  verifyToken,
  requireRole(["admin", "dosen"]),
  mataKuliahRoutes
);
app.use("/kelas", verifyToken, requireRole(["admin", "dosen"]), kelas);
app.use("/krs", verifyToken, requireRole(["mahasiswa", "admin"]), krsRoutes);
app.use(
  "/nilai",
  verifyToken,
  requireRole(["admin", "dosen", "mahasiswa"]),
  nilaiRoutes
);
app.use("/khs", verifyToken, requireRole(["admin", "mahasiswa"]), khsRoutes);
app.use(
  "/transkrip",
  verifyToken,
  requireRole(["admin", "mahasiswa"]),
  transkripRoutes
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    database: process.env.DATABASE_URL ? "Connected" : "Not configured",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(
    `📊 Database: ${process.env.DATABASE_URL ? "Configured" : "Missing"}`
  );
});
