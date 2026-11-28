
export const DAY_MINUTES = 24 * 60;

export const dayMinute = (date: Date) => date.getHours() * 60 + date.getMinutes();

export const dialAngle = (minute: number) => (((minute - DAY_MINUTES / 2) / DAY_MINUTES) * 360 + 360) % 360;

export function onCircle(degrees: number, r: number): [number, number] {
  const a = (degrees * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
}

export function dialArc(from: number, to: number, r: number) {
  const [x1, y1] = onCircle(dialAngle(from), r);
  const [x2, y2] = onCircle(dialAngle(to), r);
  const span = (((to - from) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${span > DAY_MINUTES / 2 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function lineRows(minutes: readonly number[], height: number, gap: number): number[] {
  const rows: number[] = [];
  for (const minute of minutes) {
    const at = (minute / DAY_MINUTES) * height;
    rows.push(rows.length ? Math.max(at, rows[rows.length - 1] + gap) : at);
  }
  const over = rows.length ? rows[rows.length - 1] - height : 0;
  if (over > 0) {
    rows[rows.length - 1] = height;
    for (let i = rows.length - 2; i >= 0; i--) rows[i] = Math.min(rows[i], rows[i + 1] - gap);
  }
  return rows;
}

const SYNODIC = 29.53;

export function moonOn(day: number): { lit: number; waxing: boolean } {
  const turn = (day - 1) / SYNODIC;
  return { lit: (1 - Math.cos(2 * Math.PI * turn)) / 2, waxing: turn < 0.5 };
}

export function moonPath(day: number, r: number) {
  const { lit, waxing } = moonOn(day);
  const rx = Math.abs(1 - 2 * lit) * r;
  const outer = waxing ? 1 : 0;
  const inner = lit < 0.5 ? 1 - outer : outer;
  return `M0 ${-r} A${r} ${r} 0 0 ${outer} 0 ${r} A${rx.toFixed(2)} ${r} 0 0 ${inner} 0 ${-r}Z`;
}
