import React from 'react';
import type { Person, PersonRelation } from '@/generated/prisma';
import translations from './translations';
import Link from 'next/link';

interface PersonRelationsGraphProps {
  person: Person;
  relationsFrom: (PersonRelation & { to: Person })[];
  relationsTo: (PersonRelation & { from: Person })[];
}

const CANVAS_SIZE = 800;
const NODE_RADIUS = 80;
const CHILD_NODE_RADIUS = 60;
const CENTER_X = CANVAS_SIZE / 2;
const CENTER_Y = CANVAS_SIZE / 2;
const RADIUS = 220;

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

  // TODO check this or maybe remove it
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

  // Track which node is hovered (by id or 'center')
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  return (
    <div className="flex justify-center items-center my-8">
      <svg width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ display: 'block', margin: '0 auto' }}>
        {/* Render all lines first so they appear beneath the nodes */}
        {relationPairList.map(([, rel], i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = CENTER_X + RADIUS * Math.cos(angle);
          const y = CENTER_Y + RADIUS * Math.sin(angle);
          return (
            <line key={rel.id + '-line'} x1={CENTER_X} y1={CENTER_Y} x2={x} y2={y} stroke="#888" strokeWidth={2} />
          );
        })}
        {/* Center node (the person) with hover effect */}
        {(() => {
          const isHovered = hoveredNode === 'center';
          const centerRadius = isHovered ? NODE_RADIUS + 12 : NODE_RADIUS;
          const centerFill = isHovered ? '#312e81' : '#1e1b4b'; // indigo-900 on hover, indigo-950 default
          const centerTextFill = '#fbbf24';
          const centerTextWeight = isHovered ? 900 : 700;
          if (person.slug) {
            return (
              <g onMouseEnter={() => setHoveredNode('center')} onMouseLeave={() => setHoveredNode(null)} style={{ transition: 'all 0.2s' }}>
                <Link href={`/people/${person.slug}`}>
                  <circle cx={CENTER_X} cy={CENTER_Y} r={centerRadius} fill={centerFill} style={{ cursor: 'pointer', transition: 'all 0.2s' }} />
                  <text x={CENTER_X} y={CENTER_Y} textAnchor="middle" dominantBaseline="middle" fill={centerTextFill} fontSize={22} fontWeight={centerTextWeight} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                    {person.name}
                  </text>
                </Link>
              </g>
            );
          } else {
            return (
              <g onMouseEnter={() => setHoveredNode('center')} onMouseLeave={() => setHoveredNode(null)} style={{ transition: 'all 0.2s' }}>
                <circle cx={CENTER_X} cy={CENTER_Y} r={centerRadius} fill={centerFill} style={{ transition: 'all 0.2s' }} />
                <text x={CENTER_X} y={CENTER_Y} textAnchor="middle" dominantBaseline="middle" fill={centerTextFill} fontSize={22} fontWeight={centerTextWeight} style={{ transition: 'all 0.2s' }}>
                  {person.name}
                </text>
              </g>
            );
          }
        })()}
        {/* Relation nodes */}
        {relationPairList.map(([, rel], i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = CENTER_X + RADIUS * Math.cos(angle);
          const y = CENTER_Y + RADIUS * Math.sin(angle);
          const isHovered = hoveredNode === rel.id;
          const nodeRadius = isHovered ? CHILD_NODE_RADIUS + 10 : CHILD_NODE_RADIUS;
          const nodeFill = isHovered ? '#374151' : '#1f2937'; // gray-700 on hover, gray-800 default
          const textWeight = isHovered ? 900 : 700;
          return (
            <g key={rel.id} onMouseEnter={() => setHoveredNode(rel.id)} onMouseLeave={() => setHoveredNode(null)} style={{ transition: 'all 0.2s' }}>
              {/* Node as a link if slug exists; only circle and text are clickable */}
              <g>
                {rel.slug ? (
                  <Link href={`/people/${rel.slug}`}>
                    <circle cx={x} cy={y} r={nodeRadius} fill={nodeFill} style={{ cursor: 'pointer', transition: 'all 0.2s' }} />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#fbbf24" fontSize={16} fontWeight={textWeight} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                      {rel.names[0]}
                    </text>
                  </Link>
                ) : (
                  <>
                    <circle cx={x} cy={y} r={nodeRadius} fill={nodeFill} style={{ transition: 'all 0.2s' }} />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#fbbf24" fontSize={16} fontWeight={textWeight} style={{ transition: 'all 0.2s' }}>
                      {rel.names[0]}
                    </text>
                  </>
                )}
              </g>
              {/* All relation type labels under the node, reversed order */}
              {[...rel.types].reverse().map((type, idx) => {
                const labelY = y + nodeRadius + 18 + idx * 16;
                return (
                  <text key={type} x={x} y={labelY} textAnchor="middle" fill="#818cf8" fontSize={13} fontWeight="bold">
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