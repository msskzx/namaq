# Backend issues to fix: plan

Status: not started. Found in a quick read of `src/app/api` (21 route files),
`src/lib/prisma.ts`, `src/lib/neo4j.ts` and the repository setup. Nothing was
run against load or checked in production. Ordered by risk.

## 1. Nothing runs the tests in CI

There is no `.github/` directory, so no workflow runs `npm run lint`,
`npx tsc --noEmit` or `npm test` on a pull request. The only check on a PR is
Vercel's. `AGENTS.md` asks for all three before a change is finished, but
nothing enforces it.

Fix: one GitHub Actions workflow that installs, runs `prisma generate`, then the
three commands. Make the live-database test below opt-in first, so CI does not
need database credentials.

## 2. A unit test depends on the live graph

`src/lib/graphIntegrity.live.test.ts` runs inside `npm test` against the preview
Neo4j. It failed earlier because the database had drifted from the seeds, not
because of any code change. It is useful, but a test that fails on the state of a
shared database makes `npm test` unreliable.

Fix: move it behind its own script (`npm run test:live`) and skip it by default,
as it already does when no Neo4j config exists (`describe.skipIf`). Run it after
a seed or sync, and on a schedule.

## 3. List endpoints have no upper bound

- `/api/people` reads `limit` with no cap, so `?limit=1000000` returns every
  row. `page` and `limit` are also read without a maximum.
- `/api/events` reads `limit` with `parseInt` and no `NaN` or upper-bound check,
  so `?limit=abc` reaches Prisma as `NaN`.
- `/api/graph` accepts any number of `person`, `ancestorsOf`, `descendantsOf`,
  `relationSubjects` and `relationTypes` values, and runs unbounded variable-
  length paths (`FATHER*`, `FATHER|MOTHER*`) in Cypher for them.

`/api/graph/suggest` already clamps its limit (1 to 20) and is the pattern to
copy. Fix: one small helper that parses and clamps `page` and `limit`, used by
every list route, and a cap on the number of subjects a graph request may name.
The Cypher is parameterised (`$relationTypes`), so this is about cost, not
injection.

## 3b. The people search loads every row

With `?search=`, `/api/people` fetches all people with their titles and ranks
them in JavaScript (`filterAndRankSubjects`). It is fine at a few hundred rows
and does not scale. The list also returns whole `Person` rows, including long
text fields, where the card needs a few columns. Fix: `select` only what the
list shows, and move the search to the database (`pg_trgm` or full-text) when the
catalog grows.

## 4. No caching on data that rarely changes

No route sets `Cache-Control`, `revalidate` or a static route segment. The
catalog changes only when someone runs an import or a sync, so titles, people,
events, the graph and the sources shelf can all be cached at the edge and
revalidated after an import.

Fix: set `revalidate` or `Cache-Control: s-maxage` with `stale-while-revalidate`
per route, and revalidate the tags from the import scripts. This is also the
cheapest protection for the Neo4j instance.

## 5. Database connections in a serverless setting

- `src/lib/prisma.ts` keeps the client on `globalThis` only outside production,
  and `schema.prisma` has one `url` and no `directUrl`. On serverless each
  instance opens its own connections, so a burst can exhaust PostgreSQL. Use a
  pooled connection string (PgBouncer or the provider's pooler) for the app and
  a direct one for migrations.
- `src/lib/neo4j.ts` builds a driver with a pool of 50 and a 30 second
  connection timeout per instance, and imports `dotenv/config` inside a library
  that Next already configures. Lower the pool, shorten the timeout, and drop
  the import from app code (scripts can keep it).

## 6. Errors and logging

Every route catches and returns a generic 500 with `console.error`. That is safe,
since it does not leak internals, but it means no request id, no route name, and
nothing that separates a bad input from a failing database. Inputs that should
be 400s (a non-numeric `limit`) become 500s.

Fix: a shared `apiError` helper that logs the route and a request id, and returns
400 for validation failures. Consider one validation library (such as Zod) for
query parameters instead of hand-written `parseInt` checks per route.

## 7. Abuse controls

The API is read-only and public, with no rate limiting. Search and graph
endpoints are the expensive ones. Add rate limiting at the edge (Vercel Firewall
or a small middleware) on `/api/graph`, `/api/graph/suggest` and `/api/people`.
This matters more once accounts and party games exist
([user-accounts.md](user-accounts.md), [quizzes.md](quizzes.md)), which add
writes.

## 8. Smaller items

- Two stores hold person data (PostgreSQL and Neo4j) and only the sync scripts
  keep them together. Add a scheduled check that reports drift, so a stale graph
  is found before a reader does. The live test in item 2 is the start of it.
- `src/generated/prisma` is ignored and rebuilt by `postinstall`, which works,
  but a fresh worktree fails `tsc` until `prisma generate` runs. Mention it in
  the README's local setup.
- Route tests exist for most routes and mock Prisma. None covers a limit
  parameter beyond its default, so the fixes above each add one.

## Related plans

- [frontend-issues.md](frontend-issues.md)
- [user-accounts.md](user-accounts.md)
- [quizzes.md](quizzes.md)
