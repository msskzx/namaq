---
status: accepted
---

# A page belongs to the edition, not to the entry

A printed page is a fact about the edition, so `SourcePage` belongs to a
`SourceVolume` and is identified by `(volume, printedPage)`. A `SourceAccount`
stops owning text and becomes a span: the work's entry about one subject, from
its first printed page to its last. Citations resolve through the passage to the
page and the volume, and never through an account.

Until now a page belonged to the account that extracted it, which let one
printed page hold two different texts. Printed page 230 of volume 4 exists twice
at the same Shamela id, 413 characters under Zaid ibn Harithah and 402 under
Abdullah ibn Rawahah, because the entry boundary falls inside the page and each
batch kept its own half. Forty-one pages are split this way across 67 of the
88 batches, and three more are held twice in full, where the work places a short
entry inside a longer one. The alternative — keeping the split, so a page record means "the
part of this page belonging to this entry" — was rejected because it makes a
page's content depend on who read it, which is the mistake ADR 0010 already
rules out for values, and because it permanently prevents reading the book
continuously.

The same ownership hid a class of error. Three accounts declared a volume their
own pages contradict, and a fourth recorded pages from a different edition
against this one; each collided with a page another account already held,
without any check firing, because a duplicate was normal and so a misfiling
looked like one. The three came from reading the digital host's own volume
label, which numbers the Siyar's parts without counting the sira and caliph
volumes this edition binds before them.

## Consequences

Passage anchors become derived rather than declared. Paragraph *n* of a page
file is `<volume>/<printedPage>-p<n>`, computed on read, so the authored list
that `passageExcerpts` zipped to the text by position no longer exists and
cannot drift from it. Because an anchor now names a stable page, a passage
survives re-import, and `Citation.passageId` stops being deleted and recreated
on every run.

`SourceAccountPage.sequence` and `Citation.accountId` are both dropped. Ordering
within a volume is by printed page, and the reader's address becomes the volume
and the printed page rather than an account and an ordinal. Links already
emitted in the old form are not translated; the app is not yet released.

Publishing a page and publishing a batch become separate acts. A page is
referenced by every batch whose entry touches it, so it cannot be governed by
one subject's review, and transcribing a source stays distinct from reviewing
claims against it (ADR 0008).
