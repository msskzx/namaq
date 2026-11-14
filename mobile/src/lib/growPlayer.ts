import { useSyncExternalStore } from 'react';
import { grownIds, type Beat } from './growth';

/** Watch grows the tree on its own; ask stops at each ayah's first new box until the timer ends or a tap. */
export type GrowMode = 'watch' | 'ask';
export type Status = 'idle' | 'playing' | 'paused' | 'done';
export type StudioKind = 'tree' | 'matrix' | 'read';
export type Prefs = { mode: GrowMode; speed: number; timer: number };
export const SPEEDS = [1, 1.5, 2, 0.5];
/** Seconds the ask mode waits on an empty box; 0 waits for a tap. */
export const TIMERS = [3, 5, 10, 0, 1];

export type Growth = Prefs & {
  status: Status;
  /** The ayah (step) growing now, and how many there are. */
  at: number;
  total: number;
  /** Whether the open card's studio is open: its controls replace save and share. */
  studio: boolean;
  /** While playing: what is still hidden, what was just drawn, the box waiting for an answer and its time left (0 to 1). */
  hidden: Set<string>;
  now: Set<string>;
  ask?: { id: string; left: number; seconds: number };
  /** The ayah whose path is lit. */
  lit: string | null;
  /** Once the tree has grown: each ayah's path is lit in turn and its ayah read in full. */
  tour: boolean;
  /** What the studio grows: a tree, a book matrix's word connections, or a plain matrix read along word by word. */
  kind: StudioKind;
};

const NONE = new Set<string>();
let state: Growth = { mode: 'watch', speed: 1, timer: 3, status: 'idle', at: 0, total: 0, studio: false, hidden: NONE, now: NONE, lit: null, tour: false, kind: 'tree' };
const listeners = new Set<() => void>();
const set = (next: Partial<Growth>) => {
  state = { ...state, ...next };
  listeners.forEach(listener => listener());
};
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const growthState = () => state;
export const useGrowth = () => useSyncExternalStore(subscribe, growthState, growthState);

/** Where the speed and ask settings are kept (the phone's store; nothing in tests). */
let keep: (prefs: Prefs) => void = () => {};
export function loadPrefs(saved: Partial<Prefs> | undefined, save: (prefs: Prefs) => void) {
  keep = save;
  set({
    mode: saved?.mode === 'ask' ? 'ask' : 'watch',
    speed: SPEEDS.includes(saved?.speed ?? 1) ? saved?.speed ?? 1 : 1,
    timer: TIMERS.includes(saved?.timer ?? 3) ? saved?.timer ?? 3 : 3,
  });
}
export function setPrefs(next: Partial<Prefs>) {
  set(next);
  keep({ mode: state.mode, speed: state.speed, timer: state.timer });
}

/** The tree the studio grows: a card hands its beats (built for both modes) when it becomes the open card. */
export type Target = { watch: Beat[]; ask: Beat[]; kind?: StudioKind };
let target: Target | null = null;
let run = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let reveal: (() => void) | null = null;

const totalOf = (beats: Beat[]) => beats.length ? beats[beats.length - 1].step + 1 : 0;

export function setTarget(next: Target | null) {
  stop();
  target = next;
  set({ total: next ? totalOf(next.watch) : 0, studio: next ? state.studio : false, kind: next?.kind ?? 'tree' });
}

/**
 * Each screen that can grow a tree claims the studio with its own tree (null lets go). The last screen to claim it
 * (a quiz's answer tree over the branches tab) owns it until it lets go; a screen below may change its tree meanwhile
 * without taking the studio back. A change of owner closes the studio.
 */
const claims: { owner: string; target: Target }[] = [];
/** The screen whose target the studio plays now. */
export const studioOwner = () => claims[claims.length - 1]?.owner;
export function claimTarget(owner: string, next: Target | null) {
  const top = claims[claims.length - 1]?.owner;
  const at = claims.findIndex(claim => claim.owner === owner);
  if (next && at >= 0) claims[at] = { owner, target: next };
  else if (next) claims.push({ owner, target: next });
  else if (at >= 0) claims.splice(at, 1);
  const active = claims[claims.length - 1];
  if (active?.owner !== top) closeStudio();
  if ((active?.target ?? null) !== target) setTarget(active?.target ?? null);
}

const TICK = 50;

/** Waits `ms` of playing time (paused time does not count). False once a newer run started. */
function wait(ms: number, token: number, progress?: (left: number) => void) {
  return new Promise<boolean>(resolve => {
    let left = ms;
    let last = Date.now();
    let tapped = false;
    if (progress) reveal = () => { tapped = true; };
    const tick = () => {
      if (token !== run) return resolve(false);
      const now = Date.now();
      if (state.status === 'playing') left -= now - last;
      last = now;
      if (progress && ms > 0) progress(Math.max(0, left / ms));
      if (tapped || (ms > 0 && left <= 0) || (ms === 0 && !progress)) {
        if (progress) reveal = null;
        return resolve(true);
      }
      timer = setTimeout(tick, ms > 0 ? Math.min(TICK, Math.max(1, left)) : TICK);
    };
    tick();
  });
}

/** Plays from an ayah (step). The video always gives the ask mode a timer, so it never waits for a tap. */
export async function play(from = 0, { video = false } = {}) {
  if (!target) return;
  const beats = state.mode === 'ask' ? target.ask : target.watch;
  const token = ++run;
  clearTimeout(timer);
  const all = grownIds(beats);
  const first = beats.findIndex(beat => beat.step >= from);
  const hidden = new Set(all);
  beats.slice(0, Math.max(0, first)).forEach(beat => beat.reveal.forEach(id => hidden.delete(id)));
  set({ status: 'playing', at: from, hidden, now: NONE, ask: undefined, lit: null, tour: false });
  for (const beat of beats.slice(Math.max(0, first))) {
    set({ at: beat.step, lit: beat.key, tour: !!beat.path });
    if (beat.ask) {
      const seconds = state.timer || (video ? TIMERS[0] : 0);
      set({ ask: { id: beat.ask, left: 1, seconds }, now: NONE });
      const answered = await wait(seconds * 1000, token, left => { if (state.ask) set({ ask: { ...state.ask, left } }); });
      if (!answered) return;
      set({ ask: undefined });
      continue;
    }
    const shown = new Set(state.hidden);
    beat.reveal.forEach(id => shown.delete(id));
    set({ hidden: shown, now: beat.now.length ? new Set(beat.now) : beat.reveal.length ? NONE : state.now });
    if (!(await wait(beat.ms / state.speed, token))) return;
    if (!beat.reveal.length && !beat.now.length) set({ now: NONE });
  }
  set({ status: 'done', at: totalOf(beats), hidden: NONE, now: NONE, lit: null, tour: false });
}

/** A tap on the box waiting for an answer shows it. */
export const answer = () => reveal?.();

export function pause(paused: boolean) {
  if (state.status !== 'playing' && state.status !== 'paused') return;
  set({ status: paused ? 'paused' : 'playing' });
}

export function stop() {
  run++;
  clearTimeout(timer);
  reveal = null;
  set({ status: 'idle', at: 0, hidden: NONE, now: NONE, ask: undefined, lit: null, tour: false });
}

/** Opens the card's studio: its controls show, the tree waits for play. */
export function openStudio() {
  if (state.total > 0) set({ studio: true });
}

export function closeStudio() {
  stop();
  set({ studio: false });
}
