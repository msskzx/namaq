import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany: findManyPerson, findManyUnit } = vi.hoisted(() => ({
  findMany: vi.fn(),
  findManyUnit: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    modelUnitPerson: { findMany: findManyPerson },
    modelUnit: { findMany: findManyUnit },
  },
}));

import { loadPersonHadith } from './modelUnitPeople';
import { hadithView } from '@/lib/model/hadithView';

describe('loadPersonHadith', () => {
  beforeEach(() => {
    findManyPerson.mockReset();
    findManyUnit.mockReset();
  });

  it('returns empty array for a person with no hadith', async () => {
    findManyPerson.mockResolvedValue([]);
    expect(await loadPersonHadith('unknown-person')).toEqual([]);
  });

  it('loads from database when person records exist', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([
      { unit: 'bukhari-jibril', person: 'abu-hurayrah', role: 'isnad' },
    ]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: 'كتاب الإيمان',
        bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('abu-hurayrah');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      unit: 'bukhari-jibril',
      book: 'صحيح البخاري',
      roles: ['isnad'],
    });
  });

  it('falls back to files when person table is missing', async () => {
    findManyPerson.mockRejectedValue(new Error('relation "model_unit_people" does not exist'));
    const result = await loadPersonHadith('abu-hurayrah');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((h) => h.unit === 'bukhari-jibril')).toBe(true);
  });

  it('falls back to files when person table is empty', async () => {
    findManyPerson.mockResolvedValue([]);
    const result = await loadPersonHadith('abu-hurayrah');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((h) => h.unit === 'bukhari-jibril')).toBe(true);
  });

  it('returns only hadith units, not commentary or other types', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([
      { unit: 'bukhari-jibril', person: 'test', role: 'speaks' },
      { unit: 'fath-iman-50', person: 'test', role: 'speaks' },
    ]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: 'كتاب الإيمان',
        bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('test');
    expect(result).toHaveLength(1);
    expect(result[0].unit).toBe('bukhari-jibril');
  });

  it('orders results by work slug, kitab, bab, then unit id', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([
      { unit: 'muslim-jibril', person: 'prophet-muhammad', role: 'speaks' },
      { unit: 'bukhari-jibril', person: 'prophet-muhammad', role: 'speaks' },
    ]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'muslim-jibril',
        work: 'test-muslim',
        book: 'صحيح مسلم',
        kitab: 'كتاب الإيمان',
        bab: 'باب بيان الإيمان',
        type: 'hadith',
        view,
      },
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: 'كتاب الإيمان',
        bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('prophet-muhammad');
    expect(result[0].unit).toBe('bukhari-jibril');
    expect(result[1].unit).toBe('muslim-jibril');
  });

  it('sets title to bab when available', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([
      { unit: 'bukhari-jibril', person: 'test', role: 'speaks' },
    ]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: 'كتاب الإيمان',
        bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('test');
    expect(result[0].title).toBe('بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ');
  });

  it('sets title to kitab when bab is not available', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([{ unit: 'bukhari-jibril', person: 'test', role: 'speaks' }]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: 'كتاب الإيمان',
        bab: null,
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('test');
    expect(result[0].title).toBe('كتاب الإيمان');
  });

  it('sets title to book when kitab and bab are not available', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([{ unit: 'bukhari-jibril', person: 'test', role: 'speaks' }]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: null,
        bab: null,
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('test');
    expect(result[0].title).toBe('صحيح البخاري');
  });

  it('aggregates roles in order: isnad, speaks, mentioned', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([
      { unit: 'bukhari-jibril', person: 'test', role: 'speaks' },
      { unit: 'bukhari-jibril', person: 'test', role: 'isnad' },
      { unit: 'bukhari-jibril', person: 'test', role: 'mentioned' },
    ]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: 'كتاب الإيمان',
        bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('test');
    expect(result[0].roles).toEqual(['isnad', 'speaks', 'mentioned']);
  });

  it('includes the view for rendering', async () => {
    const view = hadithView('bukhari-jibril')!;
    findManyPerson.mockResolvedValue([
      { unit: 'bukhari-jibril', person: 'test', role: 'speaks' },
    ]);
    findManyUnit.mockResolvedValue([
      {
        unit: 'bukhari-jibril',
        work: 'test-bukhari',
        book: 'صحيح البخاري',
        kitab: 'كتاب الإيمان',
        bab: 'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ',
        type: 'hadith',
        view,
      },
    ]);

    const result = await loadPersonHadith('test');
    expect(result[0].view).toBeDefined();
    expect(result[0].view.id).toBe('bukhari-jibril');
    expect(result[0].view.reports).toBeDefined();
  });

  it('loads abu-hurayrah from the fixture', async () => {
    findManyPerson.mockResolvedValue([]);
    const result = await loadPersonHadith('abu-hurayrah');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((h) => h.roles.includes('isnad'))).toBe(true);
  });

  it('loads prophet-muhammad from the fixture', async () => {
    findManyPerson.mockResolvedValue([]);
    const result = await loadPersonHadith('prophet-muhammad');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((h) => h.roles.includes('speaks'))).toBe(true);
  });

  it('loads umar-ibn-al-khattab from the fixture', async () => {
    findManyPerson.mockResolvedValue([]);
    const result = await loadPersonHadith('umar-ibn-al-khattab');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((h) => h.unit === 'muslim-jibril' && h.roles.includes('speaks'))).toBe(true);
  });
});
