// Where each battle took place on today's map (owner, 2026-11-23: every place on the map is correct and carries its
// reference). A place's book names it, and where it is today; its coordinates are those of that place in GeoNames, by
// the record's number, never ours. Where the book gives only a distance and a direction or a stretch between two places,
// the pin follows its words from the GeoNames places it names:
// - حمراء الأسد: al-Biladi's «جبل أحمر جنوب المدينة على (٢٠) كيلا», 20 km due south of GeoNames' Madinah.
// - صفين: Yaqut's «بين الرقة وبالس», halfway between GeoNames' al-Raqqa and Balis.
// A battle whose place no book pins has none, and its page shows the source's place name only: بدر الأولى (al-Biladi
// p. 158, «لا يعرف اليوم موضع باسم سفوان») and النهروان (Yaqut 5/325 names a whole district «بين بغداد وواسط من الجانب
// الشرقي», no point in it). Quotes are the books' words without their vowel marks.
import type { AppCite } from './battle';
import type { LonLat } from './map';

export type Place = { name: string; at: LonLat; refs: AppCite[] };

export const BILADI = 'معجم المعالم الجغرافية في السيرة النبوية';
export const YAQUT = 'معجم البلدان';
export const SHURRAB = 'المعالم الأثيرة في السنة والسيرة';
export const LUGHA = 'مجلة لغة العرب';
export const GEONAMES = 'GeoNames';

/** A book's page on Shamela, by the turath.io copy's book and page numbers (they are Shamela's). */
const turath = (book: number, page: number) => `https://shamela.ws/book/${book}/${page}`;
const digits = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
/** The GeoNames record whose coordinates a pin takes. */
const geonames = (id: number): AppCite => ({ text: '', cite: `${GEONAMES}، رقم ${digits(id)}`, url: `https://www.geonames.org/${id}` });

export const PLACES: Record<string, Place> = {
  madinah: {
    name: 'المدينة', at: [39.61417, 24.46861],
    refs: [
      { text: 'طيبة، هي مدينة رسول الله ﷺ', cite: `${BILADI}، ص ١٩٠`, url: turath(9777, 148) },
      geonames(109223),
    ],
  },
  makkah: {
    name: 'مكة', at: [39.82563, 21.42664],
    refs: [
      { text: 'هي مكة المكرمة، وهي الحرم الآمن، وأم القرى', cite: `${BILADI}، ص ٣٠١`, url: turath(9777, 236) },
      geonames(104515),
    ],
  },
  badr: {
    name: 'بدر', at: [38.79047, 23.78292],
    refs: [
      { text: 'وهي اليوم بلدة بأسفل وادي الصفراء، تبعد عن المدينة (١٥٥) كيلا', cite: `${BILADI}، ص ٤١`, url: turath(9777, 36) },
      geonames(107744),
    ],
  },
  uhud: {
    name: 'أحد', at: [39.62685, 24.52097],
    refs: [
      { text: 'وهو من أشهر جبال العرب، يشرف على المدينة من الشمال', cite: `${BILADI}، ص ١٩`, url: turath(9777, 17) },
      geonames(101215),
    ],
  },
  khaybar: {
    name: 'خيبر', at: [39.28031, 25.71344],
    refs: [
      { text: 'ويبعد عن المدينة (١٦٥) كيلا شمالا على طريق الشام', cite: `${BILADI}، ص ١١٨`, url: turath(9777, 99) },
      geonames(104979),
    ],
  },
  hudaybiyyah: {
    name: 'الحديبية', at: [39.61822, 21.34915],
    refs: [
      { text: 'الحديبية على (٢٢) كيلا غرب مكة على طريق جدة القديم', cite: `${BILADI}، ص ٩٤`, url: turath(9777, 77) },
      { text: 'فالحديبية بئر يعرف اليوم موقعها بالشميسي', cite: `${BILADI}، ص ١٠٦`, url: turath(9777, 89) },
      geonames(108201),
    ],
  },
  hunayn: {
    name: 'حنين', at: [40.06353, 21.51615],
    refs: [
      { text: 'وهو واد من أودية مكة، يقع شرقها بقرابة ثلاثين كيلا، يسمى اليوم وادي الشرائع', cite: `${BILADI}، ص ١٠٧`, url: turath(9777, 90) },
      geonames(108246),
    ],
  },
  taif: {
    name: 'الطائف', at: [40.41583, 21.27028],
    refs: [
      { text: 'الطائف: مدينة غنية عن التعريف، تقع شرق مكة مع ميل قليل إلى الجنوب، على مسافة تسعة وتسعين كيلا', cite: `${SHURRAB}، ص ١٧٠`, url: turath(23677, 157) },
      geonames(107968),
    ],
  },
  tabuk: {
    name: 'تبوك', at: [36.57151, 28.3998],
    refs: [
      { text: 'وقد أصبحت اليوم مدينة من مدن شمال الحجاز الرئيسية', cite: `${BILADI}، ص ٥٩`, url: turath(9777, 51) },
      geonames(101628),
    ],
  },
  mutah: {
    name: 'مؤتة', at: [35.69444, 31.0925],
    refs: [
      { text: 'مؤتة: بلدة أردنية، تقع جنوب الكرك غير بعيدة منها', cite: `${BILADI}، ص ٣٠٤`, url: turath(9777, 239) },
      geonames(247809),
    ],
  },
  nakhlah: {
    name: 'نخلة', at: [40.1028, 21.61709],
    refs: [
      { text: 'والمقصود في هذه الرواية نخلة اليمانية، لأنها على الطريق القديم بين مكة والطائف', cite: `${BILADI}، ص ٣١٧`, url: turath(9777, 249) },
      geonames(100427),
    ],
  },
  hamraAlAsad: {
    name: 'حمراء الأسد', at: [39.61417, 24.28875],
    refs: [
      { text: 'وحمراء الأسد: جبل أحمر جنوب المدينة على (٢٠) كيلا', cite: `${BILADI}، ص ١٠٥`, url: turath(9777, 88) },
      geonames(109223),
    ],
  },
  yarmuk: {
    name: 'اليرموك', at: [36.00969, 32.7449],
    refs: [
      { text: 'يرموك: واد بناحية الشام في طرف الغور يصب في نهر الأردن', cite: `${YAQUT}، ٥/٤٣٤`, url: turath(23735, 2467) },
      geonames(12210767),
    ],
  },
  fihl: {
    name: 'فحل', at: [35.60898, 32.45103],
    refs: [
      { text: 'اسم موضع بالشام كانت فيه وقعة للمسلمين مع الروم', cite: `${YAQUT}، ٤/٢٣٧`, url: turath(23735, 1774) },
      { text: 'وكان يوم فحل يسمى يوم الردغة أيضا ويوم بيسان', cite: `${YAQUT}، ٤/٢٣٧`, url: turath(23735, 1774) },
      geonames(246636),
    ],
  },
  damascus: {
    name: 'دمشق', at: [36.29128, 33.5102],
    refs: [
      { text: 'البلدة المشهورة قصبة الشام', cite: `${YAQUT}، ٢/٤٦٣`, url: turath(23735, 993) },
      geonames(170654),
    ],
  },
  jerusalem: {
    name: 'بيت المقدس', at: [35.21633, 31.76904],
    refs: [
      { text: 'المسجد الأقصى ما زال معروفا وما زال يسمى بيت المقدس، والقدس', cite: `${BILADI}، ص ٢٩٢`, url: turath(9777, 227) },
      geonames(281184),
    ],
  },
  alexandria: {
    name: 'الإسكندرية', at: [29.91582, 31.20176],
    refs: [
      { text: 'وفتحت الإسكندرية سنة عشرين من الهجرة في أيام عمر بن الخطاب', cite: `${YAQUT}، ١/١٨٨`, url: turath(23735, 183) },
      geonames(361058),
    ],
  },
  cyprus: {
    name: 'قبرص', at: [33.0, 35.0],
    refs: [
      { text: 'وهي جزيرة في بحر الروم', cite: `${YAQUT}، ٤/٣٠٥`, url: turath(23735, 1842) },
      geonames(146669),
    ],
  },
  qadisiyyah: {
    name: 'القادسية', at: [44.43333, 31.58333],
    refs: [
      { text: 'وبهذا الموضع كان يوم القادسية بين سعد ابن ابي وقاص والمسلمين والفرس', cite: `${YAQUT}، ٤/٢٩١`, url: turath(23735, 1828) },
      geonames(99021),
    ],
  },
  ctesiphon: {
    name: 'المدائن', at: [44.58333, 33.08333],
    refs: [
      { text: 'قال حمزة: اسم المدائن بالفارسية توسفون وعربوه على الطيسفون', cite: `${YAQUT}، ٥/٧٥`, url: turath(23735, 2108) },
      geonames(90287),
    ],
  },
  nahavand: {
    name: 'نهاوند', at: [48.37446, 34.19088],
    refs: [
      { text: 'هي مدينة عظيمة في قبلة همذان بينهما ثلاثة أيام', cite: `${YAQUT}، ٥/٣١٣`, url: turath(23735, 2346) },
      geonames(122915),
    ],
  },
  jamal: {
    name: 'البصرة القديمة', at: [47.70175, 30.39213],
    refs: [
      { text: 'وعندها كانت وقعة الجمل', cite: `${YAQUT}، ٢/٣٦٣`, url: turath(23735, 893) },
      { text: 'فهذه في البصرة القديمة ومكانها اليوم بلدة الزبير.', cite: `${LUGHA}، ٦/١٩٩`, url: turath(36540, 3073) },
      geonames(98245),
    ],
  },
  siffin: {
    name: 'صفين', at: [38.55963, 35.96984],
    refs: [
      { text: 'وهو موضع بقرب الرقة على شاطئ الفرات من الجانب الغربي بين الرقة وبالس', cite: `${YAQUT}، ٣/٤١٤`, url: turath(23735, 1488) },
      geonames(172955),
      geonames(171885),
    ],
  },
};

/** Each battle's place, by the battle's catalog slug. */
export const BATTLE_PLACE: Record<string, keyof typeof PLACES> = {
  badr: 'badr', uhud: 'uhud', khandaq: 'madinah', 'banu-qurayzah': 'madinah',
  'ghazwah-bani-qaynuqa': 'madinah', 'ghazwah-hamra-al-asad': 'hamraAlAsad', khaybar: 'khaybar', hudaybiyyah: 'hudaybiyyah',
  'fath-makkah': 'makkah', hunayn: 'hunayn', taif: 'taif', tabuk: 'tabuk', mutah: 'mutah', 'sariyyah-nakhlah': 'nakhlah',
  yarmuk: 'yarmuk', fihl: 'fihl', 'fath-damascus': 'damascus', 'fath-jerusalem': 'jerusalem', 'fath-alexandria': 'alexandria',
  'fath-cyprus': 'cyprus', qadisiyyah: 'qadisiyyah', 'fath-ctesiphon': 'ctesiphon', nahavand: 'nahavand', jamal: 'jamal',
  siffin: 'siffin',
};

/** Well-known cities a battle's map shows beside it when they are near, so a reader can tell where it was. */
export const LANDMARKS = ['madinah', 'makkah', 'damascus', 'jerusalem', 'ctesiphon'] as const;
