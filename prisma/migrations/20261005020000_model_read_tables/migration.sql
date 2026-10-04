-- CreateTable
CREATE TABLE "model_spans" (
    "unit" TEXT NOT NULL,
    "spanId" TEXT NOT NULL,
    "witness" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "page" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "model_spans_pkey" PRIMARY KEY ("unit","spanId")
);

-- CreateTable
CREATE TABLE "model_profile_entries" (
    "unit" TEXT NOT NULL,
    "assertionId" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "predicate" TEXT NOT NULL,
    "parts" TEXT[],
    "text" TEXT NOT NULL,
    "parsed" INTEGER,
    "classified" TEXT,
    "object" TEXT,
    "objectMention" TEXT,
    "origins" JSONB NOT NULL,
    "spanIds" TEXT[],
    "statementIds" TEXT[],
    "status" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "reviewed" BOOLEAN NOT NULL,

    CONSTRAINT "model_profile_entries_pkey" PRIMARY KEY ("unit","assertionId","agent")
);

-- CreateIndex
CREATE INDEX "model_spans_witness_volume_page_idx" ON "model_spans"("witness", "volume", "page");

-- CreateIndex
CREATE INDEX "model_profile_entries_agent_idx" ON "model_profile_entries"("agent");

