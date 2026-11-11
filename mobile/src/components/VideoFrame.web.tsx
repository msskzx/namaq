import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { FrameHandle } from './VideoFrame';

/** The recorder page in the web build: a frame, talking both ways through window messages. */
const VideoFrame = forwardRef<FrameHandle, { html: string; onMessage: (data: string) => void }>(function VideoFrame({ html, onMessage }, ref) {
  const frame = useRef<HTMLIFrameElement>(null);
  useImperativeHandle(ref, () => ({ send: message => frame.current?.contentWindow?.postMessage(JSON.stringify(message), '*') }), []);
  useEffect(() => {
    const listen = (event: MessageEvent) => { if (event.source === frame.current?.contentWindow && typeof event.data === 'string') onMessage(event.data); };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, [onMessage]);
  return <iframe ref={frame} srcDoc={html} title="video" style={{ flex: 1, border: 0, width: '100%', height: '100%' }} />;
});
export default VideoFrame;
