# Nasab: descendants and wives

Follow-up to [nasab-plot.md](nasab-plot.md). Not started. Each node on `/nasab` would get a dropdown that adds more of the person's relations to the drawing.

## Descendants

Do this first. It fits the layout we have: a node's children are drawn one row down, under their father, and the existing `layoutNasab` places them without change.

- Query: the `FATHER` edges from a node downward, one generation per expansion, so a popular ancestor does not draw hundreds of nodes at once.
- Dropdown: "Children" (one generation) and "All descendants". Expansions are kept in the URL, like the graph's, so Back undoes one.
- Open question: whether daughters appear. `FATHER` edges cover sons and daughters alike, but the line of fathers continues only through sons, so daughters would need a different look.

## Wives

Needs a design check before any code. A wife is a sideways link, not a step up or down the line, so the picture stops being a tree.

- Draw a wife beside her husband on the same row, joined by a short line, and keep her out of the column layout so the line of fathers does not move.
- A husband with several wives needs an order; take it from the cited source where one gives it.
- Her children hang from both parents, so a child's father line must stay the only one drawn as the nasab.
- Each wife is a cited relation. Show it only where the catalog holds it, and say nothing where it does not.

## Not decided

- Whether a wife's own father line can be opened from her node.
- Whether the two expansions share one dropdown or each node gets two.
