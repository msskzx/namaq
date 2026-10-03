---
status: accepted
---

# A virtue is one entry with one speaker

A person's `virtues` is a list. Each entry is one virtue, in the exact wording
of one speaker, backed by the claim that already exists for it. The speaker is
al-Dhahabi when he narrates or when he reports a named person's verdict in his
own sentence (`شَهِدَ لَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِالجَنَّةِ`).
A companion's or the Prophet's own words are an entry of their own that names
the speaker, shown as "قال X: …". Two speakers never share an entry, and nobody's
words appear without their name.

The catalog held `virtues` as one string, assembled from several claims
(`virtues-messenger`, `virtues-trade`, …), so a paragraph of al-Dhahabi's
narration was joined to a companion's testimony and the result read as one
voice. A single string cannot say who is speaking or where one virtue ends,
and it forced a quiz question to quote every virtue at once.

The alternative, keeping a string and excluding every quoted speaker, would drop
the Prophet's testimonies, which are among the most important virtues a source
records. A list with a named speaker keeps them without borrowing
al-Dhahabi's voice.

An entry is one contiguous span of the source, joined across a seam where a
sentence runs on, with no `…` stitching. A virtue that cannot be one contiguous
span is not entered until its claim says what it is.

This replaces the `Person.virtues` text column with one row per entry, so the
profile can list them and a quiz can ask about a single virtue. The app is
unreleased, so the old column goes rather than being kept beside the new rows.
