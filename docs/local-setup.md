# Local setup

## Requirements

- Node.js 20 or later
- PostgreSQL
- Neo4j

## Environment

Create a `.env` file in the project root for your local or preview databases:

```bash
# Pooled connection (PgBouncer or the provider's pooler) — used by the app itself.
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/namaq?pgbouncer=true"
# Direct connection — used by Prisma migrations, which a pooler can't run.
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST:5432/namaq"

NEO4J_URI="neo4j+s://YOUR-INSTANCE.databases.neo4j.io"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="YOUR_PASSWORD"
# Optional; defaults to neo4j
NEO4J_DATABASE="neo4j"
```

## Install and run

`src/generated/prisma` is gitignored and only exists after `prisma generate`,
which `npm install`'s `postinstall` hook runs. A checkout that skips
`npm install`, such as a git worktree sharing another checkout's
`node_modules`, needs `npm run db:generate` run by hand before `tsc` or the app will
resolve `@prisma/client`.

```bash
npm install
npm run db:generate
npm run db:push

# Seed PostgreSQL content. People, titles, battles and events have no seed
# files of their own any more — catalog:project creates or updates every one
# of them from data/catalog/ outright.
npm run catalog:project -- --apply

# Create Neo4j nodes for any Postgres-only profiles before writing the
# relationship graph, which reads them by slug.
npm run people:sync -- --apply

# Write every catalog person's node and relations into Neo4j.
npm run catalog:project-graph -- --apply
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

The graph has no seed files of its own; every Person node and relation comes
from `data/catalog/` via `catalog:project-graph`, and `neo4j/` holds the sync
and drift-checking scripts that keep Neo4j matching PostgreSQL and the
catalog.

## Git worktrees

In a worktree, reuse the main checkout's `.env` through a symlink. Preserve any
existing file. You can also symlink its `node_modules` when neither `package.json`
nor the lockfile has changed. Otherwise, install the worktree's dependencies.
Run `npm run db:generate` in the worktree to create its generated Prisma client.

## Verification

Before considering a change finished, run:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

For data authoring and synchronization, follow [Data pipelines](data-pipelines.md).
For contribution rules, read [AGENTS.md](../AGENTS.md).
