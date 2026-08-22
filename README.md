# Namaq

Namaq is an Arabic-first historical learning application for Muslims and students of Islamic knowledge. Its purpose is to make the people, relationships, and major events of early Islamic history easier to understand by exploring them visually rather than only as isolated entries in a text.

The central experience is a relationship graph: learners land directly on the graph, look around and filter by relationship type, and move from a graph node to that person's profile. Person profiles connect the graph to a growing historical record through names, titles, a life timeline, events, battles, and Qur'an references.

The project is intentionally refocusing on this learning loop, and the homepage's job is to open straight into it:

```text
Open the graph → explore and filter relationships → open a person's profile → place them in events and time
```

## What is implemented

### Relationship graph

- `/graphs` displays the complete Neo4j people graph, including people with no recorded relationship.
- Graph links have typed, directed relationship labels such as `FATHER`, `SON`, `WIFE`, and `PATERNAL_UNCLE`.
- The graph search provides autocomplete, supports relation and ancestry modes, and keeps the selected view in the URL.
- Selecting a node takes the learner to `/people/[slug]`.
- Person pages embed a focused graph for that person: nearby relations (up to three hops) and their recorded paternal ancestry.
- Graph seed data is deduplicated by person slug and by source/type/target relationship; the seeder uses Cypher `MERGE` so repeat runs do not add duplicate graph entities.

### People and timelines

- `/people` is a searchable, paginated directory with title filtering.
- `/people/[slug]` shows available names, titles, appearance, virtues, Qur'an references, battle participations, events, and a chronological timeline.
- Person records use stable slugs, making graph nodes, search results, and detail pages linkable.

### Events and battles

- `/events` presents major events in chronological form; individual event pages show dates, location, description, and participating people.
- `/battles` and battle detail pages are available for battle-specific context, participants, timelines, and map data where it has been recorded.
- Battle rosters are also synced into Neo4j (`:Battle` nodes and `PARTICIPATED_IN` relationships carrying each participant's status — injured, killed, captured, etc.) via `npm run battles:sync`. Battle detail pages embed a small graph view of participants, color-coded by status.

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
| Search | Prisma API routes | Person-directory filters and graph-search autocomplete |

The graph API is `GET /api/graph`. With no query parameters it returns all graph nodes and links. It also accepts `person` for a local relation view, `ancestorsOf` for paternal ancestry, and `battle` for a battle's participants (with each `PARTICIPATED_IN` link carrying the participant's `status`). Graph-search suggestions come from `GET /api/people/suggest`.

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

# Create Neo4j :Battle nodes and PARTICIPATED_IN relationships from the
# PostgreSQL battle rosters.
npm run battles:sync -- --apply

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` for a production build and `npx tsc --noEmit` for a TypeScript check.

Graph seed files live in `neo4j/`; the main seed entry point is `neo4j/graphSeed.ts`. The generator documentation in [`neo4j/README.md`](neo4j/README.md) describes the optional LLM-assisted genealogy-data workflow.

## Removed from scope

The app previously had working models, seed data, API routes, and pages for **articles, categories, charities/charity categories, and books/pages** (see git history for `feat: added articles, categories...`, `feat: added charities categories pages and routes`, `feat: added book pages, routes`). These were deliberately removed to narrow the app back down to the person → graph → profile → events learning loop described at the top of this document, so that scope doesn't drift before that core loop is solid. The Prisma models, migrations, and seed scripts for these have been deleted (`UserProgress` went with `Article`, since it only tracked per-article progress). Reintroducing any of them should go through a fresh design pass rather than restoring the old code, since the data model and product direction have moved on.

Two client hooks, `useUserPreferences` and `useAnalytics` (in [`src/hooks/useData.ts`](src/hooks/useData.ts)), point at `/api/user/preferences` and `/api/analytics` routes that were never built. They also aren't called anywhere in the app. They look like agent-generated scaffolding from early on; since there are no users yet and no concrete plan for what they should do, they've been left in place rather than removed or built out. Revisit them once there's an actual user-accounts/analytics need.

## Current scope and limitations

This is an early learning product and its historical data is incomplete. The graph and profile information should therefore be treated as a navigational aid, not as a scholarly reference or a substitute for checking primary and established secondary sources.

The code review identified the following practical limitations:

- **Two sources of truth for people.** Neo4j stores graph people while PostgreSQL stores profiles and powers autocomplete. They share slugs but are seeded separately, so a graph node can exist without a corresponding profile or searchable record.
- **Graph scale will need deliberate handling.** `/graphs` currently returns all nodes and links. This is appropriate for the present dataset, but a force-directed canvas and single large response will become slow and visually crowded as coverage grows.
- **Relationship coverage and modelling are incomplete.** Current data emphasises genealogy and a selection of family relations. It does not yet express uncertainty, competing reports, date ranges, sources, or richer historical relationships.
- **Search is functional but narrow.** Autocomplete searches PostgreSQL `name`, `fullName`, and `slug`; it does not yet search transliterated names or guarantee graph/profile coverage matches.
- **Quality safeguards cover the graph and API routes, but not the full journey.** The graph query builder and person search/ranking have unit tests, and every Prisma-backed API route (`people`, `events`, `battles`, `titles`, `quran`) now has route-level tests covering its success, not-found, validation, and error-handling paths. There is still no automated coverage for seed integrity or key end-to-end user journeys.
- **Historical provenance is not yet visible.** The data model and UI do not attach citations, editions, narrators, or confidence notes to claims.

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
| `npm run gen:cypher` | Generate candidate graph seed data from raw genealogy text |
| `npm run people:sync` / `-- --apply` | Report (or apply) PostgreSQL → Neo4j drift for people |
| `npm run battles:sync` / `-- --apply` | Report (or apply) PostgreSQL → Neo4j drift for battles and participations |
