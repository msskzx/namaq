import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * al-Walid ibn al-Mughirah heard the Quran and was moved, then under Quraysh's pressure called it «سحر يؤثر», and
 * {ذرني ومن خلقت وحيدا} was revealed about him (al-Sira 1 pp124-125, al-Hakim's connected report). al-Dhahabi gives the
 * span in Ibn Ishaq's report that follows (p126: {ذرني ومن خلقت وحيدا} to {سأصليه سقر}, al-Muddaththir 11-26), and al-Sa'di
 * names him for these ayat.
 */
const alWalidHearsTheQuran = {
  kind: 'EVENT',
  slug: 'al-walid-hears-the-quran',
  name: 'الوليد بن المغيرة يسمع القرآن',
  nameTransliterated: 'al-Walid ibn al-Mughirah hears the Quran',
  type: 'OTHER',
  fields: {},
  people: [
    { person: 'al-walid-ibn-al-mughirah', claims: ['walid/hears-quran'] },
    { person: 'prophet-muhammad', claims: ['walid/hears-quran'] },
    { person: 'abu-jahl-ibn-hisham', claims: ['walid/hears-quran'] },
  ],
  tags: ['HEARD_QURAN', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '74:11',
      to: '74:26',
      evidence: [
        { source: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 125, url: 'https://shamela.ws/book/10906/263', quote: 'فنزلت: {ذَرْنِي وَمَنْ خَلَقْتُ وَحِيدًا} [المدثر: ١١] ، يعني الآيات.' },
        { source: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 126, url: 'https://shamela.ws/book/10906/264', quote: 'فأنزل في الوليد: {ذَرْنِي وَمَنْ خَلَقْتُ وَحِيدًا} إلى قوله: {سَأُصْلِيهِ سَقَرَ} [المدثر: ١١-٢٦]' },
        { source: 'tafsir-sadi', page: 896, quote: 'هذه الآيات، نزلت في الوليد بن المغيرة' },
      ],
    },
  ],
  reports: [
    {
      isnad: 'وقال البيهقي: أخبرنا الحاكم، قال: أخبرنا محمد بن علي الصنعاني بمكة، قال: حدثنا إسحاق بن إبراهيم، قال: أخبرنا عبد الرزاق، عن معمر، عن أيوب، عن عكرمة، عن أبن عباس',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 124, endPage: 125, url: 'https://shamela.ws/book/10906/262' },
      grading: 'هكذا رواه الحاكم موصولا. ورواه معمر، عن عباد بن منصور، عن عكرمة مرسلا. ورواه مختصرا حماد بن زيد، عن أيوب، عن عكرمة مرسلا.',
      moments: [
        { title: 'كأنه رقّ له', text: 'أن الوليد بن المغيرة جاء إلى النبي صلى الله عليه وسلم فقرأ عليه القرآن، فكأن رق له،', people: ['al-walid-ibn-al-mughirah', 'prophet-muhammad'] },
        { title: 'أبو جهل يأتيه', text: 'فبلغ ذلك أبا جهل، فأتاه فقال: يا عم إن قومك يرون أن يجمعوا لك مالا. قال: لم؟ قال: ليعطوك فإنك أتيت محمدا لتعرض لما قبله. قال: قد علمت أني من أكثرها مالا. قال: فقل فيه قولا يبلغ قومك أنك منكر لها، أو أنك كاره له.', people: ['abu-jahl-ibn-hisham', 'al-walid-ibn-al-mughirah'] },
        { title: 'شهادته', text: 'قال: وماذا أقول؟ فوالله ما فيكم رجل أعلم بالأشعار مني، ولا أعلم برجزه ولا بقصيدته مني، ولا بأشعار الجن، والله ما يشبه الذي يقول شيئا من هذا، ووالله إن لقوله الذي يقول حلاوة، وإن عليه لطلاوة، وإنه لمثمر أعلاه، مغدق أسفله، وإنه ليعلو وما يعلى، وإنه ليحطم ما تحته.', people: ['al-walid-ibn-al-mughirah', 'abu-jahl-ibn-hisham'] },
        { title: '«سحر يؤثر»', text: 'قال: لا يرضى عنك قومك حتى تقول فيه. قال: فدعني حتى أفكر فيه. فلما فكر قال: هذا سحر يؤثر، يأثره عن غيره، فنزلت: {ذَرْنِي وَمَنْ خَلَقْتُ وَحِيدًا} [المدثر: ١١] ، يعني الآيات.', people: ['abu-jahl-ibn-hisham', 'al-walid-ibn-al-mughirah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default alWalidHearsTheQuran;
