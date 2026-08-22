import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GraphData, GraphLink, GraphNode } from '@/types/graph';

export async function GET() {
  try {
    const titles = await prisma.title.findMany({
      include: { people: { select: { id: true, name: true, slug: true, nasabRank: true } } },
      orderBy: { name: 'asc' },
    });

    const nodes = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    for (const title of titles) {
      const titleNodeId = `title:${title.id}`;
      nodes.set(titleNodeId, { id: titleNodeId, label: title.name, slug: title.slug, group: 1, type: 'title' });

      for (const person of title.people) {
        const personNodeId = `person:${person.id}`;
        if (!nodes.has(personNodeId)) {
          nodes.set(personNodeId, { id: personNodeId, label: person.name, slug: person.slug, group: 2, type: 'person', nasabRank: person.nasabRank });
        }
        links.push({ source: personNodeId, target: titleNodeId, label: 'HAS_TITLE', value: 1 });
      }
    }

    const body: GraphData = { nodes: Array.from(nodes.values()), links };
    return NextResponse.json(body);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch titles graph data' },
      { status: 500 }
    );
  }
}
