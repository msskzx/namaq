import { useEffect, useState, type ComponentProps } from 'react';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type SeaSkia from './SeaSkia';

/** On the web Skia's engine (canvaskit.wasm, served beside the page) loads first; only then is the drawing read. */
export default function SeaArt(props: ComponentProps<typeof SeaSkia>) {
  const [Drawing, setDrawing] = useState<typeof SeaSkia | null>(null);
  useEffect(() => {
    let live = true;
    LoadSkiaWeb({ locateFile: file => `/${file}` }).then(() => { if (live) setDrawing(() => require('./SeaSkia').default); });
    return () => { live = false; };
  }, []);
  return Drawing ? <Drawing {...props} /> : null;
}
