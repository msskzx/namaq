import { keyStore } from '../storage';
import { REST_DAYS } from '../ayahMarks';

export type Missed = Record<string, { kind: string; seed: number; step: number; due: number }>;

const NONE: Missed = {};
const DAY = 86_400_000;

function parse(raw: string | null): Missed {
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return NONE;
    const out: Missed = {};
    for (const [id, value] of Object.entries(parsed as Record<string, Missed[string]>)) {
      if (value && typeof value.kind === 'string' && Number.isFinite(value.seed) && Number.isFinite(value.step) && Number.isFinite(value.due)) out[id] = value;
    }
    return Object.keys(out).length ? out : NONE;
  } catch {
    return NONE;
  }
}

const store = keyStore('missed-questions', parse);
export const readMissed = store.read;
export const subscribeMissed = store.subscribe;

const idOf = (kind: string, seed: number) => `${kind}:${seed}`;

export function answeredQuestion(kind: string, seed: number, right: boolean, now = Date.now()) {
  const missed = readMissed();
  const id = idOf(kind, seed);
  if (right) {
    if (!(id in missed)) return;
    const rest = { ...missed };
    delete rest[id];
    store.write(JSON.stringify(rest));
    return;
  }
  const step = Math.min((missed[id]?.step ?? 0) + 1, REST_DAYS.length);
  store.write(JSON.stringify({ ...missed, [id]: { kind, seed, step, due: now + REST_DAYS[step - 1] * DAY } }));
}

export const dueSeeds = (missed: Missed, kind: string, now = Date.now()) =>
  Object.values(missed).filter(item => item.kind === kind && item.due <= now).sort((a, b) => a.due - b.due).map(item => item.seed);
