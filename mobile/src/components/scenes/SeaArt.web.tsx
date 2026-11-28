import { lazy, Suspense, type ComponentProps } from 'react';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type SeaSkia from './SeaSkia';

const Drawing = lazy(() => LoadSkiaWeb({ locateFile: file => `/${file}` }).then((): { default: typeof SeaSkia } => require('./SeaSkia')));

export default function SeaArt(props: ComponentProps<typeof SeaSkia>) {
  return <Suspense fallback={null}><Drawing {...props} /></Suspense>;
}
