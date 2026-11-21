import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Image, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { sharePages } from '@shared/sharePages';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Logo from './Logo';
import { CAPTURE_RESULT } from '@/lib/shareFile';
import { UI_FONT_BOLD, type Palette } from '@/lib/theme';
import type { SharePaged } from '@/lib/shareImage';

export type Shot = { uri: string; width: number; height: number };

const PAD = 16;
const TOP = 20;
const BOTTOM = 12;
/** The row at every picture's foot: the logo and «نمق», and «١ من ٤». */
const FOOT = 30;
const GAP = 10;

/** The source under the last picture's blocks, a hairline above it (owner, 2026-11-21: the only line in the pictures). */
function Foot({ children, palette }: { children: React.ReactNode; palette: Palette }) {
  return <View style={{ borderTopWidth: 1, borderTopColor: palette.rule, paddingTop: 6 }}>{children}</View>;
}

/**
 * A long drawing as equal 4:5 pictures (owner, 2026-11-21: Instagram wants every picture of a post the same size): no card
 * frame, the head on the first only, the blocks flowing and evened out (shared/sharePages.ts), the tail together on the
 * last with the source under it, and on every picture's foot the logo with «نمق» and its number. Each block is measured
 * out of sight first, then the pictures are drawn there and captured one by one; `onShots` gets them in order.
 */
export default function SharePages({ paged, width, palette, onShots, onFail }: { paged: SharePaged; width: number; palette: Palette;
  onShots: (shots: Shot[]) => void; onFail: () => void }) {
  const height = Math.round((width * 5) / 4);
  const inner = width - PAD * 2;
  const count = paged.blocks.length;
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const measured = (key: string) => (event: { nativeEvent: { layout: { height: number } } }) => {
    const h = event.nativeEvent.layout.height;
    setSizes(now => (now[key] === h ? now : { ...now, [key]: h }));
  };
  const ready = sizes.head !== undefined && (!paged.foot || sizes.foot !== undefined) && paged.blocks.every((_, i) => sizes[i] !== undefined);
  const pages = useMemo(() => {
    if (!ready) return null;
    const room = height - TOP - BOTTOM - FOOT - GAP;
    return sharePages({ heights: paged.blocks.map((_, i) => sizes[i]), room, firstRoom: room - sizes.head - GAP, gap: GAP,
      tailFrom: paged.tailFrom, foot: paged.foot ? sizes.foot + GAP : 0 });
  }, [ready, sizes, height, paged]);
  const refs = useRef<(ComponentRef<typeof View> | null)[]>([]);
  useEffect(() => {
    if (!pages) return;
    let live = true;
    // A moment after layout, so the fonts are on screen before the captures.
    const timer = setTimeout(() => {
      void (async () => {
        const shots: Shot[] = [];
        for (const page of refs.current.slice(0, pages.length)) {
          if (!page) throw new Error('page not drawn');
          const uri = await captureRef(page, { format: 'png', result: CAPTURE_RESULT });
          shots.push(await new Promise<Shot>((resolve, reject) => Image.getSize(uri, (w, h) => resolve({ uri, width: w, height: h }), reject)));
        }
        if (live) onShots(shots);
      })().catch(() => { if (live) onFail(); });
    }, 150);
    return () => { live = false; clearTimeout(timer); };
  }, [pages, onShots, onFail]);
  const total = pages?.length ?? 0;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
      {!pages ? (
        <View style={{ width: inner, gap: 0, direction: 'rtl' }}>
          <View collapsable={false} onLayout={measured('head')}>{paged.head}</View>
          {paged.blocks.map((block, i) => <View key={i} collapsable={false} onLayout={measured(String(i))}>{block}</View>)}
          {paged.foot ? <View collapsable={false} onLayout={measured('foot')}><Foot palette={palette}>{paged.foot}</Foot></View> : null}
        </View>
      ) : pages.map((page, p) => (
        <View key={p} ref={view => { refs.current[p] = view; }} collapsable={false}
          style={{ position: 'absolute', top: 0, left: 0, width, height, backgroundColor: palette.paper, paddingHorizontal: PAD, paddingTop: TOP, paddingBottom: BOTTOM, gap: GAP, direction: 'rtl' }}>
          <View style={{ flex: 1, gap: GAP }}>
            {p === 0 ? paged.head : null}
            {page.map(i => <View key={i}>{paged.blocks[i]}</View>)}
            {p === total - 1 && paged.foot ? <><View style={{ flex: 1 }} /><Foot palette={palette}>{paged.foot}</Foot></> : null}
          </View>
          <View style={{ height: FOOT, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Logo size={22} />
              <Text style={{ color: palette.ink, fontSize: 17, fontFamily: UI_FONT_BOLD, lineHeight: 28 }}>نمق</Text>
            </View>
            <Text style={{ color: palette.muted, fontSize: 14 }}>{`${num(p + 1)} من ${num(total)}`}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
