# Effects and timers in app code

Owner, 2026-11-28 (quality step 7). Screens, components, `ui/` and `app/` routes in `mobile/src` may not call
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
| the end of a horizontal page swipe on web | `useWebScrollEnd(settle)` |

The hooks are in `mobile/src/lib/hooks/` and tested in `hooks.test.tsx`. Each clears its timer when the
screen closes.

## Exceptions

There are no inline exceptions: lint rejects an `eslint-disable` that names one of these rules. When a case fits
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
