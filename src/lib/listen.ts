'use client';

import { useSyncExternalStore } from 'react';
import surahs from '@shared/data/quran/surahs.json';
import { readListenPlan, readReciter } from '@shared/listenSettings';
import { ayahAudioUrl, ayatOf, FIRST, nextStep, pauseAfter, reciterOf, stepTo, surahEnd, type Range, type Step } from '@shared/quran/recitation';

/**
 * The website's recitation playing (the app's mobile/src/lib/listen.ts): one audio element kept outside the reader, so
 * turning pages never stops it. The range, repeats and pauses follow the same steps (shared/quran/recitation.ts).
 * A browser may hold back sound until a click, so playback only starts from one.
 */
export type Listening = { range: Range; keys: string[]; step: Step; key: string; playing: boolean; quiet: boolean; reciter: number };

export const ayahCounts: ReadonlyMap<number, number> = new Map(surahs.map(row => [row.number, row.numberOfAyat]));

let state: Listening | null = null;
const listeners = new Set<() => void>();
const emit = (next: Listening | null) => { state = next; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const read = () => state;
export const useListening = () => useSyncExternalStore(subscribe, read, () => null);

/**
 * Whether the pages follow the ayah being read. It lives here, not in the reader, because the reader is drawn anew for
 * every page; `landed` is the ayah last seen on the pages, so that leaving it by any link (not only the page arrows)
 * stops the following until the «back to the ayah» pill.
 */
let follow = { on: true, landed: null as string | null };
const followers = new Set<() => void>();
const readFollowing = () => follow.on;
export const useFollowing = () => useSyncExternalStore(cb => { followers.add(cb); return () => { followers.delete(cb); }; }, readFollowing, () => true);
export function setFollowing(on: boolean) {
  follow = { on, landed: on ? null : follow.landed };
  followers.forEach(cb => cb());
}
/** Called with the ayah being read and whether the pages show it; true when the reader should go to it. */
export function shouldFollow(key: string, shown: boolean) {
  if (shown) { follow.landed = key; return false; }
  if (!follow.on) return false;
  if (follow.landed === key) { setFollowing(false); return false; }
  return true;
}

let audio: HTMLAudioElement | null = null;
let ahead: HTMLAudioElement | null = null;
let quietTimer: ReturnType<typeof setTimeout> | null = null;

function element() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'auto';
  audio.addEventListener('ended', onEnded);
  audio.addEventListener('pause', () => { if (state?.playing && !state.quiet && audio && !audio.ended) emit({ ...state, playing: false }); });
  audio.addEventListener('play', () => { if (state && !state.playing) emit({ ...state, playing: true }); });
  return audio;
}

function onEnded() {
  if (!state || !audio) return;
  const plan = readListenPlan();
  const next = nextStep(state.step, state.keys.length, plan);
  if (!next) { stopListening(); return; }
  const pause = pauseAfter(plan, audio.duration || 0, next);
  if (!pause) { go(next); return; }
  emit({ ...state, quiet: true });
  quietTimer = setTimeout(() => { quietTimer = null; if (state) go(next); }, pause * 1000);
}

function go(step: Step, playing = true) {
  if (!state) return;
  if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
  const player = element();
  const key = state.keys[step.at];
  const plan = readListenPlan();
  const url = ayahAudioUrl(reciterOf(state.reciter), key);
  if (player.src !== url) player.src = url;
  else player.currentTime = 0;
  player.playbackRate = plan.speed;
  emit({ ...state, step, key, playing, quiet: false });
  if (playing) player.play().catch(() => { if (state) emit({ ...state, playing: false }); });
  const next = nextStep(step, state.keys.length, plan);
  const nextKey = next && state.keys[next.at];
  if (nextKey && nextKey !== key) { ahead ??= new Audio(); ahead.preload = 'auto'; ahead.src = ayahAudioUrl(reciterOf(state.reciter), nextKey); }
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({ title: key, artist: reciterOf(state.reciter).name });
    navigator.mediaSession.setActionHandler('play', () => togglePlaying());
    navigator.mediaSession.setActionHandler('pause', () => togglePlaying());
  }
}

/** Starts a range; with no end, from the ayah to its surah's end. */
export function listen(from: string, to?: string) {
  const range = { from, to: to ?? surahEnd(from, ayahCounts) };
  const keys = ayatOf(range, ayahCounts);
  if (!keys.length) return;
  state = { range, keys, step: FIRST, key: keys[0], playing: true, quiet: false, reciter: readReciter() };
  setFollowing(true);
  go(FIRST);
}

export function togglePlaying() {
  if (!state || !audio) return;
  if (state.playing) {
    if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
    audio.pause();
    emit({ ...state, playing: false });
  } else if (state.quiet) {
    // A pause that was itself paused goes on to what was next.
    const next = nextStep(state.step, state.keys.length, readListenPlan());
    if (next) go(next); else stopListening();
  } else {
    audio.play().catch(() => {});
    emit({ ...state, playing: true });
  }
}

export function stepAyah(by: 1 | -1) {
  if (!state) return;
  const step = stepTo(state.step, by, state.keys.length);
  if (step) go(step, state.playing);
}

export function applySpeed() { if (audio) audio.playbackRate = readListenPlan().speed; }

export function applyReciter(reciter: number) {
  if (!state) return;
  state = { ...state, reciter };
  go({ ...state.step, repeat: 0 }, state.playing);
}

export function stopListening() {
  if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
  audio?.pause();
  setFollowing(true);
  emit(null);
}
