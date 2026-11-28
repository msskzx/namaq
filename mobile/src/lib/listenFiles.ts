import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { AUDIO_SOURCE, WEBSITE, type AudioSource } from '@shared/downloadSources';
import { ayahAudioUrl, ayahFile, reciterOf } from '@shared/quran/recitation';
import { applySync, syncDue, type AudioRow, type SyncResult } from '@shared/quran/recitationSync';
import { arrayOf, isNumberIn, isRecord, isString, readJson, writeJson } from './storage';
import surahRows from '@shared/data/quran/surahs.json';
import { reportError } from '@shared/errors';

export type PackKind = 'memorized' | 'all' | `surah:${number}`;
export type Pack = { reciter: number; kind: PackKind; label: string; keys: string[] };
export type Progress = { done: number; total: number; failed?: boolean };
type Synced = { token: string; rows: Record<string, AudioRow>; syncedAt: number; repair?: string[] };

const PACKS = 'listen-packs';
const SYNCED = 'listen-sync';
const web = Platform.OS === 'web';

const isPack = (value: unknown): value is Pack => isRecord(value) && isNumberIn(0, Infinity)(value.reciter) && isString(value.kind) && isString(value.label) && arrayOf(isString)(value.keys);
const isSynced = (value: unknown): value is Synced => isRecord(value) && isString(value.token) && isRecord(value.rows) && isNumberIn(0, Infinity)(value.syncedAt);

let packs: Pack[] = (readJson(PACKS, Array.isArray) ?? []).filter(isPack);
let synced: Record<string, Synced> = Object.fromEntries(Object.entries(readJson(SYNCED, isRecord) ?? {}).filter(([, value]) => isSynced(value))) as Record<string, Synced>;
const busy = new Map<string, Progress>();
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
const have = (reciter: number, key: string) => { try { const file = fileOf(reciter, key); return file.exists && file.size > 0; } catch { return false; } };

const lines = new Map<number, Promise<unknown>>();
function inLine<T>(reciter: number, task: () => Promise<T>): Promise<T> {
  const run = (lines.get(reciter) ?? Promise.resolve()).then(task, task);
  lines.set(reciter, run);
  return run;
}

async function fetchAyah(reciter: number, key: string, url: string) {
  const name = `${ayahFile(key)}.${++parts}.part`;
  try {
    const part = new File(folder(reciter), name);
    await File.downloadFileAsync(url, part, { idempotent: true });
    if (!part.exists || !part.size) throw new Error(`listen ${key}: empty file`);
    part.moveSync(fileOf(reciter, key), { overwrite: true });
  } finally {
    try { const left = new File(folder(reciter), name); if (left.exists) left.delete(); } catch (error) { reportError('listen: delete partial file', error); }
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

export function localAyah(reciter: number, key: string): string | undefined {
  if (web || !packs.some(pack => pack.reciter === reciter)) return undefined;
  return have(reciter, key) ? fileOf(reciter, key).uri : undefined;
}

export function bytesOf(reciter: number): number {
  if (web) return 0;
  try { const dir = folder(reciter); return dir.exists ? dir.size ?? 0 : 0; } catch { return 0; }
}

async function websiteSync(reciter: number, token?: string): Promise<SyncResult | { resync: true }> {
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

async function directSync(reciter: number): Promise<SyncResult> {
  const keys = surahRows.flatMap(surah => Array.from({ length: surah.numberOfAyat }, (_, i) => `${surah.number}:${i + 1}`));
  return { token: 'direct', full: keys.map((key, i) => ({ id: i + 1, key, url: ayahAudioUrl(reciterOf(reciter), key) })), upsert: [], remove: [] };
}

const AUDIO_SOURCES: Record<AudioSource, (reciter: number, token?: string) => Promise<SyncResult | { resync: true }>> = { website: websiteSync, direct: directSync };
const fetchSync = (reciter: number, token?: string) => AUDIO_SOURCES[AUDIO_SOURCE](reciter, token);

const deleteFile = (reciter: number, key: string) => { try { const file = fileOf(reciter, key); if (file.exists) file.delete(); } catch (error) { reportError('listen: delete file', error); } };
const heldKeys = (reciter: number, list = packs) => new Set(list.filter(pack => pack.reciter === reciter).flatMap(pack => pack.keys));

function sweep(reciter: number) {
  try {
    const dir = folder(reciter);
    if (!dir.exists) return;
    const fetching = [...running.entries()].filter(([id]) => id.startsWith(`${reciter}:`)).flatMap(([, keys]) => keys);
    const names = new Set([...heldKeys(reciter), ...fetching].map(ayahFile));
    for (const item of dir.list()) if (item instanceof File && !names.has(item.name) && !(fetching.length && item.name.endsWith('.part'))) item.delete();
  } catch (error) { reportError('listen: sweep reciter folder', error); }
}

async function sync(reciter: number) {
  const had = synced[reciter];
  let result = await fetchSync(reciter, had?.token);
  if ('resync' in result) result = await fetchSync(reciter);
  if ('resync' in result) throw new Error('listen-sync resync');
  if (!packs.some(pack => pack.reciter === reciter) && ![...running.keys()].some(id => id.startsWith(`${reciter}:`))) return;
  if (result.gone) { stopReciter(reciter); packsOf(reciter).forEach(pack => removePack(reciter, pack.kind)); saveSynced(reciter, null); return; }
  const applied = applySync(had?.rows ?? {}, result);
  applied.drop.forEach(key => deleteFile(reciter, key));
  const repair = [...new Set([...(had?.repair ?? []), ...applied.refetch])].filter(key => applied.rows[key]);
  saveSynced(reciter, { token: result.token, rows: applied.rows, syncedAt: Date.now(), ...(repair.length ? { repair } : {}) });
}

async function repairFiles(reciter: number) {
  const now = synced[reciter];
  const id = `${reciter}:repair`;
  if (!now?.repair?.length || running.has(id)) return;
  const fetched = new Set<string>();
  try {
    for (const key of now.repair) {
      const row = synced[reciter]?.rows[key];
      if (!row || !heldKeys(reciter).has(key)) continue;
      running.set(id, [key]);
      try { await fetchAyah(reciter, key, row.url); fetched.add(key); } catch (error) { reportError('listen: fetch ayah', error); }
      if (!heldKeys(reciter).has(key)) deleteFile(reciter, key);
    }
  } finally {
    running.delete(id);
  }
  settle(reciter, fetched);
}

function settle(reciter: number, fetched: Set<string>) {
  const after = synced[reciter];
  if (!after?.repair || !fetched.size) return;
  const left = after.repair.filter(key => !fetched.has(key));
  saveSynced(reciter, { ...after, repair: left.length ? left : undefined });
}

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
    const repair = new Set(synced[reciter]?.repair ?? []);
    const fetched = new Set<string>();
    const queue = keys.filter(key => rows[key]);
    let failed = queue.length < keys.length;
    progress.total = queue.length;
    const worker = async () => {
      for (let key = queue.shift(); key && !stopped.has(id); key = queue.shift()) {
        try { if (repair.has(key) || !have(reciter, key)) { await fetchAyah(reciter, key, rows[key].url); fetched.add(key); } } catch (error) { reportError('listen: download ayah', error); failed = true; }
        progress.done += 1;
        if (progress.done % 10 === 0 || progress.done === progress.total) changed();
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    running.delete(id);
    settle(reciter, fetched);
    if (stopped.has(id)) { busy.delete(id); stopped.delete(id); sweep(reciter); changed(); return; }
    if (failed || !progress.total || keys.some(key => !have(reciter, key))) { fail(); return; }
    busy.delete(id);
    const old = packs.find(pack => pack.reciter === reciter && pack.kind === kind);
    const rest = packs.filter(pack => pack !== old);
    const next = [...rest, { reciter, kind, label, keys }];
    if (old) { const kept = heldKeys(reciter, next); old.keys.forEach(key => { if (!kept.has(key)) deleteFile(reciter, key); }); }
    savePacks(next);
  } catch (error) {
    reportError('listen: download pack', error);
    fail();
  }
}

export const stopDownload = (reciter: number, kind: PackKind) => { stopped.add(packId(reciter, kind)); };
const stopReciter = (reciter: number) => { for (const id of running.keys()) if (id.startsWith(`${reciter}:`)) stopped.add(id); };

export function removeReciter(reciter: number) {
  stopReciter(reciter);
  packsOf(reciter).forEach(pack => removePack(reciter, pack.kind));
}

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

export async function syncPacks(now = Date.now()) {
  if (web) return;
  try {
    const root = new Directory(Paths.document, 'listen');
    if (root.exists) for (const item of root.list()) if (item instanceof Directory && /^\d+$/.test(item.name)) sweep(Number(item.name));
  } catch (error) { reportError('listen: sweep downloads', error); }
  for (const reciter of new Set(packs.map(pack => pack.reciter))) {
    try { await inLine(reciter, async () => { if (syncDue(synced[reciter]?.syncedAt, now)) await sync(reciter); }); } catch (error) { reportError('listen: sync reciter', error); }
    await repairFiles(reciter);
  }
  changed();
}

export const streamUrl = (reciter: number, key: string) => synced[reciter]?.rows[key]?.url ?? ayahAudioUrl(reciterOf(reciter), key);
