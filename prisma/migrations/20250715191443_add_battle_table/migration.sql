-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "hijri_year" INTEGER,
    "nameEn" TEXT,
    "locationEn" TEXT,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);
