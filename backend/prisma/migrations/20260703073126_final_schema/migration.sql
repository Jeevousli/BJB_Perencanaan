/*
  Warnings:

  - Added the required column `tanggalPublikasi` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPenyusun` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "tanggalPublikasi" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "unitPenyusun" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "master_beranda" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "label" TEXT,
    "imageUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_beranda_pkey" PRIMARY KEY ("id")
);
