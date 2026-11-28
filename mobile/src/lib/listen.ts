import { useSyncExternalStore } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio';
import { ayatOf, FIRST, nextStep, pauseAfter, reciterName, reciterOf, surahEnd, type Range, type Step } from '@shared/quran/recitation';
import { num } from '@shared/quran/arabicNumber';
import { ayahCounts } from './mushaf';
import { readListenPlan, readReciter } from '@shared/listenSettings';
import { localAyah, streamUrl } from './listenFiles';
import { surahName } from '@shared/quran/surahNames';
import { reportError } from '@shared/errors';

export type Listening = {
  range: Range; keys: string[]; step: Step; key: string; playing: boolean; quiet: boolean; reciter: number;
  loading: boolean;
  failed: boolean;
};

const silence = () => require('../../assets/silence.mp3');

let state: Listening | null = null;
const listeners = new Set<() => void>();
const emit = (next: Listening | null) => { state = next; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const readListening = () => state;
export const useListening = () => useSyncExternalStore(subscribe, readListening, readListening);

let player: AudioPlayer | null = null;
let quietTimer: ReturnType<typeof setTimeout> | null = null;
let loadTimer: ReturnType<typeof setTimeout> | null = null;
let current: { key: string; started: boolean; heard: boolean; tries: number } | null = null;
const RETRIES = 1;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
const clearRetry = () => { if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; } };
const LOAD_LIMIT = 15000;

const title = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${surahName(surah)} ${num(ayah)}`;
};
const sourceOf = (reciter: number, key: string) => localAyah(reciter, key) ?? streamUrl(reciter, key);

function ensurePlayer() {
  if (player) return player;
  Promise.resolve(setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix', allowsRecording: false })).catch(error => reportError('listen: audio mode', error));
  player = createAudioPlayer(null, { updateInterval: 250 });
  player.addListener('playbackStatusUpdate', onStatus);
  return player;
}

const clearLoad = () => { if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; } };

function fail() {
  clearLoad();
  if (state?.playing && current && current.tries < RETRIES) {
    const tries = current.tries + 1;
    const step = state.step;
    current = null;
    player?.pause();
    retryTimer = setTimeout(() => { retryTimer = null; if (state?.playing && !state.failed) go(step, true, tries); }, 1000);
    return;
  }
  current = null;
  player?.pause();
  player?.clearLockScreenControls();
  if (state) emit({ ...state, playing: false, loading: false, failed: true });
}

function onStatus(status: AudioStatus) {
  if (!state || state.quiet || !current || current.key !== state.key) return;
  if (status.error) { fail(); return; }
  if (!status.didJustFinish) {
    if (!current.started) { if (!status.isLoaded || status.currentTime < 1) current.started = true; return; }
    if (status.playing && status.isLoaded && current.started && !current.heard) {
      current.heard = true;
      clearLoad();
      if (state.loading) emit({ ...state, loading: false });
    }
    return;
  }
  if (!current.heard && !current.started) return;
  current = null;
  const plan = readListenPlan();
  const next = nextStep(state.step, state.keys.length, plan);
  const pause = pauseAfter(plan, status.duration, next);
  if (!next) { stopListening(); return; }
  if (!pause) { go(next); return; }
  const p = ensurePlayer();
  p.replace(silence());
  p.loop = true;
  p.play();
  emit({ ...state, quiet: true });
  quietTimer = setTimeout(() => { quietTimer = null; if (state) go(next); }, pause * 1000);
}

function go(step: Step, playing = true, tries = 0) {
  if (!state) return;
  if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
  clearLoad();
  clearRetry();
  const p = ensurePlayer();
  const key = state.keys[step.at];
  const plan = readListenPlan();
  p.loop = false;
  p.replace({ uri: sourceOf(state.reciter, key) });
  p.setPlaybackRate(plan.speed, 'high');
  current = { key, started: false, heard: false, tries };
  if (playing) { p.play(); loadTimer = setTimeout(() => { loadTimer = null; if (current && !current.heard) fail(); }, LOAD_LIMIT); }
  p.setActiveForLockScreen(true, { title: title(key), artist: reciterName(reciterOf(state.reciter)) });
  emit({ ...state, step, key, playing, quiet: false, loading: playing, failed: false });
}

export function listen(from: string, to?: string) {
  const range = { from, to: to ?? surahEnd(from, ayahCounts) };
  const keys = ayatOf(range, ayahCounts);
  if (!keys.length) return;
  state = { range, keys, step: FIRST, key: keys[0], playing: true, quiet: false, reciter: readReciter(), loading: true, failed: false };
  go(FIRST);
}

export function togglePlaying() {
  if (!state || !player) return;
  if (state.playing) {
    if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
    clearLoad();
    clearRetry();
    player.pause();
    emit({ ...state, playing: false, loading: false });
  } else if (state.quiet) {
    const next = nextStep(state.step, state.keys.length, readListenPlan());
    if (next) go(next); else stopListening();
  } else if (state.failed || !current?.heard) {
    go(state.step);
  } else {
    player.play();
    emit({ ...state, playing: true });
  }
}

export function applySpeed() { if (player && state && !state.quiet) player.setPlaybackRate(readListenPlan().speed, 'high'); }

export function applyReciter(reciter: number) {
  if (!state) return;
  state = { ...state, reciter };
  go({ ...state.step, repeat: 0 }, state.playing);
}

export function stopListening() {
  if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
  clearLoad();
  clearRetry();
  current = null;
  if (player) { player.pause(); player.clearLockScreenControls(); }
  emit(null);
}
