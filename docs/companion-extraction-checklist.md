# Companion extraction checklist

Tracks, in the book's own order as its
[فهرس الموضوعات](https://shamela.ws/book/10906) gives it,
which *سير أعلام النبلاء* entries already have a batch under
`data/history/batches/` and which don't. See
[docs/data-pipelines.md](data-pipelines.md#companion-scope) for the scope
rules (الصحابة only, the run is not contiguous, contested صحبة is taken in)
and [docs/extraction-checklist.md](extraction-checklist.md) for how to read
an entry once you get to it.

A `[ ]` here means "not yet extracted," not "out of scope" — scope for an
entry this list hasn't reached yet is undetermined until someone reads it
against the boundaries in data-pipelines.md. Group martyrdom headings
(شهداء ...) are listed and struck through: they are not single-person
entries and are skipped the way earlier batches skipped them, unless a named
person inside one later gets their own dedicated entry.

## Maintenance rule

**Whenever a batch is extracted, checked off here.** After
`npm run history:import -- --apply` runs for a batch (or, if the workflow
stops earlier, once the batch is approved for publication), flip that
entry's `[ ]` to `[x]` and note the batch directory in parentheses. Do this
in the same PR as the batch. This file exists so nobody has to reconstruct
extraction order from PR history again — an unchecked-off batch defeats
that.

## Entries

- [x] أبو عبيدة بن الجراح — entry 1 (`abu-ubaydah-pilot`)
- [x] طلحة بن عبيد الله — entry 2 (`talhah-ibn-ubaydullah`)
- [x] الزبير بن العوام — entry 3 (`az-zubayr-ibn-al-awwam`)
- [x] عبد الرحمن بن عوف — entry 4 (`abdur-rahman-ibn-awf`)
- [x] سعد بن أبي وقاص — entry 5 (`saad-ibn-abi-waqqas`)
- [x] سعيد بن زيد — entry 6 (`saeed-ibn-zaid`)
- ~~السابقون الأولون~~ (group heading)
- [x] مصعب بن عمير — entry 7 (`musab-ibn-umayr`)
- ~~شهداء يوم أحد~~ (group heading)
- [x] أبو سلمة — entry 8 (`abu-salamah-ibn-abd-al-asad`)
- [x] عثمان بن مظعون — entry 9 (`uthman-ibn-mazun`)
- [x] قدامة بن مظعون — entry 10 (`qudamah-ibn-mazun`)
- [x] عبد الله بن مظعون الجمحي — entry 11 (`abdullah-ibn-mazun-al-jumahi`)
- [x] السائب بن عثمان — entry 12 (`as-saib-ibn-uthman`)
- [x] أبو حذيفة — entry 13 (`abu-hudhayfah`)
- [x] سالم مولى أبي حذيفة — entry 14 (`salim-mawla-abi-hudhayfah`)
- ~~شهداء بدر~~ (group heading)
- [x] حمزة بن عبد المطلب — entry 15 (`hamzah-ibn-abd-al-muttalib-siyar15`)
- [x] عاقل بن البكير — entry 16 (`aqil-ibn-al-bukayr`)
- [x] خالد بن البكير — entry 17 (`khalid-ibn-al-bukayr`)
- [x] إياس بن أبي البكير — entry 18 (`iyas-ibn-al-bukayr`)
- [x] عامر بن أبي البكير — entry 19 (`amir-ibn-al-bukayr`)
- [x] مسطح بن أثاثة — entry 20 (`mistah-ibn-uthathah`)
- [x] أبو عبس — entry 21 (`abu-abs`)
- [x] ابن التيهان — entry 22 (`abu-al-haytham-ibn-at-tayyihan`)
- [x] أبو جندل — entry 23 (`abu-jandal`)
- [x] عبد الله بن سهيل — entry 24 (`abdullah-ibn-suhail`)
- [x] سهيل بن عمرو — entry 25 (`suhail-ibn-amr`)
- [x] البراء بن مالك — entry 26 (`al-baraa-ibn-malik`)
- [x] نوفل — entry 27 (`nawfal-ibn-al-harith`)
- [x] الحارث بن نوفل — entry 28 (`al-harith-ibn-nawfal`)
- [x] عبد الله بن الحارث — entry 29 (`abdullah-ibn-al-harith-ibn-nawfal`)
- [x] عبد الله بن عبد الله بن الحارث — entry 30 (`abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal`)
- [x] سعيد بن الحارث — entry 31 (`saeed-ibn-al-harith`)
- [x] أبو سفيان بن الحارث — entry 32 (`abu-sufyan-ibn-al-harith`, PR #171)
- [x] جعفر بن أبي سفيان — entry 33 (`jaafar-ibn-abi-sufyan-al-hashimi`)
- [x] جعفر بن أبي طالب — entry 34 (`jaafar-ibn-abi-talib`)
- [x] عقيل بن أبي طالب الهاشمي — entry 35 (`aqil-ibn-abi-talib`)
- [x] زيد بن حارثة — entry 36 (`zaid-ibn-harithah`)
- [x] عبد الله بن رواحة — entry 37 (`abdullah-ibn-rawahah`)
- ~~شهداء يوم الرجيع~~ (group heading)
- ~~شهداء بئر معونة~~ (group heading)
- [x] كلثوم بن الهدم — entry 38 (`kulthum-ibn-al-hidm`)
- [x] أبو دجانة الأنصاري (`abu-dujanah-al-ansari`, PR #162)
- [x] خبيب بن عدي (`khubayb-ibn-adi`, PR #166)
- [x] معاذ بن عمرو بن الجموح (`muadh-ibn-amr-ibn-al-jumuh`, PR #169)
- [x] معوذ بن عمرو (`muawwidh-ibn-amr-ibn-al-jumuh`, PR #161)
- [x] خلاد بن عمرو (`khallad-ibn-amr-ibn-al-jumuh`, PR #164)
- [x] عمرو بن الجموح (`amr-ibn-al-jumuh`, PR #170)
- [x] عبيدة بن الحارث (`ubaydah-ibn-al-harith`, PR #167)
- [ ] أعيان البدريين (group heading — verify before extracting; not
      checked off, unlike other headings, since it hasn't been confirmed
      collective the way the شهداء headings were)
- [x] ربيعة بن الحارث (`rabiah-ibn-al-harith`, PR #165)
- [x] عبد الله بن الحارث (`abdullah-ibn-al-harith-ibn-abd-al-muttalib`, PR #168)
- [x] خالد بن سعيد (`khalid-ibn-said`, PR #163)
- [x] أبان بن سعيد (`aban-ibn-said`, PR #172)
- [x] عمرو بن سعيد الأموي (`amr-ibn-said-al-umawi`, PR #173)
- [x] العلاء بن الحضرمي (`al-ala-ibn-al-hadrami`, PR #175)
- [x] سعد بن خيثمة (`saad-ibn-khaythamah`, PR #177)
- [x] البراء بن معرور (`al-baraa-ibn-marur`, PR #176)
- [x] بشر بن البراء (`bishr-ibn-al-baraa`, PR #174)
- [x] سعد بن عبادة (`saad-ibn-ubadah`, PR #188)
- [x] سعد بن معاذ (`saad-ibn-muadh`, PR #191)
- [x] زيد بن الخطاب (`zaid-ibn-al-khattab`, PR #183)
- [x] أسعد بن زرارة (`asad-ibn-zurarah`, PR #185)
- [x] عتبة بن غزوان (`utbah-ibn-ghazwan`, PR #196)
- [x] عكاشة بن محصن — entry 60 (`ukkashah-ibn-mihsan`, PR #193)
- [x] ثابت بن قيس (`thabit-ibn-qais`, PR #190)
- [ ] شهداء أجنادين واليرموك
- [x] طليحة بن خويلد (`tulayhah-ibn-khuwaylid`, PR #184)
- [x] سعد بن الربيع (`saad-ibn-al-rabi`, PR #189)
- [x] معن بن عدي — entry 64 (`maan-ibn-adi`, PR #192)
- [ ] عبد الله بن عبد الله بن أبي
- [ ] عكرمة بن أبي جهل
- [x] عبد الله بن عمرو بن حرام (abdullah-ibn-amr-ibn-haram, PR #194)
- [ ] يزيد بن أبي سفيان
- [x] أبو العاص بن الربيع (abu-al-as-ibn-ar-rabia, PR #195)
- [ ] زينب
- [x] أمامة بنت أبي العاص (`umamah-bint-abi-al-as`, PR #197)
- [ ] أبو زيد
- [ ] عباد بن بشر
- [x] أسيد بن الحضير (`usayd-ibn-al-hudayr`)
- [x] الطفيل بن عمرو الدوسي (`at-tufayl-ibn-amr-ad-dawsi`)
- [x] بلال بن رباح (`bilal-ibn-rabah`)
- [ ] ابن أم مكتوم
- [ ] خالد بن الوليد
- [ ] صفوان ابن بيضاء
- [ ] سهيل ابن بيضاء الفهري
- [ ] المقداد بن عمرو
- [ ] أبي بن كعب
- [ ] النعمان بن مقرن
- [ ] عمار بن ياسر
- [ ] أخبار النجاشي
- [ ] معاذ بن جبل
- [ ] عبد الله بن مسعود
- [ ] عتبة بن مسعود الهذلي
- [ ] خبيب بن يساف
- [ ] عويم بن ساعدة
- [ ] قصة سلمان الفارسي
- [ ] عبادة بن الصامت
- [ ] عبد الله بن حذافة
- [ ] أبو رافع
- [ ] صهيب بن سنان
- [ ] أبو طلحة الأنصاري
- [x] أبو بردة بن نيار (data/history/batches/abu-bardah-ibn-niyar, PR #198)
- [x] جبر بن عتيك (`jabr-ibn-atik`)
- [ ] الأشعث بن قيس
- [ ] حاطب بن أبي بلتعة
- [ ] أبو ذر
- [ ] العباس
- [ ] عمير بن سعد الأنصاري
- [ ] أبو سفيان
- [x] الحكم بن أبي العاص (`al-hakam-ibn-abi-al-as`, PR #186)
- [ ] كسرى
- [x] خديجة أم المؤمنين (`khadijah-bint-khuwaylid`, PR #203)
- [x] فاطمة بنت أسد (`fatimah-bint-asad`, PR #205)
- [x] فاطمة بنت رسول الله صلى الله عليه وسلم (`fatimah-bint-muhammad`, PR #215)
- [x] عائشة أم المؤمنين — `data/history/batches/aisha-bint-abi-bakr/` ([PR #216](https://github.com/msskzx/namaq/pull/216))
- [ ] أم سلمة أم المؤمنين
- [ ] زينب أم المؤمنين
- [ ] زينب أم المؤمنين
- [ ] أم حبيبة أم المؤمنين
- [x] أم أيمن (`umm-ayman`, PR #207)
- [x] حفصة أم المؤمنين — `data/history/batches/hafsa-bint-umar/` ([PR #202](https://github.com/msskzx/namaq/pull/202))
- [x] صفية أم المؤمنين (`safiyyah-bint-huyayy`, PR #210)
- [x] ميمونة أم المؤمنين (`maymunah-bint-al-harith`, PR #214)
- [ ] زينب بنت رسول الله
- [ ] رقية
- [ ] أم كلثوم بنت رسول الله
- [ ] زوجاته صلى الله عليه وسلم
- [ ] العالية
- [ ] أسماء
- [x] أم شريك — `data/history/batches/umm-shareek` (PR #201)
- [x] سناء (`sanaa-bint-asma-al-sulami`, PR #200)
- [x] الكلابية — `data/history/batches/al-kilabiyyah` (PR #204)
- [x] الكندية — `data/history/batches/asma-bint-al-numan-al-kindiyyah` (PR #206)
- [x] قتيلة — (`qutaylah-bint-qais-al-kindiyyah`, PR #208)
- [x] خولة — entry 38 (`khawlah-bint-hakim`)
- [x] جويرية أم المؤمنين (`juwayriyah-bint-al-harith`, PR #187)
- [x] سودة أم المؤمنين (`sawdah-bint-zamah`, PR #212)
- [x] صفية عمة رسول الله صلى الله عليه وسلم (`safiyyah-bint-abd-al-muttalib-siyar15`, PR #211)
- [x] أروى عمة رسول الله صلى الله عليه وسلم — `data/history/batches/arwa-bint-abd-al-muttalib-siyar175`, PR #213
- [ ] عاتكة عمة رسول الله صلى الله عليه وسلم
- [ ] البيضاء عمة رسول الله صلى الله عليه وسلم
- [ ] برة عمة رسول الله صلى الله عليه وسلم
- [ ] أميمة
- [ ] ضباعة
- [ ] درة
- [ ] أم كلثوم
- [ ] أم عمارة
- [ ] أسماء بنت عميس
- [ ] أسماء بنت أبي بكر
- [ ] أسماء بنت يزيد بن السكن
- [ ] بريرة
- [ ] أم سليم الغميصاء
- [ ] أم هانئ
- [ ] أم الفضل
- [ ] أم حرام
- [ ] أم عطية الأنصارية
- [ ] فاطمة بنت قيس الفهرية
- [ ] عثمان بن حنيف
- [ ] خباب بن الأرت
- [ ] سهل بن حنيف
- [ ] خوات بن جبير
- [ ] عبد الله بن جبير
- [ ] قتادة بن النعمان
- [ ] عامر بن ربيعة
- [ ] أبو الدرداء
- [ ] عياض بن غنم
- [ ] سلمة بن سلامة
- [ ] النعمان بن مقرن
- [ ] معاذ بن الحارث
- [ ] معوذ بن الحارث
- [ ] عوف بن الحارث
- [ ] رفاعة
- [ ] حذيفة بن اليمان
- [ ] محمد بن مسلمة
- [ ] عثمان بن أبي العاص
- [ ] عبد الله بن زيد
- [ ] عبد الله بن زيد المازني النجاري
- [ ] حارثة بن النعمان
- [ ] أبو موسى الأشعري
- [ ] أبو أيوب الأنصاري
- [ ] عبد الله بن سلام
- [ ] زيد بن ثابت
- [ ] تميم الداري
- [ ] أبو قتادة الأنصاري السلمي
- [ ] عمرو بن عبسة
- [ ] شداد بن أوس
- [ ] عقبة بن عامر الجهني
- [ ] بريدة بن الحصيب
- [ ] عبد الرحمن بن أبي بكر الصديق
- [ ] الحكم بن عمرو الغفاري
- [ ] رافع بن عمرو الغفاري
- [ ] رافع بن عمرو المزني البصري
- [ ] الأرقم بن أبي الأرقم
- [ ] أبو حميد الساعدي
- [ ] عبد الله بن الأرقم
- [ ] عبد الله بن مغفل
- [ ] خزيمة بن ثابت
- [ ] عوف بن مالك الأشجعي الغطفاني
- [ ] معيقيب بن أبي فاطمة الدوسي
- [ ] أبو مسعود البدري
- [ ] أسامة بن زيد
- [ ] عمران بن حصين
- [ ] حسان بن ثابت
- [ ] كعب بن مالك
- [ ] جرير بن عبد الله
- [ ] أبو اليسر كعب بن عمرو الأنصاري
- [ ] أبو أسيد الساعدي
- [ ] حويطب بن عبد العزى القرشي
- [ ] سعيد بن يربوع القرشي
- [ ] مخرمة بن نوفل
- [ ] أبو الغادية الصحابي
- [ ] صفوان بن المعطل
- [ ] دحية الكلبي
- [ ] أبو جهم بن حذيفة القرشي
- [ ] عمير بن سعد
- [ ] صفوان بن أمية
- [ ] أبو ثعلبة الخشني
- [ ] عبد الرحمن بن سمرة
- [ ] وائل بن حجر بن سعد
- [ ] أبو واقد الليثي
- [ ] معقل بن يسار
- [ ] معقل بن سنان الأشجعي
- [ ] أبو هريرة
- [ ] أبو بكرة الثقفي الطائفي
- [ ] عثمان بن طلحة
- [ ] شيبة بن عثمان
- [ ] أبو رفاعة العدوي
- [ ] ثوبان النبوي
- [ ] عبد الله بن عامر
- [ ] المغيرة بن شعبة
- [ ] عبد الله بن سعد
- [ ] رويفع بن ثابت
- [ ] معاوية بن حديج
- [ ] أبو برزة الأسلمي
- [ ] حكيم بن حزام
- [ ] هشام بن حكيم
- [ ] كعب بن عجرة
- [ ] عمرو بن العاص
- [ ] هشام بن العاص
- [ ] عبد الله بن عمرو بن العاص
- [ ] جبير بن مطعم
- [ ] يعلى بن أمية
- [ ] قيس بن سعد
- [ ] عبد المطلب بن ربيعة
- [ ] فضالة بن عبيد
- [ ] أبو محذورة الجمحي
- [ ] معاوية بن أبي سفيان
- [ ] عدي بن حاتم
- [ ] زيد بن أرقم
- [ ] أبو سعيد الخدري
- [ ] سفينة
- [ ] جندب
- [ ] جندب الأزدي
- [ ] النابغة الجعدي
- [ ] عمرو بن أمية
- [ ] رافع بن خديج
- [ ] سمرة بن جندب
- [ ] جابر بن سمرة
- [ ] حبيب بن مسلمة
- [ ] جابر بن عبد الله
- [ ] البراء بن عازب

This list runs only as far as the index page pulled at time of writing
(2026-09-29); the book continues past البراء بن عازب. Extend it as
extraction reaches the end, and re-check each remaining entry's scope
against [docs/data-pipelines.md](data-pipelines.md#companion-scope) — a
`[ ]` this deep into the list has not been screened for whether it's in
تقريب التهذيب's الصحابة or already past it into كبار التابعين.

Note: عقيل بن أبي طالب الهاشمي (entry 35) appeared twice in the index output
this list was first built from; it is one entry, listed once above.
