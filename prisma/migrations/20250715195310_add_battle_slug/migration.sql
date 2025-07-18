/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `battles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `battles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "battles" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "battles_slug_key" ON "battles"("slug");
