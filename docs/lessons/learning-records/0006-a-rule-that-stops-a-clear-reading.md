# A rule that guards the unclear must not stop a reading that is clear

The hadith pilot showed the plan's inference rule doing the opposite of its
purpose. Plan sections 2.5a and 2.13 treated a bare «قَالَ» whose speaker follows
from alternation as an inference: an agent reports it, the owner approves it, and
until then the turn shows «speaker not stated». On the page, the Prophet's ﷺ own
answers in the hadith of Jibril carried that label. The owner read the hadith and
knew who spoke each line at once. Agents then made the same move with the sharh,
which one of them dismissed as naming no speakers after reading only the first
lines of each entry; the stored pages name Jibril as the asker and the Prophet ﷺ
as the one who explains, in the chapter heading and in the commentary on it.

**Evidence:** the page rendered «speaker not stated» beside answers any reader
would attribute; the sharh claim fell to a full read of pages 114 and 115
(`src/lib/model/fixtures/jibril/data/history/sources/test-fath/v1/`). The same
caution kept the commentator's «وَقَدْ أَخْرَجَهُ مُسْلِمٌ مِنْ حَدِيثِ عُمَرَ» from
being recorded as a link between the two hadith, because R2 forbids Namaq
groupings, although R2 itself allows a grouping a source makes.

**Implications:** state, in the rule, what it guards against and the case where it
does not apply. [ADR 0024](../../adr/0024-read-the-text-and-stop-where-it-is-unclear.md)
does that: rules guard what is unclear or contradictory, and a reading the text, a
heading or the sharh makes clear is recorded directly with its basis spans. Test a
new rule against a passage a reader would simply read. If the rule blocks that,
fix the rule. And before an agent says a source "says nothing" about something, it
must have read the source, not its first lines.
