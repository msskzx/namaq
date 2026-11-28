# Effects and timers in app code

Owner, 2026-11-28 (quality step 7). Outside test files, screens, components, `ui/` and `app/` routes in `mobile/src` may not call
`useEffect`, `useLayoutEffect` or `useInsertionEffect`, or use `setTimeout`, `setInterval`,
`requestAnimationFrame` or `requestIdleCallback`. Lint enforces it (`quality/no-raw-effects` in
`shared/lint/quality.mjs`, `no-restricted-globals` and `no-restricted-properties` in `mobile/eslint.config.js`).

## Why

An effect runs after the screen has drawn, so a value set inside it shows one frame late, and a wrong
dependency list makes it run too often or not at all. A timer keeps running after its screen closes unless
someone clears it. Four of the five copies of the web scroll timer never did. Both mistakes look fine in review
and only show up on a phone, so the rule moves them into a few small hooks that are written and tested once.

## What to use instead

| You want | Use |
|---|---|
| a value computed from props or state | compute it while rendering, or `useMemo` |
| something to happen because the person did something | do it in the event handler |
| a value from storage or another store | `useSyncExternalStore` with the store's `subscribe…` / `read…` |
| a value that waits until typing stops | `useDebounced(value, ms)` |
| a clock that ticks | `useNow(ms)` |
| something to run once, a little after the screen opens | `useAfter(ms, run)` |
| a flag that turns on only after a state has lasted a while ("still loading") | `useDelayedFlag(on, ms, key)` |
| the end of a horizontal page swipe on web | `useWebScrollEnd(settle)` |
| state that must follow a link or a prop when it changes (a route param opens a year, a new query closes the open group) | `useAdjustOn(deps, adjust)`: sets the state in the same render, so no frame shows the old one. Only for state that nothing else sets from a timer, an animation's end, a layout event or a promise: React can drop a change made while rendering when such an update is still waiting, as the sheet's `shown` did (it never opened). Use `useOnChange` there |
| something outside React to do when a value changes (scroll to the linked place, clear the route params, save the shown page, tell the parent) | `useOnChange(deps, run)`: runs after the draw, once per change, always with the latest `run` |
| a native value the next frame must already show (a scroll offset or a scale set to match a new page) | `useBeforePaint(deps, run)`: like `useOnChange`, but runs before the draw, so the old offset never shows for a frame |
| a file or book read when a key turns on | `useLoaded(key, load)`: `null` until that key's value arrives, never an older key's value, and a failed read goes to `reportError` |
| a timer or frame the screen starts from a handler (auto-advance, a retry, a spinner that must paint before heavy work) | `useLater()`: `after(ms, run)`, `nextFrame(run)`, `afterPaint(run)`, `cancel()`; a new job replaces the waiting one and none runs after unmount |
| something to start while the screen is open and stop when it closes (an app-state listener, the leave-the-app save, a listener on an animated value) | `useWhileOpen(start, again?)`: runs `start` on mount and the function it returns on unmount; when a value in `again` changes it stops and starts again |
| a promise whose answer only counts if nothing newer started (a capture, a permission read, measured lines) | `useLatestRun()`: `const live = begin()` at the start of each run, then `if (live())` before setting state; closing the screen makes every run stale |
| something to do when the screen closes (save a draft, refresh the feed after settings) | `useOnLeave(run)`: runs the latest `run` once, on unmount |
| a browser event on `window` (a message from the video recorder's frame) | `useWindowEvent(name, listen)`: one listener, removed on unmount, always the latest `listen` |
| a value a child lifts into its parent's slot before the paint (the row under a card, a card's source line) | `useLiftInto(slot, value)` |

The hooks are in `mobile/src/lib/hooks/` and tested in `hooks.test.tsx`. Each clears its timer when the
screen closes.

## Exceptions

There are no inline exceptions: lint rejects an `eslint-disable` that names one of these rules or names no rule, and an `/* eslint … */` comment that turns one off. A directive can switch off the rule that would report it, so `npm run lint` in `mobile/` runs a second pass (`eslint.unlocks.config.js`) with inline config turned off, where no directive can hide one. When a case fits
none of the hooks above, it gets a new hook in `mobile/src/lib/hooks/` with a test. The lint rule does not
reach that folder. A new hook is accepted when:

1. it has a name that says what it does for the screen (`useDebounced`, not `useTimer`);
2. it cleans up after itself on unmount, and a test shows that;
3. at least two places use it, or one place whose effect talks to something outside React (a native module,
   the audio player, a web page in a WebView).

Modules in `mobile/src/lib/` that are not components (audio playback, network retries, the storage queue) own
their timers and their lifetime, so the rule does not reach them either.

## The baseline

Code written before the rule is listed in `mobile/eslint-suppressions.json`, with a count per file and rule.
Lint fails when a file goes above its count. It also fails when a file goes below it, until the list is
updated with:

```sh
cd mobile && npx eslint src scripts --prune-suppressions
```

So the list can only shrink. Never re-create it with `--suppress-rule` to make room for new code.

The same list holds the React Compiler rules (`react-hooks/set-state-in-effect`, `refs`, `immutability`,
`preserve-manual-memoization`, `purity`, `use-memo`), which are errors from this step on.
