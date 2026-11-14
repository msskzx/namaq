import { createElement, type ComponentType } from 'react';

/**
 * A route whose screen (and the data it reads) loads on its first visit instead of at launch.
 * The navigators read every route file when they mount, so a route file that imports its screen
 * directly pulls all of that screen's data into the launch. The route files under app/ wrap their
 * screen in src/screens/ with this, so launch reads only what home needs; `warmScreens` then loads
 * the rest one by one in the background, so a first visit is as quick as before.
 */
type Screen = ComponentType<object>;
type Loader = () => { default: Screen };

const pending: (() => Screen)[] = [];

export function lazyScreen(load: Loader): Screen {
  let screen: Screen | undefined;
  const get = () => (screen ??= load().default);
  pending.push(get);
  return function LazyScreen(props: object) {
    return createElement(get(), props);
  };
}

/** Loads the screens not yet visited, one at a time with a pause between, so scrolling home stays smooth. */
export function warmScreens(gap = 120) {
  let stopped = false;
  const next = () => {
    if (stopped) return;
    const get = pending.shift();
    if (!get) return;
    try { get(); } catch { /* a screen that fails to load fails again on its visit, where the error screen shows */ }
    setTimeout(next, gap);
  };
  const start = setTimeout(next, gap);
  return () => { stopped = true; clearTimeout(start); };
}
