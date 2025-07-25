/*
  Warnings:

  - The `hijriYear` column on the `events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gregorianYear` column on the `events` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "battles" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "gregorianPeriod" TEXT,
ADD COLUMN     "hijriPeriod" TEXT,
DROP COLUMN "hijriYear",
ADD COLUMN     "hijriYear" INTEGER,
DROP COLUMN "gregorianYear",
ADD COLUMN     "gregorianYear" INTEGER;
