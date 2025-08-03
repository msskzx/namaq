import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { GraphLink, GraphNode } from '@/types/graph';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = getSession();

  console.log(slug);

  if (!session) {
    return NextResponse.json(
      { error: 'Database configuration is missing' },
      { status: 500 }
    );
  }

  try {
    // Query to find all relationships between people
    const result = await session.run(
        `MATCH (p:Person {slug: $slug})-[r]-(neighbor)
        WHERE neighbor:Person
        RETURN p, r, neighbor
        LIMIT 100`,
        { slug }
    );

    const nodes = new Map();
    const links: GraphLink[] = [];

    result.records.forEach(record => {
      const p1 = record.get('p');
      const p2 = record.get('neighbor');
      const rel = record.get('r');

      // Add nodes if they don't exist
      if (!nodes.has(p1.identity.toString())) {
        nodes.set(p1.identity.toString(), {
          id: p1.identity.toString(),
          label: p1.properties.name,
          slug: p1.properties.slug,
          group: 1
        });
      }

      if (!nodes.has(p2.identity.toString())) {
        nodes.set(p2.identity.toString(), {
          id: p2.identity.toString(),
          label: p2.properties.name,
          slug: p2.properties.slug,
          group: 2
        });
      }

      // Add relationship
      links.push({
        source: p1.identity.toString(),
        target: p2.identity.toString(),
        label: rel.type,
        value: 1
      });
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