# Privacy page and analytics: future plan

Status: not done. The privacy page (`src/app/privacy/page.tsx`) and the cookie
banner (`src/components/cookies/CookieConsent.tsx`) came from a template. Namaq
has no feature that uses analytics yet, so the page describes data collection
that does not happen.

## Problems today

- The English bullet lists (usage data, analytics, performance metrics, device
  information, deletion requests) are hard-coded and have no Arabic version.
- The text promises analytics and account-style rights (access, deletion) the
  app has no way to honour.
- The banner asks for analytics consent for a site that runs none.

## Proposal

- Rewrite the page to say what the app actually stores: the language and theme
  preference in the browser, and nothing else, unless a feature changes that.
- Give every string an `en` and an `ar` variant, following the rest of the app.
- Drop the analytics consent choice from the banner, or remove the banner, until
  an analytics feature exists. Bring both back with that feature.
- Decide the contact route for privacy questions before publishing a rights
  section, so the page does not name one that goes nowhere.

## When analytics is added

The page and the banner change in the same PR as the feature, so the wording
never gets ahead of the behavior.
