import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { GraphData, GraphLink, GraphNode } from '@/types/graph';

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Database configuration is missing' },
      { status: 500 }
    );
  }

  try {
    // Every battle, including ones with no synced participants yet, mirroring
    // how the main /api/graph route returns every person.
    const result = await session.run(
      `MATCH (battle:Battle)
       OPTIONAL MATCH (person:Person)-[relationship:PARTICIPATED_IN]->(battle)
       RETURN battle AS node, relationship, person AS related`
    );

    const nodes = new Map<string, GraphNode>();
    const links: GraphLink[] = [];
    const linkKeys = new Set<string>();

    result.records.forEach((record) => {
      const battle = record.get('node');
      const person = record.get('related');
      const relationship = record.get('relationship');

      if (battle && !nodes.has(battle.identity.toString())) {
        nodes.set(battle.identity.toString(), {
          id: battle.identity.toString(),
          label: battle.properties.name,
          slug: battle.properties.slug,
          group: 1,
          type: 'battle',
        });
      }

      if (person && !nodes.has(person.identity.toString())) {
        nodes.set(person.identity.toString(), {
          id: person.identity.toString(),
          label: person.properties.name,
          slug: person.properties.slug,
          group: 2,
          type: 'person',
        });
      }

      if (battle && person && relationship) {
        const source = person.identity.toString();
        const target = battle.identity.toString();
        const label = relationship.type;
        const key = `${source}|${target}|${label}`;

        if (!linkKeys.has(key)) {
          links.push({ source, target, label, value: 1, status: relationship.properties?.status });
          linkKeys.add(key);
        }
      }
    });

    const body: GraphData = { nodes: Array.from(nodes.values()), links };
    return NextResponse.json(body);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch battles graph data' },
      { status: 500 }
    );
  }
}
