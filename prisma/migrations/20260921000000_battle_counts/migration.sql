-- How many each side put in the field, and how many of each side died. Four
-- columns rather than two because the sources count the sides separately; the
-- catalog takes one figure per column and competing figures stay as DISPUTED
-- claims. See src/lib/catalog/types.ts for the fields and the catalog modules
-- for which reading each battle takes.
ALTER TABLE "battles" ADD COLUMN "muslimForceCount" INTEGER;
ALTER TABLE "battles" ADD COLUMN "nonMuslimForceCount" INTEGER;
ALTER TABLE "battles" ADD COLUMN "muslimDeathCount" INTEGER;
ALTER TABLE "battles" ADD COLUMN "nonMuslimDeathCount" INTEGER;
