import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';
import { CanonicalEvent, CanonicalEventParticipant, reconcileEvents } from '../../src/lib/canonicalEvents';

const apply = process.argv.includes('--apply');
const strict = process.argv.includes('--strict');

const eventGraphQuery = `
  MATCH (event:Event)
  OPTIONAL MATCH (event)-[:PART_OF]->(battle:Battle)
  RETURN event.slug AS slug,
         event.name AS name,
         event.nameTransliterated AS nameTransliterated,
         event.type AS type,
         event.hijriYear AS hijriYear,
         event.location AS location,
         battle.slug AS battleSlug
`;

const participantGraphQuery = `
  MATCH (person:Person)-[:INVOLVED_IN]->(event:Event)
  RETURN person.slug AS personSlug,
         event.slug AS eventSlug
`;

const eventUpsertQuery = `
  UNWIND $events AS event
  MERGE (node:Event {slug: event.slug})
  SET node.name = event.name, node.type = event.type
  FOREACH (_ IN CASE WHEN event.nameTransliterated IS NULL THEN [] ELSE [1] END |
    SET node.nameTransliterated = event.nameTransliterated)
  FOREACH (_ IN CASE WHEN event.hijriYear IS NULL THEN [] ELSE [1] END |
    SET node.hijriYear = event.hijriYear)
  FOREACH (_ IN CASE WHEN event.location IS NULL THEN [] ELSE [1] END |
    SET node.location = event.location)
`;

// MATCH (not MERGE) on person/event and event/battle: this only links nodes
// that already have a synced counterpart. A link whose person, event, or
// battle node is missing is silently skipped here and stays reported as
// postgresOnly until that node exists (via people:sync, events:sync, or
// battles:sync).
const participantUpsertQuery = `
  UNWIND $participants AS p
  MATCH (person:Person {slug: p.personSlug}), (event:Event {slug: p.eventSlug})
  MERGE (person)-[:INVOLVED_IN]->(event)
`;

const eventBattleLinkUpsertQuery = `
  UNWIND $links AS link
  MATCH (event:Event {slug: link.eventSlug}), (battle:Battle {slug: link.battleSlug})
  MERGE (event)-[:PART_OF]->(battle)
`;

function printList(label: string, items: string[]) {
  console.log(`${label}: ${items.length}${items.length ? ` (${items.join(', ')})` : ''}`);
}

async function main() {
  const postgresEventRows = await prisma.event.findMany({
    select: {
      slug: true,
      name: true,
      nameTransliterated: true,
      type: true,
      hijriYear: true,
      location: true,
      battle: { select: { slug: true } },
    },
    orderBy: { slug: 'asc' },
  });
  const postgresEvents: CanonicalEvent[] = postgresEventRows.map((row) => ({
    slug: row.slug,
    name: row.name,
    nameTransliterated: row.nameTransliterated,
    type: row.type,
    hijriYear: row.hijriYear,
    location: row.location,
    battleSlug: row.battle?.slug ?? null,
  }));
  const eventsWithParticipants = await prisma.event.findMany({
    select: { slug: true, people: { select: { slug: true } } },
  });
  const postgresParticipants: CanonicalEventParticipant[] = eventsWithParticipants.flatMap((event) =>
    event.people.map((person) => ({ personSlug: person.slug, eventSlug: event.slug })),
  );

  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    // Sequential, not Promise.all: a single session can't run two queries
    // concurrently (the driver throws "Queries cannot be run directly on a
    // session with an open transaction").
    const eventResult = await session.run(eventGraphQuery);
    const participantResult = await session.run(participantGraphQuery);
    const graphEvents: CanonicalEvent[] = eventResult.records.map((record) => ({
      slug: record.get('slug') ?? '',
      name: record.get('name') ?? '',
      nameTransliterated: record.get('nameTransliterated') ?? null,
      type: record.get('type') ?? '',
      hijriYear: record.get('hijriYear') ?? null,
      location: record.get('location') ?? null,
      battleSlug: record.get('battleSlug') ?? null,
    }));
    const graphParticipants: CanonicalEventParticipant[] = participantResult.records.map((record) => ({
      personSlug: record.get('personSlug') ?? '',
      eventSlug: record.get('eventSlug') ?? '',
    }));

    const report = reconcileEvents(postgresEvents, graphEvents, postgresParticipants, graphParticipants);

    console.log(`Canonical events reconciliation (${apply ? 'apply' : 'dry run'})`);
    printList('PostgreSQL events', postgresEvents.map((event) => event.slug));
    printList('Neo4j events', graphEvents.map((event) => event.slug));
    printList('Events missing from Neo4j', report.eventsPostgresOnly);
    printList('Graph-only events (kept)', report.eventsGraphOnly);
    console.log(`Event property mismatches: ${report.eventMismatches.length}`);
    for (const mismatch of report.eventMismatches) {
      console.log(`  ${mismatch.slug}.${mismatch.field}: PostgreSQL=${JSON.stringify(mismatch.postgres)}, Neo4j=${JSON.stringify(mismatch.neo4j)}`);
    }

    printList('Participants missing from Neo4j', report.participantsPostgresOnly);
    printList('Graph-only participants (kept)', report.participantsGraphOnly);

    const validationIssues = [
      ...report.invalidPostgresEvents,
      ...report.invalidNeo4jEvents,
      ...report.invalidPostgresParticipants,
      ...report.invalidNeo4jParticipants,
    ];
    if (validationIssues.length) {
      console.error('Invalid canonical data:');
      for (const issue of validationIssues) console.error(`  ${issue}`);
      process.exitCode = 1;
      return;
    }

    const hasDrift = report.eventsPostgresOnly.length || report.eventMismatches.length
      || report.participantsPostgresOnly.length;

    if (apply) {
      const eventBattleLinks = postgresEvents
        .filter((event): event is CanonicalEvent & { battleSlug: string } => event.battleSlug !== null)
        .map((event) => ({ eventSlug: event.slug, battleSlug: event.battleSlug }));

      const writeSession = getDriver().session({
        database: process.env.NEO4J_DATABASE || 'neo4j',
        defaultAccessMode: neo4j.session.WRITE,
      });
      try {
        // PostgreSQL is authoritative for events and their links. These
        // MERGEs only create missing nodes/relationships or update shared
        // properties; they never delete nodes, relationships, or Neo4j-only
        // properties.
        await writeSession.executeWrite(async (transaction) => {
          await transaction.run(eventUpsertQuery, { events: postgresEvents });
          await transaction.run(participantUpsertQuery, { participants: postgresParticipants });
          await transaction.run(eventBattleLinkUpsertQuery, { links: eventBattleLinks });
        });
        console.log(`Synchronized ${postgresEvents.length} events and ${postgresParticipants.length} participants to Neo4j.`);
      } finally {
        await writeSession.close();
      }
    } else if (hasDrift) {
      console.log('No data changed. Re-run with --apply to synchronize PostgreSQL events and participants to Neo4j.');
    }

    if (strict && hasDrift) {
      process.exitCode = 1;
    }
  } finally {
    await session.close();
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Canonical events reconciliation failed:', error);
    process.exitCode = 1;
  })
  // The Neo4j driver's connection pool keeps the event loop alive, so the
  // process won't exit on its own once main() resolves (see the same
  // process.exit() pattern in neo4j/graphSeed.ts).
  .finally(() => process.exit(process.exitCode ?? 0));
