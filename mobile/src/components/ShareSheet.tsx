import { useCallback, useMemo, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Image, Platform, ScrollView, Share, View } from 'react-native';
import { usePageWidth } from '@/ui/column';
import { captureRef } from 'react-native-view-shot';
import { Clapperboard, ImageDown, Link, ListVideo, Send } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import LoadingDots from '@/ui/LoadingDots';
import Sheet, { CLOSE_MS } from '@/ui/Sheet';
import { MODAL_GAP, closeShare, useShareRequest } from '@/lib/shareImage';
import { CAPTURE_RESULT, saveImageFiles, shareImageFile } from '@/lib/shareFile';
import SharePages, { ShareBrand, type Shot } from './SharePages';
import { num } from '@shared/quran/arabicNumber';
import { usePalette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { useLater } from '@/lib/hooks/useLater';
import { useOnChange } from '@/lib/hooks/useOnChange';
import { useLatestRun } from '@/lib/hooks/useLatestRun';
import StepDots from '@/ui/StepDots';

const FRAME = 360;
const PAGED_FRAME = 440;

function Fit({ width, children, onReady }: { width: number; children: ReactNode; onReady: () => void }) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const scale = size ? Math.min(1, width / size.width) : 1;
  return (
    <View collapsable={false} style={{ width, height: size ? size.height * scale : 1, overflow: 'hidden', direction: 'ltr' }}>
      <View style={{ position: 'absolute', top: 0, left: size ? (width - size.width * scale) / 2 : 0, width: 20000, alignItems: 'flex-start', transformOrigin: 'left top', transform: [{ scale }] }}>
        <View collapsable={false} onLayout={event => { const { width: w, height: h } = event.nativeEvent.layout; if (w && h) { setSize({ width: w, height: h }); onReady(); } }}>
          <View style={{ direction: 'rtl' }}>{children}</View>
        </View>
      </View>
    </View>
  );
}

export default function ShareSheet() {
  const request = useShareRequest();
  const palette = usePalette();
  const width = usePageWidth();
  const frame = useRef<ComponentRef<typeof View>>(null);
  const [drawn, setDrawn] = useState(false);
  const [shot, setShot] = useState<Shot | null>(null);
  const [failed, setFailed] = useState(false);
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);
  const [shots, setShots] = useState<Shot[] | null>(null);
  const [shown, setShown] = useState(0);
  const pager = useRef<ComponentRef<typeof ScrollView>>(null);
  const [saved, setSaved] = useState<'saving' | 'saved' | 'denied' | 'failed' | null>(null);
  const [pageWidth, setPageWidth] = useState(0);
  useOnChange([request], () => { setShot(null); setShots(null); setShown(0); setSaved(null); setFailed(false); setDrawn(false); });
  const gotShots = useCallback((next: Shot[]) => { setShots(next); setShot(next[0]); }, []);
  const failedShots = useCallback(() => setFailed(true), []);
  const capture = useLater();
  const begin = useLatestRun();
  useOnChange([drawn], () => {
    const live = begin();
    if (!drawn) { capture.cancel(); return; }
    capture.after(120, () => {
      if (!frame.current) return;
      captureRef(frame.current, { format: 'png', result: CAPTURE_RESULT })
        .then(uri => new Promise<Shot>((resolve, reject) => Image.getSize(uri, (w, h) => resolve({ uri, width: w, height: h }), reject)))
        .then(next => { if (live()) setShot(next); }, () => { if (live()) setFailed(true); });
    });
  });
  const frameWidth = request?.paged ? PAGED_FRAME : Math.min(FRAME, width - 24);
  const cardWidth = frameWidth - 32;
  const fit = shot && box ? Math.min(box.width / shot.width, box.height / shot.height, frameWidth / shot.width) : 0;
  const pending = useRef<(() => void) | null>(null);
  const afterClose = useLater();
  const video = (onVideo?: () => void) => {
    closeShare();
    if (!onVideo) return;
    if (Platform.OS === 'ios') pending.current = onVideo;
    else afterClose.after(MODAL_GAP + CLOSE_MS, onVideo);
  };
  const dismissed = () => { const next = pending.current; pending.current = null; next?.(); };
  const link = () => { if (request?.link) void Share.share({ message: request.link }); };
  const paged = request?.paged;
  const pictures = useMemo(() => paged?.(cardWidth), [paged, cardWidth]);
  const shownShot = shots ? shots[shown] : shot;
  const saveAll = () => {
    if (!shots || saved === 'saving') return;
    setSaved('saving');
    void saveImageFiles(shots.map(each => each.uri)).then(ok => setSaved(ok ? 'saved' : 'denied'), () => setSaved('failed'));
  };
  return (
    <Sheet open={!!request} onClose={closeShare} onDismiss={dismissed} full title="مشاركة" palette={palette}>
      <View style={{ flex: 1 }}>
        {pictures && !shots && !failed && (
          <SharePages paged={pictures} width={frameWidth} palette={palette} onShots={gotShots} onFail={failedShots} />
        )}
        {request && !paged && !shot && !failed && (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <View ref={frame} collapsable={false} style={{ width: frameWidth, backgroundColor: palette.paper, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, gap: 10, direction: 'rtl' }}>
              <Fit width={cardWidth} onReady={() => setDrawn(true)}>{request.content(cardWidth)}</Fit>
              <ShareBrand palette={palette} />
            </View>
          </View>
        )}
        <View onLayout={event => setBox({ width: event.nativeEvent.layout.width - 24, height: event.nativeEvent.layout.height - 24 })}
          style={{ flex: 1, marginHorizontal: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paperDeep, alignItems: 'center', justifyContent: 'center' }}>
          {shots && fit && box ? (
            <ScrollView ref={pager} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ alignSelf: 'stretch', direction: 'ltr' }}
              onLayout={event => setPageWidth(event.nativeEvent.layout.width)} scrollEventThrottle={32}
              onScroll={event => { if (pageWidth) setShown(Math.round(event.nativeEvent.contentOffset.x / pageWidth)); }}>
              {shots.map((each, i) => (
                <View key={each.uri} style={{ width: pageWidth || box.width, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={{ uri: each.uri }} accessibilityLabel={`الصورة ${num(i + 1)} من ${num(shots.length)}`} style={{ width: each.width * fit, height: each.height * fit }} />
                </View>
              ))}
            </ScrollView>
          ) : shot && fit ? <Image source={{ uri: shot.uri }} accessibilityLabel="الصورة" style={{ width: shot.width * fit, height: shot.height * fit }} />
            : failed ? <Text style={{ color: palette.accent }}>تعذّر تجهيز الصورة.</Text>
            : <LoadingDots label="جارٍ تجهيز الصورة" />}
        </View>
        {shots && shots.length > 1 ? (
          <View style={{ direction: 'ltr' }}><StepDots names={shots.map((_, i) => `الصورة ${num(i + 1)}`)} at={shown} palette={palette}
            onPick={i => { setShown(i); pager.current?.scrollTo({ x: i * pageWidth, animated: true }); }} /></View>
        ) : null}
        {saved ? (
          <Text accessibilityLiveRegion="polite" style={{ color: saved === 'saved' || saved === 'saving' ? palette.muted : palette.accent, fontSize: 15, textAlign: 'center', paddingTop: 8 }}>
            {saved === 'saving' ? 'جارٍ حفظ الصور' : saved === 'saved' ? `حُفظت الصور في الجهاز (${num(shots?.length ?? 0)})` : saved === 'denied' ? 'لم يُسمح بحفظ الصور.' : 'تعذّر حفظ الصور.'}
          </Text>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 72, backgroundColor: palette.paper }}>
          <IconButton Icon={Send} label={shots ? 'مشاركة هذه الصورة' : 'مشاركة كصورة'} onPress={() => shownShot && void shareImageFile(shownShot.uri)} round big disabled={!shownShot} />
          {paged && <IconButton Icon={ImageDown} label="احفظ الصور في الجهاز" onPress={saveAll} tone="ink" disabled={!shots || saved === 'saving'} />}
          {request?.onVideo && <IconButton label="مشاركة كفيديو" onPress={() => video(request.onVideo)} Icon={Clapperboard} tone="ink" />}
          {request?.onPageVideo && <IconButton label="مشاركة الصفحة كفيديو" onPress={() => video(request.onPageVideo)} Icon={ListVideo} tone="ink" />}
          {request?.link && <IconButton label="مشاركة الرابط" onPress={link} Icon={Link} tone="ink" />}
        </View>
      </View>
    </Sheet>
  );
}
