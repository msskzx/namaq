import { redirect } from "next/navigation";

// See src/app/graphs/people/page.tsx for why this redirects. `kind=person`
// is included too, matching the old dedicated titles view's bipartite
// (title + holder) node composition.
export default function TitlesGraphRedirect() {
    redirect("/graphs?kind=person&kind=title");
}
