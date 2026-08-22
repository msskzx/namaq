import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { prisma } from '@/lib/prisma';
import { GraphData, GraphLink, GraphNode } from '@/types/graph';

// Person nodes are reachable from all three sources below (family relations,
// battle participation, titles), and each source only knows its own id
// space (Neo4j identity vs. Prisma id). The slug is the one key shared by
// all of them, so person nodes are keyed by slug here rather than by the
// underlying database id, to avoid duplicating a person who appears in
// more than one source.
const personKey = (slug: string) => `person:${slug}`;

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Database configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const nodes = new Map<string, GraphNode>();
    const links: GraphLink[] = [];
    const linkKeys = new Set<string>();

    const addPerson = (properties: { name: string; slug: string }) => {
      const key = personKey(properties.slug);
      if (!nodes.has(key)) {
        nodes.set(key, { id: key, label: properties.name, slug: properties.slug, group: 1, type: 'person' });
      }
      return key;
    };

    const addLink = (source: string, target: string, label: string, status?: string[]) => {
      const key = `${source}|${target}|${label}`;
      if (!linkKeys.has(key)) {
        links.push({ source, target, label, value: 1, status });
        linkKeys.add(key);
      }
    };

    // Neo4j sessions run one statement at a time, so these are awaited in
    // sequence rather than in parallel.
    const peopleResult = await session.run(
      `MATCH (node:Person)
       OPTIONAL MATCH (node)-[relationship]->(related:Person)
       RETURN node, relationship, related`
    );

    for (const record of peopleResult.records) {
      const node = record.get('node');
      const related = record.get('related');
      const relationship = record.get('relationship');

      if (node) addPerson({ name: node.properties.name, slug: node.properties.slug });
      if (related) addPerson({ name: related.properties.name, slug: related.properties.slug });
      if (node && related && relationship) {
        addLink(personKey(node.properties.slug), personKey(related.properties.slug), relationship.type, relationship.properties?.status);
      }
    }

    const battlesResult = await session.run(
      `MATCH (battle:Battle)
       OPTIONAL MATCH (person:Person)-[relationship:PARTICIPATED_IN]->(battle)
       RETURN battle AS node, relationship, person AS related`
    );

    for (const record of battlesResult.records) {
      const battle = record.get('node');
      const person = record.get('related');
      const relationship = record.get('relationship');

      const battleKey = `battle:${battle.properties.slug}`;
      if (!nodes.has(battleKey)) {
        nodes.set(battleKey, { id: battleKey, label: battle.properties.name, slug: battle.properties.slug, group: 1, type: 'battle' });
      }

      if (person) {
        const personNodeKey = addPerson({ name: person.properties.name, slug: person.properties.slug });
        if (relationship) addLink(personNodeKey, battleKey, relationship.type, relationship.properties?.status);
      }
    }

    const titles = await prisma.title.findMany({
      include: { people: { select: { name: true, slug: true, nasabRank: true } } },
      orderBy: { name: 'asc' },
    });

    for (const title of titles) {
      const titleKey = `title:${title.slug}`;
      nodes.set(titleKey, { id: titleKey, label: title.name, slug: title.slug, group: 1, type: 'title' });

      for (const person of title.people) {
        const personNodeKey = addPerson({ name: person.name, slug: person.slug });
        addLink(personNodeKey, titleKey, 'HAS_TITLE');
      }
    }

    // nasabRank lives in PostgreSQL, not Neo4j, so it's attached here as a
    // separate lookup rather than threaded through every node-construction
    // branch above.
    const nodeList = Array.from(nodes.values());
    const personSlugs = nodeList.filter(node => node.type === 'person').map(node => node.slug);
    const ranks = await prisma.person.findMany({
      where: { slug: { in: personSlugs } },
      select: { slug: true, nasabRank: true },
    });
    const rankBySlug = new Map(ranks.map(person => [person.slug, person.nasabRank]));
    for (const node of nodeList) if (node.type === 'person') node.nasabRank = rankBySlug.get(node.slug) ?? null;

    const body: GraphData = { nodes: nodeList, links };
    return NextResponse.json(body);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch combined graph data' },
      { status: 500 }
    );
  }
}
