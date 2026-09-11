import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import type { Catalog, CatalogEventFields, CatalogPersonFields, Cited } from '../../src/lib/catalog/types';

const apply = process.argv.includes('--apply');
const prisma = new PrismaClient();

const planned: string[] = [];
const conflicts: string[] = [];

type Column = string | number | null;

/**
 * Fills an empty column and reports a disagreement rather than overwriting one.
 * A live value may carry work no batch has caught up with, and losing it
 * silently is worse than carrying the difference as drift.
 */
function settle(where: string, live: Column, cited: Cited<string | number> | undefined) {
  if (!cited) return undefined;
  if (live === null || live === undefined) {
    planned.push(`${where}: set to ${JSON.stringify(cited.value)}`);
    return cited.value;
  }
  if (String(live) !== String(cited.value)) {
    conflicts.push(`${where}: database has ${JSON.stringify(live)}, catalog has ${JSON.stringify(cited.value)}`);
  }
  return undefined;
}

/** Field keys are column names, so an added catalog field projects without editing this. */
function settleFields(at: string, live: Record<string, unknown>, fields: CatalogPersonFields | CatalogEventFields) {
  const set: Record<string, string | number> = {};
  for (const [column, cited] of Object.entries(fields) as [string, Cited<string | number> | undefined][]) {
    const value = settle(`${at}.${column}`, live[column] as Column, cited);
    if (value !== undefined) set[column] = value;
  }
  return set;
}

async function projectPeople(people: Catalog['people']) {
  for (const subject of people) {
    const live = await prisma.person.findUnique({ where: { slug: subject.slug } });
    if (!live) {
      conflicts.push(`people/${subject.slug}: no row; creating people is not in this pass`);
      continue;
    }

    const set = settleFields(`people/${subject.slug}`, live, subject.fields);
    if (apply && Object.keys(set).length > 0) {
      await prisma.person.update({ where: { slug: subject.slug }, data: set });
    }
  }
}

async function projectBattles(battles: Catalog['battles']) {
  for (const battle of battles) {
    const row = await prisma.battle.findUnique({ where: { slug: battle.slug } });
    if (!row) {
      conflicts.push(`battles/${battle.slug}: no row`);
      continue;
    }

    for (const entry of battle.participants) {
      const at = `battles/${battle.slug}.${entry.person}`;
      const person = await prisma.person.findUnique({ where: { slug: entry.person }, select: { id: true } });
      if (!person) {
        conflicts.push(`${at}: no row for this person`);
        continue;
      }

      const existing = await prisma.battleParticipation.findFirst({ where: { personId: person.id, battleId: row.id } });
      if (existing) {
        const status = [...(entry.status ?? [])];
        if (existing.isMuslim !== entry.isMuslim) {
          conflicts.push(`${at}: database has isMuslim ${existing.isMuslim}, catalog has ${entry.isMuslim}`);
        }
        if (existing.status.join() !== status.join()) {
          conflicts.push(`${at}: database has status [${existing.status}], catalog has [${status}]`);
        }
        continue;
      }

      planned.push(`battles/${battle.slug}: add ${entry.person}`);
      if (apply) {
        await prisma.battleParticipation.create({
          data: { personId: person.id, battleId: row.id, isMuslim: entry.isMuslim, status: [...(entry.status ?? [])] },
        });
      }
    }
  }
}

async function projectEvents(events: Catalog['events']) {
  for (const event of events) {
    const at = `events/${event.slug}`;
    const live = await prisma.event.findUnique({ where: { slug: event.slug }, include: { people: true } });
    const missing = event.people.filter((entry) => !live?.people.some((row) => row.slug === entry.person));
    missing.forEach((entry) => planned.push(`${at}: link ${entry.person}`));

    if (!live) {
      planned.push(`${at}: create`);
      Object.entries(event.fields).forEach(([column, cited]) => {
        if (cited) planned.push(`${at}.${column}: set to ${JSON.stringify(cited.value)}`);
      });
      if (apply) {
        await prisma.event.create({
          data: {
            slug: event.slug,
            name: event.name,
            nameTransliterated: event.nameTransliterated,
            type: event.type,
            hijriYear: event.fields.hijriYear?.value,
            location: event.fields.location?.value,
            description: event.fields.description?.value,
            people: { connect: event.people.map((entry) => ({ slug: entry.person })) },
          },
        });
      }
      continue;
    }

    if (live.name !== event.name) conflicts.push(`${at}.name: database has ${JSON.stringify(live.name)}, catalog has ${JSON.stringify(event.name)}`);
    if (live.type !== event.type) conflicts.push(`${at}.type: database has ${live.type}, catalog has ${event.type}`);
    const set = settleFields(at, live, event.fields);

    if (!apply) continue;
    if (Object.keys(set).length > 0 || missing.length > 0) {
      await prisma.event.update({
        where: { slug: event.slug },
        data: { ...set, people: { connect: missing.map((entry) => ({ slug: entry.person })) } },
      });
    }
  }
}

async function main() {
  const catalog = await loadCatalog();
  await projectPeople(catalog.people);
  await projectBattles(catalog.battles);
  await projectEvents(catalog.events);

  console.log(apply ? 'APPLYING' : 'DRY RUN (pass --apply to write)');
  console.log(`\n${planned.length} change(s):`);
  planned.forEach((line) => console.log(`  ${line}`));
  if (conflicts.length > 0) {
    console.log(`\n${conflicts.length} left for review, nothing written for these:`);
    conflicts.forEach((line) => console.log(`  ${line}`));
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
