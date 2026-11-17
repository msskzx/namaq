import { useSyncExternalStore } from 'react';
import { createAudioPlayer, preload, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio';
import { ayatOf, FIRST, nextStep, pauseAfter, reciterName, reciterOf, surahEnd, type Range, type Step } from '@shared/quran/recitation';
import { num } from '@shared/quran/arabicNumber';
import { ayahCounts } from './mushaf';
import { readListenPlan, readReciter } from '@shared/listenSettings';
import { localAyah, streamUrl } from './listenFiles';
import { surahName } from '@shared/quran/surahNames';

/**
 * The one recitation playing in the app: a range of ayat, read by one reciter, with each ayah's and the range's repeats
 * and a pause to say the ayah back. It lives outside any screen, so turning pages or closing a sheet never stops it.
 * One player reads one ayah file at a time; the next file is fetched ahead. A pause plays a second of silence on a loop,
 * which keeps the phone's audio session (and so the app) awake with the screen off.
 */
export type Listening = {
  range: Range; keys: string[]; step: Step; key: string; playing: boolean; quiet: boolean; reciter: number;
  /** The ayah's file is still on its way: asked to play, nothing heard yet. */
  loading: boolean;
  /** The ayah could not be played (no connection and not downloaded, or a broken file); play tries it again. */
  failed: boolean;
};

/** Asked for when a pause starts, so the module loads without the audio file (and in tests). */
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
/**
 * The file asked for last. Its end moves playback on only once it has been heard playing, and only once: an end
 * reported for the file before it (the same ayah again on a repeat included) or reported twice is not this file's.
 * A status still on its way from the file before cannot tell which file it is for, so the file counts as heard only
 * after one status shows it at its start (not loaded yet, or under a second in).
 */
let current: { key: string; started: boolean; heard: boolean } | null = null;
/** A file that has not started after this long has failed: a stream with no connection can wait without an error. */
const LOAD_LIMIT = 15000;

const title = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${surahName(surah)} ${num(ayah)}`;
};
const sourceOf = (reciter: number, key: string) => localAyah(reciter, key) ?? streamUrl(reciter, key);

function ensurePlayer() {
  if (player) return player;
  Promise.resolve(setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix', allowsRecording: false })).catch(() => {});
  player = createAudioPlayer(null, { updateInterval: 250 });
  player.addListener('playbackStatusUpdate', onStatus);
  return player;
}

const clearLoad = () => { if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; } };

function fail() {
  clearLoad();
  current = null;
  // The lock screen's play would play past the app, which no longer follows a failed file.
  player?.pause();
  player?.clearLockScreenControls();
  if (state) emit({ ...state, playing: false, loading: false, failed: true });
}

function onStatus(status: AudioStatus) {
  if (!state || state.quiet || !current || current.key !== state.key) return;
  if (status.error) { fail(); return; }
  if (!status.didJustFinish) {
    if (!status.isLoaded || status.currentTime < 1) current.started = true;
    if (status.playing && status.isLoaded && current.started && !current.heard) {
      current.heard = true;
      clearLoad();
      if (state.loading) emit({ ...state, loading: false });
    }
    return;
  }
  if (!current.heard) return;
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

function go(step: Step, playing = true) {
  if (!state) return;
  if (quietTimer) { clearTimeout(quietTimer); quietTimer = null; }
  clearLoad();
  const p = ensurePlayer();
  const key = state.keys[step.at];
  const plan = readListenPlan();
  p.replace({ uri: sourceOf(state.reciter, key) });
  p.loop = false;
  p.setPlaybackRate(plan.speed, 'high');
  current = { key, started: false, heard: false };
  if (playing) { p.play(); loadTimer = setTimeout(() => { loadTimer = null; if (current && !current.heard) fail(); }, LOAD_LIMIT); }
  p.setActiveForLockScreen(true, { title: title(key), artist: reciterName(reciterOf(state.reciter)) });
  emit({ ...state, step, key, playing, quiet: false, loading: playing, failed: false });
  const ahead = nextStep(step, state.keys.length, plan);
  const aheadKey = ahead && state.keys[ahead.at];
  if (aheadKey && aheadKey !== key && !localAyah(state.reciter, aheadKey)) Promise.resolve(preload({ uri: streamUrl(state.reciter, aheadKey) })).catch(() => {});
}

/** Starts a range; with no end, from the ayah to its surah's end. */
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
    player.pause();
    emit({ ...state, playing: false, loading: false });
  } else if (state.quiet) {
    // A pause that was itself paused goes on to what was next.
    const next = nextStep(state.step, state.keys.length, readListenPlan());
    if (next) go(next); else stopListening();
  } else if (state.failed || !current?.heard) {
    // A failed ayah, or one stopped before it was heard, is asked for again.
    go(state.step);
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
  clearLoad();
  current = null;
  if (player) { player.pause(); player.clearLockScreenControls(); }
  emit(null);
}
