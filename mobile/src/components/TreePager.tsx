import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Bookmark, Share2 } from 'lucide-react-native';
import { router } from 'expo-router';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { branchesHref } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import TreeCard, { type Lane } from './TreeCard';
import { isSaved, toggleSaved, WEBSITE } from '@/lib/branches';
import type { Camera, Size } from '@/lib/camera';
import { readJson, writeJson } from '@/lib/storage';
import type { Palette } from '@/lib/theme';

const PLACE = 'branches-place';
type Place = { id: string; camera?: Camera };

/** A second tap within this time is a double tap: it saves the tree instead of opening the ayat. */
const DOUBLE_TAP = 280;
const SWIPE = 0.2;
const FLICK = 500;

function useSaved(piece: BranchPiece) {
  return isSaved(piece, useSyncExternalStore(subscribeBookmarks, readBookmarks));
}

function Actions({ piece, palette, position, total, pop }: { piece: BranchPiece; palette: Palette; position: number; total: number; pop: number }) {
  const saved = useSaved(piece);
  const scale = useSharedValue(1);
  useEffect(() => {
    if (pop) scale.value = withSequence(withTiming(1.35, { duration: 120 }), withTiming(1, { duration: 160 }));
  }, [pop, scale]);
  const popped = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const save = () => toggleSaved(piece);
  const share = () => void Share.share({ message: `${piece.text}\n${WEBSITE}${branchesHref(piece.id)}` });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 }}>
      <Pressable onPress={save} hitSlop={8} accessibilityRole="button" accessibilityLabel={saved ? 'إزالة من المحفوظات' : 'حفظ الشجرة'} style={{ padding: 8 }}>
        <Animated.View style={popped}><Bookmark size={26} color={saved ? palette.accent : palette.ink} fill={saved ? palette.accent : 'transparent'} /></Animated.View>
      </Pressable>
      <Pressable onPress={share} hitSlop={8} accessibilityRole="button" accessibilityLabel="مشاركة" style={{ padding: 8 }}>
        <Share2 size={24} color={palette.ink} />
      </Pressable>
      <Text style={{ marginStart: 'auto', color: palette.muted, fontSize: 13 }}>{num(position)} / {num(total)}</Text>
    </View>
  );
}

/** The branches trees as a row of cards: the neighbour follows the finger, the place and zoom are kept for next time. */
export default function TreePager({ pieces, palette }: { pieces: BranchPiece[]; palette: Palette }) {
  const place = useMemo(() => readJson<Place>(PLACE), []);
  const first = Math.max(0, pieces.findIndex(piece => piece.id === place?.id));
  const [index, setIndex] = useState(first);
  const [view, setView] = useState<Size | null>(null);
  const [pop, setPop] = useState(0);
  const offset = useSharedValue(0);
  const lastTap = useRef(0);
  const moved = useRef(0);
  const move = useCallback(() => { moved.current = Date.now(); }, []);
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const width = view?.width ?? 0;

  useEffect(() => { if (width) offset.value = index * width; }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  const arrive = useCallback((next: number) => {
    setIndex(next);
    writeJson(PLACE, { id: pieces[next].id });
  }, [pieces]);

  const remember = useCallback((camera: Camera) => writeJson(PLACE, { id: pieces[index].id, camera }), [pieces, index]);

  const count = pieces.length;
  const settle = (dx: number, velocity: number) => {
    'worklet';
    const far = Math.abs(dx) > width * SWIPE || Math.abs(velocity) > FLICK;
    const forward = dx > 0;
    const target = far && (forward ? index + 1 < count : index > 0) ? index + (forward ? 1 : -1) : index;
    offset.value = withTiming(target * width, { duration: 250 }, done => {
      if (done && target !== index) scheduleOnRN(arrive, target);
    });
  };
  const lane: Lane = { offset, width, index, count, settle };

  const tap = useCallback((ayahKeys: string[] | null) => {
    const now = Date.now();
    if (now - moved.current < 350) return;
    clearTimeout(pending.current);
    if (now - lastTap.current < DOUBLE_TAP) {
      lastTap.current = 0;
      if (!isSaved(pieces[index])) toggleSaved(pieces[index]);
      setPop(value => value + 1);
      return;
    }
    lastTap.current = now;
    if (ayahKeys) pending.current = setTimeout(() => router.push({ pathname: '/ayah', params: { keys: ayahKeys.join(',') } }), DOUBLE_TAP);
  }, [pieces, index]);

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const shown = [index - 1, index, index + 1].filter(at => at >= 0 && at < count);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, overflow: 'hidden' }} onLayout={event => setView({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
        {view && <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: view.width, height: view.height, direction: 'ltr' }, track]}>
          {shown.map(at => (
            <View key={pieces[at].id} style={{ position: 'absolute', top: 0, left: -at * view.width, width: view.width, height: view.height, backgroundColor: palette.paper }}>
              <TreeCard piece={pieces[at]} palette={palette} view={view} lane={lane}
                initialCamera={at === first && pieces[at].id === place?.id ? place?.camera : undefined}
                onCamera={at === index ? remember : undefined} onTap={tap} onMove={move} />
            </View>
          ))}
        </Animated.View>}
      </View>
      <View style={{ borderTopWidth: 1, borderColor: palette.rule }}>
        <Actions piece={pieces[index]} palette={palette} position={index + 1} total={count} pop={pop} />
      </View>
    </View>
  );
}
