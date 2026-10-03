-- AlterTable
ALTER TABLE "persons" DROP COLUMN "virtues";

-- CreateTable
CREATE TABLE "PersonVirtue" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "speakerName" TEXT,
    "speakerSlug" TEXT,
    "claimKey" TEXT,

    CONSTRAINT "PersonVirtue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonVirtue_personId_position_key" ON "PersonVirtue"("personId", "position");

-- AddForeignKey
ALTER TABLE "PersonVirtue" ADD CONSTRAINT "PersonVirtue_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

