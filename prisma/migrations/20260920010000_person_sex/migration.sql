-- MALE or FEMALE. A string rather than an enum, matching battles.engagement, so
-- a vocabulary change needs no migration; src/lib/catalog/types.ts holds it and
-- validateCatalog enforces it. It resolves a reciprocal relation whose inverse
-- depends on the person's sex (FATHER pairs with SON or DAUGHTER).
ALTER TABLE "persons" ADD COLUMN "sex" TEXT;
