/*
  Warnings:

  - You are about to drop the column `ayat` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `bioTextSiyarArabic` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `bioTextSiyarSummaryEn` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `siyarSourcePageEnd` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `siyarSourcePageStart` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `siyarSourceVolume` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the `PersonRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PersonRelation" DROP CONSTRAINT "PersonRelation_fromId_fkey";

-- DropForeignKey
ALTER TABLE "PersonRelation" DROP CONSTRAINT "PersonRelation_toId_fkey";

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "ayat",
DROP COLUMN "bioTextSiyarArabic",
DROP COLUMN "bioTextSiyarSummaryEn",
DROP COLUMN "siyarSourcePageEnd",
DROP COLUMN "siyarSourcePageStart",
DROP COLUMN "siyarSourceVolume";

-- DropTable
DROP TABLE "PersonRelation";

-- DropEnum
DROP TYPE "RelationType";

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "chapter" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PersonAyahs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PersonAyahs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BookPeople" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookPeople_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PagePeople" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PagePeople_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pages_bookId_page_chapter_key" ON "pages"("bookId", "page", "chapter");

-- CreateIndex
CREATE INDEX "_PersonAyahs_B_index" ON "_PersonAyahs"("B");

-- CreateIndex
CREATE INDEX "_BookPeople_B_index" ON "_BookPeople"("B");

-- CreateIndex
CREATE INDEX "_PagePeople_B_index" ON "_PagePeople"("B");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonAyahs" ADD CONSTRAINT "_PersonAyahs_A_fkey" FOREIGN KEY ("A") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonAyahs" ADD CONSTRAINT "_PersonAyahs_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookPeople" ADD CONSTRAINT "_BookPeople_A_fkey" FOREIGN KEY ("A") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookPeople" ADD CONSTRAINT "_BookPeople_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PagePeople" ADD CONSTRAINT "_PagePeople_A_fkey" FOREIGN KEY ("A") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PagePeople" ADD CONSTRAINT "_PagePeople_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
