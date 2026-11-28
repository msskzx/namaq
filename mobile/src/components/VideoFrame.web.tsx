import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { FrameHandle } from './VideoFrame';
import { useWindowEvent } from '@/lib/hooks/useWindowEvent';

const VideoFrame = forwardRef<FrameHandle, { html: string; onMessage: (data: string) => void }>(function VideoFrame({ html, onMessage }, ref) {
  const frame = useRef<HTMLIFrameElement>(null);
  useImperativeHandle(ref, () => ({ send: message => frame.current?.contentWindow?.postMessage(JSON.stringify(message), '*') }), []);
  useWindowEvent('message', event => { if (event.source === frame.current?.contentWindow && typeof event.data === 'string') onMessage(event.data); });
  return <iframe ref={frame} srcDoc={html} title="video" style={{ flex: 1, border: 0, width: '100%', height: '100%' }} />;
});
export default VideoFrame;
