# 0034. One inventory defines Quran branch trees

Namaq treats every Quran branch as one kind of tree in one searchable inventory. A tree may be formed by repeated wording across at least two ayat or by an explicitly named chapter-family rule; where repeated wording forms it, comparison ignores a morphology-marked initial `و` or `ف`, treats hamza seats as equivalent, and retains the longest run for each unchanged occurrence set.

The branches page no longer exposes opening and inside-ayah kinds or filters. Legacy URLs are canonicalized to the corresponding tree, and quizzes draw from the same inventory with their own suitability rules.

A phrase already represented by a retained tree with more ayat is absorbed when every occurrence overlaps that tree's anchor. Its wording remains searchable, and focused links can still open it. Distinct occurrences elsewhere in an ayah remain separate. Morphology-marked conjunctions stay attached to their original words in the diagram. When those conjunctions differ, the whole first word joins the preceding wording and the shared trunk starts at the next word.
