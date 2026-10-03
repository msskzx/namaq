import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogVirtue } from '../../src/lib/catalog/types';
import { planVirtues, virtueRows } from './personVirtues';

const dhahabi: CatalogVirtue = { value: 'كَانَ مِنْ خِيَارِ الصَّحَابَةِ', claims: ['abu-jandal-siyar23/virtues'] };
const ummSalama: CatalogVirtue = {
  value: 'قَالَتْ: أَنَا سَمِعْتُ رَسُولَ اللهِ -صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ- يَقُولُ',
  speaker: { name: 'أم سلمة', slug: 'umm-salama' },
  claims: ['umm-salama/virtues-quoted'],
};

describe('virtueRows', () => {
  it('numbers the entries and names the speaker, al-Dhahabi by default', () => {
    expect(virtueRows([dhahabi, ummSalama])).toEqual([
      {
        position: 0,
        text: 'كَانَ مِنْ خِيَارِ الصَّحَابَةِ',
        speakerName: null,
        speakerSlug: null,
        claimKey: 'abu-jandal-siyar23/virtues',
      },
      {
        position: 1,
        text: 'قَالَتْ: أَنَا سَمِعْتُ رَسُولَ اللهِ -صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ- يَقُولُ',
        speakerName: 'أم سلمة',
        speakerSlug: 'umm-salama',
        claimKey: 'umm-salama/virtues-quoted',
      },
    ]);
  });

  it('records no claim for a value still awaiting evidence', () => {
    expect(virtueRows([{ value: 'وصف', claims: legacyUnreviewed }])[0].claimKey).toBeNull();
  });

  it('is empty for a person who declares no virtues', () => {
    expect(virtueRows(undefined)).toEqual([]);
  });
});

describe('planVirtues', () => {
  it('says nothing when the rows already match the files', () => {
    const { changes } = planVirtues('people/abu-jandal', [dhahabi], virtueRows([dhahabi]));
    expect(changes).toEqual([]);
  });

  it('prints one line per entry added, rewritten or dropped', () => {
    const live = [
      { position: 0, text: 'نص قديم', speakerName: null, speakerSlug: null, claimKey: null },
      { position: 1, text: 'زائدة', speakerName: null, speakerSlug: null, claimKey: null },
    ];
    const { rows, changes } = planVirtues('people/someone', [ummSalama], live);

    expect(rows).toEqual(virtueRows([ummSalama]));
    expect(changes).toEqual([
      'people/someone.virtues[0]: overwrite "نص قديم" with "قَالَتْ: أَنَا سَمِعْتُ رَسُولَ اللهِ -صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ- يَقُولُ"',
      'people/someone.virtues[1]: drop',
    ]);
  });

  it('adds an entry the database does not hold yet', () => {
    expect(planVirtues('people/someone', [dhahabi], []).changes).toEqual(['people/someone.virtues[0]: add']);
  });

  it('counts a speaker the rows do not carry as a change of its own', () => {
    const spoken = planVirtues('people/someone', [ummSalama], [
      {
        position: 0,
        text: ummSalama.value,
        speakerName: null,
        speakerSlug: null,
        claimKey: 'umm-salama/virtues-quoted',
      },
    ]).changes;

    expect(spoken).toEqual([
      `people/someone.virtues[0]: overwrite ${JSON.stringify(ummSalama.value)} with ${JSON.stringify(ummSalama.value)}`,
    ]);
  });
});