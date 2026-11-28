const TESTS = String.raw`\.test\.tsx?$`;

const importZones = [
  {
    from: 'shared/',
    skip: [TESTS, String.raw`\.d\.ts$`, String.raw`^shared/lint/`],
    allow: ['shared/'],
    packages: false,
    message: 'Code in shared/ imports only shared/: no packages, no React, no app or website code, because the phone app\'s bundler reads it as plain files',
  },
  {
    from: 'mobile/',
    forbid: ['src/'],
    message: 'The phone app never imports the website\'s code',
  },
  {
    from: 'mobile/src/ui/',
    skip: [TESTS],
    forbid: ['mobile/src/components/', 'mobile/src/screens/', 'mobile/src/app/'],
    unless: ['mobile/src/components/quran/text/'],
    message: 'Shared UI pieces import only ui/, lib/, shared/ and the Quran text module, so a button never pulls in a feature or a page',
  },
  {
    from: 'mobile/src/',
    skip: [TESTS, String.raw`^mobile/src/app/`],
    forbid: ['mobile/src/screens/'],
    message: 'Only routes in app/ import a screen. A piece two screens share goes in components/ (a view) or lib/ (a helper)',
  },
];

export default importZones;
