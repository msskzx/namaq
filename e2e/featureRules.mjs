// See docs/feature-map.md, "Rules".
import { SCREENS } from './featureMap.mjs';

const named = name => SCREENS.find(screen => screen.name === name);
const stackOf = screen => screen.file.match(/^\(tabs\)\/(\([a-z]+\)|[a-z]+)/)?.[1] ?? 'root';
const where = item => `${item.file}#${item.owner}`;

export const ITEM_PAGES = ['الترجمة', 'الغزوة', 'القصة', 'حديث الصحيح', 'صفحة الآية', 'قصة النبي'];

export function brokenRules({ links, sheets, shared }) {
  const own = screen => item => !shared(item) && item.in.includes(screen);
  const opens = (screen, target) => links.some(item => own(screen)(item) && item.target === target);
  const ayahPage = named('صفحة الآية');

  const ayahMenu = SCREENS.filter(screen => screen !== ayahPage
    && sheets.some(item => own(screen)(item) && item.label?.startsWith('الآية'))
    && !opens(screen, ayahPage))
    .map(screen => screen.name);

  const search = named('البحث');
  const searchStays = links.filter(item => item.target === search && !shared(item))
    .flatMap(item => item.in.filter(screen => screen.name !== 'الرئيسية').map(screen => `${screen.name}: ${where(item)}`));

  const namedButton = links.filter(item => item.target && named(item.label) && item.target !== named(item.label))
    .map(item => `«${item.label}» opens ${item.target.name}: ${where(item)}`);

  const bothWays = ITEM_PAGES.flatMap(a => ITEM_PAGES.filter(b => b !== a && opens(named(a), named(b)) && !opens(named(b), named(a)))
    .map(b => `${a} opens ${b}, ${b} does not open ${a}`));

  const intoOtherTab = links.filter(item => item.target && item.how === 'push' && stackOf(item.target) !== 'root')
    .flatMap(item => item.in.filter(screen => stackOf(screen) !== stackOf(item.target)).map(screen => `${screen.name} → ${item.target.name}: ${where(item)}`));

  return {
    'The ayah menu offers «صفحة الآية» wherever it shows': ayahMenu,
    'A page\'s search stays on the page (only home opens the search page)': searchStays,
    'A button named after a screen opens that screen': namedButton,
    'Pages of single things link both ways': bothWays,
    'A screen in another tab opens through toTab, so the tab\'s first page sits under it': intoOtherTab,
  };
}
