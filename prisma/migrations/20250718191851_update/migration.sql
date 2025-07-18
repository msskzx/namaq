/*
  Warnings:

  - You are about to drop the column `nameAr` on the `Title` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Title" DROP COLUMN "nameAr",
ADD COLUMN     "nameEn" TEXT;
