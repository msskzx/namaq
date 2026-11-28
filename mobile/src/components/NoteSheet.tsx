import { useRef, useState } from 'react';
import { View } from 'react-native';
import { NotebookPen, Send, Trash2 } from 'lucide-react-native';
import { shareAyah } from './AyahShare';
import { readAyahNotes, writeAyahNote } from '@shared/ayahNotes';
import { num } from '@shared/quran/arabicNumber';
import Sheet from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { ayahText } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import IconButton from '@/ui/IconButton';
import { onLeave } from '@/lib/storage';
import { surahName } from '@shared/quran/surahNames';
import Field from '@/ui/Field';
import { useLater } from '@/lib/hooks/useLater';
import { useOnChange } from '@/lib/hooks/useOnChange';
import { useOnLeave } from '@/lib/hooks/useOnLeave';

const SAVE_MS = 400;

export default function NoteSheet({ ayah, onClose, palette }: { ayah: string | null; onClose: () => void; palette: Palette }) {
  const [text, setText] = useState('');
  const [shown, setShown] = useState(ayah);
  const pending = useRef<{ key: string; text: string } | null>(null);
  const save = useLater();
  const flush = () => { save.cancel(); if (pending.current) { writeAyahNote(pending.current.key, pending.current.text); pending.current = null; } };
  const stopLeave = useRef(() => {});
  useOnChange([], () => { stopLeave.current = onLeave(flush); });
  useOnLeave(() => { stopLeave.current(); flush(); });
  useOnChange([ayah], () => {
    flush();
    if (!ayah) return;
    setShown(ayah);
    setText(readAyahNotes()[ayah]?.text ?? '');
  });
  const [surah, number] = (shown ?? '0:0').split(':').map(Number);
  const edit = (next: string, now = false) => {
    setText(next);
    if (!shown) return;
    if (pending.current && pending.current.key !== shown) flush();
    pending.current = { key: shown, text: next };
    save.after(SAVE_MS, flush);
    if (now) flush();
  };
  return (
    <Sheet open={!!ayah} onClose={onClose} palette={palette} tall>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <NotebookPen size={18} color={palette.accent} />
          <Text style={{ flex: 1, color: palette.muted, fontSize: 15, textAlign: 'right' }}>{surahName(surah)} {num(number)}</Text>
          {!!text.trim() && (
            <IconButton Icon={Trash2} label="احذف التأمل" onPress={() => { edit('', true); onClose(); }} />
          )}
          {!!text.trim() && shown && (
            <IconButton Icon={Send} label="مشاركة" onPress={() => { flush(); onClose(); shareAyah(shown, palette, text.trim(), true); }} />
          )}
        </View>
        {shown && <AyahFlow lines={2} color={palette.muted} menu={false}><AyahWords>{ayahText(shown)}</AyahWords></AyahFlow>}
        <Field value={text} onChangeText={edit} multiline autoFocus={!!shown && !readAyahNotes()[shown]} placeholder="تأملك في هذه الآية" label="تأملك في هذه الآية" palette={palette} style={{ flex: 1 }} />
      </View>
    </Sheet>
  );
}
