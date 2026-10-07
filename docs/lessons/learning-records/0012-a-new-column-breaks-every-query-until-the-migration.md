# A new column breaks every query until someone applies the migration

The plan for event months and days started with the obvious design: add `hijriMonth` and
`hijriDay` to `Event` and `Battle`, like `hijriYear`. The first review of the plan caught
what that does here. Prisma selects every column of a model, so once the generated client
knows the new columns, every `findMany` on events asks the database for columns it does not
have yet. The pages that list events would fail from the moment the code merges until the
owner runs `npx prisma migrate deploy`, and the build has no migrate step.

The fix was to leave `Event` and `Battle` alone and put the parts in a new table,
`catalog_date_parts`. A table nothing reads yet cannot break a query, and a reader that finds
the table missing can fall back to nothing, the way `src/lib/modelUnits.ts` already does for
`model_units` (it falls back to nothing on any database error, and stays quiet only for Prisma's missing-table error, P2021). The projection does the
same: it prints "apply the migration, then rerun" and writes nothing.

**Evidence:** the plan before and after review ([time-layer.md](../../plans/time-layer.md),
"No column added to a table the app already reads"), and the new model in
`prisma/schema.prisma`. The migration is `20261008120000_catalog_date_parts`.

**Implications:** a migration that adds a column to a table the app reads is a deploy, not a
data change: it has to land before the code that mentions the column, or the code must not
mention it. When the owner applies migrations by hand, add tables, not columns, so a merge
never waits on a person. Same family as
[0009](0009-a-fix-in-the-code-does-not-fix-the-rows-built-before-it.md): code and stored shape
have to move together, and the cheapest way to keep them from moving apart is to let the code
work without the new shape.
