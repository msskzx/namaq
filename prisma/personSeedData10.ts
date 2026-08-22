/**
 * Batch 7 of companion entries extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * covering content-ids 164-193 (islamweb bookid=60) — the Prophet's more
 * minor/lesser-known wives, his paternal aunts (and several cousins wrongly
 * assumed to be aunts at first glance), and a set of notable women
 * companions. All ids in this range are consecutive individual entries, no
 * group headers to skip.
 *
 * Two entries already had a Neo4j Person node from earlier work
 * (juwayriyah-bint-al-harith, sawdah-bint-zamah, both core) — profile only,
 * no new node, see graphSeedData9.ts.
 *
 * Content-id 165 ("أسماء") is intentionally skipped: her own page gives two
 * disputed identities (bint Ka'b al-Jawniyyah, or bint al-Nu'man
 * al-Ghifariyyah), both describing an unconsummated marriage ended when she
 * sought refuge in God from the Prophet — the same core tradition given much
 * more specifically at content-id 169 ("الكندية" = Asma bint al-Nu'man ibn
 * Abi al-Jawn al-Kindi, with full father's name, date, and later husband).
 * Rather than create a probable duplicate profile from the vaguer of the two
 * tellings, this defers to id 169's fuller entry — same precedent as
 * content-id 84 in batch 4, deferred to content-id 160.
 *
 * Two more paternal-aunt-labelled entries (ids 180, 181) turned out on
 * reading to NOT be daughters of Abd al-Muttalib at all — Dubaa'ah is a
 * daughter of his son al-Zubayr ibn Abd al-Muttalib, and Durrah is a
 * daughter of his son Abu Lahab — i.e. first cousins of the Prophet, not
 * paternal aunts. Modelled accordingly, not as siblings of Hamzah/Abu
 * Talib/al-Abbas.
 *
 * fullName is filled in from each entry's own page nasab where given.
 * Several entries in this batch (164, 166, 187, 192) have essentially no
 * nasab at all in the source — kept as minimal profiles (name + slug only)
 * rather than skipped, since the book still gives each its own individual
 * entry in the Companions section, unlike the thematic group headers
 * skipped in earlier batches.
 */
export const people = [
  {
    // No father given; tribe itself disputed (Bakr ibn Kilab or Ghifar) —
    // see graphSeedData9.ts, no ancestor chain modelled. Marriage to the
    // Prophet was annulled before consummation (a physical blemish found,
    // per the book) — one of several such entries in this batch.
    name: 'العالية',
    fullName: null,
    slug: 'al-aliyah',
    nameTransliterated: 'Al-Aliyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No father given (Ansari, Banu al-Najjar, per her page) — no ancestor
    // chain modelled. Marriage to the Prophet not consummated (per the
    // book, over concern for the Ansar's known jealousy in marriage).
    name: 'أم شريك',
    fullName: null,
    slug: 'umm-sharik',
    nameTransliterated: 'Umm Sharik',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Her own page gives two candidate identifications for her father
    // ("Asma bint al-Salt al-Sulami" primarily, or "bint Sufyan
    // al-Kilabiyyah" as an alternate) — the first is used for fullName.
    // Possibly the same tradition referenced again at id 168 below (one of
    // that entry's several candidate identities) — not merged, since
    // neither entry states the identity with certainty. Died before her
    // marriage to the Prophet was consummated.
    name: 'سناء',
    fullName: 'سناء بنت أسماء بن الصلت السلمية',
    slug: 'sanaa-bint-asma-al-sulami',
    nameTransliterated: 'Sanaa bint Asma al-Sulami',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // The book itself presents this as a composite/disputed entry: possibly
    // Fatimah bint al-Dahhak ibn Sufyan, Amrah bint Zayd, al-Aliyah bint
    // Zubyan, or Sanaa bint Sufyan (see id 167 above) — no single nasab is
    // settled, so fullName is left null and no ancestor chain is modelled.
    // Marriage to the Prophet not consummated.
    name: 'الكلابية',
    fullName: null,
    slug: 'al-kilabiyyah',
    nameTransliterated: 'Al-Kilabiyyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Fuller version of the tradition possibly also referenced more vaguely
    // at id 165 (skipped, see file header). Father's name and tribe given
    // explicitly; new ancestor node in graphSeedData9.ts. Marriage to the
    // Prophet not consummated; she later married al-Muhajir ibn Abi Umayyah
    // (not created here, not otherwise in this pipeline).
    name: 'أسماء بنت النعمان',
    fullName: 'أسماء بنت النعمان بن أبي الجون الكندي',
    slug: 'asma-bint-al-numan-al-kindiyyah',
    nameTransliterated: 'Asma bint al-Numan al-Kindiyyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Sister of the companion al-Ash'ath ibn Qais (al-ashath-ibn-qais,
    // batch 5) — same father, reused as her own ancestor node in
    // graphSeedData9.ts. Per the book, the Prophet married her when the
    // Kindah delegation arrived (10 AH) but died before she reached him;
    // an alternate report says she apostatized instead.
    name: 'قتيلة',
    fullName: 'قتيلة بنت قيس بن معدي كرب الكندية',
    slug: 'qutaylah-bint-qais-al-kindiyyah',
    nameTransliterated: 'Qutaylah bint Qais al-Kindiyyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Father named, no deeper chain given — no separate ancestor node.
    // Among the wives the Prophet "deferred" (per the Qur'anic allowance).
    name: 'خولة بنت حكيم',
    fullName: 'خولة بنت حكيم',
    slug: 'khawlah-bint-hakim',
    nameTransliterated: 'Khawlah bint Hakim',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (juwayriyah-bint-al-harith, core, no new
    // node created) — new DAUGHTER/FATHER edges to a new ancestor node for
    // her father al-Harith ibn Abi Dirar (himself a later convert, per her
    // page) added in graphSeedData9.ts.
    name: 'جويرية بنت الحارث',
    fullName: 'جويرية بنت الحارث بن أبي ضرار المصطلقية',
    slug: 'juwayriyah-bint-al-harith',
    nameTransliterated: 'Juwayriyah bint al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (sawdah-bint-zamah, core, no new node
    // created) — new DAUGHTER/FATHER edges to a new ancestor node for her
    // father, plus a WIFE/HUSBAND pair to her first husband al-Sakran ibn
    // Amr (a new graph-only node, explicitly named on her page as brother
    // of the existing companion Suhail ibn Amr) added in graphSeedData9.ts.
    name: 'سودة بنت زمعة',
    fullName: 'سودة بنت زمعة بن قيس القرشية العامرية',
    slug: 'sawdah-bint-zamah',
    nameTransliterated: 'Sawdah bint Zamah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Full sister of Hamzah ibn Abd al-Muttalib (existing core node) via a
    // shared Zuhri mother, per her own page — mother of Az-Zubayr ibn
    // al-Awwam (existing core node) by her husband al-Awwam ibn Khuwaylid
    // (existing node, graphSeedData3.ts). Distinct from safiyyah-bint-huyayy
    // (batch 6, one of the Prophet's wives).
    name: 'صفية بنت عبد المطلب',
    fullName: 'صفية بنت عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'safiyyah-bint-abd-al-muttalib',
    nameTransliterated: 'Safiyyah bint Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Her own page describes her only as "عمة رسول الله" without literally
    // stating "بنت عبد المطلب" — fullName follows the sibling-grouping
    // inference rule (she's listed under the same "paternal aunts" heading
    // as safiyyah/atikah/al-bayda/barrah, all of whom DO explicitly confirm
    // that parentage on their own pages), flagged here as inferred rather
    // than page-quoted for this specific entry.
    name: 'أروى بنت عبد المطلب',
    fullName: 'أروى بنت عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'arwa-bint-abd-al-muttalib',
    nameTransliterated: 'Arwa bint Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Explicit sister of Abu Lahab ibn Abd al-Muttalib (new graph-only
    // node, see graphSeedData9.ts — he was never a Muslim, no profile).
    // Famous for a dream foretelling the Quraysh defeat at Badr, which kept
    // Abu Lahab from attending the battle in person.
    name: 'عاتكة بنت عبد المطلب',
    fullName: 'عاتكة بنت عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'atikah-bint-abd-al-muttalib',
    nameTransliterated: 'Atikah bint Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Also known by the kunyah Umm Hakim. Via her first husband Kurayz ibn
    // Rabi'ah, mother of Arwa bint Kurayz — in turn the mother of Uthman
    // ibn Affan (existing core node), a connection added via a new
    // graph-only node in graphSeedData9.ts. Via her second husband Uqba ibn
    // Abi Mu'ayt, mother of Umm Kulthum bint Uqba (this batch's id 182,
    // below) — that maternal link is cross-referenced from THIS entry, not
    // stated on id 182's own page (see that entry's note).
    name: 'البيضاء بنت عبد المطلب',
    fullName: 'البيضاء أم حكيم بنت عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'al-bayda-bint-abd-al-muttalib',
    nameTransliterated: 'Al-Bayda bint Abd al-Muttalib (Umm Hakim)',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Mother (by her first husband) of the companion Abu Salamah ibn Abd
    // al-Asad (existing node abu-salamah, batch 1) — a MOTHER/SON edge is
    // added to that existing node in graphSeedData9.ts. Her page explicitly
    // says she did not live to see the Prophet's mission, and is mentioned
    // "in passing" for her sons' sake.
    name: 'برة بنت عبد المطلب',
    fullName: 'برة بنت عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'barrah-bint-abd-al-muttalib',
    nameTransliterated: 'Barrah bint Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // A genuinely disputed identity: her own page opens by calling her
    // "بنت عبد المطلب" but al-Dhahabi himself then casts doubt on this,
    // citing a report that she is instead Umaymah bint Rabi'ah (a
    // granddaughter of Abd al-Muttalib via his son al-Harith, one
    // generation removed) and concludes the "real" aunt Umaymah likely
    // never migrated or lived into Islam at all. fullName here follows the
    // entry's own opening statement (matching how earlier batches handled
    // disputed nasab, e.g. Abu Rafi's Ibrahim/Aslam naming) — the dispute
    // itself is not restated in the data, only here. What is NOT disputed:
    // she is the mother of Zaynab bint Jahsh (existing node, batch 6) and
    // Abdullah ibn Jahsh (not yet in this pipeline) by her husband Jahsh
    // ibn Riyab (new graph-only node), and received a Khaybar grant.
    name: 'أميمة بنت عبد المطلب',
    fullName: 'أميمة بنت عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'umaymah-bint-abd-al-muttalib',
    nameTransliterated: 'Umaymah bint Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // NOT a paternal aunt despite the book listing her among that group's
    // entries — her own page gives her father as al-Zubayr ibn Abd
    // al-Muttalib (a son of Abd al-Muttalib), making her a first cousin of
    // the Prophet. Distinct from the unrelated companion az-zubayr-ibn-al-
    // awwam. Wife of the companion al-Miqdad ibn Amr (existing node,
    // batch 4 — also known as "ibn al-Aswad" per an adoption/alliance
    // naming convention, matching this entry's "al-Miqdad ibn al-Aswad").
    name: 'ضباعة بنت الزبير',
    fullName: 'ضباعة بنت الزبير بن عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'dubaah-bint-al-zubayr-ibn-abd-al-muttalib',
    nameTransliterated: 'Dubaah bint al-Zubayr ibn Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // NOT a paternal aunt — daughter of Abu Lahab ibn Abd al-Muttalib (new
    // graph-only node, see id 176 above), making her a first cousin of the
    // Prophet and niece of Atikah (id 176).
    name: 'درة بنت أبي لهب',
    fullName: 'درة بنت أبي لهب بن عبد المطلب القرشية الهاشمية',
    slug: 'durrah-bint-abi-lahab',
    nameTransliterated: 'Durrah bint Abi Lahab',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // A third, distinct "Umm Kulthum" in this pipeline (not Muhammad's
    // daughter, not Ali's daughter) — of Banu Umayyah via her father Uqba
    // ibn Abi Mu'ayt (new graph-only node, reached via al-bayda-bint-abd-
    // al-muttalib's own entry above — her maternal link to al-Bayda is
    // cross-referenced from THAT entry, not stated on this one). Married,
    // in sequence: Zaid ibn Harithah (existing node, batch 2; ended in
    // divorce) and Abdur-Rahman ibn Awf (existing core node; until her
    // death). A third marriage to Amr ibn al-As is noted but not modelled
    // — he is not yet a node in this pipeline.
    name: 'أم كلثوم بنت عقبة',
    fullName: 'أم كلثوم بنت عقبة بن أبي معيط بن أبان بن ذكوان بن أمية بن عبد شمس القرشية الأموية',
    slug: 'umm-kulthum-bint-uqbah',
    nameTransliterated: 'Umm Kulthum bint Uqbah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Famous for fighting to defend the Prophet at Uhud (sustaining
    // thirteen wounds) after first providing water/supplies, and for
    // losing a hand at Yamamah. Her nasab as given on her own page stops
    // at "ibn Mabdhul" and does not explicitly continue to the existing
    // Najjar-branch ancestor nodes (adi-ibn-al-najjar etc.) used elsewhere
    // in this pipeline — kept as a standalone chain rather than assuming
    // that connection. Her sons (Habib ibn Zaid, Abdullah ibn Zaid
    // al-Mazini) and brother (Abdullah ibn Ka'b al-Mazini) are not yet in
    // this pipeline and are not created here.
    name: 'أم عمارة',
    fullName: 'نسيبة بنت كعب بن عمرو بن عوف بن مبذول الأنصارية الخزرجية النجارية المازنية',
    slug: 'umm-umarah',
    nameTransliterated: 'Umm Umarah (Nusaybah bint Kaab)',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Married, in sequence: Jaafar ibn Abi Talib (existing node, batch 2 —
    // mother by him of the existing node abdullah-ibn-jaafar), then Abu
    // Bakr as-Siddiq (existing core node) after Jaafar's death at Mutah,
    // then Ali ibn Abi Talib (existing core node) after Abu Bakr's death.
    name: 'أسماء بنت عميس',
    fullName: 'أسماء بنت عميس بن معبد بن الحارث الخثعمية',
    slug: 'asma-bint-umays',
    nameTransliterated: 'Asma bint Umays',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Full sister to Aisha bint Abi Bakr is stated by some sources, but the
    // maternal-lineage claim on her own page (via a mother "Qutaylah bint
    // Abd al-Uzza") is not independently corroborated here against Aisha's
    // separately-known mother (Umm Ruman) — left unmodelled pending
    // verification, rather than asserted. What IS solidly confirmed: her
    // father Abu Bakr as-Siddiq (existing core node) and her husband
    // Az-Zubayr ibn al-Awwam (existing core node) — she is also the mother
    // of Caliph Abdullah ibn al-Zubayr (not yet in this pipeline).
    name: 'أسماء بنت أبي بكر',
    fullName: 'أسماء بنت أبي بكر عبد الله بن أبي قحافة عثمان بن عامر القرشية التيمية',
    slug: 'asma-bint-abi-bakr',
    nameTransliterated: 'Asma bint Abi Bakr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Father named, no deeper chain given — no separate ancestor node.
    // Cousin of the companion Muadh ibn Jabal (existing node, batch 4) —
    // her page describes her as daughter of his paternal aunt. Killed nine
    // Byzantine soldiers with a tent pole at the Battle of Yarmouk, per her
    // own entry.
    name: 'أسماء بنت يزيد بن السكن',
    fullName: 'أسماء بنت يزيد بن السكن الأنصارية الأشهلية',
    slug: 'asma-bint-yazid-ibn-al-sakn',
    nameTransliterated: 'Asma bint Yazid ibn al-Sakn',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // A freedwoman with no Arab nasab (mawla of Aisha bint Abi Bakr, who
    // purchased and freed her — same precedent as salman-al-farisi,
    // abu-rafi). Her husband Mughith ibn Jahsh is not created here.
    name: 'بريرة',
    fullName: null,
    slug: 'barirah',
    nameTransliterated: 'Barirah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Mother of Anas ibn Malik (not yet in this pipeline). Her nasab chain
    // reaches several ancestor nodes already created for al-Baraa ibn Malik
    // (batch 4) — see graphSeedData9.ts. First husband Malik ibn al-Nadr is
    // the SAME existing graph-only node created for al-Baraa ibn Malik's
    // father (that node's own batch-4 comment already documents him as
    // father of both al-Baraa ibn Malik and Anas ibn Malik). Second
    // husband: the existing companion Abu Talha al-Ansari (batch 5).
    name: 'أم سليم الغميصاء',
    fullName: 'الغميصاء بنت ملحان بن خالد بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصارية الخزرجية',
    slug: 'umm-sulaym-al-ghumaysa',
    nameTransliterated: 'Umm Sulaym al-Ghumaysa',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Daughter of Abu Talib (existing core node) and, per the sibling-
    // grouping inference rule, mother Fatimah bint Asad (existing node,
    // batch 6, mother of her confirmed full brothers Ali and Jaafar) —
    // flagged as inferred since not stated on her own page. Her husband's
    // name is given inconsistently between this entry ("Hubayrah ibn Amr
    // ibn Aidh al-Makhzumi") and the initial task brief ("Hubayrah ibn Abi
    // Wahb") — not modelled here pending a human check of the raw page;
    // see graphSeedData9.ts. Well known for the "we grant protection to
    // whoever you protect" hadith at the conquest of Mecca.
    name: 'أم هانئ',
    fullName: 'أم هانئ فاختة بنت أبي طالب عبد مناف بن عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'umm-hani-bint-abi-talib',
    nameTransliterated: 'Umm Hani bint Abi Talib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Explicitly confirmed on her own page as wife of al-Abbas ibn Abd
    // al-Muttalib (existing core node) and sister of the existing companion
    // Maymunah bint al-Harith (batch 6) — both now share a new ancestor
    // node for their father, see graphSeedData9.ts. Mother of Abdullah ibn
    // Abbas (not yet in this pipeline) per her own page; a second son
    // Tammam is named but not created here.
    name: 'أم الفضل',
    fullName: 'لبابة بنت الحارث بن حزن بن بجير الهلالية',
    slug: 'umm-al-fadl-bint-al-harith',
    nameTransliterated: 'Umm al-Fadl bint al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Shares her father with Umm Sulaym al-Ghumaysa above (a new ancestor
    // node created for that entry, reused here) — explicitly confirmed as
    // her sister on this page. Wife of the existing companion Ubadah ibn
    // al-Samit (batch 5). Died from a mule accident after disembarking from
    // the Cyprus expedition, per her page's account of a prophetic dream
    // about her people "riding the sea like kings."
    name: 'أم حرام',
    fullName: 'أم حرام بنت ملحان بن خالد بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصارية النجارية',
    slug: 'umm-haram-bint-milhan',
    nameTransliterated: 'Umm Haram bint Milhan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Her own page gives two variant names for her father (al-Harith, used
    // here, or Kaab per an alternate report) with no deeper chain either
    // way — no ancestor node created. Washed the body of the Prophet's
    // daughter Zaynab bint Muhammad (existing node, batch 6) after her
    // death, per her own entry; described as among the jurist-companions.
    name: 'أم عطية الأنصارية',
    fullName: 'نسيبة بنت الحارث الأنصارية',
    slug: 'umm-atiyyah-al-ansariyyah',
    nameTransliterated: 'Umm Atiyyah al-Ansariyyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Sister of al-Dahhak ibn Qais (not yet in this pipeline). Her first
    // husband (Abu Amr ibn Hafs ibn al-Mughirah al-Makhzumi, whose triple
    // divorce of her is the subject of a well-known hadith on maintenance
    // for divorced women) is not modelled here — his exact place in the
    // Makhzum tree isn't confirmed against existing nodes. Her second
    // husband, Usamah ibn Zaid (on the Prophet's recommendation, after
    // suitors Muawiyah ibn Abi Sufyan and Abu Jahm were declined), is also
    // not yet a node in this pipeline.
    name: 'فاطمة بنت قيس الفهرية',
    fullName: 'فاطمة بنت قيس الفهرية القرشية',
    slug: 'fatimah-bint-qais-al-fihriyyah',
    nameTransliterated: 'Fatimah bint Qais al-Fihriyyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
