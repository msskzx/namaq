"use client";

import { useLanguage } from "@/components/language/LanguageContext";

export default function AttributionsPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="w-full px-4 py-8 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="mb-4 text-center text-3xl font-bold text-amber-400">
          {language === 'ar' ? 'العزو' : 'Attributions'}
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-center text-lg text-gray-800 dark:text-gray-200">
          {language === 'ar'
            ? 'الأعمال والبيانات التي اعتمد عليها نمق، ولمن يعود كل منها.'
            : 'The works and data Namaq relies on, and whom each one belongs to.'}
        </p>

        <section className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-6 dark:border-white/10">
          <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100" dir="rtl" lang="ar">
            سير أعلام النبلاء
          </h2>
          <dl className="space-y-2 text-gray-700 dark:text-gray-300">
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'المؤلف: ' : 'Author: '}</dt>
              <dd className="inline" dir="rtl" lang="ar">شمس الدين الذهبي</dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'النسخة الرقمية: ' : 'Digital edition: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://shamela.ws/index.php/book/10906" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'المكتبة الشاملة' : 'Shamela Library'}
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'النسخة المصورة: ' : 'Scanned edition: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://archive.org/details/sanbz" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'Archive.org، الطبعة الثالثة، ١٤٠٥/١٩٨٥' : 'Archive.org, third edition, 1405/1985'}
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'نص OCR للبحث: ' : 'Searchable OCR text: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://archive.org/download/sanbz/sansera1_djvu.txt" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'السيرة النبوية، المجلد الأول' : 'Prophet’s Sira, volume 1'}
                </a>
                {' · '}
                <a className="underline" href="https://archive.org/download/sanbz/sansera2_djvu.txt" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'السيرة النبوية، المجلد الثاني' : 'Prophet’s Sira, volume 2'}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {language === 'ar'
              ? 'ملفات النص ناتجة عن التعرف الضوئي على الحروف، وهي للبحث والمقارنة. تُراجع الحواشي على صفحات النسخة المصورة.'
              : 'The text files are OCR aids for searching and comparison. Check footnotes against the scanned pages.'}
          </p>
        </section>

        <section id="quranic-arabic-corpus" className="mx-auto mt-6 max-w-3xl scroll-mt-20 rounded-lg border border-gray-200 p-6 dark:border-white/10">
          <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {language === 'ar' ? 'المدوّنة القرآنية العربية' : 'Quranic Arabic Corpus'}
          </h2>
          <dl className="space-y-2 text-gray-700 dark:text-gray-300">
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'المؤلف: ' : 'Author: '}</dt>
              <dd className="inline">{language === 'ar' ? 'Kais Dukes، جامعة ليدز' : 'Kais Dukes, University of Leeds'}</dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'البيانات: ' : 'Data: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://corpus.quran.com" target="_blank" rel="noreferrer">corpus.quran.com</a>
                {language === 'ar' ? '، التحليل الصرفي، الإصدار ٠٫٤، بترخيص GNU GPL' : ', morphology, version 0.4, under the GNU GPL'}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'النص: ' : 'Text: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://tanzil.net" target="_blank" rel="noreferrer">Tanzil</a>
                {language === 'ar' ? '، الرسم العثماني، الإصدار ١٫٠٫٢' : ', Uthmani script, version 1.0.2'}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'يُستعمل في: ' : 'Used in: '}</dt>
              <dd className="inline">
                <a className="underline" href="/quran">{language === 'ar' ? 'عدد مرات ورود كل كلمة في صفحة القرآن' : 'the word counts on the Quran page'}</a>
                {language === 'ar' ? '، و' : ', and '}
                <a className="underline" href="/quran">{language === 'ar' ? 'الكلمات المتقابلة' : 'the opposite words'}</a>
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {language === 'ar'
              ? 'تُعدّ الكلمة بمدخلها المعجمي كما حلّلتها المدوّنة القرآنية العربية (Quranic Arabic Corpus، الإصدار ٠٫٤)، فـ«والله» و«بالله» و«لله» كلها تحت «ٱللَّه»، ويُعدّ كل جزء من الكلمة له مدخل على حدة، فـ«مما» مرة لـ«مِن» ومرة لـ«مَا». التحليل من المدوّنة لا منّا، ولم يراجعه أحد من أهل العلم. لا مدخل في المدوّنة لـ٣٣٠٧ كلمة: الضمائر المنفصلة، وحروف الجر المتصلة بضمير مثل «لهم»، والحروف المقطّعة. والمداخل التي تتفق في الرسم تحمل رقمها في المدوّنة، فـ«صَٰلِح ١» صفة الصلاح و«صَٰلِح ٢» اسم النبي صالح.'
              : 'Each word is counted under its lemma as the Quranic Arabic Corpus (version 0.4) analyses it, so «والله», «بالله» and «لله» all count under «ٱللَّه». Each part of a word that has its own lemma counts separately, so «مما» counts once for «مِن» and once for «مَا». The analysis is the corpus’s, not ours, and no scholar has reviewed it. The corpus gives no lemma to 3,307 words: separate pronouns, prepositions joined to a pronoun such as «لهم», and the disjoined letters. Lemmas that share a spelling carry the corpus’s number, so «صَٰلِح ١», the word for righteous, and «صَٰلِح ٢», the prophet Salih, count apart.'}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {language === 'ar'
              ? 'وتُعدّ الكلمات المتقابلة بالطريقة نفسها، كل طرف بمدخله، إلا «الآخرة»: مدخلها «آخِر» يشمل «آخر» و«آخرين» أيضًا، فيُعدّ ذلك الطرف بصيغة «الآخرة» وحدها. والأزواج من اختيارنا.'
              : 'The opposite words count each side the same way, under its lemma, except «الآخرة». Its lemma «آخِر» also covers «آخر» and «آخرين», so that side counts the form «الآخرة» alone. We chose the pairs.'}
          </p>
        </section>
      </main>
    </div>
  );
}
