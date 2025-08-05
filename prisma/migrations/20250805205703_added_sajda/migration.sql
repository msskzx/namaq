/*
  Warnings:

  - You are about to drop the column `revealedPeriod` on the `surahs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ayahs" ADD COLUMN     "revelationOrder" INTEGER,
ADD COLUMN     "revelationPeriod" TEXT,
ADD COLUMN     "revelationType" "RevelationType",
ADD COLUMN     "sajdaObligatory" BOOLEAN,
ADD COLUMN     "sajdaRecommended" BOOLEAN;

-- AlterTable
ALTER TABLE "surahs" DROP COLUMN "revealedPeriod",
ADD COLUMN     "revelationPeriod" TEXT;
