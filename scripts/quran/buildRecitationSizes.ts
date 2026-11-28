import { writeFileSync } from 'node:fs';
import surahs from '../../shared/data/quran/surahs.json';
import { JUZ_STARTS, juzOf } from '../../shared/quran/juz';
import { ayahAudioUrl, RECITERS } from '../../shared/quran/recitation';

const keys = surahs.flatMap(row => Array.from({ length: row.numberOfAyat }, (_, i) => `${row.number}:${i + 1}`));

async function size(url: string): Promise<number> {
  let failure: unknown = 'not ok';
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return Number(response.headers.get('content-length') ?? 0);
      failure = `HTTP ${response.status}`;
    } catch (error) {
      failure = error;
    }
  }
  throw new Error(`no size for ${url}`, { cause: failure });
}

const out: Record<number, { surah: number[]; juz: number[] }> = {};
for (const reciter of RECITERS) {
  const surah = new Array(surahs.length).fill(0);
  const juz = new Array(JUZ_STARTS.length).fill(0);
  for (let at = 0; at < keys.length; at += 24) {
    const batch = keys.slice(at, at + 24);
    const bytes = await Promise.all(batch.map(key => size(ayahAudioUrl(reciter, key))));
    batch.forEach((key, i) => { surah[Number(key.split(':')[0]) - 1] += bytes[i]; juz[juzOf(key) - 1] += bytes[i]; });
  }
  out[reciter.id] = { surah, juz };
  console.log(reciter.id, surah.reduce((a, b) => a + b, 0));
}
writeFileSync('shared/data/quran/recitationSizes.json', `${JSON.stringify(out)}\n`);
