/*
  Warnings:

  - You are about to drop the column `nameEn` on the `Title` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `battles` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEn` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `gregorianDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `hijriDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Title" DROP COLUMN "nameEn",
ADD COLUMN     "nameTransliterated" TEXT;

-- AlterTable
ALTER TABLE "battles" DROP COLUMN "nameEn",
ADD COLUMN     "nameTransliterated" TEXT;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "descriptionEn",
DROP COLUMN "nameEn",
ADD COLUMN     "descriptionTransliterated" TEXT,
ADD COLUMN     "nameTransliterated" TEXT;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "gregorianDate",
DROP COLUMN "hijriDate",
DROP COLUMN "nameEn",
ADD COLUMN     "nameTransliterated" TEXT;
