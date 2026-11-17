import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { ayahAudioUrl, ayahFile, reciterOf } from '@shared/quran/recitation';
import { applySync, syncDue, type AudioRow, type SyncResult } from '@shared/quran/recitationSync';
import { readJson, writeJson } from './storage';
import { WEBSITE } from './branches';

/**
 * Recitations kept on the phone to listen offline, one folder of ayah files per reciter.
 * Quran Foundation allows an offline copy only through its Content Sync (terms §3.1), synced at least every seven days
 * while online. The website's /api/quran/listen-sync runs it with the project's key; the phone keeps each reciter's
 * ayah file rows and sync token, syncs once a day when it can, and fetches again or removes the files that changed.
 */
/** A surah download is kept per surah, so several surahs can sit on the phone together. */
export type PackKind = 'memorized' | 'all' | `surah:${number}`;
export type Pack = { reciter: number; kind: PackKind; label: string; keys: string[] };
export type Progress = { done: number; total: number; failed?: boolean };
type Synced = { token: string; rows: Record<string, AudioRow>; syncedAt: number };

const PACKS = 'listen-packs';
const SYNCED = 'listen-sync';
const web = Platform.OS === 'web';

let packs: Pack[] = readJson<Pack[]>(PACKS) ?? [];
let synced: Record<string, Synced> = readJson<Record<string, Synced>>(SYNCED) ?? {};
const busy = new Map<string, Progress>();
/** The ayat each running download is fetching, so that a sweep leaves them alone. */
const running = new Map<string, string[]>();
const stopped = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;
const changed = () => { version++; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const useListenFiles = () => useSyncExternalStore(subscribe, () => version);

const folder = (reciter: number) => new Directory(Paths.document, 'listen', String(reciter));
const fileOf = (reciter: number, key: string) => new File(folder(reciter), ayahFile(key));
const packId = (reciter: number, kind: PackKind) => `${reciter}:${kind}`;
const savePacks = (next: Pack[]) => { packs = next; writeJson(PACKS, packs); changed(); };
const saveSynced = (reciter: number, value: Synced | null) => {
  synced = { ...synced };
  if (value) synced[reciter] = value; else delete synced[reciter];
  writeJson(SYNCED, synced);
};

export const packsOf = (reciter: number) => packs.filter(pack => pack.reciter === reciter);
export const progressOf = (reciter: number, kind: PackKind) => busy.get(packId(reciter, kind));

/** The ayah's file on the phone, when it was downloaded. */
export function localAyah(reciter: number, key: string): string | undefined {
  if (web || !packs.some(pack => pack.reciter === reciter)) return undefined;
  try { const file = fileOf(reciter, key); return file.exists ? file.uri : undefined; } catch { return undefined; }
}

/** The bytes a reciter's downloads take on the phone. */
export function bytesOf(reciter: number): number {
  if (web) return 0;
  try { const dir = folder(reciter); return dir.exists ? dir.size ?? 0 : 0; } catch { return 0; }
}

async function fetchSync(reciter: number, token?: string): Promise<SyncResult | { resync: true }> {
  const response = await fetch(`${WEBSITE}/api/quran/listen-sync?r=${reciter}${token ? `&t=${encodeURIComponent(token)}` : ''}`);
  if (!response.ok) throw new Error(`listen-sync ${response.status}`);
  return response.json();
}

const deleteFile = (reciter: number, key: string) => { try { const file = fileOf(reciter, key); if (file.exists) file.delete(); } catch {} };
const heldKeys = (reciter: number, list = packs) => new Set(list.filter(pack => pack.reciter === reciter).flatMap(pack => pack.keys));

/** Deletes the files in a reciter's folder that no download holds: what a stopped or failed run left behind. */
function sweep(reciter: number) {
  try {
    const dir = folder(reciter);
    if (!dir.exists) return;
    const fetching = [...running.entries()].filter(([id]) => id.startsWith(`${reciter}:`)).flatMap(([, keys]) => keys);
    const names = new Set([...heldKeys(reciter), ...fetching].map(ayahFile));
    for (const item of dir.list()) if (item instanceof File && !names.has(item.name)) item.delete();
  } catch {}
}

/** Brings a reciter's rows up to date; the files that changed are fetched again and removed ones deleted. */
async function sync(reciter: number) {
  const had = synced[reciter];
  let result = await fetchSync(reciter, had?.token);
  if ('resync' in result) result = await fetchSync(reciter);
  if ('resync' in result) throw new Error('listen-sync resync');
  if (result.gone) { packsOf(reciter).forEach(pack => removePack(reciter, pack.kind)); saveSynced(reciter, null); return; }
  const applied = applySync(had?.rows ?? {}, result);
  saveSynced(reciter, { token: result.token, rows: applied.rows, syncedAt: Date.now() });
  applied.drop.forEach(key => deleteFile(reciter, key));
  // A changed file is replaced; a held file that is missing (a fetch that failed last time) is fetched again.
  applied.refetch.forEach(key => deleteFile(reciter, key));
  for (const key of heldKeys(reciter)) {
    const row = applied.rows[key];
    if (!row || fileOf(reciter, key).exists) continue;
    try { await File.downloadFileAsync(row.url, fileOf(reciter, key), { idempotent: true }); } catch {}
  }
}

/** Downloads the ayat (four at a time), from the addresses Content Sync gives. */
export async function downloadPack(reciter: number, kind: PackKind, label: string, keys: string[]) {
  const id = packId(reciter, kind);
  if (web || (busy.has(id) && !busy.get(id)!.failed)) return;
  stopped.delete(id);
  const progress: Progress = { done: 0, total: keys.length };
  busy.set(id, progress);
  running.set(id, keys);
  changed();
  try {
    if (!synced[reciter] || syncDue(synced[reciter].syncedAt, Date.now())) await sync(reciter);
  } catch {
    running.delete(id);
    busy.set(id, { ...progress, failed: true });
    changed();
    return;
  }
  const rows = synced[reciter]?.rows ?? {};
  const dir = folder(reciter);
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  const queue = keys.filter(key => rows[key]);
  progress.total = queue.length;
  let failed = false;
  const worker = async () => {
    for (let key = queue.shift(); key && !stopped.has(id); key = queue.shift()) {
      try {
        const file = fileOf(reciter, key);
        if (!file.exists) await File.downloadFileAsync(rows[key].url, file, { idempotent: true });
      } catch { failed = true; }
      progress.done += 1;
      if (progress.done % 10 === 0 || progress.done === progress.total) changed();
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  running.delete(id);
  if (stopped.has(id)) { busy.delete(id); stopped.delete(id); sweep(reciter); changed(); return; }
  // A failed run keeps its files so that trying again picks up where it stopped; the next app start sweeps them otherwise.
  if (failed || !progress.total) { busy.set(id, { ...progress, failed: true }); changed(); return; }
  busy.delete(id);
  // The same download done again (a changed «ما أحفظه») drops the ayat it no longer holds.
  const old = packs.find(pack => pack.reciter === reciter && pack.kind === kind);
  const rest = packs.filter(pack => pack !== old);
  const next = [...rest, { reciter, kind, label, keys }];
  if (old) { const kept = heldKeys(reciter, next); old.keys.forEach(key => { if (!kept.has(key)) deleteFile(reciter, key); }); }
  savePacks(next);
}

export const stopDownload = (reciter: number, kind: PackKind) => { stopped.add(packId(reciter, kind)); };

/** Removes a download's files, keeping those another of the reciter's downloads still holds. */
export function removePack(reciter: number, kind: PackKind) {
  const gone = packs.find(pack => pack.reciter === reciter && pack.kind === kind);
  const rest = packs.filter(pack => pack !== gone);
  if (gone && !web) {
    const kept = heldKeys(reciter, rest);
    for (const key of gone.keys) if (!kept.has(key)) deleteFile(reciter, key);
  }
  if (!rest.some(pack => pack.reciter === reciter)) saveSynced(reciter, null);
  savePacks(rest);
}

/** Run when the app opens: each reciter with downloads syncs once a day when online; offline, the files stay as they are. */
export async function syncPacks(now = Date.now()) {
  if (web) return;
  try {
    const root = new Directory(Paths.document, 'listen');
    if (root.exists) for (const item of root.list()) if (item instanceof Directory && /^\d+$/.test(item.name)) sweep(Number(item.name));
  } catch {}
  for (const reciter of new Set(packs.map(pack => pack.reciter))) {
    if (!syncDue(synced[reciter]?.syncedAt, now)) continue;
    try { await sync(reciter); } catch {}
  }
  changed();
}

/** The address an ayah streams from when it is not on the phone. */
export const streamUrl = (reciter: number, key: string) => synced[reciter]?.rows[key]?.url ?? ayahAudioUrl(reciterOf(reciter), key);
