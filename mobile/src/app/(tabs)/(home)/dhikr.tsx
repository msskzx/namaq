import { lazyScreen } from '@/lib/lazyScreen';

// The screen itself loads on its first visit (lib/lazyScreen.ts).
export default lazyScreen(() => require('@/screens/dhikr'));
export { ErrorBoundary } from '@/components/CrashScreen';
