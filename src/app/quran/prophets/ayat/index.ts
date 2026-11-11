import type { StoryData } from '@shared/quran/prophets/story';
import alyasa from './alyasa.json';
import ayyub from './ayyub.json';
import dhulKifl from './dhul-kifl.json';
import harun from './harun.json';
import ilyas from './ilyas.json';
import musa from './musa.json';
import shuayb from './shuayb.json';

export const AYAT: Record<string, StoryData> = { ayyub, shuayb, musa, harun, 'dhul-kifl': dhulKifl, ilyas, alyasa };
