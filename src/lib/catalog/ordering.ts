// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
import { createHash } from 'node:crypto';
import { legacyUnreviewed, type Catalog, type CatalogOrdering, type Provenance } from './types';

export interface OrderingProblem {
  readonly path: string;
  readonly message: string;
}

const pathOf = (o: CatalogOrdering) => `orderings/${o.earlier}-before-${o.later}`;
const claimKeys = (cited: { claims: Provenance }) => (cited.claims === legacyUnreviewed ? [] : [...cited.claims]);

function hasCycle(all: readonly CatalogOrdering[]) {
  const edges = all.filter((e) => e.earlier !== e.later);
  const next = new Map<string, string[]>();
  edges.forEach((e) => next.set(e.earlier, [...(next.get(e.earlier) ?? []), e.later]));
  const state = new Map<string, 'open' | 'done'>();
  const visit = (node: string): boolean => {
    if (state.get(node) === 'open') return true;
    if (state.get(node) === 'done') return false;
    state.set(node, 'open');
    const cyclic = (next.get(node) ?? []).some(visit);
    state.set(node, 'done');
    return cyclic;
  };
  return [...next.keys()].some(visit);
}

function cycleNodes(all: readonly CatalogOrdering[]) {
  const edges = all.filter((e) => e.earlier !== e.later);
  const nodes = new Set<string>();
  for (const edge of edges) {
    const rest = edges.filter((e) => e !== edge);
    const reach = new Set<string>([edge.later]);
    for (let grew = true; grew; ) {
      grew = false;
      for (const e of rest) {
        if (reach.has(e.earlier) && !reach.has(e.later)) {
          reach.add(e.later);
          grew = true;
        }
      }
    }
    if (reach.has(edge.earlier)) {
      nodes.add(edge.earlier);
      nodes.add(edge.later);
    }
  }
  return nodes;
}

export function orderingProblems(
  catalog: Pick<Catalog, 'events' | 'battles'> & { orderings?: readonly CatalogOrdering[] },
  claimSources: ReadonlyMap<string, readonly string[]> = new Map(),
) {
  const orderings = catalog.orderings ?? [];
  const errors: OrderingProblem[] = [];
  const disputed = new Set<string>();
  const dated = new Map(
    [...catalog.events, ...catalog.battles].map((s) => [s.slug, s.fields?.hijriYear] as const),
  );

  orderings.forEach((o) => {
    const at = pathOf(o);
    if (!dated.has(o.earlier)) errors.push({ path: at, message: `unknown event or battle ${o.earlier}` });
    if (!dated.has(o.later)) errors.push({ path: at, message: `unknown event or battle ${o.later}` });
    if (o.earlier === o.later) errors.push({ path: at, message: 'an event cannot come before itself' });
    const before = dated.get(o.earlier);
    const after = dated.get(o.later);
    if (before && after && before.value > after.value) {
      const yearSources = [before, after].flatMap(claimKeys).flatMap((key) => claimSources.get(key) ?? []);
      if (yearSources.includes(o.source)) {
        errors.push({ path: at, message: `${o.earlier} (${before.value}) is dated after ${o.later} (${after.value}) in the same source` });
      } else {
        disputed.add(o.earlier);
        disputed.add(o.later);
      }
    }
  });

  const bySource = new Map<string, CatalogOrdering[]>();
  orderings.forEach((o) => bySource.set(o.source, [...(bySource.get(o.source) ?? []), o]));
  for (const [source, edges] of bySource) {
    if (hasCycle(edges)) errors.push({ path: `orderings (${source})`, message: 'the orderings of one source form a cycle' });
  }
  const cyclic = cycleNodes(orderings);
  const inSource = new Set([...bySource.values()].filter(hasCycle).flatMap((edges) => [...cycleNodes(edges)]));
  cyclic.forEach((slug) => {
    if (!inSource.has(slug)) disputed.add(slug);
  });
  return { errors, disputed };
}

export function orderingRevision(ordering: CatalogOrdering, spanTexts: Readonly<Record<string, string>>) {
  const claims = ordering.claims === legacyUnreviewed ? legacyUnreviewed : [...ordering.claims];
  const spans = Object.fromEntries(
    Object.entries(spanTexts).filter(([ref]) => claims !== legacyUnreviewed && claims.includes(ref)),
  );
  return createHash('sha256')
    .update(JSON.stringify({ earlier: ordering.earlier, later: ordering.later, source: ordering.source, claims, spans }))
    .digest('hex')
    .slice(0, 16);
}
