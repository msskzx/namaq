import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  value: number;
}

interface GraphNode {
  id: string;
  label: string;
  slug: string;
  group: number;
}

export async function GET(
) {
  
  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Database configuration is missing' },
      { status: 500 }
    );
  }

  try {
    // Query to find all relationships between people
    const result = await session.run(
        `MATCH (p1:Person)-[r]-(p2:Person)
        RETURN p1, r, p2
        LIMIT 100`,
    );

    const nodes = new Map();
    const links: GraphLink[] = [];

    result.records.forEach(record => {
      const p1 = record.get('p1');
      const p2 = record.get('p2');
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