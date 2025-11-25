import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- DEBUGGING DATABASE STATE ---");

  console.log("\n1. USERS (Role: dosen)");
  const users = await prisma.user.findMany({
    where: { role: "dosen" },
    select: { id_user: true, username: true },
  });
  console.table(users);

  console.log("\n2. DOSEN TABLE");
  const dosen = await prisma.dosen.findMany({
    select: { id_dosen: true, nama: true, nidn: true, id_user: true },
  });
  console.table(dosen);

  console.log("\n3. KELAS TABLE");
  const kelas = await prisma.kelas.findMany({
    include: {
      dosen: { select: { nama: true } },
      matakuliah: { select: { nama_mk: true } },
    },
  });

  const formattedKelas = kelas.map((k) => ({
    id_kelas: k.id_kelas,
    mk: k.matakuliah.nama_mk,
    dosen_nama: k.dosen.nama,
    id_dosen: k.id_dosen,
    hari: k.hari,
  }));
  console.table(formattedKelas);

  console.log("\n--- ANALYSIS ---");
  users.forEach((u) => {
    const d = dosen.find((d) => d.id_user === u.id_user);
    if (d) {
      console.log(
        `✅ User '${u.username}' (ID: ${u.id_user}) is linked to Dosen '${d.nama}' (ID: ${d.id_dosen})`
      );
      const k = kelas.filter((k) => k.id_dosen === d.id_dosen);
      console.log(`   -> Has ${k.length} classes assigned.`);
    } else {
      console.log(
        `❌ User '${u.username}' (ID: ${u.id_user}) is NOT linked to any Dosen record!`
      );
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
