import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Image, Platform, Share, View, useWindowDimensions } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { Clapperboard, Link, ListVideo, Send } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Logo from './Logo';
import LoadingDots from '@/ui/LoadingDots';
import Sheet, { CLOSE_MS } from '@/ui/Sheet';
import { MODAL_GAP, closeShare, useShareRequest } from '@/lib/shareImage';
import { CAPTURE_RESULT, shareImageFile } from '@/lib/shareFile';
import { UI_FONT_BOLD, usePalette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';

type Shot = { uri: string; width: number; height: number };

/** The widest the image is drawn; the phone's pixel density makes it about 1080 pixels wide. */
const FRAME = 360;

/** The card drawn for the image, shrunk to the image's width when it is wider (a big tree). */
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

/**
 * Share as image: the card on the page colour, with the logo and the name under it. The image is drawn once out of sight
 * (behind the preview, never in a scroll view, so nothing of it is cut), captured, and the preview shows that very file.
 * The big button shares it; beside it the card's video (where it has one), the whole page's video (compare) and its link.
 */
export default function ShareSheet() {
  const request = useShareRequest();
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const frame = useRef<ComponentRef<typeof View>>(null);
  const [drawn, setDrawn] = useState(false);
  const [shot, setShot] = useState<Shot | null>(null);
  const [failed, setFailed] = useState(false);
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => { setShot(null); setFailed(false); setDrawn(false); }, [request]);
  useEffect(() => {
    if (!drawn) return;
    let live = true;
    // A moment after layout, so the fonts and the shrunk tree are on screen before the capture.
    const timer = setTimeout(() => {
      if (!frame.current) return;
      captureRef(frame.current, { format: 'png', result: CAPTURE_RESULT })
        .then(uri => new Promise<Shot>((resolve, reject) => Image.getSize(uri, (w, h) => resolve({ uri, width: w, height: h }), reject)))
        .then(next => { if (live) setShot(next); }, () => { if (live) setFailed(true); });
    }, 120);
    return () => { live = false; clearTimeout(timer); };
  }, [drawn]);
  const frameWidth = Math.min(FRAME, width - 24);
  const cardWidth = frameWidth - 32;
  // The preview fits the whole image in the box.
  const fit = shot && box ? Math.min(box.width / shot.width, box.height / shot.height, frameWidth / shot.width) : 0;
  // Another sheet can open only once this one has gone: on iOS when it says so (onDismiss), elsewhere after a wait.
  const pending = useRef<(() => void) | null>(null);
  const video = (onVideo?: () => void) => {
    closeShare();
    if (!onVideo) return;
    if (Platform.OS === 'ios') pending.current = onVideo;
    else setTimeout(onVideo, MODAL_GAP + CLOSE_MS);
  };
  const dismissed = () => { const next = pending.current; pending.current = null; next?.(); };
  const link = () => { if (request?.link) void Share.share({ message: request.link }); };
  return (
    <Sheet open={!!request} onClose={closeShare} onDismiss={dismissed} full title="مشاركة" palette={palette}>
      <View style={{ flex: 1 }}>
        {request && !shot && !failed && (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <View ref={frame} collapsable={false} style={{ width: frameWidth, backgroundColor: palette.paper, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, gap: 10, direction: 'rtl' }}>
              <Fit width={cardWidth} onReady={() => setDrawn(true)}>{request.content(cardWidth)}</Fit>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Logo size={26} />
                <Text style={{ color: palette.ink, fontSize: 19, fontFamily: UI_FONT_BOLD, lineHeight: 30 }}>نمق</Text>
              </View>
            </View>
          </View>
        )}
        <View onLayout={event => setBox({ width: event.nativeEvent.layout.width - 24, height: event.nativeEvent.layout.height - 24 })}
          style={{ flex: 1, marginHorizontal: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paperDeep, alignItems: 'center', justifyContent: 'center' }}>
          {shot && fit ? <Image source={{ uri: shot.uri }} accessibilityLabel="الصورة" style={{ width: shot.width * fit, height: shot.height * fit }} />
            : failed ? <Text style={{ color: palette.accent }}>تعذّر تجهيز الصورة.</Text>
            : <View accessibilityLabel="جارٍ تجهيز الصورة"><LoadingDots /></View>}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 72, backgroundColor: palette.paper }}>
          <IconButton Icon={Send} label="مشاركة كصورة" onPress={() => shot && void shareImageFile(shot.uri)} round big disabled={!shot} />
          {request?.onVideo && <IconButton label="مشاركة كفيديو" onPress={() => video(request.onVideo)} Icon={Clapperboard} tone="ink" />}
          {request?.onPageVideo && <IconButton label="مشاركة الصفحة كفيديو" onPress={() => video(request.onPageVideo)} Icon={ListVideo} tone="ink" />}
          {request?.link && <IconButton label="مشاركة الرابط" onPress={link} Icon={Link} tone="ink" />}
        </View>
      </View>
    </Sheet>
  );
}
