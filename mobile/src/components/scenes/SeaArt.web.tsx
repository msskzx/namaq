import { lazy, Suspense, type ComponentProps, type ComponentType } from 'react';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { reportError } from '@shared/errors';
import type SeaSkia from './SeaSkia';

type Props = ComponentProps<typeof SeaSkia>;

const Nothing = () => null;

const Drawing = lazy(() => LoadSkiaWeb({ locateFile: file => `/${file}` }).then(
  (): { default: ComponentType<Props> } => require('./SeaSkia'),
  (error: unknown): { default: ComponentType<Props> } => { reportError('sea: load skia', error); return { default: Nothing }; },
));

export default function SeaArt(props: Props) {
  return <Suspense fallback={null}><Drawing {...props} /></Suspense>;
}
