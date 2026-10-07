-- CreateTable
CREATE TABLE "catalog_date_parts" (
    "kind" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "month" INTEGER,
    "day" INTEGER,

    CONSTRAINT "catalog_date_parts_pkey" PRIMARY KEY ("kind","slug")
);
