// see docs/plans/quran-qiraat.md
export const READERS = [
  { id: 'nafi', name: 'نافع' },
  { id: 'ibn-kathir', name: 'ابن كثير' },
  { id: 'abu-amr', name: 'أبو عمرو' },
  { id: 'ibn-amir', name: 'ابن عامر' },
  { id: 'asim', name: 'عاصم' },
  { id: 'hamza', name: 'حمزة' },
  { id: 'kisai', name: 'الكسائي' },
  { id: 'abu-jafar', name: 'أبو جعفر' },
  { id: 'yaqub', name: 'يعقوب' },
  { id: 'khalaf', name: 'خلف العاشر' },
] as const;

export type ReaderId = (typeof READERS)[number]['id'];

export const RIWAYAT = [
  { id: 'qalun', name: 'قالون', reader: 'nafi' },
  { id: 'warsh', name: 'ورش', reader: 'nafi' },
  { id: 'bazzi', name: 'البزي', reader: 'ibn-kathir' },
  { id: 'qunbul', name: 'قنبل', reader: 'ibn-kathir' },
  { id: 'duri-abu-amr', name: 'الدوري عن أبي عمرو', reader: 'abu-amr' },
  { id: 'susi', name: 'السوسي', reader: 'abu-amr' },
  { id: 'hisham', name: 'هشام', reader: 'ibn-amir' },
  { id: 'ibn-dhakwan', name: 'ابن ذكوان', reader: 'ibn-amir' },
  { id: 'shuba', name: 'شعبة', reader: 'asim' },
  { id: 'hafs', name: 'حفص', reader: 'asim' },
  { id: 'khalaf-hamza', name: 'خلف عن حمزة', reader: 'hamza' },
  { id: 'khallad', name: 'خلاد', reader: 'hamza' },
  { id: 'abu-al-harith', name: 'أبو الحارث', reader: 'kisai' },
  { id: 'duri-kisai', name: 'الدوري عن الكسائي', reader: 'kisai' },
  { id: 'ibn-wardan', name: 'ابن وردان', reader: 'abu-jafar' },
  { id: 'ibn-jammaz', name: 'ابن جمّاز', reader: 'abu-jafar' },
  { id: 'ruways', name: 'رويس', reader: 'yaqub' },
  { id: 'rawh', name: 'روح', reader: 'yaqub' },
  { id: 'ishaq', name: 'إسحاق', reader: 'khalaf' },
  { id: 'idris', name: 'إدريس', reader: 'khalaf' },
] as const satisfies readonly { id: string; name: string; reader: ReaderId }[];

export type RiwayaId = (typeof RIWAYAT)[number]['id'];

export type WordReading = { text: string; rawis: number[] };
export type WordDifference = { at: [number, number]; readings: WordReading[] };

export const QIRAAT_SOURCE = { name: 'الموسوعة القرآنية', url: 'https://quranpedia.net' };

export function whoReads(reading: WordReading, all: WordReading[], sayRest = true): string {
  const others = new Set(all.filter(r => r !== reading).flatMap(r => r.rawis));
  const biggest = all.reduce((p, r) => (r.rawis.length > p.rawis.length ? r : p), all[0]);
  const rest = RIWAYAT.map((_, i) => i + 1).filter(n => !others.has(n));
  if (sayRest && reading === biggest && reading.rawis.length > RIWAYAT.length / 2 && rest.length === reading.rawis.length && rest.every(n => reading.rawis.includes(n))) return 'الباقون';
  const has = new Set(reading.rawis);
  const names: string[] = [];
  for (const reader of READERS) {
    const own = RIWAYAT.flatMap((r, i) => (r.reader === reader.id ? [i + 1] : []));
    const read = own.filter(n => has.has(n));
    if (read.length === own.length) names.push(reader.name);
    else names.push(...read.map(n => RIWAYAT[n - 1].name));
  }
  return names.join('، ');
}

export function wholeReaders(readings: WordReading[]): { reader: number; reading: number }[] {
  return READERS.flatMap((reader, i) => {
    const own = RIWAYAT.flatMap((riwaya, n) => (riwaya.reader === reader.id ? [n + 1] : []));
    const reading = readings.findIndex(r => own.every(n => r.rawis.includes(n)) && readings.every(o => o === r || !own.some(n => o.rawis.includes(n))));
    return reading < 0 ? [] : [{ reader: i, reading }];
  });
}
