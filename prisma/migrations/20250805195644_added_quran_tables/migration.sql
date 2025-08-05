/*
  Warnings:

  - Made the column `createdAt` on table `BattleParticipation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `BattleParticipation` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RevelationType" AS ENUM ('Meccan', 'Medinan');

-- CreateEnum
CREATE TYPE "RecitationType" AS ENUM ('HAFS', 'WARSH');

-- AlterTable
ALTER TABLE "BattleParticipation" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "surahs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameTransliterated" TEXT,
    "nameTranslated" TEXT,
    "order" INTEGER NOT NULL,
    "numberOfAyat" INTEGER NOT NULL,
    "revelationType" "RevelationType",
    "revealedPeriod" TEXT,
    "revelationOrder" INTEGER,
    "slug" TEXT NOT NULL,
    "recitation" "RecitationType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surahs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayahs" (
    "id" TEXT NOT NULL,
    "surahId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "recitation" "RecitationType",
    "text" TEXT NOT NULL,
    "numberInSurah" INTEGER NOT NULL,
    "juz" INTEGER NOT NULL,
    "manzil" INTEGER NOT NULL,
    "page" INTEGER NOT NULL,
    "ruku" INTEGER NOT NULL,
    "hizbQuarter" INTEGER NOT NULL,
    "sajda" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayahs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "surahs_slug_key" ON "surahs"("slug");

-- AddForeignKey
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
