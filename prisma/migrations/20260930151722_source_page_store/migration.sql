/*
  Warnings:

  - You are about to drop the column `accountId` on the `citations` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `source_accounts` table. All the data in the column will be lost.
  - You are about to drop the `source_account_pages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "citations" DROP CONSTRAINT "citations_accountId_fkey";

-- DropForeignKey
ALTER TABLE "source_account_pages" DROP CONSTRAINT "source_account_pages_accountId_fkey";

-- DropForeignKey
ALTER TABLE "source_account_pages" DROP CONSTRAINT "source_account_pages_volumeId_fkey";

-- DropForeignKey
ALTER TABLE "source_passages" DROP CONSTRAINT "source_passages_pageId_fkey";

-- AlterTable
ALTER TABLE "citations" DROP COLUMN "accountId",
ADD COLUMN     "sourceAccountId" TEXT;

-- AlterTable
ALTER TABLE "source_accounts" DROP COLUMN "volume";

-- AlterTable
ALTER TABLE "source_volumes" ADD COLUMN     "firstPrintedPage" INTEGER,
ADD COLUMN     "lastPrintedPage" INTEGER;

-- DropTable
DROP TABLE "source_account_pages";

-- CreateTable
CREATE TABLE "source_account_spans" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "volumeId" TEXT NOT NULL,
    "firstPrintedPage" INTEGER NOT NULL,
    "lastPrintedPage" INTEGER NOT NULL,

    CONSTRAINT "source_account_spans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_pages" (
    "id" TEXT NOT NULL,
    "volumeId" TEXT NOT NULL,
    "printedPage" INTEGER NOT NULL,
    "bodyMarkdown" TEXT NOT NULL,
    "notesMarkdown" TEXT,
    "extractionUrl" TEXT,
    "accessedAt" TIMESTAMP(3),

    CONSTRAINT "source_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "source_account_spans_accountId_volumeId_key" ON "source_account_spans"("accountId", "volumeId");

-- CreateIndex
CREATE UNIQUE INDEX "source_pages_volumeId_printedPage_key" ON "source_pages"("volumeId", "printedPage");

-- AddForeignKey
ALTER TABLE "source_account_spans" ADD CONSTRAINT "source_account_spans_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "source_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_account_spans" ADD CONSTRAINT "source_account_spans_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "source_volumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_pages" ADD CONSTRAINT "source_pages_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "source_volumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_passages" ADD CONSTRAINT "source_passages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "source_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "source_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
