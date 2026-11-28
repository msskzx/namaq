import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/between'));
export { ErrorBoundary } from '@/components/CrashScreen';
