-- A work is bound in volumes and the edition decides how many, so a volume
-- belongs to the source: two editions of one work divide it differently. They
-- are recorded whether or not anything has been read from them, which is the
-- point -- a reader can see a work runs to twenty-five volumes and that two of
-- them have been read.
--
-- `number` is position in the edition's own reading order rather than the
-- number on the spine: this edition opens with two appended sira volumes
-- before the numbered series begins.
CREATE TABLE "source_volumes" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "source_volumes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "source_volumes_sourceId_number_key" ON "source_volumes"("sourceId", "number");

ALTER TABLE "source_volumes" ADD CONSTRAINT "source_volumes_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "historical_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Nullable: an entry may be read before its edition's volumes are recorded,
-- and an account spanning two volumes can only name the one it opens in. The
-- existing free-text `volume` column stays for what the batch actually wrote.
ALTER TABLE "source_accounts" ADD COLUMN "volumeId" TEXT;

ALTER TABLE "source_accounts" ADD CONSTRAINT "source_accounts_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "source_volumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
