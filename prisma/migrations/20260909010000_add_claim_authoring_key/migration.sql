-- AlterTable
ALTER TABLE "historical_claims" ADD COLUMN     "authoringKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "historical_claims_authoringKey_key" ON "historical_claims"("authoringKey");

