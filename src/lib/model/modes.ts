// docs/plans/data-model/plan.md, section 2.5
import { HARAKAT, matchForm } from './span';

const MODE_KEYS: Record<string, string> = {
  حدثنا: 'haddatha/1pl',
  ثنا: 'haddatha/1pl',
  نا: 'haddatha/1pl',
  حدثني: 'haddatha/1sg',
  ثني: 'haddatha/1sg',
  أخبرنا: 'akhbara/1pl',
  أنا: 'akhbara/1pl',
  أخبرني: 'akhbara/1sg',
  أنبأنا: "anba'a/1pl",
  أنبأني: "anba'a/1sg",
  'قال لي': 'qala-li',
  بلغني: 'balagha/1sg',
  'كتب إلي': 'kataba-ilayya',
  'قرأت على': "qara'tu-ala",
  'قرئ على': "quri'a-ala",
  ناولني: 'nawala',
  وجدت: 'wijadah',
  سمعت: 'samia/1sg',
  سمع: 'samia/3sg',
  عن: 'an',
  أن: 'anna',
  قال: 'qala/3sg',
  ذكر: 'dhakara',
  يذكر: 'yudhkaru',
  روي: 'ruwiya',
};

export function modeKeyOf(printed: string) {
  return MODE_KEYS[matchForm(printed).replace(HARAKAT, '')];
}
