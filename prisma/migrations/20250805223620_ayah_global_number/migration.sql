/*
  Warnings:

  - You are about to drop the column `numberInSurah` on the `ayahs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ayahs" DROP COLUMN "numberInSurah",
ADD COLUMN     "globalNumber" INTEGER;
