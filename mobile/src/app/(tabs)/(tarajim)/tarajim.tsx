import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/tarajim'));
export { ErrorBoundary } from '@/components/CrashScreen';
