import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => ({ default: require('@/screens/info').PrivacyScreen }), { warm: false });
export { ErrorBoundary } from '@/components/CrashScreen';
