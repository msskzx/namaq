import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { GraphLink, GraphNode } from '@/types/graph';

export async function GET(_request: Request) {
  const { searchParams } = new URL(_request.url);
  const persons = searchParams.getAll('person') as string[];
  const ancestorsOf = searchParams.getAll('ancestorsOf') as string[];

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
    const params: Record<string, any> = {};
    
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
    
    // Determine which query to run based on available parameters
    if (queryParts.length === 0) {
      // No specific queries, return all direct relationships
      result = await session.run(
        `MATCH path = (p1:Person)-[*1..1]->(p2:Person)
         RETURN path`
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