/*
  Warnings:

  - You are about to drop the column `nasabRank` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `nasabRankComputedAt` on the `persons` table. All the data in the column will be lost.

  graphRank, computed over the unified graph, subsumes this family-only rank
  and covers every kind of subject. The pipeline that produced these columns
  is deleted in the same change, so the values are not recomputable -- see
  docs/graph-subject-search.md.
*/
-- AlterTable
ALTER TABLE "persons" DROP COLUMN "nasabRank",
DROP COLUMN "nasabRankComputedAt";
