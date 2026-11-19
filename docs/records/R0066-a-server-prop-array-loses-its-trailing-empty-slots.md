---
title: "A server prop array loses its trailing empty slots"
summary: "The website's «حياتهما» page got its rows from the server, each row a cell per person with undefined where that person has nothing that year. The page drew row.cells, and a row whose last people had nothing reached the client shorter, so a box one person lived alone spread over the other's columns. The page now draws one cell per picked person and reads row.cells[c]."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "lifeColumns in shared/events/lifeTimeline.ts returns [item, undefined] for a year only the first person has. Vitest on the server saw two cells; the rendered row had one child. The app reads the same function in the same process, so it never showed the bug, and the web page looked like a layout fault (Uhud and the Trench filling the whole width under al-Zubayr and Abu Bakr)."
approach: "Measured the row's children in the built page, then printed lifeCompare's output on the server: the data held both cells, the client did not. Drew the columns from the picked people (view.people.map((_, c) => row.cells[c])) instead of from the array's length."
outcome: "solved"
conditions: "Next.js 15 server component passing an array with undefined at its end to a client component, seen 2026-11-19."
evidence: "src/app/life/LifePage.tsx, e2e/web/tarajim.spec.ts (a lone box is as wide as a shared one)"
implication: "When a server component hands a client one an array whose positions mean something, take the length from what the positions stand for (the people, the columns), not from the array. A shared function tested on the server can still draw wrong on the website."
date: "2026-11-19"
topics: ["ui-state","testing"]
buildsOn: []
---

The same holds for any shared builder whose result the website passes from a page to a client part: a test of the builder alone does not see what the client receives.
