import { View } from 'react-native';
import { rangeName, type AppReport, type AppStory, type AppStoryAyat } from '@shared/stories/story';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import Folded from '@/ui/Folded';
import { AyatRange } from '@/components/AyahLines';
import { Readings, Refs } from '@/components/battles/BattleParts';
import type { Palette } from '@/lib/theme';

/** A story's tags, as muted words under its name (owner, 2026-11-19: chips there are its people), as the stories list shows them. */
export function Tags({ story, palette }: { story: AppStory; palette: Palette }) {
  return story.tags.length ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{story.tags.join(' · ')}</Text> : null;
}

/**
 * One report whole (owner, 2026-11-18): its chain first, then its moments, each our few words naming it over the source's
 * words, which together are the report as the book has it; then the book's words on who has it, and the page. It reads as
 * the book prints it (owner, 2026-11-19): a paragraph per moment, no titles or numbers, and the people once, in the
 * story's «من في القصة». The moments' titles stay in the data for the quiz.
 */
export function Report({ report, palette, plain }: { report: AppReport; palette: Palette;
  /** In a feed card the page is plain text, and its link is a button under the card. */
  plain?: boolean }) {
  return (
    <View style={{ gap: 12 }}>
      {report.isnad ? <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{report.isnad}</Text> : null}
      {report.moments.map(moment => (
        <Text key={moment.title} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{moment.text}</Text>
      ))}
      <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>
        {report.grading ? `${report.grading} · ` : ''}
        {plain ? report.cite : <ExternalLink url={report.url} color={palette.muted} size={13}>{report.cite}</ExternalLink>}
      </Text>
    </View>
  );
}

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
