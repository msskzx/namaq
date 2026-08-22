import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { GraphLink, GraphNode } from '@/types/graph';

export async function GET(_request: Request) {
  const { searchParams } = new URL(_request.url);
  const persons = searchParams.getAll('person') as string[];
  const ancestorsOf = searchParams.getAll('ancestorsOf') as string[];
  const battles = searchParams.getAll('battle') as string[];
  const focus = searchParams.get('focus');

  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Database configuration is missing' },
      { status: 500 }
    );
  }

  try {
    let result;

    // Build the query parts
    const queryParts: string[] = [];
    const params: Record<string, string[]> = {};

    // Add person queries
    if (persons.length > 0) {
      queryParts.push(
        `UNWIND $persons AS personSlug
         MATCH path = (p1:Person {slug: personSlug})-[*1..3]-(p2:Person)
         RETURN path`
      );
      params.persons = persons;
    }

    // Add ancestor queries
    if (ancestorsOf.length > 0) {
      queryParts.push(
        `UNWIND $ancestors AS ancestorSlug
         MATCH path = (p1:Person {slug: ancestorSlug})-[r:SON*]->(p2:Person)
         RETURN path`
      );
      params.ancestors = ancestorsOf;
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

    // A focused view is deliberately limited to one hop. The overview remains
    // available without parameters, but this keeps future, larger graphs from
    // requiring every node to be fetched for a person-level exploration.
    if (focus && queryParts.length === 0) {
      result = await session.run(
        `MATCH (node:Person {slug: $focus})
         OPTIONAL MATCH (node)-[relationship]-(related:Person)
         RETURN node, relationship, related`,
        { focus }
      );
    // Determine which query to run based on available parameters
    } else if (queryParts.length === 0) {
      // Return every person, including people without any relationships.
      result = await session.run(
        `MATCH (node:Person)
         OPTIONAL MATCH (node)-[relationship]->(related:Person)
         RETURN node, relationship, related`
      );
    } else if (queryParts.length === 1) {
      // Only one query part, no need for UNION
      result = await session.run(queryParts[0], params);
    } else {
      // Multiple query parts, combine with UNION
      const query = queryParts.join(' UNION ');
      result = await session.run(query, params);
    }

    const nodes = new Map<string, GraphNode>();
    const links: GraphLink[] = [];
    const linkKeys = new Set<string>();

    result.records.forEach(record => {
      if (record.keys.includes('node')) {
        const node = record.get('node');
        const related = record.get('related');
        const relationship = record.get('relationship');

        if (node && !nodes.has(node.identity.toString())) {
          nodes.set(node.identity.toString(), {
            id: node.identity.toString(),
            label: node.properties.name,
            slug: node.properties.slug,
            group: 1,
            type: node.labels?.[0],
          });
        }

        if (related && !nodes.has(related.identity.toString())) {
          nodes.set(related.identity.toString(), {
            id: related.identity.toString(),
            label: related.properties.name,
            slug: related.properties.slug,
            group: 2,
            type: related.labels?.[0],
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

          // Add start node
          if (start && !nodes.has(start.identity.toString())) {
            nodes.set(start.identity.toString(), {
              id: start.identity.toString(),
              label: start.properties.name,
              slug: start.properties.slug,
              group: 1,
            });
          }

          // Add end node
          if (end && !nodes.has(end.identity.toString())) {
            nodes.set(end.identity.toString(), {
              id: end.identity.toString(),
              label: end.properties.name,
              slug: end.properties.slug,
              group: 2,
            });
          }

          // Add link for this segment
          if (start && end && rel) {
            const source = start.identity.toString();
            const target = end.identity.toString();
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
          });
        }
        if (!nodes.has(end.identity.toString())) {
          nodes.set(end.identity.toString(), {
            id: end.identity.toString(),
            label: end.properties.name,
            slug: end.properties.slug,
            group: 2,
          });
        }
        const source = start.identity.toString();
        const target = end.identity.toString();
        const label = rel?.type || 'RELATED';
        const key = `${source}|${target}|${label}`;
        if (!linkKeys.has(key)) {
          links.push({ source, target, label, value: 1 });
          linkKeys.add(key);
        }
      }
    });

    return NextResponse.json({
      nodes: Array.from(nodes.values()) as GraphNode[],
      links
    });

  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}
