-- CreateTable
CREATE TABLE "model_units" (
    "unit" TEXT NOT NULL,
    "work" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "kitab" TEXT,
    "bab" TEXT,
    "view" JSONB NOT NULL,

    CONSTRAINT "model_units_pkey" PRIMARY KEY ("unit")
);

-- CreateTable
CREATE TABLE "model_unit_links" (
    "fromUnit" TEXT NOT NULL,
    "toUnit" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "basis" TEXT NOT NULL,

    CONSTRAINT "model_unit_links_pkey" PRIMARY KEY ("fromUnit","toUnit","kind")
);

-- CreateIndex
CREATE INDEX "model_units_work_idx" ON "model_units"("work");

-- CreateIndex
CREATE INDEX "model_unit_links_toUnit_idx" ON "model_unit_links"("toUnit");

