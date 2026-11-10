import { WebView } from 'react-native-webview';

/** The recorder page on the phone: a web view, since the phone has no canvas of its own to record. */
export default function VideoFrame({ html, onMessage }: { html: string; onMessage: (data: string) => void }) {
  return <WebView source={{ html }} originWhitelist={['*']} onMessage={event => onMessage(event.nativeEvent.data)} style={{ flex: 1, backgroundColor: 'transparent' }}
    javaScriptEnabled allowFileAccess mediaPlaybackRequiresUserAction={false} />;
}
