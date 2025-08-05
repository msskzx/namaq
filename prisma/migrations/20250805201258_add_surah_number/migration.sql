/*
  Warnings:

  - You are about to drop the column `order` on the `surahs` table. All the data in the column will be lost.
  - Added the required column `number` to the `surahs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "surahs" DROP COLUMN "order",
ADD COLUMN     "number" INTEGER NOT NULL;
