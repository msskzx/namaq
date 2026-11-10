import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RotateCcw, Send, X } from 'lucide-react-native';
import LoadingDots from './LoadingDots';
import VideoFrame from './VideoFrame';
import { IconButton } from './Studio';
import { recorderPage, type VideoInput } from '@/lib/scene';
import { fontFace, shareVideo } from '@/lib/shareVideo';
import type { Palette } from '@/lib/theme';

type Video = { data: string; mime: string };

/** Share as video: the tree grows (or a compare card is read along) in a story frame while it is recorded, then goes to the phone's share sheet.
 *  `page` builds another recorder page from the font, in place of the tree's. */
export default function VideoSheet({ input, page, onClose, palette }: { input?: VideoInput | null; page?: ((font: string) => string) | null; onClose: () => void; palette: Palette }) {
  const open = !!input || !!page;
  const insets = useSafeAreaInsets();
  const [font, setFont] = useState<string | null>(null);
  const [run, setRun] = useState(0);
  const [video, setVideo] = useState<Video | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!open) return;
    setVideo(null);
    setFailed(false);
    fontFace().then(setFont, () => setFont(''));
  }, [input, page]); // eslint-disable-line react-hooks/exhaustive-deps
  const message = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'video') setVideo({ data: parsed.data, mime: parsed.mime });
      if (parsed.type === 'error') setFailed(true);
    } catch {}
  }, []);
  const again = () => { setVideo(null); setFailed(false); setRun(value => value + 1); };
  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: palette.paper, paddingTop: insets.top, paddingBottom: insets.bottom + 8, direction: 'rtl' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, height: 52 }}>
          <Text style={{ flex: 1, color: palette.ink, fontSize: 16, fontWeight: '600', paddingHorizontal: 8 }}>مشاركة كفيديو</Text>
          <IconButton label="إغلاق" onPress={onClose} Icon={X} color={palette.ink} />
        </View>
        <View style={{ flex: 1, marginHorizontal: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: palette.rule }}>
          {open && font !== null && <VideoFrame key={run} html={page ? page(font) : recorderPage(input!, font)} onMessage={message} />}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 64 }}>
          {failed ? <Text style={{ color: palette.accent }}>لا يمكن تسجيل الفيديو على هذا الجهاز.</Text>
            : video ? <>
              <IconButton label="إعادة" onPress={again} Icon={RotateCcw} color={palette.ink} />
              <Pressable onPress={() => void shareVideo(video.data, video.mime)} accessibilityRole="button" accessibilityLabel="مشاركة الفيديو"
                style={{ width: 56, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent }}>
                <Send size={24} color={palette.onAccent} />
              </Pressable>
            </> : <View accessibilityLabel="جارٍ تجهيز الفيديو"><LoadingDots /></View>}
        </View>
      </View>
    </Modal>
  );
}
