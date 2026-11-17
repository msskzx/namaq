import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioStatus } from 'expo-audio';

// A player that only records what it was asked, and a status the test sends as the phone would.
let onStatus: (status: AudioStatus) => void;
const asked: string[] = [];
const player = {
  addListener: (_: string, listener: typeof onStatus) => { onStatus = listener; },
  replace: (source: { uri: string } | number) => { asked.push(typeof source === 'number' ? 'silence' : source.uri); },
  play: vi.fn(), pause: vi.fn(), setPlaybackRate() {}, setActiveForLockScreen() {}, clearLockScreenControls() {}, loop: false,
};
vi.mock('expo-audio', () => ({ createAudioPlayer: () => player, preload: () => Promise.resolve(), setAudioModeAsync: () => Promise.resolve() }));
vi.mock('react', () => ({ useSyncExternalStore: () => null }));
vi.mock('./listenFiles', () => ({ localAyah: () => null, streamUrl: (_: number, key: string) => key }));
vi.mock('./mushaf', () => ({ ayahCounts: new Map([[1, 7]]), surahNames: [] }));

const status = (over: Partial<AudioStatus>) => ({ playing: false, isLoaded: true, didJustFinish: false, duration: 3, error: null, ...over }) as AudioStatus;
const heard = () => onStatus(status({ playing: true }));
const ended = () => onStatus(status({ didJustFinish: true }));

let listen: typeof import('./listen');
beforeEach(async () => { vi.useFakeTimers(); vi.resetModules(); asked.length = 0; listen = await import('./listen'); });
afterEach(() => { listen.stopListening(); vi.useRealTimers(); });

describe('playback', () => {
  it('moves on when the ayah it asked for ends, once', async () => {
    listen.listen('1:1', '1:3');
    expect(listen.readListening()).toMatchObject({ key: '1:1', loading: true, failed: false });
    heard();
    expect(listen.readListening()!.loading).toBe(false);
    ended();
    ended();
    expect(asked).toEqual(['1:1', '1:2']);
  });

  it('does not take the end of the file before for the end of the one just asked for', async () => {
    listen.listen('1:1', '1:3');
    heard();
    listen.applyReciter(2);
    // The old voice's end arrives after the new voice was asked for: the same ayah, not yet heard.
    ended();
    expect(listen.readListening()!.key).toBe('1:1');
    heard();
    ended();
    expect(listen.readListening()!.key).toBe('1:2');
  });

  it('fails when the player reports an error, and play asks for the ayah again', async () => {
    listen.listen('1:1', '1:3');
    onStatus(status({ error: 'offline' }));
    expect(listen.readListening()).toMatchObject({ playing: false, failed: true, loading: false });
    listen.togglePlaying();
    expect(listen.readListening()).toMatchObject({ key: '1:1', playing: true, failed: false });
    expect(asked).toEqual(['1:1', '1:1']);
  });

  it('fails when a stream never starts', async () => {
    listen.listen('1:1', '1:3');
    vi.advanceTimersByTime(15000);
    expect(listen.readListening()!.failed).toBe(true);
  });

  it('a started ayah is not failed by the wait', async () => {
    listen.listen('1:1', '1:3');
    heard();
    vi.advanceTimersByTime(20000);
    expect(listen.readListening()!.failed).toBe(false);
  });
});
