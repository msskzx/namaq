/*
  Warnings:

  - You are about to drop the column `sourceAccountId` on the `citations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "citations" DROP CONSTRAINT "citations_sourceAccountId_fkey";

-- AlterTable
ALTER TABLE "citations" DROP COLUMN "sourceAccountId";
