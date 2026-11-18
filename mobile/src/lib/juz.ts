import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { openIntent } from './ways';

export { juzLabel } from '@shared/hijri';

/** Opens the mushaf at a juz's first ayah. */
export const openJuz = (juz: number) => { const start = JUZ_INDEX[juz - 1]; openIntent({ tab: 'read', at: `${start.surah}:${start.ayah}` }); };
