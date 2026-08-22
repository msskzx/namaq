/**
 * The properties shared by a battle in PostgreSQL and its node in Neo4j, and
 * by a BattleParticipation row and its PARTICIPATED_IN relationship. Slugs
 * are the stable cross-database identifiers, same as canonicalPeople.ts.
 */
export type CanonicalBattle = {
  slug: string;
  name: string;
  nameTransliterated: string | null;
  hijriYear: number | null;
  location: string | null;
  locationEn: string | null;
};

export type CanonicalParticipation = {
  personSlug: string;
  battleSlug: string;
  status: string[];
  isMuslim: boolean;
  courage: string | null;
};

export type BattleMismatch = {
  slug: string;
  field: keyof Omit<CanonicalBattle, 'slug'>;
  postgres: string | number | null;
  neo4j: string | number | null;
};

export type ParticipationMismatch = {
  key: string;
  field: keyof Omit<CanonicalParticipation, 'personSlug' | 'battleSlug'>;
  postgres: string | boolean | string[] | null;
  neo4j: string | boolean | string[] | null;
};

export type BattleReconciliation = {
  invalidPostgresBattles: string[];
  invalidNeo4jBattles: string[];
  invalidPostgresParticipations: string[];
  invalidNeo4jParticipations: string[];
  battlesPostgresOnly: string[];
  battlesGraphOnly: string[];
  battleMismatches: BattleMismatch[];
  participationsPostgresOnly: string[];
  participationsGraphOnly: string[];
  participationMismatches: ParticipationMismatch[];
};

const comparableString = (value: string | null | undefined) =>
  value?.trim().replace(/\s+/g, ' ') || null;

const comparableStatus = (value: string[] | null | undefined) =>
  [...(value ?? [])].sort().join('|');

export const participationKey = (participation: Pick<CanonicalParticipation, 'personSlug' | 'battleSlug'>) =>
  `${participation.personSlug}|${participation.battleSlug}`;

export function validateCanonicalBattles(battles: CanonicalBattle[]): string[] {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const battle of battles) {
    const slug = battle.slug?.trim();
    if (!slug) issues.push('A battle is missing a slug.');
    else if (seen.has(slug)) issues.push(`Duplicate battle slug: ${slug}`);
    else seen.add(slug);

    if (!battle.name?.trim()) issues.push(`Battle ${slug || '(unknown)'} is missing a name.`);
  }

  return issues;
}

export function validateCanonicalParticipations(participations: CanonicalParticipation[]): string[] {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const participation of participations) {
    const personSlug = participation.personSlug?.trim();
    const battleSlug = participation.battleSlug?.trim();
    if (!personSlug || !battleSlug) {
      issues.push('A participation is missing a person or battle slug.');
      continue;
    }
    const key = participationKey({ personSlug, battleSlug });
    if (seen.has(key)) issues.push(`Duplicate participation: ${key}`);
    else seen.add(key);
  }

  return issues;
}

/**
 * Compare the two stores without changing either one, for both battles and
 * their participations. Graph-only entries are expected: a graph node can
 * exist without (or ahead of) a synced PostgreSQL row.
 */
export function reconcileBattles(
  postgresBattles: CanonicalBattle[],
  graphBattles: CanonicalBattle[],
  postgresParticipations: CanonicalParticipation[],
  graphParticipations: CanonicalParticipation[],
): BattleReconciliation {
  const invalidPostgresBattles = validateCanonicalBattles(postgresBattles);
  const invalidNeo4jBattles = validateCanonicalBattles(graphBattles);
  const invalidPostgresParticipations = validateCanonicalParticipations(postgresParticipations);
  const invalidNeo4jParticipations = validateCanonicalParticipations(graphParticipations);

  const postgresBattlesBySlug = new Map(postgresBattles.map((battle) => [battle.slug, battle]));
  const graphBattlesBySlug = new Map(graphBattles.map((battle) => [battle.slug, battle]));
  const battlesPostgresOnly = [...postgresBattlesBySlug.keys()].filter((slug) => !graphBattlesBySlug.has(slug)).sort();
  const battlesGraphOnly = [...graphBattlesBySlug.keys()].filter((slug) => !postgresBattlesBySlug.has(slug)).sort();
  const battleMismatches: BattleMismatch[] = [];

  for (const [slug, postgresBattle] of postgresBattlesBySlug) {
    const graphBattle = graphBattlesBySlug.get(slug);
    if (!graphBattle) continue;

    for (const field of ['name', 'nameTransliterated', 'location', 'locationEn'] as const) {
      if (comparableString(postgresBattle[field]) !== comparableString(graphBattle[field])) {
        battleMismatches.push({ slug, field, postgres: postgresBattle[field], neo4j: graphBattle[field] });
      }
    }
    if ((postgresBattle.hijriYear ?? null) !== (graphBattle.hijriYear ?? null)) {
      battleMismatches.push({
        slug,
        field: 'hijriYear',
        postgres: postgresBattle.hijriYear,
        neo4j: graphBattle.hijriYear,
      });
    }
  }

  const postgresParticipationsByKey = new Map(postgresParticipations.map((p) => [participationKey(p), p]));
  const graphParticipationsByKey = new Map(graphParticipations.map((p) => [participationKey(p), p]));
  const participationsPostgresOnly = [...postgresParticipationsByKey.keys()].filter((key) => !graphParticipationsByKey.has(key)).sort();
  const participationsGraphOnly = [...graphParticipationsByKey.keys()].filter((key) => !postgresParticipationsByKey.has(key)).sort();
  const participationMismatches: ParticipationMismatch[] = [];

  for (const [key, postgresParticipation] of postgresParticipationsByKey) {
    const graphParticipation = graphParticipationsByKey.get(key);
    if (!graphParticipation) continue;

    if (comparableStatus(postgresParticipation.status) !== comparableStatus(graphParticipation.status)) {
      participationMismatches.push({
        key,
        field: 'status',
        postgres: postgresParticipation.status,
        neo4j: graphParticipation.status,
      });
    }
    if (postgresParticipation.isMuslim !== graphParticipation.isMuslim) {
      participationMismatches.push({
        key,
        field: 'isMuslim',
        postgres: postgresParticipation.isMuslim,
        neo4j: graphParticipation.isMuslim,
      });
    }
    if (comparableString(postgresParticipation.courage) !== comparableString(graphParticipation.courage)) {
      participationMismatches.push({
        key,
        field: 'courage',
        postgres: postgresParticipation.courage,
        neo4j: graphParticipation.courage,
      });
    }
  }

  return {
    invalidPostgresBattles,
    invalidNeo4jBattles,
    invalidPostgresParticipations,
    invalidNeo4jParticipations,
    battlesPostgresOnly,
    battlesGraphOnly,
    battleMismatches,
    participationsPostgresOnly,
    participationsGraphOnly,
    participationMismatches,
  };
}
