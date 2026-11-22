import { useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useGlobalSearchParams, usePathname } from 'expo-router';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayahBookmarkId, ayahHref, readDueMarks, subscribeDueMarks, toggleForgotten } from '@shared/ayahMarks';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { sectionAt, surahTopicsOf } from '@shared/quran/surahTopics';
import { ayahText } from '@/lib/mushaf';
import { openAyahPage, openIntent } from '@/lib/ways';
import { usePalette } from '@/lib/theme';
import FloatingMenu, { type MenuAt } from '@/ui/FloatingMenu';
import { ayahMenuGroups, useAyahMenuFacts } from './AyahMenu';
import { AyahMenuContext, type OpenAyahMenu } from '@/ui/ayahMenuContext';
import AyahPreviewSheet, { type Preview } from './AyahPreviewSheet';
import BalaghaSheet from './BalaghaSheet';
import NoteSheet from './NoteSheet';
import TopicSheet, { type TopicOpen } from './TopicSheet';
import { shareAyah } from './AyahShare';

/**
 * The reader's long-press menu for every ayah drawn off the mushaf (owner, 2026-11-22; ayah-page/agreed.md part 4): an
 * ayah view (AyahFlow, AyahLines) opens it here, once for the app, with the ayah's page and the mushaf first. A view of
 * several ayat (an oath, a story's place) opens it on the first, with a row of the ayat to pick the one meant. Its sheets
 * open over the page the ayah is on.
 */
export default function AyahMenuHost({ children }: { children: ReactNode }) {
  const palette = usePalette();
  const [menu, setMenu] = useState<{ keys: readonly string[]; key: string; at: MenuAt } | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [balagha, setBalagha] = useState<string | null>(null);
  const [noting, setNoting] = useState<string | null>(null);
  const [topic, setTopic] = useState<TopicOpen | null>(null);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const facts = useAyahMenuFacts(menu?.key);
  const open = useMemo<OpenAyahMenu>(() => (keys, at) => setMenu({ keys, key: keys[0], at }), []);
  const key = menu?.key ?? '';
  const [surah, ayah] = key.split(':').map(Number);
  const close = () => setMenu(null);
  // On the ayah's own page, «صفحة الآية» would open it again.
  const path = usePathname();
  const params = useGlobalSearchParams<{ key?: string }>();
  const onItsPage = path === '/ayah' && params.key === key;
  // Each button closes the menu, then does its thing for this ayah.
  const then = (act: (key: string) => void) => () => { close(); act(key); };
  return (
    <AyahMenuContext.Provider value={open}>
      {children}
      {menu && (
        <FloatingMenu overlay at={menu.at} label={`الآية ${num(ayah)} من السورة ${num(surah)}`} onClose={close} palette={palette}
          groups={ayahMenuGroups(facts, {
            ayat: menu.keys.length > 1 ? { keys: menu.keys, picked: key, onPick: picked => setMenu({ ...menu, key: picked }) } : undefined,
            page: onItsPage ? undefined : then(openAyahPage),
            mushaf: then(at => openIntent({ tab: 'read', at })),
            recite: then(at => openIntent({ tab: 'read', at, recite: true })),
            forgot: { on: !!due[key], onPress: () => toggleForgotten(key) },
            save: { on: bookmarks.some(item => item.id === ayahBookmarkId(key)), onPress: then(at => toggleBookmark({ id: ayahBookmarkId(at), text: ayahText(at), href: ayahHref(at) })) },
            note: { on: !!notes[key], onPress: then(setNoting) },
            tafsir: then(at => setPreview({ kind: 'tafsir', key: at })),
            balagha: then(setBalagha),
            readings: then(at => setPreview({ kind: 'readings', key: at })),
            trees: then(at => setPreview({ kind: 'trees', key: at })),
            compare: then(at => setPreview({ kind: 'compare', key: at })),
            topics: surahTopicsOf(surah) ? then(() => setTopic({ surah, section: Math.max(0, sectionAt(surah, ayah)) })) : undefined,
            copy: then(at => void Clipboard.setStringAsync(`«${ayahText(at)}»\n${surahName(surah)} ${num(ayah)}`)),
            share: then(at => shareAyah(at, palette, notes[at]?.text)),
          }, palette)} />
      )}
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} palette={palette} />
      <BalaghaSheet ayah={balagha} onClose={() => setBalagha(null)} palette={palette} />
      <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
      <TopicSheet open={topic} onClose={() => setTopic(null)} onJump={(s, a) => openIntent({ tab: 'read', at: `${s}:${a}` })} palette={palette} />
    </AyahMenuContext.Provider>
  );
}
