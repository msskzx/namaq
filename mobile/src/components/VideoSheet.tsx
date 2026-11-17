import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Sheet from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { ChevronLeft, Pause, Play, RotateCcw, Send } from 'lucide-react-native';
import LoadingDots from '@/ui/LoadingDots';
import VideoFrame, { type FrameHandle } from './VideoFrame';
import { readRecorderMessage, recorderPage, type VideoInput } from '@/lib/scene';
import { fontFace, shareVideo } from '@/lib/shareVideo';
import type { Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';

type Video = { data: string; mime: string };

/** Share as video: the tree grows (or a compare card is read along) in a story frame while it is recorded, then goes to the phone's share sheet.
 *  `page` builds another recorder page from the font, in place of the tree's. A page video in parts names the `part`, and `onNext` records the next one. */
export default function VideoSheet({ input, page, onClose, palette, part, onNext }: { input?: VideoInput | null; page?: ((font: string) => string) | null; onClose: () => void; palette: Palette; part?: string; onNext?: () => void }) {
  const open = !!input || !!page;
  const [font, setFont] = useState<string | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const [sharing, setSharing] = useState(false);
  const frame = useRef<FrameHandle>(null);
  // Each recording is one request: a font, a recorder's message or a share that finishes after the input changed,
  // the sheet closed or the video was made again belongs to an older one and is let go.
  const request = useRef(0);
  const [own, setOwn] = useState(0);
  const begin = () => { request.current++; setOwn(request.current); return request.current; };
  useEffect(() => {
    const own = begin();
    setVideo(null);
    setFailed(false);
    setPaused(false);
    setShareFailed(false);
    setFont(null);
    if (!open) return;
    fontFace().then(face => { if (request.current === own) setFont(face); }, () => { if (request.current === own) setFont(''); });
  }, [input, page, open]); // eslint-disable-line react-hooks/exhaustive-deps
  const message = useCallback((own: number, data: string) => {
    if (request.current !== own) return;
    const said = readRecorderMessage(data);
    if (said?.type === 'video') setVideo({ data: said.data, mime: said.mime });
    if (said?.type === 'error') setFailed(true);
  }, []);
  const again = () => { begin(); setVideo(null); setFailed(false); setPaused(false); setShareFailed(false); };
  const share = (made: Video) => {
    setSharing(true);
    setShareFailed(false);
    shareVideo(made.data, made.mime).catch(() => { if (request.current === own) setShareFailed(true); }).finally(() => setSharing(false));
  };
  // As on the website, the recording can be paused: the paused time is left out of the video.
  const toggle = () => { frame.current?.send({ type: paused ? 'resume' : 'pause' }); setPaused(!paused); };
  return (
    <Sheet open={open} onClose={onClose} full title={part ? `مشاركة كفيديو · ${part}` : 'مشاركة كفيديو'} palette={palette}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: palette.rule }}>
          {open && font !== null && <VideoFrame ref={frame} key={own} html={page ? page(font) : recorderPage(input!, font)} onMessage={data => message(own, data)} />}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 64 }}>
          {failed ? <Text style={{ color: palette.accent }}>لا يمكن تسجيل الفيديو على هذا الجهاز.</Text>
            : video ? <>
              <IconButton label="إعادة" onPress={again} Icon={RotateCcw} tone="ink" />
              <IconButton Icon={Send} label="مشاركة الفيديو" onPress={() => { if (!sharing) share(video); }} round big />
              {onNext && <Pressable onPress={onNext} accessibilityRole="button" accessibilityLabel="الجزء التالي"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 48, paddingHorizontal: 12, borderRadius: 24, borderWidth: 1, borderColor: palette.rule }}>
                <Text style={{ color: palette.ink, fontSize: 15 }}>الجزء التالي</Text>
                <ChevronLeft size={20} color={palette.ink} />
              </Pressable>}
              {shareFailed && <Text style={{ color: palette.accent }}>تعذّرت المشاركة.</Text>}
            </> : <>
              {font !== null && <IconButton label={paused ? 'متابعة' : 'إيقاف مؤقت'} onPress={toggle} Icon={paused ? Play : Pause} tone="ink" />}
              <View accessibilityLabel="جارٍ تجهيز الفيديو"><LoadingDots /></View>
            </>}
        </View>
      </View>
    </Sheet>
  );
}
