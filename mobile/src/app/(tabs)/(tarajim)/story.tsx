import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/story'));
export { ErrorBoundary } from '@/components/CrashScreen';
