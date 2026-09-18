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
 * Writes the catalog's value, whatever the column holds. The files are the
 * authority and a row is a copy of them (ADR 0010), so a database value that
 * disagrees is stale, not evidence. An overwrite is printed rather than done
 * quietly, because it is the one thing here that loses something.
 */
function settle(where: string, live: Column, cited: Cited<string | number> | undefined) {
  if (!cited) return undefined;
  if (live === null || live === undefined) {
    planned.push(`${where}: set to ${JSON.stringify(cited.value)}`);
    return cited.value;
  }
  if (String(live) === String(cited.value)) return undefined;

  planned.push(`${where}: overwrite ${JSON.stringify(live)} with ${JSON.stringify(cited.value)}`);
  return cited.value;
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

    await projectTitles(subject);
    await projectAyat(subject);
  }
}

/**
 * Additive like the titles, and keyed by surah and ayah number rather than by
 * row id, since the Qur'an tables are seeded separately and own their ids.
 */
async function projectAyat(subject: Catalog['people'][number]) {
  const declared = subject.ayat ?? [];
  if (declared.length === 0) return;

  const live = await prisma.person.findUnique({
    where: { slug: subject.slug },
    select: { id: true, ayat: { select: { number: true, surah: { select: { number: true } } } } },
  });
  if (!live) return;

  const held = new Set(live.ayat.map((ayah) => `${ayah.surah.number}:${ayah.number}`));
  const connect: { id: string }[] = [];

  for (const entry of declared) {
    const at = `people/${subject.slug}.ayat.${entry.surah}:${entry.ayah}`;
    if (held.has(`${entry.surah}:${entry.ayah}`)) continue;

    const row = await prisma.ayah.findFirst({
      where: { number: entry.ayah, surah: { number: entry.surah } },
      select: { id: true },
    });
    if (!row) {
      conflicts.push(`${at}: no ayah row; run npm run seed:surahs and seed:ayat first`);
      continue;
    }
    planned.push(`${at}: link`);
    connect.push({ id: row.id });
  }

  if (apply && connect.length > 0) {
    await prisma.person.update({ where: { id: live.id }, data: { ayat: { connect } } });
  }
}

/**
 * Title assignments are additive, like every other value here: a title the
 * catalog declares is connected, and one the database holds that the catalog
 * does not is reported rather than disconnected. Dropping an assignment is a
 * deletion, and this pass does not delete.
 */
async function projectTitles(subject: Catalog['people'][number]) {
  if (subject.titles.length === 0) return;

  const live = await prisma.person.findUnique({
    where: { slug: subject.slug },
    select: { id: true, titles: { select: { slug: true } } },
  });
  if (!live) return;

  const held = new Set(live.titles.map((title) => title.slug));
  const declared = new Set(subject.titles.map((title) => title.title));
  const connect = subject.titles.filter((title) => !held.has(title.title)).map((title) => ({ slug: title.title }));

  [...held].filter((slug) => !declared.has(slug)).forEach((slug) => {
    conflicts.push(`people/${subject.slug}.titles: database holds ${slug}, catalog does not`);
  });

  if (connect.length === 0) return;
  planned.push(`people/${subject.slug}: hold ${connect.map((title) => title.slug).join(', ')}`);
  if (apply) {
    await prisma.person.update({ where: { id: live.id }, data: { titles: { connect } } });
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
      const relation = entry.relation ?? 'PARTICIPATED_IN';
      if (existing) {
        const status = [...(entry.status ?? [])];
        if (existing.isMuslim !== entry.isMuslim) {
          conflicts.push(`${at}: database has isMuslim ${existing.isMuslim}, catalog has ${entry.isMuslim}`);
        }
        if (existing.status.join() !== status.join()) {
          conflicts.push(`${at}: database has status [${existing.status}], catalog has [${status}]`);
        }
        // Attendance is the one thing a seeded row is most likely to have
        // wrong, since the old shape made presence the unmarked default.
        if (existing.relation !== relation) {
          conflicts.push(`${at}: database has ${existing.relation}, catalog has ${relation}`);
        }
        const summary = settle(`${at}.summary`, existing.summary, entry.summary);
        if (apply && summary !== undefined) {
          await prisma.battleParticipation.update({ where: { id: existing.id }, data: { summary: String(summary) } });
        }
        continue;
      }

      planned.push(`battles/${battle.slug}: add ${entry.person} as ${relation}`);
      if (apply) {
        await prisma.battleParticipation.create({
          data: {
            personId: person.id,
            battleId: row.id,
            isMuslim: entry.isMuslim,
            relation,
            status: [...(entry.status ?? [])],
            summary: entry.summary?.value,
          },
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
