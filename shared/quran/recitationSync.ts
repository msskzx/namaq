// see docs/audits/2026-11-17-audio-playback.md
export type AudioRow = { id: number; key: string; url: string };

export type SyncResult = { token: string; full?: AudioRow[]; upsert: AudioRow[]; remove: (number | string)[]; gone?: boolean };

export const audioUrl = (url: string) => (url.startsWith('//') ? `https:${url}` : /^https?:/.test(url) ? url : `https://verses.quran.com/${url.replace(/^\//, '')}`);

type Raw = Record<string, unknown>;
const row = (record: Raw): AudioRow | null =>
  record.record_type === 'audio_file' && typeof record.verse_key === 'string' && typeof record.url === 'string' && typeof record.id === 'number'
    ? { id: record.id, key: record.verse_key, url: audioUrl(record.url) }
    : null;
export const audioRows = (records: Raw[]) => records.map(row).filter((item): item is AudioRow => !!item);

export type Mutation = { type: string; record_type?: string | null; record_key?: string | number | null; data?: Raw | null; snapshot_url?: string | null };

export function foldMutations(mutations: Mutation[], snapshots: Map<string, AudioRow[]>, token: string): SyncResult {
  const result: SyncResult = { token, upsert: [], remove: [] };
  const sameRow = (item: AudioRow, id: number | string) => item.id === id || item.key === id;
  for (const mutation of mutations) {
    if (mutation.type === 'RESOURCE_CREATE' || mutation.type === 'RESOURCE_INVALIDATE') {
      Object.assign(result, { full: [...(snapshots.get(mutation.snapshot_url ?? '') ?? [])], upsert: [], remove: [], gone: false });
    } else if (mutation.type === 'RESOURCE_DELETE') {
      Object.assign(result, { full: [], upsert: [], remove: [], gone: true });
    } else if (mutation.record_type === 'audio_file' && (mutation.type === 'ROW_CREATE' || mutation.type === 'ROW_UPDATE')) {
      const changed = mutation.data ? row({ record_type: 'audio_file', ...mutation.data }) : null;
      if (!changed) continue;
      if (result.full) result.full = [...result.full.filter(item => item.id !== changed.id && item.key !== changed.key), changed];
      else {
        result.upsert = [...result.upsert.filter(item => item.id !== changed.id), changed];
        result.remove = result.remove.filter(id => id !== changed.id && id !== changed.key);
      }
    } else if (mutation.record_type === 'audio_file' && mutation.type === 'ROW_DELETE' && mutation.record_key != null) {
      const id = /^\d+$/.test(String(mutation.record_key)) ? Number(mutation.record_key) : String(mutation.record_key);
      if (result.full) result.full = result.full.filter(item => !sameRow(item, id));
      else {
        result.upsert = result.upsert.filter(item => !sameRow(item, id));
        result.remove.push(id);
      }
    }
  }
  return result;
}

export function applySync(rows: Record<string, AudioRow>, sync: SyncResult): { rows: Record<string, AudioRow>; refetch: string[]; drop: string[] } {
  if (sync.full) {
    const next = Object.fromEntries(sync.full.map(item => [item.key, item]));
    for (const item of sync.upsert) next[item.key] = item;
    const refetch = Object.values(next).filter(item => rows[item.key]?.url !== item.url).map(item => item.key);
    const drop = Object.keys(rows).filter(key => !next[key]);
    return { rows: next, refetch: Object.keys(rows).length ? refetch : [], drop };
  }
  const next = { ...rows };
  const refetch: string[] = [];
  for (const item of sync.upsert) { if (next[item.key]?.url !== item.url) refetch.push(item.key); next[item.key] = item; }
  const removed = new Set<number | string>(sync.remove);
  const drop = Object.values(next).filter(item => removed.has(item.id) || removed.has(item.key)).map(item => item.key);
  for (const key of drop) delete next[key];
  return { rows: next, refetch, drop };
}

const DAY = 24 * 60 * 60 * 1000;
export const syncDue = (syncedAt: number | undefined, now: number) => syncedAt === undefined || now - syncedAt > DAY;
