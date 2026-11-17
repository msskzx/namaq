import { useSyncExternalStore } from 'react';
import { createAudioPlayer, preload, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio';
import { ayatOf, FIRST, nextStep, pauseAfter, reciterName, reciterOf, surahEnd, type Range, type Step } from '@shared/quran/recitation';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import { ayahCounts, surahNames } from './mushaf';
import { readListenPlan, readReciter } from '@shared/listenSettings';
import { localAyah, streamUrl } from './listenFiles';

/**
 * The one recitation playing in the app: a range of ayat, read by one reciter, with each ayah's and the range's repeats
 * and a pause to say the ayah back. It lives outside any screen, so turning pages or closing a sheet never stops it.
 * One player reads one ayah file at a time; the next file is fetched ahead. A pause plays a second of silence on a loop,
 * which keeps the phone's audio session (and so the app) awake with the screen off.
 */
export type Listening = { range: Range; keys: string[]; step: Step; key: string; playing: boolean; quiet: boolean; reciter: number };

const SILENCE = require('../../assets/silence.mp3');

let state: Listening | null = null;
const listeners = new Set<() => void>();
const emit = (next: Listening | null) => { state = next; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const readListening = () => state;
export const useListening = () => useSyncExternalStore(subscribe, readListening, readListening);

let player: AudioPlayer | null = null;
let quietTimer: ReturnType<typeof setTimeout> | null = null;
/** Set when a file starts, so its own end (and no stale one) moves playback on. */
let loaded: string | null = null;

const title = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${plainName(surahNames[surah] ?? '').replace(/^سورة\s*/, '')} ${num(ayah)}`;
};
const sourceOf = (reciter: number, key: string) => localAyah(reciter, key) ?? streamUrl(reciter, key);

function ensurePlayer() {
  if (player) return player;
  Promise.resolve(setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix', allowsRecording: false })).catch(() => {});
  player = createAudioPlayer(null, { updateInterval: 250 });
  player.addListener('playbackStatusUpdate', onStatus);
  return player;
}

function onStatus(status: AudioStatus) {
  if (!state || !status.didJustFinish || state.quiet || loaded !== state.key) return;
  const plan = readListenPlan();
  const next = nextStep(state.step, state.keys.length, plan);
  const pause = pauseAfter(plan, status.duration, next);
  if (!next) { stopListening(); return; }
  if (!pause) { go(next); return; }
  const p = ensurePlayer();
  loaded = null;
  p.replace(SILENCE);
  p.loop = true;
  p.play();
  emit({ ...state, quiet: true });
  quietTimer = setTimeout(() => { quietTimer = null; if (state) go(next); }, pause * 1000);
}

function go(step: Step, playing = true) {
  if (!state) return;
  if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
  const p = ensurePlayer();
  const key = state.keys[step.at];
  const plan = readListenPlan();
  p.replace({ uri: sourceOf(state.reciter, key) });
  p.loop = false;
  p.setPlaybackRate(plan.speed, 'high');
  loaded = key;
  if (playing) p.play();
  p.setActiveForLockScreen(true, { title: title(key), artist: reciterName(reciterOf(state.reciter)) });
  emit({ ...state, step, key, playing, quiet: false });
  const ahead = nextStep(step, state.keys.length, plan);
  const aheadKey = ahead && state.keys[ahead.at];
  if (aheadKey && aheadKey !== key && !localAyah(state.reciter, aheadKey)) Promise.resolve(preload({ uri: streamUrl(state.reciter, aheadKey) })).catch(() => {});
}

/** Starts a range; with no end, from the ayah to its surah's end. */
export function listen(from: string, to?: string) {
  const range = { from, to: to ?? surahEnd(from, ayahCounts) };
  const keys = ayatOf(range, ayahCounts);
  if (!keys.length) return;
  state = { range, keys, step: FIRST, key: keys[0], playing: true, quiet: false, reciter: readReciter() };
  go(FIRST);
}

export function togglePlaying() {
  if (!state || !player) return;
  if (state.playing) {
    if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
    player.pause();
    emit({ ...state, playing: false });
  } else if (state.quiet) {
    // A pause that was itself paused goes on to what was next.
    const next = nextStep(state.step, state.keys.length, readListenPlan());
    if (next) go(next); else stopListening();
  } else {
    player.play();
    emit({ ...state, playing: true });
  }
}

/** The speed changed in the sheet: the ayah playing takes it at once. */
export function applySpeed() { if (player && state && !state.quiet) player.setPlaybackRate(readListenPlan().speed, 'high'); }

/** Another reciter: the ayah playing starts again in the new voice. */
export function applyReciter(reciter: number) {
  if (!state) return;
  state = { ...state, reciter };
  go({ ...state.step, repeat: 0 }, state.playing);
}

export function stopListening() {
  if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
  loaded = null;
  if (player) { player.pause(); player.clearLockScreenControls(); }
  emit(null);
}
