import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { prisma } from '@/lib/prisma';
import { GraphLink, GraphNodeFull } from '@/types/graph';

type EntityType = 'person' | 'battle' | 'title' | 'event';
const KNOWN_TYPES: readonly EntityType[] = ['person', 'battle', 'title', 'event'];

const nodeKey = (type: string, slug: string) => `${type}:${slug}`;

function labelsToType(labels: string[]): EntityType | null {
  for (const label of labels) {
    const type = label.toLowerCase();
    if ((KNOWN_TYPES as readonly string[]).includes(type)) return type as EntityType;
  }
  return null;
}

// A single unified query over every entity type this graph spans, rather
// than one query per type (and, for titles, a separate Postgres-only
// lookup): this is what makes it one traversable graph instead of
// Person/Battle from Neo4j merged with a disconnected Postgres-only titles
// view. Mirrors the query shape in scripts/graph/computeGraphLayout.ts,
// which computes graphRank/clusterId/layoutX/layoutY over the same
// node/edge set. Used for the default (no scoping params) response.
const unifiedNodesQuery = `
  MATCH (n)
  WHERE n:Person OR n:Battle OR n:Title OR n:Event
  RETURN labels(n) AS labels, n.slug AS slug, n.name AS name
`;

const unifiedEdgesQuery = `
  MATCH (a)-[r]->(b)
  WHERE (a:Person OR a:Battle OR a:Title OR a:Event) AND (b:Person OR b:Battle OR b:Title OR b:Event)
  RETURN labels(a) AS sourceLabels, a.slug AS sourceSlug, type(r) AS relType, r.status AS status,
         labels(b) AS targetLabels, b.slug AS targetSlug
`;

interface RankRow {
  slug: string;
  nasabRank?: number | null;
  graphRank: number | null;
  clusterId: number | null;
  layoutX: number | null;
  layoutY: number | null;
}

// Joins graphRank/clusterId/layoutX/layoutY (and, for people, nasabRank)
// from PostgreSQL onto an already-built node list, grouped by type so each
// entity looks up against its own table. Every node kind this route can
// return goes through this same join, not just the unified/default branch.
async function attachPostgresRanks(nodeList: GraphNodeFull[]) {
  const slugsByType = new Map<EntityType, string[]>();
  for (const node of nodeList) {
    const type = (node.type ?? 'person') as EntityType;
    slugsByType.set(type, [...(slugsByType.get(type) ?? []), node.slug]);
  }

  const rankSelect = { slug: true, graphRank: true, clusterId: true, layoutX: true, layoutY: true } as const;
  const [people, battles, titles, events] = await Promise.all([
    prisma.person.findMany({ where: { slug: { in: slugsByType.get('person') ?? [] } }, select: { ...rankSelect, nasabRank: true } }),
    prisma.battle.findMany({ where: { slug: { in: slugsByType.get('battle') ?? [] } }, select: rankSelect }),
    prisma.title.findMany({ where: { slug: { in: slugsByType.get('title') ?? [] } }, select: rankSelect }),
    prisma.event.findMany({ where: { slug: { in: slugsByType.get('event') ?? [] } }, select: rankSelect }),
  ]);

  const rowsByKey = new Map<string, RankRow>([
    ...people.map((row): [string, RankRow] => [nodeKey('person', row.slug), row]),
    ...battles.map((row): [string, RankRow] => [nodeKey('battle', row.slug), row]),
    ...titles.map((row): [string, RankRow] => [nodeKey('title', row.slug), row]),
    ...events.map((row): [string, RankRow] => [nodeKey('event', row.slug), row]),
  ]);

  for (const node of nodeList) {
    const type = (node.type ?? 'person') as EntityType;
    const row = rowsByKey.get(nodeKey(type, node.slug));
    if (type === 'person') node.nasabRank = row?.nasabRank ?? null;
    if (!row) continue;
    node.graphRank = row.graphRank;
    node.clusterId = row.clusterId;
    if (row.layoutX != null && row.layoutY != null) {
      // Pinned (fx/fy), not just a starting position: computeGraphLayout.ts
      // already ran collision avoidance offline for these nodes, so letting
      // the live force simulation move them away from that would just
      // reintroduce the overlap it was computed to avoid. Nodes without a
      // precomputed position (e.g. lineage-only ancestors with no
      // PostgreSQL row) are left free to settle via live physics.
      node.x = row.layoutX;
      node.y = row.layoutY;
      node.fx = row.layoutX;
      node.fy = row.layoutY;
    }
  }
}

export async function GET(_request: Request) {
  const { searchParams } = new URL(_request.url);
  const persons = searchParams.getAll('person') as string[];
  const ancestorsOf = searchParams.getAll('ancestorsOf') as string[];
  const descendantsOf = searchParams.getAll('descendantsOf') as string[];
  const battles = searchParams.getAll('battle') as string[];
  const focus = searchParams.get('focus');
  // Relation types to drop from the response entirely (e.g. the homepage's
  // Prophet-focused preview excludes COMPANION_OF/ACCOMPANIED_BY, since one
  // person having ~250 companions would otherwise dwarf every other
  // relation in that small graph). Applied post-query below rather than in
  // Cypher so the focus/battle/person query shapes stay untouched -- this
  // only ever narrows what gets sent to the client, never what's fetched
  // from Neo4j.
  const excludeRelations = new Set(searchParams.getAll('excludeRelation'));
  // Which node kinds the default (unscoped) response should include.
  // Empty/absent = every kind. This is a whitelist, not a hide-list: e.g.
  // kind=person&kind=battle returns only those two kinds and the links
  // directly between them -- the same shape the old dedicated
  // /api/graph/battles bipartite view had. Only applies to the unified
  // default query below; person/ancestorsOf/descendantsOf/battle/focus are
  // already inherently scoped to the kinds their own semantics produce.
  const requestedKinds = new Set(
    searchParams.getAll('kind').filter((kind): kind is EntityType => (KNOWN_TYPES as readonly string[]).includes(kind))
  );

  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Database configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const queryParts: string[] = [];
    const params: Record<string, string[]> = {};

    // Add person queries
    if (persons.length > 0) {
      queryParts.push(
        `UNWIND $persons AS personSlug
         MATCH path = (p1:Person {slug: personSlug})-[*1]-(p2:Person)
         RETURN path`
      );
      params.persons = persons;
    }

    // Add ancestor (nasab) queries. FATHER only, not SON|DAUGHTER: nasab
    // (نسب) is the patrilineal line specifically, and SON|DAUGHTER would
    // silently mix in maternal ancestors too -- see neo4j/graphSeedData.ts,
    // where a MOTHER edge's reciprocal is still typed SON/DAUGHTER on the
    // child's side (labeled by the child's own sex, not by which parent
    // it's to). FATHER edges are stored father -[:FATHER]-> child, so
    // walking them backward from ancestorSlug reaches every paternal
    // ancestor up to the root of the recorded lineage.
    if (ancestorsOf.length > 0) {
      queryParts.push(
        `UNWIND $ancestors AS ancestorSlug
         MATCH path = (p1:Person {slug: ancestorSlug})<-[r:FATHER*]-(p2:Person)
         RETURN path`
      );
      params.ancestors = ancestorsOf;
    }

    // Add descendant queries: the same SON/DAUGHTER chain, walked in reverse
    // (child -> parent edges followed backward) from the root person down to
    // every child, grandchild, etc.
    if (descendantsOf.length > 0) {
      queryParts.push(
        `UNWIND $descendants AS descendantSlug
         MATCH path = (p1:Person {slug: descendantSlug})<-[r:SON|DAUGHTER*]-(p2:Person)
         RETURN path`
      );
      params.descendants = descendantsOf;
    }

    // A battle only ever connects to Person via PARTICIPATED_IN, so one hop
    // is inherently sufficient here — no hop-limiting logic needed.
    if (battles.length > 0) {
      queryParts.push(
        `UNWIND $battles AS battleSlug
         MATCH (node:Battle {slug: battleSlug})
         OPTIONAL MATCH (node)<-[relationship:PARTICIPATED_IN]-(related:Person)
         RETURN node, relationship, related`
      );
      params.battles = battles;
    }

    let result;
    if (focus && queryParts.length === 0) {
      // A focused view is deliberately limited to one hop. The overview
      // remains available without parameters, but this keeps future,
      // larger graphs from requiring every node to be fetched for a
      // person-level exploration.
      result = await session.run(
        `MATCH (node:Person {slug: $focus})
         OPTIONAL MATCH (node)-[relationship]-(related:Person)
         RETURN node, relationship, related`,
        { focus }
      );
    } else if (queryParts.length === 1) {
      result = await session.run(queryParts[0], params);
    } else if (queryParts.length > 1) {
      result = await session.run(queryParts.join(' UNION '), params);
    }

    if (result) {
      const nodes = new Map<string, GraphNodeFull>();
      const links: GraphLink[] = [];
      const linkKeys = new Set<string>();

      result.records.forEach(record => {
        if (record.keys.includes('node')) {
          const node = record.get('node');
          const related = record.get('related');
          const relationship = record.get('relationship');

          // The anchor `node` is always kept, even when its only
          // relationship(s) are excluded below -- otherwise a focus person
          // whose entire OPTIONAL MATCH result is excluded relations would
          // vanish from the response instead of appearing on their own.
          if (node && !nodes.has(node.identity.toString())) {
            nodes.set(node.identity.toString(), {
              id: node.identity.toString(),
              label: node.properties.name,
              slug: node.properties.slug,
              group: 1,
              type: node.labels?.[0]?.toLowerCase(),
            });
          }

          if (relationship && excludeRelations.has(relationship.type)) return;

          if (related && !nodes.has(related.identity.toString())) {
            nodes.set(related.identity.toString(), {
              id: related.identity.toString(),
              label: related.properties.name,
              slug: related.properties.slug,
              group: 2,
              type: related.labels?.[0]?.toLowerCase(),
            });
          }

          if (node && related && relationship) {
            const source = node.identity.toString();
            const target = related.identity.toString();
            const label = relationship.type;
            const key = `${source}|${target}|${label}`;

            if (!linkKeys.has(key)) {
              links.push({ source, target, label, value: 1, status: relationship.properties?.status });
              linkKeys.add(key);
            }
          }

          return;
        }

        const path = record.get('path');

        // When using RETURN path, Neo4j returns a Path object with segments
        if (path && Array.isArray(path.segments)) {
          for (const seg of path.segments) {
            const start = seg.start;
            const end = seg.end;
            const rel = seg.relationship;

            if (start && !nodes.has(start.identity.toString())) {
              nodes.set(start.identity.toString(), {
                id: start.identity.toString(),
                label: start.properties.name,
                slug: start.properties.slug,
                group: 1,
                type: 'person',
              });
            }

            if (end && !nodes.has(end.identity.toString())) {
              nodes.set(end.identity.toString(), {
                id: end.identity.toString(),
                label: end.properties.name,
                slug: end.properties.slug,
                group: 2,
                type: 'person',
              });
            }

            if (start && end && rel) {
              // rel.start/rel.end are the relationship's own true stored
              // endpoints -- they can differ from this segment's
              // start/end when the path was walked in the opposite
              // direction from how the edge was created (e.g.
              // descendantsOf's `<-[:SON|DAUGHTER*]-`, which walks from
              // the root down while every SON/DAUGHTER edge is actually
              // stored child -> parent). Using the segment's walk order
              // here would render the edge backwards: e.g. a SON edge
              // attributed to the parent as source, reading as "parent
              // is SON of child".
              const source = rel.start.toString();
              const target = rel.end.toString();
              const label = rel.type;
              const key = `${source}|${target}|${label}`;
              if (!linkKeys.has(key)) {
                links.push({ source, target, label, value: 1 });
                linkKeys.add(key);
              }
            }
          }
        } else if (path && path.start && path.end) {
          // Fallback: single-hop path object without segments array
          const start = path.start;
          const end = path.end;
          const rel = path.relationship || path.rel || path.r;

          if (!nodes.has(start.identity.toString())) {
            nodes.set(start.identity.toString(), {
              id: start.identity.toString(),
              label: start.properties.name,
              slug: start.properties.slug,
              group: 1,
              type: 'person',
            });
          }
          if (!nodes.has(end.identity.toString())) {
            nodes.set(end.identity.toString(), {
              id: end.identity.toString(),
              label: end.properties.name,
              slug: end.properties.slug,
              group: 2,
              type: 'person',
            });
          }
          // See the segments branch above for why rel.start/rel.end (the
          // relationship's true stored direction), not path.start/end
          // (the walk direction), must be used here too.
          const source = rel?.start != null ? rel.start.toString() : start.identity.toString();
          const target = rel?.end != null ? rel.end.toString() : end.identity.toString();
          const label = rel?.type || 'RELATED';
          const key = `${source}|${target}|${label}`;
          if (!linkKeys.has(key)) {
            links.push({ source, target, label, value: 1 });
            linkKeys.add(key);
          }
        }
      });

      const nodeList = Array.from(nodes.values());
      const ranks = await prisma.person.findMany({
        where: { slug: { in: nodeList.map((node) => node.slug) } },
        select: { slug: true, nasabRank: true },
      });
      const rankBySlug = new Map(ranks.map((person) => [person.slug, person.nasabRank]));
      for (const node of nodeList) node.nasabRank = rankBySlug.get(node.slug) ?? null;

      return NextResponse.json({ nodes: nodeList, links });
    }

    // Default: no scoping params at all. Return the full unified graph
    // (every Person/Battle/Title/Event node and relationship), optionally
    // narrowed to just the requested `kind`s.
    const nodesResult = await session.run(unifiedNodesQuery);
    const edgesResult = await session.run(unifiedEdgesQuery);

    const nodes = new Map<string, GraphNodeFull>();
    for (const record of nodesResult.records) {
      const type = labelsToType(record.get('labels'));
      const slug = record.get('slug');
      if (!type || !slug) continue;
      if (requestedKinds.size > 0 && !requestedKinds.has(type)) continue;
      const key = nodeKey(type, slug);
      if (!nodes.has(key)) {
        nodes.set(key, { id: key, label: record.get('name') ?? slug, slug, group: 1, type });
      }
    }

    const links: GraphLink[] = [];
    for (const record of edgesResult.records) {
      const sourceType = labelsToType(record.get('sourceLabels'));
      const targetType = labelsToType(record.get('targetLabels'));
      const sourceSlug = record.get('sourceSlug');
      const targetSlug = record.get('targetSlug');
      if (!sourceType || !targetType || !sourceSlug || !targetSlug) continue;
      const sourceKey = nodeKey(sourceType, sourceSlug);
      const targetKey = nodeKey(targetType, targetSlug);
      if (!nodes.has(sourceKey) || !nodes.has(targetKey)) continue;
      links.push({
        source: sourceKey,
        target: targetKey,
        label: record.get('relType'),
        value: 1,
        status: record.get('status') ?? undefined,
      });
    }

    const nodeList = Array.from(nodes.values());
    await attachPostgresRanks(nodeList);

    return NextResponse.json({ nodes: nodeList, links });

  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}
