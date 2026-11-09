import { describe, expect, it } from 'vitest';
import { branchesHref, type BranchAyah } from '../branches';
import { browseGroups, deduplicateGroups, filteredAyat, groupFilters, toggleFilter, type GroupFilters } from './browse';
import type { Group } from './types';
import artifact from '../../data/quran/mutashabih.json';
import treeData from '../../data/quran/trees.json';
import { canonicalGroups, groupHasId } from './identity';

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
  it('filters purposes independently of book evidence and keeps merged citations and categories', () => {
    const selections = [{ key: '50:1', start: 0, end: 1 }, { key: '50:2', start: 0, end: 1 }];
    const citation = { id: 'K02', book: 'Book', edition: 'Edition', locator: '1:2', quote: 'Quote', url: 'https://example.com', places: ['50:1', '50:2'], selections, tags: ['order' as const] };
    const uncited = { ...group('uncited', ['50:1', '50:2']), categories: ['mutashabeh' as const] };
    const pondering = { ...group('pondering', ['50:1', '50:2'], { citations: [citation] }), categories: ['pondering' as const] };
    const second = { ...pondering, id: 'second', citations: [{ ...citation, id: 'I02' }] };
    expect(ids(browseGroups([uncited, pondering], { categories: 'mutashabeh' }, ayat, null))).toEqual(['uncited']);
    expect(browseGroups([uncited], { categories: 'mutashabeh', cited: '1' }, ayat, null)).toEqual([]);
    const merged = deduplicateGroups([uncited, pondering, second]);
    expect(merged).toHaveLength(1);
    expect(merged[0].categories).toEqual(expect.arrayContaining(['mutashabeh', 'pondering']));
    expect(merged[0].citations.map(citation => citation.id)).toEqual(['K02', 'I02']);
    expect(merged[0].tags).toEqual(['order']);
    expect(uncited.aliases).toBeUndefined();
  });

  it('shows the filtered Adam comparison once, rebuilding the longer common phrase and preserving both old links', () => {
    const source: Group[] = JSON.parse(JSON.stringify(artifact));
    const corpus = new Map<string, BranchAyah>(treeData.ayat.map(ayah => [ayah.key, ayah]));
    const oldIds = ['group:2:34,17:61,18:50,20:116', 'group:2:34,7:11,17:61,18:50,20:116'];
    const candidates = canonicalGroups(source.filter(group => oldIds.includes(group.id)));
    const visible = browseGroups(candidates, { surahs: '1,17,18' }, corpus, null);
    expect(visible).toHaveLength(1);
    expect(visible[0].places.map(place => place.key)).toEqual(['17:61', '18:50']);
    expect(visible[0].tree.occurrences.map(place => place.start)).toEqual([0, 0]);
    expect(visible[0].tree.text).toContain('إِذْ قُلْنَا');
    for (const id of [...oldIds, ...candidates.map(group => group.id)]) expect(groupHasId(visible[0], id)).toBe(true);
    expect(candidates.map(group => group.places.length)).toEqual([4, 5]);
  });

  it('keeps different shared expressions within the same ayat separately discoverable', () => {
    const first = group('first', ['50:1', '50:2'], { kind: 'shared_phrase' });
    const secondPlaces = first.places.map(place => ({ ...place, start: 2, end: 3 }));
    const second = { ...first, id: 'second', places: secondPlaces, tree: { ...first.tree, id: 'second', occurrences: secondPlaces } };
    expect(ids(browseGroups([first, second], {}, ayat, null))).toEqual(['first', 'second']);
  });

  it('preserves distinct complete and multi-ayah comparisons sharing the same first ayat', () => {
    const source: Group[] = JSON.parse(JSON.stringify(artifact));
    const corpus = new Map<string, BranchAyah>(treeData.ayat.map(ayah => [ayah.key, ayah]));
    const oldIds = ['group:2:58-2:59,7:161-7:162', 'group:2:58,7:161'];
    expect(browseGroups(source.filter(group => oldIds.includes(group.id)), {}, corpus, null)).toHaveLength(2);
  });

  it('counts only visible marked differences when sorting a scoped comparison', () => {
    const first = group('first', ['25:1', '50:1', '50:2'], { differences: { '25:1': [0, 1, 2], '50:1': [0] } });
    const second = group('second', ['50:1', '50:2'], { differences: { '50:1': [0], '50:2': [0] } });
    second.tree.occurrences = second.tree.occurrences.map(occurrence => ({ ...occurrence, start: 2, end: 3 }));
    const visible = browseGroups([second, first], { surahs: '50', sort: 'differences' }, ayat, null);
    expect(ids(visible)).toEqual(['first', 'second']);
    expect(visible[0].differences).toEqual({ '50:1': [0] });
  });

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
    const citation = { id: 'K02', book: 'Book', edition: 'Edition', locator: '1:2', quote: 'Quote', url: 'https://example.com', places: ['50:1', '50:2'], selections: [{ key: '50:1', start: 0, end: 1 }, { key: '50:2', start: 0, end: 1 }], tags: ['order' as const] };
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
