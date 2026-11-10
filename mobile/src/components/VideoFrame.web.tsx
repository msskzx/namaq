import { useEffect, useRef } from 'react';

/** The recorder page in the web build: a frame, talking back through window messages. */
export default function VideoFrame({ html, onMessage }: { html: string; onMessage: (data: string) => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const listen = (event: MessageEvent) => { if (event.source === frame.current?.contentWindow && typeof event.data === 'string') onMessage(event.data); };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, [onMessage]);
  return <iframe ref={frame} srcDoc={html} title="video" style={{ flex: 1, border: 0, width: '100%', height: '100%' }} />;
}
