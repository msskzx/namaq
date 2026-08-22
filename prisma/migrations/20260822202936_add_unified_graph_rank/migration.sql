-- AlterTable
ALTER TABLE "Title" ADD COLUMN     "clusterId" INTEGER,
ADD COLUMN     "graphRank" INTEGER,
ADD COLUMN     "graphRankComputedAt" TIMESTAMP(3),
ADD COLUMN     "layoutX" DOUBLE PRECISION,
ADD COLUMN     "layoutY" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "battles" ADD COLUMN     "clusterId" INTEGER,
ADD COLUMN     "graphRank" INTEGER,
ADD COLUMN     "graphRankComputedAt" TIMESTAMP(3),
ADD COLUMN     "layoutX" DOUBLE PRECISION,
ADD COLUMN     "layoutY" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "clusterId" INTEGER,
ADD COLUMN     "graphRank" INTEGER,
ADD COLUMN     "graphRankComputedAt" TIMESTAMP(3),
ADD COLUMN     "layoutX" DOUBLE PRECISION,
ADD COLUMN     "layoutY" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "persons" ADD COLUMN     "clusterId" INTEGER,
ADD COLUMN     "graphRank" INTEGER,
ADD COLUMN     "graphRankComputedAt" TIMESTAMP(3),
ADD COLUMN     "layoutX" DOUBLE PRECISION,
ADD COLUMN     "layoutY" DOUBLE PRECISION;
