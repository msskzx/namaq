/**
 * The properties shared by a profile in PostgreSQL and its visual node in
 * Neo4j. Slug is the stable cross-database identifier.
 */
export type CanonicalPerson = {
  slug: string;
  name: string;
  fullName: string | null;
  nameTransliterated: string | null;
};

export type PersonMismatch = {
  slug: string;
  field: keyof Omit<CanonicalPerson, 'slug'>;
  postgres: string | null;
  neo4j: string | null;
};

export type PersonReconciliation = {
  invalidPostgresPeople: string[];
  invalidNeo4jPeople: string[];
  postgresOnly: string[];
  graphOnly: string[];
  mismatches: PersonMismatch[];
};

const comparable = (value: string | null | undefined) =>
  value?.trim().replace(/\s+/g, ' ') || null;

export function validateCanonicalPeople(people: CanonicalPerson[]): string[] {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const person of people) {
    const slug = person.slug?.trim();
    if (!slug) issues.push('A person is missing a slug.');
    else if (seen.has(slug)) issues.push(`Duplicate slug: ${slug}`);
    else seen.add(slug);

    if (!person.name?.trim()) issues.push(`Person ${slug || '(unknown)'} is missing a name.`);
  }

  return issues;
}

/**
 * Compare the two stores without changing either one. Graph-only people are
 * expected: a genealogy can contain people who do not yet have a profile page.
 */
export function reconcilePeople(
  postgresPeople: CanonicalPerson[],
  graphPeople: CanonicalPerson[],
): PersonReconciliation {
  const invalidPostgresPeople = validateCanonicalPeople(postgresPeople);
  const invalidNeo4jPeople = validateCanonicalPeople(graphPeople);
  const postgresBySlug = new Map(postgresPeople.map((person) => [person.slug, person]));
  const graphBySlug = new Map(graphPeople.map((person) => [person.slug, person]));
  const postgresOnly = [...postgresBySlug.keys()].filter((slug) => !graphBySlug.has(slug)).sort();
  const graphOnly = [...graphBySlug.keys()].filter((slug) => !postgresBySlug.has(slug)).sort();
  const mismatches: PersonMismatch[] = [];

  for (const [slug, postgresPerson] of postgresBySlug) {
    const graphPerson = graphBySlug.get(slug);
    if (!graphPerson) continue;

    for (const field of ['name', 'fullName', 'nameTransliterated'] as const) {
      if (comparable(postgresPerson[field]) !== comparable(graphPerson[field])) {
        mismatches.push({
          slug,
          field,
          postgres: postgresPerson[field],
          neo4j: graphPerson[field],
        });
      }
    }
  }

  return { invalidPostgresPeople, invalidNeo4jPeople, postgresOnly, graphOnly, mismatches };
}
