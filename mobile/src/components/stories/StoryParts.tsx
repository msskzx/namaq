import { View } from 'react-native';
import type { AppReport, AppStory, AppStoryAyat } from '@shared/stories/story';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import ExternalLink from '@/ui/ExternalLink';
import Step from '@/ui/Step';
import Folded from '@/ui/Folded';
import { surahName } from '@shared/quran/surahNames';
import { num } from '@shared/quran/arabicNumber';
import { AyatRange } from '@/components/AyahLines';
import { People, Readings, Refs } from '@/components/battles/BattleParts';
import type { Palette } from '@/lib/theme';

/** A story's tags, as plain chips. */
export function Tags({ story, palette }: { story: AppStory; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {story.tags.map(tag => <Chip key={tag} label={tag} on={false} role="text" small palette={palette} />)}
    </View>
  );
}

/**
 * One report whole (owner, 2026-11-18): its chain first, then its moments, each our few words naming it over the source's
 * words, which together are the report as the book has it; then the book's words on who has it, and the page.
 */
export function Report({ report, palette, plain }: { report: AppReport; palette: Palette;
  /** In a feed card the page is plain text, and its link is a button under the card. */
  plain?: boolean }) {
  return (
    <View style={{ gap: 12 }}>
      {report.isnad ? <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{report.isnad}</Text> : null}
      {report.moments.map((moment, i) => (
        <Step key={moment.title} n={i + 1} palette={palette}>
          <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{moment.title}</Text>
          <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{moment.text}</Text>
          {moment.people.length ? <People people={moment.people} palette={palette} /> : null}
        </Step>
      ))}
      <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>
        {report.grading ? `${report.grading} · ` : ''}
        {plain ? report.cite : <ExternalLink url={report.url} color={palette.muted} size={13}>{report.cite}</ExternalLink>}
      </Text>
    </View>
  );
}

/** «فصلت ١–١٣»: surah name first, then the ayat. */
export const rangeName = (from: string, to: string) => {
  const [surah, first] = from.split(':').map(Number);
  const last = Number(to.split(':')[1]);
  return `${surahName(surah)} ${num(first)}${last === first ? '' : `–${num(last)}`}`;
};

/** The ayat a story turns on, whole in the mushaf's lines and shown at first (owner, 2026-11-18), with the quotes that say so. */
export function StoryAyat({ ayat, palette, folded = false }: { ayat: AppStoryAyat; palette: Palette;
  /** Folded at first (the feed card, where the story leads). */
  folded?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <Folded credit={`${ayat.label}: ${rangeName(ayat.from, ayat.to)}`} startOpen={!folded} palette={palette}>
        <AyatRange from={ayat.from} to={ayat.to} palette={palette} />
      </Folded>
      <Refs refs={ayat.refs} palette={palette} />
      {ayat.others ? <Readings values={[{ value: null, refs: [], others: ayat.others }]} palette={palette} /> : null}
    </View>
  );
}
