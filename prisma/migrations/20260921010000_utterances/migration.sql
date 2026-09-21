-- Something someone said, in verse or in prose, as its own record. A profile
-- field held what is said about a person; this holds what a person said, which
-- the sira is full of and the model had nowhere for. See
-- docs/adr/0015-one-record-for-what-someone-said.md.
CREATE TABLE "utterances" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "textArabic" TEXT NOT NULL,
    "speakerId" TEXT,
    "speakerName" TEXT,
    "subjectId" TEXT,
    "eventId" TEXT,
    "battleId" TEXT,
    "grading" TEXT,
    "occasion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utterances_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "utterances_slug_key" ON "utterances"("slug");

ALTER TABLE "utterances" ADD CONSTRAINT "utterances_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "utterances" ADD CONSTRAINT "utterances_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "utterances" ADD CONSTRAINT "utterances_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "utterances" ADD CONSTRAINT "utterances_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "battles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
