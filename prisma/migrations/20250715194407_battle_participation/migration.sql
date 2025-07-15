/*
  Warnings:

  - You are about to drop the `Battle` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('DIED', 'INJURED', 'CAPTURED', 'WAS_CAPTURED', 'ABSENT');

-- DropTable
DROP TABLE "Battle";

-- CreateTable
CREATE TABLE "battles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "hijri_year" INTEGER,
    "nameEn" TEXT,
    "locationEn" TEXT,

    CONSTRAINT "battles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleParticipation" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "battleId" TEXT NOT NULL,
    "isMuslim" BOOLEAN NOT NULL,
    "status" "ParticipationStatus"[],

    CONSTRAINT "BattleParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BattleParticipation_personId_battleId_key" ON "BattleParticipation"("personId", "battleId");

-- AddForeignKey
ALTER TABLE "BattleParticipation" ADD CONSTRAINT "BattleParticipation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleParticipation" ADD CONSTRAINT "BattleParticipation_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "battles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
