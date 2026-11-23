// When each sira story happened, for the year pages of «قصص السيرة» (owner, 2026-11-23). A year is never worked out here:
// it is the cited year of the battle or event the story happens in, or a year heading a named book prints over the story.
// A story whose own words do not set it in one of these stays off the years, on the page «بلا سنة». A story is on the
// day it tells, not the day it is told on: Wahshi tells Hamzah's killing in Hims, and the day told is Uhud. Where what is
// told is the later day itself (Urwa feeling al-Zubayr's scars at al-Yarmuk, Ibn Umar answering about Uthman), the story
// is that later day, and stays off unless it has a year.

/**
 * - `before`: at Makkah before the hijra, as the story's own words or the book's chapter («بمكة») set it. That page has no year.
 * - `battle`: during that battle (shared/data/battles/battles.json), on its cited year; a reading the book does not reject stops the build.
 * - `event`: during that catalog event, whose `hijriYear` is cited.
 * - `siyar`: al-Dhahabi tells it under a year heading of his sira (`quote`, on `page` of the sira's `volume`).
 * - `bab`: al-Bukhari's own heading over the hadith names the year.
 */
export type StoryWhen =
  | { kind: 'before' }
  | { kind: 'battle'; slug: string }
  | { kind: 'event'; slug: string }
  | { kind: 'siyar'; year: number; volume: 1 | 2; page: number; quote: string }
  | { kind: 'bab'; year: number; hadith: number };

const BEFORE: StoryWhen = { kind: 'before' };
const battle = (slug: string): StoryWhen => ({ kind: 'battle', slug });
const event = (slug: string): StoryWhen => ({ kind: 'event', slug });
/** al-Dhahabi's first year heading, with the Prophet's ﷺ arrival at al-Madinah told under it (السيرة ١، ص ٢٨٣). */
const FIRST_YEAR: StoryWhen = { kind: 'siyar', year: 1, volume: 1, page: 283, quote: '[السنة الأولى من الهجرة:]' };
/** al-Dhahabi's «[السنة العاشرة:]», over his «[حجة الوداع:]» (السيرة ٢، ص ٢٨٩). */
const FAREWELL_HAJJ: StoryWhen = { kind: 'siyar', year: 10, volume: 2, page: 269, quote: '[السنة العاشرة:]' };
/** The Prophet's ﷺ last illness and death: al-Dhahabi tells them under «[سنة إحدى عشرة:]». */
const DEATH: StoryWhen = { kind: 'siyar', year: 11, volume: 2, page: 299, quote: '[سنة إحدى عشرة:]' };

export const STORY_WHEN: Record<string, StoryWhen> = {
  // At Makkah: Quraysh, the Ka'bah, those who believed there, al-Isra', al-'Aqabah.
  'al-walid-hears-the-quran': BEFORE,
  'utbah-offers-and-hears-fussilat': BEFORE,
  'islam-of-abu-dharr': BEFORE,
  'islam-of-umar': BEFORE,
  'the-jinn-hear-the-quran': BEFORE,
  'the-night-of-the-jinn': BEFORE, // «فقدناه ذات ليلة بمكة»
  'islam-of-amr-ibn-absah': BEFORE, // «فدخلت عليه بمكة»
  'islam-of-dimad': BEFORE, // «أن ضمادا قدم مكة»
  'journey-to-taif': BEFORE, // «لقيت من قومك ... يوم العقبة»
  'khabbab-asks-for-prayer': BEFORE,
  'the-prostration-at-al-najm': BEFORE, // al-Bukhari: «باب ما لقي النبي ﷺ وأصحابه من المشركين بمكة»
  'the-camels-offal': BEFORE,
  'abu-bakr-defends-the-prophet': BEFORE, // «في حجر الكعبة»
  'islam-of-abu-bakr': BEFORE,
  'islam-of-saad-ibn-abi-waqqas': BEFORE,
  'islam-of-saeed-ibn-zaid': BEFORE, // «موثقي عمر على الإسلام ... وما أسلم»
  'splitting-of-the-moon': BEFORE, // «بمنى» and «انشق بمكة»
  'death-of-abu-talib': BEFORE,
  'al-isra-wal-miraj': BEFORE,
  'first-pledge-of-aqaba': BEFORE,

  // The first years at al-Madinah.
  'hijra-to-medina': FIRST_YEAR,
  'building-of-the-prophets-mosque': event('building-of-the-prophets-mosque'),
  'brotherhood-of-muhajirun-and-ansar': event('brotherhood-of-muhajirun-and-ansar'),
  'islam-of-abdullah-ibn-salam': event('islam-of-abdullah-ibn-salam'),
  'death-of-uthman-ibn-mazun': event('death-of-uthman-ibn-mazun'),
  'hamzah-and-alis-two-camels': event('marriage-of-ali-and-fatimah'), // «فلما أردت أن أبتني بفاطمة»
  'killing-of-kaab-ibn-al-ashraf': event('killing-of-kaab-ibn-al-ashraf'),

  // Badr.
  'the-plea-and-the-captives-of-badr': battle('badr'),
  'the-consultation-before-badr': battle('badr'),
  'hudhayfah-and-his-father-before-badr': battle('badr'),
  'abd-al-rahman-ibn-awf-and-umayyah': battle('badr'),
  'al-miqdad-at-badr': battle('badr'),
  'the-well-of-badr': battle('badr'),
  'the-mother-of-harithah': battle('badr'),
  'the-killing-of-abu-jahl': battle('badr'),
  'az-zubayr-and-abu-dhat-al-karish': battle('badr'),
  'jubair-hears-al-tur': battle('badr'), // «وكان جاء في أسارى بدر»

  // Uhud.
  'the-seven-of-the-ansar-at-uhud': battle('uhud'),
  'the-shroud-of-musab-ibn-umayr': battle('uhud'), // «قتل يوم أحد»
  'the-archers-and-abu-sufyan-at-uhud': battle('uhud'),
  'the-man-who-threw-his-dates': battle('uhud'),
  'anas-ibn-an-nadr-at-uhud': battle('uhud'),
  'the-two-parties-over-the-hypocrites': battle('uhud'),
  'abu-talhah-at-uhud': battle('uhud'),
  'the-killing-of-al-yaman': battle('uhud'),
  'the-killing-of-hamzah': battle('uhud'), // «عام عينين ... جبل بحيال أحد»
  'the-wound-of-the-prophet-at-uhud': battle('uhud'),
  'those-who-answered-after-uhud': battle('uhud'),
  'not-yours-is-the-matter': battle('uhud'), // «كسرت رباعيته يوم أحد»

  // The Trench and Qurayzah.
  'hudhayfah-on-the-night-of-the-confederates': battle('khandaq'),
  'the-digging-of-the-trench': battle('khandaq'),
  'jabirs-food-at-the-trench': battle('khandaq'),
  'the-asr-at-the-trench': battle('khandaq'),
  'the-disciple-of-the-prophet': battle('khandaq'), // «يوم الأحزاب»
  'the-asr-at-banu-qurayzah': battle('banu-qurayzah'),
  'the-judgement-of-saad-ibn-muadh': battle('banu-qurayzah'),

  // al-Ifk: al-Dhahabi gives its year himself, under the raid on Banu al-Mustaliq.
  'the-ifk': { kind: 'siyar', year: 5, volume: 2, page: 18, quote: 'قلت: وفيها حديث الإفك، وقد تقدم ذلك في سنة خمس. وهو الصحيح.' },

  // al-Hudaybiyah.
  'treaty-of-hudaybiyyah': battle('hudaybiyyah'),
  'the-well-of-al-hudaybiyah': battle('hudaybiyyah'),
  'water-from-his-fingers-at-al-hudaybiyah': battle('hudaybiyyah'),
  'kaab-ibn-ujrah-and-the-fidyah': battle('hudaybiyyah'),
  'ibn-umar-pledges-before-his-father': battle('hudaybiyyah'),
  'the-revelation-of-surat-al-fath': battle('hudaybiyyah'), // «مرجعه من الحديبية»

  // Khaybar.
  'amir-ibn-al-akwa-at-khaybar': battle('khaybar'),
  'the-morning-at-khaybar': battle('khaybar'),
  'the-din-and-the-wicked-man': battle('khaybar'),
  'a-treasure-of-paradise': battle('khaybar'),
  'the-wound-of-salamah-at-khaybar': battle('khaybar'),
  'the-banner-at-khaybar': battle('khaybar'),
  'the-marriage-of-safiyyah': battle('khaybar'),
  'the-bag-of-fat-at-khaybar': battle('khaybar'),
  'banu-hashim-and-banu-al-muttalib': battle('khaybar'), // «من خمس خيبر»
  'the-people-of-the-ship': battle('khaybar'), // «فوافقنا النبي ﷺ حين افتتح خيبر»
  'midam-and-the-shamlah': battle('khaybar'),

  // Mu'tah.
  'the-day-of-mutah': battle('mutah'),
  'the-women-of-jafar': battle('mutah'),

  // The conquest of Makkah.
  'the-ansar-on-the-day-of-the-conquest': battle('fath-makkah'),
  'the-letter-of-hatib': battle('fath-makkah'),
  'ibn-khatal': battle('fath-makkah'),
  'the-idols-around-the-kaaba': battle('fath-makkah'),
  'the-son-of-zamahs-slave-girl': battle('fath-makkah'),
  'the-woman-who-stole-in-the-conquest': battle('fath-makkah'),
  'the-prophet-enters-the-kaaba': battle('fath-makkah'), // «عام الفتح»

  // Hunayn and al-Ta'if.
  'the-prophet-stands-firm-at-hunayn': battle('hunayn'),
  'umm-sulayms-dagger': battle('hunayn'),
  'salamah-and-the-spy': battle('hunayn'), // «غزونا مع رسول الله ﷺ هوازن»
  'the-captives-of-hawazin': battle('hunayn'),
  'abu-qatadah-and-the-spoils-at-hunayn': battle('hunayn'),
  'abu-amir-at-awtas': battle('hunayn'), // «لما فرغ النبي ﷺ من حنين»
  'may-allah-have-mercy-on-musa': battle('hunayn'),
  'the-ansar-and-the-spoils-of-hunayn': battle('hunayn'),
  'the-mukhannath-in-umm-salamahs-house': battle('taif'),
  'the-siege-of-at-taif': battle('taif'),

  // The year nine: Abu Bakr's hajj and Tabuk.
  'the-proclamation-at-abu-bakrs-hajj': { kind: 'bab', year: 9, hadith: 4363 },
  'the-mounts-of-the-asharis': battle('tabuk'),
  'ali-left-in-medina-at-tabuk': battle('tabuk'),
  'kaab-ibn-malik-and-the-three-who-stayed-behind': battle('tabuk'),

  // The Farewell Hajj.
  'the-sermon-of-the-farewell-hajj': FAREWELL_HAJJ,
  'the-prophet-visits-saad-in-his-illness': FAREWELL_HAJJ, // «عام حجة الوداع»

  // His last illness and death ﷺ.
  'the-day-of-thursday': DEATH,
  'fatimah-weeps-and-laughs': DEATH,
  'his-illness-in-aishas-house': DEATH,
  'al-abbas-and-ali-in-his-illness': DEATH,
  'the-last-look-at-the-prayer': DEATH,
  'passing-of-the-prophet-muhammad': DEATH,
  'abu-bakr-on-the-day-of-his-death': DEATH,
  'the-medicine-in-his-mouth': DEATH,
  'the-command-of-usamah': battle('sariyyah-usamah'),
};
