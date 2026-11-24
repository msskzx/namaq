/**
 * The drawing of a day on the tools page (owner, 2026-11-24): the prayer times on a 24-hour dial or down a line of the
 * day's sky, the reader switching between the two; and the month's moons under the qibla. Pure geometry, no times worked out here.
 */

export const DAY_MINUTES = 24 * 60;

/** Minutes since the phone's midnight. */
export const dayMinute = (date: Date) => date.getHours() * 60 + date.getMinutes();

/** Where a minute of the day sits on the dial: degrees clockwise from the top, noon on top and midnight at the bottom. */
export const dialAngle = (minute: number) => (((minute - DAY_MINUTES / 2) / DAY_MINUTES) * 360 + 360) % 360;

/** A point on a circle of radius `r` about the centre, at `degrees` clockwise from the top. */
export function onCircle(degrees: number, r: number): [number, number] {
  const a = (degrees * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
}

/** An SVG arc from one minute of the day to a later one, clockwise round the dial. */
export function dialArc(from: number, to: number, r: number) {
  const [x1, y1] = onCircle(dialAngle(from), r);
  const [x2, y2] = onCircle(dialAngle(to), r);
  const span = (((to - from) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${span > DAY_MINUTES / 2 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/**
 * Where each time's row goes down the day's line, `height` tall: at its own minute, unless that would crowd the row above,
 * then pushed down to `gap` under it (and the whole lifted back if the last would fall off the end). Order is kept.
 */
export function lineRows(minutes: readonly number[], height: number, gap: number): number[] {
  const rows: number[] = [];
  for (const minute of minutes) {
    const at = (minute / DAY_MINUTES) * height;
    rows.push(rows.length ? Math.max(at, rows[rows.length - 1] + gap) : at);
  }
  const over = rows.length ? rows[rows.length - 1] - height : 0;
  if (over > 0) {
    // Lifted from the bottom up, each row only as far as the one under it needs.
    rows[rows.length - 1] = height;
    for (let i = rows.length - 2; i >= 0; i--) rows[i] = Math.min(rows[i], rows[i + 1] - gap);
  }
  return rows;
}

/** A lunar month's length in days, as the moon's phases go round. */
const SYNODIC = 29.53;

/**
 * How much of the moon is lit on a day of the Hijri month (0 new, 1 full) and whether it is growing: a drawing from the
 * day's number alone, the month starting at the new crescent, not an astronomical reckoning.
 */
export function moonOn(day: number): { lit: number; waxing: boolean } {
  const turn = (day - 1) / SYNODIC;
  return { lit: (1 - Math.cos(2 * Math.PI * turn)) / 2, waxing: turn < 0.5 };
}

/**
 * The lit part of a moon of radius `r` centred on the origin, as an SVG path: the outer half on the lit side and the
 * terminator, an ellipse whose width follows how much is lit. A growing moon is lit on the right.
 */
export function moonPath(day: number, r: number) {
  const { lit, waxing } = moonOn(day);
  const rx = Math.abs(1 - 2 * lit) * r;
  // The outer half: clockwise from the top round the right (growing) or anticlockwise round the left (waning).
  const outer = waxing ? 1 : 0;
  // The terminator bows towards the lit side while less than half is lit, away from it after.
  const inner = lit < 0.5 ? 1 - outer : outer;
  return `M0 ${-r} A${r} ${r} 0 0 ${outer} 0 ${r} A${rx.toFixed(2)} ${r} 0 0 ${inner} 0 ${-r}Z`;
}
