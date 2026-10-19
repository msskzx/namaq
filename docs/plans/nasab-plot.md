# Nasab plot

A page at `/nasab` that draws the patrilineal line (نسب) of one or more people as an SVG tree. One person gives a straight vertical line. Several people give one tree in which their lines merge where they meet.

The force graph at `/graphs` pins every node to a precomputed global position, so it cannot draw a line or a merge
([ADR 0005](../adr/0005-use-a-precomputed-global-graph-map.md)). The nasab page is a second view over the same Neo4j data, not a change to the graph.

## Acceptance criteria

- `/nasab?subject=person:<slug>` (repeatable) draws each subject's chain of `FATHER` edges up to the oldest recorded ancestor.
- Lines that share an ancestor are drawn once from the lowest shared ancestor upward, and that ancestor is marked as a meeting point.
- The page has the same search box as the graph and, under it, pills for the Prophet and the four caliphs.
- A subject with no recorded father shows as a single node marked "father not recorded". A father is never inferred.
- A person with several recorded fathers is drawn under the first by slug, with the others listed on the node.
- Subjects with no common ancestor are drawn side by side.
- Arabic mirrors the horizontal order. Light and dark themes are supported. Every label has `en` and `ar`.
- The page and SVG use the shared paper, ink and terracotta theme. Companion names in the plot, selected subjects and text chains carry ﵁ for men or ﵂ for women. SVG tooltips spell out the honorific. The homepage uses the same plot.
- A text version of each chain sits under the drawing for screen readers.
- A switch under the quick picks adds each subject's descendants, read down the same `FATHER` edges, below the subject. It is off by default and kept in the URL as `descendants=1`. Descendants are not subjects: they are not highlighted and get no chain in the text version.
- The navbar's Graphs entry has a submenu with a link to `/nasab`.

## Layout contract (`src/lib/relationship/nasabLayout.ts`)

`layoutNasab(people, subjects)` is pure. `people` is the ancestor closure of the subjects, `{ slug, name, fathers: string[] }[]`
with `fathers` holding the slugs recorded as the person's father. `subjects` is the ordered list of requested slugs; unknown
or repeated slugs are ignored.

- The primary father of a person is the smallest slug in `fathers` that is present in `people` and does not close a cycle. The
  rest are `otherFathers`.
- `row` is the distance from the root of the person's tree (the oldest ancestor, row 0).
- A node with no children takes the next free column, in subject order. A node with children sits at the mean column of its children.
- `isMeeting` is true when the node has at least two subjects at or below it and no single child holds all of them.
- `fatherUnrecorded` is true when `fathers` is empty.
- `chains` lists, per subject, the slugs from the subject up to its root.

## Data

`GET /api/nasab?person=<slug>` (repeatable) returns `{ people, subjects }` from one Cypher query over `(:Person)-[:FATHER]->(:Person)`. With `descendants=1` the same query also follows the edges downward from each subject.

Each person includes `isCompanion`, read from `HOLDS_TITLE` to the `companion` title, and `sex`. Profile sex comes from PostgreSQL; graph-only sex comes from Neo4j. A missing sex leaves the honorific unset.

Amiri does not supply U+FD41 and U+FD42. `public/fonts/namaq-honorifics.woff` contains just those two glyphs, subset from [Kitab](https://github.com/nuqayah/kitab-font) and renamed Namaq Honorifics. Its SIL Open Font License is alongside it. `Nasab.module.css` limits this font to those code points, keeping Amiri for names. To rebuild, subset `Kitab-Regular.ttf` with FontTools to `U+FD41,U+FD42`, rename the family to Namaq Honorifics, and save as WOFF.

## Not done

Collapsing a long middle run of generations. The drawing scrolls instead.

Bounding the descendants. A far ancestor with descendants on draws everyone below them: Adnan gives 247 people across 85 columns, which the drawing scrolls through. The text version under the drawing lists the subjects' chains only, not the descendants.
