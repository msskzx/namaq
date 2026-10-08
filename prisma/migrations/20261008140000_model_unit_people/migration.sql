-- CreateTable
CREATE TABLE "model_unit_people" (
    "id" SERIAL NOT NULL,
    "unit" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "model_unit_people_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "model_unit_people_person_idx" ON "model_unit_people"("person");

-- CreateIndex
CREATE UNIQUE INDEX "model_unit_people_unit_person_role_key" ON "model_unit_people"("unit", "person", "role");
