import { createElement, type ComponentType } from 'react';
import { reportError } from '@shared/errors';

type Screen = ComponentType<object>;
type Loader = () => { default: Screen };

const pending: (() => Screen)[] = [];

export function lazyScreen(load: Loader, { warm = true } = {}): Screen {
  let screen: Screen | undefined;
  const get = () => (screen ??= load().default);
  if (warm) pending.push(get);
  return function LazyScreen(props: object) {
    return createElement(get(), props);
  };
}

export function warmScreens(gap = 120) {
  let stopped = false;
  const next = () => {
    if (stopped) return;
    const get = pending.shift();
    if (!get) return;
    try { get(); } catch (error) { reportError('lazy screen: preload', error); }
    setTimeout(next, gap);
  };
  const start = setTimeout(next, gap);
  return () => { stopped = true; clearTimeout(start); };
}
