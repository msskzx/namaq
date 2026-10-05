# A page that reads repo files at request time works on a laptop and breaks on a deploy

The `/hadith` pages first read the Jibril fixtures from disk with `fs`. They worked
on localhost, where the files sit next to the code, and failed on Vercel, which
ships only the files its tracer finds through static imports. The deployed page
answered HTTP 200 with a Next error digest in the body, so a status check would
have called it healthy. A patch that listed the fixture folder in
`outputFileTracingIncludes` would have worked, but the owner asked the better
question: why was the data not in the database? The model's rule already says so
(files under `data/` are the authority and the databases are rebuilt from them,
[ADR 0023](../../adr/0023-files-are-the-authority-and-both-databases-are-derived.md)),
and I had skipped that step to get something on screen faster.

**Evidence:** the live page showed an error digest with status 200; a production
build's trace for the route listed none of the fixture files until the folder was
named; after `model_units` held the three units, the page read a changed title
from the database, which proved the read path. The preview deployment sat behind
Vercel login, so a request from outside got a 302 and verified nothing.

**Implications:** a page that works because a file is on disk has proved nothing
about the deploy. Derived data a page needs belongs in the database, written by a
projection from the files ([plan](../../plans/hadith-in-the-database.md)), and the
projection gets a dry run, an explicit target and a refusal for prod until a review
rule exists. When checking a deploy, read the body, not the status. When a shortcut
skips a step the project's rules require, say so before building on it.
