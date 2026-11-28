import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/hadithUnit'));
export { ErrorBoundary } from '@/components/CrashScreen';
