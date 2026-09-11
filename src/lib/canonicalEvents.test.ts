import { describe, expect, it } from 'vitest';
import {
  reconcileEvents,
  validateCanonicalEvents,
  validateCanonicalEventParticipants,
} from './canonicalEvents';

const postgresEvents = [
  { slug: 'hijra', name: 'الهجرة', nameTransliterated: 'The Hijra', type: 'HIJRA', hijriYear: 1, location: 'المدينة' },
  { slug: 'saqifah-bani-saidah', name: 'سقيفة بني ساعدة', nameTransliterated: 'Saqifah Bani Saidah', type: 'OTHER', hijriYear: null, location: null },
];
const graphEvents = [
  { slug: 'hijra', name: ' الهجرة ', nameTransliterated: 'The Hijra', type: 'HIJRA', hijriYear: 1, location: 'المدينة' },
  { slug: 'khaybar-liberation', name: 'فتح خيبر', nameTransliterated: 'Liberation of Khaybar', type: 'LIBERATED', hijriYear: 7, location: 'خيبر' },
];

const postgresParticipants = [
  { personSlug: 'prophet-muhammad', eventSlug: 'hijra' },
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', eventSlug: 'saqifah-bani-saidah' },
];
const graphParticipants = [
  { personSlug: 'prophet-muhammad', eventSlug: 'hijra' },
  { personSlug: 'abu-bakr', eventSlug: 'khaybar-liberation' },
];

describe('reconcileEvents', () => {
  it('separates postgres-only and graph-only event slugs', () => {
    const report = reconcileEvents(postgresEvents, graphEvents, [], []);
    expect(report.eventsPostgresOnly).toEqual(['saqifah-bani-saidah']);
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

  it('separates postgres-only and graph-only participants by person+event key', () => {
    const report = reconcileEvents([], [], postgresParticipants, graphParticipants);
    expect(report.participantsPostgresOnly).toEqual(['abu-ubaydah-ibn-al-jarrah|saqifah-bani-saidah']);
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
