/**
 * The properties shared by a title in PostgreSQL and its node in Neo4j, and
 * by a Person-Title membership and its HOLDS_TITLE relationship. Slugs are
 * the stable cross-database identifiers, same as canonicalBattles.ts.
 */
export type CanonicalTitle = {
  slug: string;
  name: string;
  nameTransliterated: string | null;
  desc: string | null;
};

export type CanonicalTitleHolder = {
  personSlug: string;
  titleSlug: string;
};

export type TitleMismatch = {
  slug: string;
  field: keyof Omit<CanonicalTitle, 'slug'>;
  postgres: string | null;
  neo4j: string | null;
};

export type TitleReconciliation = {
  invalidPostgresTitles: string[];
  invalidNeo4jTitles: string[];
  invalidPostgresHolders: string[];
  invalidNeo4jHolders: string[];
  titlesPostgresOnly: string[];
  titlesGraphOnly: string[];
  titleMismatches: TitleMismatch[];
  holdersPostgresOnly: string[];
  holdersGraphOnly: string[];
};

const comparableString = (value: string | null | undefined) =>
  value?.trim().replace(/\s+/g, ' ') || null;

export const titleHolderKey = (holder: CanonicalTitleHolder) =>
  `${holder.personSlug}|${holder.titleSlug}`;

export function validateCanonicalTitles(titles: CanonicalTitle[]): string[] {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const title of titles) {
    const slug = title.slug?.trim();
    if (!slug) issues.push('A title is missing a slug.');
    else if (seen.has(slug)) issues.push(`Duplicate title slug: ${slug}`);
    else seen.add(slug);

    if (!title.name?.trim()) issues.push(`Title ${slug || '(unknown)'} is missing a name.`);
  }

  return issues;
}

export function validateCanonicalTitleHolders(holders: CanonicalTitleHolder[]): string[] {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const holder of holders) {
    const personSlug = holder.personSlug?.trim();
    const titleSlug = holder.titleSlug?.trim();
    if (!personSlug || !titleSlug) {
      issues.push('A title holder is missing a person or title slug.');
      continue;
    }
    const key = titleHolderKey({ personSlug, titleSlug });
    if (seen.has(key)) issues.push(`Duplicate title holder: ${key}`);
    else seen.add(key);
  }

  return issues;
}

/**
 * Compare the two stores without changing either one, for both titles and
 * their holders. Graph-only entries are expected: a graph node can exist
 * without (or ahead of) a synced PostgreSQL row.
 */
export function reconcileTitles(
  postgresTitles: CanonicalTitle[],
  graphTitles: CanonicalTitle[],
  postgresHolders: CanonicalTitleHolder[],
  graphHolders: CanonicalTitleHolder[],
): TitleReconciliation {
  const invalidPostgresTitles = validateCanonicalTitles(postgresTitles);
  const invalidNeo4jTitles = validateCanonicalTitles(graphTitles);
  const invalidPostgresHolders = validateCanonicalTitleHolders(postgresHolders);
  const invalidNeo4jHolders = validateCanonicalTitleHolders(graphHolders);

  const postgresTitlesBySlug = new Map(postgresTitles.map((title) => [title.slug, title]));
  const graphTitlesBySlug = new Map(graphTitles.map((title) => [title.slug, title]));
  const titlesPostgresOnly = [...postgresTitlesBySlug.keys()].filter((slug) => !graphTitlesBySlug.has(slug)).sort();
  const titlesGraphOnly = [...graphTitlesBySlug.keys()].filter((slug) => !postgresTitlesBySlug.has(slug)).sort();
  const titleMismatches: TitleMismatch[] = [];

  for (const [slug, postgresTitle] of postgresTitlesBySlug) {
    const graphTitle = graphTitlesBySlug.get(slug);
    if (!graphTitle) continue;

    for (const field of ['name', 'nameTransliterated', 'desc'] as const) {
      if (comparableString(postgresTitle[field]) !== comparableString(graphTitle[field])) {
        titleMismatches.push({ slug, field, postgres: postgresTitle[field], neo4j: graphTitle[field] });
      }
    }
  }

  const postgresHoldersByKey = new Map(postgresHolders.map((holder) => [titleHolderKey(holder), holder]));
  const graphHoldersByKey = new Map(graphHolders.map((holder) => [titleHolderKey(holder), holder]));
  const holdersPostgresOnly = [...postgresHoldersByKey.keys()].filter((key) => !graphHoldersByKey.has(key)).sort();
  const holdersGraphOnly = [...graphHoldersByKey.keys()].filter((key) => !postgresHoldersByKey.has(key)).sort();

  return {
    invalidPostgresTitles,
    invalidNeo4jTitles,
    invalidPostgresHolders,
    invalidNeo4jHolders,
    titlesPostgresOnly,
    titlesGraphOnly,
    titleMismatches,
    holdersPostgresOnly,
    holdersGraphOnly,
  };
}
