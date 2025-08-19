-- CreateTable
CREATE TABLE "charity_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charity_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "img" TEXT,
    "city" TEXT,
    "country" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "links" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharityCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharityCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "charity_categories_slug_key" ON "charity_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "charities_slug_key" ON "charities"("slug");

-- CreateIndex
CREATE INDEX "_CharityCategories_B_index" ON "_CharityCategories"("B");

-- AddForeignKey
ALTER TABLE "_CharityCategories" ADD CONSTRAINT "_CharityCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "charities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharityCategories" ADD CONSTRAINT "_CharityCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "charity_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
