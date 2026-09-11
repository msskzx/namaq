/*
  A battle-type event was a shadow of the battle it pointed at: same name, year
  and location, with a people list that competed with the battle's own
  participations. Battles carry everything about a battle, so events now cover
  only what is not one, and the link between them is gone.

  The nine rows using this type were deleted before this migration; they were
  seed data, never authored through the catalog, so no tombstone is owed.
*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_battleId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "battleId";

-- AlterEnum
-- Postgres cannot drop a value from an enum in place, so the type is rebuilt.
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('BIRTH', 'DEATH', 'MARRIAGE', 'GAVE_BIRTH', 'LIBERATED', 'MET', 'TRAVEL', 'HIJRA', 'HIJRA_HABASHA', 'OTHER');
ALTER TABLE "events" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
