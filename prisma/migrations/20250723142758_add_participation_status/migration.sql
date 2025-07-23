/*
  Warnings:

  - The values [ABSENT] on the enum `ParticipationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ParticipationStatus_new" AS ENUM ('DIED', 'INJURED', 'CAPTURED', 'WAS_CAPTURED', 'ABSENT_EXCUSED');
ALTER TABLE "BattleParticipation" ALTER COLUMN "status" TYPE "ParticipationStatus_new"[] USING ("status"::text::"ParticipationStatus_new"[]);
ALTER TYPE "ParticipationStatus" RENAME TO "ParticipationStatus_old";
ALTER TYPE "ParticipationStatus_new" RENAME TO "ParticipationStatus";
DROP TYPE "ParticipationStatus_old";
COMMIT;
