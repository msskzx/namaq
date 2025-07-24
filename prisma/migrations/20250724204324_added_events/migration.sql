-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BIRTH', 'DEATH', 'MARRIAGE', 'BATTLE', 'GAVE_BIRTH', 'LIBERATED', 'MET', 'TRAVEL', 'HIJRA', 'HIJRA_HABASHA');

-- AlterTable
ALTER TABLE "battles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "persons" ADD COLUMN     "bioTextSiyarArabic" TEXT,
ADD COLUMN     "bioTextSiyarSummaryEn" TEXT,
ADD COLUMN     "birthYearGregorian" TEXT,
ADD COLUMN     "birthYearHijri" TEXT,
ADD COLUMN     "deathYearGregorian" TEXT,
ADD COLUMN     "deathYearHijri" TEXT,
ADD COLUMN     "nameTransliterated" TEXT,
ADD COLUMN     "placeOfBirthArabic" TEXT,
ADD COLUMN     "placeOfBirthTransliterated" TEXT,
ADD COLUMN     "placeOfDeathArabic" TEXT,
ADD COLUMN     "placeOfDeathTransliterated" TEXT,
ADD COLUMN     "siyarSourcePageEnd" TEXT,
ADD COLUMN     "siyarSourcePageStart" TEXT,
ADD COLUMN     "siyarSourceVolume" TEXT;

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "hijriYear" TEXT,
    "gregorianYear" TEXT,
    "hijriDate" TEXT,
    "gregorianDate" TIMESTAMP(3),
    "location" TEXT,
    "locationTransliterated" TEXT,
    "description" TEXT,
    "descriptionTransliterated" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "battleId" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToPerson_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventToPerson_B_index" ON "_EventToPerson"("B");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "battles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToPerson" ADD CONSTRAINT "_EventToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToPerson" ADD CONSTRAINT "_EventToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
