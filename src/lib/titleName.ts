// Arabic titles that inflect for a woman. English has one form, so it is untouched.
const FEMININE_ARABIC: Record<string, string> = {
  companion: 'صحابية',
};

interface TitleNames {
  slug: string;
  name: string;
  nameTransliterated?: string | null;
}

/** The title as a badge shows it: Arabic in the holder's gender, otherwise the transliteration. */
export function titleName(title: TitleNames, sex: string | null | undefined, language: string): string {
  if (language === 'ar' && title.name) {
    return (sex === 'FEMALE' && FEMININE_ARABIC[title.slug]) || title.name;
  }
  return title.nameTransliterated || title.name;
}
