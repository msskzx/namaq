import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { NotebookPen, Send, Trash2 } from 'lucide-react-native';
import { shareAyah } from './AyahShare';
import { readAyahNotes, writeAyahNote } from '@shared/ayahNotes';
import { num } from '@shared/quran/arabicNumber';
import Sheet from '@/ui/Sheet';
import { Text, TextInput } from '@/ui/Text';
import { ayahText, surahNames } from '@/lib/mushaf';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { onLeave } from '@/lib/storage';

/** How long typing rests before the note is kept, so the reader behind the sheet is not redrawn on every key. */
const SAVE_MS = 400;

/** The reader's own note on an ayah, kept on this phone. It saves while typing and on closing; emptying it or the bin removes it. */
export default function NoteSheet({ ayah, onClose, palette }: { ayah: string | null; onClose: () => void; palette: Palette }) {
  const [text, setText] = useState('');
  const [shown, setShown] = useState(ayah);
  const pending = useRef<{ key: string; text: string; timer: ReturnType<typeof setTimeout> } | null>(null);
  const flush = () => { if (pending.current) { clearTimeout(pending.current.timer); writeAyahNote(pending.current.key, pending.current.text); pending.current = null; } };
  useEffect(() => { const stop = onLeave(flush); return () => { stop(); flush(); }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    flush();
    if (!ayah) return;
    setShown(ayah);
    setText(readAyahNotes()[ayah]?.text ?? '');
  }, [ayah]);
  const [surah, number] = (shown ?? '0:0').split(':').map(Number);
  const edit = (next: string, now = false) => {
    setText(next);
    if (!shown) return;
    // A note still waiting on another ayah is saved first, not replaced.
    if (pending.current && pending.current.key !== shown) flush();
    if (pending.current) clearTimeout(pending.current.timer);
    pending.current = { key: shown, text: next, timer: setTimeout(flush, SAVE_MS) };
    if (now) flush();
  };
  return (
    <Sheet open={!!ayah} onClose={onClose} palette={palette} tall>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <NotebookPen size={18} color={palette.accent} />
          <Text style={{ flex: 1, color: palette.muted, fontSize: 15, textAlign: 'right' }}>{surahNames[surah]} {num(number)}</Text>
          {!!text.trim() && (
            <IconButton Icon={Trash2} label="احذف التأمل" onPress={() => { edit('', true); onClose(); }} />
          )}
          {!!text.trim() && shown && (
            <IconButton Icon={Send} label="مشاركة" onPress={() => { flush(); onClose(); shareAyah(shown, palette, text.trim(), true); }} />
          )}
        </View>
        {shown && <Text numberOfLines={2} style={{ color: palette.muted, fontFamily: QURAN_FONT, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{ayahText(shown)}</Text>}
        <TextInput value={text} onChangeText={edit} multiline autoFocus={!!shown && !readAyahNotes()[shown]} placeholder="تأملك في هذه الآية" placeholderTextColor={palette.muted} accessibilityLabel="تأملك في هذه الآية"
          style={{ flex: 1, minHeight: 140, borderWidth: 1, borderColor: palette.rule, borderRadius: 12, padding: 12, color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right', textAlignVertical: 'top', backgroundColor: palette.card }} />
      </View>
    </Sheet>
  );
}
