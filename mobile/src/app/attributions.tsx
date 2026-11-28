import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => ({ default: require('@/screens/info').AttributionsScreen }), { warm: false });
export { ErrorBoundary } from '@/components/CrashScreen';
