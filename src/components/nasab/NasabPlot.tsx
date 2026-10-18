import { givenName, NasabLayout } from '@/lib/relationship/nasabLayout';

const COL_WIDTH = 150;
const ROW_HEIGHT = 84;
const NODE_WIDTH = 132;
const NODE_HEIGHT = 48;
const PAD = 12;

// See docs/plans/nasab-plot.md.
export default function NasabPlot({ layout, isArabic }: { layout: NasabLayout; isArabic: boolean }) {
  const maxCol = Math.max(...layout.nodes.map((node) => node.col));
  const maxRow = Math.max(...layout.nodes.map((node) => node.row));
  const width = maxCol * COL_WIDTH + NODE_WIDTH + PAD * 2;
  const height = maxRow * ROW_HEIGHT + NODE_HEIGHT + PAD * 2;
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
    <div tabIndex={0} role="region" aria-label={isArabic ? 'شجرة النسب' : 'Nasab tree'} className="overflow-auto rounded border border-amber-400 bg-gray-50 dark:bg-black">
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
              className="stroke-gray-400 dark:stroke-gray-500"
              strokeWidth={2}
            />
          );
        })}
        {layout.nodes.map((node) => {
          const { x, y } = at.get(node.slug)!;
          return (
            <g key={node.slug} transform={`translate(${x - NODE_WIDTH / 2},${y - NODE_HEIGHT / 2})`}>
              <title>{node.name}</title>
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={6}
                strokeWidth={node.isMeeting ? 3 : 1.5}
                className={`${node.isSubject ? 'fill-amber-200 dark:fill-amber-800' : 'fill-white dark:fill-gray-900'} ${node.isMeeting ? 'stroke-amber-600 dark:stroke-amber-300' : 'stroke-amber-400'}`}
              />
              <text x={NODE_WIDTH / 2} y={29} textAnchor="middle" className="fill-gray-900 text-sm dark:fill-gray-100">
                {givenName(node.name)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
