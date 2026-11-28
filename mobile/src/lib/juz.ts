import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { openIntent } from './ways';

export { juzLabel } from '@shared/hijri';

export const openJuz = (juz: number) => { const start = JUZ_INDEX[juz - 1]; openIntent({ tab: 'read', at: `${start.surah}:${start.ayah}` }); };
