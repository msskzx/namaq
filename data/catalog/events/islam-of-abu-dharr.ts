import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Two narrations of one conversion, and they differ on who led him in: Ibn
 * Abbas has Ali meet him at Zamzam, Abd Allah ibn al-Samit has him find the
 * Prophet himself. The model records one description, so it keeps what both
 * agree on -- the concealment he refused. The story (owner, 2026-11-18) gives
 * each whole, attributed by its chain: Abd Allah ibn al-Samit's (Muslim) first as
 * the fullest, then Ibn Abbas's (both Sahihs) and Abu Dharr's «ربع الإسلام»
 * (al-Sira 1 pp133-136).
 *
 * Ibn Abbas's report follows as al-Bukhari prints it (3861), whole.
 */
const islamOfAbuDharr = {
  kind: 'EVENT',
  slug: 'islam-of-abu-dharr',
  name: 'إسلام أبي ذر الغفاري',
  nameTransliterated: 'The Islam of Abu Dharr al-Ghifari',
  type: 'OTHER',
  fields: {
    location: { value: 'مكة', claims: ['abu-dharr/islam'] },
    description: {
      value:
        'أسلم أبو ذر فقال له النبي صلى الله عليه وسلم: اكتم إسلامك وارجع إلى قومك. فقال: والله لأصرخن بها بين أظهرهم، فجاء المسجد فنادى بالشهادة، فضرب حتى كاد يموت، فأدركه العباس فأكب عليه.',
      claims: ['abu-dharr/islam'],
    },
  },
  people: [
    { person: 'abu-dharr-al-ghifari', claims: ['abu-dharr/islam'] },
    { person: 'prophet-muhammad', claims: ['abu-dharr/islam'] },
    { person: 'unays-ibn-junadah-al-ghifari', claims: ['abu-dharr/islam-ghifar'] },
    { person: 'abu-bakr-as-siddiq', claims: ['abu-dharr/islam-ghifar'] },
    { person: 'ali-ibn-abi-talib', claims: ['abu-dharr/islam'] },
    { person: 'al-abbas-ibn-abd-al-muttalib', claims: ['abu-dharr/islam'] },
  ],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: "وقال سليمان بن المغيرة: حدثنا حميد بن هلال، عن عبد الله بن الصامت قال: قال أبو ذر:",
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 133, endPage: 135, url: 'https://shamela.ws/book/10906/271' },
      grading: "أخرجه مسلم عن هدبة، عن سليمان.",
      moments: [
        { title: "مع خاله", text: "خرجنا من قومنا غفار، وكانوا يحلون الشهر الحرام، فخرجت أنا وأخي أنيس وأمنا، فانطلقنا حتى نزلنا على خال لنا ذي مال وهيئة فأكرمنا, فحسدنا قومه، فقالوا: إنك إذا خرجت عن أهلك خالف إليهم أنيس. فجاء خالنا فنثا علينا ما قيل له. فقلت له: أما ما مضى من معروفك، فقد كدرته ولا جماع لك فيما بعد، فقربنا صرمتنا فاحتملنا عليها، وتغطى خالنا ثوبه، فجعل يبكي، فانطلقنا فنزلنا بحضرة مكة، فنافر أنيس عن صرمتنا وعن مثلها، فأتينا الكاهن فخير أنيسا، فأتانا بصرمتنا ومثلها معها.", people: ["abu-dharr-al-ghifari", "unays-ibn-junadah-al-ghifari"],
          turns: [
            { text: "خرجنا من قومنا غفار، وكانوا يحلون الشهر الحرام، فخرجت أنا وأخي أنيس وأمنا، فانطلقنا حتى نزلنا على خال لنا ذي مال وهيئة فأكرمنا, فحسدنا قومه، فقالوا: إنك إذا خرجت عن أهلك خالف إليهم أنيس. فجاء خالنا فنثا علينا ما قيل له." },
            { text: "فقلت له: أما ما مضى من معروفك، فقد كدرته ولا جماع لك فيما بعد،", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "فقلت له:", teller: true },
            { text: "فقربنا صرمتنا فاحتملنا عليها، وتغطى خالنا ثوبه، فجعل يبكي، فانطلقنا فنزلنا بحضرة مكة، فنافر أنيس عن صرمتنا وعن مثلها، فأتينا الكاهن فخير أنيسا، فأتانا بصرمتنا ومثلها معها." },
          ] },
        { title: "صلّى قبل أن يلقاه", text: "قال: وقد صليت يابن أخي قبل أن ألقى رسول الله صلى الله عليه وسلم بثلاث سنين، فقلت: لمن؟ قال لله. قلت: فأين توجه؟ قال: أتوجه حيث يوجهني الله أصلي عشاء, حتى إذا كان من آخر الليل ألقيت كأني خفاء -يعني الثوب- حتى تعلوني الشمس.", people: ["abu-dharr-al-ghifari"],
          turns: [
            { text: "قال: وقد صليت يابن أخي قبل أن ألقى رسول الله صلى الله عليه وسلم بثلاث سنين،", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 13, quote: "قال عبد الله بن الصامت (قال) لنا أبو ذر (وقد صليت يا ابن أخي)", url: "https://shamela.ws/book/18268/10261" } },
            { text: "فقلت: لمن؟", speaker: { name: "عبد الله بن الصامت" }, lead: "فقلت:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 13, quote: "قال عبد الله بن الصامت (قلت) لأبي ذر (لمن)", url: "https://shamela.ws/book/18268/10261" } },
            { text: "قال لله.", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قال", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 13, quote: "(قال) أبو ذر أصلي (لله)", url: "https://shamela.ws/book/18268/10261" } },
            { text: "قلت: فأين توجه؟", speaker: { name: "عبد الله بن الصامت" }, lead: "قلت:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 13, quote: "قال عبد الله بن الصامت (قلت) لأبي ذر (لمن) تصلي (قال) أبو ذر أصلي (لله) قال عبد الله (قلت) لأبي ذر (فأين توجه)", url: "https://shamela.ws/book/18268/10261" } },
            { text: "قال: أتوجه حيث يوجهني الله أصلي عشاء, حتى إذا كان من آخر الليل ألقيت كأني خفاء -يعني الثوب- حتى تعلوني الشمس.", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 13, quote: "(قال) أبو ذر (أتوجه)", url: "https://shamela.ws/book/18268/10261" } },
          ] },
        { title: "ما سمعه أنيس بمكة", text: "فقال أنيس: إن لي حاجة بمكة فاكفني حتى آتيك. فأتى مكة فراث -أي أبطأ- عليَّ، ثم أتاني فقلت ما حبسك؟ قال: لقيت رجلا بمكة يزعم أن الله أرسله على دينك. قلت: ما يقول الناس؟ قال: يقولون: إنه شاعر، وساحر، وكاهن، وكان أنيس أحد الشعراء. فقال: لقد سمعت قول الكهنة، فما هو بقولهم، ولو وضعت قوله على أقوال الشعراء, فما يلتئم على لسان أحد بعدي أنه شعر، ووالله إنه لصادق، وإنهم لكاذبون", people: ["unays-ibn-junadah-al-ghifari", "abu-dharr-al-ghifari"],
          turns: [
            { text: "فقال أنيس: إن لي حاجة بمكة فاكفني حتى آتيك.", speaker: { person: "unays-ibn-junadah-al-ghifari", name: "أنيس" }, lead: "فقال أنيس:" },
            { text: "فأتى مكة فراث -أي أبطأ- عليَّ، ثم أتاني" },
            { text: "فقلت ما حبسك؟", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "فقلت", teller: true },
            { text: "قال: لقيت رجلا بمكة يزعم أن الله أرسله على دينك.", speaker: { person: "unays-ibn-junadah-al-ghifari", name: "أنيس" }, lead: "قال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 14, quote: "(قال) أنيس (لقيت رجلًا)", url: "https://shamela.ws/book/18268/10262" } },
            { text: "قلت: ما يقول الناس؟", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قلت:", teller: true },
            { text: "قال: يقولون: إنه شاعر، وساحر، وكاهن،", speaker: { person: "unays-ibn-junadah-al-ghifari", name: "أنيس" }, lead: "قال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 14, quote: "(قال) لي أنيس (يقولون)", url: "https://shamela.ws/book/18268/10262" } },
            { text: "وكان أنيس أحد الشعراء." },
            { text: "فقال: لقد سمعت قول الكهنة، فما هو بقولهم، ولو وضعت قوله على أقوال الشعراء, فما يلتئم على لسان أحد بعدي أنه شعر، ووالله إنه لصادق، وإنهم لكاذبون", speaker: { person: "unays-ibn-junadah-al-ghifari", name: "أنيس" }, lead: "فقال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 14, quote: "(قال أنيس) والله (لقد سمعت قول الكهنة)", url: "https://shamela.ws/book/18268/10262" } },
          ] },
        { title: "بين الكعبة وأستارها", text: "قال: قلت له: هل أنت كافيني حتى أنطلق فأنظر؟ قال: نعم، وكن من أهل مكة على حذر، فإنهم قد شنفوا له وتجهموا. فأتيت مكة، فتضعفت رجلا، فقلت: أين هذا الذي تدعونه الصابئ؟ قال: فأشار إلى الصابئ. قال: فمال عليَّ أهل الوادي بكل مدرة وعظم، حتى خررت مغشيا عليَّ، فارتفعت حين ارتفعت، كأني نصب أحمر، فأتيت زمزم فشربت من مائها، وغسلت عني الدم، فدخلت بين الكعبة وأستارها، ولقد لبثت يابن أخي ثلاثين من بين ليلة ويوم، وما لي طعام إلا ماء زمزم، فسمنت حتى تكسرت عكن بطني، وما وجدت على كبدي سخفة جوع.", people: ["abu-dharr-al-ghifari"],
          turns: [
            { text: "قال: قلت له: هل أنت كافيني حتى أنطلق فأنظر؟", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قال: قلت له:", teller: true },
            { text: "قال: نعم، وكن من أهل مكة على حذر، فإنهم قد شنفوا له وتجهموا. فأتيت مكة، فتضعفت رجلا،" },
            { text: "فقلت: أين هذا الذي تدعونه الصابئ؟", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "فقلت:", teller: true },
            { text: "قال: فأشار إلى الصابئ. قال: فمال عليَّ أهل الوادي بكل مدرة وعظم، حتى خررت مغشيا عليَّ، فارتفعت حين ارتفعت، كأني نصب أحمر، فأتيت زمزم فشربت من مائها، وغسلت عني الدم، فدخلت بين الكعبة وأستارها، ولقد لبثت يابن أخي ثلاثين من بين ليلة ويوم، وما لي طعام إلا ماء زمزم، فسمنت حتى تكسرت عكن بطني، وما وجدت على كبدي سخفة جوع." },
          ] },
        { title: "المرأتان", text: "فبينما أهل مكة، في قمراء إضحيان، قد ضرب الله على أصمخة أهل مكة فما يطوف بالبيت أحد غير امرأتين، فأتتا عليَّ، وهما تدعوان إسافا ونائلة، فأتتا علي في طوافهما، فقلت: أنكحا أحدهما الأخرى. قال: فما تناهتا عن قولهما -وفي لفظ: فما ثناهما ذلك عما قالتا- فأتتا علي فقلت: هن مثل الخشبة، غير أني لا أكنى. فانطلقتا تولولان، وتقولان: لو كان ههنا أحد من أنفارنا. فاستقبلهما رسول الله صلى الله عليه وسلم وأبو بكر، وهما هابطان من الجبل، فقالا لهما: ما لكما؟ قالتا: الصابئ بين الكعبة وأستارها. قالا: ما قال لكما؟ قالتا: قال لنا كلمة تملأ الفم.", people: ["abu-dharr-al-ghifari", "prophet-muhammad", "abu-bakr-as-siddiq"],
          turns: [
            { text: "فبينما أهل مكة، في قمراء إضحيان، قد ضرب الله على أصمخة أهل مكة فما يطوف بالبيت أحد غير امرأتين، فأتتا عليَّ، وهما تدعوان إسافا ونائلة، فأتتا علي في طوافهما،" },
            { text: "فقلت: أنكحا أحدهما الأخرى.", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "فقلت:", teller: true },
            { text: "قال: فما تناهتا عن قولهما -وفي لفظ: فما ثناهما ذلك عما قالتا- فأتتا علي" },
            { text: "فقلت: هن مثل الخشبة، غير أني لا أكنى.", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "فقلت:", teller: true },
            { text: "فانطلقتا تولولان، وتقولان: لو كان ههنا أحد من أنفارنا. فاستقبلهما رسول الله صلى الله عليه وسلم وأبو بكر، وهما هابطان من الجبل، فقالا لهما: ما لكما؟ قالتا: الصابئ بين الكعبة وأستارها. قالا: ما قال لكما؟ قالتا: قال لنا كلمة تملأ الفم." },
          ] },
        { title: "أول من حيّاه بتحية الإسلام", text: "فجاء رسول الله صلى الله عليه وسلم وصاحبه، فاستلم الحجر، ثم طافا، فلما قضى صلاته أتيته، فكنت أول من حياه بتحية الإسلام. فقال: \"وعليك ورحمة الله\". ثم قال: \"ممن أنت؟ \" قلت: من غفار، فأهوى بيده فوضعها على جبينه فقلت في نفسي: كره أني انتميت إلى غفار، فأهويت لآخذ بيده، فقدعني صاحبه، وكان أعلم به مني, ثم رفع رأسه، فقال: \"متى كنت ههنا؟ \" قلت: قد كنت ههنا منذ ثلاثين بين ليلة ويوما. قال: \"فمن كان يطعمك؟ \" قلت: ما كان لي طعام إلا ماء زمزم. فقال: \"إنها مباركة، إنها طعام طعم، وشفاء سقم\".", people: ["prophet-muhammad", "abu-dharr-al-ghifari", "abu-bakr-as-siddiq"],
          turns: [
            { text: "فجاء رسول الله صلى الله عليه وسلم وصاحبه، فاستلم الحجر، ثم طافا، فلما قضى صلاته أتيته، فكنت أول من حياه بتحية الإسلام." },
            { text: "فقال: \"وعليك ورحمة الله\".", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فقال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 20, quote: "رسول الله ﷺ في الرد عليَّ (وعليك)", url: "https://shamela.ws/book/18268/10268" } },
            { text: "ثم قال: \"ممن أنت؟ \"", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "ثم قال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 20, quote: "(قال) لي رسول الله ﷺ (من أنت)", url: "https://shamela.ws/book/18268/10268" } },
            { text: "قلت: من غفار،", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قلت:", teller: true },
            { text: "فأهوى بيده فوضعها على جبينه فقلت في نفسي: كره أني انتميت إلى غفار، فأهويت لآخذ بيده، فقدعني صاحبه، وكان أعلم به مني, ثم رفع رأسه،" },
            { text: "فقال: \"متى كنت ههنا؟ \"", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فقال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 20, quote: "(مني ثم رفع) رسول الله ﷺ (رأسه) … (ثم قال) لي (متى كنت)", url: "https://shamela.ws/book/18268/10268" } },
            { text: "قلت: قد كنت ههنا منذ ثلاثين بين ليلة ويوما.", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قلت:", teller: true },
            { text: "قال: \"فمن كان يطعمك؟ \"", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "قال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 21, quote: "رسول الله ﷺ (فمن كان يطعمك)", url: "https://shamela.ws/book/18268/10269" } },
            { text: "قلت: ما كان لي طعام إلا ماء زمزم.", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قلت:", teller: true },
            { text: "فقال: \"إنها مباركة، إنها طعام طعم، وشفاء سقم\".", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فقال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 21, quote: "(ـقال) رسول الله ﷺ (إنها)", url: "https://shamela.ws/book/18268/10269" } },
          ] },
        { title: "طعام أبي بكر", text: "فقال أبو بكر: ائذن لي يا رسول الله في طعامه الليلة. ففعل، فانطلقا، وانطلقت معهما، حتى فتح أبو بكر بابا، فجعل يقبض لنا من زبيب الطائف، فكان ذلك أول طعام أكلته بها.", people: ["abu-bakr-as-siddiq", "prophet-muhammad", "abu-dharr-al-ghifari"],
          turns: [
            { text: "فقال أبو بكر: ائذن لي يا رسول الله في طعامه الليلة.", speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: "فقال أبو بكر:" },
            { text: "ففعل، فانطلقا، وانطلقت معهما، حتى فتح أبو بكر بابا، فجعل يقبض لنا من زبيب الطائف، فكان ذلك أول طعام أكلته بها." },
          ] },
        { title: "إلى قومه غفار", text: "قال: فغبرت ما غبرت ثم أتيت رسول الله صلى الله عليه وسلم، فقال: \"إني قد وجهت إلى أرض ذات نخل لا أحسبها إلا يثرب، فهل أنت مبلغ عني قومك لعل الله أن ينفعهم بك ويأجرك فيهم؟ \". فانطلقت حتى أتيت أخي أنيسا فقال لي: ما صنعت؟ قلت: صنعت أني أسلمت وصدقت. ثم أتينا أمنا فقالت: ما بي رغبة عن دينكما. فأسلمت، ثم احتملا حتى أتينا قومنا غفار، فأسلم نصفهم قبل أن يقدم رسول الله صلى الله عليه وسلم المدينة، وكان يؤمهم خفاف بن إيماء بن رحضة الغفاري، وكان سيدهم يومئذ، وقال بقيتهم: إذا قدم رسول الله صلى الله عليه وسلم أسلمنا، فقدم المدينة فأسلم بقيتهم. وجاءت أسلم فقالوا: يا رسول الله إخواننا، نسلم على الذي أسلموا عليه، فأسلموا فقال: \"غفار غفر الله لها، وأسلم سالمها الله\".", people: ["prophet-muhammad", "abu-dharr-al-ghifari", "unays-ibn-junadah-al-ghifari"],
          turns: [
            { text: "قال: فغبرت ما غبرت ثم أتيت رسول الله صلى الله عليه وسلم،" },
            { text: "فقال: \"إني قد وجهت إلى أرض ذات نخل لا أحسبها إلا يثرب، فهل أنت مبلغ عني قومك لعل الله أن ينفعهم بك ويأجرك فيهم؟ \".", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فقال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 22, quote: "(أتيت رسول الله ﷺ فقال) لي رسول الله ﷺ", url: "https://shamela.ws/book/18268/10270" } },
            { text: "فانطلقت حتى أتيت أخي أنيسا" },
            { text: "فقال لي: ما صنعت؟", speaker: { person: "unays-ibn-junadah-al-ghifari", name: "أنيس" }, lead: "فقال لي:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 22, quote: "(فقال) لي أنيس (ما صنعت)", url: "https://shamela.ws/book/18268/10270" } },
            { text: "قلت: صنعت أني أسلمت وصدقت.", speaker: { person: "abu-dharr-al-ghifari", name: "أبو ذر" }, lead: "قلت:", teller: true },
            { text: "ثم أتينا أمنا" },
            { text: "فقالت: ما بي رغبة عن دينكما.", speaker: { name: "أمّنا" }, lead: "فقالت:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 23, quote: "(فقالت) أمّنا (ما بي رغبة)", url: "https://shamela.ws/book/18268/10271" } },
            { text: "فأسلمت، ثم احتملا حتى أتينا قومنا غفار، فأسلم نصفهم قبل أن يقدم رسول الله صلى الله عليه وسلم المدينة، وكان يؤمهم خفاف بن إيماء بن رحضة الغفاري، وكان سيدهم يومئذ، وقال بقيتهم: إذا قدم رسول الله صلى الله عليه وسلم أسلمنا، فقدم المدينة فأسلم بقيتهم. وجاءت أسلم فقالوا: يا رسول الله إخواننا، نسلم على الذي أسلموا عليه، فأسلموا" },
            { text: "فقال: \"غفار غفر الله لها، وأسلم سالمها الله\".", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فقال:", witness: { source: "kawkab-wahhaj", volume: 24, volumeLabel: "24", page: 24, quote: "(فقال رسول الله ﷺ) لهما (غفار غفر الله لها وأسلم سالمها الله)", url: "https://shamela.ws/book/18268/10272" } },
          ] },
      ],
    },
    {
      isnad: "وفي الصحيحين من حديث مثنى بن سعيد، عن أبي جمرة الضبعي، أن ابن عباس",
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 135, endPage: 136, url: 'https://shamela.ws/book/10906/273' },
      moments: [
        { title: "أرسل أخاه", text: "حدثهم بإسلام أبي ذر، قال: أرسلت أخي فرجع وقال: رأيت رجلا يأمر بالخير. فلم يشفني,", people: ["abu-dharr-al-ghifari"] },
        { title: "عليّ يدلّه", text: "فأتيت مكة، فجعلت لا أعرفه، وأشرب من زمزم، فمر بي عليٌّ، فقال: كأنك غريب. قلت: نعم قال: انطلق إلى المنزل فانطلقت معه، فلم أسأله، فلما أصبحنا، جئت المسجد، ثم مر بي عليٌّ، فقال: أما آن لك أن تعود؟ قلت: لا. قال: ما أمرك؟ قلت: إن كتمت عليَّ أخبرتك, ثم قلت: بلغنا أنه خرج نبي. قال: قد رشدت فاتبعني.", people: ["abu-dharr-al-ghifari", "ali-ibn-abi-talib"] },
        { title: "أسلم", text: "فأتينا النبي صلى الله عليه وسلم فقلت: اعرض عليَّ الإسلام. فعرضه عليَّ، فأسلمت، فقال: اكتم إسلامك وارجع إلى قومك.", people: ["abu-dharr-al-ghifari", "prophet-muhammad"] },
        { title: "صرخ بها في المسجد", text: "قلت: والله لأصرخن بها بين أظهرهم، فجاء في المسجد, فقال: يا معاشر قريش أشهد أن لا إله إلا الله، وأن محمدا عبده ورسوله. فقالوا: قوموا إلى هذا الصابئ فقاموا، فضربت لأموت، فأدركني العباس فأكب عليَّ وقال: تقتلون، ويلكم رجلا من بني غفار، ومتجركم وممركم على غفار؟! فأطلقوا عني. ثم فعلت من الغد كذلك، وأدركني العباس أيضا.", people: ["abu-dharr-al-ghifari", "al-abbas-ibn-abd-al-muttalib"] },
      ],
    },
    {
      isnad: "وقال النضر بن محمد اليمامي: حدثنا عكرمة بن عمار، عن أبي زميل سماك بن الوليد، عن مالك بن مرثد، عن أبيه، عن أبي ذر قال:",
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 136, url: 'https://shamela.ws/book/10906/274' },
      moments: [
        { title: "ربع الإسلام", text: "كنت ربع الإسلام، أسلم قبل ثلاثة نفر، أتيت النبي صلى الله عليه وسلم فقلت: السلام عليك يا رسول الله، أشهد أن لا إله إلا الله، وأن محمدا عبده ورسوله، فرأيت الاستبشار في وجهه.", people: ["abu-dharr-al-ghifari", "prophet-muhammad"] },
      ],
    },
    {
      isnad: sahih('bukhari', 3861, 0, 160),
      source: { slug: 'sahih-al-bukhari', hadith: 3861, url: 'https://sunnah.com/bukhari:3861' },
      moments: [
        { title: "أرسل أخاه", text: sahih('bukhari', 3861, 161, 411), people: ['abu-dharr-al-ghifari', 'prophet-muhammad'] },
        { title: "«ما شفيتني مما أردت»", text: sahih('bukhari', 3861, 412, 638), people: ['abu-dharr-al-ghifari', 'prophet-muhammad'] },
        { title: "يلتمسه ولا يعرفه", text: sahih('bukhari', 3861, 639, 837), people: ['abu-dharr-al-ghifari', 'prophet-muhammad'] },
        { title: "علي يعرف أنه غريب", text: sahih('bukhari', 3861, 838, 976), people: ['ali-ibn-abi-talib', 'abu-dharr-al-ghifari'] },
        { title: "«أما نال للرجل أن يعلم منزله؟»", text: sahih('bukhari', 3861, 977, 1361), people: ['abu-dharr-al-ghifari', 'ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«ألا تحدثني ما الذي أقدمك»", text: sahih('bukhari', 3861, 1362, 1530), people: ['ali-ibn-abi-talib', 'abu-dharr-al-ghifari'] },
        { title: "«فإنه حق، وهو رسول الله ﷺ»", text: sahih('bukhari', 3861, 1531, 1758), people: ['ali-ibn-abi-talib', 'abu-dharr-al-ghifari', 'prophet-muhammad'] },
        { title: "أسلم مكانه", text: sahih('bukhari', 3861, 1759, 1875), people: ['abu-dharr-al-ghifari', 'ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«لأصرخن بها بين ظهرانيهم»", text: sahih('bukhari', 3861, 1876, 2183), people: ['prophet-muhammad', 'abu-dharr-al-ghifari'] },
        { title: "العباس يكب عليه", text: sahih('bukhari', 3861, 2184, 2511), people: ['abu-dharr-al-ghifari', 'al-abbas-ibn-abd-al-muttalib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfAbuDharr;
