/*
  Warnings:

  - You are about to drop the column `hijri_year` on the `battles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "battles" DROP COLUMN "hijri_year",
ADD COLUMN     "gregorianPeriod" TEXT,
ADD COLUMN     "gregorianYear" INTEGER,
ADD COLUMN     "hijriPeriod" TEXT,
ADD COLUMN     "hijriYear" INTEGER;
