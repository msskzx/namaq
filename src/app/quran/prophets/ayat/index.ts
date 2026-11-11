import type { StoryData } from '@shared/quran/prophets/story';
import adam from './adam.json';
import alyasa from './alyasa.json';
import ayyub from './ayyub.json';
import dawud from './dawud.json';
import dhulKifl from './dhul-kifl.json';
import harun from './harun.json';
import ibrahim from './ibrahim.json';
import ilyas from './ilyas.json';
import musa from './musa.json';
import shuayb from './shuayb.json';
import sulayman from './sulayman.json';
import yahya from './yahya.json';
import zakariyya from './zakariyya.json';

export const AYAT: Record<string, StoryData> = { adam, ibrahim, ayyub, shuayb, musa, harun, 'dhul-kifl': dhulKifl, dawud, sulayman, ilyas, alyasa, zakariyya, yahya };
