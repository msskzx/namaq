-- AlterTable
ALTER TABLE "source_volumes" ADD COLUMN     "skippedPrintedPages" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
