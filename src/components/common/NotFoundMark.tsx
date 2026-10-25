type Point = [number, number];

const four = (x: number): Point[] => [[x + 40, 0], [x, 70], [x + 60, 70], [x + 40, 40], [x + 40, 110]];
const FOUR_EDGES = [[0, 1], [1, 2], [0, 3], [3, 4]];
const ZERO: Point[] = Array.from({ length: 7 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * Math.PI) / 4;
  return [Math.round(145 + 30 * Math.cos(angle)), Math.round(55 + 55 * Math.sin(angle))];
});
const [GAP_START, GAP_END] = [ZERO[6], ZERO[0]];
const toward = (from: Point, to: Point): Point => [from[0] * 0.62 + to[0] * 0.38, from[1] * 0.62 + to[1] * 0.38];

export default function NotFoundMark({ className = '' }: { className?: string }) {
  const fours = [four(0), four(220)];
  return (
    <svg viewBox="-10 -10 300 130" aria-hidden className={className}>
      <g stroke="var(--home-ink)" strokeWidth={2} strokeLinecap="round">
        {fours.flatMap((nodes, k) => FOUR_EDGES.map(([a, b]) => (
          <line key={`${k}-${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        )))}
        {ZERO.slice(1).map((point, i) => (
          <line key={`0-${i}`} x1={ZERO[i][0]} y1={ZERO[i][1]} x2={point[0]} y2={point[1]} />
        ))}
      </g>
      <g stroke="var(--home-muted)" strokeWidth={2} strokeLinecap="round" strokeDasharray="2 4">
        <line x1={GAP_START[0]} y1={GAP_START[1]} x2={toward(GAP_START, GAP_END)[0]} y2={toward(GAP_START, GAP_END)[1]} />
        <line x1={GAP_END[0]} y1={GAP_END[1]} x2={toward(GAP_END, GAP_START)[0]} y2={toward(GAP_END, GAP_START)[1]} />
      </g>
      {fours.flatMap((nodes, k) => nodes.map(([x, y], i) => (
        <circle key={`${k}-${i}`} cx={x} cy={y} r={i === 0 ? 7 : 5.5} fill={i === 0 ? 'var(--home-accent)' : 'var(--home-ink)'} />
      )))}
      {ZERO.map(([x, y], i) => (i === 0 || i === 6
        ? <circle key={`0-${i}`} cx={x} cy={y} r={6} fill="var(--home-paper)" stroke="var(--home-root)" strokeWidth={2} />
        : <circle key={`0-${i}`} cx={x} cy={y} r={5.5} fill="var(--home-ink)" />))}
    </svg>
  );
}
