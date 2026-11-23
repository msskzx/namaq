import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Gem } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import Button from '@/ui/Button';
import Chip from '@/ui/Chip';
import terms from '@shared/data/quran/balaghaTerms';
import { plainName, termNamed } from '@shared/quran/balaghaTerms';
import { isOverTabs, toTab } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import { TermQuotes } from './BalaghaTerm';
import { NoShare } from '@/ui/CardShare';

/**
 * Once a quiz question on balagha is answered, a chip for each term among its choices; a tap opens the term's definition in
 * a sheet over the quiz, so the quiz stays where it is, with a button to the term's page in «مصطلحات البلاغة». A quiz or
 * party stacked over the tabs leaves the button out, since opening a tab would close it.
 */
export default function TermChips({ names, palette }: { names: string[]; palette: Palette }) {
  const [open, setOpen] = useState<string | null>(null);
  const [kept, setKept] = useState<string | null>(null);
  if (open && open !== kept) setKept(open);
  const term = kept ? termNamed(terms, kept) : undefined;
  return (
    <>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16 }} accessibilityLabel="تعريف المصطلحات">
        {names.filter(name => termNamed(terms, name)).map(name => (
          <Chip key={name} small label={`تعريف ${plainName(name)}`} on={false} palette={palette} onPress={() => setOpen(name)} />
        ))}
      </View>
      <Sheet open={!!open} onClose={() => setOpen(null)} palette={palette}>
        {term && (
          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
            <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{plainName(term.name)}</Text>
            <NoShare.Provider value><TermQuotes term={term} palette={palette} /></NoShare.Provider>
            {!isOverTabs() && (
              <View style={{ alignItems: 'flex-start' }}>
                <Button Icon={Gem} label="أمثلته في مصطلحات البلاغة" onPress={() => { setOpen(null); toTab({ pathname: '/term', params: { name: term.name } }); }} />
              </View>
            )}
          </ScrollView>
        )}
      </Sheet>
    </>
  );
}
