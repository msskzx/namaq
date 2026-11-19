import { audioRows, foldMutations, type AudioRow, type Mutation, type SyncResult } from '@shared/quran/recitationSync';

/**
 * Quran Foundation's Content Sync for one ayah recitation, run on the server with the project's key
 * (QF_CLIENT_ID, QF_CLIENT_SECRET; QF_ENV=prelive for the test keys). The secret never reaches the phone.
 * Docs: https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/
 */
const HOSTS = {
  production: { auth: 'https://oauth2.quran.foundation', api: 'https://apis.quran.foundation/content' },
  prelive: { auth: 'https://prelive-oauth2.quran.foundation', api: 'https://apis-prelive.quran.foundation/content' },
};
const hosts = () => HOSTS[process.env.QF_ENV === 'prelive' ? 'prelive' : 'production'];

export class SyncError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) { super(message); }
}

let cached: { token: string; until: number } | null = null;
/**
 * Older Quran Foundation keys hold the one scope `content`; a backend app made since the granular scopes asks for the ones
 * it calls and gets `invalid_scope` for `content` (https://api-docs.quran.com/docs/quickstart/manual-authentication/).
 * Content Sync needs the sync scope, and the recitation snapshots the audio one. The one that worked is kept.
 */
const SCOPES = ['content', 'content.sync.read content.audio.read'];
let scopeAt = 0;

async function accessToken(fresh = false): Promise<string> {
  if (!fresh && cached && cached.until > Date.now()) return cached.token;
  const id = process.env.QF_CLIENT_ID;
  const secret = process.env.QF_CLIENT_SECRET;
  if (!id || !secret) throw new SyncError('Quran Foundation key is not set', 503);
  let failure = '';
  for (let tried = 0; tried < SCOPES.length; tried++) {
    const at = (scopeAt + tried) % SCOPES.length;
    const response = await fetch(`${hosts().auth}/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', scope: SCOPES[at] }).toString(),
      cache: 'no-store',
    });
    if (response.ok) {
      scopeAt = at;
      const body = await response.json() as { access_token: string; expires_in?: number };
      cached = { token: body.access_token, until: Date.now() + ((body.expires_in ?? 3600) - 120) * 1000 };
      return cached.token;
    }
    const body = await response.json().catch(() => ({})) as { error?: string };
    failure = `token: ${response.status}${body.error ? ` ${body.error}` : ''}`;
    // Only a scope this key does not hold is worth asking again with the other scope.
    if (body.error !== 'invalid_scope') break;
  }
  throw new SyncError(failure, 502, 'token');
}

/** One authorised GET to the Content API, with one retry on an expired token. */
async function get<T>(path: string): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(`${hosts().api}${path}`, {
      headers: { 'x-auth-token': await accessToken(attempt > 0), 'x-client-id': process.env.QF_CLIENT_ID ?? '' },
      cache: 'no-store',
    });
    if (response.status === 401 && attempt === 0) continue;
    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { error?: { code?: string } | string; code?: string };
      const code = typeof body.error === 'object' ? body.error?.code : body.code ?? (typeof body.error === 'string' ? body.error : undefined);
      throw new SyncError(`${path.split('?')[0]}: ${response.status}${code ? ` ${code}` : ''}`, response.status, code);
    }
    return response.json() as Promise<T>;
  }
  throw new SyncError(`${path.split('?')[0]}: unauthorised`, 502);
}

type Page = { sync?: { mutations?: Mutation[]; has_more?: boolean; next_page_url?: string | null; next_sync_token?: string | null } } & { mutations?: Mutation[]; has_more?: boolean; next_page_url?: string | null; next_sync_token?: string | null };

/** A first sync (no token) or the changes since `token`, for recitation `reciter`, folded into ayah file rows. */
export async function syncRecitation(reciter: number, token?: string): Promise<SyncResult> {
  const filter = encodeURIComponent(`recitations:${reciter}`);
  let path: string | null = `/api/v4/resources/sync?resources=${filter}&per_page=100${token ? `&sync_token=${encodeURIComponent(token)}` : '&bootstrap=true'}`;
  const mutations: Mutation[] = [];
  let next = token ?? '';
  while (path) {
    const page: Page = await get<Page>(path);
    const run = page.sync ?? page;
    mutations.push(...(run.mutations ?? []));
    path = run.has_more && run.next_page_url ? run.next_page_url : null;
    if (!path) next = run.next_sync_token ?? next;
  }
  const snapshots = new Map<string, AudioRow[]>();
  for (const url of new Set(mutations.map(item => item.snapshot_url).filter((item): item is string => !!item))) {
    const snapshot = await get<{ records?: Record<string, unknown>[] }>(url);
    snapshots.set(url, audioRows(snapshot.records ?? []));
  }
  return foldMutations(mutations, snapshots, next);
}
