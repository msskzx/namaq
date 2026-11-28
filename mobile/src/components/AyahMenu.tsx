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

export function useAyahMenuFacts(key: string | null | undefined) {
  const trees = useMemo(() => !!key && hasTrees(key), [key]);
  const compare = useMemo(() => !!key && compareTargetsOfAyah(key).length > 0, [key]);
  return { readings: !!key && hasQiraat(key), trees, compare };
}

type Act = () => void;

export type AyahMenuActions = {
  ayat?: { keys: readonly string[]; picked: string; onPick: (key: string) => void };
  page?: Act; mushaf?: Act;
  listen?: Act; recite?: Act;
  forgot: { on: boolean; label?: string; onPress?: Act; onPressAt?: (box: ButtonBox) => void; expanded?: boolean };
  save: { on: boolean; onPress: Act };
  note: { on: boolean; onPress: Act };
  tafsir: Act; balagha: Act; readings: Act; trees: Act; compare: Act; topics?: Act;
  irab?: Act; meaning?: Act; places?: { label: string; onPress: Act };
  copy: Act; share: Act;
};

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
      {act.listen && <ActButton Icon={Play} label="استمع من هذه الآية" name="استمع" palette={palette} onPress={act.listen} />}
      {act.recite && <ActButton Icon={EyeOff} label="سمّع من هذه الآية" name="سمّع" palette={palette} onPress={act.recite} />}
      <ActButton Icon={forgot.on ? LightbulbOff : Lightbulb} label={forgot.label ?? (forgot.on ? 'تذكّرتها' : 'نسيت الآية')} name="نسيت" palette={palette} on={forgot.on}
        expanded={forgot.expanded} onPress={forgot.onPress} onPressAt={forgot.onPressAt} />
      <ActButton Icon={Bookmark} label={act.save.on ? 'أزلها من المحفوظات' : 'احفظ الآية'} name="احفظ" palette={palette} on={act.save.on} tint={palette.root} filled onPress={act.save.onPress} />
      <ActButton Icon={NotebookPen} label={act.note.on ? 'ما دوّنته عن الآية' : 'دوّن عن الآية'} name={NOTE_NAME} palette={palette} on={act.note.on} onPress={act.note.onPress} />
    </>,
    <>
      <ActButton Icon={FEATURE_ICON.tafsir} label="تفسير السعدي" name="التفسير" palette={palette} onPress={act.tafsir} />
      {act.irab && <ActButton Icon={ListTree} label="إعراب الكلمة" name="الإعراب" palette={palette} onPress={act.irab} />}
      {act.meaning && <ActButton Icon={BookOpenText} label="معنى الكلمة" name="المعنى" palette={palette} onPress={act.meaning} />}
      <ActButton Icon={Sparkles} label="البلاغة في الآية" name="البلاغة" palette={palette} onPress={act.balagha} />
      {facts.readings && <ActButton Icon={Layers} label="القراءات العشر في كلمات الآية" name="القراءات" palette={palette} onPress={act.readings} />}
      {facts.trees && <ActButton Icon={TreeIcon} label="متشابهات الآية" name="المتشابهات" palette={palette} onPress={act.trees} />}
      {facts.compare && <ActButton Icon={ArrowLeftRight} label="في المقارنة" name="المقارنة" palette={palette} onPress={act.compare} />}
      {act.places && <ActButton Icon={TextSearch} label={act.places.label} name="المواضع" palette={palette} onPress={act.places.onPress} />}
      {act.topics && <ActButton Icon={TableOfContents} label="موضوع الآية في السورة" name="الموضوعات" palette={palette} onPress={act.topics} />}
    </>,
    <>
      <ActButton Icon={Copy} label="انسخ الآية" name="نسخ" palette={palette} onPress={act.copy} />
      <ActButton Icon={Send} label="مشاركة" name="مشاركة" palette={palette} onPress={act.share} />
    </>,
  ];
}
