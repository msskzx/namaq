import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/hadithKitab'));
export { ErrorBoundary } from '@/components/CrashScreen';
