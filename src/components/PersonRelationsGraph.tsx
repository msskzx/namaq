import React from 'react';
import type { Person, PersonRelation } from '@/generated/prisma';
import translations from './translations';
import Link from 'next/link';

interface PersonRelationsGraphProps {
  person: Person;
  relationsFrom: (PersonRelation & { to: Person })[];
  relationsTo: (PersonRelation & { from: Person })[];
}

const NODE_RADIUS = 60;
const CENTER_X = 200;
const CENTER_Y = 200;
const RADIUS = 140;

export default function PersonRelationsGraph({ person, relationsFrom, relationsTo }: PersonRelationsGraphProps) {
  // Combine all relations for display
  const allRelations = [
    ...relationsFrom.map(rel => ({
      id: rel.id,
      name: rel.to?.name,
      type: rel.type,
      direction: 'from',
      slug: rel.to?.slug,
    })),
    ...relationsTo.map(rel => ({
      id: rel.id,
      name: rel.from?.name,
      type: rel.type,
      direction: 'to',
      slug: rel.from?.slug,
    })),
  ];

  // Group relations by slug to show all types between the same two people
  const relationPairs: Record<string, { types: string[]; names: string[]; id: string; slug?: string }> = {};
  allRelations.forEach(rel => {
    if (!rel.slug) return;
    const key = [person.slug, rel.slug].sort().join('-');
    if (!relationPairs[key]) {
      relationPairs[key] = { types: [], names: [], id: rel.id, slug: rel.slug };
    }
    relationPairs[key].id = rel.id;
    relationPairs[key].slug = rel.slug;
    if (rel.type && !relationPairs[key].types.includes(rel.type)) {
      relationPairs[key].types.push(rel.type);
    }
    if (rel.name && !relationPairs[key].names.includes(rel.name)) {
      relationPairs[key].names.push(rel.name);
    }
  });
  const relationPairList = Object.entries(relationPairs);

  // Calculate positions for related nodes in a circle
  const angleStep = (2 * Math.PI) / Math.max(relationPairList.length, 1);

  // Use Arabic translations for relation types
  const relationTypeArabic = translations.ar.relationTypes;

  return (
    <div className="flex justify-center my-8">
      <svg width={400} height={400}>
        {/* Render all lines first so they appear beneath the nodes */}
        {relationPairList.map(([key, rel], i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = CENTER_X + RADIUS * Math.cos(angle);
          const y = CENTER_Y + RADIUS * Math.sin(angle);
          return (
            <line key={rel.id + '-line'} x1={CENTER_X} y1={CENTER_Y} x2={x} y2={y} stroke="#888" strokeWidth={2} />
          );
        })}
        {/* Center node (the person) */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={NODE_RADIUS} fill="#6366f1" />
        <text x={CENTER_X} y={CENTER_Y} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={18} fontWeight="bold">
          {person.name}
        </text>
        {/* Relation nodes */}
        {relationPairList.map(([key, rel], i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = CENTER_X + RADIUS * Math.cos(angle);
          const y = CENTER_Y + RADIUS * Math.sin(angle);
          // Spread labels along the line
          const labelSpacing = 18;
          return (
            <g key={rel.id}>
              {/* Node as a link if slug exists; only circle and text are clickable */}
              <g>
                {rel.slug ? (
                  <Link href={`/people/${rel.slug}`}>
                    <circle cx={x} cy={y} r={40} fill="#f3f4f6" style={{ cursor: 'pointer' }} />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#222" fontSize={14} fontWeight="bold" style={{ cursor: 'pointer' }}>
                      {rel.names[0]}
                    </text>
                  </Link>
                ) : (
                  <>
                    <circle cx={x} cy={y} r={40} fill="#f3f4f6" />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#222" fontSize={14} fontWeight="bold">
                      {rel.names[0]}
                    </text>
                  </>
                )}
              </g>
              {/* All relation type labels under the node, reversed order */}
              {[...rel.types].reverse().map((type, idx) => {
                const labelSpacing = 18;
                const labelY = y + 40 + labelSpacing + idx * 16; // 40 is node radius, 18 is spacing, 16 is line height
                return (
                  <text key={type} x={x} y={labelY} textAnchor="middle" fill="#888" fontSize={13} fontWeight="bold">
                    {relationTypeArabic[type as keyof typeof relationTypeArabic] || type}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
} 