import { useId, type CSSProperties } from 'react';
import { MARK } from './Emblem';
import styles from './InkLoader.module.css';

export type InkLoaderVariant = 'tree' | 'graph';

const GRAPH_POINTS: [number, number][] = [[120, 105], [157, 142], [137, 187], [80, 195], [43, 158], [63, 114]];
const GRAPH_COLOURS = ['accent', 'root', 'green', 'root', 'green', 'accent'];
const GRAPH_EDGES: [string, string][] = [
  ...GRAPH_POINTS.map(([x, y], i): [string, string] => [i % 2 ? 'step2' : 'step1', `M100 150 L${x} ${y}`]),
  ...[[0, 1], [2, 3], [4, 5], [1, 2]].map(([a, b]): [string, string] => ['step3', `M${GRAPH_POINTS[a]} L${GRAPH_POINTS[b]}`]),
];
const GRAPH_NODES = GRAPH_POINTS.map(([x, y], i): [string, string, number, number] => [i % 2 ? 'step2' : 'step1', GRAPH_COLOURS[i], x, y]);

function LogoLoader({ className }: { className: string }) {
  return (
    <svg viewBox="12 0 76 101" aria-hidden className={`${styles.loader} ${styles.logo} ${className}`}>
      <g className={styles.loop}>
        <circle className={`${styles.blot} ${styles.accent}`} cx={50} cy={84} r={4} />
        <g className={styles.logoMark} style={{ '--logo-accent': 'var(--home-accent)' } as CSSProperties} dangerouslySetInnerHTML={{ __html: MARK }} />
        <ellipse className={`${styles.drop} ${styles.ink}`} style={{ '--fall': '76px' } as CSSProperties} cx={50} cy={8} rx={2} ry={2.6} />
      </g>
    </svg>
  );
}

export default function InkLoader({ variant = 'tree', className = '' }: { variant?: InkLoaderVariant; className?: string }) {
  return variant === 'tree' ? <LogoLoader className={className} /> : <GraphLoader className={className} />;
}

function GraphLoader({ className }: { className: string }) {
  const filter = `ink-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [rx, ry] = [100, 150];
  const edges = GRAPH_EDGES;
  const nodes = GRAPH_NODES;
  return (
    <svg viewBox="20 -40 160 255" aria-hidden className={`${styles.loader} ${className}`}>
      <defs>
        <filter id={filter} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves={2} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={5} />
        </filter>
      </defs>
      <g className={styles.loop}>
        <g strokeWidth={1.4}>
          {edges.map(([step, d]) => <path key={d} className={`${styles.edge} ${styles[step]}`} pathLength={1} d={d} />)}
        </g>
        {nodes.map(([step, colour, cx, cy]) => (
          <circle key={`${cx} ${cy}`} className={`${styles.node} ${styles[step]} ${styles[colour]}`} cx={cx} cy={cy} r={5} strokeWidth={1.6} />
        ))}
        <circle className={`${styles.blot} ${styles.ink}`} cx={rx} cy={ry} r={7} filter={`url(#${filter})`} />
        <ellipse className={`${styles.drop} ${styles.ink}`} style={{ '--fall': `${ry - 77}px` } as CSSProperties} cx={98.2} cy={76} rx={2.4} ry={3} />
        <g className={styles.quill}>
          <g transform="translate(100 70) rotate(28)">
            <path className={styles.vane} strokeWidth={1.3} d="M0 -6 C-3 -30 -16 -52 -9 -86 C-5 -100 4 -104 6 -98 C12 -70 8 -40 0 -6 Z" />
            <path fill="none" stroke="currentColor" strokeWidth={1.2} d="M0 -2 C-1 -40 -1 -70 2 -100" />
            <path className={styles.barb} fill="none" strokeWidth={0.9} d="M-0.5 -30 L-9 -40 M-0.6 -45 L-11 -56 M-0.4 -60 L-10 -72 M0 -75 L-6 -88 M-0.3 -38 L6 -48 M-0.3 -54 L7 -64 M0.4 -70 L6 -82" />
            <path className={styles.ink} d="M-2.2 -8 L0 4 L2.2 -8 Z" />
          </g>
          <ellipse className={`${styles.bead} ${styles.ink}`} cx={98.2} cy={74.5} rx={2.2} ry={2.6} />
        </g>
      </g>
    </svg>
  );
}
