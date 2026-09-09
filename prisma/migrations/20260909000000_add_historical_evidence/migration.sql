-- DropForeignKey
ALTER TABLE "person_claims" DROP CONSTRAINT "person_claims_personId_fkey";

-- DropForeignKey
ALTER TABLE "person_claims" DROP CONSTRAINT "person_claims_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "relationship_claims" DROP CONSTRAINT "relationship_claims_sourceId_fkey";

-- DropTable
DROP TABLE "person_claims";

-- DropTable
DROP TABLE "relationship_claims";

-- Recreate the review-status enum. Its values now describe editorial progress
-- only; the legacy DRAFT/PUBLISHED workflow is gone with the tables that used it.
DROP TYPE "ClaimReviewStatus";
CREATE TYPE "ClaimReviewStatus" AS ENUM ('NOT_REVIEWED', 'IN_REVIEW', 'REVIEWED');

-- CreateEnum
CREATE TYPE "SubjectKind" AS ENUM ('PERSON', 'TITLE', 'BATTLE', 'EVENT');

-- CreateEnum
CREATE TYPE "PassageKind" AS ENUM ('BODY', 'NOTE');

-- AlterTable
ALTER TABLE "historical_sources" ADD COLUMN     "digitalHost" TEXT;

-- CreateTable
CREATE TABLE "review_batches" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "revision" TEXT NOT NULL,
    "summaryPath" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "importedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_claims" (
    "id" TEXT NOT NULL,
    "subjectKind" "SubjectKind" NOT NULL,
    "subjectSlug" TEXT NOT NULL,
    "field" TEXT,
    "assertion" TEXT NOT NULL,
    "relationshipType" TEXT,
    "relatedSubjectKind" "SubjectKind",
    "relatedSubjectSlug" TEXT,
    "confidence" "ClaimConfidence" NOT NULL DEFAULT 'UNASSESSED',
    "reviewStatus" "ClaimReviewStatus" NOT NULL DEFAULT 'NOT_REVIEWED',
    "reviewerNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "disputed" BOOLEAN NOT NULL DEFAULT false,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historical_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_accounts" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "subjectKind" "SubjectKind" NOT NULL,
    "subjectSlug" TEXT NOT NULL,
    "entryIdentifier" TEXT,
    "titleArabic" TEXT,
    "volume" TEXT,
    "extractionUrl" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_account_pages" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "printedPage" TEXT,
    "bodyMarkdown" TEXT NOT NULL,
    "notesMarkdown" TEXT,
    "extractionUrl" TEXT,

    CONSTRAINT "source_account_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_passages" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "kind" "PassageKind" NOT NULL DEFAULT 'BODY',
    "excerpt" TEXT NOT NULL,

    CONSTRAINT "source_passages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citations" (
    "id" TEXT NOT NULL,
    "claimId" TEXT,
    "subjectKind" "SubjectKind" NOT NULL,
    "subjectSlug" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "accountId" TEXT,
    "passageId" TEXT,
    "paragraphKey" TEXT,
    "footnoteNumber" INTEGER,
    "volume" TEXT,
    "pageReference" TEXT,
    "extractionUrl" TEXT NOT NULL,
    "excerptArabic" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_batches_slug_key" ON "review_batches"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "review_batches_slug_revision_key" ON "review_batches"("slug", "revision");

-- CreateIndex
CREATE INDEX "historical_claims_subjectKind_subjectSlug_idx" ON "historical_claims"("subjectKind", "subjectSlug");

-- CreateIndex
CREATE INDEX "historical_claims_subjectSlug_relationshipType_relatedSubje_idx" ON "historical_claims"("subjectSlug", "relationshipType", "relatedSubjectSlug");

-- CreateIndex
CREATE INDEX "source_accounts_subjectKind_subjectSlug_idx" ON "source_accounts"("subjectKind", "subjectSlug");

-- CreateIndex
CREATE UNIQUE INDEX "source_accounts_sourceId_subjectKind_subjectSlug_key" ON "source_accounts"("sourceId", "subjectKind", "subjectSlug");

-- CreateIndex
CREATE INDEX "source_account_pages_accountId_printedPage_idx" ON "source_account_pages"("accountId", "printedPage");

-- CreateIndex
CREATE UNIQUE INDEX "source_account_pages_accountId_sequence_key" ON "source_account_pages"("accountId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "source_passages_pageId_anchor_key" ON "source_passages"("pageId", "anchor");

-- CreateIndex
CREATE INDEX "citations_subjectKind_subjectSlug_idx" ON "citations"("subjectKind", "subjectSlug");

-- CreateIndex
CREATE INDEX "citations_claimId_idx" ON "citations"("claimId");

-- AddForeignKey
ALTER TABLE "historical_claims" ADD CONSTRAINT "historical_claims_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "review_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_accounts" ADD CONSTRAINT "source_accounts_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "historical_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_accounts" ADD CONSTRAINT "source_accounts_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "review_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_account_pages" ADD CONSTRAINT "source_account_pages_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "source_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_passages" ADD CONSTRAINT "source_passages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "source_account_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "historical_claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "historical_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "source_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "source_passages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

