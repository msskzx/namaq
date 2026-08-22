/**
 * The properties shared by an event in PostgreSQL and its node in Neo4j, and
 * by a Person-Event membership and its INVOLVED_IN relationship. Slugs are
 * the stable cross-database identifiers, same as canonicalBattles.ts. An
 * event's optional battle link (Event.battleId in Prisma) travels with the
 * event itself, mirroring the schema's scalar foreign key rather than a
 * separate relation list.
 */
export type CanonicalEvent = {
  slug: string;
  name: string;
  nameTransliterated: string | null;
  type: string;
  hijriYear: number | null;
  location: string | null;
  battleSlug: string | null;
};

export type CanonicalEventParticipant = {
  personSlug: string;
  eventSlug: string;
};

export type EventMismatch = {
  slug: string;
  field: keyof Omit<CanonicalEvent, 'slug'>;
  postgres: string | number | null;
  neo4j: string | number | null;
};

export type EventReconciliation = {
  invalidPostgresEvents: string[];
  invalidNeo4jEvents: string[];
  invalidPostgresParticipants: string[];
  invalidNeo4jParticipants: string[];
  eventsPostgresOnly: string[];
  eventsGraphOnly: string[];
  eventMismatches: EventMismatch[];
  participantsPostgresOnly: string[];
  participantsGraphOnly: string[];
};

const comparableString = (value: string | null | undefined) =>
  value?.trim().replace(/\s+/g, ' ') || null;

export const eventParticipantKey = (participant: CanonicalEventParticipant) =>
  `${participant.personSlug}|${participant.eventSlug}`;

export function validateCanonicalEvents(events: CanonicalEvent[]): string[] {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const event of events) {
    const slug = event.slug?.trim();
    if (!slug) issues.push('An event is missing a slug.');
    else if (seen.has(slug)) issues.push(`Duplicate event slug: ${slug}`);
    else seen.add(slug);

    if (!event.name?.trim()) issues.push(`Event ${slug || '(unknown)'} is missing a name.`);
    if (!event.type?.trim()) issues.push(`Event ${slug || '(unknown)'} is missing a type.`);
  }

  return issues;
}

export function validateCanonicalEventParticipants(participants: CanonicalEventParticipant[]): string[] {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const participant of participants) {
    const personSlug = participant.personSlug?.trim();
    const eventSlug = participant.eventSlug?.trim();
    if (!personSlug || !eventSlug) {
      issues.push('An event participant is missing a person or event slug.');
      continue;
    }
    const key = eventParticipantKey({ personSlug, eventSlug });
    if (seen.has(key)) issues.push(`Duplicate event participant: ${key}`);
    else seen.add(key);
  }

  return issues;
}

/**
 * Compare the two stores without changing either one, for both events and
 * their participants. Graph-only entries are expected: a graph node can
 * exist without (or ahead of) a synced PostgreSQL row.
 */
export function reconcileEvents(
  postgresEvents: CanonicalEvent[],
  graphEvents: CanonicalEvent[],
  postgresParticipants: CanonicalEventParticipant[],
  graphParticipants: CanonicalEventParticipant[],
): EventReconciliation {
  const invalidPostgresEvents = validateCanonicalEvents(postgresEvents);
  const invalidNeo4jEvents = validateCanonicalEvents(graphEvents);
  const invalidPostgresParticipants = validateCanonicalEventParticipants(postgresParticipants);
  const invalidNeo4jParticipants = validateCanonicalEventParticipants(graphParticipants);

  const postgresEventsBySlug = new Map(postgresEvents.map((event) => [event.slug, event]));
  const graphEventsBySlug = new Map(graphEvents.map((event) => [event.slug, event]));
  const eventsPostgresOnly = [...postgresEventsBySlug.keys()].filter((slug) => !graphEventsBySlug.has(slug)).sort();
  const eventsGraphOnly = [...graphEventsBySlug.keys()].filter((slug) => !postgresEventsBySlug.has(slug)).sort();
  const eventMismatches: EventMismatch[] = [];

  for (const [slug, postgresEvent] of postgresEventsBySlug) {
    const graphEvent = graphEventsBySlug.get(slug);
    if (!graphEvent) continue;

    for (const field of ['name', 'nameTransliterated', 'type', 'location', 'battleSlug'] as const) {
      if (comparableString(postgresEvent[field]) !== comparableString(graphEvent[field])) {
        eventMismatches.push({ slug, field, postgres: postgresEvent[field], neo4j: graphEvent[field] });
      }
    }
    if ((postgresEvent.hijriYear ?? null) !== (graphEvent.hijriYear ?? null)) {
      eventMismatches.push({
        slug,
        field: 'hijriYear',
        postgres: postgresEvent.hijriYear,
        neo4j: graphEvent.hijriYear,
      });
    }
  }

  const postgresParticipantsByKey = new Map(postgresParticipants.map((p) => [eventParticipantKey(p), p]));
  const graphParticipantsByKey = new Map(graphParticipants.map((p) => [eventParticipantKey(p), p]));
  const participantsPostgresOnly = [...postgresParticipantsByKey.keys()].filter((key) => !graphParticipantsByKey.has(key)).sort();
  const participantsGraphOnly = [...graphParticipantsByKey.keys()].filter((key) => !postgresParticipantsByKey.has(key)).sort();

  return {
    invalidPostgresEvents,
    invalidNeo4jEvents,
    invalidPostgresParticipants,
    invalidNeo4jParticipants,
    eventsPostgresOnly,
    eventsGraphOnly,
    eventMismatches,
    participantsPostgresOnly,
    participantsGraphOnly,
  };
}
