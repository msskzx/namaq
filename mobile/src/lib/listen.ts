import { useSyncExternalStore } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio';
import { ayatOf, FIRST, nextStep, pauseAfter, reciterName, reciterOf, surahEnd, type Range, type Step } from '@shared/quran/recitation';
import { num } from '@shared/quran/arabicNumber';
import { ayahCounts } from './mushaf';
import { readListenPlan, readReciter } from '@shared/listenSettings';
import { localAyah, streamUrl } from './listenFiles';
import { surahName } from '@shared/quran/surahNames';
import { reportError } from '@shared/errors';

/**
 * The one recitation playing in the app: a range of ayat, read by one reciter, with each ayah's and the range's repeats
 * and a pause to say the ayah back. It lives outside any screen, so turning pages or closing a sheet never stops it.
 * One player reads one ayah file at a time. Nothing is fetched ahead into a second player: handing a file buffered by
 * another player over (expo-audio `preload`) left the next ayah silent on the owner's iPhone (2026-11-19), and an ayah
 * file is small enough to start at once. A pause plays a second of silence on a loop,
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
let current: { key: string; started: boolean; heard: boolean; tries: number } | null = null;
/** A stream that fails is asked for once more on its own before the bar says it could not be played. */
const RETRIES = 1;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
const clearRetry = () => { if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; } };
/** A file that has not started after this long has failed: a stream with no connection can wait without an error. */
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
    // A dropped connection or a slow first byte: try the same ayah again before telling the reader.
    const tries = current.tries + 1;
    const step = state.step;
    current = null;
    player?.pause();
    retryTimer = setTimeout(() => { retryTimer = null; if (state?.playing && !state.failed) go(step, true, tries); }, 1000);
    return;
  }
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
    // Heard only on a status after the one that showed the file at its start: turning the pause's loop off reports the
    // one-second silence (loaded, playing, under a second in) just as the next file is asked for.
    if (!current.started) { if (!status.isLoaded || status.currentTime < 1) current.started = true; return; }
    if (status.playing && status.isLoaded && current.started && !current.heard) {
      current.heard = true;
      clearLoad();
      if (state.loading) emit({ ...state, loading: false });
    }
    return;
  }
  // An end before any tick of this file is the file before's; one after it started is this file's, heard or not, so a
  // file that played without a tick counted as heard still moves playback on.
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
  // Off before the swap: a player still looping the pause's silence copies the new file into its loop as it arrives.
  p.loop = false;
  p.replace({ uri: sourceOf(state.reciter, key) });
  p.setPlaybackRate(plan.speed, 'high');
  current = { key, started: false, heard: false, tries };
  if (playing) { p.play(); loadTimer = setTimeout(() => { loadTimer = null; if (current && !current.heard) fail(); }, LOAD_LIMIT); }
  p.setActiveForLockScreen(true, { title: title(key), artist: reciterName(reciterOf(state.reciter)) });
  emit({ ...state, step, key, playing, quiet: false, loading: playing, failed: false });
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
    clearRetry();
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
  clearRetry();
  current = null;
  if (player) { player.pause(); player.clearLockScreenControls(); }
  emit(null);
}
