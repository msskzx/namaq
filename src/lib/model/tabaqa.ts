// docs/plans/hadith-chain-rows.md
export interface Placed {
  person: string;
  tabaqa?: number;
}

export interface TailLink extends Placed {
  label: string;
  mode: string;
}

export interface UnitTabaqa {
  narrators: Record<string, Placed>;
  tail?: { after: string; links: TailLink[] };
}

export const TABAQA: Record<string, UnitTabaqa> = {
  'muslim-jibril': {
    narrators: {
      'أبو خيثمة': { person: 'zuhayr-ibn-harb', tabaqa: 10 },
      'وكيع': { person: 'waki-ibn-al-jarrah', tabaqa: 9 },
      'كهمس': { person: 'kahmas-ibn-al-hasan', tabaqa: 5 },
      'عبد الله بن بريدة': { person: 'abdullah-ibn-buraydah', tabaqa: 3 },
      'ابن بريدة': { person: 'abdullah-ibn-buraydah', tabaqa: 3 },
      'يحيى بن يعمر': { person: 'yahya-ibn-yamar', tabaqa: 3 },
      'عبيد الله بن معاذ العنبري': { person: 'ubaydullah-ibn-muadh', tabaqa: 10 },
      'أبي': { person: 'muadh-ibn-muadh', tabaqa: 9 },
    },
    tail: {
      after: 'yahya-ibn-yamar',
      links: [
        { person: 'abdullah-ibn-umar', label: 'عبد الله بن عمر', mode: 'قَالَ', tabaqa: 1 },
        { person: 'umar-ibn-al-khattab', label: 'عمر بن الخطاب', mode: 'حَدَّثَنِي', tabaqa: 1 },
      ],
    },
  },
  'bukhari-jibril': {
    narrators: {
      'مسدد': { person: 'musaddad-ibn-musarhad', tabaqa: 10 },
      'إسماعيل بن إبراهيم': { person: 'ismail-ibn-ibrahim-ibn-ulayyah', tabaqa: 8 },
      'أبو حيان التيمي': { person: 'yahya-ibn-said-abu-hayyan', tabaqa: 6 },
      'أبي زرعة': { person: 'abu-zurah-ibn-amr-ibn-jarir', tabaqa: 3 },
      'أبي هريرة': { person: 'abu-hurayrah', tabaqa: 1 },
    },
  },
};

export const nameKey = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/g, '').trim();

export const TABAQA_NAMES: Record<number, { ar: string; en: string }> = {
  1: { ar: 'الصحابة', en: 'The Companions' },
  2: { ar: 'كبار التابعين', en: "Senior Tabi'un" },
  3: { ar: 'الوسطى من التابعين', en: "Middle Tabi'un" },
  4: { ar: 'تليها، جل روايتهم عن كبار التابعين', en: "The next layer, mostly narrating from senior Tabi'un" },
  5: { ar: 'الصغرى من التابعين', en: "Junior Tabi'un" },
  6: {
    ar: 'عاصروا الخامسة ولم يثبت لهم لقاء أحد من الصحابة',
    en: 'Contemporaries of the fifth, not shown to have met a Companion',
  },
  7: { ar: 'كبار أتباع التابعين', en: "Senior followers of the Tabi'un" },
  8: { ar: 'الوسطى من أتباع التابعين', en: "Middle followers of the Tabi'un" },
  9: { ar: 'الصغرى من أتباع التابعين', en: "Junior followers of the Tabi'un" },
  10: { ar: 'كبار الآخذين عن تبع الأتباع', en: "Senior takers from the followers of the Tabi'un" },
  11: { ar: 'الوسطى من الآخذين عن تبع الأتباع', en: "Middle takers from the followers of the Tabi'un" },
  12: { ar: 'صغار الآخذين عن تبع الأتباع', en: "Junior takers from the followers of the Tabi'un" },
};
