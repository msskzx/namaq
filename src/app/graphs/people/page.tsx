import { redirect } from "next/navigation";

// /graphs/people, /graphs/titles, and /graphs/battles were merged into the
// single /graphs page: "people only" is just the node-kind filter (see
// GraphCanvas's Node Kinds toggles / /api/graph's `kind` param) narrowed to
// `person`, not a separate view. This redirect keeps old links/bookmarks
// working with the equivalent filter already applied.
export default function PeopleGraphRedirect() {
    redirect("/graphs?kind=person");
}
