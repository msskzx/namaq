# Namaq

Namaq is an Arabic-first historical learning application for Muslims and students of Islamic knowledge. Its purpose is to make the people, relationships, and major events of early Islamic history easier to understand by exploring them visually rather than only as isolated entries in a text.

The central experience is a relationship graph: learners land directly on the graph, look around and filter by relationship type, and move from a graph node to that person's profile. Person profiles connect the graph to a growing historical record through names, titles, a life timeline, events, battles, and Qur'an references.

The project is intentionally refocusing on this learning loop, and the homepage's job is to open straight into it:

```text
Open the graph → explore and filter relationships → open a person's profile → place them in events and time
```

## What is implemented

### Relationship graph

- The **Nodes in view** list can be hidden and shown; every action button in the graph UI comes from the shared `Button` component, and a selected person's titles render as the same badges the profile page uses.
- One Filters panel holds node kinds, the scope slider, and the relationship types. The slider carries both scopes and highlights the one in force, in the shape of the theme and language switchers: **Selected subject** (the default) expands that one subject, **Entire graph** filters the whole graph. Node kinds sit above it, since they are a server-side whitelist for the whole view rather than a scoped choice. Battle participation statuses sit inside the battles group, under the relation they qualify. With nothing selected the local controls are disabled rather than silently acting globally. The selected-subject panel is divided into groups: where the subject leads (**View profile**), what it reveals (**Explore**, which expands the selection along the relationship types currently switched on, or all of them but companionship when none are, plus Ancestors and Descendants), what it removes (**Collapse branch**, **Hide node**, **Keep only this node**, **Deselect**), and what acts on the whole exploration (**Show full graph**, **Start over**). Show full graph (`full=1`) adds the enabled dataset, respecting hidden nodes, and switches the relationship types on with it so the subjects arrive connected; companionship stays where its own switch left it. Start over returns to a fresh visit. All of them support browser Back/Forward. The **List of Nodes** panel starts collapsed.
- Global filters start off. A fresh visit and **Start over** open on the Prophet with every direct relation he has plus his ancestors and descendants, seeded as his own expansions, so nothing global has to be on to see them. That is Explore, Ancestors and Descendants applied without the reader pressing them. A person's profile graph opens on that person under the same rule. Companionship stays off, and neither line is capped. Bulk and group switches leave companionship in whatever state its own switch set, in both directions. Battle participation gains status switches (martyred, died, injured, captured, was captured, absent, and status not recorded) that match with OR; a participation that does not match disappears while the person stays if another relation supports them.

- `/graphs` is a single page and a single dataset (`GET /api/graph`) for every kind of node — there is no separate "people graph" / "titles graph" / "battles graph" page or route to keep in sync. `/graphs/people`, `/graphs/titles`, and `/graphs/battles` still work as redirects to `/graphs` with the equivalent `kind` filter already applied (see below), for old links/bookmarks.
- Graph links have typed, directed relationship labels such as `FATHER`, `SON`, `WIFE`, and `PATERNAL_UNCLE`.
- A `kind` query param (repeatable: `person`/`title`/`battle`/`event`) is a server-side **whitelist** on `/api/graph` — e.g. `?kind=person&kind=battle` returns only those two kinds and the links directly between them. It's absent by default, meaning every kind. The Node Kinds toggle switches on `/graphs` always offer all four kinds regardless of what's currently loaded (not just whichever kinds happen to be in the current, possibly-narrowed response), so toggling a kind back on triggers a fresh, correctly-scoped fetch rather than trying to reveal data that was never fetched in the first place.
- `/graphs` has a single search box with no mode dropdown, backed by one endpoint (`GET /api/graph/suggest`) covering every historical subject — person, title, battle, or event — whether or not it is already on screen. Picking any of them adds it as an additional `subject` root in the current exploration and selects it; existing subjects, expansions, and filters are preserved, and nothing is expanded implicitly. A result whose kind is switched off is shown with an explanation instead of being added, since adding it would silently change a filter; searching a subject again lifts an earlier removal without clearing its caps. Ancestors/Paternal lineage/Descendants are exploration actions on the selected subject (see the selected-subject panel), not search modes.
- The two search endpoints answer different questions and neither result set is a subset of the other. `/api/graph/suggest` searches the graph: Neo4j is its candidate source for all four kinds, since it is the only store with complete coverage, ranked by match quality then `graphRank` then name, with an explicit `kind` and `hasProfile` on every result. `/api/people/suggest` searches profiles for the `/people` directory, where every suggestion opens `/people/<slug>`, so it stays PostgreSQL-only. A graph-only person (present in Neo4j, e.g. a deep lineage-only ancestor, no PostgreSQL row — see `CONTEXT.md`) is therefore findable in the workspace but not in the directory, and their suggestion and selected-subject panel both omit the "View profile" link rather than linking to a page that doesn't exist.
- Every companion (a Person holding the `صحابي`/companion title) has a direct, non-family `COMPANION_OF`/`ACCOMPANIED_BY` edge to the Prophet in Neo4j, kept in sync from PostgreSQL by `npm run people:sync-companions` (`-- --apply` to write) — distinct from the pre-existing `HOLDS_TITLE` edge to the shared companion Title node, and from the handful of companions who are also blood/marriage relatives with their own family relation. `ACCOMPANIED_BY` (companion-of's inverse edge) is always shown rather than getting its own filter toggle, same relationship as `COMPANION_OF` just viewed from the other side.
- A subject a global filter introduced keeps that filter's cap for the life of the exploration, recorded in the URL, so searching, toggling, or removing and reintroducing it never re-arms the same filter; **Start over** clears the history. A failed fetch keeps the exploration on screen with a Retry beside it, and fetching continues until the exploration stops growing rather than after a fixed number of rounds.
- The Filters panel uses the same `filter` include set as global exploration controls. Switching a relation on reveals matching neighbors and fetches their neighborhoods; switching it off removes that filter's contribution. Independently searched or expanded branches remain, with all recorded links between retained subjects. Individual, family-group, all-relations, and node-kind switches share this state; `COMPANION_OF` controls both stored companionship directions, and is the one relation whose edges are hidden with it rather than staying drawn between retained subjects — both directions would otherwise clutter the graph in bulk. Old `relation` links fall back to defaults. Embedded profile graphs apply the same include set to their API responses.
- `/graphs` itself is a permanent, viewport-filling workspace (no site navbar/footer — a Menu control reaches the rest of the site instead): a collapsible panel holds search, the selected subject's controls, filters, and the node list, docked to the panel's leading side on desktop and as a bottom sheet on phone, collapsing to small Search/Menu icons when hidden. Embedded graphs (person profiles, battle pages) are unaffected and keep the older inline-card-with-fullscreen-toggle behavior described below.
- Every subject has a fixed, precomputed position shared across the whole graph (`npm run graph:layout`, applied to both PostgreSQL and Neo4j — see below), so selecting, expanding, or filtering never rearranges anything already on screen; only an explicit **Fit graph** button (frames everything currently visible) or **Show additions** (frames what an expansion/global filter just revealed, alongside whatever it connects to) moves the camera on their own. Selecting an already-visible subject also leaves the camera alone; one hidden behind the panel gets a minimal pan to reveal it, without changing zoom. Node dragging is disabled, since a position can't be usefully moved this way.
- `/graphs` and a profile's graph are the same component with the same layout. Only two things differ: `/graphs` opens filling the screen on the Prophet, a profile opens in place on its own person. Out of fullscreen a graph is its canvas and the button back in; in fullscreen it carries search, the selected-subject controls, the filters and the node list, and a button to leave again. The fullscreen layer renders into the document body, so a page section around it cannot paint over the graph.
- Selecting a node takes the learner to `/people/[slug]`.
- Person pages embed that same component, opened on that person under the shared rule above: every direct relation they have, plus their ancestors and descendants. Its exploration lives in the page URL exactly as the workspace's does, so it is equally shareable and undoable with browser Back.
- Graph seed data is deduplicated by person slug and by source/type/target relationship; the seeder uses Cypher `MERGE` so repeat runs do not add duplicate graph entities.
- With Neo4j credentials configured, `npm test` compares deployed person-to-person relationships against the graph seed, reporting missing and unexpected directed edges while excluding sync-owned relation types. Without credentials, live checks skip; pure tests still cover missing inverses and reversed parent edges.
- `npm run graph:layout` computes a cross-type prominence rank (`graphRank`), a Louvain community (`clusterId`), and a precomputed 2D layout position (`layoutX`/`layoutY`) over the *entire* unified Person+Battle+Title+Event graph — every subject, not just ones with a PostgreSQL row. All four are stored on each entity's Postgres row; `graphRank` and `layoutX`/`layoutY` are additionally written to every matching Neo4j node (including PostgreSQL-less, graph-only subjects, e.g. deep lineage-only ancestors), which is what `/api/graph` reads, ranks by, and pins every node to — no live force layout runs in the browser at all. `clusterId` stays PostgreSQL-only because no response returns it; its only consumer is the next layout run, which seeds cluster centres from it. Zoom-based level-of-detail (thinning low-rank nodes as you zoom out) is a further follow-up.

### People and timelines

- `/people` is a searchable, paginated directory with title filtering.
- `/people/[slug]` shows available names, titles, appearance, virtues, Qur'an references, battle participations, events, and a chronological timeline.
- Profiles show the evidence behind what they state: each claim with its citations, review status and a short Arabic excerpt, and the complete entry from the source work, one printed page at a time with the edition's footnotes kept apart from the author's text. The book and page are in the URL, so a citation links to the page it cites. Review status is shown to the reader and never decides what is served, so a Not reviewed claim is visible and labelled.
- Evidence attaches to a subject's kind and slug rather than to a profile row, so titles, battles, events and graph-only people can carry citations. `GET /api/subjects/[kind]/[slug]/references` serves them; in the graph workspace a subject with a profile links to its profile's references, a subject without one expands a compact list in the panel, and a subject with no evidence says so.
- Historical data is authored as files under `data/history/batches/`: source editions, the source account's Markdown pages with anchored paragraphs, and claims with their citations. `npm run history:validate` checks that every citation names a declared source, carries a working extraction link and an Arabic excerpt, and points at a passage some page declares. `npm run history:import` refuses to write unless the files match the revision that was approved, and upserts so a retry cannot duplicate anything. `npm run history:extract` pulls an entry from Shamela into that shape.
- Person records use stable slugs, making graph nodes, search results, and detail pages linkable.

### Events and battles

- `/events` presents major events in chronological form; individual event pages show dates, location, description, and participating people.
- `/battles` and battle detail pages are available for battle-specific context, participants, timelines, and map data where it has been recorded.
- Battle rosters are also synced into Neo4j (`:Battle` nodes and `PARTICIPATED_IN` relationships carrying each participant's status — injured, killed, captured, etc.) via `npm run battles:sync`. Battle detail pages embed a small graph view of participants, color-coded by status, and `/graphs?kind=person&kind=battle` shows every battle and its participants in one bipartite graph.
- Titles and events are synced into Neo4j the same way: `npm run titles:sync` creates `:Title` nodes and `HOLDS_TITLE` relationships from each title's holders, and `npm run events:sync` creates `:Event` nodes, `INVOLVED_IN` relationships from participating people, and a `PART_OF` relationship to the linked `:Battle` when an event has one. Both are one-way, PostgreSQL-authoritative, and safe to re-run (`MERGE`, never delete).

### Application experience

- Arabic and English UI support, plus light and dark themes.
- Client-side data fetching and pagination through SWR.
- PostgreSQL/Prisma is used for people, events, battles, titles, and supporting content; Neo4j is used for relationship traversal and graph rendering.

## Architecture

| Area | Implementation | Responsibility |
| --- | --- | --- |
| Web application | Next.js App Router, React, TypeScript, Tailwind CSS | Pages, API routes, localisation, and interaction |
| Relationship graph | Neo4j and `react-force-graph-2d` | Person nodes, typed relationships, graph queries, and visualisation |
| Historical content | PostgreSQL and Prisma | Person profiles, titles, events, battles, Qur'an references, and timelines |
| Search | Next.js API routes over Prisma and Neo4j | Person-directory filters and graph-search autocomplete |

`GET /api/graph` is the single graph endpoint behind `/graphs` — there is no separate `/api/graph/all`, `/api/graph/battles`, or `/api/graph/titles` to keep in sync with it. With no query parameters it runs one unified Neo4j query across every Person/Battle/Title/Event node and relationship, then attaches each node's `graphRank`/`layoutX`/`layoutY` in one further batched Neo4j lookup. Those come from Neo4j rather than PostgreSQL so that a graph-only person is ranked and placed like any other subject instead of sorting last for want of a row to join against — see [ADR 0006](docs/adr/0006-persist-offline-computed-properties-to-neo4j.md). From there:
  - `kind` (repeatable) is a server-side whitelist over that same unified query's result — `?kind=person&kind=battle` returns only those two kinds and the links directly between them.
  - `person` scopes to a local relation view (1 hop) around one or more people; `ancestorsOf` walks `SON|DAUGHTER` edges upward (paternal/maternal ancestry); `descendantsOf` walks the same chain downward to every descendant; `battle` returns one or more battles and their participants (`PARTICIPATED_IN` links carry the participant's `status`). These four combine with each other (UNION'd server-side) and repeat (multiple selected people/roots), but don't currently combine with `kind` — they're already inherently scoped to the kinds their own semantics produce (e.g. `ancestorsOf` only ever returns people).
  - `focus` is a deliberately narrower single-hop view around one person, used when neither of the above is present.

`GET /api/graph/suggest` backs the `/graphs` search box, covering all four kinds from Neo4j in one ranked list. The whole searchable set is 659 subjects, loaded and ranked in memory on each query — a considered choice at this size, not a missing index.

## Local setup

### Requirements

- Node.js 20 or later
- PostgreSQL
- Neo4j

### Environment

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/namaq"

NEO4J_URI="neo4j+s://YOUR-INSTANCE.databases.neo4j.io"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="YOUR_PASSWORD"
# Optional; defaults to neo4j
NEO4J_DATABASE="neo4j"
```

### Install and run

```bash
npm install
npm run db:generate
npm run db:push

# Seed PostgreSQL content in dependency order.
npm run seed:titles
npm run seed:people
npm run seed:battles
npm run seed:events

# Create Neo4j nodes for any Postgres-only profiles (e.g. newly seeded
# companions) before seeding relations that reference them by slug.
npm run people:sync -- --apply

# Seed the relationship graph.
npm run seed:graph
# Create Neo4j :Battle/:Title/:Event nodes and their relationships from the
# PostgreSQL rosters.
npm run battles:sync -- --apply
npm run titles:sync -- --apply
npm run events:sync -- --apply

# Compute cross-type rank, Louvain clusters, and a precomputed layout over
# the unified Person+Battle+Title+Event graph. All four are stored on
# Postgres; graphRank and the layout coordinates are also written to every
# Neo4j subject, which is what /graphs actually reads. Rerun after any
# relationship-changing data update.
npm run graph:layout -- --apply

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` for a production build and `npx tsc --noEmit` for a TypeScript check.

Graph seed files live in `neo4j/`; the main seed entry point is `neo4j/graphSeed.ts`.

## Removed from scope

The app previously had working models, seed data, API routes, and pages for **articles, categories, charities/charity categories, and books/pages** (see git history for `feat: added articles, categories...`, `feat: added charities categories pages and routes`, `feat: added book pages, routes`). These were deliberately removed to narrow the app back down to the person → graph → profile → events learning loop described at the top of this document, so that scope doesn't drift before that core loop is solid. The Prisma models, migrations, and seed scripts for these have been deleted (`UserProgress` went with `Article`, since it only tracked per-article progress). Reintroducing any of them should go through a fresh design pass rather than restoring the old code, since the data model and product direction have moved on.

Two client hooks, `useUserPreferences` and `useAnalytics` (in [`src/hooks/useData.ts`](src/hooks/useData.ts)), point at `/api/user/preferences` and `/api/analytics` routes that were never built. They also aren't called anywhere in the app. They look like agent-generated scaffolding from early on; since there are no users yet and no concrete plan for what they should do, they've been left in place rather than removed or built out. Revisit them once there's an actual user-accounts/analytics need.

## Current scope and limitations

This is an early learning product and its historical data is incomplete. The graph and profile information should therefore be treated as a navigational aid, not as a scholarly reference or a substitute for checking primary and established secondary sources.

The code review identified the following practical limitations:

- **Two sources of truth for people.** Neo4j stores graph people while PostgreSQL stores profiles and powers autocomplete. They share slugs but are seeded separately, so a graph node can exist without a corresponding profile or searchable record.
- **Graph scale will need deliberate handling.** The default (unscoped) `/api/graph` response returns all nodes and links in one payload. This is appropriate for the present dataset, but a single large response will become slow and visually crowded as coverage grows; the fixed-position rendering itself no longer runs a live force simulation, so this is now purely a data-volume/visual-density concern, not also a physics one.
- **Relationship coverage and modelling are incomplete.** Current data emphasises genealogy and a selection of family relations. It does not yet express uncertainty, competing reports, date ranges, sources, or richer historical relationships.
- **Search is functional but narrow.** Autocomplete searches PostgreSQL `name`, `fullName`, and `slug`; it does not yet search transliterated names or guarantee graph/profile coverage matches.
- **Quality safeguards cover the graph and API routes, but not the full journey.** The graph query builder and person search/ranking have unit tests, and every Prisma-backed API route (`people`, `events`, `battles`, `titles`, `quran`) now has route-level tests covering its success, not-found, validation, and error-handling paths. Seed integrity has static checks and a live drift check; key end-to-end user journeys still need coverage.
- **Historical evidence has been built but barely gathered.** Claims, citations, editions and complete source accounts are modelled and displayed, and the first batch covers one Companion. Almost every person on record still carries no evidence at all, and their profiles say so.

## Future improvements

The next work should protect and deepen the main graph-and-search experience before expanding into unrelated features.

1. **Establish one canonical people pipeline.** Keep a single source record per person and generate/synchronise both PostgreSQL profiles and Neo4j nodes from it. Validate that every graph slug resolves to a person page and every searchable person has the intended graph presence.
2. **Make graph data scholarly usable.** Add sources, citations, confidence/ambiguity notes, and editorial review status to people and relationships. Begin the richer biographies with clearly attributed material, including the planned use of *Siyar A'lam al-Nubala'*, while distinguishing quoted source text from editorial summaries.
3. **Improve graph exploration.** Add relationship-type filters, a legend, selected-node details, “expand neighbours” controls, reset/shareable views, keyboard access, and mobile-friendly navigation. For growth, load subgraphs progressively instead of drawing the entire database at once.
4. **Strengthen search and discovery.** Search Arabic names, full names, transliterations, aliases, and common spelling variants; rank exact matches first; show relationship context in results; and offer direct navigation to a person or a focused graph view.
5. **Model historical time more faithfully.** Support approximate and contested dates, Hijri/Gregorian conversions with uncertainty, event ordering, and links from timeline entries back to their sources.
6. **Add data and product quality checks.** Test duplicate prevention, broken slug links, invalid relationship types, empty source fields, graph API responses, search results, and the node-to-profile navigation journey. Add a CI build and test workflow before broadening the dataset.
7. **Curate a small, excellent core dataset first.** Prioritise the Prophet Muhammad ﷺ, the Companions most relevant to the initial learning journeys, their well-sourced relationships, and a concise set of major events and battles. Expand breadth only after those paths are accurate and pleasant to explore.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Create a production build |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:push` | Apply the Prisma schema to the configured database |
| `npm run seed:people` | Upsert PostgreSQL person records |
| `npm run seed:titles` | Seed titles used by people |
| `npm run seed:battles` | Seed battle records |
| `npm run seed:events` | Seed events and connect related records |
| `npm run seed:graph` | Seed or update the Neo4j relationship graph |
| `npm run people:sync` / `-- --apply` | Report (or apply) PostgreSQL → Neo4j drift for people |
| `npm run people:sync-companions` / `-- --apply` | Report (or create) missing `COMPANION_OF`/`ACCOMPANIED_BY` edges from every companion to the Prophet |
| `npm run battles:sync` / `-- --apply` | Report (or apply) PostgreSQL → Neo4j drift for battles and participations |
| `npm run titles:sync` / `-- --apply` | Report (or apply) PostgreSQL → Neo4j drift for titles and their holders |
| `npm run events:sync` / `-- --apply` | Report (or apply) PostgreSQL → Neo4j drift for events, participants, and battle links |
| `npm run graph:layout` / `-- --apply` | Report (or persist) cross-type rank, Louvain clusters, and layout positions over the unified graph |
