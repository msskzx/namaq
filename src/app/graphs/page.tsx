"use client";

import GraphCanvas from "@/components/graph/GraphCanvas";

// One page, one dataset (GET /api/graph), one set of controls. "People
// only" / "titles" / "battles" / "everything" aren't separate views or
// routes -- they're just the node-kind filter (see GraphCanvas's Node
// Kinds toggles) narrowed to whichever kinds you want, via `kind` in the
// URL (e.g. ?kind=person&kind=battle).
export default function GraphPage() {
    return (
        <GraphCanvas url="/api/graph" showSearch targetSlug="prophet-muhammad" nodesLabel="nodes" />
    );
}
