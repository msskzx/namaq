-- AlterTable
ALTER TABLE "BattleParticipation" ADD COLUMN     "courage" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
