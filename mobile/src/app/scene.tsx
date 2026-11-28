import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/scene'));
export { ErrorBoundary } from '@/components/CrashScreen';
