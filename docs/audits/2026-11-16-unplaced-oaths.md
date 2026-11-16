# Audit: unplaced Quranic oaths

Task 3 only. Researched on 2026-11-16 against main at [`f5ecb444`](https://github.com/msskzx/namaq/commit/f5ecb444). This report is the only repository change. It proposes no implementation or source-data edits.

The request mentions 13 unplaced oaths. **Checked:** current `OATH_SECTIONS` contains **14** in its `unnamed` section, including al-Shams. All 14 are covered below. The precise heading is «لم يعيّن ابن القيم ما أُقسم عليه», and its note says «جمعنا هنا ما لم يذكره ابن القيم في واحد من الخمسة، على ترتيب المصحف.» This is a claim about Ibn al-Qayyim's classification, not a claim that no commentator identifies an oath-answer. [Current definitions](https://github.com/msskzx/namaq/blob/f5ecb444/shared/quran/oathSources.ts#L104).

## Recommendation and checked findings

Correct the implication that Ibn al-Qayyim leaves all these subjects unidentified. His own text expressly makes the messengers the object of the al-Nahl 63 oath, identifies the contradictory claims about the Quran and Prophet in al-Dhariyat 7, places al-Muddaththir's oath on the resurrection, and says al-Buruj's promised Day is both sworn by and sworn upon. These are checked omissions in the evidence used for the current section. Al-Nahl 63's decisive sentence is already present in `OATH_QUOTES`, above the classification that leaves it unplaced.

For the remaining entries, display the author's actual oath-answer and preserve his alternatives. Several mappings to the five broad classes require interpretation. Do not publish those mappings as Ibn al-Qayyim's verbatim classification. In particular, do not silently assign al-Fajr to «إن ربك لبالمرصاد» under his name: he expressly weakens that answer. Al-Nazi'at and al-Inshiqaq also need their alternative analyses retained.

### Method, status and editions

- **Checked** means the quoted words, attribution, digital volume/page label or stated repository membership were directly compared. It does not mean a scan was collated or an interpretation was proved unanimously.
- **Inferred** means this report maps a source's words to one or more of the five existing product classes. These mappings are research recommendations, not new classical quotations. Confidence refers separately to quotation and mapping.
- المقسم به is the thing sworn **by**. المقسم عليه is the proposition sworn **upon**. This task concerns the latter. A quotation identifying only the former does not resolve the task.
- Quotations below retain the author's words and sequence. Vowel marks, elongation marks and numbered footnote callouts are omitted; whitespace is collapsed. Quran verse numbers and references inside the source are retained. No explanatory Arabic has been inserted into quotations. Text from editor-created section headings or footnotes is not used as authorial proof.
- **Edition T:** Ibn Qayyim al-Jawziyya, *التبيان في أيمان القرآن*, edited by عبد الله بن سالم البطاطي, دار عطاءات العلم / دار ابن حزم, fourth edition, 1440 AH / 2019, **one volume**. [Edition and contents](https://quranpedia.app/books/b18337/index.html). Printed pages are cited; `s` and `p` in Quranpedia links are navigation identifiers, not volume or printed page numbers.
- **Edition K:** Ibn Kathir, *تفسير القرآن العظيم*, edited by سامي بن محمد السلامة, دار طيبة, Riyadh, second edition, 1420 AH / 1999, **eight volumes**. [Edition](https://shamela.ws/book/8473). Shamela page IDs likewise differ from printed pagination.
- Both works and editions are already in `shared/sources.ts`. No source-registry change is proposed. Only the classical authorial text is quoted, not modern editorial scholarship.

The search read Ibn al-Qayyim's fivefold introduction and the relevant oath discussions, then used Ibn Kathir for al-Nahl 56 and Maryam 68. This supplies evidence for all 14; it is not an exhaustive survey of al-Tabari, al-Qurtubi or all other permissible sources. Quranpedia's HTML separates authorial text from footnotes, and Shamela's numbered edition text supplies the second work. The citations were checked digitally, not against printed scans. No UI render was needed or claimed.

### The five classes and why they can overlap

> إذا عرف هذا؛ فهو - سبحانه - يقسم على أصول الإيمان، التي يجب على الخلق معرفتها: تارة يقسم على التوحيد، وتارة يقسم على أن القرآن حق، وتارة على أن الرسول حق، وتارة على الجزاء والوعد والوعيد، وتارة على حال الإنسان.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:8**. [Source](https://quranpedia.app/books/b18337/s7.html#p76).

The product's corresponding labels are «على التوحيد», «على أن القرآن حق», «على أن الرسول حق», «على الجزاء والوعد والوعيد» and «على حال الإنسان». **Checked:** Ibn al-Qayyim does not make them mutually exclusive. He expressly connects the human outcome with recompense:

> وأقسم على عاقبته، وهو قسم على الجزاء؛ في قوله: ﴿والعصر (1) إن الإنسان لفي خسر (2)﴾ [العصر: 1 - 2] إلى آخر السورة.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:13**. [Source](https://quranpedia.app/books/b18337/s8.html#p81).

**Inferred:** a report mapping may therefore name two classes without claiming that the author created two separate oaths. The table gives recommended mappings, not a replacement data file.

### Coverage and proposed mapping

| Entry, surah first | Subject supported by the quoted source | Mapping to the existing five | Evidence status and confidence |
| --- | --- | --- | --- |
| النساء 65 | Faith requires accepting the Messenger's judgment | الرسول حق; also concerns the human condition | Subject checked, high; mapping inferred, medium |
| الحجر 72 | The people's intoxicated bewilderment | حال الإنسان | Subject checked, high; mapping inferred, medium |
| الحجر 92–93 | Questioning them about their deeds | الجزاء والوعد والوعيد | Subject checked, high; mapping inferred, high |
| النحل 56 | Questioning and recompensing their fabrications | الجزاء والوعد والوعيد | Subject checked in Ibn Kathir, high; cross-author mapping inferred, high |
| النحل 63 | The messengers were sent | الرسول حق | Explicit subject and broad class checked in Ibn al-Qayyim, high |
| مريم 68 | Gathering them and their devils for judgment | الجزاء والوعد والوعيد | Subject checked in Ibn Kathir, high; cross-author mapping inferred, high |
| الذاريات 7–9 | Their contradictory claims about the Quran and Prophet | القرآن حق and الرسول حق | Both referents checked, high; mapping to both class labels inferred, high |
| المعارج 40–41 | God's power to recreate them after nonexistence | الجزاء والوعد والوعيد | Subject checked, high; resurrection mapping inferred, high |
| المدثر 32–37 | Resurrection | الجزاء والوعد والوعيد | Explicit resurrection classification checked, high |
| النازعات 1–5 | Resurrection on one analysis; on another, attention to the evidence in the sworn objects without one specified proposition | الجزاء والوعد والوعيد on the first analysis only | Both alternatives checked, high; exclusive single-class placement not justified |
| الانشقاق 16–19 | Passing from state to state; several readings and referents | حال الإنسان on the human reading; الجزاء والمعاد explicitly on the sky reading | Answer and alternatives checked, high; primary human-class mapping inferred, medium |
| البروج 1–3 | The promised Day, explicitly both sworn by and sworn upon | الجزاء والوعد والوعيد | Identity as the resurrection Day checked, high; product class follows that explicit identity |
| الفجر 1–5 | Magnifying what Ibrahim and Muhammad brought; Ibn al-Qayyim weakens the proposed answer at ayah 14 | الرسول حق is a possible thematic mapping; keep the omitted-answer discussion | Author's analysis checked, high; proposed class inferred, medium; no exclusive placement established |
| الشمس 1–10 | Success of the one who purifies the soul | حال الإنسان and الجزاء والوعد والوعيد | Answer checked as the view he reports from al-Zajjaj and others, high; class mapping inferred, high |

## Evidence for each oath

### 1. النساء 65

**Checked:** the entry is under `unnamed`, although the existing `OATH_QUOTES['4:65']` already quotes Ibn al-Qayyim identifying what the oath establishes. This is not an oath-answer missing from the source. The source directly conditions faith on submitting to the Messenger's judgment.

> أقسم - سبحانه - بنفسه المقدسة، قسما مؤكدا بالنفي قبله؛ على عدم إيمان الخلق حتى يحكموا رسوله في كل ما شجر بينهم من الأصول، والفروع، وأحكام الشرع، وأحكام المعاد، ومسائل الصفات وغيرها.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:652**. [Source](https://quranpedia.app/books/b18337/s80.html#p720).

**Inferred:** «الرسول حق» is the closest messenger-related product class, but the exact proposition concerns the requirements of the believer's faith and submission, not simply the truth of prophethood. «حال الإنسان» is also defensible. Confidence: quotation high; choosing one exclusive class medium. Retain the actual quoted proposition rather than relabelling it as a direct fivefold assignment.

### 2. الحجر 72

**Checked:** Ibn al-Qayyim quotes the proposition as well as discussing what is sworn by:

> ومن ذلك قوله - تعالى - في قصة لوط عليه السلام، ومراجعة قومه له: ﴿قالوا أولم ننهك عن العالمين (70) قال هؤلاء بناتي إن كنتم فاعلين (71) لعمرك إنهم لفي سكرتهم يعمهون (72)﴾ [الحجر: 70 - 72].

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:649**. [Source](https://quranpedia.app/books/b18337/s80.html#p717).

His explanation identifies the people whose condition is described:

> وقوله تعالى: ﴿يعمهون (72)﴾؛ أي: يتحيرون. وإنما وصف الله - سبحانه - اللوطية بالسكرة؛ لأن العشق له سكرة مثل سكرة الخمر وأشد ،

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:651**. [Source](https://quranpedia.app/books/b18337/s80.html#p719).

**Inferred:** map the proposition about their state to «حال الإنسان», with medium confidence. Do not put it in «الرسول حق» merely because the sworn object is the Prophet's life: that confuses المقسم به with المقسم عليه. Quotation confidence high. The dispute reported on T 1:649–650 concerns whose life is sworn by and who speaks the oath; it should remain attributed, but does not turn the explicit proposition into proof of prophethood.

### 3. الحجر 92–93

**Checked:** Ibn al-Qayyim himself gives this as an example of an oath on a طلبية sentence:

> وإما على جملة طلبية، كقوله عز وجل: ﴿فوربك لنسألنهم أجمعين (92) عما كانوا يعملون (93)﴾ [الحجر: 92، 93].

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:5**. [Source](https://quranpedia.app/books/b18337/s7.html#p73).

**Inferred:** questioning people about their deeds belongs under «الجزاء والوعد والوعيد». Confidence high for the subject and this mapping, but the quoted sentence does not itself name that one of the five classes. The app currently stores the oath formula at ayah 92; the answer spans 92–93, so a future display must preserve the rest of the proposition.

### 4. النحل 56

**Checked:** the app already carries the following Ibn Kathir quotation while leaving the entry unplaced:

> فأقسم الله تعالى بنفسه الكريمة ليسألنهم عن ذلك الذي افتروه، وائتفكوه، وليقابلنهم عليه وليجازينهم أوفر الجزاء في نار جهنم، فقال: (تالله لتسألن عما كنتم تفترون).

Ibn Kathir, *تفسير القرآن العظيم*, edition K, **4:577**. [Source](https://shamela.ws/book/8473/2376).

**Inferred:** this is a high-confidence mapping to «الجزاء والوعد والوعيد» because the cited author explicitly links the questioning to recompense in Hell. The author here is Ibn Kathir. It would be incorrect to present this as Ibn al-Qayyim's own fivefold placement. A future section using several commentators needs attribution that permits that distinction.

### 5. النحل 63

**Checked:** Ibn al-Qayyim explicitly uses this very ayah as proof that messengers are sworn upon. The decisive words are already in `OATH_QUOTES['16:63']`:

> وأيضا؛ فإن الرسل مقسم عليهم في القرآن لا مقسم بهم كقوله تعالى: ﴿تالله لقد أرسلنا إلى أمم من قبلك﴾ [النحل: 63]،

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:224**. [Source](https://quranpedia.app/books/b18337/s31.html#p292).

**Checked:** this supplies direct messenger-class evidence, not a guess from the oath's vocabulary. Mapping to «على أن الرسول حق» has high confidence in the broad sense of the truth of sending messengers. Its exact proposition is that messengers were sent to earlier communities, so retain the quotation rather than replacing it with an invented Arabic summary. This entry directly contradicts treating every `unnamed` member as one the author never places thematically.

### 6. مريم 68

**Checked:** Ibn Kathir directly states the proposition sworn upon:

> وقوله: (فوربك لنحشرنهم والشياطين) أقسم الرب، ﵎، بنفسه الكريمة، أنه لا بد أن يحشرهم جميعا وشياطينهم الذين كانوا يعبدون من دون الله، (ثم لنحضرنهم حول جهنم جثيا).

Ibn Kathir, *تفسير القرآن العظيم*, edition K, **5:251**. [Source](https://shamela.ws/book/8473/2660).

**Inferred:** gathering them and their devils around Hell is a high-confidence «الجزاء والوعد والوعيد» mapping. This is evidence from Ibn Kathir, not an assertion that Ibn al-Qayyim assigned it there. The app currently uses al-Sa'di for this entry; this report supplies the requested classical alternative without changing that data.

### 7. الذاريات 7–9

**Checked:** after describing the second oath at ayah 7, Ibn al-Qayyim explicitly identifies its answer and both referents:

> ثم ذكر المقسم عليه فقال: ﴿إنكم لفي قول مختلف (8) يؤفك عنه من أفك (9)﴾ [الذاريات: 8، 9]، فالقول المختلف: أقوالهم في القرآن، وفي النبي ﷺ، وهو خرص كله.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:437**. [Source](https://quranpedia.app/books/b18337/s55.html#p505).

**Inferred:** both «القرآن حق» and «الرسول حق» are relevant, with high confidence; the checked subject is their contradictory false claims about both. This is not the first al-Dhariyat oath, whose answer is at ayat 5–6. Do not transfer that first oath's existing recompense category to the second merely because they share a surah. The report's two-class mapping preserves the source's two referents rather than silently choosing one.

### 8. المعارج 40–41

**Checked:** the explanation immediately after the chapter opening names both divine power and recreation after nonexistence:

> وأما سورة ﴿سأل سائل﴾ فإنه أقسم - سبحانه - على عموم قدرته وكمالها، وصحة تعلقها بإعادتهم بعد العدم،

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:289**. [Source](https://quranpedia.app/books/b18337/s39.html#p357).

**Inferred:** «الجزاء والوعد والوعيد» is the closest class because of the explicit recreation clause, confidence high. The source also stresses comprehensive power; this does not license replacing his words with a narrowly punitive paraphrase. The actual ayah answer continues into 41, while the stored oath formula is at 40.

### 9. المدثر 32–37

**Checked:** Ibn al-Qayyim directly identifies resurrection as the oath's subject in the authorial paragraph, independently of the modern editor's chapter heading:

> وأقسم - سبحانه - بهذه الأشياء الثلاثة - وهي: القمر، والليل إذا أدبر، والصبح إذا أسفر - على المعاد؛ لما في المقسم به من الدلالة على ثبوت المقسم عليه،

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:260**. [Source](https://quranpedia.app/books/b18337/s36.html#p328).

**Checked:** this is direct evidence for the existing recompense/resurrection class, with high confidence. The stored formula covers 32–34; the proposition follows it, so a quotation limited to the moon, night and dawn would miss the answer. For the relevant context the author quotes 32–37 at T 1:250, [source](https://quranpedia.app/books/b18337/s35.html#p318).

### 10. النازعات 1–5

**Checked:** Ibn al-Qayyim gives two analyses, not one unqualified missing answer:

> وجواب القسم محذوف - يدل عليه السياق - وهو البعث المستلزم لصدق الرسول وثبوت القرآن، أو أنه من القسم الذي أريد به التنبيه على الدلالة والعبرة بالمقسم به، دون أن يراد به مقسم عليه بعينه، وهذا القسم يتضمن الجواب المقسم عليه وإن لم يذكر لفظا، ولعل هذا مراد من قال: إنه محذوف للعلم به.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:217**. [Source](https://quranpedia.app/books/b18337/s31.html#p285).

**Checked:** «الجزاء والوعد والوعيد» is supported on his resurrection analysis, which also entails the truth of the Messenger and Quran. **Inferred:** choosing that as a single primary class is reasonable only if labelled as one analysis. His alternative expressly does not require one specified proposition. Confidence high in both textual alternatives; no high-confidence exclusive assignment is warranted. This is a case for preserving alternatives, not mechanically emptying the unplaced section.

### 11. الانشقاق 16–19

**Checked:** Ibn al-Qayyim identifies the apparent answer and preserves the alternative syntax:

> وقوله تعالى: ﴿لتركبن طبقا عن طبق (19)﴾ [الانشقاق: 19]؛ الظاهر أنه جواب القسم، ويجوز أن يكون من القسم المحذوف جوابه، و"لتركبن" وما بعده مستأنف.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:179**. [Source](https://quranpedia.app/books/b18337/s26.html#p247).

On the human referent he says:

> ومن قال: الخطاب للإنسان أو لجملة الناس، فالمعنى واحد، وهو تنقل الإنسان حالا بعد حال، من حين كونه نطفة إلى مستقره من الجنة أو النار،

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:181**. [Source](https://quranpedia.app/books/b18337/s26.html#p249).

On the sky referent he explicitly identifies a resurrection subject:

> وعلى هذا فيكون قسما على المعاد، وتغير العالم.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:180**. [Source](https://quranpedia.app/books/b18337/s26.html#p248).

**Inferred:** the human reading maps to «حال الإنسان», with medium confidence as the primary UI choice; resurrection/recompense is also supported, explicitly on the sky reading. Quotation confidence high. The intervening discussion on T 1:180–181 also records a Prophet-specific reading. Do not convert a statement about the Prophet's changing states into the class «الرسول حق» without further argument: the person addressed and the proposition being proved are different things.

### 12. البروج 1–3

**Checked:** the same paragraph that explains the sworn object explicitly says it is also sworn upon:

> ثم أقسم ب "اليوم الموعود" وهو يوم القيامة ، وهو المقسم به وعليه، كما أن القرآن يقسم به وعليه.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:139–140**. [Page 139](https://quranpedia.app/books/b18337/s21.html#p207), [page 140](https://quranpedia.app/books/b18337/s21.html#p208).

The quotation joins the author's sentence across the page break, omitting the intervening editorial heading. **Checked:** the author identifies the promised Day as the resurrection Day and expressly names it as both المقسم به and المقسم عليه. That gives high-confidence support for the existing resurrection/recompense class. His later comment on T 1:142 repeats that the promised Day is both sworn by and sworn upon, [source](https://quranpedia.app/books/b18337/s21.html#p210).

### 13. الفجر 1–5

**Checked:** Ibn al-Qayyim records a proposed answer and explicitly weakens it:

> قيل : جوابه قوله تعالى: ﴿إن ربك لبالمرصاد (14)﴾ [الفجر: 14]. وهذا ضعيف لوجهين: أحدهما: طول الكلام والفصل بين القسم وجوابه بجمل كثيرة.

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:40**. [Source](https://quranpedia.app/books/b18337/s11.html#p108).

His own explanation later states:

> فلما تضمن هذا القسم تعظيم ما جاء به إبراهيم ومحمد - صلى الله عليهما وسلم - كان في ذلك ما دل على المقسم عليه،

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:48**. [Source](https://quranpedia.app/books/b18337/s12.html#p116).

**Inferred:** a thematic mapping to «الرسول حق» is possible from his emphasis on what Ibrahim and Muhammad brought, confidence medium. It is not his verbatim allocation to one of the five classes, nor an explicit reconstructed oath-answer. Retaining an omitted-answer discussion is justified. A move to recompense based solely on «إن ربك لبالمرصاد» would conceal his disagreement. Confidence in the rejection and quoted explanation high. This report does not assert that other commentators reject that answer.

### 14. الشمس 1–10

**Checked:** Ibn al-Qayyim reports al-Zajjaj and others identifying the answer:

> قال الزجاج وغيره: "جواب القسم: ﴿قد أفلح من زكاها (9)﴾، ولما طال الكلام حسن حذف "اللام" من الجواب" .

Ibn al-Qayyim, *التبيان في أيمان القرآن*, edition T, **1:26**. [Source](https://quranpedia.app/books/b18337/s9.html#p94).

**Inferred:** «حال الإنسان» and «الجزاء والوعد والوعيد» both fit the success/purification proposition, confidence high as thematic mappings. The checked attribution is to the view Ibn al-Qayyim reports from al-Zajjaj and others, not to unanimous tafsir or an exclusive product category. His next discussion explains purification as including cleansing oneself from evil and adorning oneself with obedience, T 1:29; no invented explanation is needed.

## Fixes to consider, in priority order

1. Reconcile the `unnamed` membership with explicit subject statements already in the book, especially النحل 63، الذاريات 7، المدثر 32، البروج 1. The section heading should not imply that these subjects are unidentified in Ibn al-Qayyim.
2. Keep the precise proposition and its source attached to each entry. For النحل 56 and مريم 68, distinguish Ibn Kathir's evidence from Ibn al-Qayyim's own classification.
3. Permit attributed alternatives or overlapping thematic classes. Preserve the alternatives in النازعات and الانشقاق, the two referents in الذاريات, and Ibn al-Qayyim's objection concerning الفجر.
4. When displaying the oath-answer, include the ayat containing it. Several stored ranges intentionally cover only the oath formula, not the proposition that follows it. Extending a quotation must not change which words are marked as sworn objects.

No fix is implemented in this PR. Task 1, the qira'at audit, is not part of this report, following the owner's instruction to do only task 3 now.

## Research verification

Every block quotation was selected by exact substring from the cited digital authorial text after the stated removal of vowel marks, footnote callouts and whitespace normalization. Checked the 14 identifiers against `OATH_SECTIONS`, the existing quotations against `OATH_QUOTES`, both source editions against their bibliographic metadata, and each cited printed page against its host label. This establishes a digital-text check, not a printed-scan collation or a full audit of all Quranic oaths.

Records used in making research decisions: **R0015** kept alternative interpretations attributed; **R0026** prevented a source about the sworn object from licensing a category for the proposition; **R0044** required each displayed quotation itself to establish the claim made for it.
