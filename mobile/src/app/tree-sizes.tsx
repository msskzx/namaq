import { lazyScreen } from '@/lib/lazyScreen';

// A measuring tool for scripts, not a screen people open: it loads only on its visit, never in the background (lib/lazyScreen.ts).
export default lazyScreen(() => require('@/screens/tree-sizes'), { warm: false });
