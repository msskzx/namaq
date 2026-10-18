import { describe, expect, it } from 'vitest';
import { PROPHET_GRAPH_HREF, COMPARE_HREF, NASAB_HREF, NASAB_SUBJECTS } from './homeLinks';

describe('homepage example links', () => {
  it('preserves the requested comparison, five lineages and expanded graph', () => {
    expect(Object.fromEntries(new URL(COMPARE_HREF, 'https://namaq.local').searchParams)).toEqual({ a: '26', af: '41', at: '45', b: '7', bf: '113', bt: '117', view: 'ayat' });
    expect(new URL(NASAB_HREF, 'https://namaq.local').searchParams.getAll('subject')).toEqual(NASAB_SUBJECTS.map(slug => `person:${slug}`));
    const graph = new URL(PROPHET_GRAPH_HREF, 'https://namaq.local');
    expect(graph.searchParams.getAll('expand')).toContain('person:aisha-bint-abi-bakr:FATHER');
    expect(graph.searchParams.getAll('expand')).toContain('person:prophet-muhammad:FATHER_IN_LAW');
  });
});
