import { View } from 'react-native';
import type { BookBox } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import type { Palette } from '@/lib/theme';

// «من أخرجه» (owner, 2026-11-19; sketch /mnt/project-files/hadith-sciences, row 3): the hadith on top and each place it is
// recorded under it, as the website's src/components/hadith/HadithBooks.tsx draws it. The hadith page, its feed card and
// the quiz's look-up draw this one view; a Sahih page passes its own boxes and a press per box.
const STEM = 12;

/** The line from the hadith down to a box: across to its neighbours (none past the first and last), then down. */
function Branch({ first, last, palette }: { first: boolean; last: boolean; palette: Palette }) {
  const line = (shown: boolean) => <View style={{ flex: 1, height: 1, backgroundColor: shown ? palette.rule : 'transparent' }} />;
  return (
    <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>{line(!first)}{line(!last)}</View>
      <View style={{ width: 1, height: STEM, backgroundColor: palette.rule }} />
    </View>
  );
}

export default function HadithBooks({ top, boxes, onOpen, palette }: { top: string; boxes: BookBox[]; onOpen?: (box: BookBox) => void; palette: Palette }) {
  const said = (box: BookBox) => [box.number ? `${box.name} ${num(box.number)}` : box.name, ...(box.named ? ['سمّاه النووي'] : []), ...box.notes].join('، ');
  return (
    <View accessible={!onOpen} accessibilityLabel={`من أخرجه: ${boxes.map(said).join('؛ ')}`} style={{ alignItems: 'center' }}>
      <Card palette={palette} pad={[2, 14]}><Text style={{ color: palette.green, fontSize: 15.5, textAlign: 'center' }}>{top}</Text></Card>
      <View style={{ width: 1, height: STEM, backgroundColor: palette.rule }} />
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
        {boxes.map((box, i) => (
          <View key={box.key} style={{ flex: 1, minWidth: 0, alignItems: 'center' }}>
            <Branch first={i === 0} last={i === boxes.length - 1} palette={palette} />
            <Card palette={palette} pad={[2, 8]} style={{ alignItems: 'center', maxWidth: '94%' }}
              onPress={onOpen ? () => onOpen(box) : undefined} accessibilityLabel={onOpen ? said(box) : undefined}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: palette.ink, fontSize: 15, textAlign: 'center' }}>{box.name}</Text>
              {box.number ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center' }}>{num(box.number)}</Text> : null}
            </Card>
            {box.named && <Text style={{ color: palette.accent, fontSize: 12.5, textAlign: 'center', marginTop: 3 }}>سمّاه النووي</Text>}
            {box.notes.map(note => <Text key={note} style={{ color: palette.muted, fontSize: 12.5, textAlign: 'center' }}>{note}</Text>)}
          </View>
        ))}
      </View>
    </View>
  );
}
