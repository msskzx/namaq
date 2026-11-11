import type { StoryData } from '@shared/quran/prophets/story';
import alyasa from './alyasa.json';
import ayyub from './ayyub.json';
import dhulKifl from './dhul-kifl.json';
import harun from './harun.json';
import idris from './idris.json';
import ilyas from './ilyas.json';
import musa from './musa.json';
import nuh from './nuh.json';
import shuayb from './shuayb.json';
import yahya from './yahya.json';
import zakariyya from './zakariyya.json';

export const AYAT: Record<string, StoryData> = { idris, nuh, ayyub, shuayb, musa, harun, 'dhul-kifl': dhulKifl, ilyas, alyasa, zakariyya, yahya };
