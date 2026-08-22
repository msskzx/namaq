import { describe, expect, it } from 'vitest';
import {
  reconcileEvents,
  validateCanonicalEvents,
  validateCanonicalEventParticipants,
} from './canonicalEvents';

const postgresEvents = [
  { slug: 'hijra', name: 'الهجرة', nameTransliterated: 'The Hijra', type: 'HIJRA', hijriYear: 1, location: 'المدينة', battleSlug: null },
  { slug: 'badr-battle-event', name: 'غزوة بدر', nameTransliterated: 'Battle of Badr', type: 'BATTLE', hijriYear: 2, location: 'بدر', battleSlug: 'badr' },
];
const graphEvents = [
  { slug: 'hijra', name: ' الهجرة ', nameTransliterated: 'The Hijra', type: 'HIJRA', hijriYear: 1, location: 'المدينة', battleSlug: null },
  { slug: 'khaybar-liberation', name: 'فتح خيبر', nameTransliterated: 'Liberation of Khaybar', type: 'LIBERATED', hijriYear: 7, location: 'خيبر', battleSlug: null },
];

const postgresParticipants = [
  { personSlug: 'prophet-muhammad', eventSlug: 'hijra' },
  { personSlug: 'ali-ibn-abi-talib', eventSlug: 'badr-battle-event' },
];
const graphParticipants = [
  { personSlug: 'prophet-muhammad', eventSlug: 'hijra' },
  { personSlug: 'abu-bakr', eventSlug: 'khaybar-liberation' },
];

describe('reconcileEvents', () => {
  it('separates postgres-only and graph-only event slugs', () => {
    const report = reconcileEvents(postgresEvents, graphEvents, [], []);
    expect(report.eventsPostgresOnly).toEqual(['badr-battle-event']);
    expect(report.eventsGraphOnly).toEqual(['khaybar-liberation']);
  });

  it('treats whitespace-only differences as no mismatch', () => {
    const report = reconcileEvents(postgresEvents, graphEvents, [], []);
    expect(report.eventMismatches).toHaveLength(0);
  });

  it('reports a mismatch for differing event field values', () => {
    const report = reconcileEvents(
      [postgresEvents[0]],
      [{ ...graphEvents[0], hijriYear: 2 }],
      [],
      [],
    );
    expect(report.eventMismatches).toEqual([
      { slug: 'hijra', field: 'hijriYear', postgres: 1, neo4j: 2 },
    ]);
  });

  it('reports a mismatch when the linked battle slug differs', () => {
    const report = reconcileEvents(
      [postgresEvents[1]],
      [{ ...postgresEvents[1], battleSlug: 'uhud' }],
      [],
      [],
    );
    expect(report.eventMismatches).toEqual([
      { slug: 'badr-battle-event', field: 'battleSlug', postgres: 'badr', neo4j: 'uhud' },
    ]);
  });

  it('separates postgres-only and graph-only participants by person+event key', () => {
    const report = reconcileEvents([], [], postgresParticipants, graphParticipants);
    expect(report.participantsPostgresOnly).toEqual(['ali-ibn-abi-talib|badr-battle-event']);
    expect(report.participantsGraphOnly).toEqual(['abu-bakr|khaybar-liberation']);
  });
});

describe('validateCanonicalEvents', () => {
  it('flags duplicate slugs', () => {
    expect(validateCanonicalEvents([postgresEvents[0], postgresEvents[0]])).toEqual([
      'Duplicate event slug: hijra',
    ]);
  });

  it('flags a missing type', () => {
    expect(validateCanonicalEvents([{ ...postgresEvents[0], type: '' }])).toEqual([
      'Event hijra is missing a type.',
    ]);
  });
});

describe('validateCanonicalEventParticipants', () => {
  it('flags duplicate person+event pairs', () => {
    expect(validateCanonicalEventParticipants([postgresParticipants[0], postgresParticipants[0]])).toEqual([
      'Duplicate event participant: prophet-muhammad|hijra',
    ]);
  });
});
