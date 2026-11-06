import { describe, expect, it } from 'vitest';
import { groups } from './data';
import { evidenceGroup, SUPPORTED_TAGS } from './evidence';

const cited = (id: string) => groups.find(group => group.citations.some(citation => citation.id === id))!;

describe('source-supported differences', () => {
  it('does not publish grammatical tags from an uncited comparison', () => {
    const group = groups.find(group => group.tags.includes('gender') && !group.citations.length)!;
    const visible = evidenceGroup(group);
    expect(visible.tags).toEqual([]);
    expect(visible.examples).toEqual({});
    expect(visible.columns.flatMap(pair => pair.columns.flatMap(column => column.tags))).toEqual([]);
  });

  it('retains the sourced replacement example and moved-word connections', () => {
    const group = evidenceGroup(cited('K02'));
    expect(group.tags).toEqual(['order', 'word']);
    expect(group.examples?.word).toBe('يؤخذ منها / تنفعها');
    expect(group.columns.some(pair => pair.columns.some(column => column.tags.includes('order')))).toBe(true);
  });

  it('removes evidence when the visible pair excludes the cited passages', () => {
    const original = cited('Z03');
    const group = evidenceGroup(original, ['3:164', '62:2']);
    expect(group.citations).toEqual([]);
    expect(group.tags).toEqual([]);
    expect(group.examples).toEqual({});
    expect(group.columns.every(pair => pair.columns.every(column => !column.tags.length))).toBe(true);
    expect(original.tags).toContain('order');
  });

  it('does not use a citation to connect additional uncited members', () => {
    const group = evidenceGroup(cited('Z03'));
    expect(group.tags).toContain('order');
    expect(group.columns.find(pair => pair.b === '2:151')?.columns.some(column => column.tags.includes('order'))).toBe(true);
    expect(group.columns.filter(pair => pair.b !== '2:151').every(pair => pair.columns.every(column => !column.tags.length))).toBe(true);
  });

  it('requires the cited word selection rather than matching ayah references alone', () => {
    const original = cited('K02');
    const group = evidenceGroup({ ...original, places: original.places.map(place => ({ ...place, end: place.end - 1 })) });
    expect(group.citations).toEqual([]);
    expect(group.tags).toEqual([]);
  });

  it('requires the full cited selection when a passage continues into the next ayah', () => {
    const original = cited('K04');
    const group = evidenceGroup({ ...original, places: original.places.map(place => ({ ...place, through: undefined })) });
    expect(group.citations).toEqual([]);
  });

  it('does not call two plural forms a singular/plural difference', () => {
    const group = evidenceGroup(cited('K04'));
    expect(group.citations.length).toBeGreaterThan(0);
    expect(group.tags).not.toContain('number');
    expect(group.examples?.number).toBeUndefined();
    expect(evidenceGroup(cited('Z05')).examples?.number).toBe('معدودة / معدودات');
  });

  it('offers only the difference filters supported by recorded source cases', () => {
    expect(SUPPORTED_TAGS).toHaveProperty('case');
    expect(SUPPORTED_TAGS).not.toHaveProperty('gender');
    expect(SUPPORTED_TAGS).not.toHaveProperty('pronoun');
    expect(SUPPORTED_TAGS).not.toHaveProperty('frame');
  });
});
