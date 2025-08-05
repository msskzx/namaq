/*
  Warnings:

  - You are about to drop the column `slug` on the `surahs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "surahs_slug_key";

-- AlterTable
ALTER TABLE "surahs" DROP COLUMN "slug",
ALTER COLUMN "order" DROP NOT NULL;
