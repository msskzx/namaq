-- CreateTable
CREATE TABLE "quran_topics" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "themeId" TEXT,
    "surah" INTEGER NOT NULL,
    "ayahFrom" INTEGER NOT NULL,
    "ayahTo" INTEGER NOT NULL,
    "excerptAr" TEXT NOT NULL,
    "alternativeOf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quran_topics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quran_topics_surah_idx" ON "quran_topics"("surah");

-- CreateIndex
CREATE UNIQUE INDEX "quran_topics_surah_slug_key" ON "quran_topics"("surah", "slug");
