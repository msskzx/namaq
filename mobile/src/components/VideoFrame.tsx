import { forwardRef, useImperativeHandle, useRef, type ComponentRef } from 'react';
import { WebView } from 'react-native-webview';

export type FrameHandle = { send: (message: object) => void };

const VideoFrame = forwardRef<FrameHandle, { html: string; onMessage: (data: string) => void }>(function VideoFrame({ html, onMessage }, ref) {
  const view = useRef<ComponentRef<typeof WebView>>(null);
  useImperativeHandle(ref, () => ({ send: message => view.current?.postMessage(JSON.stringify(message)) }), []);
  return <WebView ref={view} source={{ html }} originWhitelist={['*']} onMessage={event => onMessage(event.nativeEvent.data)} style={{ flex: 1, backgroundColor: 'transparent' }}
    javaScriptEnabled allowFileAccess mediaPlaybackRequiresUserAction={false} />;
});
export default VideoFrame;
