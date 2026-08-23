import { redirect } from "next/navigation";

// See src/app/graphs/people/page.tsx for why this redirects. `kind=person`
// is included too, matching the old dedicated battles view's bipartite
// (battle + participant) node composition.
export default function BattlesGraphRedirect() {
    redirect("/graphs?kind=person&kind=battle");
}
