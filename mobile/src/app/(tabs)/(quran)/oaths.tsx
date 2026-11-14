import { lazyScreen } from '@/lib/lazyScreen';

// The screen itself loads on its first visit, or in the background once home is up (lib/lazyScreen.ts).
export default lazyScreen(() => require('@/screens/oaths'));
export { ErrorBoundary } from '@/components/CrashScreen';
