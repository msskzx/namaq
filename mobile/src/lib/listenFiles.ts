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
/** `repair`: held ayat whose file must still be fetched (changed at the source, or a fetch that failed), tried at every app start. */
type Synced = { token: string; rows: Record<string, AudioRow>; syncedAt: number; repair?: string[] };

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
let parts = 0;
const packId = (reciter: number, kind: PackKind) => `${reciter}:${kind}`;
/** An ayah's file is on the phone only once a whole download was moved into place. */
const have = (reciter: number, key: string) => { try { const file = fileOf(reciter, key); return file.exists && file.size > 0; } catch { return false; } };

/** Each reciter's syncs and file changes run one after another, so two downloads never rewrite its rows over each other. */
const lines = new Map<number, Promise<unknown>>();
function inLine<T>(reciter: number, task: () => Promise<T>): Promise<T> {
  const run = (lines.get(reciter) ?? Promise.resolve()).then(task, task);
  lines.set(reciter, run.catch(() => undefined));
  return run;
}

/**
 * Fetches an ayah into a staging file and moves it over the ayah's file only once the download finished: on Android a failed
 * download can leave part of a file behind (expo-file-system File.downloadFileAsync), which must never pass for the whole.
 */
async function fetchAyah(reciter: number, key: string, url: string) {
  // Its own staging name, so two downloads holding the same ayah never write into one file.
  const name = `${ayahFile(key)}.${++parts}.part`;
  try {
    const part = new File(folder(reciter), name);
    await File.downloadFileAsync(url, part, { idempotent: true });
    if (!part.exists || !part.size) throw new Error(`listen ${key}: empty file`);
    part.moveSync(fileOf(reciter, key), { overwrite: true });
  } finally {
    try { const left = new File(folder(reciter), name); if (left.exists) left.delete(); } catch {}
  }
}
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
  return have(reciter, key) ? fileOf(reciter, key).uri : undefined;
}

/** The bytes a reciter's downloads take on the phone. */
export function bytesOf(reciter: number): number {
  if (web) return 0;
  try { const dir = folder(reciter); return dir.exists ? dir.size ?? 0 : 0; } catch { return 0; }
}

async function fetchSync(reciter: number, token?: string): Promise<SyncResult | { resync: true }> {
  // A sync that hangs would hold the reciter's downloads behind it (inLine).
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 20_000);
  try {
    const response = await fetch(`${WEBSITE}/api/quran/listen-sync?r=${reciter}${token ? `&t=${encodeURIComponent(token)}` : ''}`, { signal: abort.signal });
    if (!response.ok) throw new Error(`listen-sync ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
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
    for (const item of dir.list()) if (item instanceof File && !names.has(item.name) && !(fetching.length && item.name.endsWith('.part'))) item.delete();
  } catch {}
}

/**
 * Brings a reciter's rows up to date: removed files are deleted, and changed ones are kept until their new file has arrived (repair),
 * so a failed fetch never leaves the ayah with no file.
 */
async function sync(reciter: number) {
  const had = synced[reciter];
  let result = await fetchSync(reciter, had?.token);
  if ('resync' in result) result = await fetchSync(reciter);
  if ('resync' in result) throw new Error('listen-sync resync');
  // Its downloads were removed while the sync ran: nothing is kept for it.
  if (!packs.some(pack => pack.reciter === reciter) && ![...running.keys()].some(id => id.startsWith(`${reciter}:`))) return;
  if (result.gone) { stopReciter(reciter); packsOf(reciter).forEach(pack => removePack(reciter, pack.kind)); saveSynced(reciter, null); return; }
  const applied = applySync(had?.rows ?? {}, result);
  applied.drop.forEach(key => deleteFile(reciter, key));
  const repair = [...new Set([...(had?.repair ?? []), ...applied.refetch])].filter(key => applied.rows[key]);
  saveSynced(reciter, { token: result.token, rows: applied.rows, syncedAt: Date.now(), ...(repair.length ? { repair } : {}) });
}

/** Fetches the held ayat whose file changed at the source or is missing; the ones that fail stay listed for the next try. */
async function repairFiles(reciter: number) {
  const now = synced[reciter];
  // Listed as running, so a sweep leaves its staging file alone and a second start does not repair the same files; an ayah whose
  // download was removed meanwhile is skipped.
  const id = `${reciter}:repair`;
  if (!now?.repair?.length || running.has(id)) return;
  const fetched = new Set<string>();
  try {
    for (const key of now.repair) {
      const row = synced[reciter]?.rows[key];
      if (!row || !heldKeys(reciter).has(key)) continue;
      running.set(id, [key]);
      try { await fetchAyah(reciter, key, row.url); fetched.add(key); } catch {}
      if (!heldKeys(reciter).has(key)) deleteFile(reciter, key);
    }
  } finally {
    running.delete(id);
  }
  settle(reciter, fetched);
}

/** Takes the ayat just fetched off the list still to fetch, keeping what a sync added meanwhile. */
function settle(reciter: number, fetched: Set<string>) {
  const after = synced[reciter];
  if (!after?.repair || !fetched.size) return;
  const left = after.repair.filter(key => !fetched.has(key));
  saveSynced(reciter, { ...after, repair: left.length ? left : undefined });
}

/** Downloads the ayat (four at a time), from the addresses Content Sync gives. A pack counts only when every one of its ayat is on the phone. */
export async function downloadPack(reciter: number, kind: PackKind, label: string, keys: string[]) {
  const id = packId(reciter, kind);
  if (web || (busy.has(id) && !busy.get(id)!.failed)) return;
  stopped.delete(id);
  const progress: Progress = { done: 0, total: keys.length };
  busy.set(id, progress);
  running.set(id, keys);
  changed();
  const fail = () => { running.delete(id); busy.set(id, { ...progress, failed: true }); changed(); };
  try {
    await inLine(reciter, async () => { if (!synced[reciter] || syncDue(synced[reciter].syncedAt, Date.now())) await sync(reciter); });
    const rows = synced[reciter]?.rows ?? {};
    const dir = folder(reciter);
    if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
    // An ayah Content Sync has no file for cannot be downloaded: the pack is not complete.
    // A held file the sync found changed is fetched again with the pack's own.
    const repair = new Set(synced[reciter]?.repair ?? []);
    const fetched = new Set<string>();
    const queue = keys.filter(key => rows[key]);
    let failed = queue.length < keys.length;
    progress.total = queue.length;
    const worker = async () => {
      for (let key = queue.shift(); key && !stopped.has(id); key = queue.shift()) {
        try { if (repair.has(key) || !have(reciter, key)) { await fetchAyah(reciter, key, rows[key].url); fetched.add(key); } } catch { failed = true; }
        progress.done += 1;
        if (progress.done % 10 === 0 || progress.done === progress.total) changed();
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    running.delete(id);
    settle(reciter, fetched);
    if (stopped.has(id)) { busy.delete(id); stopped.delete(id); sweep(reciter); changed(); return; }
    // A failed run keeps its whole files so that trying again picks up where it stopped; the next app start sweeps them otherwise.
    if (failed || !progress.total || keys.some(key => !have(reciter, key))) { fail(); return; }
    busy.delete(id);
    // The same download done again (a changed «ما أحفظه») drops the ayat it no longer holds.
    const old = packs.find(pack => pack.reciter === reciter && pack.kind === kind);
    const rest = packs.filter(pack => pack !== old);
    const next = [...rest, { reciter, kind, label, keys }];
    if (old) { const kept = heldKeys(reciter, next); old.keys.forEach(key => { if (!kept.has(key)) deleteFile(reciter, key); }); }
    savePacks(next);
  } catch {
    fail();
  }
}

export const stopDownload = (reciter: number, kind: PackKind) => { stopped.add(packId(reciter, kind)); };
const stopReciter = (reciter: number) => { for (const id of running.keys()) if (id.startsWith(`${reciter}:`)) stopped.add(id); };

/** Removes all of a reciter's downloads, stopping the ones still running so that none comes back when it finishes. */
export function removeReciter(reciter: number) {
  stopReciter(reciter);
  packsOf(reciter).forEach(pack => removePack(reciter, pack.kind));
}

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
    try { await inLine(reciter, async () => { if (syncDue(synced[reciter]?.syncedAt, now)) await sync(reciter); }); } catch {}
    // Outside the line, so a download started meanwhile does not wait for every repaired file.
    await repairFiles(reciter);
  }
  changed();
}

/** The address an ayah streams from when it is not on the phone. */
export const streamUrl = (reciter: number, key: string) => synced[reciter]?.rows[key]?.url ?? ayahAudioUrl(reciterOf(reciter), key);
