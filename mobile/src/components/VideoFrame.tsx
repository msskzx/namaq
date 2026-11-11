import { forwardRef, useImperativeHandle, useRef, type ComponentRef } from 'react';
import { WebView } from 'react-native-webview';

/** Talks to the recorder page: a message (pause, resume) goes in as a window message event. */
export type FrameHandle = { send: (message: object) => void };

/** The recorder page on the phone: a web view, since the phone has no canvas of its own to record. */
const VideoFrame = forwardRef<FrameHandle, { html: string; onMessage: (data: string) => void }>(function VideoFrame({ html, onMessage }, ref) {
  const view = useRef<ComponentRef<typeof WebView>>(null);
  useImperativeHandle(ref, () => ({ send: message => view.current?.postMessage(JSON.stringify(message)) }), []);
  return <WebView ref={view} source={{ html }} originWhitelist={['*']} onMessage={event => onMessage(event.nativeEvent.data)} style={{ flex: 1, backgroundColor: 'transparent' }}
    javaScriptEnabled allowFileAccess mediaPlaybackRequiresUserAction={false} />;
});
export default VideoFrame;
