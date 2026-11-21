# Audit: hadith sciences sources

[inferred] Use al-Bayquniyya for a first bounded terms page, with separately attributed prose comparisons and examples.
[checked in repo] The current fifty-entry corpus already records grades for Ibn Rajab's nos. 47, 49 and 50.
[checked against source] Ibn Hajar's narrator rank and generation statements must remain two separate attributed classifications.
[checked in repo] There are 20 Bukhari chain records, 104 narrator occurrences and 88 exact name forms across the fifty entries.
[inferred] Build term citations first; keep uncertain narrator identities unresolved and require edition collation before publishing new source text.

[checked in repo] Research snapshot: 21 November 2026, main `133f3deb`. Read AGENTS.md, the records, [the previous hadith audit](2026-11-18-hadith-sources.md), [the source registry](../../shared/sources.ts), [forty.json](../../data/hadith/forty.json) and [forty-map.json](../../data/hadith/forty-map.json). This file adds no app code or shipped data. It does not reopen the previous audit's collection editions, Ibn Rajab edition, Taqrib edition problem or provider licences. The full Sahihayn and the choice of another collection are outside scope.

[inferred] Labels apply to whole paragraphs and table rows unless a cell has its own label. “Checked against source” identifies an inspected scholarly digital witness, not an assertion that a scan was visually collated. Printed locators below are the edition's reported pagination; Shamela digital IDs are recorded separately. **The new quotations have not been visually collated against edition images.** Export downloads from `files.turath.io` remain blocked by this environment. This is an evidence ledger and a build-readiness assessment, not certification of a new publishable transcription. Definitions, rank words and judgments below are quotations; recommendations and identity decisions are ours and labelled accordingly. No translation is supplied.

## 1. Mustalah terms

### Comparison and choice

| Status | Work and author | Edition / digital witness | Count and size of definitions | Author's examples / decision |
| --- | --- | --- | --- | --- |
| Checked against source | al-Bayquniyya, attributed by the catalogue to Umar, also called Uta, b. Muhammad b. Futuh al-Bayquni, d. approximately 1080 AH | Dar al-Mughni, first 1420/1999, one volume, printed pp. 7–12; [Shamela 8567](https://shamela.ws/book/8567). The catalogue itself qualifies the name and death date. | 34 numbered verses. The table below contains 32 term units, our count with the two name-comparison pairs kept together; this is not a claim that the author numbered 32 definitions. Whole definitions take one or two verses. | Examples occur for المسلسل and المعنعن. Most rows have no separate example. [inferred] Recommended bounded first base because the whole defining passage fits a card and its complete inventory is below. Do not present its wording as every scholar's terminology. |
| Checked against source | Ibn Hajar al-Asqalani, d. 852 AH, Nukhbat al-Fikar | Dar al-Hadith, Cairo, fifth 1418/1997, edited by Isam al-Sababti and Imad al-Sayyid, appended to Subul al-Salam; [Shamela 5940](https://shamela.ws/book/5940). | A continuous classification, not a numbered glossary with an author-declared total. It has well over thirty named categories, with embedded relations and a final list of further sciences. A count of numbered headings in a modern index would not count its definitions. Many definitions fit a sentence, but references such as الأول and الثاني need their preceding division. | Few developed examples in the matn. The card explicitly says square-bracket additions are selected commentary, not matn. [inferred] Strong next expansion, using the author's Nuzha to preserve context rather than inventing independent definitions from dependent clauses. A complete atomic-term count is not established here. |
| Checked against source | The same Ibn Hajar, Nuzhat al-Nazar, his own explanation | Nur al-Din Itr, Maktabat/matbaat al-Sabah, Damascus, third 1421/2000, 175 pages; [Shamela 1565](https://shamela.ws/book/1565). The card describes a copy read to the author. Al-Ruhayli's Safir first 1422 witness is another candidate, but historical IDs 12115 and 1184 now identify different works on the live Shamela site. | Expands the Nukhba divisions; there is no author-declared closed glossary count. Some complete definitions fit a sentence; discussions of حسن and حسن صحيح span pages. | Supplies actual examples, including الفرد المطلق. [inferred] Prefer Itr as the currently identifiable commentary witness for comparisons, subject to print collation. This is a practical witness choice, not a ranking of all editions. Keep Itr's comments, headings and footnotes separate. |
| Checked against source | Uthman b. Abd al-Rahman Ibn al-Salah, d. 643 AH, Ma'rifat anwa' ulum al-hadith | Nur al-Din Itr, Dar al-Fikr, Syria / Dar al-Fikr al-Muasir, Beirut, 1406/1986; [Shamela 22870](https://shamela.ws/book/22870). | 65 author-numbered kinds, as its contents show. These include biographical and practical sciences, so “65 kinds” is not “65 short definitions.” Subdefinitions increase the term count; an exhaustive atomic count is not established here. | Many examples and named alternative usages. [inferred] Use as attributed depth and a comparison source; a complete discussion often cannot fit a short card. |
| Checked against source | Yahya b. Sharaf al-Nawawi, d. 676 AH, al-Taqrib wa-l-Taysir | Muhammad Uthman al-Khisht, Dar al-Kitab al-Arabi, Beirut, first 1405/1985, 123 pages; [Shamela 5586](https://shamela.ws/book/5586). | 65 numbered kinds, shortening Ibn al-Salah through his Irshad. Again, this is an authorial topic count, not a count of atomic definitions. Many whole openings fit a paragraph. | Examples appear, e.g. المنقطع and المسند, with named alternative usages. [inferred] A useful prose companion. Do not strip “قال الخطيب” or “قال الحاكم” and relabel the resulting definition as Nawawi's own formulation. |

[inferred] The comparison distinguishes counted term units from numbered kinds and verses. A later data PR must enumerate every adopted definition, its complete dependent context and any author's example before advertising a larger glossary count. None of these books licenses Namaq to fill a missing example or modernize a definition.

### Complete al-Bayquniyya term inventory

[checked against source] All quotations in this table are from the Dar al-Mughni first 1420/1999 witness, volume 1, [Shamela 8567](https://shamela.ws/book/8567), digital pages 1–5. The `...` between half-verses is the witness's separator, not our omission. Verse numbers are locators, not part of the definition. A blank example means no distinct example is given in that defining passage. Spelling and vowel marks are retained, including suspect digital readings; these require scan comparison, not silent repair.

| Status | Term unit | Author's whole defining verse(s) | Author's separate example, where present | Printed page / Shamela digital page |
| --- | --- | --- | --- | --- |
| Checked against source | الصحيح | «أوَّلُها الصَّحِيحُ وَهْوَ مَا اتَّصل ... إسْنَادُهُ وَلَمْ يَشُذَّ أَوْ يُعَلْ»<br>«يَرْوِيهِ عَدْلٌ ضَابِطٌ عَنْ مِثْلِه ... مُعْتَمَدٌ فِي ضَبْطِهِ وَنَقْلِه» |  | 1/7; verses 3, 4; [digital 1](https://shamela.ws/book/8567/1) |
| Checked against source | الحسن | «والَحسَنُ المعروفُ طُرْقاً وَغَدَتْ ... رِجَالُهُ لاَ كالصّحيحِ اشْتَهَرَتْ» |  | 1/8; verses 5; [digital 2](https://shamela.ws/book/8567/2) |
| Checked against source | الضعيف | «وكُلُّ مَا عَنْ رُتْبَةِ الحسن قصر ... فهو الضعيف وَهْوَ أَقْسَاماً كُثُرْ» |  | 1/8; verses 6; [digital 2](https://shamela.ws/book/8567/2) |
| Checked against source | المرفوع | «وَمَا أُضيفَ لَلنَّبِي المَرْفُوعُ ... وَمَا لِتَابِعٍ هو المقطوع» |  | 1/8; verses 7; [digital 2](https://shamela.ws/book/8567/2) |
| Checked against source | المقطوع | «وَمَا أُضيفَ لَلنَّبِي المَرْفُوعُ ... وَمَا لِتَابِعٍ هو المقطوع» |  | 1/8; verses 7; [digital 2](https://shamela.ws/book/8567/2) |
| Checked against source | المسند | «والُمسنَدُ الُمتَّصِلُ الإسنادِ مِنْ ... رَاوِيهِ حَتَّى المُصْطَفَى وَلَمْ يَبِنْ» |  | 1/8; verses 8; [digital 2](https://shamela.ws/book/8567/2) |
| Checked against source | المتصل | «وَمَا بِسَمْعِ كُلِّ رَاوٍ يَتَّصِل ... إسْنَادُهُ لِلْمُصْطَفَى فَالْمُتَّصِل» |  | 1/8; verses 9; [digital 2](https://shamela.ws/book/8567/2) |
| Checked against source | المسلسل | «مُسَلْسَلٌ قُلْ مَا عَلَى وَصْفٍ أَتَى ... مِثْلُ أَمَا وَاللهِ أنْبأنِي الْفَتَى»<br>«كذَاكَ قَدْ حَدَّثَنِيهِ قَائما ... أَوْ بَعْدَ أَنْ حَدَّثَنِي تَبَسَّمَا» | كذَاكَ قَدْ حَدَّثَنِيهِ قَائما ... أَوْ بَعْدَ أَنْ حَدَّثَنِي تَبَسَّمَا | 1/8; verses 10, 11; [digital 2](https://shamela.ws/book/8567/2) |
| Checked against source | العزيز | «عَزِيزُ مَرْوِي اثْنَيْنِ أوْ ثَلاَثَهْ ... مَشْهُورُ مَرْوِي فوْقَ مَا ثَلاثهْ» |  | 1/9; verses 12; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | المشهور | «عَزِيزُ مَرْوِي اثْنَيْنِ أوْ ثَلاَثَهْ ... مَشْهُورُ مَرْوِي فوْقَ مَا ثَلاثهْ» |  | 1/9; verses 12; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | المعنعن | «مَعَنْعَنٌ كَعَن سَعِيدٍ عَنْ كَرَمْ ... وَمُبْهَمٌ مَا فِيهِ رَاوٍ لَمْ يُسَمْ» |  | 1/9; verses 13; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | المبهم | «مَعَنْعَنٌ كَعَن سَعِيدٍ عَنْ كَرَمْ ... وَمُبْهَمٌ مَا فِيهِ رَاوٍ لَمْ يُسَمْ» |  | 1/9; verses 13; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | العالي | «وَكُلُّ مَا قَلَّتْ رِجَالُهُ عَلاَ ... وَضِدُهُ ذاك الذي قد نَزَلا» |  | 1/9; verses 14; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | النازل | «وَكُلُّ مَا قَلَّتْ رِجَالُهُ عَلاَ ... وَضِدُهُ ذاك الذي قد نَزَلا» |  | 1/9; verses 14; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | الموقوف | «ومَا أضَفْتَهُ إِلَى الأَصْحَابِ مِنْ ... قَوْلٍ وفعل فهو مَوْقُوفٌ زُكنْ» |  | 1/9; verses 15; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | المرسل | «وَمُرْسلٌ مِنْهُ الصِّحَابِيُّ سَقَطْ ... وَقُلْ غَرِيبٌ مَا رَوَى رَاوٍ فَقَطْ» |  | 1/9; verses 16; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | الغريب | «وَمُرْسلٌ مِنْهُ الصِّحَابِيُّ سَقَطْ ... وَقُلْ غَرِيبٌ مَا رَوَى رَاوٍ فَقَطْ» |  | 1/9; verses 16; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | المنقطع | «وَكُلُّ مَا لَمْ يَتَّصِلْ بحال ... إسْنَادُهُ مُنْقَطِعُ الأوْصالِ» |  | 1/9; verses 17; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | المعضل | «والُمعْضَلُ الساقِط مِنه اثنانِ ... وما أتى مُدلساً نَوعانِ» |  | 1/9; verses 18; [digital 3](https://shamela.ws/book/8567/3) |
| Checked against source | المدلس | «والُمعْضَلُ الساقِط مِنه اثنانِ ... وما أتى مُدلساً نَوعانِ»<br>«الأَوَّلُ: الاسْقَاطُ لِلشَّيْخِ وَأَنْ ... ينقلُ عَمَّنْ فَوْقَهُ بِعَنْ وَأَنْ»<br>«والثَّانِ: لاَ يُسْقِطُهُ لَكِنْ يَصِفْ ... أَوْصَافَهُ بِمَا بِهِ لاَ ينعرف» |  | 1/9–10; verses 18, 19, 20; [digital 3](https://shamela.ws/book/8567/3)–[digital 4](https://shamela.ws/book/8567/4) |
| Checked against source | الشاذ | «وما يخلف ثِقَةٌ بِهِ الَملأ ... فالشاذُّ والَمقْلُوبُ قِسْمَانِ تَلا» |  | 1/10; verses 21; [digital 4](https://shamela.ws/book/8567/4) |
| Checked against source | المقلوب | «وما يخلف ثِقَةٌ بِهِ الَملأ ... فالشاذُّ والَمقْلُوبُ قِسْمَانِ تَلا»<br>«إبْدَالُ رَاوٍ مَا بِرَاوٍ قِسْمُ ... وَقَلْبُ إسْنَادٍ لمَتْنٍ قِسْمُ» |  | 1/10; verses 21, 22; [digital 4](https://shamela.ws/book/8567/4) |
| Checked against source | الفرد | «والفَردُ مَا قَيَّدْتَهُ بِثِقةِ ... أَوْ جَمْعٍ أوْ قَصْرٍ عَلَى روايةِ» |  | 1/10; verses 23; [digital 4](https://shamela.ws/book/8567/4) |
| Checked against source | المعلل | «ومَا بعِلَّةٍ غُمُوضٍ أَوْ خَفَا ... مُعَلَّلٌ عِنْدَهُمُ قَدْ عُرِفَا» |  | 1/10; verses 24; [digital 4](https://shamela.ws/book/8567/4) |
| Checked against source | المضطرب | «وذُو اخْتِلافِ سَنَدٍ أَوْ مَتْنِ ... مُضْطَرِبٌ عِنْدَ أُهَيْلِ الْفَنِّ» |  | 1/10; verses 25; [digital 4](https://shamela.ws/book/8567/4) |
| Checked against source | المدرج | «والُمدْرَجَاتُ فِي الحديثِ مَا أَتَتْ ... مِنْ بَعْض أَلْفَاظِ الرُّوَاةِ اتَّصَلَتْ» |  | 1/11; verses 26; [digital 5](https://shamela.ws/book/8567/5) |
| Checked against source | المدبج | «ومَا رَوى كُلُّ قَرِينٍ عَنْ أَخِهْ ... مُدّبَّجٌ فَأَعْرِفْهُ حَقًّا وانْتَخهْ» |  | 1/11; verses 27; [digital 5](https://shamela.ws/book/8567/5) |
| Checked against source | المتفق والمفترق | «مُتَّفِقٌ لَفْظاً وَخَطاً مُتَّفِقْ ... وضِدُّهُ فِيمَا ذَكَرْنَا المُفْتَرِقْ» |  | 1/11; verses 28; [digital 5](https://shamela.ws/book/8567/5) |
| Checked against source | المؤتلف والمختلف | «مُؤْتَلِفٌ مُتَّقِقُ الخَطِّ فَقَطْ ... وَضِدُّهُ مُخْتَلِفُ فَاخْشَ الْغَلَطْ» |  | 1/11; verses 29; [digital 5](https://shamela.ws/book/8567/5) |
| Checked against source | المنكر | «وَالمُنْكَرُ الْفَرْدُ بِهِ رَاوٍ غَدَا ... تَعْدِيلُهُ لاَ يْحمِلُ التَّفَرُّدَا» |  | 1/11; verses 30; [digital 5](https://shamela.ws/book/8567/5) |
| Checked against source | المتروك | «مَتْرُوكُهُ مَا وَاحِدٌ بِهِ انْفَرَدْ ... وَأَجْمَعُوا لِضَعْفِهِ فَهْوَ كَرَدْ» |  | 1/11; verses 31; [digital 5](https://shamela.ws/book/8567/5) |
| Checked against source | الموضوع | «وَالكَذِبُ المُخْتَلَقُ المَصْنُوعُ ... عَلَى النَّبِي فَذلِكَ الموْضوعُ» |  | 1/11; verses 32; [digital 5](https://shamela.ws/book/8567/5) |

[checked against source] The المعنعن row's verse itself contains «كَعَن سَعِيدٍ عَنْ كَرَمْ». This is the poet's illustrative chain, not evidence that this exact chain is one of Namaq's hadith records. The المسلسل examples also belong to the poem. They must not be attached to a narration as historical claims.

### Attributed wording alongside the base

[inferred] These are source selections, not a Namaq explanation of the differences. Hasan and Hasan sahih require attributed presentation rather than a single-answer quiz about “the definition.” The same applies wherever the named sources below retain more than one usage. The page can show each scholar's complete wording without declaring a winner.


[checked against source] Al-Khattabi and Ibn al-Salah, as quoted by al-Nawawi, al-Taqrib, al-Khisht edition, printed 1/29; [Shamela 5586, digital 6](https://shamela.ws/book/5586/6):

> قال الخطابي رحمه الله: هو ما عرف مخرجه. واشتهر رجاله، وعليه مدار أكثر الحديث، ويقبله أكثر العلماء، ويستعمله عامة الفقهاء. قال الشيخ: هو قسمان أحدهما لا يخلو إسناده من مستور لم تتحقق أهليته وليس مغفلاً كثير الخطأ ولا ظهر منه سبب مفسق، ويكون متن الحديث معروفاً برواية مثله أو نحوه من وجه آخر.
> الثاني أن يكونراويه مشهوراً بالصدق والأمانة ولم يبلغ درجة الصحيح لقصوره في الحفظ والاتقان، وهو مرتفع عن حال من يعد تفرده منكراً ثم الحسن كالصحيح في الاحتجاج به وإن كان دونه في القوة؛ ولهذا أدرجته طائفة في نوع الصحيح، والله أعلم.

[checked against source] Al-Tirmidhi, as quoted by Ibn al-Salah, Muqaddima, Itr 1406 edition, printed 1/30; [Shamela 22870, digital 27](https://shamela.ws/book/22870/27):

> وَرُوِّينَا عَنْ أَبِي عِيسَى التِّرْمِذِيِّ رَضِيَ اللَّهُ عَنْهُ أَنَّهُ يُرِيدُ بِالْحَسَنِ " أَنْ لَا يَكُونَ فِي إِسْنَادِهِ مَنْ يُتَّهَمُ بِالْكَذِبِ، وَلَا يَكُونُ حَدِيثًا شَاذًّا، وَيُرْوَى مِنْ غَيْرِ وَجْهٍ نَحْوُ ذَلِكَ ".

[checked against source] Ibn al-Salah, Muqaddima, Itr 1406 edition, printed 1/31–32, continuing at digital 29; [Shamela 22870, digital 28](https://shamela.ws/book/22870/28):

> وَقَدْ أَمْعَنْتُ النَّظَرَ فِي ذَلِكَ وَالْبَحْثَ، جَامِعًا بَيْنَ أَطْرَافِ كَلَامِهِمْ، مُلَاحِظًا مَوَاقِعَ اسْتِعْمَالِهِمْ، فَتَنَقَّحَ لِي وَاتَّضَحَ أَنَّ الْحَدِيثَ الْحَسَنَ قِسْمَانِ:
> أَحَدُهُمَا: الْحَدِيثُ الَّذِي لَا يَخْلُو رِجَالُ إِسْنَادِهِ مِنْ مَسْتُورٍ لَمْ تَتَحَقَّقْ أَهْلِيَّتُهُ، غَيْرَ أَنَّهُ لَيْسَ مُغَفَّلًا كَثِيرَ الْخَطَأِ فِيمَا يَرْوِيهِ، وَلَا هُوَ مُتَّهَمٌ بِالْكَذِبِ فِي الْحَدِيثِ، أَيْ لَمْ يَظْهَرْ مِنْهُ تَعَمُّدُ الْكَذِبِ فِي الْحَدِيثِ وَلَا سَبَبٌ آخَرُ مُفَسِّقٌ، وَيَكُونُ مَتْنُ الْحَدِيثِ مَعَ ذَلِكَ قَدْ عُرِفَ بِأَنْ رُوِيَ مِثْلُهُ أَوْ نَحْوُهُ مِنْ وَجْهٍ آخَرَ أَوْ أَكْثَرَ حَتَّى اعْتَضَدَ بِمُتَابَعَةِ مَنْ تَابَعَ رَاوِيَهُ عَلَى مِثْلِهِ، أَوْ بِمَا لَهُ مِنْ شَاهِدٍ، وَهُوَ وُرُودُ حَدِيثٍ آخَرَ بِنَحْوِهِ، فَيَخْرُجُ بِذَلِكَ عَنْ أَنْ يَكُونَ شَاذًّا وَمُنْكَرًا، وَكَلَامُ التِّرْمِذِيِّ عَلَى هَذَا الْقِسْمِ يَتَنَزَّلُ.
> الْقِسْمُ الثَّانِي: أَنْ يَكُونَ رَاوِيهِ مِنَ الْمَشْهُورِينَ بِالصِّدْقِ وَالْأَمَانَةِ، غَيْرَ أَنَّهُ لَمْ يَبْلُغْ دَرَجَةَ رِجَالِ الصَّحِيحِ، لِكَوْنِهِ يَقْصُرُ عَنْهُمْ فِي الْحِفْظِ وَالْإِتْقَانِ، وَهُوَ مَعَ ذَلِكَ يَرْتَفِعُ عَنْ حَالِ مَنْ يُعَدُّ مَا يَنْفَرِدُ بِهِ مِنْ
> حَدِيثِهِ مُنْكَرًا، وَيُعْتَبَرُ فِي كُلِّ هَذَا - مَعَ سَلَامَةِ الْحَدِيثِ مِنْ أَنْ يَكُونَ شَاذًّا وَمُنْكَرًا - سَلَامَتُهُ مِنْ أَنْ يَكُونَ مُعَلَّلًا.
> وَعَلَى الْقِسْمِ الثَّانِي يَتَنَزَّلُ كَلَامُ الْخَطَّابِيِّ.
> فَهَذَا الَّذِي ذَكَرْنَاهُ جَامِعٌ لِمَا تَفَرَّقَ فِي كَلَامِ مَنْ بَلَغَنَا كَلَامُهُ فِي ذَلِكَ، وَكَأَنَّ التِّرْمِذِيَّ ذَكَرَ أَحَدَ نَوْعَيِ الْحَسَنِ، وَذَكَرَ الْخَطَّابِيُّ النَّوْعَ الْآخَرَ، مُقْتَصِرًا كُلُّ وَاحِدٍ مِنْهُمَا عَلَى مَا رَأَى أَنَّهُ يُشْكِلُ، مُعْرِضًا عَمَّا رَأَى أَنَّهُ لَا يُشْكِلُ. أَوْ أَنَّهُ غَفَلَ عَنِ الْبَعْضِ وَذَهِلَ، وَاللَّهُ أَعْلَمُ، هَذَا تَأْصِيلُ ذَلِكَ.

[checked against source] Ibn Hajar, Nukhba, Dar al-Hadith fifth 1418 edition, printed Subul al-Salam volume 4, p. 722; [Shamela 5940, digital 4](https://shamela.ws/book/5940/4):

> وَخَبَرُ الْآحَادِ بِنَقْلِ عَدْلٍ تَامِّ الضَّبْطِ، مُتَّصِلِ السَّنَدِ، غَيْرِ مُعَلَّلٍ وَلَا شَاذٍّ: هُوَ الصَّحِيحُ لِذَاتِهِ،.

[checked against source] Ibn Hajar, Nuzha, Itr third 1421 edition, printed 1/65; [Shamela 1565, digital 61](https://shamela.ws/book/1565/61):

> فإنْ خَفَّ الضبطُ أي قَلَّ -يُقال: خَفَّ القومُ خُفوفًا: قَلُّوا- والمرادُ مع بقية الشروط المتقدِّمة في حدِّ الصحيح فهو الحَسَنُ لِذَاتِه (٢)، لا لِشيءٍ خارجٍ وهو الذي يكون حُسْنُه بسبب الاعتِضَادِ،

[checked against source] Ibn al-Salah on حسن صحيح, Muqaddima, Itr 1406 edition, printed 1/39; [Shamela 22870, digital 36](https://shamela.ws/book/22870/36):

> الثَّامِنُ: فِي قَوْلِ التِّرْمِذِيِّ وَغَيْرِهِ: " هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ " إِشْكَالٌ، لِأَنَّ الْحَسَنَ قَاصِرٌ عَنِ الصَّحِيحِ، كَمَا سَبَقَ إِيضَاحُهُ، فَفِي الْجَمْعِ بَيْنَهُمَا فِي حَدِيثٍ وَاحِدٍ جَمْعٌ بَيْنَ نَفْيِ ذَلِكَ الْقُصُورِ وَإِثْبَاتِهِ.
> وَجَوَابُهُ: أَنَّ ذَلِكَ رَاجِعٌ إِلَى الْإِسْنَادِ، فَإِذَا رُوِيَ الْحَدِيثُ الْوَاحِدُ بِإِسْنَادَيْنِ: أَحَدُهُمَا إِسْنَادٌ حَسَنٌ، وَالْآخَرُ إِسْنَادٌ صَحِيحٌ اسْتَقَامَ أَنْ يُقَالَ فِيهِ: إِنَّهُ حَدِيثٌ حَسَنٌ صَحِيحٌ، أَيْ إِنَّهُ حَسَنٌ بِالنِّسْبَةِ إِلَى إِسْنَادٍ، صَحِيحٍ بِالنِّسْبَةِ إِلَى إِسْنَادٍ آخَرَ.
> عَلَى أَنَّهُ غَيْرُ مُسْتَنْكَرٍ أَنْ يَكُونَ بَعْضُ مَنْ قَالَ ذَلِكَ أَرَادَ بِالْحُسْنِ مَعْنَاهُ اللُّغَوِيَّ، وَهُوَ: مَا تَمِيلُ إِلَيْهِ النَّفْسُ وَلَا يَأْبَاهُ الْقَلْبُ، دُونَ الْمَعْنَى الِاصْطِلَاحِيِّ الَّذِي نَحْنُ بِصَدَدِهِ، فَاعْلَمْ ذَلِكَ، وَاللَّهُ أَعْلَمُ.

[checked against source] Al-Nawawi on حسن صحيح, al-Taqrib, al-Khisht edition, printed 1/29; [Shamela 5586, digital 6](https://shamela.ws/book/5586/6):

> وقولهم: حديث حسن الإسناد أو صحيحه، دون قولهم حديث صحيح أو حسن؛ لأنه قد يصح أو يحسن الإسناد دون المتن لشذوذ أو علة، فإن اقتصر على ذلك حافظ معتمد فالظاهر صحة المتن وحسنه، وأما قول الترمذي وغيره: حديث حسن صحيح، فمعناه روي بإسنادين، أحدهما يقتضي الصحة، والآخر الحسن،

[checked against source] Ibn Hajar on حسن صحيح, Nuzha, Itr third 1421 edition, printed 1/66–67, continuing at digital 63; [Shamela 1565, digital 62](https://shamela.ws/book/1565/62):

> فإن جُمِعا أيْ الصحيحُ والحَسَنُ في وصفٍ واحدٍ كقَوْل الترمذي وغيرِه "حديثٌ حَسَنٌ صحيح" فَلِلترَدُّدِ الحاصِلِ من المجتهد في الناقِل، هل اجتمعَتْ فيه شروطُ الصحة أو قَصرَ عنها، وهذا حيثُ يحصلُ منه التفرُّدُ بتلك الرواية. وَعُرِفَ بهذا جوابُ مَنِ استشكلَ الجَمْعَ بين الوصفَيْن فقال: الحَسَنُ قاصِرٌ عن الصحيح، ففي الجمع بين الوصفين إثباتٌ لذلك القصور ونَفْيُه؟؟
> ومُحَصَّلُ الجواب: أنَّ تردُّدَ أئمةِ الحديث في حال ناقِلِه اقتضى للمُجتهدِ ألّا يصفه بأحد الوصفين، فيُقال فيه: حَسَنٌ باعتبار وصفه عند قوم صحيحٌ باعتبار وصفه عند قوم، وغايةُ ما فيه أنه حُذِفَ منه حرفُ التردُّدِ لأنَّ حقَّه أنْ يقولَ: "حَسَنٌ أو صحيحٌ"، وهذا كما حُذِفَ حرفُ
> العطف من الذي بعدَه (١)، وعلى هذا فما قيل فيه: حَسَنٌ صحيح دونَ ما قيل فيه: صحيحٌ، لأنَّ الجزمَ أقوى من التردُّدِ، وهذا حيثُ التفرُّدُ (٢)، وإلا إذا لم يحصلِ التفردُ فإطلاقُ الوصفين معًا على الحديث يكونُ باعتبار إسنادَين أحدُهما صحيحٌ والآخرُ حَسَن، وعلى هذا فما قيل فيه: حَسَنٌ صحيح فَوْقَ ما قيل فيه صحيحٌ فقط إذا كان فردًا، لأنّ كثرةَ الطُّرقِ تُقَوِّي.

[inferred] The حسن صحيح selections are deliberately retained together. A question asking which scholar wrote one of these passages can quote it; a question declaring one of these passages to be the universal definition cannot use the others as false answers.

| Status | Term in the base | Attributed prose wording | Edition, volume, printed page / digital page |
| --- | --- | --- | --- |
| Checked against source | المسند | Al-Nawawi, including the named authorities he quotes: «قال الخطيب البغدادي: هو عند أهل الحديث ما اتصل سنده إلى منتهاه وأكثر ما يستعمل فيها جاء عن النبي صلى الله عليه وسلم دون غيره، وقال ابن عبد البر: هو ما جاء عن النبي صلى الله عليه وسلم خاصة، متصلاً كان أو منقطعاً، وقال الحاكم وغيره: لا يستعمل إلا في<br>المرفوع<br>المتصل.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/32; [Shamela 5586, digital 9](https://shamela.ws/book/5586/9) |
| Checked against source | المتصل | Al-Nawawi, including the named authorities he quotes: «ويسمى بالموصول، وهو ما اتصل إسناده مرفوعاً كان أو موقوفاً على من كان.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/32; [Shamela 5586, digital 9](https://shamela.ws/book/5586/9) |
| Checked against source | المقطوع | Al-Nawawi, including the named authorities he quotes: «وجمعه والمقاطيع، وهو الموقوف على التابعي قولاً له أو فعلاً واستعمله الشافعي، ثم الطبراني في<br>المنقطع.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/34; [Shamela 5586, digital 11](https://shamela.ws/book/5586/11) |
| Checked against source | المرسل | Al-Nawawi, including the named authorities he quotes: «اتفق علماء الطوائف على أن قول التابعي الكبير: قال رسول الله صلى الله عليه وسلم: كذا أو فعله يسمى مرسلاً، فإن انقطع قبل التابعي واحد أو أكثر قال الحاكم وغيره من المحدثين: لا يسمى مرسلاً بل يختص المرسل بالتابعي عن النبي صلى الله عليه وسلم، فإن سقط قبله واحد فهو منقطع، وإن كان أكثر فمعضل ومنقطع،» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/34; [Shamela 5586, digital 11](https://shamela.ws/book/5586/11) |
| Checked against source | المنقطع | Al-Nawawi, including the named authorities he quotes: «الصحيح الذي ذهب إليه الفقهاء والخطيب أبن عبد البر وغيرهما من المحدثين أن المنقطع ما لم يتصل إسناده على أي وجه كان انقطاعه، وأكثر ما يستعمل في رواية من دون التابعي عن الصحابي، كمالك عن ابن عمر، وقيل: وما اختل فيه لرجل قبل التابعي محذوفاً كان أو مبهماً،» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/35; [Shamela 5586, digital 12](https://shamela.ws/book/5586/12) |
| Checked against source | المعضل | Al-Nawawi, including the named authorities he quotes: «وهو بفتح الضاد يقولون: أعضله فهو مُعْضَل وهو ما سقط من إسناده اثنان فأكثر، ويسمى منقطعاً، ويسمى مرسلاً عند الفقهاء وغيرهم كما تقدم، وقيل: إن قول الراوي: بلغني كقول مالك بلغني عن أبي هريرة أن رسول الله صلى الله عليه وسلم قال: " للملوك طعامه وكسوته " يسمى معضلاً عند أصحاب الحديث، وإذا روى تابع التابعي عن التابعي حديثاً وقفه عليه وهو عند ذلك التابعي مرفوع متصل فهو معضل.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/36; [Shamela 5586, digital 13](https://shamela.ws/book/5586/13) |
| Checked against source | التدليس | Al-Nawawi, including the named authorities he quotes: «الأول: تدليس الإسناد بأن يروي عمن عاصره ما لم يسمعه منه موهماً سماعه قائلاً: قال فلان. أو عن فلان ونحوه وربما لم يسقط شيخه وأسقط غيره ضعيفاً أو صغيراً تحسيناً للحديث.<br>الثاني: تدليس الشيوخ بأن يسمي شيخه أو يكنيه أو ينسبه أو يصفه بما لا يعرف، أما الأول فمكروه جداً ذمه أكثر العلماء، ثم قال فريق منهم: من عرف به صار مجروحاً مردود الرواية وإن بين السماع، والصحيح التفصيل، فما رواه بلفظ محتمل لم يبين فيه السماع فمرسل وما بينه فيه، كسمعت، وحدثنا، وأخبرنا وشبهها فمقبول محتج به، وفي الصحيحين وغيرهما من هذا الضرب كثير، كقنادة، والسفيانين وغيرهم، وهذا الحكم جار فيمن دلس مرة، وما كان في الصحيحين وشبههما عن المدلسين بعن محمول على ثبوت السماع من جهة أخرى، وأما الثاني فكراهته أخف وسببها توعير طريق معرفته، ويختلف الحال في كراهته بحسب غرضه ككون المغير السمة ضعيفاً، أو صغيراً، أو متأخر الوفاة، أو سمع كثيراً فامتنع من تكراره على صورة، وتسمح الخطيب وغيره بهذا، والله أعلم.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/39; [Shamela 5586, digital 16](https://shamela.ws/book/5586/16) |
| Checked against source | الشاذ | Al-Nawawi, including the named authorities he quotes: «هو عند الشافعي وجماعة من علماء الحجاز ما روى الثقة مخالفاً رواية الناس لا أن يروي ما لا يروي غيره، قال الخليلي: والذي عليه حفاظ الحديث أن الشاذ ما ليس له إلا إسناد واحد يشذ به ثقة أو غيره، فما كان من غير ثقة فمتروك، وما كان عن ثقة توقف فيه ولا يحتج به، وقال الحاكم: هو ما انفرد به ثقة وليس له أصل بمتابع، وما ذكراه مشكل بافراد العدل الضابط كحديث " إنما الأعمال بالنيات " والنهي عن بيع الولاء وغير ذلك مما في الصحيح، فالصحيح التفصيل فإن كان مفرده مخالفاً أحفظ منه وأضبط كان شاذ مردود، وإن لم يخالف، فإن كان عدلاً حافظاً موثوقاً بضبطه كان مفرده صحيحاً، وإن لم يوثق بضبطه ولم يبعد عن درجة الضابط كان حسناً، وإن بعد كان شاذاً منكراً مردوداً، فالحاصل أن الشاذ المردود: هو الفرد المخالف، والفرد الذي ليس في رواية من الثقة والضبط ما يجبر تفرده، والله أعلم.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/40; [Shamela 5586, digital 17](https://shamela.ws/book/5586/17) |
| Checked against source | المنكر | Al-Nawawi, including the named authorities he quotes: «قال الحافظ البرديحي هو الفرد الذي لا يعرف متنه عن غير راويه، وكذا أطلقه كثيرون، والصواب فيه التفصيل الذي تقدم في الشاذ، فإنه بمعناه، والله أعلم.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/41; [Shamela 5586, digital 18](https://shamela.ws/book/5586/18) |
| Checked against source | المضطرب | Al-Nawawi, including the named authorities he quotes: «هو الذي يروى على أوجه مختلفة متقاربة، فإن رجحت إحدى الروايتين بحفظ راويها أو كثرة صحبته المروي عنه، أو غير ذلك: فالحكم للراجحة، ولا يكون مضطرباً، والاضطراب يوجب ضعف الحديث لإشعاره بعدم الضبط، ويقع في الإسناد تارة وفي المتن أخرى وفيهما من راو أو جماعة: والله أعلم.» | al-Khisht, Dar al-Kitab al-Arabi, first 1405/1985, 1/45; [Shamela 5586, digital 22](https://shamela.ws/book/5586/22) |

[checked against source] Ibn Hajar's Nukhba gives the four-way numerical division before naming المشهور والعزيز والغريب. Dar al-Hadith fifth 1418/1997, printed Subul al-Salam 4/721, [Shamela 5940, digital 3](https://shamela.ws/book/5940/3):

> فأقول: الخبر إما أن يكون له:
> * طرق بلا عدد معين.
> * أو مع حصر بما فوق الاثنتين.
> * أو بهما.
> * أو بواحد.
> والثاني: المشهور وهو المستفيض على رأي. [ويطلق المشهور على ما اشتهر على الألسنة]
> والثالث: العزيز، وليس شرطاً للصحيح خلافاً لمن زعمه.
> والرابع: الغريب.

[checked against source] The square-bracket sentence following المشهور on that page is expressly excluded from the matn by this edition's notice. It is reproduced in the quoted witness above only to expose that boundary, not attributed as an additional sentence by Ibn Hajar. Nuzha supplies the complete authorial discussion rather than our expansion of “أو بهما”.

[checked against source] Ibn Hajar on المتروك, Nuzha, Itr third 1421 edition, printed 1/91; [Shamela 1565, digital 87](https://shamela.ws/book/1565/87):

> والقِسْمُ الثاني من أقسام المردود: وهو ما يكون بسبب تُهمَةِ الراوي بالكَذِبِ هو المتروكُ (٤).

[inferred] The comparison above is a bounded selection of differing definitions, not a complete textual concordance of all four prose works. In particular, a full atomic-term count for Nukhba/Nuzha and a term-by-term comparison of every remaining Bayquniyya row are still owed before claiming that larger deliverable complete.

## 2. Terms already used on Namaq's hadith

### Ibn Rajab's eight additions, 43–50

[checked in repo] All eight are in the current fifty-entry corpus with `source: ibnrajab`; the product groups them as their own book. Contrary to the request's earlier snapshot, nos. 47, 49 and 50 now have six saved grading quotations between them. The following quotes are in current `grades`, with editions identified in `books`. No grade is derived from a collection's title or from the audit's recommendation.

[checked against source] No. 47, ابن رجب, جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/467; [Shamela 4268, digital 984](https://shamela.ws/book/4268/984):

> وقَالَ التِّرمِذيُّ: حَدِيثٌ حَسَنٌ

[checked against source] No. 47, الترمذي, سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/590, hadith 2380; [Shamela 1435, digital 4111](https://shamela.ws/book/1435/4111):

> هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ

[checked against source] No. 49, ابن رجب, جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/496; [Shamela 4268, digital 1013](https://shamela.ws/book/4268/1013):

> وقال التِّرمذيُّ: حَسَنٌ صَحيحٌ

[checked in repo] No. 49, الترمذي, سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/573–574, hadith 2344; [Shamela 1435, digital 4060](https://shamela.ws/book/1435/4060):

> هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ لَا نَعْرِفُهُ إِلَّا مِنْ هَذَا الوَجْهِ وَأَبُو تَمِيمٍ الجَيْشَانِيُّ اسْمُهُ: عَبْدُ اللَّهِ بْنُ مَالِكٍ

[checked against source] No. 50, ابن رجب, جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/510; [Shamela 4268, digital 1027](https://shamela.ws/book/4268/1027):

> وقال الترمذي: حسن غريب

[checked against source] No. 50, الترمذي, سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 5/457, hadith 3375; [Shamela 1435, digital 5569](https://shamela.ws/book/1435/5569):

> هَذَا حَدِيثٌ حَسَنٌ غَرِيبٌ مِنْ هَذَا الوَجْهِ

[checked against source] No. 49 also has an Abu Hatim statement reported by Ibn Rajab on the different Ibn Umar route, not the Umar route. Jami', al-Risala seventh 1417, printed 2/496, [Shamela 4268, digital 1013](https://shamela.ws/book/4268/1013):

> وقد رُوي هذا الحديثُ من حديث ابنِ عمر (٢) عن النبيِّ - صلى الله عليه وسلم -، ولكن في إسناده من لا يُعرف حاله. قاله أبو حاتم الرازي (٣).

[checked against source] The notes below the rule on Jami' 2/467, 496 and 510 mention further authentication by Ibn Hibban, al-Hakim and al-Dhahabi. Those sentences are the modern editors' words, not Ibn Rajab's. They are acquisition leads, not permission to manufacture those scholars' wording. Direct classical passages for each of those additional attributions have not been acquired in this run; an exhaustive “every named scholar's grade” claim for these three hadith would therefore be premature. For no. 47, Jami' reports حسن while the present Tirmidhi witness prints حسن صحيح. Both are retained, with their witnesses. No. 50's collection text has the qualifier من هذا الوجه.

[checked in repo] Nos. 43, 44, 45, 46 and 48 have no `grades` array in the current data. Their absence is a repository fact, not an unsourced authentication or criticism of those reports. The source map already points to their collection records. No scholarly term is inferred from the shape of a chain.

### Complete current grading-passage inventory for nos. 1–42

[checked in repo] The following reproduces every saved `grades` passage for the Forty, including judgments transmitted inside Ibn Rajab's quotation. Long passages are retained so that a favourable opening does not conceal its qualification. These are exact current repository strings with their existing source locators; “checked in repo” does not claim a new image-level collation. The editions are the `books` objects in `data/hadith/forty.json`, already settled in the previous audit. Individual named voices inside a passage retain their own “قال” attribution. A passage attributed to Ibn Rajab is not a claim that he originated every quoted judgment inside it.

[checked in repo] No. 11; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/63; [Shamela 12836, digital 29](https://shamela.ws/book/12836/29):

> رواه الترمذي والنسائي، وقال الترمذي: حديث حسن صحيح.

[checked in repo] No. 11; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/668, hadith 2518; [Shamela 1435, digital 4334](https://shamela.ws/book/1435/4334):

> وَهَذَا حَدِيثٌ صَحِيحٌ

[checked in repo] No. 11; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 1/278; [Shamela 4268, digital 272](https://shamela.ws/book/4268/272):

> هذا الحديث خرّجه الِإمام أحمد، والترمذي، والنسائي، وابنُ حبان في "صحيحه" والحاكم من حديث بُريد بن أبي مريم عن أبي الحوراء، عن الحسن بن عليّ، وصححه الترمذي، وأبو الحوراء السعدي، قال الأكثرون: اسمه ربيعةُ بنُ شيبان، ووثقه النَّسَائِي وابن حبان، وتوقف أحمد في أن أبا الحوراء اسمه ربيعةُ بن شيبان، ومال إلى التفرقة بينهما، وقال الجوزجاني: أبو الحوراء مجهول لا يعرف

[checked in repo] No. 12; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/64; [Shamela 12836, digital 30](https://shamela.ws/book/12836/30):

> حديث حسن، رواه الترمذي وغيره وهكذا.

[checked in repo] No. 12; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/558, hadith 2317; [Shamela 1435, digital 4010](https://shamela.ws/book/1435/4010):

> هَذَا حَدِيثٌ غَرِيبٌ لَا نَعْرِفُهُ مِنْ حَدِيثِ أَبِي سَلَمَةَ، عَنْ أَبِي هُرَيْرَةَ، عَنِ النَّبِيِّ ﷺ إِلَّا مِنْ هَذَا الوَجْهِ

[checked in repo] No. 12; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/558–559, hadith 2318; [Shamela 1435, digital 4011](https://shamela.ws/book/1435/4011):

> وَهَذَا عِنْدَنَا أَصَحُّ مِنْ حَدِيثِ أَبِي سَلَمَةَ عَنْ أَبِي هُرَيْرَةَ

[checked in repo] No. 12; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 1/287–288; [Shamela 4268, digital 281](https://shamela.ws/book/4268/281):

> هذا الحديث خرّجه الترمذي، وابن ماجه من رواية الأوزاعي، عن قُرَّةَ بنِ عبد الرحمن، عن الزهري، عن أبي سلمة، عن أبي هريرة رضي الله عنهم، وقال الترمذي: غريب، وقد حسنه الشيخ المصنف رحمه الله؛ لأن رجال إسناده ثقات، وقرة بن عبد الرحمن بن حيويل وثقه قوم وضعفه آخرون، وقال ابنُ عبد البرِّ: هذا الحديثُ محفوظ عن الزهري بهذا الِإسناد من رواية الثقات، وهذا موافق لتحسين الشيخ له، وأما أكثر الأئمة، فقالوا: ليس هو بمحفوظ بهذا الِإسناد وإنما هو محفوظٌ عن الزهري، عن عليّ بن حسين، عن النبيّ - ﷺ - مرسلًا، كذلك رواه الثقات عن الزهري، منهم مالك في الموطأ، ويونس، ومعمر، وإبراهيم بن سعد إلا أنه قال: "من إيمان المرء تركه ما لا يعنيه" وممن قال: إنه لا يصح إلا عن على بن حسين مرسلًا الِإمام أحمد، ويحيى بن معين، والبخاري، والدارقطني، وقد خلط الضعفاء في إسناده على الزهري تخليطًا فاحشًا، والصحيح فيه المرسل، ورواه عبد الله بن عمر العمري عن الزهري عن عليِّ بن حسين عن أبيه عن النبي - ﷺ -، فوصله وجعله من مسند الحسين بن عليّ، وخرَّجه الِإمامُ أحمد في "مسنده" من هذا الوجه، والعمري ليس بالحافظ، وخرَّجه أيضًا من وجه آخر عن الحسين، عن النبي - ﷺ -، وضعفه البخاري في "تاريخه" من هذا الوجه أيضًا، وقال: لا يصحُ إلا عن عليّ بن حسين مرسلًا، وقد روي عن النبي - ﷺ - من وجوه أخر وكُلُّها ضعيفة.

[checked in repo] No. 18; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/70; [Shamela 12836, digital 36](https://shamela.ws/book/12836/36):

> رواه الترمذي وقال: حديث حسن، وفي بعض النسخ: حسن صحيح.

[checked in repo] No. 18; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/355–356, hadith 1987; [Shamela 1435, digital 3433](https://shamela.ws/book/1435/3433):

> هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ

[checked in repo] No. 18; محمود بن غيلان، شيخ الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/355–356, hadith 1987; [Shamela 1435, digital 3433](https://shamela.ws/book/1435/3433):

> قَالَ مَحْمُودٌ: وَالصَّحِيحُ حَدِيثُ أَبِي ذَرٍّ

[checked in repo] No. 18; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 1/395–396; [Shamela 4268, digital 389](https://shamela.ws/book/4268/389):

> هذا الحديث خرجه الترمذي من رواية سفيان الثوري، عن حبيب بن أبي ثابت، عن ميمون بن أبي شبيب، عن أبي ذرٍّ، وخرجه أيضًا بهذا الِإسناد عن ميمون عن معاذ، وذكر عن شيخه محمود بن غيلان أنه قال: حديثُ أبي ذرٍّ أصحُّ.
> فهذا الحديثُ قد اختلف في إسناده وقيل فيه: عن حبيب، عن ميمون: أن النبيَّ - ﷺ - وصَّى بذلك، مرسلًا، ورجَّحَ الدارقطني هذا المرسل.
> وقد حسَّن الترمذي هذا الحديثَ، وما وقع في بعض النسخ من تصحيحه، فبعيد، ولكن الحاكم خرجه، وقال: صحيح على شرطِ الشيخين، وهو وهم مِن وجهين: أحدُهما: أن ميمونَ بنَ أبي شبيب، ويقال: ابنُ شبيب لم يخرج له البخاري في "صحيحه" شيئًا، ولا مسلم إلا في مقدمة كتابه حديثًا عن المغيرة بن شعبة. والثاني: أن ميمون بن أبي شبيب لم يصحّ سماعه من أحد من الصحابة، قال الفلاس: ليس في شيء من رواياته عن الصحابة "سمعتُ"، ولم أخبر أن أحدًا يزعم أنه سمع من أصحاب النبيّ - ﷺ -. وقال أبو حاتم الرازي: روايته عن أبي ذر وعائشة غير متصلة. وقال أبو داود: لم يدرك عائشة، ولم ير عليًا، وحينئذ فلم يدرك معاذًا بطريق الأولى.

[checked in repo] No. 19; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/72; [Shamela 12836, digital 37](https://shamela.ws/book/12836/37):

> رواه الترمذي وقال حديث حسن صحيح.

[checked in repo] No. 19; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 4/667, hadith 2516; [Shamela 1435, digital 4331](https://shamela.ws/book/1435/4331):

> هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ

[checked in repo] No. 19; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 1/459–462; [Shamela 4268, digital 453](https://shamela.ws/book/4268/453):

> هذا الحديث خرَّجه الترمذيُّ من رواية حَنَشٍ الصنعاني، عن ابن عباس، وخرَّجه الإِمامُ أحمد من حديث حنش أيضًا مع إسنادَيْن آخرين منقطعين ولم يُميز لفظ بعضها من بعض، ولفظ حديثه: "يا غلام أو يا غليم ألا أُعَلِّمُك كلماتٍ ينفعُك الله بهنَّ؟ " فقلتُ: بلى، فقال: "احفظِ الله يحفَظْكَ، احفظ الله تجدهُ أمامك، تعرَّف إلى الله في الرَّخاء يَعْرِفكَ في الشِّدَّةِ، وإذا سألتَ، فاسألِ الله، وإذا استعنتَ، فاستعن باللهِ، قد جفَّ القلمُ بما هو كائن، فلو أن الخلق كُلَّهم جميعًا أرادوا أن ينفعوك بشيءٍ لم يقضه الله، لم يَقدِرُوا عليه، وإن أرادوا أن يضروك بشيءٍ لم يكتبه الله عليك، لم يقدروا عليه، واعلم أن في الصبر على ما تكره خيرًا كثيرًا، وأن النصر مع الصبر، وأن الفرجَ مع الكربِ، وأن مع العسر يسرًا".
> وهذا اللفظُ أتمُّ من اللفظ الذي ذكره الشيخ رحمه الله، وعزاه إلى غير التِّرمذي، واللفظُ الذي ذكره الشيخ رواه عبدُ بنُ حميد في "مسنده" بإسناد ضعيفٍ عن عطاء، عن ابن عباس، وكذلك عزاه ابنُ الصلاح في "الأحاديث الكلية" التي هل أصلُ أربعين الشيخ رحمه الله إلى عبد بن حُميد وغيره.
> وقد روي هذا الحديث عن ابن عباس من طُرقٍ كثيرة من رواية ابنه عليٍّ، ومولاه عكرمة، وعطاء بن أبي رباح، وعمرو بن دينار، وعُبيد الله بن عبد الله، وعمر مولى غفرة، وابن أبي مليكة وغيرهم.
> وأصحّ الطرق كلها طريقُ حنش الصنعاني التي خرجها الترمذي، كذا قاله ابنُ منده وغيرُه. وقد روي عن النبيّ - ﷺ - أنه وصَّى ابن عباس بهذه الوصية من حديث عليّ بن أبي طالب، وأبي سعيد الخدري، وسهل بن سعد، وعبد الله بن جعفر، وفي أسانيدها كلها ضعف.
> وذكر العقيلي أن أسانيد الحديث كلها لينة، وبعضُها أصلحُ من بعض، وبكلّ حال، فطريق حنشٍ التي خرجها الترمذي حسنة جيدة.

[checked in repo] No. 27; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/88; [Shamela 12836, digital 53](https://shamela.ws/book/12836/53):

> حديث حسن. رويناه في مسندي الإمامين أحمد بن حنبل والدارمي بإسناد حسن.

[checked in repo] No. 27; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/93–94; [Shamela 4268, digital 610](https://shamela.ws/book/4268/610):

> وأما حديث وابصة فخرَّجه الإمام أحمد من طريق حماد بن سلمة، عن الزبير بن عبد السلام، عن أيوب بن عبد الله بن مِكرز، عن وابصة بن معبد، قال: أتيتُ رسولَ الله - ﷺ - وأنا أريدُ أن لا أدع شيئًا من البرِّ والإثم إلَّا سألتُ عنه، فقال لي: "ادنُ يا وابصةُ"، فدنوتُ منه، حتى مست ركبتي ركبتَه، فقال: "يا وابصة أخبرك ما جئتَ تسأل عنه أو تسألني؟! قلت: يا رسولَ الله أخبرني، قال: "جئتَ تسألني عن البرِّ والإثم" قلت: نعم، فجمع أصابعَه الثلاث، فجعل يَنكُتُ بها في صدري، ويقول: "يا وابصة، استفتِ نفسَك، البر ما اطمأنَّ إليه القلب، واطمأنَّت إليه النفسُ، والإثمُ: ما حاك في القلب، وتردَّد في الصَّدر وإن أفتاك الناس وأفتوك". وفي رواية أخرى للإمام أحمد أن الزبيرَ لم يسمعه من أيوب، قال: وحدَّثني جلساؤه، وقد رأيتُه، ففي إسناد هذا الحديث أمران يُوجب كلُّ منهما ضعفه:
> أحدهما: انقطاعه بين الزبير وأيوب، فإنه رواه عن قوم لم يسمعهم.
> والثاني: ضعف الزبير هذا، قال الدارقطني: روى أحاديث مناكير، وضعفه ابن حبان أيضًا، لكنه سماه أيوب بن عبد السلام، فأخطأ في اسمه، وله طريق آخر عن وابصة خرَّجه الإمام أحمد أيضًا من رواية معاوية بن صالح عن أبي عبد الله السلمي، قال: سمعتُ وابصةَ، فذكر الحديث مختصرًا، ولفظه: قال: "البرُّ ما انشرحَ له صدرُك، والإثمُ ما حاك في صدرك، وإن أفتاك عنه الناس".
> والسلمي هذا، قال عليّ بن المديني: هو مجهول.
> وخرَّجه البزار والطبراني وعندهما أبو عبد الله الأسدي، وقال البزار: لا نعلم أحدًا سماه، كذا قال، وقد سمي في بعض الروايات محمدًا. قال عبد الغني بن سعيد الحافظ: لو قال قائلٌ: إنه محمد بن سعيد المصلوب، لما دفعتُ ذلك، والمصلوب هذا صلبه المنصورُ في الزَّندقة، وهو مشهورٌ بالكذب والوضع، ولكنه لم يدرك وابصةَ، والله أعلم.

[checked in repo] No. 28; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/90; [Shamela 12836, digital 55](https://shamela.ws/book/12836/55):

> رواه أبو داود والترمذي وقال: حديث حسن صحيح.

[checked in repo] No. 28; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 5/44–45, hadith 2676; [Shamela 1435, digital 4581](https://shamela.ws/book/1435/4581):

> هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ

[checked in repo] No. 28; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/109–111; [Shamela 4268, digital 626](https://shamela.ws/book/4268/626):

> هذا الحديث خرَّجه الإمام أحمد، وأبو داود، والترمذي، وابن ماجه من رواية ثور بن يزيد، عن خالد بن معدان، عن عبد الرحمن بن عمرو السلمي، زاد أحمد في رواية له، وأبو داود: وحُجْر بن حجر الكلاعي، كلاهما عن العِرباض بن سارية، وقال الترمذي: حسن صحيح، وقال الحافظ أبو نعيم: هو حديث جيد من صحيح حديث الشاميين، قال: ولم يتركه البخاري ومسلم من جهة إنكارٍ منهما له، وزعم الحاكمُ أن سبَبَ تركهما له أنهما توهَّما أنَّه ليس له راوٍ عن خالد بن معدان غيرَ ثور بن يزيد، وقد رواه عنه أيضًا بحير بن سعد ومحمد بن إبراهيم التيمي وغيرهما.
> قلتُ: ليس الأمرُ كما ظنَّه، وليس الحديثُ على شرطهما، فإنهما لم يخرِّجا لعبد الرحمن بن عمرو السُّلمي، ولا لحُجْرٍ الكلاعي شيئًا، وليسا ممَّن اشتهر بالعلم والرواية.
> وأيضًا، فقد اختُلِفَ فيه على خالد بن معدان، فروي عنه كما تقدَّم، وروي عنه عن ابن أبي بلال عن العِرباض، وخرَّجه الإِمام أحمد مِنْ هذا الوجه أيضًا، وروي أيضًا عن ضمرة بن حبيب، عن عبد الرحمن بن عمرو السلمي، عن العِرباض، خرَّجه من طريقه الإمام أحمد وابن ماجه، وزاد في حديثه: "فقد تركتُكم على البيضاءِ، ليلُها كنهارها، لا يزيغُ عنها بعدي إلا هالكٌ"، وزاد في آخر الحديث: "فإنَّما المؤمن كالجمل الأنِفِ، حيثما قيدَ انقاد".
> وقد أنكر طائفةٌ مِنَ الحُفَّاظ هذه الزيادة في آخر الحديث، وقالوا: هي مدرجةٌ فيه، وليست منه، قاله أحمد بن صالح المصري وغيره، وقد خرَّجه الحاكم، وقال في حديثه: وكان أسد بن وداعة يزيد في هذا الحديث: "فإنَّ المؤمن كالجملِ الأنِفِ، حيثما قيد انقاد".
> وخرَّجه ابن ماجه أيضًا من رواية عبد الله بن العلاء بن زبر، حدثني يحيى بن أبي المطاع، سمعتُ العرباض فذكره، وهذا في الظاهر إسناد جيد متَّصلٌ، ورواته ثقات مشهورون، وقد صرَّح فيه بالسَّماع، وقد ذكر البخاري في "تاريخه" أن يحيى بن أبي المطاع سمع من العِرباض اعتمادًا على هذه الرواية، إلَّا أن حفَّاظ أهلِ الشَّام أنكروا ذلك، وقالوا: يحيى بن أبي المطاع لم يسمع من العرباض، ولم يلقه، وهذه الرواية غلطٌ، وممَّن ذكر ذلك أبو زرعة الدِّمشقي، وحكاه عن دُحيم، وهؤلاء أعرفُ بشيوخهم من غيرهم، والبخاري رحمه الله يقع له في تاريخه أوهام في أخبار أهل الشام، وقد رُوي عن العِرباض من وجوه أخر، ورُوي من حديث بُريدة عن النبيِّ - ﷺ -، إلَّا أن إسنادَ حديث بُريدة لا يثبت، والله أعلم.

[checked in repo] No. 29; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/93; [Shamela 12836, digital 57](https://shamela.ws/book/12836/57):

> رواه الترمذي وقال: حديث حسن صحيح.

[checked in repo] No. 29; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 5/11–12, hadith 2616; [Shamela 1435, digital 4489](https://shamela.ws/book/1435/4489):

> هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ

[checked in repo] No. 29; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/135; [Shamela 4268, digital 652](https://shamela.ws/book/4268/652):

> هذا الحديث خرَّجه الإمام أحمد، والترمذي، والنسائي، وابن ماجه من رواية معمر، عن عاصم بن أبي النجود، عن أبي وائل، عن معاذ بن جبل، وقال الترمذي: حسن صحيح.
> وفيما قاله رحمه الله نظر من وجهين:
> أحدهما: أنه لم يثبت سماعُ أبي وائل من معاذ، وإن كان قد أدركه بالسِّنِّ، وكان معاذ بالشَّام، وأبو وائل بالكوفة، وما زال الأئمةُ - كأحمد وغيره - يستدلُّون على انتفاء السَّماع بمثل هذا، وقد قال أبو حاتم الرازي في سماع أبي وائل من أبي الدرداء: قد أدركه، وكان بالكُوفة، وأبو الدَّرداء بالشام، يعني: أنه لم يصحَّ له سماع منه. وقد حكى أبو زرعة الدِّمشقي عن قوم أنهم توقَّفُوا في سماعِ أبي وائل من عمر، أو نفوه، فسماعه من معاذ أبعد.
> والثاني: أنه قد رواه حمَّادُ بنُ سلمة عن عاصم بن أبي النجود، عن شهر بن حوشبٍ، عن معاذ، خرَّجه الإمام أحمد مختصرًا، قال الدارقطني: وهو أشبهُ بالصَّواب؛ لأنَّ الحديثَ معروفٌ من رواية شهرٍ على اختلافٍ عليه فيه.
> قلت: ورواية شهر عن معاذ مرسلةٌ يقينًا، وشهرٌ مختلفٌ في توثيقه وتضعيفه، وقد خرَّجه الإِمامُ أحمد من رواية شهر عن عبدِ الرحمن بن غَنْمٍ، عن معاذ، وخرَّجه الإمام أحمد أيضًا من رواية عُروة بن النزَّال أو النزال بن عروة، وميمون بن أبي شبيب، كلاهما عن معاذ، ولم يسمع عروةُ ولا ميمونُ من معاذ، وله طرق أخرى عن معاذ كلُّها ضعيفة.

[checked in repo] No. 30; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/95; [Shamela 12836, digital 60](https://shamela.ws/book/12836/60):

> حديث حسن رواه الدارقطني وغيره.

[checked in repo] No. 30; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/150; [Shamela 4268, digital 667](https://shamela.ws/book/4268/667):

> هذا الحديثُ من رواية مكحول عن أبي ثعلبة الخشني، وله علتان:
> إحداهما: أن مكحولًا لم يصحّ له السماع من أبي ثعلبة، كذلك قال أبو مسهر الدمشقي وأبو نُعيم الحافظ وغيرهما.
> والثانية: أنه اختلف في رفعه ووقفه على أبي ثعلبة، ورواه بعضهم عن مكحول من قوله، لكن قال الدارقطني: الأشبه بالصَّواب المرفوعُ، قال: وهو أشهرُ.
> وقد حسَّن الشيخُ رحمه الله هذا الحديث، وكذلك حسنه قبلَه الحافظ أبو بكر بن السمعاني في "أماليه".

[checked in repo] No. 31; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/96; [Shamela 12836, digital 62](https://shamela.ws/book/12836/62):

> حديث حسن، رواه ابن ماجة وغيره بأسانيد حسنة.

[checked in repo] No. 31; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/174–176; [Shamela 4268, digital 691](https://shamela.ws/book/4268/691):

> هذا الحديث خرَّجه ابن ماجه من رواية خالد بن عمرو القرشي، عن سفيان الثوري، عن أبي حازم، عن سهل بن سعد، وقد ذكر الشيخ - رحمه الله - أنَّ إسناده حسن، وفي ذلك نظر، فإن خالد بن عمرو القرشي الأموي قال فيه الإِمامُ أحمد: منكرُ الحديث، وقال مرة: ليس بثقة، يروي أحاديث بواطيل، وقال ابن معين: ليس حديثه بشيءٍ، وقال مرة: كان كذابًا يكذب، حدَّث عن شعبة أحاديثَ موضوعة، وقال البخاري وأبو زرعة: منكر الحديث، وقال أبو حاتم: متروكُ الحديث ضعيف، ونسبه صالح بنُ محمد، وابنُ عدي إلى وضع الحديث، وتناقض ابنُ حبان في أمره، فذكره في كتاب "الثقات"، وذكره في كتاب "الضعفاء"، وقال: كان ينفردُ عَنِ الثِّقاتِ بالموضوعات، لا يحلُّ الاحتجاج بخبره، وخرَّج العقيلي حديثه هذا وقال: ليس له أصل من حديث سفيان الثوري، قال: وقد تابع خالدًا عليه محمَّد بن كثيرٍ الصَّنعانيُّ، ولعله أخذه عنه ودلسه، لأن المشهور به خالد هذا.
> قال أبو بكر الخطيب: وتابعه أيضًا أبو قتادة الحرَّاني ومِهرانُ بن أبي عمر الرازي، فرووه عن الثَّوريِّ قال: وأشهرُها حديثُ ابن كثير. كذا قال، وهذا يخالفُ قولَ العقيلي: إن أشهرَها حديثُ خالد بن عمرو، وهذا أصحُّ، ومحمد بن كثير الصنعاني هو المصيصي، ضعفه أحمد. وأبو قتادة ومهران تُكُلِّمَ فيهما أيضًا، لكن محمد بن كثير خيرٌ منهما، فإنَّه ثقةٌ عندَ كثير مِنَ الحفَّاظ.
> وقد تعجب ابنُ عدي من حديثه هذا، وقال: ما أدري ما أقول فيه.
> وذكر ابنُ أبي حاتم أنَّه سأل أباه عن حديث محمد بن كثير عن سفيان الثوري، فذكر هذا الحديث، فقال: هذا حديثٌ باطلٌ، يعني بهذا الإِسناد، يُشير إلى أنَّه لا أصلَ له عن محمد بن كثير عن سفيان.
> وقال ابن مشيش: سألتُ أحمد عن حديث سهل بن سعد، فذكر هذا الحديث، فقال أحمد: لا إله إلا الله - تعجبًا منه - من يروي هذا؟ قلت:
> خالد بن عمرو، فقال: وقعنا في خالد بن عمرو، ثم سكت، ومراده الإنكار على من ذكر له شيئًا من حديث خالد هذا، فإنه لا يُشتغل به.

[checked in repo] No. 32; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/98; [Shamela 12836, digital 63](https://shamela.ws/book/12836/63):

> حديث حسن، رواه ابن ماجة والدارقطني وغيرهما مسندًا. ورواه مالك في الموطإ مرسلًا عن عمرو بن يحيى عن أبيه عن النبي صلى الله عليه وآله وسلم، فأسقط أبا سعيد، وله طرق يقوي بعضها بعضًا.

[checked in repo] No. 32; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/207–210; [Shamela 4268, digital 724](https://shamela.ws/book/4268/724):

> حديث أبي سعيد لم يخرجه ابنُ ماجه، إنما خرجه الدارقطني والحاكم والبيهقي من رواية عثمان بن محمد بن عثمان بن ربيعة، حدثنا الدراوردي، عن عمرو بن يحيى المازني، عن أبيه، عن أبي سعيد الخدري، عن النبيِّ - ﷺ -، قال: "لا ضررَ ولا ضرار، من ضارّ ضرّه الله، ومن شاقّ شقّ الله عليه" وقال الحاكم: صحيح الإِسناد على شرط مسلم، وقال البيهقي: تفرّد به عثمان عن الدراوردي، وخرَّجه مالك في "الموطأ" عن عمرو بن يحيى عن أبيه مرسلًا.
> قال ابن عبد البرِّ: لم يختلف عن مالك في إرسال هذا الحديث، قال: ولا يُسند من وجه صحيحٍ، ثم خرَّجه من رواية عبد الملك بن معاذ النصيبي، عن الدراوردي موصولًا، والدراوردي كان الإمام أحمد يُضعف ما حدَّث به من حفظه، ولا يعبأ به، ولا شكَّ في تقديم قول مالكٍ على قوله. وقال خالد بن سعدٍ الأندلسي الحافظ: لم يصحَّ حديث: "لا ضرر ولا ضرار" مسندًا.
> وأما ابن ماجه، فخرَّجه من رواية فضيل بن سليمان، حدثنا موسى بن عقبة، حدثني إسحاق بن يحيى بن الوليد، عن عبادةَ بن الصامت أنَّ رسول الله - ﷺ - قضى أن لا ضرَر ولا ضِرار، وهذا من جملة صحيفة تُروى بهذا الإِسناد، وهي منقطعةٌ مأخوذة من كتابٍ، قاله ابنُ المديني وأبو زرعة وغيرهما، وإسحاق بن يحيى قيل: هو ابن طلحة، وهو ضعيف لم يسمع من عبادة، قاله أبو زرعة وابنُ أبي حاتم والدارقطني في موضع، وقيل: إنه إسحاق بن يحيى بن الوليد بن عبادة، ولم يسمع أيضًا من عبادة، قاله الدارقطني أيضًا.
> وذكره ابن عدي في كتابه "الضعفاء"، وقال: عامة أحاديثه غير محفوظة، وقيل: إن موسى بن عقبة لم يسمع منه، وإنَّما روى هذه الأحاديث عن أبي عياش الأسدي عنه، وأبو عياش لا يُعرف.
> وخرَّجه ابن ماجه أيضًا من وجه آخر من رواية جابر الجعفي، عن عكرمة، عن ابن عباس قال: قال رسول الله - ﷺ -: "لا ضَررَ ولا ضِرار" وجابر الجعفي ضعَّفه الأكثرون، وخرَّجه الدارقطني من رواية إبراهيم بن إسماعيل، عن داود بن الحصين، عن عكرمة، وإبراهيم ضعفه جماعة، وروايات داود عن عكرمة مناكير.
> وخرَّج الدَّارقطني من حديث الواقدي، حدثنا خارجة بن عبد الله بن سليمان بن زيد بن ثابت، عن أبي الرجال، عن عمرة، عن عائشة، عن النبيِّ - ﷺ -، قال: "لا ضرر، ولا ضِرار" والواقدي متروك، وشيخه مختلف في تضعيفه. وخرَّجه الطبراني من وجهين ضعيفين أيضًا عن القاسم عن عائشة.
> وخرَّج الطبراني أيضًا من رواية محمد بن سلمة عن ابن إسحاق عن محمد بن يحيى بن حبان، عن عمِّه واسع بن حبان، عن جابرٍ، عن النبيِّ - ﷺ -، قال: "لا ضَررَ ولا ضِرارَ في الإِسلام" وهذا إسناد مقارب وهو غريبٌ، لكن خرَّجه أبو داود في "المراسيل" من رواية عبد الرحمن بن مَغْراء عن ابن إسحاق، عن محمد بن يحيى بن حبان، عن عمه واسع مرسلًا، وهو أصحُّ.
> وخرَّج الدارقطني من رواية أبي بكر بن عياش، قال: أراه عن ابن عطاء، عن أبيه عن أبي هريرة أن النبيَّ - ﷺ -، قال: "لا ضررَ ولا ضرورَة، ولا يمنعنّ أحدُكم جاره أن يضع خشبه على حائطه"، وهذا الإِسناد فيه شكٌّ، وابن عطاء: هو يعقوب، وهو ضعيفٌ.
> وروى كثير بنُ عبد الله بن عمرو بن عوف المزني، عن أبيه، عن جدّه، عن النبيِّ - ﷺ -، قال: "لا ضرر ولا ضرار" قال ابنُ عبد البرِّ: إسناده غير صحيح.
> قلت: كثير هذا يصحح حديثَه الترمذي ويقول البخاري في بعض حديثه: هو أصحُّ حديثٍ في الباب، وحسن حديثَه إبراهيمُ بن المنذر الحِزامي، وقال: هو خير من مراسيل ابن المسيب، وكذلك حسَّنه ابنُ أبي عاصم، وترك حديثه آخرون، منهم الإمام أحمد وغيره، فهذا ما حضرنا مِن ذكر طُرُقِ أحاديث هذا الباب.
> وقد ذكر الشيخُ - رحمه الله - أنَّ بعضَ طرقه تُقوَّى ببعضٍ، وهو كما قال

[checked in repo] No. 33; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/99; [Shamela 12836, digital 65](https://shamela.ws/book/12836/65):

> حديث حسن، رواه البيهقي وغيره هكذا، وبعضه في الصحيحين.

[checked in repo] No. 33; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/226; [Shamela 4268, digital 743](https://shamela.ws/book/4268/743):

> أصلُ هذا الحديث خرَّجاه في "الصَّحيحين" من حديث ابن جريج عن ابن أبي مُليكة، عن ابن عباس، عن النبيِّ - ﷺ -، قال: "لو يُعطى النَّاسُ بدعواهم، لادَّعى ناسٌ دماءَ رجالٍ وأموالهم، ولكن اليمين على المدَّعى عليه".
> وخرَّجاه أيضًا من رواية نافع بنِ عمر الجمحي، عن ابن أبي مُليكة، عن ابن عباس أنَّ النبيِّ - ﷺ - قضى أنَّ اليمينَ على المدَّعى عليه.
> واللفظ الذي ساقه به الشيخ ساقه ابنُ الصَّلاح قبله في الأحاديث الكليات، وقال: رواه البيهقي بإسناد حسن.

[checked in repo] No. 39; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/110; [Shamela 12836, digital 76](https://shamela.ws/book/12836/76):

> حديث حسن رواه ابن ماجة والبيهقي وغيرهما.

[checked in repo] No. 39; البيهقي; السنن الكبرى للبيهقي, تحقيق محمد عبد القادر عطا، دار الكتب العلمية، بيروت، ط٣، ١٤٢٤هـ, printed 7/584, hadith 15094; [Shamela 7861, digital 17312](https://shamela.ws/book/7861/17312):

> جَوَّدَ إِسْنَادَهُ بِشْرُ بْنُ بَكْرٍ وَهُوَ مِنَ الثِّقَاتِ، وَرَوَاهُ الْوَلِيدُ بْنُ مُسْلِمٍ عَنِ الْأَوْزَاعِيِّ فَلَمْ يَذْكُرْ فِي إِسْنَادِهِ عُبَيْدَ بْنَ عُمَيْرٍ

[checked in repo] No. 39; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/361–362; [Shamela 4268, digital 878](https://shamela.ws/book/4268/878):

> هذا الحديثُ خرَّجه ابن ماجه من طريق الأوزاعي، عن عطاء، عن ابن عباس، عن النبيِّ - ﷺ -، وخرَّجه ابنُ حبَّان في "صحيحه" والدارقطني، وعندهما: عن الأوزاعي، عن عطاء، عن عُبيد بن عمير، عن ابنِ عباس، عن النبيِّ - ﷺ -.
> وهذا إسناد صحيح في ظاهر الأمر، ورواتُه كلهم محتجٌّ بهم في "الصحيحين" وقد خرَّجه الحاكم، وقال: صحيح على شرطهما. كذا قال، ولكن له علة، وقد أنكره الإِمام أحمد جدًا، وقال: ليس يُروى فيه إلا عن الحسن، عن النبيِّ - ﷺ - مرسلًا. وقيل لأحمد: إن الوليد بن مسلم روى عن مالك، عن نافع، عن ابن عمر مثله، فأنكره أيضًا.
> وذكر لأبي حاتم الرازي حديثُ الأوزاعي، وحديث مالك، وقيل له: إن الوليد روى أيضًا عن ابن لهيعة عن موسى بن وردان، عن عقبة بن عامر، عن النبيِّ - ﷺ - مثله، فقال أبو حاتم: هذه أحاديث منكرة كأنها موضوعة، وقال: لم يسمع الأوزاعيُّ هذا الحديثَ من عطاءٍ، وإنَّما سمعه من رجل لم يسمه، أتوهَّمُ أنَّه عبدُ الله بن عامر، أو إسماعيل بن مسلم، قال: ولا يصحُّ هذا الحديث، ولا يثبت إسنادُه.
> قلت: وقد رُوي عن الأوزاعي، عن عطاء، عن عُبيد بن عُمَير مرسلًا من غير ذكر ابن عباس، وروى يحيى بنُ سليم، عن ابن جريج، قال: قال عطاء: بلغنى أنَّ رسولَ الله - ﷺ - قال: "إنَّ الله تجاوزَ لأمَّتي عَنِ الخطأ والنِّسيان، وما استُكرهوا عليه" خرَّجه الجوزجاني، وهذا المرسلُ أشبه.

[checked in repo] No. 41; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/113; [Shamela 12836, digital 79](https://shamela.ws/book/12836/79):

> حديث حسن صحيح، رويناه في كتاب الحجة بإسناد صحيح.

[checked in repo] No. 41; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/393–395; [Shamela 4268, digital 910](https://shamela.ws/book/4268/910):

> يريد بصاحب كتاب "الحجة" الشيخ أبا الفتح نصر بن إبراهيم المقدسي الشافعي الفقيه الزاهد نزيل دمشق، وكتابه هذا هو كتاب "الحجة على تارك المحجة" يتضمن ذكرَ أصولِ الدين على قواعدِ أهل الحديث والسنة.
> وقد خرَّج هذا الحديث الحافظ أبو نعيم في كتاب "الأربعين" وشرط في أوَّلها أن تكون من صحاح الأخبار وجياد الآثار مما أجمع الناقلون على عدالة ناقليه، وخرَّجته الأئمة في مسانيدهم، ثم خرَّجه عن الطبراني: حدثنا أبو زيد عبد الرحمن بن حاتم المرادي، حدثنا نُعيم بن حمادٍ، حدثنا عبد الوهَّاب الثقفي، عن هشام بن حسان، عن محمد بن سيرين، عن عُقبة بن أوس، عن عبد الله بن عمروٍ، قال: قال رسولُ الله - ﷺ -: "لا يُؤمِنُ أَحدكم حتى يكونَ هواه تبعًا لما جئتُ به لا يزيغُ عنه". ورواه الحافظ أبو بكر بن عاصم الأصبهاني عن ابنِ واره، عن نُعيم بن حماد، حدثنا عبدُ الوهَّاب الثقفي حدثنا بعضُ مشيختنا هشامٌ أو غيره عن ابن سيرين، فذكره. وليس عنده "لا يزيغ عنه"، قال الحافظ أبو موسى المديني: هذا الحديث مُختَلفٌ فيه على نعيم، وقيل فيه: حدثنا بعضُ مشيختنا، حدثنا هشام أو غيره.
> قلت: تصحيحُ هذا الحديث بعيدٌ جدًّا من وجوه، منها: أنه حديثٌ يتفرد به نُعيمُ بنُ حماد المروزي، ونُعيم هذا وإن كان وثَّقه جماعةٌ مِنَ الأئمة، وخرَّج له البخاري، فإنَّ أئمةَ الحديث كانوا يُحسنون به الظنَّ، لِصلابته في السنة، وتشدُّده في الرَّدِّ على أهل الأهواء، وكانوا ينسبونه إلى أنه يَهِمُ، ويُشبّه عليه في بعض الأحاديث، فلمَّا كثُرَ عثورُهم على مناكيره، حكموا عليه بالضَّعف، فروى صالح بن محمد الحافظ عن ابن معين أنه سئل عنه فقال: ليس بشيء ولكنه صاحب سنة، قال صالح: وكان يُحدِّث من حفظه، وعنده مناكير كثيرة لا يُتابع عليها. وقال أبو داود: عند نعيم نحوُ عشرين حديثًا عن النبيِّ - ﷺ - ليس لها أصل، وقال النَّسائي: ضعيف. وقال مَرَّةً: ليس بثقة. وقال مرة: قد كثر تفرُّدُه عن الأئمة المعروفين في أحاديث كثيرةٍ، فصار في حدِّ مَنْ لا يُحتجُّ به. وقال أبو زرعة الدمشقي: يَصِلُ أحاديث يُوقِفُها النَّاسُ، يعني أنه يرفع الموقوفات، وقال أبو عروبة الحراني: هو مظلمُ الأمر، وقال أبو سعيد بن يونس: روى أحاديث مناكير عن الثقات، ونسبه آخرون إلى أنَّه كان يضعُ الحديثَ، وأين كان أصحاب عبد الوهَّاب الثقفي، وأصحاب هشام بن حسان، وأصحاب ابن سيرين عن هذا الحديث حتى يتفرَّدَ به نعيم؟
> ومنها: أنه قد اختلف على نُعيم في إسناده، فروي عنه، عن الثقفي، عن هشام، ورُوي عنه عن الثقفي، حدَّثنا بعضُ مشيختنا هشام أو غيره، وعلى هذه الرواية، فيكون شيخ الثَّقفيِّ غيرَ معروف عينه، ورُوي عنه، عن الثقفي، حدَّثنا بعض مشيختنا، حدَّثنا هشام أو غيره، فعلى هذه الرواية، فالثقفيُّ رواه عن شيخٍ مجهولٍ، وشيخه رواه عن غير مُعَيَّن، فتزدادُ الجهالةُ في إسناده.
> ومنها: أنَّ في إسناده عُقبةَ بن أوس السَّدوسي البصري، ويقال فيه: يعقوب بن أوس أيضًا، وقد خرَّج له أبو داود والنسائي وابن ماجه حديثًا عن عبد الله بن عمرو، ويقال: عبد الله بن عمر، وقد اضطرب في إسناده، وقد وثقه العجلي، وابن سعد، وابن حبان، وقال ابنُ خزيمة: روى عنه ابن سيرين مع جلالته، وقال ابنُ عبد البرِّ: هو مجهول.
> وقال الغلابي في "تاريخه": يزعمون أنَّه لم يسمع من عبد الله بن عمرو، وإنما يقول: قال عبد الله بن عمرو، فعلى هذا تكون رواياتُه عن عبد الله بن عمرو منقطعة والله أعلم.

[checked in repo] No. 42; النووي; الأربعون النووية, دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي, printed 1/115; [Shamela 12836, digital 80](https://shamela.ws/book/12836/80):

> رواه الترمذي وقال: حديث حسن صحيح.

[checked in repo] No. 42; النووي، كما نقله ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/400; [Shamela 4268, digital 917](https://shamela.ws/book/4268/917):

> رواهُ الترمذيُّ وقالَ: حديثٌ حَسَن.

[checked in repo] No. 42; الترمذي; سنن الترمذي, تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ, printed 5/548, hadith 3540; [Shamela 1435, digital 5840](https://shamela.ws/book/1435/5840):

> هَذَا حَدِيثٌ حَسَنٌ غَرِيبٌ لَا نَعْرِفُهُ إِلَّا مِنْ هَذَا الوَجْهِ

[checked in repo] No. 42; ابن رجب; جامع العلوم والحكم, لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ, printed 2/400; [Shamela 4268, digital 917](https://shamela.ws/book/4268/917):

> هذا الحديثُ تفرَّد به الترمذيُّ خرَّجه من طريق كثير بن فائد، حدَّثنا سعيدُ بن عبيد، سمعتُ بكر بن عبد الله المزني يقولُ: حدثنا أنسٌ، فذكره، وقال: حسنٌ غريبٌ، لا نعرفه إلا من هذا الوجه. انتهى.
> وإسناده لا بأس به، وسعيدُ بنُ عبيد هو الهُنائي، قال أبو حاتم: شيخ. وذكره ابن حبان في "الثقات"، ومن زعم أنَّه غيرُ الهنائي، فقد وهِمَ، وقال الدارقطني: تفرَّد به كثيرُ بن فائد، عن سعيد مرفوعًا، ورواهُ سَلْم بنُ قتيبة، عن سعيد بن عبيد، فوقفه على أنس.
> قلت: قد روي عنه مرفوعًا وموقوفًا، وتابعه على رفعه أيضًا أبو سعيد مولى بني هاشم، فرواه عن سعيد بن عُبيد مرفوعًا أيضًا، وقد روي أيضًا من حديث ثابت، عن أنس مرفوعًا، ولكن قال أبو حاتم: هو منكر.

[checked in repo] That inventory has 39 saved grading passages on 14 of the Forty: 11, 12, 18, 19, 27, 28, 29, 30, 31, 32, 33, 39, 41 and 42. Several passages contain multiple scholars and multiple technical terms. The count is passages, not 39 independent authentication verdicts.

[checked in repo] The complete Tirmidhi 2318 record, attached to no. 12, additionally supplies this connected context around the shorter saved grade. Tirmidhi, Shakir and colleagues / al-Halabi second 1395, printed 4/558–559; [Shamela 1435, digital 4011](https://shamela.ws/book/1435/4011):

> وَهَكَذَا رَوَى غَيْرُ وَاحِدٍ مِنْ أَصْحَابِ الزُّهْرِيِّ عَنِ الزُّهْرِيِّ، عَنْ عَلِيِّ بْنِ حُسَيْنٍ، عَنِ النَّبِيِّ ﷺ نَحْوَ حَدِيثِ مَالِكٍ مُرْسَلًا، وَهَذَا عِنْدَنَا أَصَحُّ مِنْ حَدِيثِ أَبِي سَلَمَةَ عَنْ أَبِي هُرَيْرَةَ، وَعَلِيُّ بْنُ حُسَيْنٍ لَمْ يُدْرِكْ عَلِيَّ بْنَ أَبِي طَالِبٍ

[inferred] A term-to-hadith link selects the scholar's actual word and its exact record or route. The ledger above supports examples for حسن صحيح، غريب، مرسل، منقطع، مرفوع، موقوف and narrator criticism. It does not license attaching all of a prose work's categories to a record just because a parser can draw it. Preserve the full context, speaker and source page when selecting a short example. This follows R0026 and R0063.

## 3. Ibn Hajar's ranks and generations

[checked against source] The baseline for this introduction is Muhammad Awwama, Dar al-Rashid, first 1406/1986, volume 1, printed pp. 73–75. Its complete introduction is present in the [JK000121 research witness](https://github.com/OpenITI/0875AH/blob/5835c183b8bbf4ea454d5c1be2b168b669403771/data/0852IbnHajarCasqalani/0852IbnHajarCasqalani.TaqribTahdhib/0852IbnHajarCasqalani.TaqribTahdhib.JK000121-ara1.completed), SHA-256 `178d493bd150032bc64a81ed4397d7e4a828209ee690deed283c1e63cada4637`. The live Shamela 8609 witness begins at printed p. 75, digital 1. **No live Shamela digital page for printed pp. 73–74 was available in that witness.** That is a gap, not permission to cite digital 1 as printed p. 73. The research corpus is used here to locate and quote the classical text, not adopted as a shipping source.

[checked against source] The following reproduces that introduction witness's words with its line-wrap and corpus markup removed. Its digital reading “التهجم” in rank five is retained, not silently corrected. Because images of pp. 73–75 have not been inspected, these are provisional transcription quotations, not certified verbatim print quotations. This prevents declaring the introduction ready for the app. The alternative Mustafa Abd al-Qadir Ata witness was also inspected: its modern introduction's summary omits a rank, whereas the author's later introduction has twelve. It is not used to repair or replace the pinned Awwama wording here.

| Status | Rank | Ibn Hajar's wording in the pinned witness | Printed locator / Shamela digital locator |
| --- | --- | --- | --- |
| Checked against source | 1 | «فأولها : الصحابة : فأصرح بذلك لشرفهم .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 2 | «الثانية : من أكد مدحه : إما : بأفعل : كأوثق الناس ، أو بتكرير الصفة لفظا : كثقة ثقة ، أو معنى : كثقة حافظ .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 3 | «الثالثة : من أفرد بصفة ، كثقة ، أو متقن ، أو ثبت ، أو عدل .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 4 | «الرابعة : من قصر عن درجة الثالثة قليلا ، وإليه الإشارة : بصدوق ، أو لا بأس به ، أو ليس به بأس .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 5 | «الخامسة : من قصر عن الرابعة قليلا ، وإليه الإشارة بصدوق سيء الحفظ ، أو صدوق يهم ، أو له أوهام ، أو يخطىء ، أو تغير بأخرة . ويلتحق بذلك من رمي بنوع من البدعة ، كالتشيع والقدر ، والنصب ، والإرجاء ، والتهجم ، مع بيان الداعية من غيره .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 6 | «السادسة : من ليس له من الحديث إلا القليل ، ولم يثبت فيه ما يترك حديثه من أجله ، وإليه الإشارة بلفظ : مقبول ، حيث يتابع ، وإلا فلين الحديث .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 7 | «السابعة : من روى عنه أكثر من واحد ولم يوثق ، وإليه الإشارة بلفظ : مستور ، أو مجهول الحال .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 8 | «الثامنة : من لم يوجد فيه توثيق لمعتبر ، ووجد فيه إطلاق الضعف ، ولو لم يفسر ، وإليه الإشارة بلفظ : ضعيف .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 9 | «التاسعة : من لم يرو عنه غير واحد ، ولم يوثق ، وإليه الإشارة بلفظ : مجهول .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 10 | «العاشرة : من لم يوثق البتة ، وضعف مع ذلك بقادح ، وإليه الإشارة : بمتروك ، أو متروك الحديث ، أو واهي الحديث ، أو ساقط .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 11 | «الحادية عشرة : من اتهم بالكذب .» | 1/74; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 12 | «الثانية عشرة : من أطلق عليه اسم الكذب ، والوضع .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |

| Status | Generation | Ibn Hajar's wording in the same witness | Printed locator / Shamela digital locator |
| --- | --- | --- | --- |
| Checked against source | 1 | «فالأولى : الصحابة ، على اختلاف مراتبهم ، وتمييز من ليس له منهم إلا مجرد الرؤية من غيره .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 2 | «الثانية : طبقة كبار التابعين ، كابن المسيب ، فإن كان مخضرما صرحت بذلك .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 3 | «الثالثة : الطبقة الوسطى من التابعين ، كالحسن وابن سيرين .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 4 | «الرابعة : طبقة تليها ، جل روايتهم عن كبار التابعين ، كالزهري وقتادة .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 5 | «الخامسة : الطبقة الصغرى منهم ، الذين رأوا الواحد والاثنين ، ولم يثبت لبعضهم السماع من الصحابة ، كالأعمش .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 6 | «السادسة : طبقة عاصروا الخامسة ، لكن لم يثبت لهم لقاء أحد من الصحابة ، كابن جريج .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 7 | «السابعة : كبار أتباع التابعين ، كمالك والثوري .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 8 | «الثامنة : الطبقة الوسطى منهم ، كابن عيينة وابن علية .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 9 | «التاسعة : الطبقة الصغرى من أتباع التابعين : كيزيد بن هارون ، والشافعي ، وأبي داود الطيالسي ، وعبد الرزاق .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 10 | «العاشرة : كبار الآخذين عن تبع الأتباع ، ممن لم يلق التابعين ، كأحمد بن حنبل .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 11 | «الحادية عشرة : الطبقة الوسطى من ذلك ، كالذهلي والبخاري .» | 1/75; live Shamela page unavailable in 8609; pinned introduction witness above |
| Checked against source | 12 | «الطبقة الثانية عشرة : صغار الآخذين عن تبع الأتباع ، كالترمذي ، وألحقت بها باقي شيوخ الأئمة الستة ، الذين تأخرت وفاتهم قليلا ، كبعض شيوخ النسائي .» | 1/75; [Shamela 8609, digital 1](https://shamela.ws/book/8609/1) |

[checked against source] The modern Awwama introduction, apparatus, entry numbers and digital catalogue text are not Ibn Hajar's sentences. The bracket insertions in the live biographical quotations below belong to the composite witness described in the earlier audit; they are not silently attributed to Ibn Hajar. Examples include the bracketed additions in entries 3620, 4888, 8426 and 8633. The numerical ordinals and prose within Ibn Hajar's own twelve-item lists are authorial; they must not be deleted by a blanket “remove every number” rule learned from a different book. The classical codes such as ع and خ at the ends of entries are part of the author's reference system, not narrator grades.

[inferred] A generation display should show the quoted من الرابعة or the whole entry and open Ibn Hajar's corresponding introduction passage. A separate rank display should quote his actual descriptive words. Do not turn every ثقة حافظ automatically into an app-authored number, infer a grade for the hadith from its narrators' rows, or treat the twelve generations as twelve reliability ranks.

## 4. Narrator ledger for the Bukhari chains

### Scope, counts and identification standard

[checked in repo] The requested count of 17 records / about 77 forms is not the current snapshot. Counting only explicit `chain` arrays under `book: bukhari`, with exact Unicode equality and without the collector as an added narrator, gives:

| Status | Scope | Records carrying a chain | Narrator occurrences | Exact name forms |
| --- | --- | --- | --- | --- |
| Checked in repo | Nawawi nos. 1–42 | 16 | 82 | 73 |
| Checked in repo | Ibn Rajab nos. 43–50 | 4 | 22 | 17, of which 15 are additional to the first scope |
| Checked in repo | All fifty | 20 | 104 | 88 |

[checked in repo] No. 33's Bukhari 4552 array ends at Ibn Abi Mulayka. The record then tells a story with Ibn Abbas inside it; the array's end does not mean he is the Companion narrator of the embedded report. Counting only the stored arrays is intentional. The bare forms أبيه and أبي are repeated for different fathers. Conversely, several differently inflected forms identify the same proposed person. A unique-string count is not a unique-person count.

[inferred] “Resolved” below is an identification decision in this research ledger, supported by a qualified name/alias or a cited commentator's identification, not an independently approved new people record. “Unresolved” means the occurrence must not inherit the candidate's rank or biography. The source's actual name stays visible in all cases. Candidate entry quotations remain useful even when the matching decision is open.

[inferred] Under this conservative standard, **78 of 104 occurrences are resolved, representing 61 distinct identified people; 26 occurrences remain unresolved**. The exact total of unique people across all 104 cannot honestly be fixed while those occurrences are open. The identified-person count is a lower bound, not “88 people.” The full candidate dictionary below contains 92 entries, including alternatives, so its count must not be reported as a count of actual narrators.

### Direct commentator evidence

[checked against source] Fath al-Bari, al-Maktaba al-Salafiyya first 1380–1390 AH, 13 volumes plus Hady al-Sari, [Shamela 1673](https://shamela.ws/book/1673), provides the following identification evidence. These quotations use the live Salafiyya witness, not the differently described historical export's metadata. Printed volume/page and digital page are separate.

[checked against source] Ibn Hajar, Fath, printed 1/10; [digital 496](https://shamela.ws/book/1673/496):

> قَوْلُهُ: (حَدَّثَنَا الْحُمَيْدِيُّ) هُوَ أَبُو بَكْرٍ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ بْنِ عِيسَى، مَنْسُوبٌ إِلَى حُمَيْدِ بْنِ أُسَامَةَ بَطْنٍ مِنْ بَنِي أَسَدِ بْنِ عَبْدِ الْعُزَّى بْنِ قُصَيٍّ رَهْطِ خَدِيجَةَ زَوْجِ النَّبِيِّ ﷺ، يَجْتَمِعُ مَعَهَا فِي أَسَدٍ وَيَجْتَمِعُ مَعَ النَّبِيِّ ﷺ فِي قُصَيٍّ.
> قَوْلُهُ: (حَدَّثَنَا سُفْيَانُ) هُوَ ابْنُ عُيَيْنَةَ بْنِ أَبِي عِمْرَانَ الْهِلَالِيُّ أَبُو مُحَمَّدٍ الْمَكِّيُّ، أَصْلُهُ وَمَوْلِدُهُ الْكُوفَةُ، وَقَدْ شَارَكَ مَالِكًا فِي كَثِيرٍ مِنْ شُيُوخِهِ وَعَاشَ بَعْدَهُ عِشْرِينَ سَنَةً، وَكَانَ يَذْكُرُ أَنَّهُ سَمِعَ مِنْ سَبْعِينَ مِنَ التَّابِعِينَ.
> قَوْلُهُ: (عَنْ يَحْيَى بْنِ سَعِيدٍ) فِي رِوَايَةِ غَيْرِ أَبِي ذَرٍّ: حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ. اسْمُ جَدِّهِ قَيْسُ بْنُ عَمْرٍو وَهُوَ صَحَابِيٌّ، وَيَحْيَى مِنْ صِغَارِ التَّابِعِينَ، وَشَيْخُهُ مُحَمَّدُ بْنُ إِبْرَاهِيمَ بْنِ الْحَارِثِ بْنِ خَالِدٍ التَّيْمِيُّ مِنْ أَوْسَاطِ التَّابِعِينَ، وَشَيْخُ مُحَمَّدٍ، عَلْقَمَةُ بْنُ وَقَّاصٍ اللَّيْثِيُّ مِنْ كِبَارِهِمْ، فَفِي الْإِسْنَادِ ثَلَاثَةٌ مِنَ التَّابِعِينَ فِي نَسَقٍ.

[checked against source] Ibn Hajar, Fath, printed 1/49; [digital 535](https://shamela.ws/book/1673/535):

> قَوْلُهُ: (حَنْظَلَةُ بْنُ أَبِي سُفْيَانَ) هُوَ قُرَشِيٌّ مَكِّيٌّ مِنْ ذُرِّيَّةِ صَفْوَانَ بْنِ أُمَيَّةَ الْجُمَحِيِّ، وَعِكْرِمَةُ بْنُ خَالِدٍ هُوَ ابْنُ سَعِيدِ بْنِ الْعَاصِ بْنِ هِشَامِ بْنِ الْمُغِيرَةِ الْمَخْزُومِيُّ، وَهُوَ ثِقَةٌ مُتَّفَقٌ عَلَيْهِ، وَفِي طَبَقَتِهِ عِكْرِمَةُ بْنُ خَالِدِ بْنِ سَلَمَةَ بْنِ هِشَامِ بْنِ الْمُغِيرَةِ الْمَخْزُومِيُّ، وَهُوَ ضَعِيفٌ، وَلَمْ يُخَرِّجْ لَهُ الْبُخَارِيُّ، نَبَّهْتُ عَلَيْهِ لِشِدَّةِ الْتِبَاسِهِ، وَيَفْتَرِقَانِ بِشُيُوخِهِمَا، وَلَمْ يُرْوَ الضَّعِيفُ عَنِ ابْنِ عُمَرَ.

[checked against source] Ibn Hajar, Fath, printed 1/126; [digital 612](https://shamela.ws/book/1673/612):

> قَوْلُهُ: (حَدَّثَنَا زَكَرِيَّاءُ) هُوَ ابْنُ أَبِي زَائِدَةَ، وَاسْمُ أَبِي زَائِدَةَ خَالِدُ بْنُ مَيْمُونٍ الْوَادِعِيُّ.

[checked against source] Ibn Hajar, Fath, printed 5/301; [digital 3083](https://shamela.ws/book/1673/3083):

> قَوْلُهُ: (حَدَّثَنَا يَعْقُوبُ) كَذَا لِلْأَكْثَرِ غَيْرَ مَنْسُوبٍ، وَانْفَرَدَ ابْنُ السَّكَنِ بِقَوْلِهِ: يَعْقُوبُ بْنُ مُحَمَّدٍ، وَوَقَعَ نَظِيرُ هَذَا فِي الْمَغَازِي فِي بَابِ فَضْلِ مَنْ شَهِدَ بَدْرًا قَالَ الْبُخَارِيُّ: حَدَّثَنَا يَعْقُوبُ، حَدَّثَنَا إِبْرَاهِيمُ بْنُ سَعْدٍ فَوَقَعَ عِنْدَ ابْنِ السَّكَنِ يَعْقُوبُ بْنُ مُحَمَّدٍ أَيِ الزُّهْرِيُّ، وَعِنْدَ الْأَكْثَرِ غَيْرَ مَنْسُوبٍ، لَكِنْ قَالَ أَبُو ذَرٍّ فِي رِوَايَتِهِ فِي الْمَغَازِي: يَعْقُوبُ بْنُ إِبْرَاهِيمَ أَيِ الدَّوْرَقِيُّ وَقَدْ رَوَى الْبُخَارِيُّ فِي الطَّهَارَةِ عَنْ يَعْقُوبَ بْنِ إِبْرَاهِيمَ، عَنْ إِسْمَاعِيلَ ابْنِ عُلَيَّةَ حَدَّثَنَا فَنَسَبَهُ أَبُو ذَرٍّ فِي رِوَايَتِهِ فَقَالَ: الدَّوْرَقِيُّ وَجَزَمَ الْحَاكِمُ بِأَنَّ يَعْقُوبَ الْمَذْكُورَ هُنَا هُوَ ابْنُ مُحَمَّدٍ كَمَا فِي رِوَايَةِ ابْنِ السَّكَنِ، وَجَزَمَ أَبُو

[checked against source] Ibn Hajar, Fath, printed 5/302; [digital 3084](https://shamela.ws/book/1673/3084):

> أَحْمَدَ الْحَاكِمُ، وَابْنُ مَنْدَهْ، وَالْحَبَّالُ وَآخَرُونَ بِأَنَّهُ يَعْقُوبُ بْنُ حُمَيْدِ بْنِ كَاسِبٍ، وَرَدَّ ذَلِكَ الْبَرْقَانِيُّ بِأَنَّ يَعْقُوبَ بْنَ حُمَيْدٍ لَيْسَ مِنْ شَرْطِهِ، وَجَوَّزَ أَبُو مَسْعُودٍ أَنَّهُ يَعْقُوبُ ابْنُ إِبْرَاهِيمَ بْنِ سَعْدٍ، وَرُدَّ عَلَيْهِ بِأَنَّ الْبُخَارِيَّ لَمْ يَلْقَهُ فَإِنَّهُ مَاتَ قَبْلَ أَنْ يَرْحَلَ، وَأَجَابَ الْبَرْقَانِيُّ عَنْهُ بِجَوَازِ سُقُوطِ الْوَاسِطَةِ وَهُوَ بَعِيدٌ، وَالَّذِي يَتَرَجَّحُ عِنْدِي أَنَّهُ الدَّوْرَقِيُّ حَمْلًا لِمَا أَطْلَقَهُ عَلَى مَا قَيَّدَهُ، وَهَذِهِ عَادَةُ الْبُخَارِيِّ لَا يُهْمِلُ نِسْبَةَ الرَّاوِي إِلَّا إِذَا ذَكَرَهَا فِي مَكَانٍ آخَرَ فَيُهْمِلُهَا اسْتِغْنَاءً بِمَا سَبَقَ وَاللَّهُ أَعْلَمُ.
> وَقَدْ جَزَمَ أَبُو عَلِيٍّ الصّدق بِأَنَّهُ الدَّوْرَقِيُّ، وَكَذَا جَزَمَ أَبُو نُعَيْمٍ فِي الْمُسْتَخْرَجِ بِأَنَّ الْبُخَارِيَّ أَخْرَجَ هَذَا الْحَدِيثَ الَّذِي فِي الصُّلْحِ عَنْ يَعْقُوبَ بْنِ إِبْرَاهِيمَ.

[checked against source] Ibn Hajar, Fath, printed 6/132; [digital 3326](https://shamela.ws/book/1673/3326):

> قَوْلُهُ: (حَدَّثَنَا إِسْحَاقُ، أَخْبَرَنَا عَبْدُ الرَّزَّاقِ) كَذَا هُوَ غَيْرُ مَنْسُوبٍ، وَقَدْ تَقَدَّمَ فِي بَابِ فَضْلِ مَنْ حَمَلَ مَتَاعَ صَاحِبِهِ فِي السَّفَرِ عَنْ إِسْحَاقَ بْنِ نَصْرٍ، عَنْ عَبْدِ الرَّزَّاقِ لَكِنَّ سِيَاقَهُ مُغَايِرٌ لِسِيَاقِهِ هُنَا، وَتَقَدَّمَ فِي الصُّلْحِ عَنْ إِسْحَاقَ بْنِ مَنْصُورٍ، عَنْ عَبْدِ الرَّزَّاقِ مُقْتَصِرًا عَلَى بَعْضِهِ، وَهُوَ أَشْبَهُ بِسِيَاقِهِ هُنَا فَلْيُفَسَّرْ بِهِ هَذَا الْمُهْمَلُ هُنَا.

[checked against source] Ibn Hajar, Fath, printed 1/91; [digital 577](https://shamela.ws/book/1673/577):

> قَوْلُهُ: (تَابَعَهُ شُعْبَةُ) وَصَلَ الْمُؤَلِّفُ هَذِهِ الْمُتَابَعَةَ فِي كِتَابِ الْمَظَالِمِ، وَرِوَايَةُ قَبِيصَةَ، عَنْ سُفْيَانَ - وَهُوَ الثَّوْرِيُّ - ضَعَّفَهَا يَحْيَى بْنُ مَعِينٍ، وَقَالَ الشَّيْخُ مُحْيِي الدِّينِ: إِنَّمَا أَوْرَدَهَا الْبُخَارِيُّ عَلَى طَرِيقِ الْمُتَابَعَةِ لَا الْأَصَالَةِ.

[inferred] The first chain's qualified names and Fath's identifications resolve its shorter forms in Bukhari 54. Fath explicitly distinguishes the two Ikrimas in Bukhari 8; only the one identified in that route is mapped, while the alternative's entry is retained for comparison. The two occurrences of سفيان are Ibn Uyayna in Bukhari 1 and al-Thawri in Bukhari 34, as the cited Fath passages state. Ibn Hajar identifies Ishaq in 2989 with Ibn Mansur through another placement; that does not resolve the Ishaq in 4343.

[inferred] Yaqub in 2697 stays unresolved even though Ibn Hajar states his own preference. The ledger preserves the alternatives named in his discussion, including the Ibn Ibrahim b. Sa'd identification he rejects on chronological grounds. No average or majority identification is manufactured. Where the only current evidence is a plausible bare-name candidate, the occurrence remains unresolved below.

### Every exact form, with each chain context

[checked in repo] In the table, `N/B` means anthology entry / Bukhari record. “Between” reproduces the neighbouring array labels in order; it establishes what the array stores, not a new judgment that direct hearing occurred. Evidence and resolution decisions in the last column are ours. Entry links point into the full quoted dictionary immediately below.

| Status | Form ID / exact array name | Occurrences and neighbouring labels | Taqrib candidate entry IDs | Identification evidence / decision |
| --- | --- | --- | --- | --- |
| Checked in repo | F1: عَبْدُ اللهِ بْنُ مَسْلَمَةَ | 1/B54: البخاري → **عَبْدُ اللهِ بْنُ مَسْلَمَةَ** → مَالِكٌ | [T3620](#t3620) | [inferred] B54: 3620. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F2: مَالِكٌ | 1/B54: عَبْدُ اللهِ بْنُ مَسْلَمَةَ → **مَالِكٌ** → يَحْيَى بْنِ سَعِيدٍ<br>9/B7288: إِسْمَاعِيلُ → **مَالِكٌ** → أَبِي الزِّنَادِ | [T6425](#t6425) | [inferred] B54: unresolved; B7288: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F3: يَحْيَى بْنِ سَعِيدٍ | 1/B54: مَالِكٌ → **يَحْيَى بْنِ سَعِيدٍ** → مُحَمَّدِ بْنِ إِبْرَاهِيمَ | [T7559](#t7559) | [inferred] B54: 7559. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F4: مُحَمَّدِ بْنِ إِبْرَاهِيمَ | 1/B54: يَحْيَى بْنِ سَعِيدٍ → **مُحَمَّدِ بْنِ إِبْرَاهِيمَ** → عَلْقَمَةَ بْنِ وَقَّاصٍ | [T5691](#t5691) | [inferred] B54: 5691. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F5: عَلْقَمَةَ بْنِ وَقَّاصٍ | 1/B54: مُحَمَّدِ بْنِ إِبْرَاهِيمَ → **عَلْقَمَةَ بْنِ وَقَّاصٍ** → عُمَرَ | [T4685](#t4685) | [inferred] B54: 4685. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F6: عُمَرَ | 1/B54: عَلْقَمَةَ بْنِ وَقَّاصٍ → **عُمَرَ** → المتن | [T4888](#t4888) | [inferred] B54: 4888. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F7: الْحُمَيْدِيُّ عَبْدُ اللهِ بْنُ الزُّبَيْرِ | 1/B1: البخاري → **الْحُمَيْدِيُّ عَبْدُ اللهِ بْنُ الزُّبَيْرِ** → سُفْيَانُ | [T3320](#t3320) | [inferred] B1: 3320. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F8: سُفْيَانُ | 1/B1: الْحُمَيْدِيُّ عَبْدُ اللهِ بْنُ الزُّبَيْرِ → **سُفْيَانُ** → يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ<br>48/B34: قَبِيصَةُ بْنُ عُقْبَةَ → **سُفْيَانُ** → الْأَعْمَشِ | [T2451](#t2451), [T2445](#t2445) | [inferred] B1: 2451; B34: 2445. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F9: يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ | 1/B1: سُفْيَانُ → **يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ** → مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ | [T7559](#t7559) | [inferred] B1: 7559. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F10: مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ | 1/B1: يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ → **مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ** → عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ | [T5691](#t5691) | [inferred] B1: 5691. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F11: عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ | 1/B1: مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ → **عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ** → عُمَرَ بْنَ الْخَطَّابِ | [T4685](#t4685) | [inferred] B1: 4685. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F12: عُمَرَ بْنَ الْخَطَّابِ | 1/B1: عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ → **عُمَرَ بْنَ الْخَطَّابِ** → المتن | [T4888](#t4888) | [inferred] B1: 4888. Fath 1/10, digital 496; compare B1 and B54, preserving the stated names. |
| Checked in repo | F13: عُبَيْدُ اللهِ بْنُ مُوسَى | 3/B8: البخاري → **عُبَيْدُ اللهِ بْنُ مُوسَى** → حَنْظَلَةُ بْنُ أَبِي سُفْيَانَ | [T4345](#t4345) | [inferred] B8: 4345. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F14: حَنْظَلَةُ بْنُ أَبِي سُفْيَانَ | 3/B8: عُبَيْدُ اللهِ بْنُ مُوسَى → **حَنْظَلَةُ بْنُ أَبِي سُفْيَانَ** → عِكْرِمَةَ بْنِ خَالِدٍ | [T1582](#t1582) | [inferred] B8: 1582. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F15: عِكْرِمَةَ بْنِ خَالِدٍ | 3/B8: حَنْظَلَةُ بْنُ أَبِي سُفْيَانَ → **عِكْرِمَةَ بْنِ خَالِدٍ** → ابْنِ عُمَرَ | [T4668](#t4668), [T4669](#t4669) | [inferred] B8: 4668. Fath 1/49, digital 535 explicitly distinguishes the two candidates and this Ibn Umar route. |
| Checked in repo | F16: ابْنِ عُمَرَ | 3/B8: عِكْرِمَةَ بْنِ خَالِدٍ → **ابْنِ عُمَرَ** → المتن<br>8/B25: أَبِي → **ابْنِ عُمَرَ** → المتن | [T3490](#t3490) | [inferred] B8: 3490; B25: 3490. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F17: يَعْقُوبُ | 5/B2697: البخاري → **يَعْقُوبُ** → إِبْرَاهِيمُ بْنُ سَعْدٍ | [T7812](#t7812), [T7834](#t7834), [T7815](#t7815), [T7811](#t7811) | [inferred] B2697: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F18: إِبْرَاهِيمُ بْنُ سَعْدٍ | 5/B2697: يَعْقُوبُ → **إِبْرَاهِيمُ بْنُ سَعْدٍ** → أَبِيهِ | [T177](#t177) | [inferred] B2697: 177. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F19: أَبِيهِ | 5/B2697: إِبْرَاهِيمُ بْنُ سَعْدٍ → **أَبِيهِ** → الْقَاسِمِ بْنِ مُحَمَّدٍ<br>43/B6732: ابْنُ طَاوُسٍ → **أَبِيهِ** → ابْنِ عَبَّاسٍ<br>46/B4343: سَعِيدِ بْنِ أَبِي بُرْدَةَ → **أَبِيهِ** → أَبِي مُوسَى الْأَشْعَرِيِّ | [T2227](#t2227), [T3009](#t3009), [T7952](#t7952) | [inferred] B2697: 2227; B6732: 3009; B4343: 7952. Pronoun refers to the immediately preceding narrator; his full nasab in the quoted Taqrib entry identifies that father. This is not one shared person for the form. |
| Checked in repo | F20: الْقَاسِمِ بْنِ مُحَمَّدٍ | 5/B2697: أَبِيهِ → **الْقَاسِمِ بْنِ مُحَمَّدٍ** → عَائِشَةَ | [T5489](#t5489) | [inferred] B2697: 5489. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F21: عَائِشَةَ | 5/B2697: الْقَاسِمِ بْنِ مُحَمَّدٍ → **عَائِشَةَ** → المتن | [T8633](#t8633) | [inferred] B2697: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F22: أَبُو نُعَيْمٍ | 6/B52: البخاري → **أَبُو نُعَيْمٍ** → زَكَرِيَّاءُ | [T5401](#t5401) | [inferred] B52: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F23: زَكَرِيَّاءُ | 6/B52: أَبُو نُعَيْمٍ → **زَكَرِيَّاءُ** → عَامِرٍ | [T2022](#t2022) | [inferred] B52: 2022. Fath under B52, printed 1/126, digital 612 identifies Zakariyya and al-Shabi. |
| Checked in repo | F24: عَامِرٍ | 6/B52: زَكَرِيَّاءُ → **عَامِرٍ** → النُّعْمَانَ بْنَ بَشِيرٍ | [T3092](#t3092) | [inferred] B52: 3092. Fath under B52, printed 1/126, digital 612 identifies Zakariyya and al-Shabi. |
| Checked in repo | F25: النُّعْمَانَ بْنَ بَشِيرٍ | 6/B52: عَامِرٍ → **النُّعْمَانَ بْنَ بَشِيرٍ** → المتن | [T7152](#t7152) | [inferred] B52: 7152. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F26: عَبْدُ اللهِ بْنُ مُحَمَّدٍ الْمُسْنَدِيُّ | 8/B25: البخاري → **عَبْدُ اللهِ بْنُ مُحَمَّدٍ الْمُسْنَدِيُّ** → أَبُو رَوْحٍ الْحَرَمِيُّ بْنُ عُمَارَةَ | [T3585](#t3585) | [inferred] B25: 3585. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F27: أَبُو رَوْحٍ الْحَرَمِيُّ بْنُ عُمَارَةَ | 8/B25: عَبْدُ اللهِ بْنُ مُحَمَّدٍ الْمُسْنَدِيُّ → **أَبُو رَوْحٍ الْحَرَمِيُّ بْنُ عُمَارَةَ** → شُعْبَةُ | [T1178](#t1178) | [inferred] B25: 1178. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F28: شُعْبَةُ | 8/B25: أَبُو رَوْحٍ الْحَرَمِيُّ بْنُ عُمَارَةَ → **شُعْبَةُ** → وَاقِدِ بْنِ مُحَمَّدٍ | [T2790](#t2790) | [inferred] B25: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F29: وَاقِدِ بْنِ مُحَمَّدٍ | 8/B25: شُعْبَةُ → **وَاقِدِ بْنِ مُحَمَّدٍ** → أَبِي | [T7389](#t7389) | [inferred] B25: 7389. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F30: أَبِي | 8/B25: وَاقِدِ بْنِ مُحَمَّدٍ → **أَبِي** → ابْنِ عُمَرَ<br>14/B6878: عُمَرُ بْنُ حَفْصٍ → **أَبِي** → الْأَعْمَشُ | [T5892](#t5892), [T1430](#t1430) | [inferred] B25: 5892; B6878: 1430. Pronoun refers to the immediately preceding narrator; his full nasab in the quoted Taqrib entry identifies that father. This is not one shared person for the form. |
| Checked in repo | F31: إِسْمَاعِيلُ | 9/B7288: البخاري → **إِسْمَاعِيلُ** → مَالِكٌ | [T460](#t460) | [inferred] B7288: 460. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F32: أَبِي الزِّنَادِ | 9/B7288: مَالِكٌ → **أَبِي الزِّنَادِ** → الْأَعْرَجِ | [T3302](#t3302) | [inferred] B7288: 3302. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F33: الْأَعْرَجِ | 9/B7288: أَبِي الزِّنَادِ → **الْأَعْرَجِ** → أَبِي هُرَيْرَةَ | [T4033](#t4033) | [inferred] B7288: 4033. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F34: أَبِي هُرَيْرَةَ | 9/B7288: الْأَعْرَجِ → **أَبِي هُرَيْرَةَ** → المتن<br>15/B6018: أَبِي صَالِحٍ → **أَبِي هُرَيْرَةَ** → المتن<br>16/B6116: أَبِي صَالِحٍ → **أَبِي هُرَيْرَةَ** → المتن<br>26/B2989: هَمَّامٍ → **أَبِي هُرَيْرَةَ** → المتن<br>38/B6502: عَطَاءٍ → **أَبِي هُرَيْرَةَ** → المتن | [T8426](#t8426) | [inferred] B7288: 8426; B6018: 8426; B6116: 8426; B2989: 8426; B6502: 8426. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F35: عُمَرُ بْنُ حَفْصٍ | 14/B6878: البخاري → **عُمَرُ بْنُ حَفْصٍ** → أَبِي | [T4880](#t4880) | [inferred] B6878: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F36: الْأَعْمَشُ | 14/B6878: أَبِي → **الْأَعْمَشُ** → عَبْدِ اللهِ بْنِ مُرَّةَ | [T2615](#t2615) | [inferred] B6878: 2615. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F37: عَبْدِ اللهِ بْنِ مُرَّةَ | 14/B6878: الْأَعْمَشُ → **عَبْدِ اللهِ بْنِ مُرَّةَ** → مَسْرُوقٍ<br>48/B34: الْأَعْمَشِ → **عَبْدِ اللهِ بْنِ مُرَّةَ** → مَسْرُوقٍ | [T3607](#t3607) | [inferred] B6878: 3607; B34: 3607. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F38: مَسْرُوقٍ | 14/B6878: عَبْدِ اللهِ بْنِ مُرَّةَ → **مَسْرُوقٍ** → عَبْدِ اللهِ<br>48/B34: عَبْدِ اللهِ بْنِ مُرَّةَ → **مَسْرُوقٍ** → عَبْدِ اللهِ بْنِ عَمْرٍو | [T6601](#t6601) | [inferred] B6878: unresolved; B34: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F39: عَبْدِ اللهِ | 14/B6878: مَسْرُوقٍ → **عَبْدِ اللهِ** → المتن | [T3613](#t3613) | [inferred] B6878: 3613. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F40: قُتَيْبَةُ بْنُ سَعِيدٍ | 15/B6018: البخاري → **قُتَيْبَةُ بْنُ سَعِيدٍ** → أَبُو الْأَحْوَصِ | [T5522](#t5522) | [inferred] B6018: 5522. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F41: أَبُو الْأَحْوَصِ | 15/B6018: قُتَيْبَةُ بْنُ سَعِيدٍ → **أَبُو الْأَحْوَصِ** → أَبِي حَصِينٍ | [T2703](#t2703) | [inferred] B6018: 2703. Fath under B6018, printed 10/445–446, digital 6206–6207 names Salam, Uthman and Dhakwan; Taqrib supplies the biographies. |
| Checked in repo | F42: أَبِي حَصِينٍ | 15/B6018: أَبُو الْأَحْوَصِ → **أَبِي حَصِينٍ** → أَبِي صَالِحٍ<br>16/B6116: أَبُو بَكْرٍ هُوَ ابْنُ عَيَّاشٍ → **أَبِي حَصِينٍ** → أَبِي صَالِحٍ | [T4484](#t4484) | [inferred] B6018: 4484; B6116: 4484. Fath under B6018, printed 10/445–446, digital 6206–6207 names Salam, Uthman and Dhakwan; Taqrib supplies the biographies. |
| Checked in repo | F43: أَبِي صَالِحٍ | 15/B6018: أَبِي حَصِينٍ → **أَبِي صَالِحٍ** → أَبِي هُرَيْرَةَ<br>16/B6116: أَبِي حَصِينٍ → **أَبِي صَالِحٍ** → أَبِي هُرَيْرَةَ | [T1841](#t1841) | [inferred] B6018: 1841; B6116: 1841. Fath under B6018, printed 10/445–446, digital 6206–6207 names Salam, Uthman and Dhakwan; Taqrib supplies the biographies. |
| Checked in repo | F44: يَحْيَى بْنُ يُوسُفَ | 16/B6116: البخاري → **يَحْيَى بْنُ يُوسُفَ** → أَبُو بَكْرٍ هُوَ ابْنُ عَيَّاشٍ | [T7680](#t7680) | [inferred] B6116: 7680. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F45: أَبُو بَكْرٍ هُوَ ابْنُ عَيَّاشٍ | 16/B6116: يَحْيَى بْنُ يُوسُفَ → **أَبُو بَكْرٍ هُوَ ابْنُ عَيَّاشٍ** → أَبِي حَصِينٍ | [T7985](#t7985), [T7986](#t7986) | [inferred] B6116: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F46: أَحْمَدُ بْنُ يُونُسَ | 20/B3483: البخاري → **أَحْمَدُ بْنُ يُونُسَ** → زُهَيْرٍ | [T63](#t63) | [inferred] B3483: 63. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F47: زُهَيْرٍ | 20/B3483: أَحْمَدُ بْنُ يُونُسَ → **زُهَيْرٍ** → مَنْصُورٌ | [T2051](#t2051) | [inferred] B3483: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F48: مَنْصُورٌ | 20/B3483: زُهَيْرٍ → **مَنْصُورٌ** → رِبْعِيِّ بْنِ حِرَاشٍ | [T6908](#t6908) | [inferred] B3483: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F49: رِبْعِيِّ بْنِ حِرَاشٍ | 20/B3483: مَنْصُورٌ → **رِبْعِيِّ بْنِ حِرَاشٍ** → أَبُو مَسْعُودٍ عُقْبَةُ | [T1879](#t1879) | [inferred] B3483: 1879. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F50: أَبُو مَسْعُودٍ عُقْبَةُ | 20/B3483: رِبْعِيِّ بْنِ حِرَاشٍ → **أَبُو مَسْعُودٍ عُقْبَةُ** → المتن | [T4647](#t4647) | [inferred] B3483: 4647. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F51: إِسْحَاقُ | 26/B2989: البخاري → **إِسْحَاقُ** → عَبْدُ الرَّزَّاقِ<br>46/B4343: البخاري → **إِسْحَاقُ** → خَالِدٌ | [T384](#t384), [T332](#t332), [T359](#t359) | [inferred] B2989: 384; B4343: unresolved. B2989: Ibn Hajar, Fath 6/132, digital 3326. B4343: candidate pool only; no identity selected. |
| Checked in repo | F52: عَبْدُ الرَّزَّاقِ | 26/B2989: إِسْحَاقُ → **عَبْدُ الرَّزَّاقِ** → مَعْمَرٌ | [T4064](#t4064) | [inferred] B2989: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F53: مَعْمَرٌ | 26/B2989: عَبْدُ الرَّزَّاقِ → **مَعْمَرٌ** → هَمَّامٍ | [T6809](#t6809) | [inferred] B2989: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F54: هَمَّامٍ | 26/B2989: مَعْمَرٌ → **هَمَّامٍ** → أَبِي هُرَيْرَةَ | [T7317](#t7317) | [inferred] B2989: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F55: نَصْرُ بْنُ عَلِيِّ بْنِ نَصْرٍ | 33/B4552: البخاري → **نَصْرُ بْنُ عَلِيِّ بْنِ نَصْرٍ** → عَبْدُ اللهِ بْنُ دَاوُدَ | [T7120](#t7120) | [inferred] B4552: 7120. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F56: عَبْدُ اللهِ بْنُ دَاوُدَ | 33/B4552: نَصْرُ بْنُ عَلِيِّ بْنِ نَصْرٍ → **عَبْدُ اللهِ بْنُ دَاوُدَ** → ابْنِ جُرَيْجٍ | [T3297](#t3297), [T3298](#t3298) | [inferred] B4552: 3297. Fath under B4552, printed 8/213, digital 4560 identifies al-Khuraybi; the alternative is retained, not selected. |
| Checked in repo | F57: ابْنِ جُرَيْجٍ | 33/B4552: عَبْدُ اللهِ بْنُ دَاوُدَ → **ابْنِ جُرَيْجٍ** → ابْنِ أَبِي مُلَيْكَةَ | [T4193](#t4193) | [inferred] B4552: 4193. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F58: ابْنِ أَبِي مُلَيْكَةَ | 33/B4552: ابْنِ جُرَيْجٍ → **ابْنِ أَبِي مُلَيْكَةَ** → المتن | [T3454](#t3454) | [inferred] B4552: 3454. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F59: أَبُو مَعْمَرٍ | 37/B6491: البخاري → **أَبُو مَعْمَرٍ** → عَبْدُ الْوَارِثِ | [T3498](#t3498) | [inferred] B6491: 3498. Fath under B6491, printed 11/323, digital 6695 names Abu Mamar, Abd al-Warith and al-Jad. |
| Checked in repo | F60: عَبْدُ الْوَارِثِ | 37/B6491: أَبُو مَعْمَرٍ → **عَبْدُ الْوَارِثِ** → جَعْدٌ أَبُو عُثْمَانَ | [T4251](#t4251) | [inferred] B6491: 4251. Fath under B6491, printed 11/323, digital 6695 names Abu Mamar, Abd al-Warith and al-Jad. |
| Checked in repo | F61: جَعْدٌ أَبُو عُثْمَانَ | 37/B6491: عَبْدُ الْوَارِثِ → **جَعْدٌ أَبُو عُثْمَانَ** → أَبُو رَجَاءٍ الْعُطَارِدِيُّ | [T924](#t924) | [inferred] B6491: 924. Fath under B6491, printed 11/323, digital 6695 names Abu Mamar, Abd al-Warith and al-Jad. |
| Checked in repo | F62: أَبُو رَجَاءٍ الْعُطَارِدِيُّ | 37/B6491: جَعْدٌ أَبُو عُثْمَانَ → **أَبُو رَجَاءٍ الْعُطَارِدِيُّ** → ابْنِ عَبَّاسٍ | [T5171](#t5171) | [inferred] B6491: 5171. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F63: ابْنِ عَبَّاسٍ | 37/B6491: أَبُو رَجَاءٍ الْعُطَارِدِيُّ → **ابْنِ عَبَّاسٍ** → المتن<br>43/B6732: أَبِيهِ → **ابْنِ عَبَّاسٍ** → المتن | [T3409](#t3409) | [inferred] B6491: 3409; B6732: 3409. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F64: مُحَمَّدُ بْنُ عُثْمَانَ | 38/B6502: البخاري → **مُحَمَّدُ بْنُ عُثْمَانَ** → خَالِدُ بْنُ مَخْلَدٍ | [T6134](#t6134) | [inferred] B6502: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F65: خَالِدُ بْنُ مَخْلَدٍ | 38/B6502: مُحَمَّدُ بْنُ عُثْمَانَ → **خَالِدُ بْنُ مَخْلَدٍ** → سُلَيْمَانُ بْنُ بِلَالٍ | [T1677](#t1677) | [inferred] B6502: 1677. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F66: سُلَيْمَانُ بْنُ بِلَالٍ | 38/B6502: خَالِدُ بْنُ مَخْلَدٍ → **سُلَيْمَانُ بْنُ بِلَالٍ** → شَرِيكُ بْنُ عَبْدِ اللهِ بْنِ أَبِي نَمِرٍ | [T2539](#t2539) | [inferred] B6502: 2539. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F67: شَرِيكُ بْنُ عَبْدِ اللهِ بْنِ أَبِي نَمِرٍ | 38/B6502: سُلَيْمَانُ بْنُ بِلَالٍ → **شَرِيكُ بْنُ عَبْدِ اللهِ بْنِ أَبِي نَمِرٍ** → عَطَاءٍ | [T2788](#t2788) | [inferred] B6502: 2788. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F68: عَطَاءٍ | 38/B6502: شَرِيكُ بْنُ عَبْدِ اللهِ بْنِ أَبِي نَمِرٍ → **عَطَاءٍ** → أَبِي هُرَيْرَةَ | [T4605](#t4605), [T4591](#t4591) | [inferred] B6502: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F69: عَلِيُّ بْنُ عَبْدِ اللهِ | 40/B6416: البخاري → **عَلِيُّ بْنُ عَبْدِ اللهِ** → مُحَمَّدُ بْنُ عَبْدِ الرَّحْمَنِ أَبُو الْمُنْذِرِ الطُّفَاوِيُّ | [T4760](#t4760) | [inferred] B6416: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F70: مُحَمَّدُ بْنُ عَبْدِ الرَّحْمَنِ أَبُو الْمُنْذِرِ الطُّفَاوِيُّ | 40/B6416: عَلِيُّ بْنُ عَبْدِ اللهِ → **مُحَمَّدُ بْنُ عَبْدِ الرَّحْمَنِ أَبُو الْمُنْذِرِ الطُّفَاوِيُّ** → سُلَيْمَانَ الْأَعْمَشِ | [T6087](#t6087) | [inferred] B6416: 6087. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F71: سُلَيْمَانَ الْأَعْمَشِ | 40/B6416: مُحَمَّدُ بْنُ عَبْدِ الرَّحْمَنِ أَبُو الْمُنْذِرِ الطُّفَاوِيُّ → **سُلَيْمَانَ الْأَعْمَشِ** → مُجَاهِدٌ | [T2615](#t2615) | [inferred] B6416: 2615. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F72: مُجَاهِدٌ | 40/B6416: سُلَيْمَانَ الْأَعْمَشِ → **مُجَاهِدٌ** → عَبْدِ اللهِ بْنِ عُمَرَ | [T6481](#t6481) | [inferred] B6416: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F73: عَبْدِ اللهِ بْنِ عُمَرَ | 40/B6416: مُجَاهِدٌ → **عَبْدِ اللهِ بْنِ عُمَرَ** → المتن | [T3490](#t3490) | [inferred] B6416: 3490. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F74: مُوسَى بْنُ إِسْمَاعِيلَ | 43/B6732: البخاري → **مُوسَى بْنُ إِسْمَاعِيلَ** → وُهَيْبٌ | [T6943](#t6943) | [inferred] B6732: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F75: وُهَيْبٌ | 43/B6732: مُوسَى بْنُ إِسْمَاعِيلَ → **وُهَيْبٌ** → ابْنُ طَاوُسٍ | [T7487](#t7487) | [inferred] B6732: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F76: ابْنُ طَاوُسٍ | 43/B6732: وُهَيْبٌ → **ابْنُ طَاوُسٍ** → أَبِيهِ | [T3397](#t3397) | [inferred] B6732: 3397. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F77: قُتَيْبَةُ | 45/B2236: البخاري → **قُتَيْبَةُ** → اللَّيْثُ | [T5522](#t5522) | [inferred] B2236: 5522. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F78: اللَّيْثُ | 45/B2236: قُتَيْبَةُ → **اللَّيْثُ** → يَزِيدَ بْنِ أَبِي حَبِيبٍ | [T5684](#t5684) | [inferred] B2236: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F79: يَزِيدَ بْنِ أَبِي حَبِيبٍ | 45/B2236: اللَّيْثُ → **يَزِيدَ بْنِ أَبِي حَبِيبٍ** → عَطَاءِ بْنِ أَبِي رَبَاحٍ | [T7701](#t7701) | [inferred] B2236: 7701. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F80: عَطَاءِ بْنِ أَبِي رَبَاحٍ | 45/B2236: يَزِيدَ بْنِ أَبِي حَبِيبٍ → **عَطَاءِ بْنِ أَبِي رَبَاحٍ** → جَابِرِ بْنِ عَبْدِ اللهِ | [T4591](#t4591) | [inferred] B2236: 4591. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F81: جَابِرِ بْنِ عَبْدِ اللهِ | 45/B2236: عَطَاءِ بْنِ أَبِي رَبَاحٍ → **جَابِرِ بْنِ عَبْدِ اللهِ** → المتن | [T871](#t871) | [inferred] B2236: 871. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F82: خَالِدٌ | 46/B4343: إِسْحَاقُ → **خَالِدٌ** → الشَّيْبَانِيِّ | [T1647](#t1647) | [inferred] B4343: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F83: الشَّيْبَانِيِّ | 46/B4343: خَالِدٌ → **الشَّيْبَانِيِّ** → سَعِيدِ بْنِ أَبِي بُرْدَةَ | [T2568](#t2568) | [inferred] B4343: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |
| Checked in repo | F84: سَعِيدِ بْنِ أَبِي بُرْدَةَ | 46/B4343: الشَّيْبَانِيِّ → **سَعِيدِ بْنِ أَبِي بُرْدَةَ** → أَبِيهِ | [T2275](#t2275) | [inferred] B4343: 2275. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F85: أَبِي مُوسَى الْأَشْعَرِيِّ | 46/B4343: أَبِيهِ → **أَبِي مُوسَى الْأَشْعَرِيِّ** → المتن | [T3542](#t3542) | [inferred] B4343: 3542. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F86: قَبِيصَةُ بْنُ عُقْبَةَ | 48/B34: البخاري → **قَبِيصَةُ بْنُ عُقْبَةَ** → سُفْيَانُ | [T5513](#t5513) | [inferred] B34: 5513. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F87: الْأَعْمَشِ | 48/B34: سُفْيَانُ → **الْأَعْمَشِ** → عَبْدِ اللهِ بْنِ مُرَّةَ | [T2615](#t2615) | [inferred] B34: 2615. Qualified name or explicit alias in the quoted entry; neighbouring chain retained for the identification. |
| Checked in repo | F88: عَبْدِ اللهِ بْنِ عَمْرٍو | 48/B34: مَسْرُوقٍ → **عَبْدِ اللهِ بْنِ عَمْرٍو** → المتن | [T3499](#t3499) | [inferred] B34: unresolved. Candidate from the quoted name/kunya and this chain context only. A direct commentator or teacher/student biography confirmation is still required; unresolved. |

### Full Taqrib entries for all selected identities and candidates

[checked against source] The following is a dictionary keyed by the entry numbers used in the ledger, from Muhammad Awwama, Dar al-Rashid, first 1406/1986, volume 1, as transcribed in the live composite Shamela 8609 witness. It quotes each entire numbered entry, retaining authorial codes and qualifications; a subsequent unnumbered cross-reference is not part of that entry. Square-bracket additions remain visible as witness apparatus and must not ship as Ibn Hajar's words. This reuses the earlier audit's edition assessment rather than asserting that the composite file has become a pure edition. Where an entry lacks a generation or death, none is supplied by Namaq.

<a id="t63"></a>

[checked against source] T63; printed 1/81; [Shamela 8609, digital 7](https://shamela.ws/book/8609/7):

> أحمد ابن عبد الله ابن يونس ابن عبد الله ابن قيس التميمي اليربوعي الكوفي ثقة حافظ من كبار العاشرة مات سنة سبع وعشرين وهو ابن أربع وتسعين سنة ع

<a id="t177"></a>

[checked against source] T177; printed 1/89; [Shamela 8609, digital 15](https://shamela.ws/book/8609/15):

> إبراهيم ابن سعد ابن إبراهيم ابن عبد الرحمن ابن عوف الزهري أبو إسحاق المدني نزيل بغداد ثقة حجة تُكُلِّم فيه بلا قادح من الثامنة مات سنة خمس وثمانين ع

<a id="t332"></a>

[checked against source] T332; printed 1/99; [Shamela 8609, digital 25](https://shamela.ws/book/8609/25):

> إسحاق ابن إبراهيم ابن مخلد الحنظلي أبو محمد ابن راهويه المروزي ثقة حافظ مجتهد قرين أحمد ابن حنبل ذكر أبو داود أنه تغير قبل موته بيسير مات سنة ثمان وثلاثين وله اثنتان وسبعون خ م د ت س

<a id="t359"></a>

[checked against source] T359; printed 1/101; [Shamela 8609, digital 27](https://shamela.ws/book/8609/27):

> إسحاق ابن شاهين ابن الحارث الواسطي أبو بشر ابن أبي عمران صدوق من العاشرة مات بعد الخمسين وقد جاز المائة خ س

<a id="t384"></a>

[checked against source] T384; printed 1/103; [Shamela 8609, digital 29](https://shamela.ws/book/8609/29):

> إسحاق ابن منصور ابن بهرام الكوسج أبو يعقوب التميمي المروزي ثقة ثبت من الحادية عشرة مات سنة إحدى وخمسين خ م ت س ق

<a id="t460"></a>

[checked against source] T460; printed 1/108; [Shamela 8609, digital 34](https://shamela.ws/book/8609/34):

> إسماعيل ابن عبد الله ابن عبد الله ابن أويس ابن مالك ابن أبي عامر الأصبحي أبو عبد الله ابن أبي أويس المدني صدوق أخطأ في أحاديث من حفظه من العاشرة مات سنة ست وعشرين خ م د ت ق

<a id="t871"></a>

[checked against source] T871; printed 1/136; [Shamela 8609, digital 62](https://shamela.ws/book/8609/62):

> جابر ابن عبد الله ابن عمرو ابن حرام بمهملة وراء الأنصاري ثم السلمي بفتحتين صحابي ابن صحابي غزا تسع عشرة غزوة ومات بالمدينة بعد السبعين وهو ابن أربع وتسعين ع

<a id="t924"></a>

[checked against source] T924; printed 1/139; [Shamela 8609, digital 65](https://shamela.ws/book/8609/65):

> الجعد ابن دينار اليشكري بتحتانية مفتوحة بعدها معجمة ساكنة وكاف مضمومة أبو عثمان الصيرفي البصري صاحب الحلى بضم المهملة ثقة من الرابعة خ م د ت س

<a id="t1178"></a>

[checked against source] T1178; printed 1/156; [Shamela 8609, digital 82](https://shamela.ws/book/8609/82):

> حرمي ابن عمارة ابن أبي حفصة نابت بنون وموحدة ثم مثناة وقيل كالجادة العتكي البصري أبو روح صدوق يهم من التاسعة مات سنة إحدى ومائتين خ م د س ق

<a id="t1430"></a>

[checked against source] T1430; printed 1/173; [Shamela 8609, digital 99](https://shamela.ws/book/8609/99):

> حفص ابن غياث بمعجمة مكسورة وياء ومثلثة ابن طلق ابن معاوية النخعي أبو عمر الكوفي القاضي ثقة فقيه تغير حفظه قليل في الآخر من الثامنة مات سنة أربع أو خمس وتسعين وقد قارب الثمانين ع

<a id="t1582"></a>

[checked against source] T1582; printed 1/183; [Shamela 8609, digital 109](https://shamela.ws/book/8609/109):

> حنظلة ابن أبي سفيان [الأسود] ابن عبد الرحمن ابن صفوان ابن أمية الجمحي المكي ثقة حجة من السادسة مات سنة إحدى وخمسين ع

<a id="t1647"></a>

[checked against source] T1647; printed 1/189; [Shamela 8609, digital 115](https://shamela.ws/book/8609/115):

> خالد ابن عبد الله ابن عبد الرحمن ابن يزيد الطحان الواسطي المزني مولاهم ثقة ثبت من الثامنة مات سنة اثنتين وثمانين وكان مولده سنة عشر ومائة ع

<a id="t1677"></a>

[checked against source] T1677; printed 1/190; [Shamela 8609, digital 116](https://shamela.ws/book/8609/116):

> خالد ابن مخلد القطواني بفتح القاف والطاء أبو الهيثم البجلي مولاهم الكوفي صدوق يتشيع وله أفراد من كبار العاشرة مات سنة ثلاث عشرة وقيل بعدها خ م كد ت س ق

<a id="t1841"></a>

[checked against source] T1841; printed 1/203; [Shamela 8609, digital 129](https://shamela.ws/book/8609/129):

> ذكوان أبو صالح السمان الزيات المدني ثقة ثبت وكان يجلب الزيت إلى الكوفة من الثالثة مات سنة إحدى ومائة ع

<a id="t1879"></a>

[checked against source] T1879; printed 1/205; [Shamela 8609, digital 131](https://shamela.ws/book/8609/131):

> ربعي ابن حراش بكسر المهملة وآخره معجمة أبو مريم العبسي الكوفي ثقة عابد مخضرم من الثانية مات سنة مائة وقيل غير ذلك ع

<a id="t2022"></a>

[checked against source] T2022; printed 1/216; [Shamela 8609, digital 142](https://shamela.ws/book/8609/142):

> زكريا ابن أبي زائدة خالد ويقال هبيرة ابن ميمون ابن فيروز الهمداني الوادعي أبو يحيى الكوفي ثقة وكان يدلس وسماعه من أبي إسحاق بأخرة من السادسة مات سنة سبع أو ثمان أو تسع وأربعين ع

<a id="t2051"></a>

[checked against source] T2051; printed 1/218; [Shamela 8609, digital 144](https://shamela.ws/book/8609/144):

> زهير ابن معاوية ابن حديج أبو خيثمة الجعفي الكوفي نزيل الجزيرة ثقة ثبت إلا أن سماعه عن أبي إسحاق بأخرة من السابعة مات سنة اثنتين أو ثلاث أو أربع وسبعين وكان مولده سنة مائة ع

<a id="t2227"></a>

[checked against source] T2227; printed 1/230; [Shamela 8609, digital 156](https://shamela.ws/book/8609/156):

> سعد ابن إبراهيم ابن عبد الرحمن ابن عوف جد الذي قبله ولي قضاء المدينة وكان ثقة فاضلا عابدا من الخامسة مات سنه خمس وعشرين وقيل بعدها وهو ابن اثنتين وسبعين سنة ع

<a id="t2275"></a>

[checked against source] T2275; printed 1/233; [Shamela 8609, digital 159](https://shamela.ws/book/8609/159):

> سعيد ابن أبي بردة ابن أبي موسى الأشعري الكوفي ثقة ثبت وروايته عن ابن عمر مرسلة من الخامسة ع

<a id="t2445"></a>

[checked against source] T2445; printed 1/244; [Shamela 8609, digital 170](https://shamela.ws/book/8609/170):

> سفيان ابن سعيد ابن مسروق الثوري أبو عبد الله الكوفي ثقة حافظ فقيه عابد إمام حجة من رؤوس الطبقة السابعة وكان ربما دلس مات سنة إحدى وستين وله أربع وستون ع

<a id="t2451"></a>

[checked against source] T2451; printed 1/245; [Shamela 8609, digital 171](https://shamela.ws/book/8609/171):

> سفيان ابن عيينة ابن أبي عمران ميمون الهلالي أبو محمد الكوفي ثم المكي ثقة حافظ فقيه إمام حجة إلا أنه تغير حفظه بأخرة وكان ربما دلس لكن عن الثقات من رؤوس الطبقة الثامنة وكان أثبت الناس في عمرو ابن دينار مات في رجب سنة ثمان وتسعين وله إحدى وتسعون سنة ع

<a id="t2539"></a>

[checked against source] T2539; printed 1/250; [Shamela 8609, digital 176](https://shamela.ws/book/8609/176):

> سليمان ابن بلال التيمي مولاهم أبو محمد وأبو أيوب المدني ثقة من الثامنة مات سنة سبع وسبعين ع

<a id="t2568"></a>

[checked against source] T2568; printed 1/252; [Shamela 8609, digital 178](https://shamela.ws/book/8609/178):

> سليمان ابن أبي سليمان [فيروز] أبو إسحاق الشيباني الكوفي ثقة من الخامسة مات في حدود الأربعين ع

<a id="t2615"></a>

[checked against source] T2615; printed 1/254; [Shamela 8609, digital 180](https://shamela.ws/book/8609/180):

> سليمان ابن مهران الأسدي الكاهلي أبو محمد الكوفي الأعمش ثقة حافظ عارف بالقراءات [بالقراءة] ورع لكنه يدلس من الخامسة مات سنة سبع وأربعين أو ثمان وكان مولده أول سنة إحدى وستين ع

<a id="t2703"></a>

[checked against source] T2703; printed 1/261; [Shamela 8609, digital 187](https://shamela.ws/book/8609/187):

> سلام ابن سليم الحنفي مولاهم أبو الأحوص الكوفي ثقة متقن صاحب حديث من السابعة مات سنة تسع وسبعين ع

<a id="t2788"></a>

[checked against source] T2788; printed 1/266; [Shamela 8609, digital 192](https://shamela.ws/book/8609/192):

> شريك ابن عبد الله ابن أبي نمر أبو عبد الله المدني صدوق يخطىء من الخامسة مات في حدود أربعين ومائة خ م د تم س ق

<a id="t2790"></a>

[checked against source] T2790; printed 1/266; [Shamela 8609, digital 192](https://shamela.ws/book/8609/192):

> شعبة ابن الحجاج ابن الورد العتكي مولاهم أبو بسطام الواسطي ثم البصري ثقة حافظ متقن كان الثوري يقول هو أمير المؤمنين في الحديث وهو أول من فتش بالعراق عن الرجال وذب عن السنة وكان عابدا من السابعة مات سنة ستين ع

<a id="t3009"></a>

[checked against source] T3009; printed 1/281; [Shamela 8609, digital 207](https://shamela.ws/book/8609/207):

> طاوس ابن كيسان اليماني أبو عبد الرحمن الحميري مولاهم الفارسي يقال اسمه ذكوان وطاوس لقب ثقة فقيه فاضل من الثالثة مات سنة ست ومائة وقيل بعد ذلك ع

<a id="t3092"></a>

[checked against source] T3092; printed 1/287; [Shamela 8609, digital 213](https://shamela.ws/book/8609/213):

> عامر ابن شراحيل الشعبي بفتح المعجمة أبو عمرو ثقة مشهور فقيه فاضل من الثالثة قال مكحول ما رأيت أفقه منه مات بعد المائة وله نحو من ثمانين ع

<a id="t3297"></a>

[checked against source] T3297; printed 1/301; [Shamela 8609, digital 227](https://shamela.ws/book/8609/227):

> عبد الله ابن داود ابن عامر الهمداني أبو عبد الرحمن الخريبي بمعجمة وموحدة مصغرا كوفي الأصل ثقة عابد من التاسعة مات سنة ثلاث عشرة وله سبع وثمانون سنة أمسك عن الرواية قبل موته فلذلك لم يسمع منه البخاري [يعني بل روى عنه بواسطة] خ ٤

<a id="t3298"></a>

[checked against source] T3298; printed 1/301; [Shamela 8609, digital 227](https://shamela.ws/book/8609/227):

> عبد الله ابن داود الواسطي أبو محمد التمار ضعيف من التاسعة ت

<a id="t3302"></a>

[checked against source] T3302; printed 1/302; [Shamela 8609, digital 228](https://shamela.ws/book/8609/228):

> عبد الله ابن ذكوان القرشي أبو عبد الرحمن المدني المعروف بأبي الزناد ثقة فقيه من الخامسة مات سنة ثلاثين وقيل بعدها ع

<a id="t3320"></a>

[checked against source] T3320; printed 1/303; [Shamela 8609, digital 229](https://shamela.ws/book/8609/229):

> عبد الله ابن الزبير ابن عيسى القرشي الأسدي الحميدي المكي أبو بكر ثقة حافظ فقيه أجل أصحاب ابن عيينة من العاشرة مات بمكة سنة تسع عشرة وقيل بعدها قال الحاكم كان البخاري إذا وجد الحديث عند الحميدي لا يعدوه إلى غيره خ م د ت س فق

<a id="t3397"></a>

[checked against source] T3397; printed 1/308; [Shamela 8609, digital 234](https://shamela.ws/book/8609/234):

> عبد الله ابن طاوس ابن كيسان اليماني أبو محمد ثقة فاضل عابد من السادسة مات سنة اثنتين وثلاثين ع

<a id="t3409"></a>

[checked against source] T3409; printed 1/309; [Shamela 8609, digital 235](https://shamela.ws/book/8609/235):

> عبد الله ابن عباس ابن عبد المطلب ابن هاشم ابن عبد مناف ابن عم رسول الله صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ولد قبل الهجرة بثلاث سنين ودعا له رسول الله صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ بالفهم في القرآن فكان يسمى البحر والحبر لسعة علمه وقال عمر لو أدرك ابن عباس أسناننا ما عشره منا أحد مات سنة ثمان وستين بالطائف وهو أحد المكثرين من الصحابة وأحد العبادلة من فقهاء الصحابة ع

<a id="t3454"></a>

[checked against source] T3454; printed 1/312; [Shamela 8609, digital 238](https://shamela.ws/book/8609/238):

> عبد الله ابن عبيد الله ابن عبد الله ابن أبي مليكة بالتصغير ابن عبد الله ابن جدعان يقال اسم أبي مليكة زهير التيمي المدني أدرك ثلاثين من الصحابة ثقة فقيه من الثالثة مات سنة سبع عشرة ع

<a id="t3490"></a>

[checked against source] T3490; printed 1/315; [Shamela 8609, digital 241](https://shamela.ws/book/8609/241):

> عبد الله ابن عمر ابن الخطاب العدوي أبو عبد الرحمن ولد بعد المبعث بيسير واستصغر يوم أحد وهو ابن أربع عشرة [سنة] وهو أحد المكثرين من الصحابة والعبادلة وكان من أشد الناس اتباعا للأثر مات سنة ثلاث وسبعين في آخرها أو أول التي تليها ع

<a id="t3498"></a>

[checked against source] T3498; printed 1/315; [Shamela 8609, digital 241](https://shamela.ws/book/8609/241):

> عبد الله ابن عمرو ابن أبي الحجاج التميمي أبو معمر المقعد المنقري بكسر الميم وسكون النون وفتح القاف واسم أبي الحجاج ميسرة ثقة ثبت رمي بالقدر من العاشرة مات سنة أربع وعشرين ع

<a id="t3499"></a>

[checked against source] T3499; printed 1/315; [Shamela 8609, digital 241](https://shamela.ws/book/8609/241):

> عبد الله ابن عمرو ابن العاص ابن وائل ابن هاشم ابن سعيد بالتصغير ابن سعد ابن سهم السهمي أبو محمد وقيل أبو عبد الرحمن أحد السابقين المكثرين من الصحابة وأحد العبادلة الفقهاء مات في ذي الحجة ليالي الحرة على الأصح بالطائف على الراجح ع

<a id="t3542"></a>

[checked against source] T3542; printed 1/318; [Shamela 8609, digital 244](https://shamela.ws/book/8609/244):

> عبد الله ابن قيس ابن سليم ابن حضار بفتح المهملة وتشديد الضاد المعجمة أبو موسى الأشعري صحابي مشهور أمره عمر ثم عثمان وهو أحد الحكمين بصفين مات سنة خمسين وقيل بعدها ع

<a id="t3585"></a>

[checked against source] T3585; printed 1/321; [Shamela 8609, digital 247](https://shamela.ws/book/8609/247):

> عبد الله ابن محمد ابن عبد الله ابن جعفر الجعفي أبو جعفر البخاري المعروف بالمسندي بفتح النون ثقة حافظ جمع المسند من العاشرة مات سنة تسع وعشرين خ ت

<a id="t3607"></a>

[checked against source] T3607; printed 1/322; [Shamela 8609, digital 248](https://shamela.ws/book/8609/248):

> عبد الله ابن مرة الهمداني الخارفي بمعجمة وراء وفاء الكوفي ثقة من الثالثة مات سنة مائة وقيل قبلها ع

<a id="t3613"></a>

[checked against source] T3613; printed 1/323; [Shamela 8609, digital 249](https://shamela.ws/book/8609/249):

> عبد الله ابن مسعود ابن غافل بمعجمة وفاء ابن حبيب الهذلي أبو عبد الرحمن من السابقين الأولين ومن كبار العلماء من الصحابة مناقبة جمة وأمره عمر على الكوفة ومات سنة اثنتين وثلاثين أو في التي بعدها بالمدينة ع

<a id="t3620"></a>

[checked against source] T3620; printed 1/323; [Shamela 8609, digital 249](https://shamela.ws/book/8609/249):

> عبد الله ابن مسلمة ابن قعنب القعنبي الحارثي أبو عبد الرحمن البصري أصله من المدينة وسكنها مدة ثقة عابد كان ابن معين وابن المديني لا يقدمان عليه في الموطأ أحدا من صغار التاسعة مات في [أول] سنة إحدى وعشرين بمكة خ م د ت س

<a id="t4033"></a>

[checked against source] T4033; printed 1/352; [Shamela 8609, digital 278](https://shamela.ws/book/8609/278):

> عبد الرحمن ابن هرمز الأعرج أبو داود المدني مولى ربيعة ابن الحارث ثقة ثبت عالم من الثالثة مات سنة سبع عشرة ع

<a id="t4064"></a>

[checked against source] T4064; printed 1/354; [Shamela 8609, digital 280](https://shamela.ws/book/8609/280):

> عبد الرزاق ابن همام ابن نافع الحميري مولاهم أبو بكر الصنعاني ثقة حافظ مصنف شهير عمي في آخر عمره فتغير وكان يتشيع من التاسعة مات سنة إحدى عشرة وله خمس وثمانون ع

<a id="t4193"></a>

[checked against source] T4193; printed 1/363; [Shamela 8609, digital 289](https://shamela.ws/book/8609/289):

> عبد الملك ابن عبد العزيز ابن جريج الأموي مولاهم المكي ثقة فقيه فاضل وكان يدلس ويرسل من السادسة مات سنة خمسين أو بعدها وقد جاز السبعين وقيل جاز المائة ولم يثبت ع

<a id="t4251"></a>

[checked against source] T4251; printed 1/367; [Shamela 8609, digital 293](https://shamela.ws/book/8609/293):

> عبد الوارث ابن سعيد ابن ذكوان العنبري مولاهم أبو عبيدة التنوري بفتح المثناة وتشديد النون البصري ثقة ثبت رمي بالقدر ولم يثبت عنه من الثامنة مات سنة ثمانين ومائة ع

<a id="t4345"></a>

[checked against source] T4345; printed 1/375; [Shamela 8609, digital 301](https://shamela.ws/book/8609/301):

> عبيد الله ابن موسى [بن أبي المختار] ابن باذام العبسي الكوفي أبو محمد ثقة كان يتشيع من التاسعة قال أبو حاتم كان أثبت في إسرائيل من أبي نعيم واستصغر في سفيان الثوري مات سنة ثلاث عشرة على الصحيح ع

<a id="t4484"></a>

[checked against source] T4484; printed 1/384; [Shamela 8609, digital 310](https://shamela.ws/book/8609/310):

> عثمان ابن عاصم ابن حصين الأسدي الكوفي أبو حصين بفتح المهملة ثقة ثبت سني وربما دلس من الرابعة مات سنة سبع وعشرين ويقال بعدها وكان يقول إن عاصم ابن بهدلة أكبر منه بسنة واحدة ع

<a id="t4591"></a>

[checked against source] T4591; printed 1/391; [Shamela 8609, digital 317](https://shamela.ws/book/8609/317):

> عطاء ابن أبي رباح بفتح الراء والموحدة واسم أبي رباح أسلم القرشي مولاهم المكي ثقة فقيه فاضل لكنه كثير الإرسال من الثالثة مات سنة أربع عشرة على المشهور وقيل إنه تغير بأخرة ولم يكثر ذلك منه ع

<a id="t4605"></a>

[checked against source] T4605; printed 1/392; [Shamela 8609, digital 318](https://shamela.ws/book/8609/318):

> عطاء ابن يسار الهلالي أبو محمد المدني مولى ميمونة ثقة فاضل صاحب مواعظ وعبادة من صغار الثانية مات سنة أربع وتسعين وقيل بعد ذلك ع

<a id="t4647"></a>

[checked against source] T4647; printed 1/395; [Shamela 8609, digital 321](https://shamela.ws/book/8609/321):

> عقبة ابن عمرو ابن ثعلبة الأنصاري أبو مسعود البدري صحابي جليل مات قبل الأربعين وقيل بعدها ع

<a id="t4668"></a>

[checked against source] T4668; printed 1/396; [Shamela 8609, digital 322](https://shamela.ws/book/8609/322):

> عكرمة ابن خالد ابن العاص ابن هشام المخزومي ثقة من الثالثة مات بعد عطاء خ م د ت س

<a id="t4669"></a>

[checked against source] T4669; printed 1/396; [Shamela 8609, digital 322](https://shamela.ws/book/8609/322):

> عكرمة ابن خالد ابن سلمة ابن العاص ابن هشام المخزومي ضعيف وهو أصغر من الذي قبله

<a id="t4685"></a>

[checked against source] T4685; printed 1/397; [Shamela 8609, digital 323](https://shamela.ws/book/8609/323):

> علقمة ابن وقاص بتشديد القاف الليثي المدني ثقة ثبت من الثانية أخطأ من زعم أن له صحبة وقيل إنه ولد في عهد النبي صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ مات في خلافة عبد الملك ع

<a id="t4760"></a>

[checked against source] T4760; printed 1/403; [Shamela 8609, digital 329](https://shamela.ws/book/8609/329):

> علي ابن عبد الله ابن جعفر ابن نجيح السعدي مولاهم أبو الحسن ابن المديني بصري ثقة ثبت إمام أعلم أهل عصره بالحديث وعلله حتى قال البخاري ما استصغرت نفسي إلا عند علي ابن المديني وقال فيه شيخه ابن عيينة كنت أتعلم منه أكثر مما يتعلم مني وقال النسائي كأن الله خلقه للحديث عابوا عليه إجابته في المحنة لكنه تنصل وتاب واعتذر بأنه كان خاف على نفسه من العاشرة مات سنة أربع وثلاثين على الصحيح خ ت س فق

<a id="t4880"></a>

[checked against source] T4880; printed 1/411; [Shamela 8609, digital 337](https://shamela.ws/book/8609/337):

> عمر ابن حفص ابن غياث بكسر المعجمة وآخره مثلثة ابن طلق بفتح الطاء وسكون اللام الكوفي ثقة ربما وهم من العاشرة مات سنة اثنتين وعشرين ومائتين خ م د ت س

<a id="t4888"></a>

[checked against source] T4888; printed 1/412; [Shamela 8609, digital 338](https://shamela.ws/book/8609/338):

> عمر ابن الخطاب ابن نفيل بنون وفاء مصغر ابن عبد العزى ابن رياح بتحتانية ابن عبد الله ابن قرط بضم القاف ابن رزاح براء ثم زاي خفيفة ابن عدي ابن كعب القرشي العدوي [يقال له: الفاروق] أمير المؤمنين مشهور جم المناقب استشهد في ذي الحجة سنة ثلاث وعشرين وولي الخلافة عشر سنين ونصفا ع

<a id="t5171"></a>

[checked against source] T5171; printed 1/430; [Shamela 8609, digital 356](https://shamela.ws/book/8609/356):

> عمران ابن ملحان بكسر الميم وسكون اللام بعدها مهملة ويقال ابن تيم أبو رجاء العطاردي مشهور بكنيته وقيل غير ذلك في اسم أبيه مخضرم ثقة معمر [من الثانية] مات سنة خمس ومائة وله مائة وعشرون سنة ع

<a id="t5401"></a>

[checked against source] T5401; printed 1/446; [Shamela 8609, digital 372](https://shamela.ws/book/8609/372):

> الفضل ابن دكين الكوفي واسم دكين عمرو ابن حماد ابن زهير التيمي مولاهم الأحول أبو نعيم الملائي بضم الميم مشهور بكنيته ثقة ثبت من التاسعة مات سنة ثماني عشرة وقيل تسع عشرة وكان مولده سنة ثلاثين وهو من كبار شيوخ البخاري ع

<a id="t5489"></a>

[checked against source] T5489; printed 1/451; [Shamela 8609, digital 377](https://shamela.ws/book/8609/377):

> القاسم ابن محمد ابن أبي بكر الصديق التيمي ثقة أحد الفقهاء بالمدينة قال أيوب ما رأيت أفضل منه من كبار الثالثة مات سنة ست ومائة على الصحيح ع

<a id="t5513"></a>

[checked against source] T5513; printed 1/453; [Shamela 8609, digital 379](https://shamela.ws/book/8609/379):

> قبيصة ابن عقبة ابن محمد ابن سفيان السوائي بضم المهملة وتخفيف الواو والمد أبو عامر الكوفي صدوق ربما خالف من التاسعة مات سنة خمس عشرة على الصحيح ع

<a id="t5522"></a>

[checked against source] T5522; printed 1/454; [Shamela 8609, digital 380](https://shamela.ws/book/8609/380):

> قتيبة ابن سعيد ابن جميل بفتح الجيم ابن طريف الثقفي أبو رجاء البغلاني بفتح الموحدة وسكون المعجمة يقال اسمه يحيى وقيل علي ثقة ثبت من العاشرة مات سنة أربعين عن تسعين سنة ع

<a id="t5684"></a>

[checked against source] T5684; printed 1/464; [Shamela 8609, digital 390](https://shamela.ws/book/8609/390):

> الليث ابن سعد ابن عبد الرحمن الفهمي أبو الحارث المصري ثقة ثبت فقيه إمام مشهور من السابعة مات في شعبان سنة خمس وسبعين ع

<a id="t5691"></a>

[checked against source] T5691; printed 1/465; [Shamela 8609, digital 391](https://shamela.ws/book/8609/391):

> محمد ابن إبراهيم ابن الحارث ابن خالد التيمي أبو عبد الله المدني ثقة له أفراد من الرابعة مات سنة عشرين على الصحيح ع

<a id="t5892"></a>

[checked against source] T5892; printed 1/479; [Shamela 8609, digital 405](https://shamela.ws/book/8609/405):

> محمد ابن زيد ابن عبد الله ابن عمر المدني ثقة من الثالثة ع

<a id="t6087"></a>

[checked against source] T6087; printed 1/493; [Shamela 8609, digital 419](https://shamela.ws/book/8609/419):

> محمد ابن عبد الرحمن الطفاوي أبو المنذر البصري صدوق يهم من الثامنة خ ت س

<a id="t6134"></a>

[checked against source] T6134; printed 1/496; [Shamela 8609, digital 422](https://shamela.ws/book/8609/422):

> محمد ابن عثمان ابن كرامة بفتح الكاف وتخفيف الراء الكوفي ثقة من الحادية عشرة مات سنة ست وخمسين خ د ت ق

<a id="t6425"></a>

[checked against source] T6425; printed 1/516; [Shamela 8609, digital 442](https://shamela.ws/book/8609/442):

> مالك ابن أنس ابن مالك ابن أبي عامر ابن عمرو الأصبحي أبو عبد الله المدني الفقيه إمام دار الهجرة رأس المتقنين وكبير المتثبتين حتى قال البخاري أصح الأسانيد كلها مالك عن نافع عن ابن عمر من السابعة مات سنة تسع وسبعين وكان مولده سنة ثلاث وتسعين وقال الواقدي بلغ تسعين سنة ع

<a id="t6481"></a>

[checked against source] T6481; printed 1/520; [Shamela 8609, digital 446](https://shamela.ws/book/8609/446):

> مجاهد ابن جبر بفتح الجيم وسكون الموحدة أبو الحجاج المخزومي مولاهم المكي ثقة إمام في التفسير وفي العلم من الثالثة مات سنة إحدى أو اثنتين أو ثلاث أو أربع ومائة وله ثلاث وثمانون ع

<a id="t6601"></a>

[checked against source] T6601; printed 1/528; [Shamela 8609, digital 454](https://shamela.ws/book/8609/454):

> مسروق ابن الأجدع ابن مالك الهمداني الوادعي أبو عائشة الكوفي ثقة فقيه عابد مخضرم من الثانية مات سنة اثنتين ويقال سنة ثلاث وستين ع

<a id="t6809"></a>

[checked against source] T6809; printed 1/541; [Shamela 8609, digital 467](https://shamela.ws/book/8609/467):

> معمر ابن راشد الأزدي مولاهم أبو عروة البصري نزيل اليمن ثقة ثبت فاضل إلا أن في روايته عن ثابت والأعمش [وعاصم بن أبي النجود] وهشام ابن عروة شيئا وكذا فيما حدث به بالبصرة من كبار السابعة مات سنة أربع وخمسين وهو ابن ثمان وخمسين سنة ع

<a id="t6908"></a>

[checked against source] T6908; printed 1/547; [Shamela 8609, digital 473](https://shamela.ws/book/8609/473):

> منصور ابن المعتمر ابن عبد الله السلمي أبو عتاب بمثناة ثقيلة ثم موحدة الكوفي ثقة ثبت وكان لا يدلس من طبقة الأعمش مات سنة اثنتين وثلاثين ومائة ع

<a id="t6943"></a>

[checked against source] T6943; printed 1/549; [Shamela 8609, digital 475](https://shamela.ws/book/8609/475):

> موسى ابن إسماعيل المنقري بكسر الميم وسكون النون وفتح القاف أبو سلمة التبوذكي بفتح المثناة وضم الموحدة وسكون الواو وفتح المعجمة مشهور بكنيته وباسمه ثقة ثبت من صغار التاسعة ولا التفات إلى قول ابن خراش تكلم الناس فيه مات سنة ثلاث وعشرين ع

<a id="t7120"></a>

[checked against source] T7120; printed 1/561; [Shamela 8609, digital 487](https://shamela.ws/book/8609/487):

> نصر ابن علي ابن نصر ابن علي الجهضمي حفيد الذي قبله ثقة ثبت طلب للقضاء فامتنع من العاشرة مات سنة خمسين أو بعدها ع

<a id="t7152"></a>

[checked against source] T7152; printed 1/563; [Shamela 8609, digital 489](https://shamela.ws/book/8609/489):

> النعمان ابن بشير ابن سعد ابن ثعلبة الأنصاري الخزرجي له ولأبويه صحبة ثم سكن الشام ثم ولي إمرة الكوفة ثم قتل بحمص سنة خمس وستين وله أربع وستون سنة ع

<a id="t7317"></a>

[checked against source] T7317; printed 1/574; [Shamela 8609, digital 500](https://shamela.ws/book/8609/500):

> همام ابن منبه ابن كامل الصنعاني أبو عتبة [عقبة] أخو وهب ثقة من الرابعة مات سنة اثنتين وثلاثين على الصحيح ع

<a id="t7389"></a>

[checked against source] T7389; printed 1/579; [Shamela 8609, digital 505](https://shamela.ws/book/8609/505):

> واقد ابن محمد ابن زيد ابن عبد الله ابن عمر ابن الخطاب العدوي المدني ثقة من السادسة خ م د س

<a id="t7487"></a>

[checked against source] T7487; printed 1/586; [Shamela 8609, digital 512](https://shamela.ws/book/8609/512):

> وهيب بالتصغير ابن خالد ابن عجلان الباهلي مولاهم أبو بكر البصري ثقة ثبت لكنه تغير قليلا بأخرة من السابعة مات سنة خمس وستين وقيل بعدها ع

<a id="t7559"></a>

[checked against source] T7559; printed 1/591; [Shamela 8609, digital 517](https://shamela.ws/book/8609/517):

> يحيى ابن سعيد ابن قيس الأنصاري المدني أبو سعيد القاضي ثقة ثبت من الخامسة مات سنة أربع وأربعين أو بعدها ع

<a id="t7680"></a>

[checked against source] T7680; printed 1/599; [Shamela 8609, digital 525](https://shamela.ws/book/8609/525):

> يحيى ابن يوسف الزمي بكسر الزاي والميم الثقيلة الخراساني نزيل بغداد ويقال له ابن أبي كريمة ثقة من كبار العاشرة مات سنة بضع وعشرين خ ق

<a id="t7701"></a>

[checked against source] T7701; printed 1/600; [Shamela 8609, digital 526](https://shamela.ws/book/8609/526):

> يزيد ابن أبي حبيب المصري أبو رجاء واسم أبيه سويد واختلف في ولائه ثقة فقيه وكان يرسل من الخامسة مات سنة ثمان وعشرين وقد قارب الثمانين ع

<a id="t7811"></a>

[checked against source] T7811; printed 1/607; [Shamela 8609, digital 533](https://shamela.ws/book/8609/533):

> يعقوب ابن إبراهيم ابن سعد ابن إبراهيم ابن عبد الرحمن ابن عوف الزهري أبو يوسف المدني نزيل بغداد ثقة فاضل من صغار التاسعة مات سنة ثمان ومائتين ع

<a id="t7812"></a>

[checked against source] T7812; printed 1/607; [Shamela 8609, digital 533](https://shamela.ws/book/8609/533):

> يعقوب ابن إبراهيم ابن كثير ابن زيد ابن أفلح العبدي مولاهم أبو يوسف الدورقي ثقة من العاشرة مات سنة اثنتين وخمسين وله ست وثمانون سنة وكان من الحفاظ ع

<a id="t7815"></a>

[checked against source] T7815; printed 1/607; [Shamela 8609, digital 533](https://shamela.ws/book/8609/533):

> يعقوب ابن حميد ابن كاسب المدني نزيل مكة وقد ينسب لجده صدوق ربما وهم من العاشرة مات سنة أربعين أو إحدى وأربعين عخ ق

<a id="t7834"></a>

[checked against source] T7834; printed 1/608; [Shamela 8609, digital 534](https://shamela.ws/book/8609/534):

> يعقوب ابن محمد ابن عيسى ابن عبد الملك ابن حميد ابن عبد الرحمن ابن عوف الزهري المدني نزيل بغداد صدوق كثير الوهم والرواية عن الضعفاء من كبار العاشرة مات سنة ثلاث عشرة ومائتين خت ق

<a id="t7952"></a>

[checked against source] T7952; printed 1/621; [Shamela 8609, digital 546](https://shamela.ws/book/8609/546):

> أبو بردة ابن أبي موسى الأشعري قيل اسمه عامر وقيل الحارث ثقة من الثالثة مات سنة أربع ومائة وقيل غير ذلك جاز الثمانين ع

<a id="t7985"></a>

[checked against source] T7985; printed 1/624; [Shamela 8609, digital 549](https://shamela.ws/book/8609/549):

> أبو بكر ابن عياش بتحتانية ومعجمة ابن سالم الأسدي الكوفي المقرىء الحناط بمهملة ونون مشهور بكنيته والأصح أنها اسمه وقيل اسمه محمد أو عبد الله أو سالم أو شعبة أو رؤبة أو مسلم أو خداش أو مطرف أو حماد أو حبيب عشرة أقوال ثقة عابد إلا أنه لما كبر ساء حفظه وكتابه صحيح من السابعة مات سنة أربع وتسعين وقيل قبل ذلك بسنة أو سنتين وقد قارب المائة وروايته في مقدمة مسلم ع

<a id="t7986"></a>

[checked against source] T7986; printed 1/624; [Shamela 8609, digital 549](https://shamela.ws/book/8609/549):

> أبو بكر ابن عياش السلمي فاضل له كتاب في غريب الحديث مقبول من السابعة أيضا تمييز

<a id="t8426"></a>

[checked against source] T8426; printed 1/680; [Shamela 8609, digital 605](https://shamela.ws/book/8609/605):

> أبو هريرة الدوسي الصحابي الجليل حافظ الصحابة اختلف في اسمه واسم أبيه قيل عبد الرحمن ابن صخر وقيل ابن غنم وقيل عبد الله ابن عائذ وقيل ابن عامر وقيل ابن عمرو وقيل سكين ابن ودمة [وذمة، وقيل] ابن هانئ وقيل ابن مل وقيل ابن صخر وقيل عامر ابن عبد شمس وقيل ابن عمير وقيل يزيد ابن عشرقة وقيل عبد نهم وقيل عبد شمس وقيل غنم وقيل عبيد ابن غنم وقيل عمرو ابن غنم وقيل ابن عامر وقيل سعيد ابن الحارث هذا الذي وقفنا عليه من الاختلاف في ذلك ونقطع بأن عبد شمس وعبدنهم غير بعد أن أسلم واختلف في أيها أرجح فذهب كثيرون إلى الأول وذهب جمع من النسابين إلى عمرو ابن عامر مات سنة سبع وقيل سنة ثمان وقيل تسع وخمسين وهو ابن ثمان وسبعين سنة ع

<a id="t8633"></a>

[checked against source] T8633; printed 1/750; [Shamela 8609, digital 673](https://shamela.ws/book/8609/673):

> عائشة بنت أبي بكر الصديق أم المؤمنين [الحميراء] أفقه النساء مطلقا وأفضل أزواج النبي صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ إلا خديجة ففيهما [ففيها] خلاف شهير ماتت سنة سبع وخمسين على الصحيح ع

### Muslim chains for the same anthology entries

[checked in repo] The selected Muslim records remain source text rather than equivalent Bukhari `chain` arrays. The builder's `muslimRoutes` and `narrated` paths retain text and use an initial quote boundary for selected display records. They do not establish a full narrator identity graph. Existing simple drawn routes therefore do not prove reliable splitting across all selected Muslim passages.

[checked in repo] The Abd al-Baqi Muslim 8 record in anthology no. 2 includes the opening Yahya b. Yamar story, Ibn Umar's speech and the embedded transmission from Umar. Other records include ح, jointly named teachers, اللفظ لفلان, بمثله and نحو حديث. Bukhari's current parser is not evidence that those structures are absent or already resolved in Muslim.

[inferred] A reliable first step is a manual occurrence ledger for the selected Muslim passages: retain the exact transmission word, source-text span, branch, shared tail, the collector's wording attribution and any backward reference. Distinguish narrated story speech from the embedded report's chain. Annotate each ح and each combined teacher explicitly, and make every span reconstruct the original text before linking people. Use the same Taqrib identity evidence per occurrence, never positional alignment with the Bukhari chain. Automatic candidate splitting can assist this review; the current witness and parser do not justify a claim that unreviewed automatic links are reliable.

## 5. Readiness and the smallest first PR

| Status | Part | Ready now | Missing / smallest first PR |
| --- | --- | --- | --- |
| Inferred | Terms | A complete bounded Bayquniyya selection and an attributed comparison set are inspectable here. | Pin its print images, collate the suspicious digital readings, then add author-only definitions with whole-verse spans and edition/page metadata through the existing terms pattern. Register an adopted source once. Do not promise a complete Nukhba/Nuzha term count or full four-book concordance until it is enumerated. |
| Inferred | Existing hadith examples | The 39 current grading passages and the six addition-grade passages can be selected by existing source locators. | The first data-only PR should record exact term spans, scholar, witness and route scope, keeping qualifications and contrary named statements together. Obtain the direct classical passages behind additional modern-note attributions for 47, 49 and 50 before calling their grade inventory exhaustive. |
| Inferred | Twelve ranks / twelve generations | Both authorial lists are transcribed above with an edition pin and the digital coverage gap exposed. | Acquire and collate Awwama pp. 73–75, replace the provisional research transcription with verified author-only spans and separately identify every retained editorial addition. No generated shorthand definitions of the classes. |
| Inferred | Narrators | All 104 stored occurrences are covered by the form ledger, with full entries for the identity and candidate dictionary. | First publish a reviewed small occurrence-to-existing-person map for the resolved qualified identities. Fill the unresolved teacher/student and commentator evidence before assigning those occurrences a biography or rank. No automatic surname/kunya merge and no unsourced person stub. |
| Inferred | Muslim splitting | Existing exact text is available for manual annotation. | Annotate a small selected set with branches and speaker boundaries, prove round-trip text coverage, then extend after review. No whole-library importer or next collection is proposed. |

[inferred] The smallest product slice after the source-only PR is the bounded terms page with the scholar's name, complete quote, his own example where present, and a source link opening the edition/page. It can link a term to an already sourced grading passage. Reuse the balagha terms page's source-first pattern; keep this audit out of app code. A subsequent feature must supply its shared view, feed card and sourced quiz under the repository's existing rules. Quiz options must be real source spans; different valid scholarly definitions cannot be treated as invented false definitions.

[checked in repo] The records affecting this plan are R0015, competing source statements remain attributed; R0026, a citation supports only the actual claim; R0059, main-text placement does not establish authorship; R0061, distinguish a matn from the commentary that carries it; R0063, a grade quote retains its complete scope; and R0067, identify editorial insertions from evidence rather than assuming everything above the footnote rule is classical. The numerical instruction in R0067 arose from particular Quran-book exports; it is not applied to delete Ibn Hajar's authorial numbered classes.

## Continuation state, 21 November 2026

[checked in repo] This is a saved research draft, not a completed audit. The owner authorized adding the source domains and published a new environment configuration, but the current chat still reports enforced revision 1 and fresh downloads to Turath and Archive fail with proxy 403. Continue in a new chat using the published environment. Keep the requested final deliverable to this one file and open the titled PR only after completing or explicitly resolving the remaining requirements below.

- [inferred] Collate the new Arabic quotations against the named edition images. In particular, verify the introduction's individual page assignments; the provisional JK footer interpretation places ranks 1–11 on p. 74 and rank 12 and the generations on p. 75, while live Shamela begins with generation 12 on p. 75. Do not certify the earlier paragraphs' page boundaries from that partial live witness.
- [inferred] Enumerate Nukhba and Nuzha's actual definition units and finish the differing-definition comparison for the remaining base terms. The 32-row Bayquniyya inventory is complete; the prose comparison and the requested other-book definition counts are not.
- [inferred] Complete the direct classical grade inventory for 47, 49 and 50. Further research located al-Hakim's Mustadrak, Mustafa Abd al-Qadir Ata, Dar al-Kutub al-Ilmiyya, first 1411/1990: no. 1822 at 1/672, no. 7894 at 4/354 and no. 7945 at 4/367. The JK research witness has these page markers; the Shamela-derived witness includes a Dhahabi comment at 7945 and an editorial notice of silence at 7894. These are leads pending edition-image and digital-locator verification, not additional published grades in this file. Do not turn silence into approval or collection inclusion into a fabricated grade sentence.
- [inferred] Confirm the unresolved narrator candidates through actual teacher/student or commentator passages. The ledger's resolved/unresolved counts describe its stated decisions and are not approval for publishing new biographies.

[checked against source] Research acquisition paths for continuation: the public OpenITI repositories contain `0875AH/data/0852IbnHajarCasqalani/0852IbnHajarCasqalani.TaqribTahdhib/0852IbnHajarCasqalani.TaqribTahdhib.JK000121-ara1.completed`, the same work's `Shamela0008609-ara1`, `NukhbatFikar/0852IbnHajarCasqalani.NukhbatFikar.Shamela0005940-ara1`, `NuzhatNazar/0852IbnHajarCasqalani.NuzhatNazar.Shamela0012115-ara1`, and `FathBari/0852IbnHajarCasqalani.FathBari.Shamela0001673-ara1`. Their historical IDs and edition metadata must not be assumed to match today's live Shamela. The 0875AH revision inspected was `5835c183b8bbf4ea454d5c1be2b168b669403771`. The other paths are `0700AH/data/0676Nawawi/0676Nawawi.Taqrib/0676Nawawi.Taqrib.Shamela0005586-ara1`, `0650AH/data/0643IbnSalahShahrazuri/0643IbnSalahShahrazuri.MuqaddimatCulumHadith/0643IbnSalahShahrazuri.MuqaddimatCulumHadith.Shamela0022870-ara1`, and `0425AH/data/0405HakimNaysaburi/0405HakimNaysaburi.Mustadrak/0405HakimNaysaburi.Mustadrak.JK000467-ara1` and `Shamela0002266-ara1`. These are research aids; use edition images for the requested print check rather than substituting their normalized spellings.

[checked in repo] One independent review cycle reproduced all 104 occurrence placements, 88 forms, 78 resolved occurrences, 26 unresolved occurrences, 61 resolved people, 92 dictionary quotes and all 45 saved grade quotes. Its two empty comparison quotes were filled and its introduction-page finding was addressed provisionally with the remaining image check explicit. It also flagged the incomplete grade inventory, term counts/comparison and print verification. A second review cycle is not required for these documentation corrections under AGENTS.md.

[checked in repo] Validation on main `133f3deb5c17abf72d28ef5a7a23b2e1d2d6ff0b`: lint passed; TypeScript initially exhausted the default heap, then passed with `NODE_OPTIONS=--max-old-space-size=4096`. The full test run passed 536 suites and 5,306 tests, with one skipped test; one suite could not load missing Expo dependencies. After installing the existing mobile lockfile dependencies using a writable temporary npm cache, the affected `shared/tapSize.test.ts` suite passed. The production build was still compiling when this continuation snapshot was saved. No app code, package manifest or lockfile was changed.

## Open questions for the owner

- [inferred] Approve the bounded Bayquniyya page as the first base, or require Nukhba with Nuzha as the first complete inventory? The latter still needs its atomic term count and full table, not an index-heading count.
- [inferred] Can the chosen edition scans and pinned exports be made accessible so the new Arabic quotations can be collated against print? The current file explicitly distinguishes digital witness checking from that missing verification.
- [inferred] Who will review the source wording and approve the identity decisions, especially Yaqub in 2697, Ishaq in 4343 and the other unresolved bare names? The exact unique-person total remains open while those occurrences do.
- [inferred] Should the first source PR include the additional direct classical grading witnesses named in the editors' notes for 47, 49 and 50, or should those references remain acquisition leads until their actual passages are read?
- [inferred] Approve keeping alternative classical definitions together, each under its scholar's name, and excluding them as false answers to a universal-definition quiz?
- [inferred] Should the first narrator links use only existing Companion people pages, or also create independently sourced profiles for resolved non-Companion narrators through the canonical people pipeline? A narrator occurrence alone does not authorize a graph node.
