import { givenName, nasabHonorific, NasabLayout } from '@/lib/relationship/nasabLayout';
import styles from './Nasab.module.css';

const COL_WIDTH = 150;
const ROW_HEIGHT = 84;
const NODE_WIDTH = 132;
const NODE_HEIGHT = 48;
const PAD = 12;

export const nasabRowTop = (row: number) => PAD + row * ROW_HEIGHT;
export const nasabPlotHeight = (layout: NasabLayout) => nasabRowTop(Math.max(...layout.nodes.map((node) => node.row))) + NODE_HEIGHT + PAD;

// See docs/plans/nasab-plot.md.
export default function NasabPlot({ layout, isArabic }: { layout: NasabLayout; isArabic: boolean }) {
  const maxCol = Math.max(...layout.nodes.map((node) => node.col));
  const width = maxCol * COL_WIDTH + NODE_WIDTH + PAD * 2;
  const height = nasabPlotHeight(layout);
  const at = new Map(
    layout.nodes.map((node) => [
      node.slug,
      {
        x: PAD + NODE_WIDTH / 2 + (isArabic ? maxCol - node.col : node.col) * COL_WIDTH,
        y: PAD + NODE_HEIGHT / 2 + node.row * ROW_HEIGHT,
      },
    ]),
  );

  return (
    <div tabIndex={0} role="region" aria-label={isArabic ? 'شجرة النسب' : 'Nasab tree'} className={styles.plot}>
      <svg role="img" aria-label={isArabic ? 'شجرة النسب' : 'Nasab tree'} width={width} height={height} className="mx-auto block">
        {layout.edges.map(({ from, to }) => {
          const a = at.get(from)!;
          const b = at.get(to)!;
          const mid = (a.y + b.y) / 2;
          return (
            <path
              key={`${from}>${to}`}
              d={`M${a.x},${a.y + NODE_HEIGHT / 2} V${mid} H${b.x} V${b.y - NODE_HEIGHT / 2}`}
              fill="none"
              className={styles.edge}
              strokeWidth={2}
            />
          );
        })}
        {layout.nodes.map((node) => {
          const { x, y } = at.get(node.slug)!;
          const honorific = nasabHonorific(node);
          return (
            <g key={node.slug} transform={`translate(${x - NODE_WIDTH / 2},${y - NODE_HEIGHT / 2})`}>
              <title>{node.name}{honorific && ` ${node.sex === 'FEMALE' ? 'رضي الله عنها' : 'رضي الله عنه'}`}</title>
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={6}
                strokeWidth={node.isMeeting ? 3 : 1.5}
                className={`${styles.node} ${node.isSubject ? styles.subject : ''} ${node.isMeeting ? styles.meeting : ''}`}
              />
              <text x={NODE_WIDTH / 2} y={29} textAnchor="middle" direction="rtl" className={styles.name}>
                {givenName(node.name)}{honorific && ` ${honorific}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
