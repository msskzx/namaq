// See docs/feature-map.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const self = fileURLToPath(import.meta.url);

export const SECTIONS = ['القرآن', 'الحديث', 'الرئيسية', 'التراجم', 'الاختبارات', 'خارج الشريط'];

export const SCREENS = [
  { file: '(tabs)/(quran)/quran', name: 'القرآن', section: 'القرآن', tabBar: 'القرآن' },
  { file: '(tabs)/read', name: 'المصحف', section: 'القرآن', from: [['القرآن', 'المصحف']] },
  { file: 'ayah', name: 'صفحة الآية', section: 'القرآن', from: [['المصحف', '‹اضغط مطولًا على آية›', 'صفحة الآية'], ['الرئيسية', 'افتح صفحة الآية']], sample: '?key=1:1' },
  { file: '(tabs)/(quran)/branches', name: 'متشابهات القرآن', section: 'القرآن', from: [['القرآن', 'متشابهات القرآن'], ['صفحة الآية', 'متشابهات الآية', 'افتح في المتشابهات']] },
  { file: '(tabs)/(quran)/compare', name: 'مقارنة السور', section: 'القرآن', from: [['القرآن', 'مقارنة السور'], ['الرئيسية', 'افتح الآيات المتشابهة']] },
  { file: '(tabs)/(quran)/prophets', name: 'قصص الأنبياء', section: 'القرآن', from: [['القرآن', 'قصص الأنبياء']] },
  { file: 'prophets/[slug]', name: 'قصة النبي', section: 'القرآن', from: [['البحث', '‹اكتب اسم النبي›', '‹اسم النبي›'], ['الرئيسية', '‹بطاقة قصة نبي›']], sample: '/musa' },
  { file: '(tabs)/(quran)/tuhfa', name: 'تحفة الأطفال', section: 'القرآن', from: [['القرآن', 'تحفة الأطفال']] },
  { file: '(tabs)/(quran)/words', name: 'ألفاظ القرآن', section: 'القرآن', from: [['القرآن', 'ألفاظ القرآن']] },
  { file: '(tabs)/(quran)/word', name: 'الكلمة', section: 'القرآن', from: [['ألفاظ القرآن', '‹الكلمة›']], sample: '?ids=814' },
  { file: '(tabs)/(quran)/oaths', name: 'الأقسام', section: 'القرآن', from: [['القرآن', 'الأقسام']] },
  { file: '(tabs)/(quran)/lataif', name: 'مشاهد', section: 'القرآن', from: [['القرآن', 'مشاهد'], ['الرئيسية', 'مشاهد']] },
  { file: 'scene', name: 'المشهد', section: 'القرآن', from: [['مشاهد', '‹غلاف المشهد›']], sample: '?id=rahman' },
  { file: '(tabs)/(quran)/terms', name: 'مصطلحات البلاغة', section: 'القرآن', from: [['القرآن', 'مصطلحات البلاغة']] },
  { file: '(tabs)/(quran)/term', name: 'المصطلح', section: 'القرآن', from: [['مصطلحات البلاغة', '‹اسم المصطلح›']], sample: '?name=الجناس' },
  { file: '(tabs)/(quran)/qiraat', name: 'القراءات', section: 'القرآن', from: [['القرآن', 'القراءات']] },
  { file: '(tabs)/(quran)/openings', name: 'فواتح السور', section: 'القرآن', from: [['القرآن', 'فواتح السور']] },
  { file: '(tabs)/(quran)/order', name: 'ترتيب السور', section: 'القرآن', from: [['القرآن', 'ترتيب السور']] },

  { file: '(tabs)/(hadith)/hadith', name: 'الحديث', section: 'الحديث', tabBar: 'الحديث' },
  { file: '(tabs)/(hadith)/hadith-book', name: 'كتاب الحديث', section: 'الحديث', from: [['الحديث', '‹اسم الكتاب›']], sample: '?book=bukhari' },
  { file: '(tabs)/(hadith)/hadith-kitab', name: 'أبواب الكتاب', section: 'الحديث', from: [['الحديث', '‹كتاب من الصحيح›'], ['كتاب الحديث', '‹كتاب من الصحيح›']], sample: '?book=bukhari&kitab=2' },
  { file: '(tabs)/(hadith)/hadith-sahih', name: 'حديث الصحيح', section: 'الحديث', from: [['أبواب الكتاب', '‹الحديث›'], ['البحث', '‹اكتب من نص الحديث›', '‹الحديث›']], sample: '?book=bukhari&n=1' },
  { file: '(tabs)/(hadith)/hadith-forty', name: 'حديث الأربعين', section: 'الحديث', from: [['الحديث', '‹رقم الحديث›']], sample: '?n=1' },
  { file: '(tabs)/(hadith)/hadith-unit', name: 'رواية الصحيح', section: 'الحديث', from: [['حديث الأربعين', 'المشاهد في صحيح مسلم']], sample: '?unit=muslim-jibril' },

  { file: '(tabs)/(home)/index', name: 'الرئيسية', section: 'الرئيسية', tabBar: 'الرئيسية' },
  { file: '(tabs)/(home)/search', name: 'البحث', section: 'الرئيسية', from: [['الرئيسية', 'البحث']] },
  { file: '(tabs)/(home)/utilities', name: 'الأدوات والأذكار', section: 'الرئيسية', from: [['الرئيسية', 'القبلة'], ['الرئيسية', 'الأذكار']] },
  { file: '(tabs)/(home)/dhikr', name: 'الذكر', section: 'الرئيسية', from: [['الأدوات والأذكار', '‹الذكر›'], ['الرئيسية', 'افتح الذكر في الأذكار']], sample: '?occasion=waking&id=waking-life' },
  { file: '(tabs)/(home)/library', name: 'مدونتي', section: 'الرئيسية', from: [['الرئيسية', 'مدونتي']] },
  { file: '(tabs)/(library)/books', name: 'المكتبة', section: 'الرئيسية', from: [['الرئيسية', 'المكتبة']] },
  { file: '(tabs)/(library)/book', name: 'الكتاب', section: 'الرئيسية', from: [['المكتبة', '‹اسم الكتاب›'], ['الرئيسية', 'افتح تفسير السعدي']], sample: '?id=sadi' },

  { file: '(tabs)/(tarajim)/tarajim', name: 'التراجم', section: 'التراجم', tabBar: 'التراجم' },
  { file: '(tabs)/(tarajim)/people', name: 'كل التراجم', section: 'التراجم', from: [['التراجم', 'كل التراجم']] },
  { file: '(tabs)/(tarajim)/person', name: 'الترجمة', section: 'التراجم', from: [['كل التراجم', '‹اسم الشخص›'], ['التراجم', '‹اكتب الاسم في البحث›', '‹اسم الشخص›']], sample: '?slug=abu-bakr-as-siddiq' },
  { file: '(tabs)/(tarajim)/ties', name: 'الصلات', section: 'التراجم', from: [['الترجمة', 'تنقّل في صلاته']], sample: '?slug=abu-bakr-as-siddiq' },
  { file: '(tabs)/(tarajim)/stories', name: 'قصص السيرة', section: 'التراجم', from: [['التراجم', 'قصص السيرة']] },
  { file: '(tabs)/(tarajim)/story', name: 'القصة', section: 'التراجم', from: [['قصص السيرة', '‹اسم القصة›']], sample: '?slug=islam-of-dimad' },
  { file: '(tabs)/(tarajim)/battles', name: 'الغزوات والمعارك', section: 'التراجم', from: [['التراجم', 'الغزوات والمعارك']] },
  { file: '(tabs)/(tarajim)/battle', name: 'الغزوة', section: 'التراجم', from: [['الغزوات والمعارك', '‹اسم الغزوة›'], ['الأطلس', '‹اسم الغزوة›']], sample: '?slug=badr' },
  { file: '(tabs)/(tarajim)/atlas', name: 'الأطلس', section: 'التراجم', from: [['التراجم', 'الأطلس']] },
  { file: '(tabs)/(tarajim)/nasab', name: 'النسب', section: 'التراجم', from: [['التراجم', 'النسب']] },
  { file: '(tabs)/(tarajim)/between', name: 'بين عدة أشخاص', section: 'التراجم', from: [['التراجم', 'بين عدة أشخاص']] },
  { file: '(tabs)/(tarajim)/life', name: 'حياتهم جنبًا إلى جنب', section: 'التراجم', from: [['التراجم', 'حياتهم جنبًا إلى جنب']] },

  { file: '(tabs)/quizzes', name: 'الاختبارات', section: 'الاختبارات', tabBar: 'الاختبارات' },
  { file: 'quiz/solo', name: 'اختبار مخصص', section: 'الاختبارات', from: [['الاختبارات', 'اختبار مخصص']] },
  { file: 'quiz/play', name: 'الاختبار', section: 'الاختبارات', from: [['اختبار مخصص', 'ابدأ الاختبار']] },
  { file: 'quiz/party/index', name: 'اختبار جماعي', section: 'الاختبارات', from: [['الاختبارات', 'اختبار جماعي']] },
  { file: 'quiz/party/[code]', name: 'غرفة الاختبار الجماعي', section: 'الاختبارات', from: [['اختبار جماعي', 'ابدأ'], ['اختبار جماعي', 'انضم']], sample: '/000000' },

  { file: 'about', name: 'عن نمق', section: 'خارج الشريط', from: [['الرئيسية', 'الإعدادات', 'عن نمق']] },
  { file: 'privacy', name: 'سياسة الخصوصية', section: 'خارج الشريط', from: [['الرئيسية', 'الإعدادات', 'سياسة الخصوصية']] },
  { file: 'attributions', name: 'المصادر والتراخيص', section: 'خارج الشريط', from: [['الرئيسية', 'الإعدادات', 'المصادر والتراخيص']] },
  { file: 'tree-sizes', name: 'مقاسات الأشجار', section: 'خارج الشريط', unlinked: 'npm run tree-sizes opens it to measure every tree' },
];

const APP = path.join(path.dirname(self), '../mobile/src/app');

export function routeFiles(dir = APP, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return routeFiles(path.join(dir, entry.name), rel);
    return entry.name.endsWith('.tsx') && entry.name !== '_layout.tsx' ? [rel.slice(0, -4)] : [];
  }).sort();
}

export const urlOf = file => `/${file.split('/').filter(part => !/^\(.*\)$/.test(part) && part !== 'index').join('/')}`;

export function urlNamed(name) {
  const screen = SCREENS.find(each => each.name === name);
  if (!screen) return null;
  const url = urlOf(screen.file);
  const sample = screen.sample ?? '';
  return sample.startsWith('/') ? url.replace(/\/\[[^\]]+\]$/, sample) : url + sample;
}

export function nameAt(pathname) {
  const match = SCREENS.find(screen => new RegExp(`^${urlOf(screen.file).replace(/\[[^\]]+\]/g, '[^/]+')}/?$`).test(pathname));
  return match?.name ?? null;
}

const ids = new Map(SCREENS.map((screen, i) => [screen.name, `s${i}`]));
const quote = text => `"${text.replaceAll('"', '#quot;')}"`;

function diagram(section) {
  const own = SCREENS.filter(screen => screen.section === section);
  const lines = ['```mermaid', 'flowchart TB'];
  const drawn = new Set();
  const node = (name, outside) => {
    if (drawn.has(name)) return;
    drawn.add(name);
    lines.push(`  ${ids.get(name)}${outside ? `([${quote(name)}])` : `[${quote(name)}]`}`);
    if (outside) lines.push(`  class ${ids.get(name)} elsewhere`);
  };
  for (const screen of own) node(screen.name, false);
  for (const screen of own) {
    if (screen.tabBar) {
      lines.push(`  bar${ids.get(screen.name)}{{${quote(`شريط التبويب: ${screen.tabBar}`)}}} --> ${ids.get(screen.name)}`);
    }
    for (const [at, ...taps] of screen.from ?? []) {
      node(at, SCREENS.find(each => each.name === at).section !== section);
      lines.push(`  ${ids.get(at)} -- ${quote(taps.join(' ← '))} --> ${ids.get(screen.name)}`);
    }
  }
  lines.push('  classDef elsewhere stroke-dasharray: 4 3', '```');
  return lines.join('\n');
}

export function renderDoc() {
  const table = SCREENS.map(screen => {
    const ways = screen.tabBar ? `شريط التبويب: ${screen.tabBar}`
      : screen.unlinked ? `لا يُفتح من التطبيق (${screen.unlinked})`
      : screen.from.map(([at, ...taps]) => `${at} ← ${taps.join(' ← ')}`).join('<br>');
    const bar = screen.file.startsWith('(tabs)/') ? 'shown' : 'covered';
    return `| ${screen.name} | \`${urlNamed(screen.name)}\` | ${bar} | ${ways} | \`mobile/src/app/${screen.file}.tsx\` |`;
  });
  return `# The app's feature map

Every screen of the phone app, by the name a person would give it, and the tap that opens it. Use these names when
talking about the app and with \`npm run phone -- open <name>\`. This file is written by \`npm run feature-map\` from
[e2e/featureMap.mjs](../e2e/featureMap.mjs); \`e2e/featureMap.test.ts\` fails when a route file in \`mobile/src/app\` is
missing from the map, when a fixed label in the map no longer appears in the app's code, when a screen cannot be
reached from the tab bar, or when this file is out of date.

On the arrows, \`←\` separates taps made one after another, and a label in ‹› is not fixed text: what a row shows (a
name, a title), something typed into the search, or a gesture. A rounded, dashed box is a screen from another section
that leads in.

A section groups screens by topic under the tab bar button that leads to them. Screens outside \`mobile/src/app/(tabs)\`
open over the whole screen and cover the tab bar; the table marks them \`covered\`.

${SECTIONS.map(section => `## ${section}\n\n${diagram(section)}`).join('\n\n')}

## Every screen

| Screen | Opens with | Tab bar | Reached from | File |
| --- | --- | --- | --- | --- |
${table.join('\n')}

## Adding a screen

Add the route file, then an entry in \`SCREENS\` in \`e2e/featureMap.mjs\`, and run \`npm run feature-map\`:

- \`file\`: the route file under \`mobile/src/app\`, without \`.tsx\`.
- \`name\`: what a person would call the screen. It must be unique.
- \`section\`: the tab bar button whose topic it belongs to, or «خارج الشريط».
- \`tabBar\`: only on the screen a tab bar button opens, the button's label.
- \`from\`: each way in, as the screen a person is on, then the labels tapped there in order. A label in ‹› is what a
  row shows, a typed search or a gesture; every other label must appear in the app's code.
- \`sample\`: for a screen that needs params, a query (\`?slug=badr\`) or a path (\`/musa\`) that gives it something to show.
- \`unlinked\`: why nothing in the app opens the screen, for a tool such as \`tree-sizes\`.
`;
}

if (process.argv[1] === self) {
  fs.writeFileSync(path.join(APP, '../../../docs/feature-map.md'), renderDoc());
  console.log('Wrote docs/feature-map.md');
}
