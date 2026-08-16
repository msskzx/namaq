/*
  Warnings:

  - You are about to drop the `articles` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. All the data in the column will be lost.
  - You are about to drop the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the `charities` table. All the data in the column will be lost.
  - You are about to drop the `charity_categories` table. All the data in the column will be lost.
  - You are about to drop the `books` table. All the data in the column will be lost.
  - You are about to drop the `pages` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleToCategory` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToEvent` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleToEvent` table. All the data in the column will be lost.
  - You are about to drop the `_CharityCategories` table. All the data in the column will be lost.
  - You are about to drop the `_BookPeople` table. All the data in the column will be lost.
  - You are about to drop the `_PagePeople` table. All the data in the column will be lost.

  These content types (articles, categories, charities, books/pages) were
  removed from the app to narrow scope back to the person/graph/events
  learning loop. See README "Removed from scope" section.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToCategory" DROP CONSTRAINT "_ArticleToCategory_A_fkey";
ALTER TABLE "_ArticleToCategory" DROP CONSTRAINT "_ArticleToCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToEvent" DROP CONSTRAINT "_CategoryToEvent_A_fkey";
ALTER TABLE "_CategoryToEvent" DROP CONSTRAINT "_CategoryToEvent_B_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToEvent" DROP CONSTRAINT "_ArticleToEvent_A_fkey";
ALTER TABLE "_ArticleToEvent" DROP CONSTRAINT "_ArticleToEvent_B_fkey";

-- DropForeignKey
ALTER TABLE "_CharityCategories" DROP CONSTRAINT "_CharityCategories_A_fkey";
ALTER TABLE "_CharityCategories" DROP CONSTRAINT "_CharityCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_BookPeople" DROP CONSTRAINT "_BookPeople_A_fkey";
ALTER TABLE "_BookPeople" DROP CONSTRAINT "_BookPeople_B_fkey";

-- DropForeignKey
ALTER TABLE "_PagePeople" DROP CONSTRAINT "_PagePeople_A_fkey";
ALTER TABLE "_PagePeople" DROP CONSTRAINT "_PagePeople_B_fkey";

-- DropForeignKey
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_userId_fkey";
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_articleId_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_bookId_fkey";

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_authorId_fkey";

-- DropTable
DROP TABLE "_ArticleToCategory";

-- DropTable
DROP TABLE "_CategoryToEvent";

-- DropTable
DROP TABLE "_ArticleToEvent";

-- DropTable
DROP TABLE "_CharityCategories";

-- DropTable
DROP TABLE "_BookPeople";

-- DropTable
DROP TABLE "_PagePeople";

-- DropTable
DROP TABLE "user_progress";

-- DropTable
DROP TABLE "pages";

-- DropTable
DROP TABLE "articles";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "books";

-- DropTable
DROP TABLE "charities";

-- DropTable
DROP TABLE "charity_categories";
