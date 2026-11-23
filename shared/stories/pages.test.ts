import { describe, expect, it } from 'vitest';
import data from '../data/events/stories.json';
import type { AppStory } from './story';
import { isnadParts, narratorOf } from './story';
import { storyChapters, storyPages } from './pages';

const stories = data as AppStory[];
const pages = storyPages(stories);

describe('the year pages of the sira stories', () => {
  it('runs from before the hijra through the years to the undated, with no empty page', () => {
    expect(pages[0].key).toBe('before');
    expect(pages.at(-1)!.key).toBe('none');
    const years = pages.slice(1, -1).map(page => page.key as number);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(pages.filter(page => !page.chapters.length)).toEqual([]);
  });

  it('holds every story on each of its years, or on «بلا سنة»', () => {
    for (const story of stories) {
      const on = pages.filter(page => page.chapters.some(chapter => chapter.stories.includes(story))).map(page => page.key);
      expect(on).toEqual(story.when?.pages ?? ['none']);
    }
  });

  it('gives every year page the quotes for its year, and the page before the hijra none', () => {
    expect(pages.filter(page => typeof page.key === 'number' && !page.refs.length).map(page => page.key)).toEqual([]);
    expect(pages[0].refs).toEqual([]);
  });

  it('lists every chapter once in «الفهرس», with all its stories', () => {
    const chapters = storyChapters(stories);
    expect(chapters.map(chapter => chapter.name)).toEqual([...new Set(stories.map(story => story.chapter))]);
    expect(chapters.flatMap(chapter => chapter.stories)).toHaveLength(stories.length);
  });
});

describe('a chain in one line', () => {
  it('is the last link as printed, the rest opening from it', () => {
    const isnad = 'حَدَّثَنَا أَبُو مَعْمَرٍ: حَدَّثَنَا عَبْدُ الْوَارِثِ: حَدَّثَنَا عَبْدُ الْعَزِيزِ، عَنْ أَنَسٍ  رضي الله عنه قَالَ:';
    expect(isnadParts(isnad)).toEqual({ head: 'حَدَّثَنَا أَبُو مَعْمَرٍ: حَدَّثَنَا عَبْدُ الْوَارِثِ: حَدَّثَنَا عَبْدُ الْعَزِيزِ،', tail: 'عَنْ أَنَسٍ رضي الله عنه قَالَ:' });
    expect(narratorOf(isnad)).toBe('عَنْ أَنَسٍ رضي الله عنه قَالَ');
  });

  it('is told by the companion, not by «عن النبي ﷺ»', () => {
    expect(isnadParts('حَدَّثَنَا سُفْيَانُ، عَنْ عَبْدِ اللهِ رضي الله عنه، عَنِ النَّبِيِّ ﷺ:').tail).toBe('عَنْ عَبْدِ اللهِ رضي الله عنه، عَنِ النَّبِيِّ ﷺ:');
  });

  it('starts at «أنّ» or «سمعت» where the last link is told so', () => {
    expect(isnadParts('عَنِ ابْنِ شِهَابٍ قَالَ: حَدَّثَنِي سَعِيدُ بْنُ الْمُسَيَّبِ: أَنَّ أَبَا هُرَيْرَةَ رضي الله عنه أَخْبَرَهُمْ:').tail).toBe('أَنَّ أَبَا هُرَيْرَةَ رضي الله عنه أَخْبَرَهُمْ:');
    expect(isnadParts('حَدَّثَنَا شُعْبَةُ، عَنْ أَبِي إِسْحَاقَ قَالَ: سَمِعْتُ الْبَرَاءَ رضي الله عنه قَالَ:').tail).toBe('سَمِعْتُ الْبَرَاءَ رضي الله عنه قَالَ:');
  });

  it('keeps «عن أبيه» with the link that names the father, and «أنه قال» with its link', () => {
    expect(isnadParts('حَدَّثَنَا سُفْيَانُ، عَنْ مُحَمَّدِ بْنِ جُبَيْرِ بْنِ مُطْعِمٍ، عَنْ أَبِيهِ رضي الله عنه').tail).toBe('عَنْ مُحَمَّدِ بْنِ جُبَيْرِ بْنِ مُطْعِمٍ، عَنْ أَبِيهِ رضي الله عنه');
    expect(isnadParts('حَدَّثَنَا اللَّيْثُ، عَنْ جَابِرِ بْنِ عَبْدِ اللهِ رضي الله عنهما أَنَّهُ قَالَ:').tail).toBe('عَنْ جَابِرِ بْنِ عَبْدِ اللهِ رضي الله عنهما أَنَّهُ قَالَ:');
  });

  it('starts at «قال» before a name, not at «قال» before what he did', () => {
    expect(isnadParts('عَنْ هِشَامٍ، عَنْ أَبِيهِ قَالَ: قَالَ الزُّبَيْرُ:').tail).toBe('قَالَ الزُّبَيْرُ:');
    expect(isnadParts('حَدَّثَنَا عَبْدُ الْوَاحِدِ، عَنْ أَبِيهِ قَالَ: أَتَيْتُ جَابِرًا رضي الله عنه فَقَالَ:').tail).toBe('حَدَّثَنَا عَبْدُ الْوَاحِدِ، عَنْ أَبِيهِ قَالَ: أَتَيْتُ جَابِرًا رضي الله عنه فَقَالَ:');
  });

  it('keeps «حدثني أبي» with the son who says it, and starts at «قالت» before a name', () => {
    expect(isnadParts('حَدَّثَنَا عِكْرِمَةُ بْنُ عَمَّارٍ. حَدَّثَنِي إِيَاسُ بْنُ سَلَمَةَ. حَدَّثَنِي أَبِي قَالَ:').tail).toBe('حَدَّثَنِي إِيَاسُ بْنُ سَلَمَةَ. حَدَّثَنِي أَبِي قَالَ:');
    expect(isnadParts('حَدَّثَنَا عَلِيٌّ، حَدَّثَنَا يَحْيَى، وَزَادَ: قَالَتْ عَائِشَةُ:').tail).toBe('قَالَتْ عَائِشَةُ:');
  });
});
