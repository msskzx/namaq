// Which profile route a graph node's slug resolves under, by its `type`.
// Person is the default: it's the most common kind, and existing person
// nodes don't always carry an explicit `type` field.
const PROFILE_PATH_BY_KIND: Record<string, string> = {
  battle: '/battles',
  event: '/events',
};

// A title has no page of its own: its holders are the /people list filtered by it.
export function profilePath(kind: string | undefined, slug: string): string {
  if (kind === 'title') return `/people?title=${slug}`;
  return `${kind ? PROFILE_PATH_BY_KIND[kind] ?? '/people' : '/people'}/${slug}`;
}
