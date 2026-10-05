# Hadith pages from the database

Status: ready to implement. The code below is written; the owner applies the migration.

The `/hadith` pages first read the Jibril fixtures from disk with `fs`. On Vercel that
failed, because the build ships only the files the tracer can see. The model's rule is
that files under `data/` are the authority and the databases are rebuilt from them
([ADR 0023](../adr/0023-files-are-the-authority-and-both-databases-are-derived.md)), so
the pages should read the database like the person page does. Terms are in
[CONTEXT.md](../../CONTEXT.md).

## Agreed behavior and scope

- Two tables hold what a hadith page shows: `model_units` has one row per hadith or
  commentary unit, with its book, kitab, bab and the whole page view as JSON;
  `model_unit_links` has one row per commentary link (`EXPLAINS`) and per same-event
  link (`SAME_EVENT`), with the basis text.
- The view is built by `hadithView` from the files, as it is today, and stored as it is.
  There is one code path for the view, so the page and the database cannot drift apart.
- `npm run model:project -- --units [--root <dir>] [--apply --env preview]` replaces both
  tables. It is separate from the profile projection, so a profile run never clears the
  units and a units run never clears profile entries. The default root is `.`. `--units` is
  refused with `--env prod` until a review rule exists, and `--apply` is refused when no
  unit is found. Two links with the same from, to and kind become one row with their bases
  joined.
- The pages read the database first. If the table is missing or the unit is not in it,
  they fall back to the files, so localhost keeps working before the migration is applied.
  The fallback is temporary.
- The Jibril fixtures are test data. They go to the preview database only, never to prod.
- Excluded: the real Bukhari and Muslim data, a review page, and search over units.

## Acceptance criteria

1. `prisma validate` passes and the migration creates `model_units` and
   `model_unit_links` exactly as the schema declares them.
2. `unitRows(root)` returns one row per unit and one link row per commentary or
   same-event link, and every row round-trips through JSON.
3. `npm run model:project -- --units --root src/lib/model/fixtures/jibril` prints
   3 units and 3 links and writes nothing without `--apply`.
4. With `--apply --env preview` it replaces both tables in one transaction and leaves
   `model_spans` and `model_profile_entries` untouched.
5. With the table missing or empty, `/hadith` and `/hadith/<unit>` render from the files.
   With rows present they render from the database.
6. `--units` with `--env prod`, a missing `--root` value, or `--apply` with no units found, exits with an error.

## Affected components

| Component | Change |
| --- | --- |
| `prisma/schema.prisma`, `prisma/migrations/20261005120000_model_hadith_units/` | New models and migration. |
| `src/lib/model/unitRows.ts` (new) | Rows for both tables, from `hadithView`. |
| `scripts/model/project.ts` | The `--units` and `--root` options. |
| `src/lib/modelUnits.ts` (new) | Database-first loading with the file fallback. |
| `src/app/hadith/page.tsx`, `src/app/hadith/[unit]/page.tsx` | Use `modelUnits`. |

## Validation

- `src/lib/model/unitRows.test.ts` covers rows, links and JSON round trip.
- `src/lib/modelUnits.test.ts` covers the stored view, a missing unit, a missing table
  and an empty list.
- `npm run lint`, `npx tsc --noEmit` and `npm test` pass.
- After the migration is applied, open `/hadith/bukhari-jibril` and check it reads the
  stored row, for example by changing the stored `book` in a scratch copy and seeing it.

## Data and operational consequences

- The migration adds two tables and changes nothing else. **The owner applies it**
  (`npx prisma migrate deploy`). Merging this plan does not apply it: the build is
  `next build`, with no migrate step.
- After it is applied, run the projection once for the fixtures:
  `npm run model:project -- --units --root src/lib/model/fixtures/jibril --apply --env preview`.
- Rerun the projection whenever a unit's files change. The tables are derived, never
  edited by hand.
- Until both steps are done, the pages use the files. On Vercel the fixture folder is not
  in the function, so the deployed pages stay broken until the migration is applied and
  the projection has run. (A tracing patch, PR 339, was closed for that reason.)

## Open issues

Nonblocking:

- **Which database the deployed site reads** is not stated in the repo. If it is not
  the preview database, the projection must also run against that one, and the fixtures
  still never go to prod.
- **The file fallback** should go once the tables are applied and projected.
- **Real Bukhari and Muslim units** will need their own source pages in the database. The
  view stores the page text it needs, so a unit is self-contained, but a shared page
  store is a later change.
