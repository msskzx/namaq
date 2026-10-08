-- CreateTable
CREATE TABLE "catalog_orderings" (
    "earlier" TEXT NOT NULL,
    "later" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "claims" JSONB NOT NULL,

    CONSTRAINT "catalog_orderings_pkey" PRIMARY KEY ("earlier","later","source")
);
