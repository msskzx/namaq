import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Image, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { sharePages } from '@shared/sharePages';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Logo from './Logo';
import { CAPTURE_RESULT } from '@/lib/shareFile';
import { UI_FONT_BOLD, type Palette } from '@/lib/theme';
import type { SharePaged } from '@/lib/shareImage';
import { useLater } from '@/lib/hooks/useLater';
import { useOnChange } from '@/lib/hooks/useOnChange';
import { useLatestRun } from '@/lib/hooks/useLatestRun';

export type Shot = { uri: string; width: number; height: number };

const PAD = 16;
const TOP = 20;
const BOTTOM = 12;
const FOOT = 30;
const GAP = 10;

export function ShareBrand({ small, palette }: { small?: boolean; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Logo size={small ? 22 : 26} palette={palette} />
      <Text style={{ color: palette.ink, fontSize: small ? 17 : 19, fontFamily: UI_FONT_BOLD, lineHeight: small ? 28 : 30 }}>نمق</Text>
    </View>
  );
}

function Foot({ children, palette }: { children: React.ReactNode; palette: Palette }) {
  return <View style={{ borderTopWidth: 1, borderTopColor: palette.rule, paddingTop: 6 }}>{children}</View>;
}

export default function SharePages({ paged, width, palette, onShots, onFail }: { paged: SharePaged; width: number; palette: Palette;
  onShots: (shots: Shot[]) => void; onFail: () => void }) {
  const height = Math.round((width * 5) / 4);
  const inner = width - PAD * 2;
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const measured = (key: string) => (event: { nativeEvent: { layout: { height: number } } }) => {
    const h = event.nativeEvent.layout.height;
    setSizes(now => (now[key] === h ? now : { ...now, [key]: h }));
  };
  const drawn = paged.pictures;
  const ready = sizes.head !== undefined && (!paged.foot || sizes.foot !== undefined) && paged.blocks.every((_, i) => sizes[i] !== undefined);
  const pages = useMemo(() => {
    if (!ready) return null;
    const room = height - TOP - BOTTOM - FOOT - GAP;
    return sharePages({ heights: paged.blocks.map((_, i) => sizes[i]), room, firstRoom: room - sizes.head - GAP, gap: GAP,
      tailFrom: paged.tailFrom, foot: paged.foot ? sizes.foot + GAP : 0 });
  }, [ready, sizes, height, paged]);
  const refs = useRef<(ComponentRef<typeof View> | null)[]>([]);
  const pictureCount = drawn ? drawn.length : pages?.length;
  const capture = useLater();
  const begin = useLatestRun();
  useOnChange([pictureCount, onShots, onFail], () => {
    const live = begin();
    if (!pictureCount) { capture.cancel(); return; }
    capture.after(150, () => {
      void (async () => {
        const shots: Shot[] = [];
        for (const page of refs.current.slice(0, pictureCount)) {
          if (!page) throw new Error('page not drawn');
          const uri = await captureRef(page, { format: 'png', result: CAPTURE_RESULT });
          shots.push(await new Promise<Shot>((resolve, reject) => Image.getSize(uri, (w, h) => resolve({ uri, width: w, height: h }), reject)));
        }
        if (live()) onShots(shots);
      })().catch(() => { if (live()) onFail(); });
    });
  });
  const total = pages?.length ?? 0;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
      {drawn ? drawn.map((picture, p) => (
        <View key={p} ref={view => { refs.current[p] = view; }} collapsable={false} style={{ position: 'absolute', top: 0, left: 0, width, height }}>{picture}</View>
      )) : !pages ? (
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
            {p === total - 1 && paged.foot ? <View style={{ marginTop: 'auto' }}><Foot palette={palette}>{paged.foot}</Foot></View> : null}
          </View>
          <View style={{ height: FOOT, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ShareBrand small palette={palette} />
            <Text style={{ color: palette.muted, fontSize: 14 }}>{`${num(p + 1)} من ${num(total)}`}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
