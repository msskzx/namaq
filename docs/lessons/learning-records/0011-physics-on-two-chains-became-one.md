# With physics on, two chains became one

The isnad diagram needed to draw one chain (Bukhari's) and a diamond (Muslim's two chains
meeting at Yahya). The graph engine already in the app has a `dagMode`, so it was tried first.
With `dagMode="td"` the library fixes each node's level and leaves the other axis to the
force simulation. The simulation treats a node as a point, and the nodes here are 200 pixels
wide. Both Muslim branches landed on the same x and stacked on top of each other, so the
diamond became one very confident column. Adding a strong repulsion force made it a diagonal,
and the canvas zoomed in on the wreckage.

A small function that gives each node a rank from the collector, and spreads each rank
sideways, drew the diamond correctly every time as static SVG. It also kept the Arabic text
selectable and let a node be a real link.

**Evidence:** both renderings on `muslim-jibril` before the force version was removed
(PR #344). The owner then asked for the collector to be the first node, which meant changing
one line: rank from the collector instead of from the origin.

**Implications:** a force engine answers "how is this network connected?", and a layout
function answers "draw this known shape." The isnad of one hadith is the second kind. When the
narrators become graph nodes for questions such as who heard from whom, that network is the
first kind and the existing engine is the right tool, so the two views can coexist.
