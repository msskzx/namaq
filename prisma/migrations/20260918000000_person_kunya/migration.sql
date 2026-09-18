/*
  A kunya is part of a person's name, not an honour conferred on them, so it is
  a column rather than a Title row -- see docs/adr/0014-a-kunya-is-a-name.md.
  Titles are graph nodes, and a shared kunya would join people who have nothing
  in common but what their eldest son was called.
*/
-- AlterTable
ALTER TABLE "persons" ADD COLUMN "kunya" TEXT;
