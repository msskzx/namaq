'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppHadith, AppIsnad } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import Card from '@/components/common/Card';

// The app's isnad drawing (mobile/src/components/Isnad.tsx) for a record of the Forty: its places come in the website's
// steps (`size`) and are drawn in these, each narrator's tabaqa under his name, the whole made smaller when wider than the page.
const NODE_W = 104;
const NODE_H = 60;
const GAP = 8;
const ROW = 88;

const rowName = (row: AppIsnad['rows'][number]) => (row.kind === 'collector' ? '' : row.kind === 'unranked' ? 'بلا طبقة' : `الطبقة ${num(row.tabaqa!)}`);

/** A hadith's isnad: the collector on top, each narrator under the one who heard from him, the word he narrated with on the line. */
export default function FortyIsnad({ isnad, size }: { isnad: AppIsnad; size: AppHadith['size'] }) {
  const box = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const watch = new ResizeObserver(() => setRoom(el.clientWidth));
    watch.observe(el);
    setRoom(el.clientWidth);
    return () => watch.disconnect();
  }, []);
  const fx = (NODE_W + GAP) / (size.width + size.gap);
  const fy = ROW / size.row;
  const placed = isnad.nodes.map(node => ({ ...node, x: node.x * fx, y: node.y * fy, row: isnad.rows.find(row => row.y === node.y) }));
  const width = Math.max(...placed.map(node => node.x)) + NODE_W;
  const height = Math.max(...placed.map(node => node.y)) + NODE_H;
  const k = room && width > room ? room / width : 1;
  const at = new Map(placed.map(node => [node.id, node]));
  const order = [...placed].sort((a, b) => a.y - b.y || a.x - b.x).map(node => node.label);
  const lines = isnad.edges.map((edge, i) => {
    const from = at.get(edge.from)!;
    const to = at.get(edge.to)!;
    const level = from.y === to.y;
    const toward = to.x < from.x ? -1 : 1;
    return { i, edge, level,
      x1: (from.x + NODE_W / 2 + (level ? (toward * NODE_W) / 2 : 0)) * k, y1: (level ? from.y + NODE_H / 2 : from.y) * k,
      x2: (to.x + NODE_W / 2 - (level ? (toward * NODE_W) / 2 : 0)) * k, y2: (level ? to.y + NODE_H / 2 : to.y + NODE_H) * k };
  });
  // No arrowheads (owner, 2026-11-20): an arrow could read as the chain going the other way; the order down the page and the word on each line say who heard from whom.
  const tabaqat = isnad.rows.filter(row => row.kind === 'tabaqa' && row.name);
  return (
    <div ref={box} className="flex flex-col gap-2.5">
      <div role="img" aria-label={`الإسناد: ${order.join('، ')}`} className="relative mx-auto" style={{ width: width * k, height: height * k, direction: 'ltr' }}>
        <svg width={width * k} height={height * k} className="absolute inset-0" aria-hidden>
          {lines.map(({ i, level, x1, y1, x2, y2 }) => {
            const colour = level ? 'var(--home-amber)' : 'var(--home-rule)';
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colour} strokeWidth={1.25} />;
          })}
        </svg>
        {/* The word on a line; between two narrators of one row the gap is too narrow, so it stands over their row. */}
        {lines.filter(line => line.edge.label).map(({ i, edge, level, x1, y1, x2, y2 }) => (
          <span key={`w${i}`} aria-hidden className="pointer-events-none absolute w-20 text-center"
            style={{ left: (x1 + x2) / 2 - 40, top: level ? y1 - (NODE_H / 2 + 20) * k : (y1 + y2) / 2 - 11 * k }}>
            <span className="bg-[var(--home-card)] px-[3px] text-[var(--home-muted)]" style={{ fontSize: 12 * k }}>{edge.label}</span>
          </span>
        ))}
        {placed.map(node => (
          <Card key={node.id} node aria-hidden className="absolute flex flex-col items-center justify-center px-1 text-center"
            style={{ left: node.x * k, top: node.y * k, width: NODE_W * k, height: NODE_H * k }}>
            <span className="line-clamp-2" style={{ fontSize: 14 * k, lineHeight: `${19 * k}px` }}>{node.label}</span>
            {node.row && rowName(node.row) ? <span className="text-[var(--home-muted)]" style={{ fontSize: 10 * k, lineHeight: `${14 * k}px` }}>{rowName(node.row)}</span> : null}
          </Card>
        ))}
      </div>
      {/* The tabaqat's names (Ibn Hajar's, in Taqrib al-Tahdhib), once each, under the drawing. */}
      {tabaqat.length > 0 && <div className="flex flex-col gap-0.5">
        {tabaqat.map(row => <p key={row.y} className="text-[0.8125rem] text-[var(--home-muted)]">{rowName(row)}: {row.name}</p>)}
      </div>}
    </div>
  );
}
