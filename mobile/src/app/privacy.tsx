import { lazyScreen } from '@/lib/lazyScreen';

// Opened from the settings sheet only, so it loads on its first visit (lib/lazyScreen.ts).
export default lazyScreen(() => ({ default: require('@/screens/info').PrivacyScreen }), { warm: false });
export { ErrorBoundary } from '@/components/CrashScreen';
