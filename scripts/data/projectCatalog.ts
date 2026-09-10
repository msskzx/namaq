import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import type { Cited } from '../../src/lib/catalog/types';

const apply = process.argv.includes('--apply');
const prisma = new PrismaClient();

const planned: string[] = [];
const conflicts: string[] = [];

/**
 * Fills a column the database leaves empty and reports a disagreement instead
 * of overwriting one. The existing syncs are non-destructive for the same
 * reason: a live value may carry work no batch has caught up with yet, and
 * losing it silently is worse than carrying the difference as drift.
 */
function settle(where: string, live: string | number | null, cited: Cited<string | number> | undefined) {
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

async function projectPeople(people: Awaited<ReturnType<typeof loadCatalog>>['people']) {
  for (const subject of people) {
    const live = await prisma.person.findUnique({ where: { slug: subject.slug } });
    if (!live) {
      conflicts.push(`people/${subject.slug}: no row; creating people is not in this pass`);
      continue;
    }

    const at = `people/${subject.slug}`;
    const data = {
      fullName: settle(`${at}.fullName`, live.fullName, subject.fields.fullName),
      appearance: settle(`${at}.appearance`, live.appearance, subject.fields.appearance),
      virtues: settle(`${at}.virtues`, live.virtues, subject.fields.virtues),
      deathYearHijri: settle(`${at}.deathYearHijri`, live.deathYearHijri, subject.fields.deathYearHijri),
      placeOfDeathArabic: settle(`${at}.placeOfDeathArabic`, live.placeOfDeathArabic, subject.fields.placeOfDeathArabic),
    };
    const set = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
    if (apply && Object.keys(set).length > 0) await prisma.person.update({ where: { slug: subject.slug }, data: set });
  }
}

async function projectBattles(battles: Awaited<ReturnType<typeof loadCatalog>>['battles']) {
  for (const battle of battles) {
    const row = await prisma.battle.findUnique({ where: { slug: battle.slug } });
    if (!row) {
      conflicts.push(`battles/${battle.slug}: no row`);
      continue;
    }
    for (const entry of battle.participants) {
      const person = await prisma.person.findUnique({ where: { slug: entry.person } });
      if (!person) {
        conflicts.push(`battles/${battle.slug}: ${entry.person} has no row`);
        continue;
      }
      const existing = await prisma.battleParticipation.findFirst({
        where: { personId: person.id, battleId: row.id },
      });
      if (existing) continue;
      planned.push(`battles/${battle.slug}: add ${entry.person}`);
      if (apply) {
        await prisma.battleParticipation.create({
          data: { personId: person.id, battleId: row.id, isMuslim: entry.isMuslim, status: [...(entry.status ?? [])] },
        });
      }
    }
  }
}

async function projectEvents(events: Awaited<ReturnType<typeof loadCatalog>>['events']) {
  for (const event of events) {
    const live = await prisma.event.findUnique({ where: { slug: event.slug }, include: { people: true } });
    const fields = {
      hijriYear: event.fields.hijriYear?.value,
      location: event.fields.location?.value,
      description: event.fields.description?.value,
    };

    if (!live) planned.push(`events/${event.slug}: create`);
    const people = event.people.map((entry) => ({ slug: entry.person }));
    const missing = event.people.filter((entry) => !live?.people.some((row) => row.slug === entry.person));
    missing.forEach((entry) => planned.push(`events/${event.slug}: link ${entry.person}`));

    if (!apply) continue;
    await prisma.event.upsert({
      where: { slug: event.slug },
      create: {
        slug: event.slug,
        name: event.name,
        nameTransliterated: event.nameTransliterated,
        type: event.type,
        ...fields,
        people: { connect: people },
      },
      update: { people: { connect: people } },
    });
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
