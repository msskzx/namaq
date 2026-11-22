import { useMemo } from 'react';
import { View } from 'react-native';
import { ArrowLeftRight, BookOpenText, Bookmark, Copy, EyeOff, FileText, Layers, Lightbulb, LightbulbOff, ListTree, NotebookPen, Play, Send, Sparkles, TableOfContents, TextSearch } from 'lucide-react-native';
import { hasQiraat } from '@shared/quran/qiraatData';
import { NOTE_NAME } from '@shared/quran/selection';
import { hasTrees } from '@/lib/branchList';
import { compareTargetsOfAyah } from '@/lib/compare';
import type { Palette } from '@/lib/theme';
import ActButton, { type ButtonBox } from '@/ui/ActButton';
import Chip from '@/ui/Chip';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { FEATURE_ICON } from './featureIcons';
import TreeIcon from './TreeIcon';

/** Which of the ayah's places hold something: its readings, the trees and the compare cards it is in. */
export function useAyahMenuFacts(key: string | null | undefined) {
  const trees = useMemo(() => !!key && hasTrees(key), [key]);
  const compare = useMemo(() => !!key && compareTargetsOfAyah(key).length > 0, [key]);
  return { readings: !!key && hasQiraat(key), trees, compare };
}

type Act = () => void;

/** What each button of the menu does where it is opened; a button with no action here is left out. */
export type AyahMenuActions = {
  /** A view of several ayat: the one the menu acts on, picked from a row of them. */
  ayat?: { keys: readonly string[]; picked: string; onPick: (key: string) => void };
  /** Outside the reader (owner, 2026-11-22): the ayah's page and the mushaf at the ayah, first. */
  page?: Act; mushaf?: Act;
  listen?: Act; recite?: Act;
  forgot: { on: boolean; label?: string; onPress?: Act; onPressAt?: (box: ButtonBox) => void; expanded?: boolean };
  save: { on: boolean; onPress: Act };
  note: { on: boolean; onPress: Act };
  tafsir: Act; balagha: Act; readings: Act; trees: Act; compare: Act; topics?: Act;
  /** The pressed word's i'rab and meaning, and its places in the Quran (the reader's long press on a word). */
  irab?: Act; meaning?: Act; places?: { label: string; onPress: Act };
  copy: Act; share: Act;
};

/**
 * The reader's long-press menu on an ayah (owner, 2026-11-19, 2026-11-22), the one list of its buttons wherever an ayah is
 * long pressed: the reader's own actions, the Quran's, then sending, a thin line between the groups. Outside the reader a
 * first group opens the ayah's page and the mushaf.
 */
export function ayahMenuGroups(facts: ReturnType<typeof useAyahMenuFacts>, act: AyahMenuActions, palette: Palette): React.ReactNode[] {
  const { forgot } = act;
  const surahs = new Set(act.ayat?.keys.map(key => key.split(':')[0]));
  const ayahName = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return surahs.size > 1 ? `${surahName(surah)} ${num(ayah)}` : num(ayah); };
  return [
    ...(act.ayat ? [<View key="ayat" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, maxWidth: 4 * 56 }}>
      {act.ayat.keys.map(key => <Chip key={key} small role="radio" label={ayahName(key)} on={key === act.ayat!.picked} onPress={() => act.ayat!.onPick(key)} palette={palette}
        accessibilityLabel={`الآية ${ayahName(key)}`} />)}
    </View>] : []),
    ...(act.page || act.mushaf ? [<>
      {act.page && <ActButton Icon={FileText} label="صفحة الآية" name="صفحة الآية" palette={palette} onPress={act.page} />}
      {act.mushaf && <ActButton Icon={FEATURE_ICON.mushaf} label="في المصحف" name="المصحف" palette={palette} onPress={act.mushaf} />}
    </>] : []),
    <>
      {/* Listening from this ayah to its surah's end, the first button (owner, 2026-11-17). */}
      {act.listen && <ActButton Icon={Play} label="استمع من هذه الآية" name="استمع" palette={palette} onPress={act.listen} />}
      {act.recite && <ActButton Icon={EyeOff} label="سمّع من هذه الآية" name="سمّع" palette={palette} onPress={act.recite} />}
      <ActButton Icon={forgot.on ? LightbulbOff : Lightbulb} label={forgot.label ?? (forgot.on ? 'تذكّرتها' : 'نسيت الآية')} name="نسيت" palette={palette} on={forgot.on}
        expanded={forgot.expanded} onPress={forgot.onPress} onPressAt={forgot.onPressAt} />
      <ActButton Icon={Bookmark} label={act.save.on ? 'أزلها من المحفوظات' : 'احفظ الآية'} name="احفظ" palette={palette} on={act.save.on} tint={palette.root} filled onPress={act.save.onPress} />
      {/* «دوّن», the reader's own words on the ayah (owner, 2026-11-19; it was «تأمّل»). */}
      <ActButton Icon={NotebookPen} label={act.note.on ? 'ما دوّنته عن الآية' : 'دوّن عن الآية'} name={NOTE_NAME} palette={palette} on={act.note.on} onPress={act.note.onPress} />
    </>,
    <>
      <ActButton Icon={FEATURE_ICON.tafsir} label="تفسير السعدي" name="التفسير" palette={palette} onPress={act.tafsir} />
      {/* The pressed word's i'rab and meaning; their sheets hold every word of the ayah to pick another (owner, 2026-11-19). */}
      {act.irab && <ActButton Icon={ListTree} label="إعراب الكلمة" name="الإعراب" palette={palette} onPress={act.irab} />}
      {act.meaning && <ActButton Icon={BookOpenText} label="معنى الكلمة" name="المعنى" palette={palette} onPress={act.meaning} />}
      {/* The ayah's balagha: al-Itqan's paragraphs and al-Kashshaf's passage, pills between them (owner, 2026-11-16). */}
      <ActButton Icon={Sparkles} label="البلاغة في الآية" name="البلاغة" palette={palette} onPress={act.balagha} />
      {facts.readings && <ActButton Icon={Layers} label="القراءات العشر في كلمات الآية" name="القراءات" palette={palette} onPress={act.readings} />}
      {facts.trees && <ActButton Icon={TreeIcon} label="متشابهات الآية" name="المتشابهات" palette={palette} onPress={act.trees} />}
      {facts.compare && <ActButton Icon={ArrowLeftRight} label="في المقارنة" name="المقارنة" palette={palette} onPress={act.compare} />}
      {act.places && <ActButton Icon={TextSearch} label={act.places.label} name="المواضع" palette={palette} onPress={act.places.onPress} />}
      {act.topics && <ActButton Icon={TableOfContents} label="موضوع الآية في السورة" name="الموضوعات" palette={palette} onPress={act.topics} />}
    </>,
    <>
      <ActButton Icon={Copy} label="انسخ الآية" name="نسخ" palette={palette} onPress={act.copy} />
      {/* Share is always the last button. */}
      <ActButton Icon={Send} label="مشاركة" name="مشاركة" palette={palette} onPress={act.share} />
    </>,
  ];
}
