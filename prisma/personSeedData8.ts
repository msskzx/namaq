/**
 * Batch 5 of companion names extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * following the book's entries in order (islamweb bookid=60), covering
 * content-ids 121-138 (starting right after the last of batch 4,
 * prisma/personSeedData7.ts, salman-al-farisi). fullName is
 * filled in from the nasab given on each entry's own page, extended up
 * through ancestors already present in the graph where possible (see
 * neo4j/graphSeedData7.ts) — appearance/virtues are still left for a later
 * enrichment batch.
 *
 * Content-ids 131-133 and 135 are gaps in the source tree's id sequence
 * (belong to a different branch) and are intentionally skipped.
 *
 * Two entries already have an existing Neo4j Person node from earlier work
 * and get a Postgres profile only (no new node, see graphSeedData7.ts):
 *   - Content-id 134 ("العباس"): confirmed by its own page as al-Abbas ibn
 *     Abd al-Muttalib, the Prophet's uncle — already a core Person node
 *     (al-abbas-ibn-abd-al-muttalib, corePeopleQueries in graphSeedData.ts).
 *     fullName here ("العباس بن عبد المطلب بن هاشم القرشي الهاشمي") matches
 *     the pattern used for his brother abu-talib/al-harith-ibn-abd-al-
 *     muttalib. (A richer, unwired profile with virtues/extra titles already
 *     exists for this same slug in prisma/personSeedData.ts from a prior,
 *     since-superseded live sync — not reused here, to keep this batch
 *     consistent with the minimal ['companion']-only convention used by
 *     batches 1-4; a later enrichment pass can reconcile the two.)
 *   - Content-id 137 ("أبو سفيان"): confirmed by its own page as Abu Sufyan
 *     ibn Harb (Sakhr ibn Harb), father of Yazid ibn Abi Sufyan and brother
 *     of Umm Habibah — already a Person node from batch 4
 *     (abu-sufyan-ibn-harb, graphSeedData6.ts) but with no Postgres profile
 *     until now.
 *
 * Other notes:
 * - Content-id 123 ("أبو رافع"): a Coptic mawla of the Prophet (originally
 *   enslaved by al-Abbas, then freed). His own page gives two disputed given
 *   names ("يقال: اسمه إبراهيم، وقيل: أسلم") and no Arab nasab at all —
 *   fullName is left null and no ancestor chain is created, same precedent
 *   as salim-mawla-abi-hudhayfah/salman-al-farisi.
 * - Content-id 128 ("الأشعث بن قيس"): a genuinely complex case — fought
 *   against the Muslims pre-Islam, later apostatized with part of Kindah
 *   during the Ridda wars, was besieged, and secured amnesty from Abu Bakr
 *   by re-embracing Islam (Abu Bakr then married him to his sister Umm
 *   Farwah). His own page explicitly credits him with companion status
 *   ("له صحبة، ورواية") despite this history. Kept as a companion per the
 *   book's own framing, same precedent as tulayhah-ibn-khuwaylid in batch 4.
 * - Content-id 130 ("أبو ذر"): Abu Dharr al-Ghifari, one of the earliest
 *   converts ("من السابقين الأولين"). Name/slug given the "-al-ghifari"
 *   nisbah suffix (matching the page's own tribal identification) even
 *   though the page's title is the bare kunya, consistent with how earlier
 *   batches disambiguated other kunya-only entries (e.g. abu-dujanah-al-
 *   ansari, abu-al-haytham-ibn-at-tayyihan).
 * - Content-id 138 ("الحكم بن أبي العاص"): an Umayyad, cousin of Abu Sufyan
 *   ibn Harb (both grandsons of Umayya ibn Abd Shams — his father is the
 *   SAME "أبي العاص بن أمية" already in the graph as Uthman ibn Affan's
 *   great-grandfather via Affan, see graphSeedData2.ts). His own page
 *   explicitly frames him with marginal companion status: "من مسلمة الفتح"
 *   (converted at the Conquest of Mecca) and "له أدنى نصيب من الصحبة" (he
 *   has the slightest share of companionship) — the Prophet reportedly
 *   exiled him to Ta'if, and he was recalled to Medina under Uthman. Kept as
 *   a companion per the book's own explicit "من الصحبة" wording, same
 *   marginal-but-book-gives-own-entry precedent used for saeed-ibn-al-harith,
 *   al-baraa-ibn-marur and umamah-bint-abi-al-as in earlier batches. His son
 *   Marwan (the future Umayyad caliph Marwan I) is not in scope — a tabi'i,
 *   not a companion, and not created here.
 *
 * No fullName in this batch is inferred from sibling placement — every
 * entry below has its own nasab, however short, stated directly on its own
 * page.
 */
export const people = [
  {
    name: 'عبادة بن الصامت',
    fullName: 'عبادة بن الصامت بن قيس بن أصرم بن فهر بن ثعلبة بن غنم بن عوف بن عمرو بن عوف الأنصاري الخزرجي',
    slug: 'ubadah-ibn-al-samit',
    nameTransliterated: 'Ubadah ibn al-Samit',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عبد الله بن حذافة',
    fullName: 'عبد الله بن حذافة بن قيس بن عدي السهمي القرشي',
    slug: 'abdullah-ibn-hudhafah',
    nameTransliterated: 'Abdullah ibn Hudhafah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Coptic mawla of the Prophet — no Arab nasab, given name disputed
    // (Ibrahim or Aslam) — see header note above.
    name: 'أبو رافع',
    fullName: null,
    slug: 'abu-rafi',
    nameTransliterated: 'Abu Rafi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'صهيب بن سنان',
    fullName: 'صهيب بن سنان بن مالك بن عبد عمرو بن عقيل بن عامر النمري',
    slug: 'suhaib-ibn-sinan',
    nameTransliterated: 'Suhaib ibn Sinan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو طلحة الأنصاري',
    fullName: 'زيد بن سهل بن الأسود بن حرام بن عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري',
    slug: 'abu-talha-al-ansari',
    nameTransliterated: 'Abu Talha al-Ansari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Given name Hani' — "Abu Bardah" is the common kunya-based name used as
    // the book's entry title and this profile's display name.
    name: 'أبو بردة بن نيار',
    fullName: 'هانئ بن نيار بن عمرو بن عبيد بن عمرو بن كلاب بن دهمان البلوي القضاعي حليف الأوس',
    slug: 'abu-bardah-ibn-niyar',
    nameTransliterated: 'Abu Bardah ibn Niyar',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'جبر بن عتيك',
    fullName: 'جبر بن عتيك بن قيس بن هيشة بن الحارث بن أمية بن معاوية بن مالك بن عوف بن عمرو بن عوف الأنصاري',
    slug: 'jabr-ibn-atik',
    nameTransliterated: 'Jabr ibn Atik',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See header note above on his complex Ridda-era history — kept as a
    // companion per the book's own explicit "له صحبة" framing.
    name: 'الأشعث بن قيس',
    fullName: 'الأشعث بن قيس بن معدي كرب بن معاوية بن جبلة بن عدي بن ربيعة بن معاوية الأكرمين بن الحارث بن معاوية بن ثور بن مرتع بن كندة',
    slug: 'al-ashath-ibn-qais',
    nameTransliterated: 'Al-Ashath ibn Qais',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Ally (حليف) of Banu Asad ibn Abd al-Uzza, not blood Quraysh. His real
    // name (Amr) is used in fullName in place of his father's kunya "Abi
    // Baltaah", matching the precedent set by abu-sufyan-ibn-al-harith in
    // batch 2 (real name preferred over kunya in the nasab chain).
    name: 'حاطب بن أبي بلتعة',
    fullName: 'حاطب بن عمرو بن عمير بن سلمة اللخمي المكي حليف بني أسد بن عبد العزى بن قصي',
    slug: 'hatib-ibn-abi-baltaah',
    nameTransliterated: 'Hatib ibn Abi Baltaah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See header note above: name/slug given the "-al-ghifari" nisbah even
    // though the page's own title is the bare kunya. His own page gives no
    // ancestor beyond his immediate father (no grandfather named).
    name: 'أبو ذر الغفاري',
    fullName: 'جندب بن جنادة الغفاري',
    slug: 'abu-dharr-al-ghifari',
    nameTransliterated: 'Abu Dharr al-Ghifari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (al-abbas-ibn-abd-al-muttalib, core, no new
    // node created) — see header note above.
    name: 'العباس بن عبد المطلب',
    fullName: 'العباس بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'al-abbas-ibn-abd-al-muttalib',
    nameTransliterated: 'Al-Abbas ibn Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // fullName per one report cited on his own page (Abdullah ibn Muhammad
    // al-Qaddah): "Sa'd ibn Shahid" — the page does not extend the nasab
    // further back.
    name: 'عمير بن سعد الأنصاري',
    fullName: 'عمير بن سعد بن شهيد الأنصاري الأوسي',
    slug: 'umayr-ibn-saad-al-ansari',
    nameTransliterated: 'Umayr ibn Saad al-Ansari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (abu-sufyan-ibn-harb, batch 4, no new node
    // created) — see header note above.
    name: 'أبو سفيان بن حرب',
    fullName: 'صخر بن حرب بن أمية بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي الأموي',
    slug: 'abu-sufyan-ibn-harb',
    nameTransliterated: 'Abu Sufyan ibn Harb',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See header note above: marginal companion ("له أدنى نصيب من
    // الصحبة"), father reuses the existing abi-al-as-ibn-umayya node.
    name: 'الحكم بن أبي العاص',
    fullName: 'الحكم بن أبي العاص بن أمية بن عبد شمس القرشي الأموي',
    slug: 'al-hakam-ibn-abi-al-as',
    nameTransliterated: 'Al-Hakam ibn Abi al-As',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
