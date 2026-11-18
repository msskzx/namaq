import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Quraysh sent Utbah ibn Rabi'ah to the Prophet ﷺ with an offer of leadership, wives and wealth, and he answered by
 * reciting the opening of Fussilat. al-Dhahabi gives three reports one after another (al-Sira 1 pp126-128): Jabir's,
 * which names the offer and how far he recited, is the story; Ibn Umar's and Muhammad ibn Ka'b al-Qurazi's follow it in
 * full. The book grades none of them, so the page names who reported each (owner, 2026-11-18).
 */
const utbahOffersAndHearsFussilat = {
  kind: 'EVENT',
  slug: 'utbah-offers-and-hears-fussilat',
  name: 'عتبة بن ربيعة يعرض على النبي ﷺ',
  nameTransliterated: "Utbah ibn Rabi'ah's offer",
  type: 'OTHER',
  fields: {},
  people: [
    { person: 'utbah-ibn-rabiah', claims: ['utbah/hears-fussilat'] },
    { person: 'prophet-muhammad', claims: ['utbah/hears-fussilat'] },
    { person: 'abu-jahl-ibn-hisham', claims: ['utbah/hears-fussilat'] },
  ],
  tags: ['HEARD_QURAN'],
  ayat: [
    {
      kind: 'RECITED',
      // How far he recited is Jabir's report; al-Qurazi's says he went on to the sajda, shown beside it.
      report: 'في رواية جابر',
      from: '41:1',
      to: '41:13',
      evidence: [
        { source: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 127, url: 'https://shamela.ws/book/10906/265', quote: 'فقرأ حتى بلغ {أَنْذَرْتُكُمْ صَاعِقَةً مِثْلَ صَاعِقَةِ عَادٍ وَثَمُودَ} [فصلت: ١٣]' },
      ],
      others: [
        { label: 'وفي رواية محمد بن كعب القرظي', evidence: [{ source: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 128, url: 'https://shamela.ws/book/10906/266', quote: 'فلما انتهى رسول الله صلى الله عليه وسلم إلى السجدة سجد' }] },
      ],
    },
  ],
  reports: [
    {
      isnad: 'وقال محمد بن فضيل: حدثنا الأجلح، عن الذيال بن حرملة، عن جابر بن عبد الله، قال:',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 126, endPage: 127, url: 'https://shamela.ws/book/10906/264' },
      grading: 'رواه يحيى بن معين عنه',
      moments: [
        { title: 'قريش ترسله', text: 'قال أبو جهل والملأ من قريش: لقد انتشر علينا أمر محمد، فلو التمستم رجلا عالما بالسحر والكهانة والشعر، فكلمه ثم أتانا ببيان من أمره. فقال عتبة: لقد سمعت بقول السحرة والكهانة والشعر، وعلمت من ذلك علماء، وما يخفى عليّ إن كان كذلك. فأتاه،', people: ['abu-jahl-ibn-hisham', 'utbah-ibn-rabiah'] },
        { title: 'العرض', text: 'فلما أتاه قال له عتبة: يا محمد أنت خير أم هاشم؟ أنت خير أم عبد المطلب؟ أنت خير أم عبد الله؟ فلم يجبه، قال: فبم تشتم آلهتنا وتضلل آباءنا؟ فإن كنت إنما بك الرياسة عقدنا لك ألويتنا، فكنت رأسنا ما بقيت, وإن كان بك الباءة زوجناك عشر نسوة تختار من أي أبيات قريش شئت، وإن كان بك المال جمعنا لك من أموالنا ما تستغني به أنت وعقبك من بعدك، ورسول الله صلى الله عليه وسلم ساكت،', people: ['utbah-ibn-rabiah', 'prophet-muhammad'] },
        { title: 'قرأ عليه فصلت', text: 'فلما فرغ قال رسول الله صلى الله عليه وسلم: "بسم الله الرحمن الرحيم {حم، تَنْزِيلٌ مِنَ الرَّحْمَنِ الرَّحِيمِ} ". [فصلت: ٢] ، فقرأ حتى بلغ {أَنْذَرْتُكُمْ صَاعِقَةً مِثْلَ صَاعِقَةِ عَادٍ وَثَمُودَ} [فصلت: ١٣] ، فأمسك عتبة على فيه، وناشده الرحم أن يكف عنه،', people: ['prophet-muhammad', 'utbah-ibn-rabiah'] },
        { title: 'قالوا: صبأ', text: 'ولم يخرج إلى أهله واحتبس عنهم، فقال أبو جهل: يا معشر قريش والله ما نرى عتبة إلا قد صبأ إلى محمد، وأعجبه طعامه، وما ذاك إلا من حاجة أصابته، انطلقوا بنا إليه. فأتوه، فقال أبو جهل: والله يا عتبة ما حسبنا إلا أنك صبوت، فإن كانت بك حاجة جمعنا لك ما يغنيك عن طعام محمد.', people: ['utbah-ibn-rabiah', 'abu-jahl-ibn-hisham'] },
        { title: '«ما هو بسحر ولا شعر ولا كهانة»', text: 'فغضب وأقسم بالله لا يكلم محمدا أبدا، وقال: لقد علمتم أني من أكثر قريش مالا ولكني أتيته، فقص عليهم القصة، فأجابني بشيء والله ما هو بسحر ولا شعر ولا كهانة، قرأ: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ {حم، تَنْزِيلٌ مِنَ الرَّحْمَنِ الرَّحِيمِ، كِتَابٌ فُصِّلَتْ آيَاتُهُ قُرْآنًا عَرَبِيًّا لِقَوْمٍ يَعْلَمُونَ} ". [فصلت: ١-٣] ، حتى بلغ {أَنْذَرْتُكُمْ صَاعِقَةً مِثْلَ صَاعِقَةِ عَادٍ وَثَمُودَ} [فصلت: ١٣] ، فأمسكت بفيه، وناشدته الرحم أن يكف، وقد علمتم أن محمدا إذا قال شيئا لم يكذب، فخفت أن ينزل بكم العذاب.', people: ['utbah-ibn-rabiah'] },
      ],
    },
    {
      isnad: 'وقال داود بن عمرو الضبي: حدثنا المثنى بن زرعة، عن محمد بن إسحاق، عن نافع، عن ابن عمر، قال:',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 127, endPage: 128, url: 'https://shamela.ws/book/10906/265' },
      moments: [
        { title: 'رواية ابن عمر', text: 'لما قرأ النبي صلى الله عليه وسلم على عتبة بن ربيعة {حم، تَنْزِيلٌ مِنَ الرَّحْمَنِ الرَّحِيمِ، كِتَابٌ فُصِّلَتْ آيَاتُهُ قُرْآنًا عَرَبِيًّا لِقَوْمٍ يَعْلَمُونَ} أتى أصحابه فقال لهم: يا قوم أطيعوني في هذا اليوم واعصوني فيما بعده، فوالله لقد سمعت من هذا الرجل كلاما ما سمعت أذناي قط كلاما مثله، وما دريت ما أرد عليه.', people: ['prophet-muhammad', 'utbah-ibn-rabiah'] },
      ],
    },
    {
      isnad: 'قال ابن إسحاق: حدثنا يزيد بن أبي زياد، عن محمد بن كعب القرظي، قال:',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 128, url: 'https://shamela.ws/book/10906/266' },
      moments: [
        { title: 'رواية محمد بن كعب القرظي', text: 'حدثت أن عتبة بن ربيعة، لما أسلم حمزة قالوا له: يا أبا الوليد كلم محمدا. فأتاه فقال: يابن أخي إنك منا حيث علمت من البسطة والمكان في النسب، وإنك أتيت قومك بأمر عظيم، فرقت به بينهم، وسفهت أحلامهم، وعبت به آلهتهم، فاسمع مني. قال: قل يا أبا الوليد. قال: إن كنت تريد مالا جمعنا لك، حتى تكون أكثرنا مالا، وإن كنت تريد شرفا سودناك وملكناك، وإن كان الذي يأتيك رئيا طلبنا لك الطب. حتى إذا فرغ قال: فاسمع مني. قال: أفعل. قال: {حم، تَنْزِيلٌ مِنَ الرَّحْمَنِ الرَّحِيمِ، كِتَابٌ فُصِّلَتْ آيَاتُهُ} [فصلت: ١-٣] ، ومضى، فأنصت عتبة، وألقى يديه خلف ظهره معتمدا عليهما يسمع منه، فلما انتهى رسول الله صلى الله عليه وسلم إلى السجدة سجد، ثم قال: "قد سمعت يا أبا الوليد فأنت وذاك". فقام إلى أصحابه، فقال بعضهم: نحلف والله لقد جاءكم أبو الوليد بغير الوجه الذي ذهب به. فلما جلس قالوا: ما وراءك؟ قال: ورائي أني سمعت قولا، والله ما سمعت مثله قط، والله ما هو بالشعر ولا بالسحر ولا بالكهانة، يا معشر قريش أطيعوني، واجعلوها بي، خلوا بين هذا الرجل وبين ما هو فيه فاعتزلوه، فوالله ليكونن لقوله نبأ، فإن تصبه العرب فقد كفيتموه بغيركم، وإن يظهر على العرب، فملكه ملككم، وعزه عزكم، وكنتم أسعد الناس به. قالوا: سحرك والله بلسانه. قال: هذا رأيي فيه فاصنعوا ما بدا لكم.', people: ['utbah-ibn-rabiah', 'hamzah-ibn-abd-al-muttalib', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default utbahOffersAndHearsFussilat;
