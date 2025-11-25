-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mahasiswa` (
    `id_mahasiswa` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `prodi` VARCHAR(191) NOT NULL,
    `angkatan` INTEGER NOT NULL,

    UNIQUE INDEX `Mahasiswa_id_user_key`(`id_user`),
    UNIQUE INDEX `Mahasiswa_nim_key`(`nim`),
    PRIMARY KEY (`id_mahasiswa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dosen` (
    `id_dosen` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nidn` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Dosen_id_user_key`(`id_user`),
    UNIQUE INDEX `Dosen_nidn_key`(`nidn`),
    PRIMARY KEY (`id_dosen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MataKuliah` (
    `id_mk` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_mk` VARCHAR(191) NOT NULL,
    `sks` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL,

    PRIMARY KEY (`id_mk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kelas` (
    `id_kelas` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mk` INTEGER NOT NULL,
    `id_dosen` INTEGER NOT NULL,
    `tahun_ajaran` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,

    PRIMARY KEY (`id_kelas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KRS` (
    `id_krs` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mahasiswa` INTEGER NOT NULL,
    `id_kelas` INTEGER NOT NULL,

    PRIMARY KEY (`id_krs`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nilai` (
    `id_nilai` INTEGER NOT NULL AUTO_INCREMENT,
    `id_krs` INTEGER NOT NULL,
    `nilai_angka` INTEGER NOT NULL,

    UNIQUE INDEX `Nilai_id_krs_key`(`id_krs`),
    PRIMARY KEY (`id_nilai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dosen` ADD CONSTRAINT `Dosen_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kelas` ADD CONSTRAINT `Kelas_id_mk_fkey` FOREIGN KEY (`id_mk`) REFERENCES `MataKuliah`(`id_mk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kelas` ADD CONSTRAINT `Kelas_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `Dosen`(`id_dosen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KRS` ADD CONSTRAINT `KRS_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `Mahasiswa`(`id_mahasiswa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KRS` ADD CONSTRAINT `KRS_id_kelas_fkey` FOREIGN KEY (`id_kelas`) REFERENCES `Kelas`(`id_kelas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_id_krs_fkey` FOREIGN KEY (`id_krs`) REFERENCES `KRS`(`id_krs`) ON DELETE RESTRICT ON UPDATE CASCADE;
