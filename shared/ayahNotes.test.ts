import { beforeEach, describe, expect, it } from 'vitest';
import { setKeyStorage } from './storage';
import { notesByDate, readAyahNotes, writeAyahNote } from './ayahNotes';

describe('ayah notes', () => {
  beforeEach(() => {
    const data = new Map<string, string>();
    setKeyStorage({ getItem: key => data.get(key) ?? null, setItem: (key, value) => void data.set(key, value) });
  });

  it('keeps, replaces and removes a note', () => {
    writeAyahNote('2:255', 'آية الكرسي');
    expect(readAyahNotes()['2:255'].text).toBe('آية الكرسي');
    writeAyahNote('2:255', 'تغيرت');
    expect(readAyahNotes()['2:255'].text).toBe('تغيرت');
    writeAyahNote('2:255', '   ');
    expect(readAyahNotes()).toEqual({});
  });

  it('lists the newest note first', () => {
    expect(notesByDate({ '1:1': { text: 'a', at: 1 }, '2:2': { text: 'b', at: 5 } })).toEqual(['2:2', '1:1']);
  });

  it('drops malformed entries', () => {
    setKeyStorage({ getItem: () => JSON.stringify({ x: { text: 'a' }, '1:2': { text: '' }, '1:3': { text: 'ok', at: 3 } }), setItem: () => {} });
    expect(readAyahNotes()).toEqual({ '1:3': { text: 'ok', at: 3 } });
  });
});
