-- Distinguishes a غزوة the Prophet led in person from a سرية he sent without
-- going, and both from an engagement outside his campaigns. A string rather
-- than an enum so a new kind needs no migration; src/lib/catalog/types.ts holds
-- the vocabulary and validateCatalog enforces it.
ALTER TABLE "battles" ADD COLUMN "engagement" TEXT;
