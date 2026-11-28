import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/quran'));
export { ErrorBoundary } from '@/components/CrashScreen';
