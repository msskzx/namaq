/*
  A participation answered two questions through one status array: whether the
  person was at the battle, and what happened to them there. ABSENT_EXCUSED
  answered the first while sitting among answers to the second, so an
  unannotated row asserted presence -- see
  docs/adr/0013-separate-attendance-from-outcome.md.

  Attendance moves to a relation column. The two relations admit disjoint
  status sets, which npm run catalog:validate enforces; Postgres cannot, since
  status is an array.

  The two rows carrying ABSENT_EXCUSED today (Uthman ibn Affan at Badr, Ali ibn
  Abi Talib at Tabuk) move to ABSENT_FROM and keep their status. Their stale
  PARTICIPATED_IN edges in Neo4j are removed by hand, because battles:sync only
  ever MERGEs; the Cypher is in docs/battle-participation-model.md.

  courage becomes summary: the same per-participation text, named for what it
  holds rather than for valour it presupposed, which had nothing to say about a
  capture, a death, or an absence.
*/
-- CreateEnum
CREATE TYPE "ParticipationRelation" AS ENUM ('PARTICIPATED_IN', 'ABSENT_FROM');

-- AlterTable
ALTER TABLE "BattleParticipation"
  ADD COLUMN "relation" "ParticipationRelation" NOT NULL DEFAULT 'PARTICIPATED_IN';

ALTER TABLE "BattleParticipation" RENAME COLUMN "courage" TO "summary";

-- Backfill: every row recorded as absent becomes one, keeping its status.
UPDATE "BattleParticipation"
  SET "relation" = 'ABSENT_FROM'
  WHERE 'ABSENT_EXCUSED' = ANY ("status");
