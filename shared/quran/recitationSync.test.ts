import { describe, expect, it } from 'vitest';
import { applySync, audioRows, audioUrl, foldMutations, syncDue } from './recitationSync';

const a = { id: 1, key: '1:1', url: 'https://verses.quran.com/Alafasy/mp3/001001.mp3' };
const b = { id: 2, key: '1:2', url: 'https://verses.quran.com/Alafasy/mp3/001002.mp3' };

describe('recitation sync', () => {
  it('reads ayah file rows from a snapshot, skipping chapter files and segments, with full URLs', () => {
    expect(audioRows([
      { record_type: 'audio_file', id: 1, verse_key: '1:1', url: 'Alafasy/mp3/001001.mp3' },
      { record_type: 'chapter_audio_file', id: 9, chapter_id: 1, audio_url: 'x.mp3' },
      { record_type: 'audio_file', id: 3, verse_key: '1:3', url: '//mirrors.quranicaudio.com/everyayah/Husary_64kbps/001003.mp3' },
    ])).toEqual([a, { id: 3, key: '1:3', url: 'https://mirrors.quranicaudio.com/everyayah/Husary_64kbps/001003.mp3' }]);
    expect(audioUrl('https://x.org/a.mp3')).toBe('https://x.org/a.mp3');
  });

  it('folds a run: a snapshot replaces all, then row changes and deletes apply in order', () => {
    const run = foldMutations([
      { type: 'RESOURCE_CREATE', snapshot_url: '/s' },
      { type: 'ROW_UPDATE', record_type: 'audio_file', record_key: 2, data: { id: 2, verse_key: '1:2', url: 'Alafasy/mp3/001002.mp3' } },
      { type: 'ROW_UPDATE', record_type: 'audio_segment', record_key: 7, data: { id: 7 } },
      { type: 'ROW_DELETE', record_type: 'audio_file', record_key: '5', data: null },
      { type: 'RESOURCE_UPDATE' },
    ], new Map([['/s', [a]]]), 't2');
    expect(run).toEqual({ token: 't2', full: [a, b], upsert: [], remove: [], gone: false });
    const rows = foldMutations([
      { type: 'ROW_DELETE', record_type: 'audio_file', record_key: '5', data: null },
      { type: 'ROW_DELETE', record_type: 'audio_file', record_key: '1:7', data: null },
      { type: 'ROW_UPDATE', record_type: 'audio_file', record_key: 5, data: { id: 5, verse_key: '1:5', url: 'x/001005.mp3' } },
    ], new Map(), 't4');
    expect(rows.remove).toEqual(['1:7']);
    expect(rows.upsert.map(item => item.id)).toEqual([5]);
    expect(foldMutations([{ type: 'RESOURCE_DELETE' }], new Map(), 't3')).toMatchObject({ full: [], gone: true });
  });

  it('fetches again only files whose address changed, and drops removed ones', () => {
    const moved = { ...b, url: 'https://verses.quran.com/new/001002.mp3' };
    expect(applySync({ '1:1': a, '1:2': b }, { token: 't', upsert: [moved], remove: [1] })).toEqual({ rows: { '1:2': moved }, refetch: ['1:2'], drop: ['1:1'] });
    expect(applySync({ '1:1': a, '1:2': b }, { token: 't', upsert: [], remove: ['1:1'] }).drop).toEqual(['1:1']);
    expect(applySync({ '1:1': a, '1:2': b }, { token: 't', full: [a], upsert: [], remove: [] })).toEqual({ rows: { '1:1': a }, refetch: [], drop: ['1:2'] });
    // A first sync has nothing on the phone to fetch again.
    expect(applySync({}, { token: 't', full: [a, b], upsert: [], remove: [] }).refetch).toEqual([]);
  });

  it('syncs at most daily, well inside the seven days', () => {
    const day = 24 * 60 * 60 * 1000;
    expect(syncDue(undefined, 0)).toBe(true);
    expect(syncDue(0, day / 2)).toBe(false);
    expect(syncDue(0, 2 * day)).toBe(true);
  });
});
