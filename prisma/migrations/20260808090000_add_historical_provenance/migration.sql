-- Claims are kept separately from display content so editorial confidence and
-- publication status apply to individual historical assertions, not a person.
CREATE TYPE "ClaimConfidence" AS ENUM ('ESTABLISHED', 'LIKELY', 'DISPUTED', 'UNASSESSED');
CREATE TYPE "ClaimReviewStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'REVIEWED', 'PUBLISHED');

CREATE TABLE "historical_sources" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "editor" TEXT,
    "publisher" TEXT,
    "publicationYear" TEXT,
    "edition" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "historical_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "person_claims" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "assertion" TEXT NOT NULL,
    "field" TEXT,
    "volume" TEXT,
    "pageReference" TEXT,
    "confidence" "ClaimConfidence" NOT NULL DEFAULT 'UNASSESSED',
    "reviewStatus" "ClaimReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewerNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "person_claims_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "relationship_claims" (
    "id" TEXT NOT NULL,
    "sourcePersonSlug" TEXT NOT NULL,
    "targetPersonSlug" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "assertion" TEXT NOT NULL,
    "volume" TEXT,
    "pageReference" TEXT,
    "confidence" "ClaimConfidence" NOT NULL DEFAULT 'UNASSESSED',
    "reviewStatus" "ClaimReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewerNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "relationship_claims_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "historical_sources_slug_key" ON "historical_sources"("slug");
CREATE INDEX "person_claims_personId_reviewStatus_idx" ON "person_claims"("personId", "reviewStatus");
CREATE INDEX "person_claims_sourceId_idx" ON "person_claims"("sourceId");
CREATE UNIQUE INDEX "relationship_claims_source_target_type_source_key" ON "relationship_claims"("sourcePersonSlug", "targetPersonSlug", "relationshipType", "sourceId");
CREATE INDEX "relationship_claims_source_target_type_review_idx" ON "relationship_claims"("sourcePersonSlug", "targetPersonSlug", "relationshipType", "reviewStatus");

ALTER TABLE "person_claims" ADD CONSTRAINT "person_claims_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "person_claims" ADD CONSTRAINT "person_claims_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "historical_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "relationship_claims" ADD CONSTRAINT "relationship_claims_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "historical_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
