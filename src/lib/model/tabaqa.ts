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
