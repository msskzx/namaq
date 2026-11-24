import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { tanasubLink, tanasubSource } from '@shared/quran/tanasubCards';

/** Under a surah-order book's card on branches, as on compare: the quote as written and its book on the source line (owner, 2026-11-20). */
export function TanasubQuote({ link: key, palette }: { link: number; palette: Palette }) {
  const link = tanasubLink(key);
  if (!link) return null;
  const sources = sourcesOf([tanasubSource(link)]);
  return (
    <View style={{ gap: 2, paddingTop: 10 }}>
      <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'justify', writingDirection: 'rtl' }}>«{link.text}»</Text>
      <SourceLine named={sources} sources={sources} palette={palette} />
    </View>
  );
}
