import { describe, expect, it } from 'vitest';
import { branchesHref, type BranchAyah } from '@/lib/quran/branches';
import { browseGroups, filteredAyat, groupFilters, toggleFilter, type GroupFilters } from './browse';
import type { Group } from './types';

function group(id: string, keys: string[], options: Partial<Pick<Group, 'kind' | 'score' | 'tags' | 'citations' | 'differences'>> = {}): Group {
  const places = keys.map(key => ({ key, start: 0, end: 1 }));
  return {
    id,
    text: 'عبارة',
    places,
    tree: { id, text: 'عبارة', occurrences: places },
    kind: 'mutashabih_lafzi',
    tags: ['order'],
    differences: {},
    score: 0.8,
    citations: [],
    columns: [],
    ...options,
  };
}

const qaf = group('qaf', ['50:1', '50:2']);
const mulk = group('mulk', ['67:1', '67:2']);
const furqan = group('furqan', ['25:1', '25:2']);
const groups = [mulk, furqan, qaf];
const pages: Record<string, number> = { '25': 359, '50': 518, '67': 562 };
const ayat = new Map<string, BranchAyah>(groups.flatMap(group => group.places.map(({ key }) => [
  key, { key, page: pages[key.split(':')[0]], words: ['عبارة'] },
])));

const ids = (matches: Group[]) => matches.map(group => group.id);
const browse = (filters: GroupFilters) => ids(browseGroups(groups, filters, ayat, null));

describe('browse groups', () => {
  it('includes a match in either the selected surah or the selected juz', () => {
    expect(browse({ surahs: '50', juz: '29' })).toEqual(['qaf', 'mulk']);
  });

  it('intersects the combined scope with the page range', () => {
    expect(browse({ surahs: '50', juz: '29', pageFrom: '550', pageTo: '580' })).toEqual(['mulk']);
  });

  it('preserves the existing juz range as a separate restriction', () => {
    const matches = browseGroups(groups, { surahs: '50', juz: '29' }, ayat, { from: 29, to: 30 });
    expect(ids(matches)).toEqual(['mulk']);
  });

  it('limits group members and tree occurrences to the selected juz range without changing the source group', () => {
    const mixed = group('mixed', ['2:1', '67:1', '67:2']);
    const single = group('single', ['2:1', '67:1']);
    const scoped = browseGroups([mixed, single], {}, ayat, { from: 29, to: 30 });
    expect(ids(scoped)).toEqual(['mixed']);
    expect(scoped[0].places.map(place => place.key)).toEqual(['67:1', '67:2']);
    expect(scoped[0].tree.occurrences.map(place => place.key)).toEqual(['67:1', '67:2']);
    expect(mixed.places.map(place => place.key)).toEqual(['2:1', '67:1', '67:2']);
  });

  it('combines the relation, difference and cited filters', () => {
    const citation = { id: 'K02', book: 'Book', edition: 'Edition', locator: '1:2', quote: 'Quote', url: 'https://example.com', places: ['50:1', '50:2'], tags: ['order' as const] };
    const cited = group('cited', ['50:1', '50:2'], { citations: [citation] });
    const frame = group('frame', ['50:1', '50:2'], { kind: 'same_frame', tags: ['frame'], citations: [citation] });
    const others = [qaf, cited, frame, group('uncited', ['50:1', '50:2'], { tags: ['particle'] })];
    expect(ids(browseGroups(others, { relations: 'mutashabih_lafzi', differences: 'order', cited: '1' }, ayat, null))).toEqual(['cited']);
  });

  it('orders by position, score, number of places or number of differences', () => {
    const first = group('first', ['25:1', '25:2'], { score: 0.5, differences: { '25:1': [0], '25:2': [0] } });
    const closest = group('closest', ['50:1', '50:2'], { score: 1, differences: { '50:1': [0], '50:2': [0] } });
    const most = group('most', ['67:1', '67:2', '67:3'], { score: 0.9, differences: { '67:1': [0], '67:2': [0] } });
    const fewest = group('fewest', ['69:1', '69:2'], { score: 0.8, differences: { '69:1': [0] } });
    const candidates = [closest, fewest, most, first];
    const sortableAyat = new Map(ayat);
    for (const group of candidates) for (const { key } of group.places) sortableAyat.set(key, { key, page: 1, words: ['عبارة'] });
    const sortBy = (sort?: string) => browseGroups(candidates, { sort }, sortableAyat, null)[0]?.id;
    expect([sortBy(), sortBy('closest'), sortBy('places'), sortBy('differences')]).toEqual(['first', 'closest', 'most', 'fewest']);
  });
});

describe('difference filter links', () => {
  it('toggles just the selected difference and keeps the current group in the URL', () => {
    const initial = { differences: 'particle', sort: 'closest', surahs: '50,70' };
    const selected = toggleFilter(initial.differences, 'order');
    expect(selected?.split(',')).toEqual(expect.arrayContaining(['particle', 'order']));
    expect(toggleFilter(selected, 'order')).toBe('particle');
    const href = branchesHref('the-group', undefined, { mode: 'cards', filters: { ...initial, differences: selected } });
    const url = new URL(href, 'https://namaq.test');
    expect(url.searchParams.get('o')).toBe('the-group');
    expect(url.searchParams.get('m')).toBe('cards');
    expect(groupFilters(Object.fromEntries(url.searchParams))).toEqual({ ...initial, differences: selected });
  });
});


describe('scope units', () => {
  const source = new Map<string, BranchAyah>([
    ['50:1', { key: '50:1', page: 518, words: ['أ'] }],
    ['55:1', { key: '55:1', page: 531, words: ['ب'] }],
    ['60:1', { key: '60:1', page: 549, words: ['ج'] }],
    ['61:1', { key: '61:1', page: 551, words: ['د'] }],
  ]);

  it('distinguishes chapter ranges from a list of specific chapters', () => {
    expect([...filteredAyat(source, { surahFrom: '50', surahTo: '60' }, null).keys()]).toEqual(['50:1', '55:1', '60:1']);
    expect([...filteredAyat(source, { surahs: '50,60' }, null).keys()]).toEqual(['50:1', '60:1']);
  });

  it('includes both page boundaries and excludes ayat beyond them', () => {
    expect([...filteredAyat(source, { pageFrom: '518', pageTo: '549' }, null).keys()]).toEqual(['50:1', '55:1', '60:1']);
    expect(groupFilters({ surahFrom: '50', surahTo: '60', pageFrom: '518', pageTo: '549' })).toEqual({ surahFrom: '50', surahTo: '60', pageFrom: '518', pageTo: '549' });
  });
});
