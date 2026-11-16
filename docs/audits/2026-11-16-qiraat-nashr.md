# Qira'at per-ayah audit against al-Nashr

Date: 2026-11-16. Research only. No data, generator, application code or oath records changed.

## Scope and method

This report samples surahs آل عمران through الناس against Ibn al-Jazari's *al-Nashr fi al-Qira'at al-'Ashr*. It extends the al-Baqara sample in #746, rather than treating that PR as a Quran-wide certification. The requested region begins inside juz 3. Juz 1 and 2 contain no ayat in this region and are not resampled.

The baseline is `main` commit `f5ecb444449c42382ac9c8a68cfa01ac789ba889`. The PR was refreshed onto `70bd7db52e6eb97cf6b2caaf3bbb76664e6a445b`; all four audited qira'at, reader, Quran-word and juz input files are unchanged between those commits. The published data is `shared/data/quran/qiraat.json`, introduced by #720, with dump version `2026-11-14`. The reader-number mapping comes from `shared/quran/qiraat.ts`; ayah and token locations were checked against `shared/data/quran/trees.json`; juz boundaries come from `shared/quran/juz.ts`. Nothing was regenerated. Indices in this report are the stored zero-based, inclusive `at` ranges, not Arabic word-number conventions.

Selection is purposive, not random. For each remaining juz I selected at least ten distinct word positions, favored distinct explicit farsh rules and included every surah with a substantive sampled entry. Repeated occurrences count separately, but separate reading groups at one position count once. Source-led checks also include missing positions, rather than sampling only what survived import. A separate surah inventory accounts for short surahs with no sampled farsh, including performance-only records and unresolved route scope. Coverage does not mean that every variant in every surah was checked. These counts cannot estimate a Quran-wide error rate.

The comparison checks the focal word's substantive letters and vowels, its reader assignments and its ayah attachment. Surrounding words in a stored string are reproduced for inspection. Differences confined to imala, naql, hamza treatment, joining vowels, idafa/extra ya and other performance rules do not create a missing-farsh finding. An extra stored performance subdivision is not counted as an extra canonical reading. Explicitly wrong spelling, a word from another ayah and a wrong anchor are classified as **wording**, with the actual problem stated.

The twenty riwayat follow Shatibiyya and Durra, as R0033 records. Al-Nashr's additional routes are evidence of a reading's existence, not sufficient evidence that the app must include it. A route-sensitive conclusion is marked **Inferred**, and is not a confirmed mismatch. A match marked checked means that the stated farsh partition agrees with the inspected primary text; it does not certify the rendering of every performance mark. The report preserves incomplete vocalization rather than silently repairing it.

## Edition and access

All `2/page` references mean volume 2, printed page, of Ibn al-Jazari, *al-Nashr fi al-Qira'at al-'Ashr*, edited by Ali Muhammad al-Dabba, al-Matba'a al-Tijariyya al-Kubra, Dar al-Kitab al-Ilmiyya photographic reproduction. They are not PDF page numbers.

- [Searchable primary text and edition statement, IslamHouse](https://islamhouse.com/read/ar/النشر-في-القراءات-العشر-810046).
- [Photographic edition, IslamHouse PDF](https://d1.islamhouse.com/data/ar/ih_books/single_010/ar_elnashr_fe_elqaraat_el3ashr.pdf). In this 994-page file, printed volume 2 page 306 is PDF page 825. The corresponding offset is 519 for the inspected volume 2 pages.

Arabic quotations preserve words from the text; most omit tashkil for legibility. Ellipses mark a shortened passage. I compared the searchable text for all ledger positions and inspected the scan at printed pages 216, 228, 238, 239, 253, 256, 277, 293, 295, 301, 306, 320, 328, 330, 334, 349, 363, 366, 378, 380, 381, 389 and 399 where a defect or a transcription anomaly needed checking. A quote corrected from the scan is identified below. No quote is reconstructed from the dataset.

Names in the book require care. أبو بكر means Shuba. المدنيان means Nafi and Abu Jafar, البصريان means Abu Amr and Yaqub, and الكوفيون includes Khalaf al-Ashir. The phrase الباقون is expanded only after the named exceptions and route qualifications have been read.

## Results

The ledger contains **296 distinct sampled farsh positions** across juz 3 through 30. It records **28 confirmed mismatch positions**, **253 checked matches**, **14 inferred or route-sensitive comparisons**, and **1 source-anomaly-only comparison**. Two positions have a source anomaly; P293 also has an independent confirmed wording defect. Severity labels can overlap within a position. A missing attribution is counted as a missing reading even when the form already exists for another reader.

The most consequential confirmed defects are the missing شنآن positions in al-Maida, missing علي in al-Hijr, missing fa-vowel distinction in al-Ikhlas, swapped Yaqub/Khalaf assignments at الرحمن 55:31, and farsh words attached to the next ayah. The report proposes no automatic corrections.

## Confirmed findings

### F01. آل عمران 3:13 ترونهم

Severity: **wrong reader**. Evidence: **Checked against the text**. Ledger P002.

Stored data: `كَافِرَةٞ يَرَوۡنَهُم` → `3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20`; `كافرة ترونهمُ` → `1,2,15,16`.

Yaqub, riwayat 17 and 18, is assigned يَرَوْنَهُمْ. The text assigns both riwayat to the address form تَرَوْنَهُمْ.

Al-Nashr, al-Dabba edition, 2/238:

> فقرأ المدنيان ويعقوب بالخطاب، وقرأ الباقون بالغيب.

### F02. آل عمران 3:37 زكريا

Severity: **wrong reader; wording**. Evidence: **Checked against the text**. Ledger P007.

Stored data: `زَكَرِيَّاۖ كُلَّمَا` → `2,7,8,10,11,12,13,14,19,20`; `زكريآءُ` → `1,3,4,5,6,9,15,16,17,18`.

Warsh and both Ibn Amir riwayat, 2, 7 and 8, are grouped with unhamzated زكريا. The text restricts that form to Hamza, Kisai, Khalaf and Hafs. Shuba, 9, also shares the nominative زكريآءُ string although the text explicitly assigns him the accusative here. Hamza treatment in connected recitation does not explain Ibn Amir losing the final hamza before كلما.

Al-Nashr, al-Dabba edition, 2/239:

> فقرأ حمزة والكسائي وخلف وحفص بالقصر من غير همزة في جميع القرآن، وقرأ الباقون بالمد والهمز إلا أن أبا بكر نصبه هنا بعد كفلها على أنه مفعول ثاني لكفلها ورفعه الباقون ممن خفف.

### F03. النساء 4:40 حسنة

Severity: **wrong reader**. Evidence: **Checked against the text**. Ledger P029.

Stored data: `حَسَنَةٗ يُضَٰعِفۡهَا` → `5,6,7,8,9,10,11,12,13,14,17,18,19,20`; `حسنةٌ يَضَاعِفْها` → `1,2`; `حسنةٌ يُضَعِّفْها` → `3,4,15,16`.

The حسنة case partition agrees, but the same stored span also includes يضاعفها. Ibn Amir and Yaqub, 7, 8, 17 and 18, are assigned the long-alif light form. The general rule explicitly requires the doubled form without alif for those readers, with Ibn Kathir and Abu Jafar. This is not a performance-only subdivision.

Al-Nashr, al-Dabba edition, 2/228; cross-reference 2/249:

> فقرأ ابن كثير وابن عامر وأبو جعفر ويعقوب بالتشديد مع حذف الألف في جميع القرآن، وقرأ الباقون بالإثبات والتخفيف.

### F04. النساء 4:163 زبورا, stored at 4:164 [0,0]

Severity: **wording**. Evidence: **Checked against the text**. Ledger P033.

Stored data: `زَبُورٗا وَرُسُلٗا` → `1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18`; `زُبورا` → `11,12,19,20`.

The زبورا rule is filed under 4:164 at [0,0], which highlights ورسلا. The differing word is in النساء 4:163, token 24. The reader partition itself agrees.

Al-Nashr, al-Dabba edition, 2/253:

> واختلفوا في زبورا هنا، وفي سبحان والزبور في الأنبياء فقرأ حمزة وخلف بضم الزاي، وقرأ الباقون بفتحها.

### F05. المائدة 5:2 شنآن

Severity: **missing reading**. Evidence: **Checked against the text**. Ledger P295.

Stored data: no entry at this word.

No stored position exists for شنآن at this ayah. Al-Nashr explicitly covers both occurrences and assigns sukun of nun at least to Ibn Amir, Shuba and Ibn Wardan, riwayat 7, 8, 9 and 15. The Ibn Jammaz routes require a separate scope decision; that does not erase the other four supported assignments.

Al-Nashr, al-Dabba edition, 2/253:

> واختلفوا في شنآن قوم في الموضعين من هذه السورة فقرأ ابن عامر وأبو بكر وابن وردان بإسكان النون واختلف عن ابن جماز.

### F06. المائدة 5:8 شنآن

Severity: **missing reading**. Evidence: **Checked against the text**. Ledger P296.

Stored data: no entry at this word.

No stored position exists for شنآن at this ayah. Al-Nashr explicitly covers both occurrences and assigns sukun of nun at least to Ibn Amir, Shuba and Ibn Wardan, riwayat 7, 8, 9 and 15. The Ibn Jammaz routes require a separate scope decision; that does not erase the other four supported assignments.

Al-Nashr, al-Dabba edition, 2/253:

> واختلفوا في شنآن قوم في الموضعين من هذه السورة فقرأ ابن عامر وأبو بكر وابن وردان بإسكان النون واختلف عن ابن جماز.

### F07. المائدة 5:107 " استحق "

Severity: **wording**. Evidence: **Checked against the text**. Ledger P044.

Stored data: `ٱسۡتَحَقَّآ` → `10`; `استُحِقَ` → `1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20`.

The stored anchor [4,4] selects the first استحقا, with the dual alif. Al-Nashr discusses the second استحق, token 11, before عليهم الأوليان. The record therefore puts the passive alternative on the wrong word and quotes Hafs with an extra alif for the audited position.

Al-Nashr, al-Dabba edition, 2/256:

> واختلفوا في استحق فروى حفص بفتح التاء والحاء، وإذا ابتدا كسر همزة الوصل، وقرأ الباقون بضم التاء وكسر الحاء، وإذا ابتدءوا ضموا الهمزة.

### F08. الأنفال 8:67 أن يكون له

Severity: **wrong reader**. Evidence: **Checked against the text**. Ledger P079.

Stored data: `أَن يَكُونَ` → `1,2,3,4,7,8,9,10,11,12,13,14,19,20`; `أَن تكُونَ` → `5,6,15,16,17,18`.

Both Abu Jafar riwayat, 15 and 16, are assigned تكون. Al-Nashr limits that form to the Basrans, Abu Amr and Yaqub. Abu Jafar belongs with يكون.

Al-Nashr, al-Dabba edition, 2/277:

> فقرأ البصريان بالتاء مؤنثا، وقرأ الباقون بالياء مذكرا.

### F09. يوسف 12:56 حيث يشاء

Severity: **missing reading**. Evidence: **Checked against the text**. Ledger P101.

Stored data: `حَيۡثُ يَشَآءُۚ` → `1,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20`; `حَيْثُ نَشَآءُ` → `3,4`.

Warsh, riwaya 2, is absent from both stored groups. He belongs with يشاء; only Ibn Kathir has نشاء.

Al-Nashr, al-Dabba edition, 2/295:

> فقرأ ابن كثير بالنون، وقرأ الباقون بالياء.

### F10. يوسف 12:100 ياأبت حيث جاء، وهو في هذه السورة ومريم والقصص والصافات

Severity: **missing reading**. Evidence: **Checked against the text**. Ledger P106.

Stored data: `يَٰٓأَبَتِ` → `1,3,4,5,6,9,10,11,12,13,14,17,18,19,20`; `يَآ أَبَتَ` → `7,8,15,16`.

Warsh, riwaya 2, is absent from both stored groups. The book assigns the open ta to Abu Jafar and Ibn Amir, so Warsh belongs with the kasra group. This is a missing attribution, not an omitted third form.

Al-Nashr, al-Dabba edition, 2/293:

> فقرأ بفتح التاء في السور الأربع أبو جعفر وابن عامر، وقرأ الباقون بكسر التاء فيهن.

### F11. الحجر 15:41 علي, token 3

Severity: **missing reading**. Evidence: **Checked against the text**. Ledger P114.

Stored data: no entry at this word.

There is no stored position at علي. The only entry for 15:41 is the separate صراط/سراط performance difference at [2,2]. The substantive عَلِيٌّ reading of both Yaqub riwayat, 17 and 18, is missing.

Al-Nashr, al-Dabba edition, 2/301:

> فقرأ يعقوب بكسر اللام ورفع الياء وتنوينها، وقرأ الباقون بفتح اللام من غير تنوين.

### F12. طه 20:13 وأنا

Severity: **wording**. Evidence: **Checked against the text**. Ledger P140.

Stored data: `طُوٗى وَأَنَا` → `7,8,9,10,13,14,19,20`; `طُوًى وَأَنَّا` → `11,12`; `طُوَى وَأَنَا` → `1,2,3,4,5,6,15,16,17,18`.

The 20:13 record includes طوى from 20:12 and splits its tanwin into a third group. The audited 20:13 word وأنا is correctly assigned, but its displayed forms and groups also carry a difference from the previous ayah.

Al-Nashr, al-Dabba edition, 2/320:

> واختلفوا في وأنا اخترتك فقرأ حمزة وأنا بتشديد النون اخترناك بالنون مفتوحة وألف بعدها على لفظ الجمع، وقرأ الباقون أنا بتخفيف النون اخترتك بالتاء مضمومة من غير ألف على لفظ الواحد.

### F13. المؤمنون 23:14 عظاما فكسونا العظام

Severity: **wording**. Evidence: **Checked against the text**. Ledger P153.

Stored data: `عِظَٰمٗا` → `1,2,3,4,5,6,10,11,12,13,14,15,16,17,18,19,20`; `(عَظْماً` → `7,8,9`.

The Ibn Amir and Shuba form is stored literally as (عَظْماً, with an unmatched opening parenthesis. The reading and its reader assignments agree; the displayed word has an extra character.

Al-Nashr, al-Dabba edition, 2/328:

> فقرأ ابن عامر وأبو بكر عظما والعظم بفتح العين وإسكان الظاء من غير ألف على التوحيد فيهما.

### F14. المؤمنون 23:52 وإن

Severity: **wrong reader**. Evidence: **Checked against the text**. Ledger P158.

Stored data: `عَلِيمٞ وَإِنَّ هَٰذِهِۦٓ` → `1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20`; `عَلِيمٌ وَأَنْ` → `7,8`.

The closed-hamza Hafs string وَإِنَّ is assigned also to Nafi, Ibn Kathir, Abu Amr, Abu Jafar and Yaqub. The book gives the closed hamza to the Kufans and the open hamza to the others; Ibn Amir separately lightens the nun. The word from the preceding ayah, عليم, also contaminates the stored text.

Al-Nashr, al-Dabba edition, 2/328:

> فقرأ الكوفيون بكسر الهمزة، وقرأ الباقون بفتحها، وأسكن النون من أن مخففة ابن عامر وشددها الباقون.

### F15. الفرقان 25:69 يضاعف ويخلد

Severity: **wording; extra reading**. Evidence: **Checked against the text**. Ledger P167.

Stored data: `يُضَٰعَفۡ` → `1,2,3,4,5,6,10,11,12,13,14,15,16,17,18,19,20`; `وَيَخْلُدُ` → `7,8,9`; `يُضَاعَفْ` → `1,2,5,6,10,11,12,13,14,19,20`; `يُضَاعَفُ` → `9`; `يُضَعَّفْ` → `3,4,15,16,17,18`; `يُضَعَّفُ` → `7,8`.

At the يضاعف anchor the data includes وَيَخْلُدُ as if it were a reading of that word. Its initial jussive form and the later جزم subgroups also overlap in their rawi membership. The source requires رفع for Ibn Amir and Shuba and جزم for the rest; the later raised-faa subgroups represent that distinction, but وَيَخْلُدُ is not an alternative form of يضاعف.

Al-Nashr, al-Dabba edition, 2/334:

> واختلفوا في يضاعف ويخلد فقرأ ابن عامر وأبو بكر برفع الفاء والدال، وقرأ الباقون بجزمهما.

### F16. الأحزاب 33:68 كبيرا, stored at 33:69 [0,0]

Severity: **wording**. Evidence: **Checked against the text**. Ledger P196.

Stored data: `كَبِيرٗا يَٰٓأَيُّهَا` → `9,10`; `كَثِيراً` → `1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19,20`.

كبيرا/كثيرا is stored at 33:69 [0,0], which selects يا أيها. The differing word is in الأحزاب 33:68, token 7. The difference and its dominant reader grouping are supported; the ayah attachment is wrong.

Al-Nashr, al-Dabba edition, 2/349:

> واختلفوا في لعنا كبيرا فقرأ عاصم بالباء الموحدة من تحت.

### F17. ص 38:15 فواق, stored at 38:16 [0,0]

Severity: **wording**. Evidence: **Checked against the text**. Ledger P209.

Stored data: `فَوَاقٖ وَقَالُواْ` → `1,2,3,4,5,6,7,8,9,10,15,16,17,18`; `فُوَاقٍ وَقَالُوا` → `11,12,13,14,19,20`.

فواق/فواق is stored at 38:16 [0,0], which selects وقالوا. The word whose fa vowel differs is in ص 38:15, token 9. Reader assignments agree.

Al-Nashr, al-Dabba edition, 2/361:

> واختلفوا في فواق فقرأ حمزة والكسائي وخلف بضم الفاء، وقرأ الباقون بفتحها.

### F18. الزمر 39:38 كاشفات ضره وممسكات رحمته

Severity: **missing reading**. Evidence: **Checked against the text**. Ledger P212.

Stored data: `كَٰشِفَٰتُ ضُرِّهِۦٓ أَوۡ` → `1,3,4,7,8,9,10,11,12,13,14,15,16,19,20`; `كَاشِفَاتٌ ضُرَّهُ أَو` → `5,6,17,18`.

Warsh, riwaya 2, is absent from both groups. He belongs with the non-tanwin كاشفات and genitive ضره, because the text limits tanwin and the accusative to the two Basran readers.

Al-Nashr, al-Dabba edition, 2/363:

> فقرأ البصريان بتنوين كاشفات وممسكات، ونصب ضره ورحمته، وقرأ الباقون بغير تنوين فيها وخفض ضره ورحمته.

### F19. فصلت 41:16 نحسات

Severity: **wrong reader; extra reading**. Evidence: **Checked against the text**. Ledger P220.

Stored data: `نَّحِسَاتٖ` → `7,8,9,10,11,12,13,14,15,16,17,18,19,20`; `نَحْسَاتٍ` → `1,2,3,4,5,6,17,18`.

Both Yaqub riwayat, 17 and 18, occur in both نَحِسَات and نَحْسَات groups. The text limits the kasra to Abu Jafar, Ibn Amir and the Kufans, and gives sukun to the rest. Yaqub should occur only in the sukun group.

Al-Nashr, al-Dabba edition, 2/366:

> فقرأ أبو جعفر وابن عامر والكوفيون بكسر الحاء وقرأ الباقون بإسكانها.

### F20. الشورى 42:35 ويعلم الذين

Severity: **wording**. Evidence: **Checked against the text**. Ledger P225.

Stored data: `كَثِيرٖ وَيَعۡلَمَ` → `3,4,5,6,9,10,11,12,13,14,17,18,19,20`; `كَثِيرٍ وَيَعْلَمُ` → `1,2,7,8,15,16`.

The 42:35 [0,0] anchor correctly selects ويعلم, and the reader partition agrees. Both stored strings nevertheless prepend كثير from 42:34. This is cross-ayah wording contamination, not a third reading of ويعلم.

Al-Nashr, al-Dabba edition, 2/367:

> واختلفوا في ويعلم الذين فقرأ ابن عامر والمدنيان برفع الميم، وقرأ الباقون بنصبها.

### F21. القمر 54:3 مستقر, stored at 54:4 [0,0]

Severity: **wording**. Evidence: **Checked against the text**. Ledger P247.

Stored data: `مُّسۡتَقِرّٞ وَلَقَدۡ` → `1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20`; `مُسْتَقِرٍّ وَلَقَدْ` → `15,16`.

مستقر is stored at 54:4 [0,0], which selects ولقد. The word is in القمر 54:3, token 5. The Abu Jafar genitive assignment agrees. The source quotes the boundary phrase مستقر ولقد; that does not make مستقر part of the following ayah.

Al-Nashr, al-Dabba edition, 2/380:

> واختلفوا في مستقر ولقد فقرأ أبو جعفر بخفض الراء، وقرأ الباقون برفعها.

### F22. الرحمن 55:31 سنفرغ لكم

Severity: **wrong reader**. Evidence: **Checked against the text**. Ledger P248.

Stored data: `سَنَفۡرُغُ` → `1,2,3,4,5,6,7,8,9,10,15,16,19,20`; `سَيَفْرُغُ` → `11,12,13,14,17,18`.

Both Yaqub riwayat, 17 and 18, are put with سيفرغ and both Khalaf riwayat, 19 and 20, with سنفرغ. Al-Nashr assigns ya to Hamza, Kisai and Khalaf; Yaqub belongs with nun.

Al-Nashr, al-Dabba edition, 2/381:

> واختلفوا في سنفرغ لكم فقرأ حمزة والكسائي وخلف بالياء، وقرأ الباقون بالنون.

### F23. الطلاق 65:3 بالغ

Severity: **wording**. Evidence: **Checked against the text**. Ledger P290.

Stored data: `بَٰلِغُ أَمۡرِهِۦۚ` → `10`; `بَالِغُ أَمْرَهُ` → `1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20`.

The non-Hafs form is explicitly vocalized بَالِغُ أَمْرَهُ, with a single damma rather than the book's tanwin on بالغ. Its accusative أمره and all reader assignments agree. The quoted form needs بَالِغٌ أَمْرَهُ.

Al-Nashr, al-Dabba edition, 2/388:

> فروى حفص بالغ بغير تنوين أمره بالخفض، وقرأ الباقون بالتنوين والنصب.

### F24. المعارج 70:4 تعرج

Severity: **wording**. Evidence: **Checked against the text**. Ledger P264.

Stored data: `ٱلۡمَعَارِجِ تَعۡرُجُ` → `1,2,3,4,5,7,8,9,10,11,12,15,16,17,18,19,20`; `المَعَارِ تَّعْرُجُ` → `6`; `المَعَارِجِ يَعْرُجُ` → `13,14`.

The focal تعرج and its reader grouping agree, but all stored strings prepend المعارج from 70:3 to the word at 70:4. The Susi string also prints the preceding word as المعار. Those strings are not confined to the audited ayah.

Al-Nashr, al-Dabba edition, 2/390:

> واختلفوا في تعرج الملائكة فقرأ الكسائي بالياء على التذكير، وقرأ الباقون بالتاء على التأنيث.

### F25. الانشقاق 84:12 ويصلى سعيرا

Severity: **wording**. Evidence: **Checked against the text**. Ledger P278.

Stored data: `ثُبُورٗا وَيَصۡلَىٰ` → `5,6,9,10,11,12,15,16,17,18,19,20`; `ثُبُورًا وَيُصَلَّى` → `1,2,3,4,7,8,13,14`.

The 84:12 [0,0] anchor selects ويصلى correctly and its farsh grouping agrees. The stored strings prepend ثبورا from 84:11, which is outside this ayah.

Al-Nashr, al-Dabba edition, 2/399:

> واختلفوا في ويصلى سعيرا فقرأ نافع وابن كثير وابن عامر والكسائي بضم الياء وفتح الصاد وتشديد اللام، وقرأ الباقون بفتح الياء وإسكان الصاد وتخفيف اللام.

### F26. البلد 90:6 لبدا, stored at 90:7 [0,0]

Severity: **wording**. Evidence: **Checked against the text**. Ledger P283.

Stored data: `لُّبَدًا أَيَحۡسَبُ` → `7,8,9,10,11,12`; `لُبَدًا أَيَحْسِبُ` → `1,2,3,4,5,6,13,14,17,18,19,20`; `لُبَّدًا أَيَحْسَبُ` → `15,16`.

لبدا is attached to 90:7 [0,0], highlighting أيحسب. The differing word is actually البلد 90:6, token 3. Abu Jafar doubles ba and the others lighten it; that farsh assignment agrees, but the ayah attachment is wrong.

Al-Nashr, al-Dabba edition, 2/401:

> واختلفوا في مالا لبدا فقرأ أبو جعفر بتشديد الباء، وقرأ الباقون بتخفيفها.

### F27. الشرح 94:6 العسر/يسرا

Severity: **wording**. Evidence: **Checked against the text**. Ledger P293.

Stored data: `فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا إِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرٗا` → `1,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20`; `فَإِنَّ مَعَ العُسْرِ يُسْرًا إِنَّ مَعَ العُسْرِ يُسْرًا` → `2,11`; `فَإِن مَعَ العُسُرِ يُسُرًا إِنَّ مَعَ العُسُرِ يُسُرًا` → `15,16`.

The record stored at 94:6 includes both فإن مع العسر يسرا from 94:5 and إن مع العسر يسرا from 94:6. Its [0,3] range covers only 94:6. This cross-ayah text defect is independent of the unresolved sin-vowel reader name on p. 216. Al-Nashr refers explicitly to the two occurrences, not to a single combined ayah.

Al-Nashr, al-Dabba edition, 2/401; compare 2/216:

> وتقدم العسر يسرا في الموضعين لأبي جعفر من البقرة عند هزوا.

### F28. الإخلاص 112:4 كفوا, token 3

Severity: **missing reading**. Evidence: **Checked against the text**. Ledger P294.

Stored data: no entry at this word.

No entry exists for 112:4. The sukun of fa for Hamza, Khalaf and Yaqub is a substantive vowel difference independent of how hamza is written. It therefore cannot be dismissed merely as a performance difference in hamza.

Al-Nashr, al-Dabba edition, 2/216:

> وأسكن الفاء من كفؤا حمزة وخلف ويعقوب.

## Source anomalies and route limits

These are not included in the confirmed mismatch count.

- **النور 24:1 وفرضناها, P159, 2/330. Checked against the scan.** The online text adds ابن عامر to the readers who double ra. The scan says «فقرأ ابن كثير وأبو عمرو بتشديد الراء وقرأ الباقون بتخفيفها». The dataset agrees with the scan. The online transcription would produce a false wrong-reader finding.
- **التحريم 66:12 وكتبه, P260, 2/389. Checked against the scan.** The online text loses the contrasting clause and calls the plural التوحيد. The scan says «بضم الكاف والتاء من غير ألف على الجمع» for the Basrans and Hafs, then «بكسر الكاف وفتح التاء وألف بعدها على التوحيد» for the rest. The dataset agrees.
- **المطففين 83:24 تعرف, P277, 2/399. Checked against the scan.** The searchable text omits the Abu Jafar/Yaqub clause. The scan explicitly reads «فقرأ أبو جعفر ويعقوب بضم التاء وفتح الراء ورفع نضرة». The dataset agrees.
- **فصلت 41:16 نحسات, P220, 2/366. Checked against the scan.** The online ابن جعفر is أبو جعفر in the scan. The scan still confirms the duplicated Yaqub assignment reported above.
- **الأنفال 8:66 ضعفا, P077, 2/277. Checked against the scan.** The searchable text says بفتح الصاد; the scan says بفتح الضاد. The quote below follows the scan. The dataset matches the substantive vowel rule.
- **الإسراء 17:13 ونخرج, P122, 2/306. Checked against the scan.** The searchable text says بالباء for Yaqub; the scan says بالياء. The dataset is not wrong on that account.
- **الليل 92:7 لليسرى and الشرح 94:6 العسر/يسرا, P292 and P293, 2/216. Inferred source anomaly.** The printed line itself says «وضم السين من اليسر والعسر أبو عمرو», then attributes a route to عيسى بن وردان عنه. The same work's الذاريات chapter, 2/377, explicitly says «وتقدم يسرا لأبي جعفر بخلاف عن ابن وردان في البقرة عند هزوا». The dataset gives the raised sin to Abu Jafar. I infer an erroneous reader name on p. 216 from those internal references. I do not classify the dataset as wrong merely to follow that line literally. Exact corroboration of each related word from the route texts remains outside the checked-match count.

The inferred ledger rows identify the particular additional routes that were not promoted to missing-reading findings. In particular P012 does not certify whether Duri's second form at آل عمران 3:115 must also be represented within Shatibiyya; P204 does not certify that the printed full-vowel strings accurately communicate ikhtilas. Both limitations remain visible instead of being counted as clean matches.

## Coverage by juz

Numbers count positions, not reading strings, readers, ayat or source paragraphs. The inventory below includes missing source-led positions. The two al-Maida omissions add coverage in juz 6. The late-surah inventory adds positions beyond the ten-position minimum.

| Juz | Positions | Confirmed mismatches | Checked matches | Inferred / source anomaly |
| --- | ---: | ---: | ---: | ---: |
| 3 | 10 | 2 | 8 | 0 |
| 4 | 10 | 0 | 9 | 1 |
| 5 | 10 | 1 | 9 | 0 |
| 6 | 12 | 3 | 9 | 0 |
| 7 | 10 | 1 | 9 | 0 |
| 8 | 10 | 0 | 10 | 0 |
| 9 | 10 | 0 | 9 | 1 |
| 10 | 10 | 1 | 8 | 1 |
| 11 | 10 | 0 | 10 | 0 |
| 12 | 10 | 0 | 9 | 1 |
| 13 | 10 | 2 | 8 | 0 |
| 14 | 10 | 1 | 9 | 0 |
| 15 | 10 | 0 | 10 | 0 |
| 16 | 10 | 1 | 9 | 0 |
| 17 | 10 | 0 | 10 | 0 |
| 18 | 10 | 2 | 8 | 0 |
| 19 | 10 | 1 | 9 | 0 |
| 20 | 10 | 0 | 8 | 2 |
| 21 | 10 | 0 | 10 | 0 |
| 22 | 10 | 1 | 8 | 1 |
| 23 | 10 | 1 | 8 | 1 |
| 24 | 10 | 2 | 7 | 1 |
| 25 | 10 | 1 | 9 | 0 |
| 26 | 10 | 0 | 8 | 2 |
| 27 | 10 | 2 | 8 | 0 |
| 28 | 11 | 1 | 9 | 1 |
| 29 | 11 | 1 | 9 | 1 |
| 30 | 22 | 4 | 16 | 2 |

## Reader coverage and number key

All twenty riwayat were compared wherever the source supplied a complete rule. Reader-specific checks include both sides of a rule, not only the reader who differs from Hafs. The example column identifies an explicit named exception checked for each reader; it is not a count of all that reader's appearances.

| Reader | Riwaya numbers and names | Example checked |
| --- | --- | --- |
| نافع | 1 قالون; 2 ورش | المائدة 5:119 يوم, P049 |
| ابن كثير | 3 البزي; 4 قنبل | الأنعام 6:125 ضيقا, P058 |
| أبو عمرو | 5 الدوري عن أبي عمرو; 6 السوسي | الأحزاب 33:2 تعملون, P190 |
| ابن عامر | 7 هشام; 8 ابن ذكوان | آل عمران 3:124 منزلين, P014 |
| عاصم | 9 شعبة; 10 حفص | الأعراف 7:117 تلقف names Hafs, P065; النحل 16:11 ينبت names Shuba, P120 |
| حمزة | 11 خلف عن حمزة; 12 خلاد | آل عمران 3:21 ويقتلون, P004 |
| الكسائي | 13 أبو الحارث; 14 الدوري عن الكسائي | المائدة 5:112 يستطيع, P047 |
| أبو جعفر | 15 ابن وردان; 16 ابن جماز | النحل 16:7 بشق, P119 |
| يعقوب | 17 رويس; 18 روح | الأنبياء 21:87 نقدر, P147 |
| خلف العاشر | 19 إسحاق; 20 إدريس | الفرقان 25:62 يذكر, P165 |

## Position ledger

`Pnnn` is a stable sample identifier, not a word number. Every stored form and its rawi list is reproduced verbatim. A repeated rawi in different forms is preserved rather than deduplicated. `Missing` means that the word has no stored position; it does not mean that the ayah itself is absent. The source column quotes the focal rule. All references use the edition above. Findings give the classification and the passage that proves the discrepancy. Route notes explain what remains inferred.

### Juz 3

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P001 | آل عمران 3:12 تغلبون. وتحشرون | `[3, 4]`; `سَتُغۡلَبُونَ وَتُحۡشَرُونَ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`سيغلبون ويحشرون` [11,12,13,14,19,20] | 2/238: «(واختلفوا) في: تغلبون. وتحشرون فقرأ حمزة والكسائي، وخلف بالغيب فيهما، وقرأ الباقون بالخطاب،» | Matched. Checked against the text. |
| P002 | آل عمران 3:13 ترونهم | `[13, 14]`; `كَافِرَةٞ يَرَوۡنَهُم` [3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`كافرة ترونهمُ` [1,2,15,16] | 2/238: «(واختلفوا) في: ترونهم فقرأ المدنيان ويعقوب بالخطاب، وقرأ الباقون بالغيب،» | F01: wrong reader. Checked against the text. |
| P003 | آل عمران 3:19 إن الدين | `[0, 1]`; `إِنَّ ٱلدِّينَ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`أَنّ الدين` [13,14] | 2/238: «(واختلفوا) في: إن الدين فقرأ الكسائي بفتح الهمزة، وقرأ الباقون بكسرها.» | Matched. Checked against the text. |
| P004 | آل عمران 3:21 ويقتلون الذين يأمرون | `[8, 9]`; `حَقّٖ وَيَقۡتُلُونَ` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18,19,20]<br>`حقٍ وّيُقاتِلون` [11,12] | 2/238–239: «(واختلفوا) في: ويقتلون الذين يأمرون فقرأ حمزة ويقاتلون بضم الياء وألف بعد القاف وكسر التاء من القتال، وقرأ الباقون بفتح الياء، وإسكان القاف وحذف الألف وضم التاء من (القتل) تقدم وليحكم لأبي جعفر في البقرة،» | Matched. Checked against the text. |
| P005 | آل عمران 3:36 وضعت | `[10, 10]`; `وَضَعَتۡ` [1,2,3,4,5,6,10,11,12,13,14,15,16,19,20]<br>`وَضَعْتُ` [7,8,9,17,18] | 2/239: «(واختلفوا) في: وضعت فقرأ ابن عامر ويعقوب وأبو بكر بإسكان العين وضم التاء، وقرأ الباقون بفتح العين، وإسكان التاء.» | Matched. Checked against the text. |
| P006 | آل عمران 3:37 وكفلها | `[7, 7]`; `وَكَفَّلَهَا` [9,10,11,12,13,14,19,20]<br>`وَكَفَلَهَا` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/239: «(واختلفوا) في: وكفلها فقرأ الكوفيون بتشديد الفاء، وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |
| P007 | آل عمران 3:37 زكريا | `[8, 9]`; `زَكَرِيَّاۖ كُلَّمَا` [2,7,8,10,11,12,13,14,19,20]<br>`زكريآءُ` [1,3,4,5,6,9,15,16,17,18] | 2/239: «(واختلفوا) في: زكريا فقرأ حمزة والكسائي وخلف وحفص بالقصر من غير همزة في جميع القرآن، وقرأ الباقون بالمد والهمز إلا أن أبا بكر نصبه هنا بعد كفلها على أنه مفعول ثاني لكفلها ورفعه الباقون ممن خفف.» | F02: wrong reader; wording. Checked against the text. |
| P008 | آل عمران 3:39 فنادته الملائكة | `[0, 0]`; `فَنَادَتۡهُ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`فنادَاه` [11,12,13,14,19,20] | 2/239: «(واختلفوا) في: فنادته الملائكة فقرأ حمزة والكسائي وخلف، فناداه بألف على الدال ممالة على أصلهم، وقرأ الباقون بتاء ساكنة بعدها،» | Matched. Checked against the text. |
| P009 | آل عمران 3:39 أن الله يبشرك بيحيى | `[7, 8]`; `أَنَّ ٱللَّهَ` [1,2,3,4,5,6,9,10,13,14,15,16,17,18,19,20]<br>`إِنَّ اللهَ` [7,8,11,12] | 2/239: «(واختلفوا) في: أن الله يبشرك بيحيى فقرأ ابن عامر وحمزة بكسر الهمزة، وقرأ الباقون بفتحها. (واتفقوا) على كسر همزة إن الله يبشرك بكلمة منه لأنه بعد صريح القول.» | Matched. Checked against the text. |
| P010 | آل عمران 3:48 ونعلمه | `[0, 0]`; `وَيُعَلِّمُهُ` [1,2,9,10,15,16,17,18]<br>`ونُعلمه` [3,4,5,6,7,8,11,12,13,14,19,20] | 2/240: «(واختلفوا) في: ونعلمه فقرأ المدنيان وعاصم ويعقوب بالياء، وقرأ الباقون بالنون.» | Matched. Checked against the text. |

### Juz 4

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P011 | آل عمران 3:97 حج | `[12, 12]`; `حِجُّ` [10,11,12,13,14,15,16,19,20]<br>`حَجّ` [1,2,3,4,5,6,7,8,9,17,18] | 2/241: «(واختلفوا) في: حج البيت فقرأ أبو جعفر وحمزة والكسائي وخلف وحفص بكسر الحاء، وقرأ الباقون بفتحها،» | Matched. Checked against the text. |
| P012 | آل عمران 3:115 وما تفعلوا من خير فلن تكفروه | `[1, 1]`; `يَفۡعَلُواْ` [10,11,12,13,14,19,20]<br>`تَفْعَلوا` [1,2,3,4,5,6,7,8,9,15,16,17,18] | 2/241: «(واختلفوا) في: وما تفعلوا من خير فلن تكفروه فقرأ حمزة والكسائي وخلف وحفص بالغيب فيها، واختلف عن الدوري عن أبي عمرو فيهما، فروى النهرواني وبكر بن شاذان عن زيد بن فرح عن الدوري بالغيب كذلك، وهي رواية عبد الوارث والعباس عن أبي عمرو، وطريق النقاش عن أبي الحارث عن السوسي. وروى أبو العباس المهدوي من طريق ابن مجاهد عن أبي الزعراء عن الدوري التخيير بين الغيب والخطاب على ذلك أكثر أصحاب اليزيدي عنه، وكلهم نص عنه أبي عمرو أنه قال: ما أبالي أبالتاء أم بالياء قرأتهما، إلا أن أبا حمدون وأبا عبد الرحمن قالا عنه وكان أبو عمرو يختار التاء. (قلت) : والوجهان صحيحان وردا من طريق المشارقة، والمغاربة قرأت بهما من الطريقين إلا أن الخطاب أكثر وأشهر …» | Route-sensitive: the text permits two forms for Duri; the stored address form is supported, but completeness within Shatibiyya is not certified here. |
| P013 | آل عمران 3:120 يضركم | `[13, 13]`; `يَضُرُّكُمۡ` [7,8,9,10,11,12,13,14,15,16,19,20]<br>`يَضِرْكُمُ` [1,2,3,4,5,6,17,18] | 2/242: «(واختلفوا) في: يضركم فقرأ ابن عامر، والكوفيون، وأبو جعفر بضم الضاد ورفع الراء وتشديدها، وقرأ الباقون بكسر الضاد وجزم الراء مخففة .» | Matched. Checked against the text. |
| P014 | آل عمران 3:124 منزلين | `[12, 12]`; `مُنزَلِينَ` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`مُنَزَّلين` [7,8] | 2/242: «(واختلفوا) في: منزلين فقرأ ابن عامر بتشديد الزاي، وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |
| P015 | آل عمران 3:125 مسومين | `[14, 14]`; `مُسَوِّمِينَ` [3,4,5,6,9,10,17,18]<br>`مُسَوَّمين` [1,2,7,8,11,12,13,14,15,16,19,20] | 2/242: «(واختلفوا) في: مسومين فقرأ ابن كثير، والبصريان، وعاصم بكسر الواو، وقرأ الباقون بفتحها» | Matched. Checked against the text. |
| P016 | آل عمران 3:133 وسارعوا | `[1, 2]`; `وَسَارِعُوٓاْ إِلَىٰ` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`سارعوا إلى` [1,2,7,8,15,16] | 2/242: «(واختلفوا) في: وسارعوا فقرأ المدنيان، وابن عامر سارعوا بغير واو قبل السين، وكذلك هي في مصحف المدينة والشام، وقرأ الباقون بالواو، وكذلك هي في مصاحفهم.» | Matched. Checked against the text. |
| P017 | آل عمران 3:140 قرح والقرح | `[2, 2]`; `قَرۡحٞ` [1,2,3,4,5,6,7,8,10,15,16,17,18]<br>`قُرْحٌ` [9,11,12,13,14,19,20] | 2/242: «(واختلفوا) في: قرح والقرح فقرأ حمزة والكسائي وخلف وأبو بكر بضم القاف من قرح في الموضعين و (أصابهم القرح) ، وقرأ الباقون بفتحها في الثلاثة.» | Matched. Checked against the text. |
| P019 | آل عمران 3:146 قاتل معه | `[3, 3]`; `قَٰتَلَ` [7,8,9,10,11,12,13,14,15,16,19,20]<br>`قُتِلَ` [1,2,3,4,5,6,17,18] | 2/242: «(واختلفوا) في: قاتل معه فقرأ نافع وابن كثير، والبصريان بضم القاف وكسر التاء من غير ألف، وقرأ الباقون بفتح القاف والتاء وألف بينهما،» | Matched. Checked against the text. |
| P018 | آل عمران 3:154 يغشى | `[8, 8]`; `يَغۡشَىٰ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`تَغْشَى` [11,12,13,14,19,20] | 2/242: «(واختلفوا) في: يغشى طائفة فقرأ حمزة، والكسائي، وخلف بالتأنيث، وقرأ الباقون بالتذكير،» | Matched. Checked against the text. |
| P020 | النساء 4:1 تساءلون | `[20, 20]`; `تَسَآءَلُونَ` [9,10,11,12,13,14,19,20]<br>`تسّآءلون` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/247: «(واختلفوا) في: تساءلون فقرأ الكوفيون بتخفيف السين، وقرأ الباقون بتشديدها.» | Matched. Checked against the text. |

### Juz 5

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P021 | النساء 4:24 وأحل لكم | `[11, 11]`; `وَأُحِلَّ` [10,11,12,13,14,15,16,19,20]<br>`وَأَحَلَّ` [1,2,3,4,5,6,7,8,9,17,18] | 2/249: «(واختلفوا) في: وأحل لكم فقرأ أبو جعفر وحمزة والكسائي وخلف وحفص بضم الهمزة وكسر الحاء، وقرأ الباقون بفتحهما.» | Matched. Checked against the text. |
| P022 | النساء 4:25 المحصنات ومحصنات | `[7, 7]`; `ٱلۡمُحۡصَنَٰتِ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`المحصِنات` [13,14] | 2/249: «(واختلفوا) في: المحصنات ومحصنات فقرأ الكسائي بكسر الصاد حيث وقع معرفا، ومنكرا إلا الحرف الأول من هذه السورة، وهو والمحصنات من النساء فإنه قرأه بفتح الصاد كالجماعة لأن معناه ذوات الأزواج، وكذلك قرأ الباقون في الجميع.» | Matched. Checked against the text. |
| P023 | النساء 4:25 محصنات | `[28, 29]`; `مُحۡصَنَٰتٍ غَيۡرَ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`محصِنات غير` [13,14] | 2/249: «(واختلفوا) في: المحصنات ومحصنات فقرأ الكسائي بكسر الصاد حيث وقع معرفا، ومنكرا إلا الحرف الأول من هذه السورة، وهو والمحصنات من النساء فإنه قرأه بفتح الصاد كالجماعة لأن معناه ذوات الأزواج، وكذلك قرأ الباقون في الجميع.» | Matched. Checked against the text. |
| P024 | النساء 4:25 أحصن | `[35, 35]`; `أُحۡصِنَّ` [1,2,3,4,5,6,7,8,10,15,16,17,18]<br>`أَحْصَنَّ` [9,11,12,13,14,19,20] | 2/249: «(واختلفوا) في: أحصن فقرأ حمزة والكسائي وخلف وأبو بكر بفتح الهمزة والصاد، وقرأ الباقون بضم الهمزة وكسر الصاد.» | Matched. Checked against the text. |
| P025 | النساء 4:29 تجارة عن تراض | `[11, 11]`; `تِجَٰرَةً` [9,10,11,12,13,14,19,20]<br>`تجارةٌ` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/249: «(واختلفوا) في: تجارة عن تراض فقرأ الكوفيون بنصب تجارة، وقرأ الباقون برفعها،» | Matched. Checked against the text. |
| P026 | النساء 4:31 مدخلا هنا والحج | `[10, 10]`; `مُّدۡخَلٗا` [3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`مَدخلا` [1,2,15,16] | 2/249: «(واختلفوا) في: مدخلا هنا والحج فقرأ المدنيان بفتح الميم فيهما، وقرأ الباقون بالضم،» | Matched. Checked against the text. |
| P027 | النساء 4:33 عاقدت | `[8, 9]`; `عَقَدَتۡ أَيۡمَٰنُكُمۡ` [9,10,11,12,13,14,19,20]<br>`عاقَدَتْ أيمانُكمْ` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/249: «(واختلفوا) في: (عاقدت) فقرأ الكوفيون بغير ألف، وقرأ الباقون بالألف.» | Matched. Checked against the text. |
| P028 | النساء 4:34 بما حفظ الله | `[19, 20]`; `حَفِظَ ٱللَّهُۚ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`حفظ اللهَ` [15,16] | 2/249: «(واختلفوا) في: بما حفظ الله فقرأ أبو جعفر بنصب الهاء، وقرأ الباقون برفعها ف (ما) على قراءة أبي جعفر موصولة، وفي حفظ ضمير يعود عليه مرفوع أي بالبر الذي حفظ حق الله من التعفف، وغيره وقيل بما حفظ دين الله وتقدير المضاف متعين لأن الذات المقدسة لا ينسب حفظها إلى أحد.» | Matched. Checked against the text. |
| P029 | النساء 4:40 حسنة | `[8, 9]`; `حَسَنَةٗ يُضَٰعِفۡهَا` [5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`حسنةٌ يَضَاعِفْها` [1,2]<br>`حسنةٌ يُضَعِّفْها` [3,4,15,16] | 2/249: «(واختلفوا) في: حسنة فقرأ المدنيان، وابن كثير برفعها، وقرأ الباقون بنصبها.» | F03: wrong reader. Checked against the text. |
| P030 | النساء 4:42 تسوى | `[7, 7]`; `تُسَوَّىٰ` [3,4,5,6,9,10,17,18]<br>`تَسَوَّى` [11,12,13,14,19,20]<br>`تَسَّوَّى` [1,2,7,8,15,16] | 2/249: «(واختلفوا) في: تسوى فقرأ حمزة والكسائي، وخلف بفتح التاء وتخفيف السين. وقرأ المدنيان وابن عامر بفتح التاء وتشديد السين، وقرأ الباقون بضم التاء وتخفيف السين، وهم على أصولهم في الفتح والإمالة وبين بين،» | Matched. Checked against the text. |

### Juz 6

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P031 | النساء 4:152 سوف يؤتيهم | `[11, 11]`; `يُؤۡتِيهِمۡ` [10]<br>`نؤتيهِمْ` [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/253: «(واختلفوا) في: سوف يؤتيهم، فروى حفص بالياء، وقرأ الباقون بالنون.» | Matched. Checked against the text. |
| P032 | النساء 4:162 سنؤتيهم أجرا | `[23, 24]`; `سَنُؤۡتِيهِمۡ أَجۡرًا` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18]<br>`سيؤتيهِمْ` [11,12,19,20] | 2/253: «(واختلفوا) في: سنؤتيهم أجرا فقرأ حمزة وخلف بالياء، وقرأ الباقون بالنون.» | Matched. Checked against the text. |
| P033 | النساء 4:164 زبورا هنا، وفي سبحان والزبور في الأنبياء | `[0, 0]`; `زَبُورٗا وَرُسُلٗا` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18]<br>`زُبورا` [11,12,19,20] | 2/253: «(واختلفوا) في: زبورا هنا، وفي سبحان والزبور في الأنبياء فقرأ حمزة وخلف بضم الزاي، وقرأ الباقون بفتحها والله المستعان.» | F04: wording. Checked against the text. |
| P034 | المائدة 5:2 رضوانا | `[22, 23]`; `وَرِضۡوَٰنٗاۚ وَإِذَا` [1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20]<br>`ورُضوانا وإذا` [9] | 2/238: «(واختلفوا) في: رضوان حيث رفع، فروى أبو بكر بضم الراء إلا الموضع الثاني من المائدة، وهو من اتبع رضوانه فكسر الراء فيه من طريق العليمي. واختلف فيه عن يحيى بن آدم عنه، فروى أبو عون الواسطي ضمه عن شعيب عنه كسائر نظائره، وكذلك روى الخبازي والخزاعي عن الشذائي عن نفطويه عن شعيب أيضا. (قلت) : والروايتان صحيحتان عن يحيى، وعن أبي بكر أيضا، فروى الضم فيه كأخواته عن يحيى خلف ومحمد بن المنذر، وهي رواية الكسائي والأعشى وابن أبي حماد كلهم عن أبي بكر، وروى الكسر فيه خاصة عن يحيى: الوكيعي والرفاعي وأبو حمدون، وهي رواية العليمي والبرجي وابن أبي أمية وعبيد بن نعيم كلهم عن أبي بكر …» | Matched. Checked against the text. |
| P295 | المائدة 5:2 شنآن | `[28, 28]`; Missing | 2/253: «واختلفوا في شنآن قوم في الموضعين من هذه السورة فقرأ ابن عامر وأبو بكر وابن وردان بإسكان النون واختلف عن ابن جماز.» | F05: missing reading. Checked against the text. |
| P035 | المائدة 5:6 وأرجلكم | `[14, 15]`; `وَأَرۡجُلَكُمۡ إِلَى` [1,2,7,8,10,13,14,17,18]<br>`وأرجلِكمْ إلى` [3,4,5,6,9,11,12,15,16,19,20] | 2/254: «(واختلفوا) في: وأرجلكم فقرأ نافع وابن عامر والكسائي ويعقوب وحفص بنصب اللام، وقرأ الباقون بالخفض.» | Matched. Checked against the text. |
| P296 | المائدة 5:8 شنآن | `[10, 10]`; Missing | 2/253: «واختلفوا في شنآن قوم في الموضعين من هذه السورة فقرأ ابن عامر وأبو بكر وابن وردان بإسكان النون واختلف عن ابن جماز.» | F06: missing reading. Checked against the text. |
| P036 | المائدة 5:13 قاسية | `[6, 7]`; `قَٰسِيَةٗۖ يُحَرِّفُونَ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18,19,20]<br>`قَسِيَّةً يحرفون` [11,12,13,14] | 2/254: «(واختلفوا) في: قاسية فقرأ حمزة والكسائي بتشديد الياء من غير ألف، وقرأ الباقون بالألف وتخفيف الياء،» | Matched. Checked against the text. |
| P037 | المائدة 5:45 العين والأنف والأذن والسن والجروح | `[8, 8]`; `وَٱلۡأَنفَ` [1,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`والأنفُ` [13,14]<br>`واَلانفَ` [2] | 2/254: «(واختلفوا) في: (العين والأنف والأذن والسن والجروح) فقرأ الكسائي بالرفع في الخمسة، وافقه في " الجروح " خاصة ابن كثير وأبو عمرو وأبو جعفر وابن عامر، وقرأ الباقون بالنصب.» | Matched. Checked against the text. |
| P038 | المائدة 5:47 وليحكم | `[0, 1]`; `وَلۡيَحۡكُمۡ أَهۡلُ` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18,19,20]<br>`وَلِيَحْكُمَ` [11,12] | 2/254: «(واختلفوا) في: وليحكم فقرأ حمزة بكسر اللام، ونصب الميم، وقرأ الباقون بإسكان اللام والميم على أصولهم في النقل والسكت والتحقيق.» | Matched. Checked against the text. |
| P039 | المائدة 5:50 يبغون | `[2, 2]`; `يَبۡغُونَۚ` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`تَبغون` [7,8] | 2/254: «(واختلفوا) في: يبغون فقرأ ابن عامر بالخطاب، وقرأ الباقون بالغيب.» | Matched. Checked against the text. |
| P040 | المائدة 5:53 ويقول الذين | `[0, 0]`; `وَيَقُولُ` [9,10,11,12,13,14,19,20]<br>`ويقولَ` [5,6,17,18]<br>`يقولُ` [1,2,3,4,7,8,15,16] | 2/254: «(واختلفوا) في: ويقول الذين فقرأ المدنيان، وابن كثير وابن عامر يقول بغير واو كما هو في مصاحفهم، وقرأ الباقون ويقول بالواو، وكذا هو في مصاحفهم، وقرأ منهم البصريان بنصب اللام. وقرأ الباقون من القراء بالرفع.» | Matched. Checked against the text. |

### Juz 7

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P041 | المائدة 5:89 عقدتم | `[9, 9]`; `عَقَّدتُّمُ` [1,2,3,4,5,6,7,10,15,16,17,18]<br>`عَاقَدتُمْ` [8]<br>`عَقَدتُّمُ` [9,11,12,13,14,19,20] | 2/255: «(واختلفوا) في: عقدتم فقرأ حمزة والكسائي وخلف وأبو بكر (عقدتم) بالقصر والتخفيف، ورواه ابن ذكوان كذلك إلا أنه بالألف، وقرأ الباقون بالتشديد من غير ألف.» | Matched. Checked against the text. |
| P042 | المائدة 5:95 فجزاء مثل | `[12, 13]`; `فَجَزَآءٞ مِّثۡلُ` [9,10,11,12,13,14,17,18,19,20]<br>`فجزآءُ مثلِ` [1,2,3,4,5,6,7,8,15,16] | 2/255: «(واختلفوا) في: فجزاء مثل فقرأ الكوفيون ويعقوب فجزاء - بالتنوين - مثل برفع اللام، وقرأ الباقون بغير تنوين وخفض اللام.» | Matched. Checked against the text. |
| P043 | المائدة 5:95 كفارة طعام | `[27, 29]`; `كَفَّٰرَةٞ طَعَامُ مَسَٰكِينَ` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`كفارةُ طعامِ` [1,2,7,8,15,16] | 2/255: «(واختلفوا) في: كفارة طعام فقرأ المدنيان، وابن عامر كفارة بغير تنوين طعام بالخفض على الإضافة، والباقون بالتنوين ورفع " طعام ". (واتفقوا) على: مساكين هنا أنه بالجمع لأنه لا يطعم في قتل الصيد مسكين واحد، بل جماعة مساكين، وإنما اختلف في الذي في البقرة لأن التوحيد يراد به عن كل يوم والجمع يراد به عن أيام كثيرة.» | Matched. Checked against the text. |
| P044 | المائدة 5:107 " استحق " | `[4, 4]`; `ٱسۡتَحَقَّآ` [10]<br>`استُحِقَ` [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/256: «(واختلفوا) في: " استحق "، فروى حفص بفتح التاء والحاء، وإذا ابتدأ كسر همزة الوصل، وقرأ الباقون بضم التاء وكسر الحاء، وإذا ابتدءوا ضموا الهمزة.» | F07: wording. Checked against the text. |
| P045 | المائدة 5:107 الأوليان | `[13, 13]`; `ٱلۡأَوۡلَيَٰنِ` [1,2,3,4,5,6,7,8,10,13,14,15,16]<br>`الأَوَّلِينَ` [9,11,12,17,18,19,20] | 2/256: «(واختلفوا) في: الأوليان فقرأ حمزة وخلف ويعقوب وأبو بكر " الأولين " بتشديد الواو وكسر اللام بعدها وفتح النون على الجمع، وقرأ الباقون بإسكان الواو وفتح اللام وكسر النون على التثنية،» | Matched. Checked against the text. |
| P046 | المائدة 5:110 إلا سحر مبين هنا، وفي أول يونس، وفي هود والصف | `[61, 61]`; `سِحۡرٞ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`سَاحِرٌ` [11,12,13,14,19,20] | 2/256: «(واختلفوا) في: إلا سحر مبين هنا، وفي أول يونس، وفي هود والصف فقرأ حمزة والكسائي وخلف، ساحر بألف بعد السين وكسر الحاء في الأربعة وافقهم ابن كثير وعاصم، في يونس، وقرأ الباقون بكسر السين، وإسكان الحاء من غير ألف في الأربعة.» | Matched. Checked against the text. |
| P047 | المائدة 5:112 هل يستطيع ربك | `[6, 8]`; `هَلۡ يَسۡتَطِيعُ رَبُّكَ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`هَلْ تَّسْتَطِيعُ ربَّك` [13,14] | 2/256: «(واختلفوا) في: هل يستطيع ربك فقرأ الكسائي (تستطيع) بالخطاب (ربك) بالنصب، وهو على أصله في إدغام اللام في التاء، وقرأ الباقون بالغيب وبالرفع.» | Matched. Checked against the text. |
| P048 | المائدة 5:115 منزلها | `[3, 3]`; `مُنَزِّلُهَا` [1,2,7,8,9,10,15,16]<br>`مُنْزِلُها` [3,4,5,6,11,12,13,14,17,18,19,20] | 2/256: «(واختلفوا) في: منزلها فقرأ المدنيان، وابن عامر، وعاصم بالتشديد، وقرأ الباقون بالتخفيف.» | Matched. Checked against the text. |
| P049 | المائدة 5:119 هذا يوم | `[3, 3]`; `يَوۡمُ` [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`يومَ` [1,2] | 2/256: «(واختلفوا) في: هذا يوم فقرأ نافع بالنصب، وقرأ الباقون بالرفع.» | Matched. Checked against the text. |
| P050 | الأنعام 6:16 من يصرف | `[0, 1]`; `مَّن يُصۡرَفۡ` [1,2,3,4,5,6,7,8,10,15,16]<br>`من يَصْرِف` [9,11,12,13,14,17,18,19,20] | 2/256: «(واختلفوا) في: من يصرف فقرأ حمزة والكسائي وخلف ويعقوب وأبو بكر (يصرف) بفتح الياء وكسر الراء، وقرأ الباقون بضم الياء وفتح الراء،» | Matched. Checked against the text. |

### Juz 8

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P051 | الأنعام 6:111 قبلا ما | `[12, 12]`; `قُبُلٗا` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`قِبَلا` [1,2,7,8,15,16] | 2/261: «(واختلفوا) في: قبلا ما فقرأ المدنيان، وابن عامر بكسر القاف وفتح الباء، وقرأ الباقون بضمهما ونذكر حرف الكهف في موضعه - إن شاء الله تعالى -.» | Matched. Checked against the text. |
| P052 | الأنعام 6:114 منزل من ربك | `[15, 15]`; `مُنَزَّلٞ` [7,8,10]<br>`مُنْزَلٌ` [1,2,3,4,5,6,9,11,12,13,14,15,16,17,18,19,20] | 2/262: «(واختلفوا) في: منزل من ربك فقرأ ابن عامر وحفص بتشديد الزاي، وقرأ الباقون بالتخفيف.» | Matched. Checked against the text. |
| P053 | الأنعام 6:115 " كلمات ربك " هنا، وفي يونس وغافر | `[1, 1]`; `كَلِمَتُ` [9,10,11,12,13,14,17,18,19,20]<br>`كَلِمَاتُ` [1,2,3,4,5,6,7,8,15,16] | 2/262: «(واختلفوا) في: " كلمات ربك " هنا، وفي يونس وغافر فقرأ الكوفيون، ويعقوب بغير ألف على التوحيد في الثلاثة، وافقهم ابن كثير وأبو عمرو في يونس وغافر، وقرأ الباقون بألف على الجمع فيهن، ومن أفرد فهو على أصله في الوقف بالتاء والهاء والإمالة كما تقدم.» | Matched. Checked against the text. |
| P054 | الأنعام 6:119 فصل لكم | `[10, 11]`; `فَصَّلَ لَكُم` [1,2,9,10,11,12,13,14,15,16,17,18,19,20]<br>`فُصِّلَ لكمْ` [3,4,5,6,7,8] | 2/262: «(واختلفوا) في: فصل لكم فقرأ المدنيان، والكوفيون ويعقوب بفتح الفاء والصاد، وقرأ الباقون بضم الفاء وكسر الصاد» | Matched. Checked against the text. |
| P055 | الأنعام 6:119 حرم عليكم | `[13, 13]`; `حَرَّمَ` [1,2,10,15,16,17,18]<br>`حُرِّم` [3,4,5,6,7,8,9,11,12,13,14,19,20] | 2/262: «(واختلفوا) في: حرم عليكم فقرأ المدنيان ويعقوب وحفص بفتح الحاء والراء، وقرأ الباقون بضم الحاء وكسر الراء،» | Matched. Checked against the text. |
| P056 | الأنعام 6:119 ليضلون هنا وليضلوا في يونس | `[21, 21]`; `لَّيُضِلُّونَ` [9,10,11,12,13,14,19,20]<br>`ليَضلون` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/262: «(واختلفوا) في: ليضلون هنا وليضلوا في يونس فقرأ الكوفيون بضم الياء فيهما، وقرأ الباقون بفتحها منهما.» | Matched. Checked against the text. |
| P057 | الأنعام 6:124 رسالته | `[16, 17]`; `يَجۡعَلُ رِسَالَتَهُۥۗ` [3,4,10]<br>`يجعلُ رسالاتِهِ` [1,2,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/262: «(واختلفوا) في: رسالته فقرأ ابن كثير وحفص رسالته بحذف الألف بعد اللام، ونصب التاء على التوحيد، وقرأ الباقون بالألف وكسر التاء على الجمع.» | Matched. Checked against the text. |
| P058 | الأنعام 6:125 ضيقا هنا، والفرقان | `[14, 14]`; `ضَيِّقًا` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`ضَيْقا` [3,4] | 2/262: «(واختلفوا) في: ضيقا هنا، والفرقان فقرأ ابن كثير بإسكان الياء مخففة، وقرأ الباقون بكسرها مشددة.» | Matched. Checked against the text. |
| P059 | الأنعام 6:125 حرجا | `[15, 15]`; `حَرَجٗا` [3,4,5,6,7,8,10,11,12,13,14,17,18,19,20]<br>`حَرِجًا` [1,2,9,15,16] | 2/262: «(واختلفوا) في: حرجا فقرأ المدنيان، وأبو بكر بكسر الراء، وقرأ الباقون بفتحها.» | Matched. Checked against the text. |
| P060 | الأعراف 7:3 قليلا ما تذكرون | `[13, 13]`; `تَذَكَّرُونَ` [10,11,12,13,14,19,20]<br>`تَذَّكَّرون` [1,2,3,4,5,6,9,15,16,17,18]<br>`يتذكرون` [7,8] | 2/267: «(واختلفوا) في: قليلا ما تذكرون فقرأ ابن عامر (يتذكرون) بياء قبل التاء، وكذا هو في مصاحف أهل الشام مع تخفيف الذال، وقرأ الباقون بتاء واحدة من غير ياء قبلها كما هي في مصاحفهم. وحمزة والكسائي وخلف وحفص على أصلهم في تخفيف الذال،» | Matched. Checked against the text. |

### Juz 9

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P062 | الأعراف 7:112 بكل ساحر هنا، وفي يونس | `[2, 2]`; `سَٰحِرٍ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`سَحَّارٍ` [11,12,13,14,19,20] | 2/270: «(واختلفوا) في: بكل ساحر هنا، وفي يونس فقرأ حمزة والكسائي وخلف، سحار على وزن فعال بتشديد الحاء وألف بعدها في الموضعين، وهم على أصولهم في الفتح والإمالة كما تقدم في بابها، وقرأ الباقون في السورتين ساحر على وزن فاعل والألف قبل الحاء. (واتفقوا) على حرف الشعراء أنه سحار لأنه جواب لقول فرعون فيما استشارهم فيه من أمر موسى بعد قوله إن هذا لساحر عليم فأجابوه بما هو أبلغ من قوله رعاية لمراده بخلاف التي في الأعراف فإن ذلك جواب لقولهم فتناسب اللفظان، وأما التي في يونس فهي أيضا جواب من فرعون لهم حيث قالوا: إن هذا لساحر مبين فرفع مقامه عن المبالغة - والله أعلم -.» | Matched. Checked against the text. |
| P064 | الأعراف 7:114 نعم | `[1, 1]`; `نَعَمۡ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`نَعِمْ` [13,14] | 2/269: «(واختلفوا) في: نعم حيث وقع، وهو في الموضعين من هذه السورة، وفي الشعراء، والصافات فقرأ الكسائي بكسر العين منها، وقرأ الباقون بفتحها في الأربعة،» | Matched. Checked against the text. |
| P065 | الأعراف 7:117 تلقف ما هنا وطه والشعراء | `[8, 9]`; `هِيَ تَلۡقَفُ` [10]<br>`هِىَ تَلَقَّفُ` [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/271: «(واختلف) في: تلقف ما هنا وطه والشعراء، فروى حفص بتخفيف القاف في الثلاثة، وقرأ الباقون بتشديدها فيهن،» | Matched. Checked against the text. |
| P066 | الأعراف 7:127 سنقتل | `[14, 14]`; `سَنُقَتِّلُ` [5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`سَنَقْتُلُ` [1,2,3,4,15,16] | 2/271: «(واختلفوا) في: سنقتل فقرأ المدنيان، وابن كثير بفتح النون، وإسكان القاف وضم التاء من غير تشديد، وقرأ الباقون بضم النون وفتح القاف وكسر التاء وتشديدها.» | Matched. Checked against the text. |
| P067 | الأعراف 7:137 يعرشون هنا والنحل | `[28, 28]`; `يَعۡرِشُونَ` [1,2,3,4,5,6,10,11,12,13,14,15,16,17,18,19,20]<br>`يَعْرُشُونَ` [7,8,9] | 2/271: «(واختلفوا) في: يعرشون هنا والنحل، فقرأ ابن عامر وأبو بكر بضم الراء فيهما، وقرأ الباقون بكسرها منهما.» | Matched. Checked against the text. |
| P068 | الأعراف 7:138 يعكفون | `[6, 7]`; `قَوۡمٖ يَعۡكُفُونَ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`قَوْمٍ يَعْكِفون` [11,12,13,14,19,20] | 2/271: «(واختلفوا) في: يعكفون فقرأ حمزة والكسائي والوراق عن خلف بكسر الكاف، واختلف عن إدريس، فروى عنه المطوعي وابن مقسم والقطيعي بكسرها، وروى عنه الشطي بضمها، وكذلك قرأ الباقون.» | Inferred scope match: Idris has a damma route in al-Nashr; no missing reading is asserted from it. |
| P069 | الأعراف 7:141 وإذ أنجيناكم | `[1, 1]`; `أَنجَيۡنَٰكُم` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`أَنْجَاكُمْ` [7,8] | 2/271: «(واختلفوا) في: وإذ أنجيناكم فقرأ ابن عامر بألف بعد الجيم من غير ياء، ولا نون، وكذلك هو في مصاحف أهل الشام، وقرأ الباقون بياء ونون وألف بعدها، وكذلك هو في مصاحفهم والعجب أن ابن مجاهد لم يذكر هذا الحرف في كتابه السبعة.» | Matched. Checked against the text. |
| P063 | الأعراف 7:146 الرشد | `[19, 19]`; `ٱلرُّشۡدِ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`الرَّشَدِ` [11,12,13,14,19,20] | 2/272: «(واختلفوا) في: سبيل الرشد فقرأ حمزة والكسائي، وخلف بفتح الراء والشين، وقرأ الباقون بضم الراء، وإسكان الشين.» | Matched. Checked against the text. |
| P061 | الأعراف 7:149 يرحمنا | `[11, 12]`; `يَرۡحَمۡنَا رَبُّنَا` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`تَرْحَمْنَا رَبَّنَا` [11,12,13,14,19,20] | 2/272: «(واختلفوا) في: لئن لم يرحمنا ربنا ويغفر لنا فقرأ حمزة والكسائي وخلف بالخطاب فيهما، ونصب الباء من " ربنا "، وقرأ الباقون بالغيب فيهما ورفع الباء.» | Matched. Checked against the text. |
| P070 | الأنفال 8:9 مردفين | `[10, 10]`; `مُرۡدِفِينَ` [3,4,5,6,7,8,9,10,11,12,13,14,19,20]<br>`مُرْدَفِينَ` [1,2,15,16,17,18] | 2/275: «(واختلفوا) في: مردفين فقرأ المدنيان ويعقوب بفتح الدال وما روي عن ابن مجاهد عن قنبل في ذلك فليس بصحيح عن ابن مجاهد لأنه نص في كتابه على أنه قرأ به على قنبل قال: وهو وهم، وكان يقرأ له ويقرئ بكسر الدال. قال الداني: وكذلك قرأت من طريقه، وطريق غيره عن قنبل، وعلى ذلك أهل الأداء (قلت) : وبذلك قرأ الباقون.» | Matched. Checked against the text. |

### Juz 10

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P071 | الأنفال 8:42 بالعدوة في الموضعين | `[2, 2]`; `بِٱلۡعُدۡوَةِ` [1,2,7,8,9,10,11,12,13,14,15,16,19,20]<br>`بِالْعِدْوَةِ` [3,4,5,6,17,18] | 2/276: «(واختلفوا) في: بالعدوة في الموضعين فقرأ ابن كثير، والبصريان بكسر العين فيهما، وقرأ الباقون بضم فيهما.» | Matched. Checked against the text. |
| P072 | الأنفال 8:50 إذ يتوفى | `[2, 3]`; `إِذۡ يَتَوَفَّى` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`إِذ تَّتَوَفَّى` [7,8] | 2/277: «(واختلفوا) في: إذ يتوفى فقرأ ابن عامر بالتاء على التأنيث، وهشام، على أصله في إدغام الذال في التاء، وقرأ الباقون بالياء على التذكير.» | Matched. Checked against the text. |
| P073 | الأنفال 8:59 ولا يحسبن الذين كفروا هنا والنور | `[0, 1]`; `وَلَا يَحۡسَبَنَّ` [7,8,10,11,12,15,16]<br>`تَحْسَبَنَّ` [9]<br>`تَحْسِبَنَّ` [1,2,3,4,5,6,13,14,17,18,19,20] | 2/277: «(واختلفوا) في: ولا يحسبن الذين كفروا هنا والنور فقرأ ابن عامر وحمزة بالغيب فيهما، ووافقهما أبو جعفر وحفص هنا، واختلف عن إدريس عن خلف، فروى الشطي عنه كذلك فيهما، ورواهما عنه المطوعي وابن مقسم والقطيعي وابن هاشم بالخطاب، وكذلك قرأ الباقون فيهما.» | Inferred scope match: Idris has a Shatti third-person route; no missing reading is asserted from it. |
| P074 | الأنفال 8:59 إنهم لا يعجزون | `[5, 6]`; `إِنَّهُمۡ لَا` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`أَنَّهُمْ` [7,8] | 2/277: «(واختلفوا) في: إنهم لا يعجزون فقرأ ابن عامر بفتح الهمزة، وقرأ الباقون بكسرها.» | Matched. Checked against the text. |
| P075 | الأنفال 8:60 ترهبون | `[9, 9]`; `تُرۡهِبُونَ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20]<br>`تُرَهِّبُونَ` [17] | 2/277: «(واختلفوا) في: ترهبون، فروى رويس بتشديد الهاء، وقرأ الباقون بتخفيفها،» | Matched. Checked against the text. |
| P076 | الأنفال 8:65 يكن | `[13, 14]`; `وَإِن يَكُن` [5,6,9,10,11,12,13,14,17,18,19,20]<br>`وَإِن تَكُن` [1,2,3,4,7,8,15,16] | 2/277: «(واختلفوا) في: وإن يكن منكم مائة يغلبوا فقرأ الكوفيون، والبصريان بالياء على التذكير، وقرأ الباقون بالتاء على التأنيث.» | Matched. Checked against the text. |
| P077 | الأنفال 8:66 أن فيكم ضعفا | `[7, 7]`; `ضَعۡفٗاۚ` [9,10,11,12,19,20]<br>`ضُعَفآءَ` [15,16]<br>`ضُعْفاً` [1,2,3,4,5,6,7,8,13,14,17,18] | 2/277: «(واختلفوا) في: أن فيكم ضعفا فقرأ عاصم وحمزة وخلف بفتح الضاد، وقرأ الباقون بضمها، وقرأ أبو جعفر بفتح العين والمد والهمز مفتوحة نصبا، ولا يصح ما روي عن الهاشمي من ضم الهمزة، وقرأ الباقون بإسكان العين منونا من غير مد، ولا همز.» | Matched. Checked against the text. |
| P078 | الأنفال 8:66 يكن | `[8, 9]`; `فَإِن يَكُن` [9,10,11,12,13,14,19,20]<br>`فَإِن تَكُن` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/277: «(واختلفوا) في: فإن يكن منكم مائة صابرة فقرأ الكوفيون بالياء على التذكير، وقرأ الباقون بالتاء على التأنيث.» | Matched. Checked against the text. |
| P079 | الأنفال 8:67 أن يكون له | `[3, 4]`; `أَن يَكُونَ` [1,2,3,4,7,8,9,10,11,12,13,14,19,20]<br>`أَن تكُونَ` [5,6,15,16,17,18] | 2/277: «(واختلفوا) في: أن يكون له فقرأ البصريان بالتاء مؤنثا، وقرأ الباقون بالياء مذكرا.» | F08: wrong reader. Checked against the text. |
| P080 | التوبة 9:12 لا أيمان لهم | `[14, 14]`; `أَيۡمَٰنَ` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`إِيمَانَ` [7,8] | 2/278: «(واختلفوا) في: لا أيمان لهم فقرأ ابن عامر بكسر الهمزة على أنه مصدره، وقرأ الباقون على أنه جمع. وانفرد ابن العلاف عن النخاس عن رويس في ويتوب الله بنصب الباء على أنه جواب الأمر من حيث إنه دخل فيه من جهة المعنى; قال ابن عطية: يعني أن قتل الكفار والجهاد في سبيل الله توبة لكم أيها المؤمنون; وقال غيره: يحتمل أن يكون ذلك بالنسبة إلى الكفار لأن قتال الكفار وغلبة المسلمين عليهم ينشأ عنها إسلام كثير من الناس، وهي رواية روح بن قرة وفهد بن الصقر كلاهما عن يعقوب، ورواية يونس عن أبي عمرو، وقراءة زيد بن علي واختيار الزعفراني» | Matched. Checked against the text. |

### Juz 11

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P081 | التوبة 9:98 دائرة السوء هنا والفتح | `[12, 12]`; `ٱلسَّوۡءِۗ` [1,2,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`السُّوءِ` [3,4,5,6] | 2/280: «(واختلفوا) في: دائرة السوء هنا والفتح فقرأ ابن كثير وأبو عمرو بضم السين في الموضعين، وقرأ الباقون بفتحها فيهما وورش من طريق الأزرق على أصله في مد الواو. (واتفقوا) على فتح السين في قوله تعالى: ما كان أبوك امرأ سوء، وأمطرت مطر السوء، والظانين بالله ظن السوء لأن المراد به المصدر، وصف به للمبالغة كما تقول هو رجل سوء في ضد قولك رجل صدق. (واتفقوا) على ضمها في قوله تعالى: وما مسني السوء. وإن النفس لأمارة بالسوء. وإن أراد بكم سوءا لأن المراد به المكروه والبلاء، ولما صلح كل من ذلك في الموضعين المذكورين اختلف فيهما - والله أعلم -.» | Matched. Checked against the text. |
| P082 | التوبة 9:100 والأنصار والذين اتبعوهم | `[4, 4]`; `وَٱلۡأَنصَارِ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`وَالأَنصَارُ` [17,18] | 2/280: «(واختلفوا) في: (والأنصار والذين اتبعوهم) فقرأ يعقوب برفع الراء، وقرأ الباقون بخفضها.» | Matched. Checked against the text. |
| P083 | التوبة 9:100 تجري تحتها، وهو الموضع الأخير | `[16, 17]`; `تَجۡرِي تَحۡتَهَا` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`تَجْرِى مِن تَحْتِهَا` [3,4] | 2/280: «(واختلفوا) في: تجري تحتها، وهو الموضع الأخير فقرأ ابن كثير بزيادة كلمة " من " وخفض تاء (تحتها) ، وكذلك هي في المصاحف المكية، وقرأ الباقون بحذف لفظ " من " وفتح التاء، وكذلك هي في مصاحفهم. (واتفقوا) على إثبات " من " قبل " تحتها " في سائر القرآن فيحتمل أنه إنما لم يكتب " من " في هذا الموضع لأن المعنى: ينبع الماء من تحت أشجارها، لا أنه يأتي من موضع وتجري من تحت هذه الأشجار، وأما في سائر القرآن فالمعنى أنها تأتي من موضع وتجري من تحت هذه الأشجار، وأما في سائر القرآن فالمعنى أنها تأتي من موضع وتجري تحت هذه الأشجار، المعنى خولف في الخط …» | Matched. Checked against the text. |
| P084 | التوبة 9:109 أسس بنيانه في الموضعين | `[0, 2]`; `أَفَمَنۡ أَسَّسَ بُنۡيَٰنَهُۥ` [3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`أَفَمَنْ أُسِّسَ بُنْيَانُهُ` [1,7,8]<br>`أَفَمَنُ سِّسَ بُنْيَانُهُ` [2] | 2/281: «(واختلفوا) في: أسس بنيانه في الموضعين فقرأ نافع وابن عامر بضم الهمزة وكسر السين ورفع النون فيهما وقرأ الباقون بفتح الهمزة والسين، ونصب النون منهما،» | Matched. Checked against the text. |
| P085 | التوبة 9:110 إلا أن | `[8, 9]`; `إِلَّآ أَن` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`إِلَى أَن` [17,18] | 2/281: «(واختلفوا) في: إلا أن فقرأ يعقوب بتخفيف اللام فجعله حرف جر، وقرأ الباقون بتشديدها على أنه حرف استثناء.» | Matched. Checked against the text. |
| P086 | التوبة 9:110 تقطع | `[10, 10]`; `تَقَطَّعَ` [7,8,10,11,12,15,16,17,18]<br>`تُقَطَّعَ` [1,2,3,4,5,6,9,13,14,19,20] | 2/281: «(واختلفوا) في: تقطع فقرأ أبو جعفر وابن عامر ويعقوب وحمزة وحفص بفتح التاء، وقرأ الباقون بضمها،» | Matched. Checked against the text. |
| P087 | التوبة 9:117 كاد يزيغ | `[15, 16]`; `كَادَ يَزِيغُ` [10,11,12]<br>`كادَ تَزيغُ` [1,2,3,4,5,6,7,8,9,13,14,15,16,17,18,19,20] | 2/281: «(واختلفوا) في: كاد يزيغ فقرأ حمزة وحفص بالياء على التذكير، وقرأ الباقون بالتاء على التأنيث،» | Matched. Checked against the text. |
| P088 | التوبة 9:126 أولا يرون | `[1, 1]`; `يَرَوۡنَ` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,19,20]<br>`تَرَوْنَ` [11,12,17,18] | 2/281: «(واختلفوا) في: أولا يرون فقرأ حمزة ويعقوب بالخطاب، وقرأ الباقون بالغيب.» | Matched. Checked against the text. |
| P089 | يونس 10:4 حقا إنه | `[6, 7]`; `إِنَّهُۥ يَبۡدَؤُاْ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`أَنَّهُ` [15,16] | 2/282: «(واختلفوا) في: حقا إنه فقرأ أبو جعفر بفتح الهمزة، وقرأ الباقون بكسرها،» | Matched. Checked against the text. |
| P090 | يونس 10:22 يسيركم | `[2, 2]`; `يُسَيِّرُكُمۡ` [1,2,3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`يَنشُرُكُمْ` [7,8,15,16] | 2/282: «(واختلفوا) في: يسيركم في البر فقرأ أبو جعفر وابن عامر بفتح الياء ونون ساكنة بعدها وشين معجمة مضمومة من النشر، وكذلك هي في أهل مصاحف أهل الشام، وغيرها. وقرأ الباقون بضم الياء وسين مهملة مفتوحة بعدها ياء مكسورة مشددة من التيسير، وكذلك هي في مصاحفهم» | Matched. Checked against the text. |

### Juz 12

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P091 | هود 11:25 إني لكم نذير في قصة نوح | `[5, 6]`; `إِنِّي لَكُمۡ` [1,2,7,8,9,10,11,12]<br>`أَنِّى` [3,4,5,6,13,14,15,16,17,18,19,20] | 2/288: «(واختلفوا) في: إني لكم نذير في قصة نوح فقرأ نافع وابن عامر وعاصم وحمزة بكسر الهمزة، والباقون بفتحها،» | Matched. Checked against the text. |
| P092 | هود 11:28 فعميت عليكم | `[13, 13]`; `فَعُمِّيَتۡ` [10,11,12,13,14,19,20]<br>`فَعَمِيَتْ` [1,2,3,4,5,6,7,8,9,15,16,17,18] | 2/288: «(واختلفوا) في: فعميت عليكم فقرأ حمزة والكسائي وخلف وحفص بضم العينين وتشديد الميم، وقرأ الباقون بفتح العين وتخفيف الميم. (واتفقوا) على الفتح والتخفيف من قوله تعالى في القصص فعميت عليهم الأنباء لأنها في أمر الآخرة، ففرقوا بينها وبين أمر الدنيا، فإن الشبهات تزول في الآخرة، والمعنى ضلت عنهم حجتهم وخفيت محجتهم - والله أعلم -.» | Matched. Checked against the text. |
| P093 | هود 11:41 مجراها | `[6, 6]`; `مَجۡر۪ىٰهَا` [10,11,12,13,14,19,20]<br>`مُجْرَاهَا` [1,3,4,7,8,9,15,16,17,18]<br>`مُجرِيهَا` [2,5,6] | 2/288–289: «(واختلفوا) في: مجراها فقرأها حمزة والكسائي وخلف وحفص بفتح الميم، وقد غلط من حكى فتح الميم عن الداجوني عن أصحابه عن ابن ذكوان من المؤلفين، وشبهتهم في ذلك - والله أعلم - أنهم رأوا فيها عنه الفتح والإمالة فظنوا فتح الميم، وليس كذلك، بل إنما أريد فتح الراء، وإمالتها فإنه روى عن أصحابه عن ابن ذكوان فيها الفتح والإمالة فالإمالة روايته عن الصوري والفتح روايته عن غيره، وقد تقدم ذكرنا له في الإمالة، وهذا مما ينبغي أن ينتبه له، وهو مما لا يعرفه إلا أئمة هذه الصناعة العالمون بالنصوص والعلل المطلعون على أحوال الرواة، فلذلك أضرب عنه الحافظ أبو العلاء، ولم يعتبره مع روايته له عن شيخه أبي العز، الذي نص عليه في كتبه، وبهذا يعرف مقدار المحققين …» | Matched. Checked against the text. |
| P094 | هود 11:46 إنه عمل غير | `[7, 8]`; `عَمَلٌ غَيۡرُ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,19,20]<br>`عَمِلَ غَيْرَ` [13,14,17,18] | 2/289: «(واختلفوا) في: إنه عمل غير فقرأ يعقوب والكسائي، (عمل) بكسر الميم وفتح اللام (غير) بنصب الراء، وقرأ الباقون بفتح الميم ورفع اللام منونة ورفع الراء.» | Matched. Checked against the text. |
| P095 | هود 11:68 ألا بعدا لثمود | `[11, 11]`; `لِّثَمُودَ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`لِثَمُودٍ` [13,14] | 2/290: «(واختلفوا) في: ألا بعدا لثمود فقرأ الكسائي بكسر الدال مع التنوين، وقرأ الباقون بغير تنوين مع فتحها.» | Matched. Checked against the text. |
| P096 | هود 11:69 قال سلام هنا والذاريات | `[7, 8]`; `قَالَ سَلَٰمٞۖ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18,19,20]<br>`سِلْمٌ` [11,12,13,14] | 2/290: «(واختلفوا) في: قال سلام هنا والذاريات، فقرأ حمزة والكسائي، (سلم) بكسر السين، وإسكان اللام من غير ألف فيهما، وقرأ الباقون بفتح السين واللام وألف بعدها،» | Matched. Checked against the text. |
| P097 | هود 11:71 يعقوب قالت | `[8, 8]`; `يَعۡقُوبَ` [7,8,10,11,12]<br>`يَعْقُوبُ` [1,2,3,4,5,6,9,13,14,15,16,17,18,19,20] | 2/290: «(واختلفوا) في: يعقوب قالت فقرأ ابن عامر وحمزة وحفص بنصب الباء، وقرأ الباقون برفعها،» | Matched. Checked against the text. |
| P098 | هود 11:81 امرأتك | `[18, 18]`; `ٱمۡرَأَتَكَۖ` [1,2,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`امْرَأَتُكَ` [3,4,5,6] | 2/290: «(واختلفوا) في: امرأتك فقرأ ابن كثير وأبو عمرو برفع التاء، وانفرد محمد بن جعفر الأشنائي عن الهاشمي عن إسماعيل عن ابن جماز بالرفع كذلك، وقرأ الباقون بنصبها.» | Inferred scope match: the isolated Ibn Jammaz nominative route is not used to demand a third group. |
| P099 | هود 11:111 وإن كلا | `[0, 1]`; `وَإِنَّ كُلّٗا` [5,6,7,8,10,11,12,13,14,15,16,17,18,19,20]<br>`وَإِنْ` [1,2,3,4,9] | 2/290: «(واختلفوا) في: وإن كلا فقرأ نافع وابن كثير وأبو بكر بإسكان النون مخففة، وقرأ الباقون بتشديدها.» | Matched. Checked against the text. |
| P100 | يوسف 12:4 ياأبت حيث جاء، وهو في هذه السورة ومريم والقصص والصافات | `[4, 4]`; `يَٰٓأَبَتِ` [1,2,3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`يَآ أَبَتَ` [7,8,15,16] | 2/293: «(واختلفوا) في: ياأبت حيث جاء، وهو في هذه السورة ومريم والقصص والصافات، فقرأ بفتح التاء في السور الأربع أبو جعفر وابن عامر، وقرأ الباقون بكسر التاء فيهن،» | Matched. Checked against the text. |

### Juz 13

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P101 | يوسف 12:56 حيث يشاء | `[7, 8]`; `حَيۡثُ يَشَآءُۚ` [1,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`حَيْثُ نَشَآءُ` [3,4] | 2/295: «(واختلفوا) في: حيث يشاء فقرأ ابن كثير بالنون، وقرأ الباقون بالياء.» | F09: missing reading. Checked against the text. |
| P102 | يوسف 12:62 لفتيته | `[0, 1]`; `وَقَالَ لِفِتۡيَٰنِهِ` [10,11,12,13,14,19,20]<br>`وَقَالَ لِفِتْيَتِهِ` [1,2,3,4,5,6,7,8,9,15,16,17,18] | 2/295: «(واختلفوا) في: (لفتيته) فقرأ حمزة والكسائي وخلف وحفص لفتيانه بألف بعد الياء ونون مكسورة بعدها، وقرأ الباقون بتاء مكسورة بعد الياء من غير ألف.» | Matched. Checked against the text. |
| P103 | يوسف 12:63 نكتل | `[12, 12]`; `نَكۡتَلۡ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`يَكْتَلْ` [11,12,13,14,19,20] | 2/295: «(واختلفوا) في: نكتل فقرأ حمزة والكسائي وخلف بالياء، وقرأ الباقون بالنون.» | Matched. Checked against the text. |
| P104 | يوسف 12:64 خير حافظا | `[13, 14]`; `حَٰفِظٗاۖ وَهُوَ` [10,11,12,19,20]<br>`حَافِظًا وَهْوَ` [13,14]<br>`حِفْظًا وَهْوَ` [1,5,6,15,16]<br>`حِفْظاً وَهُوَ` [2,3,4,7,8,9,17,18] | 2/295: «(واختلفوا) في: خير حافظا فقرأ حمزة ، والكسائي وخلف وحفص حافظا بألف بعد الحاء وكسر الفاء، وقرأ الباقون بكسر الحاء، وإسكان الفاء من غير ألف.» | Matched. Checked against the text. |
| P105 | يوسف 12:76 نرفع درجات من نشاء | `[24, 24]`; `نَرۡفَعُ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`يَرْفَعُ` [17,18] | 2/296: «(واختلفوا) في: نرفع درجات من نشاء فقرأ يعقوب بالياء فيهما، وقرأهما الباقون بالنون،» | Matched. Checked against the text. |
| P106 | يوسف 12:100 ياأبت حيث جاء، وهو في هذه السورة ومريم والقصص والصافات | `[8, 8]`; `يَٰٓأَبَتِ` [1,3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`يَآ أَبَتَ` [7,8,15,16] | 2/293: «(واختلفوا) في: ياأبت حيث جاء، وهو في هذه السورة ومريم والقصص والصافات، فقرأ بفتح التاء في السور الأربع أبو جعفر وابن عامر، وقرأ الباقون بكسر التاء فيهن،» | F10: missing reading. Checked against the text. |
| P107 | يوسف 12:109 نوحي | `[6, 6]`; `نُّوحِيٓ` [10]<br>`يُوحَى` [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/296: «(واختلفوا) في: (يوحى إليهم) هنا، وفي النحل والأول من الأنبياء و (يوحى إليه) ثاني الأنبياء، فروى حفص بالنون وكسر الحاء في الأربعة على لفظ الجمع، وافقه في الثاني من الأنبياء حمزة والكسائي وخلف، وقرأ الباقون بالياء وفتح الحاء على ما لم يسم فاعله،» | Matched. Checked against the text. |
| P108 | يوسف 12:110 قد كذبوا | `[7, 7]`; `كُذِبُواْ` [9,10,11,12,13,14,15,16,19,20]<br>`كُذِّبُوا` [1,2,3,4,5,6,7,8,17,18] | 2/296: «(واختلفوا) في: قد كذبوا فقرأ أبو جعفر، والكوفيون بالتخفيف، وقرأ الباقون بالتشديد.» | Matched. Checked against the text. |
| P109 | الرعد 13:16 أم هل تستوي | `[25, 26]`; `تَسۡتَوِي ٱلظُّلُمَٰتُ` [1,2,3,4,5,6,7,8,10,15,16,17,18]<br>`يَسْتَوِى الظُّلُمَاتُ` [9,11,12,13,14,19,20] | 2/297: «(واختلفوا) في: أم هل تستوي فقرأ حمزة والكسائي وخلف وأبو بكر بالياء مذكرا، وقرأ الباقون بالتاء مؤنثا،» | Matched. Checked against the text. |
| P110 | إبراهيم 14:2 الله | `[0, 0]`; `ٱللَّهِ` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`اللهُ` [1,2,7,8,15,16] | 2/298: «في الله الذي فقرأ المدنيان، وابن عامر برفع الهاء في الحالين، وافقهم رويس في الابتداء خاصة، وقرأ الباقون بالخفض في الحالين.» | Matched. Checked against the text. |

### Juz 14

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P111 | الحجر 15:2 ربما | `[0, 0]`; `رُّبَمَا` [1,2,9,10,15,16]<br>`رُبَّمَا` [3,4,5,6,7,8,11,12,13,14,17,18,19,20] | 2/301: «(واختلفوا) في: ربما فقرأ المدنيان، وعاصم بتخفيف الباء، وقرأ الباقون بتشديدها،» | Matched. Checked against the text. |
| P112 | الحجر 15:8 ما ننزل الملائكة | `[0, 2]`; `مَا نُنَزِّلُ ٱلۡمَلَٰٓئِكَةَ` [10,11,12,13,14,19,20]<br>`مَا تَنَزَّلُ الْمَلآَئِكَةُ` [1,2,3,4,5,6,7,8,15,16,17,18]<br>`مَا تُنَزَّلُ الْمَلآَئِكَةُ` [9] | 2/301: «(واختلفوا) في: ما ننزل الملائكة فقرأ حمزة والكسائي وخلف وحفص بنونين الأولى مضمومة والثانية مفتوحة وكسر الزاي الملائكة بالنصب، وروى أبو بكر بالتاء مضمومة وفتح النون والزاي الملائكة بالرفع، وقرأ الباقون كذلك إلا أنهم فتحوا التاء،» | Matched. Checked against the text. |
| P113 | الحجر 15:15 سكرت | `[2, 3]`; `سُكِّرَتۡ أَبۡصَٰرُنَا` [1,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`سُكِّرَتَ بْصَارُنَا` [2]<br>`سُكِرَتْ` [3,4] | 2/301: «(واختلفوا) في: سكرت فقرأ ابن كثير بتخفيف الكاف، وقرأ الباقون بتشديدها،» | Matched. Checked against the text. |
| P114 | الحجر 15:41 علي | `[3, 3]`; Missing | 2/301: «(واختلفوا) في: صراط علي مستقيم فقرأ يعقوب بكسر اللام ورفع الياء وتنوينها، وقرأ الباقون بفتح اللام من غير تنوين» | F11: missing reading. Checked against the text. |
| P115 | الحجر 15:54 فبم تبشرون | `[7, 7]`; `تُبَشِّرُونَ` [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`تُبَشِّرُونِ` [1,2]<br>`تُبَشِّرُونِّ` [3,4] | 2/302: «(واختلفوا) في: فبم تبشرون فقرأ نافع وابن كثير بكسر النون وفتحها الباقون وشددها ابن كثير، وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |
| P116 | الحجر 15:56 يقنط ويقنطون وتقنطوا | `[1, 2]`; `وَمَن يَقۡنَطُ` [1,2,3,4,7,8,9,10,11,12,15,16]<br>`وَمَن يَقْنِطُ` [5,6,13,14,17,18,19,20] | 2/302: «(واختلفوا) في: يقنط ويقنطون وتقنطوا فقرأ البصريان، والكسائي وخلف بكسر النون، وقرأ الباقون بفتحها،» | Matched. Checked against the text. |
| P117 | الحجر 15:60 قدرنا إنها، وفي النمل قدرناها | `[2, 3]`; `قَدَّرۡنَآ إِنَّهَا` [1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20]<br>`قَدَرْنَآ` [9] | 2/302: «(واختلفوا) في: قدرنا إنها، وفي النمل قدرناها، فروى أبو بكر بتخفيف الدال فيهما، وقرأ الباقون بالتشديد فيهما،» | Matched. Checked against the text. |
| P118 | النحل 16:2 ينزل الملائكة | `[0, 0]`; `يُنَزِّلُ` [1,2,7,8,9,10,11,12,13,14,15,16,19,20]<br>`تَنَزَّلُ` [18]<br>`يُنْزِلُ` [3,4,5,6,17] | 2/302: «(واختلفوا) في: ينزل الملائكة، فروى روح بالتاء مفتوحة وفتح الزاي مشددة ورفع الملائكة كالمتفق عليه في» | Matched. Checked against the text. |
| P119 | النحل 16:7 بشق الأنفس | `[8, 8]`; `بِشِقِّ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`بِشَقِّ` [15,16] | 2/302: «(واختلفوا) في: بشق الأنفس فقرأ أبو جعفر بفتح الشين، وقرأ الباقون بكسرها.» | Matched. Checked against the text. |
| P120 | النحل 16:11 ينبت لكم | `[0, 0]`; `يُنۢبِتُ` [1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20]<br>`نُنبِتُ` [9] | 2/302: «(واختلفوا) في: ينبت لكم، فروى أبو بكر بالنون، وقرأ الباقون بالياء.» | Matched. Checked against the text. |

### Juz 15

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P121 | الإسراء 17:2 ألا تتخذوا | `[8, 8]`; `تَتَّخِذُواْ` [1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`يَتَّخِذُوا` [5,6] | 2/306: «(اختلفوا) في ألا تتخذوا فقرأ أبو عمرو بالغيب، وقرأ الباقون بالخطاب.» | Matched. Checked against the text. |
| P122 | الإسراء 17:13 ونخرج له | `[6, 6]`; `وَنُخۡرِجُ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,19,20]<br>`وَيُخْرَجُ` [15,16]<br>`وَيَخْرُجُ` [17,18] | 2/306: «(واختلفوا) في: ونخرج له فقرأ أبو جعفر بالياء وضمها وفتح الراء، وقرأ يعقوب بالياء وفتحها وضم الراء، وقرأ الباقون بالنون وضمها وكسر الراء. (واتفقوا) على نصب كتابا ووجه نصبه على قراءة أبي جعفر ونخرج مبنيا للمفعول، قيل: إن الجار والمجرور، وهو له قام مقام الفاعل، وقيل: المصدر على أحد قراءته ليجزي قوما فهو مفعول به، والأحسن أن يكون حالا، أي ويخرج الطائر كتابا، وكذا وجه النصب على قراءة يعقوب أيضا فتتفق القراءتان في التوجيه على الصحيح الفصيح الذي لا يختلف فيه - والله أعلم -.» | Matched. Checked against the text. |
| P123 | الإسراء 17:13 يلقاه | `[11, 11]`; `يَلۡقَىٰهُ` [1,2,3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`يُلَقَّاهُ` [7,8,15,16] | 2/306: «(واختلفوا) في: يلقاه فقرأ أبو جعفر وابن عامر بضم الياء وفتح اللام وتشديد القاف، وقرأ الباقون بفتح الياء، وإسكان اللام وتخفيف القاف،» | Matched. Checked against the text. |
| P124 | الإسراء 17:16 أمرنا مترفيها | `[5, 5]`; `أَمَرۡنَا` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`ءَامَرْنَا` [17,18] | 2/306: «(واختلفوا) في: أمرنا مترفيها فقرأ يعقوب بمد الهمزة، وقرأ الباقون بقصرها، محظورا انظر ومسحورا انظر كلاهما في البقرة عند فمن اضطر.» | Matched. Checked against the text. |
| P125 | الإسراء 17:23 إما يبلغن | `[10, 10]`; `يَبۡلُغَنَّ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`يَبْلُغَآنِّ` [11,12,13,14,19,20] | 2/306: «(واختلفوا) في: إما يبلغن فقرأ حمزة والكسائي وخلف (يبلغان) بألف مطولة بعد الغين وكسر النون على التثنية، وقرأ الباقون بغير ألف وفتح النون على التوحيد،» | Matched. Checked against the text. |
| P126 | الإسراء 17:33 فلا يسرف | `[15, 16]`; `فَلَا يُسۡرِف` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`تُسْرِفْ` [11,12,13,14,19,20] | 2/307: «(واختلفوا) في: فلا يسرف فقرأ حمزة والكسائي، وخلف بالخطاب، وقرأ الباقون بالغيب.» | Matched. Checked against the text. |
| P127 | الإسراء 17:35 بالقسطاس هنا والشعراء | `[5, 5]`; `بِٱلۡقِسۡطَاسِ` [10,11,12,13,14,19,20]<br>`بِالقُسْطَاسِ` [1,2,3,4,5,6,7,8,9,15,16,17,18] | 2/307: «(واختلفوا) في: بالقسطاس هنا والشعراء، فقرأ حمزة والكسائي وخلف وحفص بكسر القاف في الموضعين، وقرأ الباقون بضمها فيهما.» | Matched. Checked against the text. |
| P128 | الإسراء 17:38 كان سيئه | `[3, 3]`; `سَيِّئُهُۥ` [7,8,9,10,11,12,13,14,19,20]<br>`سَيِّئَةً` [1,2,3,4,5,6,15,16,17,18] | 2/307: «(واختلفوا) في: كان سيئه فقرأ الكوفيون، وابن عامر بضم الهمزة والهاء وإلحاقها الواو في اللفظ على الإضافة والتذكير، وقرأ الباقون بفتح الهمزة، ونصب تاء التأنيث مع التنوين على التوحيد،» | Matched. Checked against the text. |
| P129 | الإسراء 17:41 ليذكروا هنا، والفرقان | `[5, 5]`; `لِيَذَّكَّرُواْ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`لِيَذْكُرُوا` [11,12,13,14,19,20] | 2/307: «(واختلفوا) في: ليذكروا هنا، والفرقان، فقرأ حمزة والكسائي وخلف بإسكان الذال وضم الكاف مع تخفيفها في الموضعين، وقرأ الباقون بفتح الذال والكاف مع تشديدها فيهما.» | Matched. Checked against the text. |
| P130 | الكهف 18:2 من لدنه | `[5, 5]`; `لَّدُنۡهُ` [1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20]<br>`لَدْنِهِ` [9] | 2/310: «(واختلفوا) في: من لدنه، فروى أبو بكر بإسكان الدال وإشمامها الضم وكسر النون والهاء ووصلها بياء اللفظ، وانفرد نفطويه عن الصريفيني عن يحيى عن أبي بكر بكسر الهاء من غير صلة، وهي رواية خلف عن يحيى، وقرأ الباقون بضم الهاء والدال، وإسكان النون، وابن كثير على أصله في الصلة بواو،» | Matched. Checked against the text. |

### Juz 16

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P131 | الكهف 18:76 من لدني | `[11, 11]`; `لَّدُنِّي` [3,4,5,6,7,8,10,11,12,13,14,17,18,19,20]<br>`لَدْنِى` [9]<br>`لَدُنِى` [1,2,15,16] | 2/313–314: «(واختلفوا) في: من لدني فقرأ المدنيان بضم الدال وتخفيف النون، وروى أبو بكر بتخفيف النون، واختلف عنه في ضمة الدال، فأكثر أهل الأداء على إشمامها الضم بعد إسكانها، وبه ورد النص عن العليمي، وعن موسى بن حزام عن يحيى، وبه قرأ الداني من طريق الصريفيني، ولم يذكر غيره في التيسير، وتبعه على ذلك الشاطبي، وهو الذي في الكافي والتذكرة، والهداية، وأكثر كتب المغاربة، وكذا هو في كتب ابن مهران وكتب أبي العز وسبط الخياط، وروى كثير منهم اختلاس ضمة الدال، وهو الذي نص عليه الحافظ أبو العلاء الهمداني والأستاذ أبو طاهر بن سوار وأبو القاسم الهذلي، وغيرهم، ونص عليهما جميعا الحافظ أبو عمرو الداني في مفرداته وجامعه …» | Matched. Checked against the text. |
| P132 | الكهف 18:81 أن يبدلهما هنا، وفي التحريم أن يبدله، وفي " ن " أن يبدلنا | `[1, 2]`; `أَن يُبۡدِلَهُمَا` [3,4,7,8,9,10,11,12,13,14,17,18,19,20]<br>`أَن يُبَدِّلَهُمَا` [1,2,5,6,15,16] | 2/314: «(واختلفوا) في: أن يبدلهما هنا، وفي التحريم أن يبدله، وفي " ن " أن يبدلنا فقرأ المدنيان، وأبو عمرو بتشديد الدال في الثلاثة، وقرأ الباقون بالتخفيف فيهن،» | Matched. Checked against the text. |
| P133 | الكهف 18:85 فأتبع سببا ثم أتبع سببا في المواضع الثلاثة | `[0, 0]`; `فَأَتۡبَعَ` [7,8,9,10,11,12,13,14,19,20]<br>`فَاتَّبَعَ` [1,2,3,4,5,6,15,16,17,18] | 2/314: «(واختلفوا) في: فأتبع سببا ثم أتبع سببا في المواضع الثلاثة فقرأ ابن عامر، والكوفيون بقطع الهمزة، وإسكان التاء فيهن، وقرأ الباقون بوصل الهمزة وتشديد التاء في الثلاثة، وانفرد بذلك الشذائي عن الرملي عن الصوري عن ابن ذكوان لم يروه غيره.» | Matched. Checked against the text. |
| P134 | الكهف 18:86 عين حمئة | `[9, 10]`; `حَمِئَةٖ وَوَجَدَ` [1,2,3,4,5,6,10,17,18]<br>`حَامِيَةٍ وَوَجَدَ` [7,8,9,11,12,13,14,15,16,19,20] | 2/314: «(واختلفوا) في: عين حمئة فقرأ نافع وابن كثير، والبصريان وحفص بغير ألف بعد الحاء، وهمز الياء، وقرأ الباقون بالألف وفتح الياء من غير همز.» | Matched. Checked against the text. |
| P135 | الكهف 18:93 بين السدين | `[4, 4]`; `ٱلسَّدَّيۡنِ` [3,4,5,6,10]<br>`السُّدَّيْنِ` [1,2,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/315: «(واختلفوا) في: بين السدين فقرأ ابن كثير وأبو عمرو وحفص بفتح السين، وقرأ الباقون بضمها.» | Matched. Checked against the text. |
| P136 | الكهف 18:93 يفقهون | `[11, 11]`; `يَفۡقَهُونَ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`يُفْقِهُونَ` [11,12,13,14,19,20] | 2/315: «(واختلفوا) في: يفقهون فقرأ حمزة والكسائي وخلف بضم الياء وكسر القاف، وقرأ الباقون بفتح الياء والقاف،» | Matched. Checked against the text. |
| P137 | الكهف 18:94 خرجا هنا والحرف الأول من المؤمنون | `[12, 12]`; `خَرۡجًا` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`خَرَاجاً` [11,12,13,14,19,20] | 2/315: «(واختلفوا) في: خرجا هنا والحرف الأول من المؤمنون فقرأ حمزة والكسائي وخلف بفتح الراء وألف بعدها في الموضعين، وقرأ الباقون بإسكان الراء من غير ألف فيهما، وقرأ ابن عامر فخرج ربك ثاني المؤمنين بإسكان الراء، وقرأ الباقون بالألف.» | Matched. Checked against the text. |
| P138 | الكهف 18:94 سدا هنا، وفي الموضعين من يس | `[18, 18]`; `سَدّٗا` [3,4,5,6,10,11,12,13,14,19,20]<br>`سُدّاً` [1,2,7,8,9,15,16,17,18] | 2/315: «(واختلفوا) في: سدا هنا، وفي الموضعين من يس فقرأ حمزة والكسائي وخلف وحفص بفتح السين في الثلاثة، وافقهم ابن كثير وأبو عمرو هنا، وقرأ الباقون بضم السين في الثلاثة،» | Matched. Checked against the text. |
| P139 | مريم 19:6 يرثني ويرث | `[0, 1]`; `يَرِثُنِي وَيَرِثُ` [1,2,3,4,7,8,9,10,11,12,15,16,17,18,19,20]<br>`يَرِثْنِى وَيَرِثْ` [5,6,13,14] | 2/317: «(واختلفوا) في: يرثني ويرث فقرأ أبو عمرو والكسائي بجزمهما، وقرأ الباقون برفعهما،» | Matched. Checked against the text. |
| P140 | طه 20:13 وأنا | `[0, 0]`; `طُوٗى وَأَنَا` [7,8,9,10,13,14,19,20]<br>`طُوًى وَأَنَّا` [11,12]<br>`طُوَى وَأَنَا` [1,2,3,4,5,6,15,16,17,18] | 2/320: «(واختلفوا) في: وأنا اخترتك فقرأ حمزة " وأنا " بتشديد النون " اخترناك " بالنون مفتوحة وألف بعدها على لفظ الجمع، وقرأ الباقون " أنا " بتخفيف النون " اخترتك " بالتاء مضمومة من غير ألف على لفظ الواحد.» | F12: wording. Checked against the text. |

### Juz 17

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P141 | الأنبياء 21:4 قال ربي يعلم | `[0, 1]`; `قَالَ رَبِّي` [10,11,12,13,14,19,20]<br>`قُل رَّبِّ` [1,2,3,4,5,6,7,8,9,15,16,17,18] | 2/323: «(واختلفوا) في: قال ربي يعلم فقرأ حمزة والكسائي وخلف وحفص قال بألف على الخبر، والباقون (قل) بغير ألف على الأمر، ووهم فيه الهذلي وتبعه الحافظ أبو العلاء فلم يذكرا قال لخلف - والله أعلم -.» | Matched. Checked against the text. |
| P142 | الأنبياء 21:30 أولم ير الذين كفروا | `[0, 0]`; `أَوَلَمۡ` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`أَلَمْ` [3,4] | 2/323: «(واختلفوا) في: أولم ير الذين كفروا فقرأ ابن كثير ألم بغير واو، وقرأ الباقون بالواو.» | Matched. Checked against the text. |
| P143 | الأنبياء 21:45 ولا تسمع الصم | `[5, 6]`; `يَسۡمَعُ ٱلصُّمُّ` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`تُسْمِعُ الصُّمَّ` [7,8] | 2/323: «(واختلفوا) في: ولا تسمع الصم فقرأ ابن عامر بتاء مضمومة وكسر الميم، ونصب الصم، وقرأ الباقون بالياء غيبا وفتحها وفتح الميم ورفع (الصم) ونذكر حروف النمل والروم في النمل.» | Matched. Checked against the text. |
| P144 | الأنبياء 21:47 وإن كان مثقال حبة هنا، وفي لقمان إنها إن تك مثقال حبة | `[11, 11]`; `مِثۡقَالَ` [3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`مِثْقَالُ` [1,2,15,16] | 2/324: «(واختلفوا) في: وإن كان مثقال حبة هنا، وفي لقمان إنها إن تك مثقال حبة فقرأ المدنيان برفع اللام في الموضعين، وقرأ الباقون بالنصب فيهما،» | Matched. Checked against the text. |
| P145 | الأنبياء 21:58 جذاذا | `[1, 2]`; `جُذَٰذًا إِلَّا` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`جِذَاذاً إِلاَّ` [13,14] | 2/324: «(واختلفوا) في: جذاذا فقرأ الكسائي بكسر الجيم، وقرأ الباقون بضمها،» | Matched. Checked against the text. |
| P146 | الأنبياء 21:80 لتحصنكم | `[4, 4]`; `لِتُحۡصِنَكُم` [7,8,10,15,16]<br>`لِنُحْصِنَكُمْ` [9,17]<br>`لِيُحْصِنَكُمْ` [1,2,3,4,5,6,11,12,13,14,18,19,20] | 2/324: «(واختلفوا) في: لتحصنكم فقرأ أبو جعفر وابن عامر وحفص بالتاء على التأنيث، ورواه أبو بكر ورويس بالنون، وقرأ الباقون بالياء على التذكير،» | Matched. Checked against the text. |
| P147 | الأنبياء 21:87 أن لن نقدر عليه | `[8, 8]`; `نَّقۡدِرَ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`يُقْدَرَ` [17,18] | 2/324: «(واختلفوا) في: أن لن نقدر عليه فقرأ يعقوب بالياء مضمومة وفتح الدال، وقرأ الباقون بالنون مفتوحة وكسر الدال.» | Matched. Checked against the text. |
| P148 | الأنبياء 21:95 وحرام على | `[0, 0]`; `وَحَرَٰمٌ` [1,2,3,4,5,6,7,8,10,15,16,17,18,19,20]<br>`وَحِرْمٌ` [9,11,12,13,14] | 2/324: «(واختلفوا) في: وحرام على فقرأ حمزة والكسائي وأبو بكر (وحرم) بكسر الحاء، وإسكان الراء من غير ألف، والباقون بفتح الحاء والراء وألف بعدها،» | Matched. Checked against the text. |
| P149 | الأنبياء 21:104 نطوي السماء | `[1, 2]`; `نَطۡوِي ٱلسَّمَآءَ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`تُطْوَى السَّمَآءُ` [15,16] | 2/324: «(واختلفوا) في: نطوي السماء فقرأ أبو جعفر بالتاء مضمومة على التأنيث وفتح الواو ورفع السماء، وقرأ الباقون بالنون مفتوحة وكسر الواو ، ونصب السماء.» | Matched. Checked against the text. |
| P150 | الحج 22:2 سكارى وما هم بسكارى | `[13, 14]`; `ٱلنَّاسَ سُكَٰرَىٰ` [1,2,3,4,5,7,8,9,10,15,16,17,18]<br>`الناسَ سُكَارَى` [6]<br>`النَّاسَ سَكْرَى` [11,12,13,14,19,20] | 2/325: «(واختلفوا) في: سكارى وما هم بسكارى فقرأ حمزة والكسائي وخلف، (سكرى) بفتح السين، وإسكان الكاف من غير ألف فيهما، وقرأ الباقون بضم السين وفتح الكاف وألف بعدها، وهم في الإمالة على أصولهم.» | Matched. Checked against the text. |

### Juz 18

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P151 | المؤمنون 23:8 لأماناتهم هنا والمعارج | `[2, 2]`; `لِأَمَٰنَٰتِهِمۡ` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`لأَمَانَتِهِمُ` [3,4] | 2/328: «(واختلفوا) في: لأماناتهم هنا والمعارج، فقرأ ابن كثير فيهما بغير ألف على التوحيد، وقرأهما الباقون بالألف على الجمع.» | Matched. Checked against the text. |
| P152 | المؤمنون 23:9 على صلواتهم | `[3, 3]`; `صَلَوَٰتِهِمۡ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`صَلاَتِهِمْ` [11,12,13,14,19,20] | 2/328: «(واختلفوا) في: على صلواتهم فقرأ حمزة والكسائي وخلف بالتوحيد، وقرأها الباقون بالجمع. (واتفقوا) على الإفراد في الأنعام والمعارج لأنه لم يكتنفها فيهما ما اكتنفها في المؤمنون قبل، وبعد من تعظيم الوصف في المتقدم وتعظيم الجزاء في المتأخر فناسب لفظ الجمع، وكذلك قرأ به أكثر القراء، ولم يكن ذلك في غيرها فناسب الإفراد - والله أعلم -.» | Matched. Checked against the text. |
| P153 | المؤمنون 23:14 عظاما فكسونا العظام | `[9, 9]`; `عِظَٰمٗا` [1,2,3,4,5,6,10,11,12,13,14,15,16,17,18,19,20]<br>`(عَظْماً` [7,8,9] | 2/328: «(واختلفوا) في: عظاما فكسونا العظام فقرأ ابن عامر وأبو بكر (عظما) و (العظم) بفتح العين، وإسكان الظاء من غير ألف على التوحيد فيهما، وقرأهما الباقون بكسر العين وفتح الظاء وألف بعدها.» | F13: wording. Checked against the text. |
| P154 | المؤمنون 23:20 طور سيناء | `[4, 4]`; `سَيۡنَآءَ` [7,8,9,10,11,12,13,14,17,18,19,20]<br>`سِينَآءَ` [1,2,3,4,5,6,15,16] | 2/328: «(واختلفوا) في: طور سيناء فقرأ المدنيان، وابن كثير وأبو عمرو بكسر السين، وقرأ الباقون بفتحها.» | Matched. Checked against the text. |
| P155 | المؤمنون 23:20 تنبت بالدهن | `[5, 5]`; `تَنۢبُتُ` [1,2,7,8,9,10,11,12,13,14,15,16,18,19,20]<br>`تُنبِتُ` [3,4,5,6,17] | 2/328: «(واختلفوا) في: تنبت بالدهن فقرأ ابن كثير وأبو عمرو ورويس بضم التاء وكسر الباء، وقرأ الباقون بفتح التاء وضم الباء،» | Matched. Checked against the text. |
| P156 | المؤمنون 23:29 أنزلني منزلا | `[3, 3]`; `مُنزَلٗا` [1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20]<br>`مَنزِلاً` [9] | 2/328: «(واختلفوا) في: أنزلني منزلا، فروى أبو بكر بفتح الميم وكسر الزاي، وقرأ الباقون بضم الميم وفتح الزاي،» | Matched. Checked against the text. |
| P157 | المؤمنون 23:36 هيهات هيهات | `[1, 2]`; `هَيۡهَاتَ هَيۡهَاتَ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`هَيْهَاتِ هَيْهَاتِ` [15,16] | 2/328: «(واختلفوا) في: هيهات هيهات فقرأ أبو جعفر بكسر التاء منهما، وقرأ الباقون بفتحها فيهما،» | Matched. Checked against the text. |
| P158 | المؤمنون 23:52 وإن | `[0, 1]`; `عَلِيمٞ وَإِنَّ هَٰذِهِۦٓ` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`عَلِيمٌ وَأَنْ` [7,8] | 2/328: «(واختلفوا) في: وإن هذه أمتكم فقرأ الكوفيون بكسر الهمزة، وقرأ الباقون بفتحها، وأسكن النون من " إن " مخففة ابن عامر وشددها الباقون،» | F14: wrong reader. Checked against the text. |
| P159 | النور 24:1 وفرضناها | `[2, 2]`; `وَفَرَضۡنَٰهَا` [1,2,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`وَفَرَّضْنَاهَا` [3,4,5,6] | 2/330: «واختلفوا في وفرضناها فقرأ ابن كثير وأبو عمرو بتشديد الراء وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |
| P160 | الفرقان 25:8 جنة يأكل منها | `[8, 9]`; `يَأۡكُلُ مِنۡهَاۚ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`نَأْكُلُ` [11,12,13,14,19,20] | 2/333: «(واختلفوا) في: جنة يأكل منها فقرأ حمزة والكسائي وخلف بالنون، وقرأ الباقون بالياء،» | Matched. Checked against the text. |

### Juz 19

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P161 | الفرقان 25:25 تشقق السماء هنا، وفي ق | `[1, 1]`; `تَشَقَّقُ` [5,6,9,10,11,12,13,14,19,20]<br>`تَشَّقَّقُ` [1,2,3,4,7,8,15,16,17,18] | 2/334: «(واختلفوا) في: تشقق السماء هنا، وفي ق فقرأ أبو عمرو، والكوفيون بتخفيف الشين فيهما، وقرأ الباقون بالتشديد منهما.» | Matched. Checked against the text. |
| P162 | الفرقان 25:25 ونزل الملائكة | `[4, 6]`; `وَنُزِّلَ ٱلۡمَلَٰٓئِكَةُ تَنزِيلًا` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`وَنُنْزِلُ الْمَلآَئِكَةَ تَنْزِيلاً` [3,4] | 2/334: «(واختلفوا) في: ونزل الملائكة فقرأ ابن كثير بنونين الأولى مضمومة والثانية ساكنة مع تخفيف الزاي ورفع اللام، ونصب الملائكة، وهي كذلك في المصحف المكي، وقرأ الباقون بنون واحدة وتشديد الزاي وفتح اللام ورفع الملائكة، وكذلك هي في مصاحفهم واتفقوا على كسر الزاي،» | Matched. Checked against the text. |
| P163 | الفرقان 25:60 لما تأمرنا | `[10, 10]`; `تَأۡمُرُنَا` [1,2,3,4,5,6,7,8,9,10,15,16,17,18,19,20]<br>`يَأْمُرُنَا` [11,12,13,14] | 2/334: «(واختلفوا) في: لما تأمرنا فقرأ حمزة والكسائي بالغيب، وقرأ الباقون بالخطاب» | Matched. Checked against the text. |
| P164 | الفرقان 25:61 سراجا | `[8, 9]`; `سِرَٰجٗا وَقَمَرٗا` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`سُرُجاً وَقَمَراً` [11,12,13,14,19,20] | 2/334: «(واختلفوا) في سراجا فقرأ حمزة والكسائي وخلف بضم السين والراء من غير ألف على الجمع، وقرأ الباقون بكسر السين وفتح الراء وألف بعدها على الإفراد.» | Matched. Checked against the text. |
| P165 | الفرقان 25:62 أن يذكر | `[8, 9]`; `أَن يَذَّكَّرَ` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18]<br>`أَن يَذْكُرَ` [11,12,19,20] | 2/334: «(واختلفوا) في: أن يذكر فقرأ حمزة وخلف بتخفيف الذال مسكنة وتخفيف الكاف مضمومة، وقرأ الباقون بتشديدهما مفتوحين.» | Matched. Checked against the text. |
| P166 | الفرقان 25:67 ولم يقتروا | `[6, 6]`; `يَقۡتُرُواْ` [9,10,11,12,13,14,19,20]<br>`يُقْتِرُوا` [1,2,7,8,15,16]<br>`يَقْتِرُوا` [3,4,5,6,17,18] | 2/334: «(واختلفوا) في: ولم يقتروا فقرأ المدنيان، وابن عامر بضم الياء وكسر التاء، وقرأ ابن كثير، والبصريان بفتح الياء وكسر التاء، وقرأ الباقون بفتح الياء وضم التاء،» | Matched. Checked against the text. |
| P167 | الفرقان 25:69 يضاعف ويخلد | `[0, 0]`; `يُضَٰعَفۡ` [1,2,3,4,5,6,10,11,12,13,14,15,16,17,18,19,20]<br>`وَيَخْلُدُ` [7,8,9]<br>`يُضَاعَفْ` [1,2,5,6,10,11,12,13,14,19,20]<br>`يُضَاعَفُ` [9]<br>`يُضَعَّفْ` [3,4,15,16,17,18]<br>`يُضَعَّفُ` [7,8] | 2/334: «(واختلفوا) في: يضاعف ويخلد فقرأ ابن عامر وأبو بكر برفع الفاء والدال، وقرأ الباقون بجزمهما،» | F15: wording; extra reading. Checked against the text. |
| P168 | الفرقان 25:74 وذرياتنا | `[7, 7]`; `وَذُرِّيَّٰتِنَا` [1,2,3,4,7,8,10,15,16,17,18]<br>`وَذُرِّيَّتِنَا` [5,6,9,11,12,13,14,19,20] | 2/335: «(واختلفوا) في: وذرياتنا فقرأ المدنيان، وابن كثير ويعقوب وابن عامر وحفص بالألف على الجمع، وقرأ الباقون بغير ألف على الإفراد.» | Matched. Checked against the text. |
| P169 | الشعراء 26:13 ويضيق صدري ولا ينطلق لساني | `[0, 0]`; `وَيَضِيقُ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`وَيَضِيقَ` [17,18] | 2/335: «(واختلفوا) في: ويضيق صدري ولا ينطلق لساني فقرأ يعقوب بنصب القاف منهما، وقرأ الباقون برفعها،» | Matched. Checked against the text. |
| P170 | النمل 27:7 بشهاب | `[12, 12]`; `بِشِهَابٖ` [9,10,11,12,13,14,17,18,19,20]<br>`بِشِهَابِ` [1,2,3,4,5,6,7,8,15,16] | 2/337: «واختلفوا في بشهاب فقرأ الكوفيون ويعقوب بالتنوين.» | Matched. Checked against the text. |

### Juz 20

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P171 | النمل 27:59 أم ما يشركون | `[11, 11]`; `يُشۡرِكُونَ` [5,6,9,10,17,18]<br>`تُشْرِكُونَ` [1,2,3,4,7,8,11,12,13,14,15,16,19,20] | 2/338: «(واختلفوا) في: أم ما يشركون فقرأ البصريان، وعاصم بالغيب، وقرأ الباقون بالخطاب،» | Matched. Checked against the text. |
| P172 | النمل 27:62 قليلا ما تذكرون | `[15, 15]`; `تَذَكَّرُونَ` [10,11,12,13,14,19,20]<br>`تَذَّكَّرُونَ` [1,2,3,4,8,9,15,16,17]<br>`يَذَّكَّرُونَ` [5,6,7,18] | 2/338: «(واختلفوا) في: قليلا ما تذكرون فقرأ أبو عمرو وهشام وروح بالغيب، وقرأ الباقون بالخطاب، وهم على أصولهم في الذال كما تقدم في الأنعام،» | Matched. Checked against the text. |
| P173 | النمل 27:66 بل ادارك | `[0, 1]`; `بَلِ ٱدَّٰرَكَ` [1,2,7,8,9,10,11,12,13,14,19,20]<br>`بَلْ أَدْرَكَ` [3,4,5,6,15,16,17,18] | 2/339: «(واختلفوا) في: بل ادارك فقرأ ابن كثير، والبصريان، وأبو جعفر بقطع الهمزة مفتوحة، وإسكان الدال من غير ألف بعدها، وقرأ الباقون بوصل الهمزة وتشديد الدال مفتوحة وألف بعدها،» | Matched. Checked against the text. |
| P174 | النمل 27:80 ولا تسمع الصم | `[5, 6]`; `تُسۡمِعُ ٱلصُّمَّ` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`يَسْمَعُ الصُّمُّ` [3,4] | 2/339: «(واختلفوا) في: ولا تسمع الصم فقرأ ابن كثير هنا، وفي الروم بالياء وفتحها وفتح الميم، (الصم) بالرفع، وقرأ الباقون في الموضعين بالتاء وضمها وكسر الميم، ونصب الصم.» | Matched. Checked against the text. |
| P175 | النمل 27:81 بهاد العمي هنا، وفي الروم | `[2, 3]`; `بِهَٰدِي ٱلۡعُمۡيِ` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18,19,20]<br>`تَهْدِى الْعُمْىَ` [11,12] | 2/339: «(واختلفوا) في: بهاد العمي هنا، وفي الروم فقرأهما حمزة تهدي بالتاء وفتحها، وإسكان الهاء من غير ألف، العمي بالنصب، وقرأهما الباقون بالباء وكسرها وبفتح الهاء وألف بعدها (العمي) بالخفض في الحرفين،» | Matched. Checked against the text. |
| P176 | النمل 27:82 أنا دمرناهم، وأن الناس | `[11, 12]`; `أَنَّ ٱلنَّاسَ` [9,10,11,12,13,14,17,18,19,20]<br>`إِنَّ` [1,2,3,4,5,6,7,8,15,16] | 2/338: «(واختلفوا) في: أنا دمرناهم، وأن الناس فقرأ الكوفيون ويعقوب بفتح الهمزة فيهما، وقرأ الباقون بكسرها منهما،» | Matched. Checked against the text. |
| P177 | النمل 27:87 وكل أتوه | `[16, 16]`; `أَتَوۡهُ` [10,11,12,19,20]<br>`ءَاتُوهُ` [1,2,3,4,5,6,7,8,9,13,14,15,16,17,18] | 2/339: «(واختلفوا) في: وكل أتوه فقرأ حمزة وخلف وحفص بفتح التاء وقصر الهمزة، وقرأ الباقون بمد الهمزة وضم التاء.» | Matched. Checked against the text. |
| P178 | النمل 27:88 بما يفعلون | `[17, 17]`; `تَفۡعَلُونَ` [1,2,8,9,10,11,12,13,14,15,16,19,20]<br>`يَفْعَلُونَ` [3,4,5,6,7,17,18] | 2/339: «(واختلفوا) في: بما يفعلون فقرأ ابن كثير، والبصريان بالغيب، واختلف عن هشام وابن ذكوان وأبي بكر، فأما هشام، فروى ابن عبدان عن الحلواني عن هشام كذلك بالغيب، وهي رواية أحمد بن سليمان والحسن والعباس، وكلاهما عن الحلواني عنه، وكذا روى ابن مجاهد عن الأزرق الجمال، وهي رواية البكراوي كلهم عن هشام، وبذلك قرأ الحافظ أبو عمرو على شيخه أبي الفتح فارس وأبي الحسن طاهر، وبه قرأ أبو طاهر بن سوار على شيخه أبي الوليد، وروى النقاش وابن شنبوذ عن الأزرق بالخطاب، وهي قراءة الداني على شيخه الفارسي، ورواه له أيضا الحلواني، وكذا رواه النقاش عن أصحابه، وكذا روى الداجوني عن أصحابه عن هشام، وهي رواية ابن عباد عن هشام، وأما ابن ذكوان، فروى الصوري عنه بالغيب …» | Inferred scope match: Hisham, Ibn Dhakwan and Shuba have additional named routes. The Shuba address form follows Yahya ibn Adam. |
| P179 | القصص 28:6 ونري فرعون وهامان وجنودهما | `[4, 4]`; `وَنُرِيَ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`وَيَرَى` [11,12,13,14,19,20] | 2/341: «(واختلفوا) في: ونري فرعون وهامان وجنودهما فقرأ حمزة والكسائي وخلف بالياء وفتحها، وإمالة فتحة الراء بعدها ورفع الأسماء الثلاثة، وقرأ الباقون بالنون وضمها وكسر الراء وفتح الياء، ونصب الأسماء الثلاثة.» | Matched. Checked against the text. |
| P180 | العنكبوت 29:19 أولم يروا كيف | `[1, 1]`; `يَرَوۡاْ` [1,2,3,4,5,6,7,8,10,15,16,17,18]<br>`تَرَوْا` [9,11,12,13,14,19,20] | 2/343: «(واختلفوا) في: أولم يروا كيف فقرأ حمزة والكسائي وخلف بالخطاب، واختلف عن أبي بكر، فروى عنه يحيى بن آدم كذلك، وكذا روى عنه ابن أبي أمية، وروى عنه العليمي بالغيب، وكذا روى الأعشى عنه والبرجمي والكسائي، وغيرهم، وبذلك قرأ الباقون.» | Inferred scope match: Shuba follows Yahya ibn Adam's address form rather than al-Ulaymi's third-person form. |

### Juz 21

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P181 | العنكبوت 29:55 ويقول ذوقوا | `[8, 8]`; `وَيَقُولُ` [1,2,9,10,11,12,13,14,19,20]<br>`وَنَقُولُ` [3,4,5,6,7,8,15,16,17,18] | 2/343: «(واختلفوا) في: ويقول ذوقوا فقرأ نافع، والكوفيون بالياء، وقرأ الباقون بالنون.» | Matched. Checked against the text. |
| P182 | العنكبوت 29:57 يرجعون | `[6, 6]`; `تُرۡجَعُونَ` [1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,19,20]<br>`تَرْجِعُونَ` [17,18]<br>`يُرْجَعُونَ` [9] | 2/343: «(واختلفوا) في: يرجعون، فروى أبو بكر بالغيب، وقرأ الباقون بالخطاب، ويعقوب على أصله في فتح التاء وكسر الجيم.» | Matched. Checked against the text. |
| P183 | العنكبوت 29:58 لنبوئنهم من الجنة | `[4, 4]`; `لَنُبَوِّئَنَّهُم` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`لَنُثْوِيَنَّهُمْ` [11,12,13,14,19,20] | 2/343: «(واختلفوا) في: لنبوئنهم من الجنة فقرأ حمزة والكسائي وخلف بالثاء المثلثة ساكنة بعد النون وإبدال الهمزة ياء من الثواء، وهو الإقامة، وقرأ الباقون بالباء الموحدة والهمز من (التبوء) وهو المنزل،» | Matched. Checked against the text. |
| P184 | العنكبوت 29:66 وليتمتعوا | `[3, 3]`; `وَلِيَتَمَتَّعُواْۚ` [2,5,6,7,8,9,10,15,16,17,18]<br>`وَلْيَتَمَتَّعُوا` [1,3,4,11,12,13,14,19,20] | 2/344: «(واختلفوا) في: وليتمتعوا فقرأ ابن كثير وحمزة والكسائي وخلف وقالون بإسكان اللام، وقرأ الباقون بكسرها،» | Matched. Checked against the text. |
| P185 | الروم 30:10 عاقبة الذين أساءوا | `[2, 2]`; `عَٰقِبَةَ` [7,8,9,10,11,12,13,14,19,20]<br>`عَاقِبَةُ` [1,2,3,4,5,6,15,16,17,18] | 2/344: «(واختلفوا) في: عاقبة الذين أساءوا فقرأ المدنيان، وابن كثير، والبصريان بالرفع، وقرأ الباقون بالنصب.» | Matched. Checked against the text. |
| P186 | الروم 30:11 إليه يرجعون | `[7, 7]`; `تُرۡجَعُونَ` [1,2,3,4,7,8,10,11,12,13,14,15,16,19,20]<br>`تَرْجِعُونَ` [17]<br>`يُرْجَعُونَ` [5,6,9]<br>`يَرْجِعُونَ` [18] | 2/344: «(واختلفوا) في: إليه يرجعون فقرأ أبو عمرو وأبو بكر وروح بالغيب، وقرأ الباقون بالخطاب. ويعقوب على أصله،» | Matched. Checked against the text. |
| P187 | الروم 30:22 للعالمين | `[12, 12]`; `لِّلۡعَٰلِمِينَ` [10]<br>`لِلْعَالَمِينَ` [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/344: «(واختلفوا) في: للعالمين، فروى حفص بكسر اللام،» | Matched. Checked against the text. |
| P188 | لقمان 31:3 هدى ورحمة | `[0, 1]`; `هُدٗى وَرَحۡمَةٗ` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18,19,20]<br>`هُدًى وَرَحْمَةٌ` [11,12] | 2/346: «(واختلفوا) في: هدى ورحمة فقرأ حمزة بالرفع، وقرأ الباقون بالنصب،» | Matched. Checked against the text. |
| P189 | السجدة 32:7 خلقه | `[4, 4]`; `خَلَقَهُۥۖ` [1,2,9,10,11,12,13,14,19,20]<br>`خَلْقَهُ` [3,4,5,6,7,8,15,16,17,18] | 2/347: «(واختلفوا) في: خلقه فقرأ نافع، والكوفيون بفتح اللام، وقرأ الباقون بإسكانها،» | Matched. Checked against the text. |
| P190 | الأحزاب 33:2 بما تعملون خبيرا وبما تعملون بصيرا | `[10, 10]`; `تَعۡمَلُونَ` [1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`يَعْمَلُونَ` [5,6] | 2/347: «(واختلفوا) في: بما تعملون خبيرا وبما تعملون بصيرا فقرأهما أبو عمرو بالغيب، وقرأهما الباقون بالخطاب،» | Matched. Checked against the text. |

### Juz 22

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P191 | الأحزاب 33:31 وتعمل صالحا نؤتها | `[6, 6]`; `وَتَعۡمَلۡ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`وَيَعْمَلْ` [11,12,13,14,19,20] | 2/348: «(واختلفوا) في: وتعمل صالحا نؤتها فقرأ حمزة والكسائي وخلف بالياء فيهما، وقرأ الباقون بالتاء على التأنيث في الأول، وبالنون في الثاني.» | Matched. Checked against the text. |
| P192 | الأحزاب 33:33 وقرن في بيوتكن | `[0, 0]`; `وَقَرۡنَ` [1,2,9,10,15,16]<br>`وَقِرْنَ` [3,4,5,6,7,8,11,12,13,14,17,18,19,20] | 2/348: «(واختلفوا) في: وقرن في بيوتكن فقرأ المدنيان، وعاصم بفتح القاف، وقرأ الباقون بكسرها،» | Matched. Checked against the text. |
| P193 | الأحزاب 33:36 أن يكون لهم | `[10, 11]`; `أَن يَكُونَ` [7,9,10,11,12,13,14,19,20]<br>`أَن تَكُونَ` [1,2,3,4,5,6,8,15,16,17,18] | 2/348: «(واختلفوا) في: أن يكون لهم فقرأ الكوفيون، وهشام بالياء على التذكير، وقرأ الباقون بالتاء على التأنيث.» | Matched. Checked against the text. |
| P194 | الأحزاب 33:40 وخاتم النبيين | `[10, 10]`; `وَخَاتَمَ` [9,10]<br>`وَخَاتِمَ` [1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19,20] | 2/348: «(واختلفوا) في: وخاتم النبيين فقرأ عاصم بفتح التاء، وقرأ الباقون بكسرها،» | Matched. Checked against the text. |
| P195 | الأحزاب 33:52 لا يحل لك | `[1, 1]`; `يَحِلُّ` [1,2,3,4,7,8,9,10,11,12,13,14,15,16,19,20]<br>`تَحِلُّ` [5,6,17,18] | 2/349: «(واختلفوا) في: لا يحل لك فقرأ البصريان بالتاء على التأنيث، وقرأ الباقون بالياء على التذكير،» | Matched. Checked against the text. |
| P197 | الأحزاب 33:67 سادتنا | `[4, 4]`; `سَادَتَنَا` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,19,20]<br>`سَادَاتِنَا` [7,8,17,18] | 2/349: «(واختلفوا) في: سادتنا فقرأ يعقوب وابن عامر (ساداتنا) بالجمع وكسر التاء، وقرأ الباقون بالتوحيد، ونصب التاء.» | Matched. Checked against the text. |
| P196 | الأحزاب 33:69 كبيرا | `[0, 0]`; `كَبِيرٗا يَٰٓأَيُّهَا` [9,10]<br>`كَثِيراً` [1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19,20] | 2/349: «(واختلفوا) في: لعنا كبيرا فقرأ عاصم بالباء الموحدة من تحت. واختلف عن هشام، فروى الداجوني عن أصحابه بالباء، وكذلك روى الحلواني، وغيره بالثاء المثلثة، وبذلك قرأ الباقون.» | F16: wording. Checked against the text. |
| P198 | سبأ 34:3 عالم الغيب | `[10, 10]`; `عَٰلِمِ` [3,4,5,6,9,10,18,19,20]<br>`عَالِمُ` [1,2,7,8,15,16,17]<br>`عَلاَّمِ` [11,12,13,14] | 2/349: «(واختلفوا) في: عالم الغيب فقرأ المدنيان، وابن عامر ورويس برفع الميم، وقرأ الباقون بخفضها، وانفرد بذلك رويس في التذكرة، وذلك غريب. وقرأ منهم حمزة والكسائي، " علام " بتشديد اللام مثل فعال،» | Inferred scope match: retain the dominant Ruways nominative; the Tadhkira exception is not a required additional form. |
| P199 | فاطر 35:3 غير الله | `[8, 9]`; `خَٰلِقٍ غَيۡرُ` [1,2,3,4,5,6,7,8,9,10,17,18]<br>`خَالِقٍ غَيْرِ` [11,12,13,14,15,16,19,20] | 2/351: «(واختلفوا) في: غير الله فقرأ أبو جعفر وحمزة والكسائي وخلف بخفض الراء، وقرأ الباقون برفعها،» | Matched. Checked against the text. |
| P200 | يس 36:5 تنزيل العزيز | `[0, 0]`; `تَنزِيلَ` [7,8,10,11,12,13,14,19,20]<br>`تَنزِيلُ` [1,2,3,4,5,6,9,15,16,17,18] | 2/353: «(واختلفوا) في: تنزيل العزيز فقرأ ابن عامر وحمزة والكسائي وخلف وحفص بنصب اللام، وقرأ الباقون برفعها» | Matched. Checked against the text. |

### Juz 23

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P201 | يس 36:29 إن كانت إلا صيحة واحدة في الموضعين | `[3, 4]`; `صَيۡحَةٗ وَٰحِدَةٗ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`صَيحَةٌ وَاحِدَةٌ` [15,16] | 2/353: «(واختلفوا) في: إن كانت إلا صيحة واحدة في الموضعين فقرأ أبو جعفر بالرفع فيهن على أن " كان " تامة و " صيحة " فاعل، أي: ما وقعت إلا صيحة واحدة، وقرأ الباقون بنصبهن على أن " كان " ناقصة، أي: ما كانت هي أي الأخذة إلا صيحة واحدة. (واتفقوا) على نصب ما ينظرون إلا صيحة إذ هو مفعول ينظرون،» | Matched. Checked against the text. |
| P202 | يس 36:35 وما عملته أيديهم | `[4, 6]`; `عَمِلَتۡهُ أَيۡدِيهِمۡۚ أَفَلَا` [1,2,3,4,5,6,7,8,10,15,16,17,18]<br>`عَمِلَتْ أَيْدِيهِمْ` [9,11,12,13,14,19,20] | 2/353: «(واختلفوا) في: وما عملته أيديهم فقرأ حمزة والكسائي وخلف وأبو بكر " عملت " بغير هاء ضمير، وهي في مصاحف أهل الكوفة كذلك، وقرأ الباقون بالهاء، ووصلها ابن كثير على أصله، وهو في مصاحفهم كذلك.» | Matched. Checked against the text. |
| P203 | يس 36:39 والقمر قدرناه | `[0, 0]`; `وَٱلۡقَمَرَ` [7,8,9,10,11,12,13,14,15,16,17,19,20]<br>`وَالْقَمَرُ` [1,2,3,4,5,6,18] | 2/353: «(واختلفوا) في: والقمر قدرناه فقرأ ابن كثير ونافع وأبو عمرو وروح برفع الراء، وقرأ الباقون بنصبها،» | Matched. Checked against the text. |
| P204 | يس 36:49 يخصمون | `[7, 7]`; `يَخِصِّمُونَ` [8,9,10,13,14,17,18,19,20]<br>`يَخْصِمُونَ` [11,12]<br>`يَخْصِّمُونَ` [1,15,16]<br>`يَخَصِّمُونَ` [1,2,3,4,5,6,7] | 2/353: «(واختلفوا) في: يخصمون فقرأ حمزة بفتح الياء، وإسكان الخاء وتخفيف الصاد، وقرأ أبو جعفر كذلك إلا أنه بتشديد الصاد فيجمع بين ساكنين، وقرأ ابن كثير وورش كذلك إلا أنه بإخلاص فتحة الخاء. وانفرد ابن مهران بذلك عن روح فلم يوافقه أحد من الأئمة عليه، وقرأه يعقوب والكسائي وخلف وابن ذكوان، وحفص كذلك إلا أنه بكسر الخاء. واختلف عن قالون وأبي عمرو وهشام وأبي بكر فأما قالون فقطع له الداني في جامع البيان بإسكان الخاء فقط كأبي جعفر، وهو الذي عليه العراقيون قاطبة، ولم يذكر صاحب العنوان له سواه، وقطع له الشاطبي باختلاس فتحة الخاء، وعليه أكثر المغاربة، وهو الذي في التذكرة لابن غلبون نصا، وفي التيسير اختيارا، وذكر له صاحب الكافي الوجهين جميعا …» | Inferred scope match only for lexical groups. The exact notation of Qalun's ikhtilas and sukun, and Abu Amr's ikhtilas, is not certified by full-vowel strings. |
| P205 | يس 36:55 فاكهون وفاكهين، وهو هنا والدخان والطور والمطففين | `[6, 6]`; `فَٰكِهُونَ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`فَكِهُونَ` [15,16] | 2/354–355: «(واختلفوا) في: فاكهون وفاكهين، وهو هنا والدخان والطور والمطففين، فقرأهن أبو جعفر بغير ألف بعد الفاء، ووافقه حفص في المطففين. واختلف فيه عن ابن عامر، فروى الرملي عن الصوري وغيره عن ابن ذكوان كحفص، وكذلك روى الشذائي عن ابن الأخرم عن الأخفش عنه، وهي رواية أحمد بن أنس عن ابن ذكوان. وروى الحافظ أبو العلاء عن الداجوني عن هشام كذلك، وهي رواية إبراهيم بن عباد عن هشام، وروى المطوعي عن الصوري والأخفش كلاهما عن ابن ذكوان بالألف، وكذا رواه الحلواني عن هشام وسائر أصحاب الداجوني عن أصحابه، وهشام. وهي رواية التغلبي عن ابن ذكوان ورواية ابن أبي حسان والباغندي عن هشام، وبذلك قرأ الباقون في الأربعة.» | Matched. Checked against the text. |
| P206 | يس 36:56 ظلال | `[3, 3]`; `ظِلَٰلٍ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`ظُلَلٍ` [11,12,13,14,19,20] | 2/355: «(واختلفوا) في: ظلال فقرأ حمزة والكسائي وخلف، " ظلل " بضم الظاء من غير ألف، وقرأ الباقون بكسر الظاء وألف،» | Matched. Checked against the text. |
| P207 | يس 36:62 جبلا | `[3, 3]`; `جِبِلّٗا` [1,2,9,10,15,16]<br>`جُبْلاً` [5,6,7,8]<br>`جُبُلاً` [3,4,11,12,13,14,17,19,20]<br>`جُبُلاًّ` [18] | 2/355: «(واختلفوا) في: جبلا فقرأ أبو عمرو وابن عامر بضم الجيم، وإسكان الباء وتخفيف اللام، وقرأ ابن كثير وحمزة والكسائي وخلف ورويس بضم الجيم والباء جميعا وتخفيف اللام. وروى روح كذلك إلا أنه بتشديد اللام. وقرأ الباقون بكسر الجيم والباء وتشديد اللام،» | Matched. Checked against the text. |
| P208 | الصافات 37:6 بزينة | `[4, 5]`; `بِزِينَةٍ ٱلۡكَوَاكِبِ` [10,11,12]<br>`بِزِينَةٍ الْكَوَاكِبَ` [9]<br>`بِزِينَةِ الْكَوَاكِبِ` [1,2,3,4,5,6,7,8,13,14,15,16,17,18,19,20] | 2/356: «(واختلفوا) في: بزينة فقرأ عاصم وحمزة بالتنوين، وقرأ الباقون بغير تنوين.» | Matched. Checked against the text. |
| P209 | ص 38:16 فواق | `[0, 0]`; `فَوَاقٖ وَقَالُواْ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`فُوَاقٍ وَقَالُوا` [11,12,13,14,19,20] | 2/361: «(واختلفوا) في: فواق فقرأ حمزة والكسائي، وخلف بضم الفاء، وقرأ الباقون بفتحها،» | F17: wording. Checked against the text. |
| P210 | الزمر 39:9 أمن هو قانت | `[0, 0]`; `أَمَّنۡ` [5,6,7,8,9,10,13,14,15,16,17,18,19,20]<br>`أَمَنْ` [1,2,3,4,11,12] | 2/362: «(واختلفوا) في: أمن هو قانت فقرأ ابن كثير ونافع وحمزة بتخفيف الميم، وقرأ الباقون بتشديدها،» | Matched. Checked against the text. |

### Juz 24

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P211 | الزمر 39:36 بكاف عبده | `[3, 3]`; `عَبۡدَهُۥۖ` [1,2,3,4,5,6,7,8,9,10,17,18]<br>`عِبَادَهُ` [11,12,13,14,15,16,19,20] | 2/362: «(واختلفوا) في: بكاف عبده فقرأ أبو جعفر وحمزة والكسائي وخلف، عباده بألف على الجمع، وقرأ الباقون عبده بغير ألف على التوحيد.» | Matched. Checked against the text. |
| P212 | الزمر 39:38 كاشفات ضره وممسكات رحمته | `[21, 23]`; `كَٰشِفَٰتُ ضُرِّهِۦٓ أَوۡ` [1,3,4,7,8,9,10,11,12,13,14,15,16,19,20]<br>`كَاشِفَاتٌ ضُرَّهُ أَو` [5,6,17,18] | 2/363: «(واختلفوا) في: كاشفات ضره وممسكات رحمته فقرأ البصريان بتنوين كاشفات وممسكات، ونصب ضره ورحمته، وقرأ الباقون بغير تنوين فيها وخفض ضره ورحمته.» | F18: missing reading. Checked against the text. |
| P213 | الزمر 39:42 قضى عليها الموت | `[12, 14]`; `قَضَىٰ عَلَيۡهَا ٱلۡمَوۡتَ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`قُضِىَ عَلَيْهَا الْمَوْتُ` [11,12,13,14,19,20] | 2/363: «(واختلفوا) في: قضى عليها الموت فقرأ حمزة والكسائي وخلف، قضي بضم القاف وكسر الضاد وفتح الياء الموت بالرفع، وقرأ الباقون بفتح القاف والضاد فتصير الياء ألفا، ونصب الموت،» | Matched. Checked against the text. |
| P214 | الزمر 39:61 بمفازتهم | `[4, 4]`; `بِمَفَازَتِهِمۡ` [1,2,3,4,5,6,7,8,10,15,16,17,18]<br>`بِمَفَازَاتِهِمْ` [9,11,12,13,14,19,20] | 2/363: «(واختلفوا) في: بمفازتهم فقرأ حمزة والكسائي وخلف وأبو بكر بألف على الجمع، وقرأ الباقون بغير ألف على الإفراد.» | Matched. Checked against the text. |
| P215 | الزمر 39:64 تأمروني | `[3, 4]`; `تَأۡمُرُوٓنِّيٓ أَعۡبُدُ` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`تَأْمُرُونَنِى` [7,8]<br>`تَامُرُونِىَ` [1,2,15,16] | 2/363: «(واختلفوا) في: تأمروني فقرأ المدنيان بتخفيف النون، وقرأ ابن عامر بنونين خفيفتين الأولى مفتوحة والثانية مكسورة، هذا الذي اجتمع عليه أكثر الرواة في روايتي هشام وابن ذكوان شرقا وغربا وكذا هي في المصحف الشامي. واختلف عن ابن ذكوان في حذف إحدى النونين، فروى بكر بن شاذان عن زيد عن الرملي عن الصوري عن ابن ذكوان بنون واحدة مخففة كنافع، وكذا روى أبو الحسين الخبازي عن الشذائي عن الرملي، وكذا روى أبو بكر القباب عن الرملي إلا أن الحافظ أبا العلاء روى التخيير بين التخفيف كنافع ونون كاملة، وكذا روى التغلبي وابن المعلى وابن أنس عن ابن ذكوان، وكذا روى سلامة بن هارون عن الأخفش، وروى سائر الرواة عن يزيد، وعن الرملي، وعن الصوري والأخفش بنونين كما قدمناه …» | Inferred scope match: al-Nashr adds single-nun routes for Ibn Dhakwan; the two-nun form is explicitly supported. |
| P216 | الزمر 39:71 فتحت وفتحت في الموضعين هنا، وفي النبأ | `[9, 10]`; `فُتِحَتۡ أَبۡوَٰبُهَا` [9,10,11,12,13,14,19,20]<br>`فُتِّحَتْ أَبْوَابُهَا` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/364: «(واختلفوا) في: فتحت وفتحت في الموضعين هنا، وفي النبأ، فقرأ الكوفيون بالتخفيف في الثلاثة، وقرأ الباقون بالتشديد فيهن.» | Matched. Checked against the text. |
| P217 | غافر 40:20 والذين يدعون | `[4, 4]`; `يَدۡعُونَ` [3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`تَدْعُونَ` [1,2,7] | 2/364: «(واختلفوا) في: والذين يدعون فقرأ نافع وهشام بالخطاب. واختلف عن ابن ذكوان، فروى الشريف أبو الفضل من جميع طرقه عن الأخفش عنه كذلك، وكذا رواه الصيدلاني وسلامة بن هارون عن الأخفش أيضا، وبه قطع له في المبهج، وكذا روى المطوعي عن الصوري عن ابن ذكوان من الطرق الخمسة، وقطع له الهذلي من طريق الداجوني، وهي رواية التغلبي وعبد الرزاق وأحمد بن أنس ومحمد بن إسماعيل الترمذي والحسين بن إسحاق وابن خرزاذ والإسكندراني، كلهم عن ابن ذكوان، وبه قطع الداني للصوري، وكذا رواه الوليد ، وابن بكار عن ابن عامر، ورواه الجمهور عن الأخفش والصوري جميعا بالغيب، وهي رواية محمد بن المعلى وإسحاق بن داود عن ابن ذكوان، وبذلك قرأ الباقون، وانفرد صاحب المبهج بذلك عن هشام بكماله …» | Matched. Checked against the text. |
| P218 | غافر 40:21 أشد منهم قوة | `[15, 16]`; `أَشَدَّ مِنۡهُمۡ` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`أَشَدَّ مِنكُمْ` [7,8] | 2/365: «(واختلفوا) في: أشد منهم قوة فقرأ ابن عامر منكم بالكاف، وكذا هو في المصحف الشامي، وقرأ الباقون بالهاء، وكذا هو في مصاحفهم.» | Matched. Checked against the text. |
| P219 | غافر 40:26 يظهر | `[13, 14]`; `أَن يُظۡهِرَ` [1,2,5,6,10,15,16,17,18]<br>`أَن يَظْهَرَ` [3,4,7,8,9,11,12,13,14,19,20] | 2/365: «(واختلفوا) في: يظهر فقرأ المدنيان، والبصريان وحفص يظهر بضم الياء وكسر الهاء الفساد بالنصب، وقرأ الباقون بفتح الياء والهاء (الفساد) بالرفع،» | Matched. Checked against the text. |
| P220 | فصلت 41:16 نحسات | `[6, 6]`; `نَّحِسَاتٖ` [7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`نَحْسَاتٍ` [1,2,3,4,5,6,17,18] | 2/366: «واختلفوا في نحسات فقرأ أبو جعفر وابن عامر والكوفيون بكسر الحاء وقرأ الباقون بإسكانها.» | F19: wrong reader; extra reading. Checked against the text. |

### Juz 25

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P221 | فصلت 41:47 ثمرات | `[8, 8]`; `ثَمَرَٰتٖ` [1,2,7,8,10,15,16]<br>`ثَمَرَةٍ` [3,4,5,6,9,11,12,13,14,17,18,19,20] | 2/367: «(واختلفوا) في ثمرات فقرأ ابن كثير، والبصريان، وحمزة والكسائي وخلف وأبو بكر بغير ألف على التوحيد، وقرأ الباقون بالألف على الجمع،» | Matched. Checked against the text. |
| P222 | الشورى 42:3 يوحي إليك | `[1, 2]`; `يُوحِيٓ إِلَيۡكَ` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`يُوحَى` [3,4] | 2/367: «(واختلفوا) في: يوحي إليك فقرأ ابن كثير بفتح الحاء على التجهيل، وقرأ الباقون بكسرها على التسمية،» | Matched. Checked against the text. |
| P223 | الشورى 42:25 ما تفعلون | `[11, 11]`; `تَفۡعَلُونَ` [10,11,12,13,14,19,20]<br>`يَفْعَلُونَ` [1,2,3,4,5,6,7,8,9,15,16,17,18] | 2/367: «(واختلفوا) في: ما تفعلون فقرأ حمزة والكسائي وخلف وحفص بالخطاب. واختلف عن رويس، فروى عنه أبو الطيب الخلاف كذلك، وروى غيره الغيب، وبذلك قرأ الباقون. وقد وقع في غاية الحافظ أبي العلاء أن النخاس عن رويس بالخطاب، وهو سهو، وصوابه أبو الطيب - والله أعلم -.» | Matched. Checked against the text. |
| P224 | الشورى 42:30 فبما كسبت | `[4, 4]`; `فَبِمَا` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`بِمَا` [1,2,7,8,15,16] | 2/367: «(واختلفوا) في: فبما كسبت فقرأ المدنيان، وابن عامر بما بغير فاء قبل الباء، وكذلك هي في مصاحف المدينة والشام. وقرأ الباقون بالفاء، وكذلك هي في مصاحفهم،» | Matched. Checked against the text. |
| P225 | الشورى 42:35 ويعلم الذين | `[0, 0]`; `كَثِيرٖ وَيَعۡلَمَ` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`كَثِيرٍ وَيَعْلَمُ` [1,2,7,8,15,16] | 2/367: «(واختلفوا) في: ويعلم الذين فقرأ ابن عامر والمدنيان برفع الميم، وقرأ الباقون بنصبها.» | F20: wording. Checked against the text. |
| P226 | الشورى 42:37 كبائر الإثم هنا والنجم | `[2, 2]`; `كَبَٰٓئِرَ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`كَبِيرَ` [11,12,13,14,19,20] | 2/367: «(واختلفوا) في: كبائر الإثم هنا والنجم فقرأ حمزة والكسائي وخلف، (كبير) بكسر الباء من غير ألف، ولا همزة، على التوحيد في الموضعين، وقرأ الباقون بفتح الباء وألف، وهمزة مكسورة بعدها فيهما على الجمع.» | Matched. Checked against the text. |
| P227 | الزخرف 43:19 عباد الرحمن | `[4, 4]`; `عِبَٰدُ` [5,6,9,10,11,12,13,14,19,20]<br>`عِنْدَ` [1,2,3,4,7,8,15,16,17,18] | 2/368: «(واختلفوا) في: عباد الرحمن فقرأ المدنيان، وابن كثير وابن عامر ويعقوب (عند) بالنون ساكنة وفتح الدال من غير ألف على أنه ظرف. وقرأ الباقون بالباء وألف بعدها ورفع الدال، جمع عبد.» | Matched. Checked against the text. |
| P228 | الزخرف 43:19 أشهدوا | `[7, 7]`; `أَشَهِدُواْ` [3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`أَآؤُشْهِدُوا` [1,2,15,16] | 2/368: «(واختلفوا) في: أشهدوا فقرأه المدنيان (أأشهدوا) بهمزتين الأولى مفتوحة والثانية مضمومة مسهلة، على أصلهما مع إسكان الشين، وفصل بينهما بألف أبو جعفر وقالون بخلاف على أصلهما المتقدم في باب الهمزتين من كلمة. وقرأ الباقون بهمزة واحدة مفتوحة وفتح الشين.» | Matched. Checked against the text. |
| P229 | الدخان 44:45 كالمهل يغلي | `[1, 1]`; `يَغۡلِي` [3,4,10,17]<br>`تَغْلِى` [1,2,5,6,7,8,9,11,12,13,14,15,16,18,19,20] | 2/371: «(واختلفوا) في: كالمهل يغلي فقرأ ابن كثير وحفص ورويس بالياء على التذكير، وقرأ الباقون بالتاء على التأنيث.» | Matched. Checked against the text. |
| P230 | الجاثية 45:6 وآياته يؤمنون | `[11, 11]`; `يُؤۡمِنُونَ` [1,2,3,4,5,6,10,15,16,18]<br>`تُؤْمِنُونَ` [7,8,9,11,12,13,14,17,19,20] | 2/371: «(واختلفوا) في: وآياته يؤمنون فقرأ المدنيان، وابن كثير وأبو عمرو وروح وحفص بالغيب، وقرأ الباقون بالخطاب، وقد وقع في بعض نسخ الإرشاد أن يعقوب قرأه بالغيب وتبعه عليه الديواني، وهو غلط،» | Matched. Checked against the text. |

### Juz 26

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P231 | الأحقاف 46:12 لينذر الذين | `[11, 11]`; `لِّيُنذِرَ` [4,5,6,9,10,11,12,13,14,19,20]<br>`لِتُنذِرَ` [1,2,3,7,8,15,16,17,18] | 2/372: «(واختلفوا) في: لينذر الذين فقرأ المدنيان، وابن عامر ويعقوب بالخطاب، واختلف عن البزي، فروى عبد العزيز الفارسي والشنبوذي عن النقاش كذلك، وهو رواية الخزاعي واللهبيين، وابن هارون عن البزي، وبذلك قرأ الداني من طريق أبي ربيعة. وإطلاقه الخلاف في التيسير خروج عن طريقيه، وروى الطبري والفحام والحمامي عن النقاش وابن بنان عن أبي ربيعة وابن الحباب عن البزي بالغيب، وبذلك قرأ الباقون.» | Inferred scope match: the stored Bazzi address form is explicitly the Taysir route; the additional third-person route does not make it wrong. |
| P232 | الأحقاف 46:15 بوالديه حسنا | `[3, 3]`; `إِحۡسَٰنًاۖ` [9,10,11,12,13,14,19,20]<br>`حُسْنًا` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/373: «(واختلفوا) في: بوالديه حسنا فقرأ الكوفيون إحسانا بزيادة همزة مكسورة قبل الحاء، وإسكان الحاء وفتح السين وألف بعدها، وكذلك هي في مصاحف الكوفة. وقرأ الباقون بضم الحاء، وإسكان السين من غير همزة، ولا ألف، وكذلك هي في مصاحفهم،» | Matched. Checked against the text. |
| P233 | الأحقاف 46:15 وفصاله | `[10, 10]`; `وَفِصَٰلُهُۥ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`وَفَصْلُهُ` [17,18] | 2/373: «(واختلفوا) في: وفصاله فقرأ يعقوب وفصله بفتح الفاء، وإسكان الصاد من غير ألف، وقرأ الباقون بكسر الفاء وفتح الصاد وألف بعدها.» | Matched. Checked against the text. |
| P234 | الأحقاف 46:16 نتقبل عنهم أحسن، ونتجاوز | `[2, 2]`; `نَتَقَبَّلُ` [10,11,12,13,14,19,20]<br>`يُتَقَبَّلُ` [1,2,3,4,5,6,7,8,9,15,16,17,18] | 2/373: «(واختلفوا) في: نتقبل عنهم أحسن، ونتجاوز فقرأ حمزة والكسائي وخلف وحفص بنون مفتوحة فيهما أحسن بالنصب، وقرأ الباقون بالياء مضمومة فيهما أحسن بالرفع،» | Matched. Checked against the text. |
| P235 | الأحقاف 46:19 وليوفيهم | `[4, 4]`; `وَلِيُوَفِّيَهُمۡ` [3,4,5,6,7,9,10,17,18]<br>`وَلِنُوَفِّيَهُمْ` [1,2,8,11,12,13,14,15,16,19,20] | 2/373: «(واختلفوا) في: وليوفيهم فقرأ ابن كثير، والبصريان، وعاصم بالياء. واختلف عن هشام، فروى الحلواني عنه كذلك، وروى الداجوني عن أصحابه عنه بالنون، وكذلك قرأ الباقون،» | Inferred scope match: Hisham's ya form follows Halwani; the Dajuni nun form is not automatically missing. |
| P236 | محمد 47:15 غير آسن | `[10, 11]`; `ءَاسِنٖ وَأَنۡهَٰرٞ` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`أَسِنٍ وَأَنْهَارٌ` [3,4] | 2/374: «(واختلفوا) في: غير آسن فقرأ ابن كثير بغير مد بعد الهمزة، وقرأ الباقون بالمد. واختلف عن البزي في آنفا، فروى الداني من قراءته على أبي الفتح عن السامري عن أصحابه عن أبي ربيعة بقصر الهمزة، وقد انفرد بذلك أبو الفتح فكل أصحاب السامري لم يذكروا القصر عن البزي. وأصحاب السامري الذين أخذ عنهم من أصحاب أبي ربيعة هم محمد بن عبد العزيز وابن الصباح وأحمد بن محمد بن هارون بن بقرة، ومنهم سلامة بن هارون البصري صاحب أبي معمر الجمحي صاحب البزي، فلم يأت عن أحد منهم قصر، وعلى تقدير أن يكونوا رووا القصر فلم يكونوا من طرق التيسير، فلا وجه لإدخال هذا الوجه في طرق الشاطبية، والتيسير. (نعم) روى سبط الخياط القصر من طريق النقاش عن أبي ربيعة، ومن سائر طرقه عن أبي ربيعة …» | Matched. Checked against the text. |
| P237 | الفتح 48:9 لتؤمنوا بالله ورسوله وتعزروه وتوقروه وتسبحوه | `[0, 0]`; `لِّتُؤۡمِنُواْ` [1,2,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`لِيُؤْمِنُوا` [3,4,5,6] | 2/375: «(واختلفوا) في: لتؤمنوا بالله ورسوله وتعزروه وتوقروه وتسبحوه فقرأ ابن كثير وأبو عمرو بالغيب في الأربعة، وقرأ الباقون بالخطاب،» | Matched. Checked against the text. |
| P238 | الحجرات 49:1 لا تقدموا | `[4, 4]`; `تُقَدِّمُواْ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`تَقَدَّمُوا` [17,18] | 2/375: «(واختلفوا) في: لا تقدموا فقرأ يعقوب بفتح التاء والدال، وقرأ الباقون بضم التاء وكسر الدال.» | Matched. Checked against the text. |
| P239 | ق 50:30 يوم يقول | `[1, 2]`; `نَقُولُ لِجَهَنَّمَ` [3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20]<br>`يَقُولُ لِجَهَنَّمَ` [1,2,9] | 2/376: «(واختلفوا) في: يوم يقول فقرأ نافع وأبو بكر بالياء، وقرأ الباقون بالنون.» | Matched. Checked against the text. |
| P240 | الذاريات 51:23 مثل ما | `[5, 5]`; `مِّثۡلَ` [1,2,3,4,5,6,7,8,10,15,16,17,18]<br>`مِثْلُ` [9,11,12,13,14,19,20] | 2/377: «(واختلفوا) في: مثل ما فقرأ حمزة والكسائي وخلف وأبو بكر بالرفع، وقرأ الباقون بالنصب،» | Matched. Checked against the text. |

### Juz 27

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P241 | الذاريات 51:44 الصاعقة | `[5, 5]`; `ٱلصَّٰعِقَةُ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`الصَّعْقَةُ` [13,14] | 2/377: «(واختلفوا) في: الصاعقة فقرأ الكسائي الصعقة بإسكان العين من غير ألف، وقرأ الباقون بكسر العين وألف قبلها.» | Matched. Checked against the text. |
| P242 | الذاريات 51:46 وقوم نوح | `[0, 0]`; `وَقَوۡمَ` [1,2,3,4,7,8,9,10,15,16,17,18]<br>`وَقَوْمِ` [5,6,11,12,13,14,19,20] | 2/377: «(واختلفوا) في: وقوم نوح فقرأ أبو عمرو وحمزة والكسائي وخلف بخفض الميم، وقرأ الباقون بنصبها.» | Matched. Checked against the text. |
| P243 | الطور 52:21 واتبعتهم | `[2, 3]`; `وَٱتَّبَعَتۡهُمۡ ذُرِّيَّتُهُم` [1,2,3,4,9,10,11,12,13,14,15,16,19,20]<br>`وَأَتْبَعْنَاهُمْ ذُرِّيَّاتِهِمْ` [5,6]<br>`وَاتَّبَعَتْهُمْ ذُرِّيَاتِهِمْ` [7,8,17,18] | 2/377: «(واختلفوا) في: واتبعتهم فقرأ أبو عمرو وأتبعناهم بقطع الهمزة وفتحها، وإسكان التاء والعين ونون وألف بعدها، وقرأ الباقون بوصل الهمزة وتشديد التاء وفتح العين وتاء ساكنة بعدها.» | Matched. Checked against the text. |
| P244 | الطور 52:28 ندعوه إنه | `[5, 6]`; `إِنَّهُۥ هُوَ` [3,4,5,6,7,8,9,10,11,12,17,18,19,20]<br>`أَنَّهُ هُوَ` [1,2,13,14,15,16] | 2/378: «(واختلفوا) في: ندعوه إنه فقرأ المدنيان، والكسائي بفتح الهمزة، وقرأ الباقون بكسرها.» | Matched. Checked against the text. |
| P245 | الطور 52:45 يصعقون | `[6, 6]`; `يُصۡعَقُونَ` [7,8,9,10]<br>`يَصْعَقُونَ` [1,2,3,4,5,6,11,12,13,14,15,16,17,18,19,20] | 2/379: «(واختلفوا) في: يصعقون فقرأ ابن عامر وعاصم بضم الياء، وقرأ الباقون بفتحها.» | Matched. Checked against the text. |
| P246 | النجم 53:11 ما كذب الفؤاد | `[0, 1]`; `مَا كَذَبَ` [1,2,3,4,5,6,8,9,10,11,12,13,14,17,18,19,20]<br>`ما كَذَّبَ` [7,15,16] | 2/379: «(واختلفوا) في: ما كذب الفؤاد فقرأ أبو جعفر وهشام بتشديد الذال، وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |
| P247 | القمر 54:4 مستقر ولقد | `[0, 0]`; `مُّسۡتَقِرّٞ وَلَقَدۡ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`مُسْتَقِرٍّ وَلَقَدْ` [15,16] | 2/380: «(واختلفوا) في: مستقر ولقد فقرأ أبو جعفر بخفض الراء، وقرأ الباقون برفعها،» | F21: wording. Checked against the text. |
| P248 | الرحمن 55:31 سنفرغ لكم | `[0, 0]`; `سَنَفۡرُغُ` [1,2,3,4,5,6,7,8,9,10,15,16,19,20]<br>`سَيَفْرُغُ` [11,12,13,14,17,18] | 2/381: «(واختلفوا) في: سنفرغ لكم فقرأ حمزة، والكسائي، وخلف بالياء، وقرأ الباقون بالنون،» | F22: wrong reader. Checked against the text. |
| P249 | الواقعة 56:22 حور عين | `[0, 1]`; `وَحُورٌ عِينٞ` [1,2,3,4,5,6,7,8,9,10,17,18,19,20]<br>`وَحُورٍ عِينٍ` [11,12,13,14,15,16] | 2/383: «(واختلفوا) في: حور عين فقرأ أبو جعفر، وحمزة، والكسائي بخفض الاسمين، وقرأهما الباقون بالرفع،» | Matched. Checked against the text. |
| P250 | الحديد 57:8 وقد أخذ ميثاقكم | `[9, 12]`; `وَقَدۡ أَخَذَ مِيثَٰقَكُمۡ إِن` [1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`وَقَدْ أُخِذَ مِيثَاقُكُمْ` [5,6] | 2/384: «(واختلفوا) في: وقد أخذ ميثاقكم فقرأ أبو عمرو بضم الهمزة وكسر الخاء " ميثاقكم " بالرفع، وقرأ الباقون بفتح الهمزة والخاء، ونصب ميثاقكم،» | Matched. Checked against the text. |

### Juz 28

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P251 | المجادلة 58:2 يظاهرون | `[1, 1]`; `يُظَٰهِرُونَ` [9,10]<br>`يَظَّاهَرُون` [7,8,11,12,13,14,15,16,19,20]<br>`يَظَّهَّرُونَ` [1,2,3,4,5,6,17,18] | 2/385: «(واختلفوا) في: يظاهرون فقرأ عاصم بضم الياء وتخفيف الظاء والهاء وكسرها وألف بينهما في الموضعين. وقرأ أبو جعفر، وابن عامر، وحمزة، والكسائي، وخلف بفتح الياء وتشديد الظاء وألف بعدها وتخفيف الهاء وفتحها. وقرأ الباقون كذلك إلا أنه بتشديد الهاء من غير ألف قبلها،» | Matched. Checked against the text. |
| P252 | المجادلة 58:7 ما يكون | `[11, 12]`; `مَا يَكُونُ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`مَا تَكُونُ` [15,16] | 2/385: «(واختلفوا) في: ما يكون فقرأ أبو جعفر بالتاء على التأنيث، وقرأ الباقون بالياء على التذكير.» | Matched. Checked against the text. |
| P253 | المجادلة 58:7 ولا أكثر | `[29, 29]`; `أَكۡثَرَ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`أَكْثَرُ` [17,18] | 2/385: «(واختلفوا) في: ولا أكثر فقرأ يعقوب " أكثر " بالرفع، وقرأ الباقون بالنصب.» | Matched. Checked against the text. |
| P254 | المجادلة 58:8 ويتناجون | `[12, 12]`; `وَيَتَنَٰجَوۡنَ` [1,2,3,4,5,6,7,8,9,10,13,14,15,16,18,19,20]<br>`وَيَنتَجُونَ` [11,12,17] | 2/385: «(واختلفوا) في: ويتناجون فقرأ حمزة، ورويس بنون ساكنة بعد الياء وضم الجيم من غير ألف على يفتعلون، زاد رويس " فلا تنتجوا " بهذه الترجمة، وقرأ الباقون بتاء ونون مفتوحتين، وبعدها ألف، وفتح الجيم على يتفاعلون في الحرفين،» | Matched. Checked against the text. |
| P255 | الحشر 59:2 يخربون | `[32, 32]`; `يُخۡرِبُونَ` [1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`يُخَرِّبُونَ` [5,6] | 2/386: «(واختلفوا) في: يخربون فقرأ أبو عمرو بالتشديد، وقرأ الباقون بالتخفيف،» | Matched. Checked against the text. |
| P256 | الممتحنة 60:3 يفصل بينكم | `[7, 7]`; `يَفۡصِلُ` [9,10,17,18]<br>`يُفْصَلُ` [1,2,3,4,5,6,15,16]<br>`يُفَصَّلُ` [7,8]<br>`يُفَصِّلُ` [11,12,13,14,19,20] | 2/387: «(واختلفوا) في: يفصل بينكم فقرأ عاصم، ويعقوب بفتح الياء، وإسكان الفاء، وكسر الصاد مخففة، وقرأ حمزة، والكسائي، وخلف بضم الياء وفتح الفاء وكسر الصاد مشددة، وروى ابن ذكوان بضم الياء وفتح الفاء، والصاد مشددة، واختلف عن هشام، فروى عنه الحلواني كذلك، وروى عنه الداجوني بضم الياء، وإسكان الفاء وفتح الصاد مخففة، وكذلك قرأ الباقون،» | Inferred scope match: Hisham's doubled passive follows Halwani; Dajuni's light passive is an additional route. |
| P257 | الصف 61:8 متم نوره | `[6, 7]`; `مُتِمُّ نُورِهِۦ` [3,4,10,11,12,13,14,19,20]<br>`مُتِمٌّ نُورَهُ` [1,2,5,6,7,8,9,15,16,17,18] | 2/387: «(واختلفوا) في: متم نوره فقرأ ابن كثير، وحمزة، والكسائي، وخلف، وحفص متم بغير تنوين نوره بالخفض، وقرأ الباقون بالتنوين والنصب،» | Matched. Checked against the text. |
| P258 | المنافقون 63:5 لووا | `[8, 8]`; `لَوَّوۡاْ` [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20]<br>`لَوَوْا` [1,2,18] | 2/388: «(واختلفوا) في: لووا فقرأ نافع، وروح بتخفيف الواو الأولى، وقرأ الباقون بتشديدها،» | Matched. Checked against the text. |
| P259 | التغابن 64:9 يوم يجمعكم | `[1, 1]`; `يَجۡمَعُكُمۡ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`نَجْمَعُكُمْ` [17,18] | 2/388: «(واختلفوا) في: يوم يجمعكم فقرأ يعقوب بالنون، وانفرد ابن مهران بالياء عن روح، وبذلك قرأ الباقون،» | Matched. Checked against the text. |
| P290 | الطلاق 65:3 بالغ | `[13, 14]`; `بَٰلِغُ أَمۡرِهِۦۚ` [10]<br>`بَالِغُ أَمْرَهُ` [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20] | 2/388: «(واختلفوا) في: بالغ أمره، فروى حفص بالغ بغير تنوين أمره بالخفض، وقرأ الباقون بالتنوين والنصب،» | F23: wording. Checked against the text. |
| P260 | التحريم 66:12 وكتابه | `[13, 13]`; `وَكُتُبِهِۦ` [5,6,10,17,18]<br>`وَكِتَابِهِ` [1,2,3,4,7,8,9,11,12,13,14,15,16,19,20] | 2/389: «واختلفوا في وكتابه فقرأ البصريان وحفص بضم الكاف والتاء من غير ألف على الجمع وقرأ الباقون بكسر الكاف وفتح التاء وألف بعدها على التوحيد.» | Matched. Checked against the text. |

### Juz 29

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P261 | الملك 67:3 تفاوت | `[11, 11]`; `تَفَٰوُتٖۖ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18,19,20]<br>`تَفَوُّتٍ` [11,12,13,14] | 2/389: «(واختلفوا) في: تفاوت فقرأ حمزة، والكسائي، " تفوت " بضم الواو مشددة من غير ألف، وقرأ الباقون بألف والتخفيف،» | Matched. Checked against the text. |
| P262 | القلم 68:51 ليزلقونك | `[4, 4]`; `لَيُزۡلِقُونَكَ` [3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`لَيَزْلِقُونَكَ` [1,2,15,16] | 2/389: «(واختلفوا) في: ليزلقونك فقرأ المدنيان بفتح الياء، وقرأ الباقون بضمها،» | Matched. Checked against the text. |
| P263 | الحاقة 69:9 قبله | `[3, 3]`; `قَبۡلَهُۥ` [1,2,3,4,7,8,9,10,11,12,15,16,19,20]<br>`قِبَلَهُ` [5,6,13,14,17,18] | 2/389: «(واختلفوا) في: قبله فقرأ البصريان، والكسائي بكسر القاف وفتح الباء، وقرأ الباقون بفتح القاف، وإسكان الباء،» | Matched. Checked against the text. |
| P264 | المعارج 70:4 تعرج | `[0, 0]`; `ٱلۡمَعَارِجِ تَعۡرُجُ` [1,2,3,4,5,7,8,9,10,11,12,15,16,17,18,19,20]<br>`المَعَارِ تَّعْرُجُ` [6]<br>`المَعَارِجِ يَعْرُجُ` [13,14] | 2/390: «(واختلفوا) في: تعرج الملائكة فقرأ الكسائي بالياء على التذكير، وقرأ الباقون بالتاء على التأنيث.» | F24: wording. Checked against the text. |
| P265 | نوح 71:21 وولده | `[10, 11]`; `وَوَلَدُهُۥٓ إِلَّا` [1,2,7,8,9,10,15,16]<br>`وَوُلْدُهُ إِلاَّ` [3,4,5,6,11,12,13,14,17,18,19,20] | 2/391: «(واختلفوا) في: وولده فقرأ المدنيان، وابن عامر، وعاصم بفتح الواو واللام، وقرأ الباقون بضم الواو، وإسكان اللام.» | Matched. Checked against the text. |
| P266 | الجن 72:5 أن لن تقول | `[4, 4]`; `تَقُولَ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,20]<br>`تَقَوَّلَ` [17,18] | 2/392: «(واختلفوا) في: أن لن تقول فقرأ يعقوب بفتح القاف والواو مشددة، وقرأ الباقون بضم القاف، وإسكان الواو مخففة،» | Matched. Checked against the text. |
| P267 | المزمل 73:20 ونصفه وثلثه | `[10, 11]`; `وَنِصۡفَهُۥ وَثُلُثَهُۥ` [3,4,9,10,11,12,13,14,19,20]<br>`وَنِصْفِهِ وَثُلُثِهِ` [1,2,5,6,7,8,15,16,17,18] | 2/393: «(واختلفوا) في: ونصفه وثلثه فقرأ ابن كثير، والكوفيون بنصب الفاء والثاء وضم الهاءين، وقرأ الباقون بخفض الفاء والثاء وكسر الهاءين.» | Matched. Checked against the text. |
| P268 | المدثر 74:5 والرجز فاهجر | `[0, 1]`; `وَٱلرُّجۡزَ فَٱهۡجُرۡ` [10,15,16,17,18]<br>`والرِّجْزَ` [1,2,3,4,5,6,7,8,9,11,12,13,14,19,20] | 2/393: «(واختلفوا) في: والرجز فاهجر فقرأ أبو جعفر ويعقوب، وحفص بضم راء " الرجز "، وقرأ الباقون بكسرها،» | Matched. Checked against the text. |
| P269 | القيامة 75:7 فإذا برق البصر | `[1, 1]`; `بَرِقَ` [3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`بَرَقَ` [1,2,15,16] | 2/393: «(واختلفوا) في: فإذا برق البصر فقرأ المدنيان بفتح الراء، وقرأ الباقون بكسرها.» | Matched. Checked against the text. |
| P270 | الإنسان 76:4 سلاسلا | `[3, 4]`; `سَلَٰسِلَاْ وَأَغۡلَٰلٗا` [3,4,5,6,8,10,11,12,17,18,19,20]<br>`سَلاَسِلاً وَأَغْلاَلاً` [1,2,7,9,13,14,15,16] | 2/394: «(واختلفوا) في: سلاسلا فقرأ المدنيان، والكسائي، وأبو بكر، ورويس من طريق أبي الطيب غلام ابن شنبوذ، وهشام من طريق الحلواني والشذائي عن الداجوني بالتنوين، ولم يذكر السعيدي في تبصرته عن رويس خلافه ووقفوا عليه بالألف بدلا منه. وقرأ الباقون وزيد عن الداجوني بغير تنوين، ووقف منهم بألف أبو عمرو، وروح من طريق المعدل، واختلف عن ابن كثير، وابن ذكوان، وحفص، فروى الحمامي عن النقاش عن أبي ربيعة، وابن الحباب، كلاهما عن البزي، وابن شنبوذ عن قنبل، وغالب العراقيين كأبي العز، والحافظ أبي العلاء، وأكثر المغاربة كابن سفيان، ومكي، والمهدوي، وابن بليمة، وابن شريح، وابني غلبون، وصاحب العنوان عن ابن ذكوان، وأجمع من ذكرت من المغاربة، والمصريين عن حفص …» | Inferred scope match: Hisham's tanwin follows Halwani; additional Ruways/Dajuni routes are not automatically missing. |
| P271 | المرسلات 77:23 فقدرنا | `[0, 0]`; `فَقَدَرۡنَا` [3,4,5,6,7,8,9,10,11,12,17,18,19,20]<br>`فَقَدَّرْنَا` [1,2,13,14,15,16] | 2/397: «(واختلفوا) في: فقدرنا فقرأ المدنيان، والكسائي بتشديد الدال، وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |

### Juz 30

| ID | Position, surah first | Stored range and forms with rawis | Al-Nashr, volume/page and text | Result and evidence |
| --- | --- | --- | --- | --- |
| P272 | النبأ 78:35 ولا كذابا | `[4, 5]`; `وَلَا كِذَّٰبٗا` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`وَلاَ كِذَابًا` [13,14] | 2/397: «(واختلفوا) في: ولا كذابا فقرأ الكسائي بتخفيف الذال، وقرأ الباقون بتشديدها. (واتفقوا) على قوله تعالى: وكذبوا بآياتنا كذابا في هذه السورة أنه بالتشديد لوجود فعله معه.» | Matched. Checked against the text. |
| P273 | النازعات 79:18 تزكى | `[5, 5]`; `تَزَكَّىٰ` [7,8,9,10,11,12,13,14,19,20]<br>`تَزَّكَى` [1,2,3,4,15,16,17,18]<br>`تَزَكَى` [5,6] | 2/398: «(واختلفوا) في: إلى أن تزكى فقرأ المدنيان، وابن كثير ويعقوب بتشديد الزاي، وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |
| P274 | عبس 80:4 فتنفعه | `[2, 2]`; `فَتَنفَعَهُ` [9,10]<br>`فَتَنفَعُهُ` [1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19,20] | 2/398: «(واختلفوا) في: فتنفعه فقرأ عاصم بنصب العين، وقرأ الباقون برفعها.» | Matched. Checked against the text. |
| P275 | التكوير 81:6 سجرت | `[2, 2]`; `سُجِّرَتۡ` [1,2,7,8,9,10,11,12,13,14,15,16,19,20]<br>`سُجِرَتْ` [3,4,5,6,17,18] | 2/398: «(واختلفوا) في: سجرت فقرأ ابن كثير، والبصريان إلا أبا الطيب عن رويس بتخفيف الجيم، وقرأ الباقون، وأبو الطيب عن رويس بتشديدها،» | Inferred scope match: the extra Abu al-Tayyib route for Ruways is not automatically missing. |
| P276 | الانفطار 82:7 فعدلك | `[3, 3]`; `فَعَدَلَكَ` [9,10,11,12,13,14,19,20]<br>`فَعَدَّلَكَ` [1,2,3,4,5,6,7,8,15,16,17,18] | 2/399: «(واختلفوا) في: فعدلك فقرأ الكوفيون بتخفيف الدال، وقرأ الباقون بتشديدها.» | Matched. Checked against the text. |
| P277 | المطففين 83:24 تعرف في وجوههم نضرة | `[0, 1]`; `تَعۡرِفُ فِي` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,19,20]<br>`تُعْرَفُ فِى` [15,16,17,18] | 2/399: «واختلفوا في تعرف في وجوههم نضرة فقرأ أبو جعفر ويعقوب بضم التاء وفتح الراء ورفع نضرة وقرأ الباقون بفتح التاء وكسر الراء ونصب نضرة.» | Matched. Checked against the text. |
| P278 | الانشقاق 84:12 ويصلى سعيرا | `[0, 0]`; `ثُبُورٗا وَيَصۡلَىٰ` [5,6,9,10,11,12,15,16,17,18,19,20]<br>`ثُبُورًا وَيُصَلَّى` [1,2,3,4,7,8,13,14] | 2/399: «(واختلفوا) في: ويصلى سعيرا فقرأ نافع، وابن كثير، وابن عامر، والكسائي بضم الياء وفتح الصاد وتشديد اللام، وقرأ الباقون بفتح الياء، وإسكان الصاد وتخفيف اللام.» | F25: wording. Checked against the text. |
| P279 | البروج 85:15 العرش المجيد | `[2, 2]`; `ٱلۡمَجِيدُ` [1,2,3,4,5,6,7,8,9,10,15,16,17,18]<br>`الْمَجيدِ` [11,12,13,14,19,20] | 2/399: «(واختلفوا) في: العرش المجيد فقرأ حمزة، والكسائي، وخلف بخفض الدال، وقرأ الباقون برفعها،» | Matched. Checked against the text. |
| P291 | الطارق 86:4 لما | `[3, 3]`; `لَّمَّا` [7,8,9,10,11,12,15,16]<br>`لَمَا` [1,2,3,4,5,6,13,14,17,18,19,20] | 2/291: «(واختلفوا) في: لما هنا، ويس، والزخرف، والطارق فقرأ أبو جعفر وابن عامر وعاصم وحمزة بتشديد الميم هنا والطارق، وشددها في يس لما جميع ابن عامر وعاصم وحمزة وابن جماز وشددها في الزخرف لما متاع عاصم وحمزة وابن جماز; واختلف فيه عن هشام، فروى عنه المشارقة قاطبة، وأكثر المغاربة تشديدها كذلك من جميع طرقه إلا أن الحافظ أبا عمرو الداني أثبت له الوجهين أعني بالتخفيف والتشديد في جامع البيان وأطلق الخلاف له في التيسير واقتصر له على الخلاف فقط في مفرداته. قال في جامعه: وبذلك - يعني التخفيف - قرأت على أبي الفتح في رواية الحلواني وابن عباد عن هشام، وقال لي: التشديد اختيار من هشام. (قلت) : والوجهان صحيحان عن هشام …» | Matched. Checked against the text. |
| P280 | الأعلى 87:3 والذي قدر | `[1, 1]`; `قَدَّرَ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20]<br>`قَدَرَ` [13,14] | 2/399–400: «(واختلفوا) في: والذي قدر فقرأ الكسائي قدر بتخفيف الدال وقرأ الباقون بتشديدها» | Matched. Checked against the text. |
| P281 | الغاشية 88:4 تصلى نارا | `[0, 0]`; `تَصۡلَىٰ` [1,2,3,4,7,8,10,11,12,13,14,15,16,19,20]<br>`تُصْلَى` [5,6,9,17,18] | 2/400: «(واختلفوا) في: تصلى نارا فقرأ البصريان، وأبو بكر بضم التاء وقرأ الباقون بفتحها،» | Matched. Checked against the text. |
| P282 | الفجر 89:16 فقدر | `[4, 4]`; `فَقَدَرَ` [1,2,3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`فَقَدَّرَ` [7,8,15,16] | 2/400: «(واختلفوا) في: فقدر فقرأ أبو جعفر وابن عامر بتشديد الدال، وقرأ الباقون بتخفيفها.» | Matched. Checked against the text. |
| P283 | البلد 90:7 مالا لبدا | `[0, 0]`; `لُّبَدًا أَيَحۡسَبُ` [7,8,9,10,11,12]<br>`لُبَدًا أَيَحْسِبُ` [1,2,3,4,5,6,13,14,17,18,19,20]<br>`لُبَّدًا أَيَحْسَبُ` [15,16] | 2/401: «(واختلفوا) في: مالا لبدا فقرأ أبو جعفر بتشديد الباء، وقرأ الباقون بتخفيفها،» | F26: wording. Checked against the text. |
| P284 | الشمس 91:15 ولا يخاف | `[0, 0]`; `وَلَا` [3,4,5,6,9,10,11,12,13,14,17,18,19,20]<br>`فَلاَ` [1,2,7,8,15,16] | 2/401: «(واختلفوا) في: ولا يخاف فقرأ المدنيان، وابن عامر فلا بالفاء، وكذا هي في مصاحف المدينة وأهل الشام، وقرأ الباقون بالواو، وكذلك هي في مصاحفهم،» | Matched. Checked against the text. |
| P292 | الليل 92:7 لليسرى | `[1, 1]`; `لِلۡيُسۡرَىٰ` [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`لِلْيُسُرَى` [15,16] | 2/216: «وضم السين من اليسر والعسر أبو عمرو وكذا ما جاء منه نحو وإن كان ذو عسرة فنظرة إلى والعسرى واليسرى.» | Inferred source anomaly; see explanation above. |
| P293 | الشرح 94:6 العسر/يسرا | `[0, 3]`; `فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا إِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرٗا` [1,3,4,5,6,7,8,9,10,11,12,13,14,17,18,19,20]<br>`فَإِنَّ مَعَ العُسْرِ يُسْرًا إِنَّ مَعَ العُسْرِ يُسْرًا` [2,11]<br>`فَإِن مَعَ العُسُرِ يُسُرًا إِنَّ مَعَ العُسُرِ يُسُرًا` [15,16] | 2/216: «وضم السين من اليسر والعسر أبو عمرو وكذا ما جاء منه نحو وإن كان ذو عسرة فنظرة إلى والعسرى واليسرى.» | F27: wording. Checked against the text. |
| P285 | القدر 97:5 مطلع الفجر | `[3, 3]`; `مَطۡلَعِ` [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18]<br>`مَطْلِعِ` [13,14,19,20] | 2/402–403: «(واختلفوا) في: مطلع الفجر فقرأ الكسائي وخلف بكسر اللام، وقرأ الباقون بفتحها والأزرق عن ورش على أصله في تفخيمها،» | Matched. Checked against the text. |
| P286 | التكاثر 102:6 لترون الجحيم | `[0, 0]`; `لَتَرَوُنَّ` [1,2,3,4,5,6,9,10,11,12,15,16,17,18,19,20]<br>`لَتُرَوُنَّ` [7,8,13,14] | 2/403: «(واختلفوا) في: لترون الجحيم فقرأ ابن عامر والكسائي بضم التاء، وقرأ الباقون بفتحها، واتفقوا على فتح التاء في الثانية، وهو قوله تعالى: ثم لترونها عين اليقين لأن المعنى فيه: أنهم يرونها، أي تريهم أولا الملائكة، أو من شاء، ثم يرونها بأنفسهم، ولهذا قال الكسائي: إنك لترى أولا، ثم ترى - والله أعلم -.» | Matched. Checked against the text. |
| P287 | الهمزة 104:2 جمع مالا | `[1, 1]`; `جَمَعَ` [1,2,3,4,5,6,9,10,17]<br>`جَمَّعَ` [7,8,11,12,13,14,15,16,18,19,20] | 2/403: «(واختلفوا) في: جمع مالا فقرأ أبو جعفر وابن عامر وحمزة والكسائي وخلف وروح بتشديد الميم، وقرأ الباقون بتخفيفها،» | Matched. Checked against the text. |
| P288 | قريش 106:1 لإيلاف قريش | `[0, 0]`; `لِإِيلَٰفِ` [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20]<br>`لإِلاَفِ` [7,8] | 2/403: «(واختلفوا) في: لإيلاف قريش فقرأ ابن عامر بغير ياء بعد الهمزة، مثل لعلاف مصدر ألف ثلاثيا، يقال: ألف الرجل إلفا وإلافا، وقرأ أبو جعفر بياء ساكنة من غير همز، وقيل: إنه لما أبدل الثانية ياء حذف الأولى حذفا على غير قياس، ويحتمل أن يكون الأصل عنده ثلاثيا كقراءة ابن عامر، ثم خفف كإبل، ثم أبدل على أصله، ويدل على ذلك قراءته الحرف الثاني كذلك - والله أعلم -. وقرأ الباقون بهمزة مكسورة بعدها ياء ساكنة.» | Matched. Checked against the text. |
| P289 | المسد 111:1 أبي لهب | `[2, 4]`; `أَبِي لَهَبٖ وَتَبَّ` [1,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]<br>`أَبِى لَهْبٍ وَتَبَّ` [3,4] | 2/404: «(واختلفوا) في: أبي لهب فقرأ ابن كثير بإسكان الهاء، وقرأ الباقون بفتحها. (واتفقوا) على فتح الهاء من (ذات لهب) ، ومن ولا يغني من اللهب لتناسب الفواصل ولثقل العلم بالاستعمال - والله أعلم -. وما أحسن قول الإمام أبي شامة رحمه الله حيث قال: خفف العلم بالإسكان لثقل المسمى على الجنان، والاسم على اللسان.» | Matched. Checked against the text. |
| P294 | الإخلاص 112:4 كفوا | `[3, 3]`; Missing | 2/216: «وأسكن الفاء من كفؤا حمزة وخلف ويعقوب.» | F28: missing reading. Checked against the text. |

## Surah inventory

Every surah after al-Baqara appears below. A ledger link means that at least one substantive position was sampled, not that the entire surah was certified. The other rows record the actual boundary of this audit. Performance-only rows do not count toward the ten farsh positions per juz. Empty dataset rows are not silently treated as evidence of correctness.

| Surah | Ledger IDs or source section | Coverage |
| --- | --- | --- |
| آل عمران 3 | P001, P002, P003, P004, P005, P006, P007, P008, P009, P010, P011, P012, P013, P014, P015, P016, P017, P019, P018 | Sampled farsh; individual results above. |
| النساء 4 | P020, P021, P022, P023, P024, P025, P026, P027, P028, P029, P030, P031, P032, P033 | Sampled farsh; individual results above. |
| المائدة 5 | P034, P295, P035, P296, P036, P037, P038, P039, P040, P041, P042, P043, P044, P045, P046, P047, P048, P049 | Sampled farsh; individual results above. |
| الأنعام 6 | P050, P051, P052, P053, P054, P055, P056, P057, P058, P059 | Sampled farsh; individual results above. |
| الأعراف 7 | P060, P062, P064, P065, P066, P067, P068, P069, P063, P061 | Sampled farsh; individual results above. |
| الأنفال 8 | P070, P071, P072, P073, P074, P075, P076, P077, P078, P079 | Sampled farsh; individual results above. |
| التوبة 9 | P080, P081, P082, P083, P084, P085, P086, P087, P088 | Sampled farsh; individual results above. |
| يونس 10 | P089, P090 | Sampled farsh; individual results above. |
| هود 11 | P091, P092, P093, P094, P095, P096, P097, P098, P099 | Sampled farsh; individual results above. |
| يوسف 12 | P100, P101, P102, P103, P104, P105, P106, P107, P108 | Sampled farsh; individual results above. |
| الرعد 13 | P109 | Sampled farsh; individual results above. |
| إبراهيم 14 | P110 | Sampled farsh; individual results above. |
| الحجر 15 | P111, P112, P113, P114, P115, P116, P117 | Sampled farsh; individual results above. |
| النحل 16 | P118, P119, P120 | Sampled farsh; individual results above. |
| الإسراء 17 | P121, P122, P123, P124, P125, P126, P127, P128, P129 | Sampled farsh; individual results above. |
| الكهف 18 | P130, P131, P132, P133, P134, P135, P136, P137, P138 | Sampled farsh; individual results above. |
| مريم 19 | P139 | Sampled farsh; individual results above. |
| طه 20 | P140 | Sampled farsh; individual results above. |
| الأنبياء 21 | P141, P142, P143, P144, P145, P146, P147, P148, P149 | Sampled farsh; individual results above. |
| الحج 22 | P150 | Sampled farsh; individual results above. |
| المؤمنون 23 | P151, P152, P153, P154, P155, P156, P157, P158 | Sampled farsh; individual results above. |
| النور 24 | P159 | Sampled farsh; individual results above. |
| الفرقان 25 | P160, P161, P162, P163, P164, P165, P166, P167, P168 | Sampled farsh; individual results above. |
| الشعراء 26 | P169 | Sampled farsh; individual results above. |
| النمل 27 | P170, P171, P172, P173, P174, P175, P176, P177, P178 | Sampled farsh; individual results above. |
| القصص 28 | P179 | Sampled farsh; individual results above. |
| العنكبوت 29 | P180, P181, P182, P183, P184 | Sampled farsh; individual results above. |
| الروم 30 | P185, P186, P187 | Sampled farsh; individual results above. |
| لقمان 31 | P188 | Sampled farsh; individual results above. |
| السجدة 32 | P189 | Sampled farsh; individual results above. |
| الأحزاب 33 | P190, P191, P192, P193, P194, P195, P197, P196 | Sampled farsh; individual results above. |
| سبأ 34 | P198 | Sampled farsh; individual results above. |
| فاطر 35 | P199 | Sampled farsh; individual results above. |
| يس 36 | P200, P201, P202, P203, P204, P205, P206, P207 | Sampled farsh; individual results above. |
| الصافات 37 | P208 | Sampled farsh; individual results above. |
| ص 38 | P209 | Sampled farsh; individual results above. |
| الزمر 39 | P210, P211, P212, P213, P214, P215, P216 | Sampled farsh; individual results above. |
| غافر 40 | P217, P218, P219 | Sampled farsh; individual results above. |
| فصلت 41 | P220, P221 | Sampled farsh; individual results above. |
| الشورى 42 | P222, P223, P224, P225, P226 | Sampled farsh; individual results above. |
| الزخرف 43 | P227, P228 | Sampled farsh; individual results above. |
| الدخان 44 | P229 | Sampled farsh; individual results above. |
| الجاثية 45 | P230 | Sampled farsh; individual results above. |
| الأحقاف 46 | P231, P232, P233, P234, P235 | Sampled farsh; individual results above. |
| محمد 47 | P236 | Sampled farsh; individual results above. |
| الفتح 48 | P237 | Sampled farsh; individual results above. |
| الحجرات 49 | P238 | Sampled farsh; individual results above. |
| ق 50 | P239 | Sampled farsh; individual results above. |
| الذاريات 51 | P240, P241, P242 | Sampled farsh; individual results above. |
| الطور 52 | P243, P244, P245 | Sampled farsh; individual results above. |
| النجم 53 | P246 | Sampled farsh; individual results above. |
| القمر 54 | P247 | Sampled farsh; individual results above. |
| الرحمن 55 | P248 | Sampled farsh; individual results above. |
| الواقعة 56 | P249 | Sampled farsh; individual results above. |
| الحديد 57 | P250 | Sampled farsh; individual results above. |
| المجادلة 58 | P251, P252, P253, P254 | Sampled farsh; individual results above. |
| الحشر 59 | P255 | Sampled farsh; individual results above. |
| الممتحنة 60 | P256 | Sampled farsh; individual results above. |
| الصف 61 | P257 | Sampled farsh; individual results above. |
| الجمعة 62 | 2/387 | No stored position; the farsh section refers only to earlier rules here. No independent in-scope farsh certified missing. |
| المنافقون 63 | P258 | Sampled farsh; individual results above. |
| التغابن 64 | P259 | Sampled farsh; individual results above. |
| الطلاق 65 | P290 | Sampled farsh; individual results above. |
| التحريم 66 | P260 | Sampled farsh; individual results above. |
| الملك 67 | P261 | Sampled farsh; individual results above. |
| القلم 68 | P262 | Sampled farsh; individual results above. |
| الحاقة 69 | P263 | Sampled farsh; individual results above. |
| المعارج 70 | P264 | Sampled farsh; individual results above. |
| نوح 71 | P265 | Sampled farsh; individual results above. |
| الجن 72 | P266 | Sampled farsh; individual results above. |
| المزمل 73 | P267 | Sampled farsh; individual results above. |
| المدثر 74 | P268 | Sampled farsh; individual results above. |
| القيامة 75 | P269 | Sampled farsh; individual results above. |
| الإنسان 76 | P270 | Sampled farsh; individual results above. |
| المرسلات 77 | P271 | Sampled farsh; individual results above. |
| النبأ 78 | P272 | Sampled farsh; individual results above. |
| النازعات 79 | P273 | Sampled farsh; individual results above. |
| عبس 80 | P274 | Sampled farsh; individual results above. |
| التكوير 81 | P275 | Sampled farsh; individual results above. |
| الانفطار 82 | P276 | Sampled farsh; individual results above. |
| المطففين 83 | P277 | Sampled farsh; individual results above. |
| الانشقاق 84 | P278 | Sampled farsh; individual results above. |
| البروج 85 | P279 | Sampled farsh; individual results above. |
| الطارق 86 | P291 | Sampled farsh; individual results above. |
| الأعلى 87 | P280 | Sampled farsh; individual results above. |
| الغاشية 88 | P281 | Sampled farsh; individual results above. |
| الفجر 89 | P282 | Sampled farsh; individual results above. |
| البلد 90 | P283 | Sampled farsh; individual results above. |
| الشمس 91 | P284 | Sampled farsh; individual results above. |
| الليل 92 | P292 | Sampled farsh; individual results above. |
| الضحى 93 | 2/401 | No stored position; the section refers to imala of the surah endings. Outside sampled farsh. |
| الشرح 94 | P293 | Sampled farsh; individual results above. |
| التين 95 | 2/401–403 | No stored position; no in-scope farsh position identified in the inspected section. Not an exhaustive absence proof. |
| العلق 96 | 2/401–403 | Stored أرأيت is hamza performance, excluded from the farsh quota. The Qunbul رآه discussion at 96:7 is route-sensitive length/hamza evidence and is not called a missing farsh. |
| القدر 97 | P285 | Sampled farsh; individual results above. |
| البينة 98 | 2/403 | Stored البرية/البريئة is hamza performance. The section refers to Nafi and Ibn Dhakwan in الهمز المفرد. Excluded from quota; the missing repeated hamza-only occurrence is not a missing-farsh finding. |
| الزلزلة 99 | 2/403 | Stored يره relates to هاء الكناية, which the book explicitly cross-references. Excluded from the farsh quota. |
| العاديات 100 | 2/403 | No stored position; the book cross-references الإدغام الكبير for والعاديات ضبحا فالمغيرات صبحا. No missing farsh asserted. |
| القارعة 101 | 2/403 | Stored ما هيه نار concerns the written/pause ha and crosses an ayah boundary. The text refers to الوقف على الرسم. Performance-only, excluded from the farsh quota. |
| التكاثر 102 | P286 | Sampled farsh; individual results above. |
| العصر 103 | 2/403–404 | No stored position; no independent in-scope farsh identified in the inspected late-surah section. Not a proof of total absence. |
| الهمزة 104 | P287 | Sampled farsh; individual results above. |
| الفيل 105 | 2/403–404 | No stored position; no independent in-scope farsh identified in the inspected late-surah section. Not a proof of total absence. |
| قريش 106 | P288 | Sampled farsh; individual results above. |
| الماعون 107 | 2/404 | Stored أرأيت is hamza performance. The text cross-references الهمز المفرد. Excluded from quota. |
| الكوثر 108 | 2/404 | No stored position; شانئك is explicitly cross-referenced to الهمز المفرد. No missing farsh asserted. |
| الكافرون 109 | 2/404 | No stored position; عابدون/عابد imala and ولي دين idafa ya are explicitly cross-referenced. Outside sampled farsh. |
| النصر 110 | 2/404 | No stored position; no independent in-scope farsh identified in the inspected late-surah section. Not an exhaustive absence proof. |
| المسد 111 | P289 | Sampled farsh; individual results above. |
| الإخلاص 112 | P294 | Sampled farsh; individual results above. |
| الفلق 113 | 2/404–405 | No stored position. Al-Nashr reports النافثات from specific Ruways routes and the alternative النفاثات from other Tammar transmitters. Inferred route issue: omission is not a confirmed missing reading until the Durra route is checked directly. The text was checked; the narrow-route conclusion is not certified. |
| الناس 114 | 2/405 | No stored position; no independent in-scope farsh identified before the takbir chapter. Not an exhaustive absence proof. |

## Reproducibility and validation

The only repository change is this report. The source retrieval, candidate-selection aids and count checks ran outside the repository and are not shipped as application code. Candidate word matching was used only to locate passages; it did not determine a match or a defect. Each ledger position was compared with the quoted source rule, and the route-sensitive cases were separated explicitly. The report is a sampled audit, not an automated textual collation or a claim of full-Quran accuracy.

The position IDs are unique. The juz table counts every ledger ID exactly once, each juz from 3 through 30 meets the ten-position minimum, the surah inventory covers exactly 3 through 114, and every confirmed finding links to a ledger entry. The data hash at the audited baseline is `f2ec62887f0d00fb59c7cd08043a6e5e083129e745b7c2cec1be6eb0130ba58e`.

Repository checks and the independent documentation review are recorded in the PR description. No application tests were added for this research-only report.

Records used: R0033, R0028, R0015, R0026.
