
export const ID_KINDS = ['person', 'ayah', 'hadith', 'battle', 'event', 'utterance', 'place'] as const;
export type IdKind = (typeof ID_KINDS)[number];

export const HADITH_BOOKS: Readonly<Record<string, string>> = { 'sahih-al-bukhari': 'bukhari', 'sahih-muslim': 'muslim' };

export const LINK_TYPES = {
  REVEALED_ABOUT: 'نزلت فيه',
  DESCRIBES: 'ذُكر فيمن تصفهم',
  ACTED_ON: 'عمل بها',
  READ_AS_ABOUT: 'قرأها فيه أحد من نقل عنهم المصدر',
  IN_STORY: 'نزلت في خبر من أخباره',
  RECITED: 'قُرئت في القصة',
  TOLD_IN: 'رُويت القصة في الحديث',
  IN_EVENT: 'في القصة',
  SPEAKS_IN: 'تكلم في القصة',
  PARTICIPATED_IN: 'شهدها',
  ABSENT_FROM: 'غاب عنها',
  IN_MOMENT: 'ذُكر في خبر من أخبارها',
  FOUGHT_AT: 'كانت فيه',
  SAID: 'قالها',
  ABOUT: 'قيلت فيه',
  SAID_AT: 'قيلت فيها',
} as const;
export type CrossLinkType = keyof typeof LINK_TYPES;

export interface Link {
  readonly t: string;
  readonly to: string;
  readonly src: readonly string[];
  readonly at: readonly string[];
}

export type LinkIndex = Readonly<Record<string, readonly Link[]>>;

export const kindOf = (id: string) => id.slice(0, id.indexOf(':')) as IdKind;
