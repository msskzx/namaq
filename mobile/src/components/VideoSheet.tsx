import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Sheet from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { ChevronLeft, Pause, Play, RotateCcw, Send } from 'lucide-react-native';
import LoadingDots from '@/ui/LoadingDots';
import VideoFrame, { type FrameHandle } from './VideoFrame';
import { recorderPage, type VideoInput } from '@/lib/scene';
import { fontFace, shareVideo } from '@/lib/shareVideo';
import type { Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';

type Video = { data: string; mime: string };

/** Share as video: the tree grows (or a compare card is read along) in a story frame while it is recorded, then goes to the phone's share sheet.
 *  `page` builds another recorder page from the font, in place of the tree's. A page video in parts names the `part`, and `onNext` records the next one. */
export default function VideoSheet({ input, page, onClose, palette, part, onNext }: { input?: VideoInput | null; page?: ((font: string) => string) | null; onClose: () => void; palette: Palette; part?: string; onNext?: () => void }) {
  const open = !!input || !!page;
  const [font, setFont] = useState<string | null>(null);
  const [run, setRun] = useState(0);
  const [video, setVideo] = useState<Video | null>(null);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const frame = useRef<FrameHandle>(null);
  useEffect(() => {
    if (!open) return;
    setVideo(null);
    setFailed(false);
    setPaused(false);
    fontFace().then(setFont, () => setFont(''));
  }, [input, page]); // eslint-disable-line react-hooks/exhaustive-deps
  const message = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'video') setVideo({ data: parsed.data, mime: parsed.mime });
      if (parsed.type === 'error') setFailed(true);
    } catch {}
  }, []);
  const again = () => { setVideo(null); setFailed(false); setPaused(false); setRun(value => value + 1); };
  // As on the website, the recording can be paused: the paused time is left out of the video.
  const toggle = () => { frame.current?.send({ type: paused ? 'resume' : 'pause' }); setPaused(!paused); };
  return (
    <Sheet open={open} onClose={onClose} full title={part ? `مشاركة كفيديو · ${part}` : 'مشاركة كفيديو'} palette={palette}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: palette.rule }}>
          {open && font !== null && <VideoFrame ref={frame} key={run} html={page ? page(font) : recorderPage(input!, font)} onMessage={message} />}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 64 }}>
          {failed ? <Text style={{ color: palette.accent }}>لا يمكن تسجيل الفيديو على هذا الجهاز.</Text>
            : video ? <>
              <IconButton label="إعادة" onPress={again} Icon={RotateCcw} tone="ink" />
              <IconButton Icon={Send} label="مشاركة الفيديو" onPress={() => void shareVideo(video.data, video.mime)} round big />
              {onNext && <Pressable onPress={onNext} accessibilityRole="button" accessibilityLabel="الجزء التالي"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 48, paddingHorizontal: 12, borderRadius: 24, borderWidth: 1, borderColor: palette.rule }}>
                <Text style={{ color: palette.ink, fontSize: 15 }}>الجزء التالي</Text>
                <ChevronLeft size={20} color={palette.ink} />
              </Pressable>}
            </> : <>
              {font !== null && <IconButton label={paused ? 'متابعة' : 'إيقاف مؤقت'} onPress={toggle} Icon={paused ? Play : Pause} tone="ink" />}
              <View accessibilityLabel="جارٍ تجهيز الفيديو"><LoadingDots /></View>
            </>}
        </View>
      </View>
    </Sheet>
  );
}
