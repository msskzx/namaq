/*
  Warnings:

  - You are about to drop the column `categoryId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `contentAr` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionAr` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `titleAr` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionAr` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `nameAr` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_categoryId_fkey";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "categoryId",
DROP COLUMN "color",
DROP COLUMN "contentAr",
DROP COLUMN "description",
DROP COLUMN "descriptionAr",
DROP COLUMN "icon",
DROP COLUMN "isActive",
DROP COLUMN "order",
DROP COLUMN "titleAr",
ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "color",
DROP COLUMN "descriptionAr",
DROP COLUMN "icon",
DROP COLUMN "isActive",
DROP COLUMN "nameAr",
DROP COLUMN "order",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- CreateTable
CREATE TABLE "_ArticleToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArticleToCategory_B_index" ON "_ArticleToCategory"("B");

-- AddForeignKey
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
