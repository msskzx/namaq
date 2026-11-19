import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Quran Foundation's token endpoint as a key that holds only the granular scopes answers it.
const scopes: string[] = [];
beforeEach(() => {
  vi.resetModules();
  scopes.length = 0;
  process.env.QF_CLIENT_ID = 'id';
  process.env.QF_CLIENT_SECRET = 'secret';
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/oauth2/token')) {
      const scope = new URLSearchParams(String(init?.body)).get('scope')!;
      scopes.push(scope);
      if (scope === 'content') return new Response(JSON.stringify({ error: 'invalid_scope' }), { status: 400 });
      return new Response(JSON.stringify({ access_token: 'token', expires_in: 3600 }));
    }
    return new Response(JSON.stringify({ sync: { mutations: [], has_more: false, next_sync_token: 'next' } }));
  }));
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('Content Sync token', () => {
  it('asks for the granular scopes when the key does not hold `content`, and keeps them', async () => {
    const { syncRecitation } = await import('./contentSync');
    await expect(syncRecitation(7)).resolves.toMatchObject({ token: 'next' });
    expect(scopes).toEqual(['content', 'content.sync.read content.audio.read']);
  });

  it('names the reason when no scope is given', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'invalid_client' }), { status: 401 })));
    const { syncRecitation } = await import('./contentSync');
    await expect(syncRecitation(7)).rejects.toThrow('token: 401 invalid_client');
  });
});
