'use client';

import React from 'react';
import Link from 'next/link';
import { layoutIsnad, NODE_H, NODE_W, type IsnadGraph, type IsnadRow } from '@/lib/model/isnadGraph';

const nodeBox = 'flex h-full items-center justify-center rounded-lg border px-2 text-center text-lg leading-snug';

const rowLabel = (row: IsnadRow, ar: boolean) =>
  row.kind === 'collector'
    ? ar ? 'المصنف' : 'Collector'
    : row.kind === 'unranked'
      ? ar ? 'بلا طبقة' : 'No ṭabaqa'
      : ar ? `الطبقة ${row.tabaqa}` : `Tabaqa ${row.tabaqa}`;

export default function IsnadSvg({
  graph,
  profiles,
  ar = true,
}: {
  graph: IsnadGraph;
  profiles: string[];
  ar?: boolean;
}) {
  const { nodes, edges, rows, width, height } = layoutIsnad(graph);
  const at = new Map(nodes.map((n) => [n.id, n]));
  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto" style={{ direction: 'ltr', maxWidth: '100%', height: 'auto' }} aria-hidden="true">
        <defs>
          <marker id="isnad-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
        {edges.map((edge, i) => {
          const from = at.get(edge.from)!;
          const to = at.get(edge.to)!;
          const level = from.y === to.y;
          const toward = to.x < from.x ? -1 : 1;
          const x1 = from.x + NODE_W / 2 + (level ? (toward * NODE_W) / 2 : 0);
          const y1 = level ? from.y + NODE_H / 2 : from.y;
          const x2 = to.x + NODE_W / 2 - (level ? (toward * NODE_W) / 2 : 0);
          const y2 = level ? to.y + NODE_H / 2 : to.y + NODE_H;
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                markerEnd="url(#isnad-arrow)"
                className={level ? 'stroke-amber-500' : 'stroke-gray-500 dark:stroke-gray-400'}
              />
              {edge.label && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-700 stroke-gray-50 text-sm dark:fill-gray-300 dark:stroke-black"
                  style={{ paintOrder: 'stroke', strokeWidth: 4 }}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
        {rows.map((row) => (
          <text
            key={row.y}
            x={width - 4}
            y={row.y + NODE_H / 2}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-gray-500 text-sm dark:fill-gray-400"
          >
            {rowLabel(row, ar)}
          </text>
        ))}
        {nodes.map((node) => {
          const look = 'border-gray-300 bg-white text-gray-900 dark:border-white/20 dark:bg-gray-900 dark:text-gray-200';
          const linked = node.agent && profiles.includes(node.agent);
          return (
            <foreignObject key={node.id} x={node.x} y={node.y} width={NODE_W} height={NODE_H}>
              {linked ? (
                <Link href={`/people/${node.agent}`} dir="rtl" className={`${nodeBox} ${look} underline decoration-amber-500`}>
                  {node.label}
                </Link>
              ) : (
                <div dir="rtl" className={`${nodeBox} ${look}`}>
                  {node.label}
                </div>
              )}
            </foreignObject>
          );
        })}
      </svg>
      <ol dir="rtl" className="sr-only" aria-label="الإسناد">
        {[...nodes].sort((a, b) => a.rank - b.rank).map((node) => (
          <li key={node.id}>{node.label}</li>
        ))}
      </ol>
    </div>
  );
}
