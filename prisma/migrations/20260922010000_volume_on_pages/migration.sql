-- The volume moves from the account to the page. An account is a run of pages,
-- and a run can cross a binding: the sira is 497 pages of السيرة النبوية ج١ and
-- 491 of ج٢, and a link on the account could only name one, which filed the
-- whole of it under the first and reported the second as unread. The page is
-- what gets bound, so the page carries it.
ALTER TABLE "source_account_pages" ADD COLUMN "volumeId" TEXT;

CREATE INDEX "source_account_pages_volumeId_idx" ON "source_account_pages"("volumeId");

ALTER TABLE "source_account_pages" ADD CONSTRAINT "source_account_pages_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "source_volumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Nothing is lost: the account's link was set by the previous migration's
-- import, and the pages are filled again from the batches on the next import.
ALTER TABLE "source_accounts" DROP CONSTRAINT "source_accounts_volumeId_fkey";

ALTER TABLE "source_accounts" DROP COLUMN "volumeId";
