'use client';

import { Fragment, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCircle, faCircleCheck, faCircleXmark, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../language/LanguageContext';
import Button from '../common/Button';
import BranchTree from '@/app/quran/branches/BranchTree';
import HadithPreview from './HadithPreview';
import FitDiagram from './FitDiagram';
import type { HomePreviews } from '@/lib/homePreviewData';
import Hero from './Hero';
import Exploration from './Exploration';
import HeroGraphPreview from './HeroGraphPreview';
import NasabPreview from './NasabPreview';
import { BRANCHES_HREF, COMPARE_HREF, NASAB_HREF, PROPHET_GRAPH_HREF } from './homeLinks';
import styles from './Home.module.css';

function Feature({ id, n, title, description, example, href, children }: { id: string; n: number; title: string; description: string; example: string; href: string; children: ReactNode }) {
  const ar = useLanguage().language === 'ar';
  return (
    <section id={id} className={styles.feature} aria-labelledby={`${id}-title`}>
      <header className={styles.featureHeading}>
        <span className={styles.indexNumber}>{n.toLocaleString(ar ? 'ar-u-nu-arab' : 'en', { minimumIntegerDigits: 2 })}</span>
        <div>
          <h2 id={`${id}-title`}><Link href={href}>{title}</Link></h2>
          <p>{description}</p>
          <p className={styles.exampleCaption}>{example}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function QuizPreview({ question }: { question: NonNullable<HomePreviews['question']> }) {
  const ar = useLanguage().language === 'ar';
  const [answer, setAnswer] = useState<string | null>(null);
  const correct = answer === question.answer;
  return (
    <div className={styles.quiz}>
      <p className={styles.quizPrompt} dir="rtl" lang="ar">{question.prompt}</p>
      <div className={styles.choices}>
        {question.choices.map(choice => (
          <Button key={choice.value} onClick={() => answer === null && setAnswer(choice.value)} aria-pressed={answer === choice.value} aria-disabled={answer !== null}>
            <FontAwesomeIcon icon={answer !== null && choice.value === question.answer ? faCircleCheck : answer === choice.value ? faCircleXmark : faCircle} />
            <span lang="ar" dir="rtl">{choice.labelArabic}</span>
          </Button>
        ))}
      </div>
      <div role="status" className={styles.answer}>
        {answer !== null && <p>{correct ? (ar ? 'إجابة صحيحة.' : 'Correct.') : (ar ? 'الإجابة الصحيحة: ' : 'The correct answer is: ')}{!correct && <span lang="ar" dir="rtl">{question.choices.find(choice => choice.value === question.answer)?.labelArabic}</span>}</p>}
      </div>
      <div className={styles.previewActions}>
        {answer !== null && <Button size="sm" onClick={() => setAnswer(null)}><FontAwesomeIcon icon={faRotateLeft} />{ar ? 'حاول مجددًا' : 'Try again'}</Button>}
        <Button size="sm" href={question.profile}><FontAwesomeIcon icon={faBookOpen} />{ar ? 'السيرة والمصادر' : 'Biography and sources'}</Button>
      </div>
    </div>
  );
}

export default function Homepage({ data, fontClass = '' }: { data: HomePreviews; fontClass?: string }) {
  const ar = useLanguage().language === 'ar';
  return (
    <div className={`${styles.page} ${fontClass}`} dir={ar ? 'rtl' : 'ltr'}>
      <div className={styles.content}>
        <Hero />
        <Feature id="openings" n={1} title={ar ? 'فواتح الآيات المشتركة' : 'Shared verse openings'} description={ar ? 'تتبّع الآيات التي تشترك في بدايتها، ثم شاهد كيف تتفرّع ألفاظها لتستكشف أوجه التشابه والاختلاف بينها.' : 'Follow verses that share an opening and see where their wording branches into different phrases.'} example={ar ? 'مثال: آيات تبدأ بعبارة «إن المتقين». تتبّع اختلاف الكلمات واختر فرعًا لاستكشافه.' : 'Example: verses beginning with “Indeed, the righteous”. Follow the words as they branch and select a phrase to explore.'} href={BRANCHES_HREF}>
          <div className={styles.branchPreview} dir="rtl"><FitDiagram><BranchTree tree={data.branches.tree} pages={data.branches.pages} names={{ 15: 'الحجر', 44: 'الدخان', 51: 'الذاريات', 52: 'الطور', 54: 'القمر', 77: 'المرسلات' }} /></FitDiagram></div>
        </Feature>
        <Feature id="comparison" n={2} title={ar ? 'مقارنة الآيات' : 'Compare Quranic passages'} description={ar ? 'اقرأ مقطعين من القرآن جنبًا إلى جنب، مع محاذاة الآيات المتقابلة وتمييز الكلمات المشتركة لمقارنة ألفاظهما.' : 'Read two Quranic passages side by side, with corresponding verses aligned and shared words highlighted to help you compare their wording.'} example={ar ? 'مثال: الشعراء ٤١–٤٥ والأعراف ١١٣–١١٧. مقتطفان من قصة موسى، مع تمييز الكلمات المشتركة، وتحت الكلمة التي تشترك في جذرها بلفظ مختلف خط منقّط.' : 'Example: Al-Shu‘ara 41–45 and Al-A‘raf 113–117. Two excerpts from Musa’s story, with shared words highlighted and words that share only a root underlined with dots.'} href={COMPARE_HREF}>
          <div className={styles.pageSpread} dir="rtl">
            {(['a', 'b'] as const).map(side => <article key={side} className={styles.quranExcerpt} aria-label={side === 'a' ? 'الشعراء ٤١–٤٥' : 'الأعراف ١١٣–١١٧'}>
              <header><h3>{side === 'a' ? 'سورة الشعراء' : 'سورة الأعراف'}</h3><p>{ar ? 'مقتطف · الآيات ' : 'Excerpt · verses '}{side === 'a' ? '٤١–٤٥' : '١١٣–١١٧'}</p></header>
              <div className={styles.quranLines} lang="ar">
                {data.comparisons.map(pair => <p key={pair[side].number}>
                  {pair[side].display.map((word, index) => <Fragment key={index}>{index > 0 && ' '}<span className={index === pair[side].display.length - 1 ? styles.verseEnd : undefined}>
                    {pair.different[side].includes(index) ? word : pair.rooted[side].includes(index) ? <mark className={styles.rooted} title={ar ? 'من جذر مشترك بلفظ مختلف' : 'Same root, different wording'}>{word}</mark> : <mark>{word}</mark>}
                    {index === pair[side].display.length - 1 && <>{' '}<span className={styles.verseSeal}>{pair[side].number.toLocaleString('ar-u-nu-arab')}</span></>}
                  </span></Fragment>)}
                </p>)}
              </div>
            </article>)}
          </div>
        </Feature>
        <Feature id="musa" n={3} title={ar ? 'قصص الأنبياء في القرآن' : 'Prophets’ stories in the Quran'} description={ar ? 'تتبّع أحداث قصص الأنبياء الواردة في سور مختلفة ضمن محطات متتابعة، واعرف عدد السور التي تذكر كل محطة.' : 'Follow events from prophets’ stories across different surahs in a sequence of milestones, and see how many surahs mention each one.'} example={ar ? 'مثال: محطات قصة موسى عليه السلام. اسحب أفقيًا لتتبّع القصة عبر السور.' : 'Example: milestones from Musa’s story. Scroll horizontally to follow the story across the surahs.'} href="/quran/prophets/musa">
          <div className={styles.timeline} tabIndex={0} role="region" aria-label={ar ? 'محطات قصة موسى' : 'Musa timeline'}>
            <ol>{data.timeline.map(event => <li key={event.n}>
              <span className={styles.timelineDot}>{event.n.toLocaleString(ar ? 'ar-u-nu-arab' : 'en')}</span>
              <p className={styles.eyebrow}>{ar ? event.phase : event.phaseEn}</p>
              <h3>{ar ? event.title : event.titleEn}</h3>
              <p className={styles.surahCount}>{ar
                ? event.surahCount === 1 ? 'سورة واحدة' : event.surahCount === 2 ? 'سورتان' : `${event.surahCount.toLocaleString('ar-u-nu-arab')} ${event.surahCount <= 10 ? 'سور' : 'سورة'}`
                : `${event.surahCount} ${event.surahCount === 1 ? 'surah' : 'surahs'}`}</p>

            </li>)}</ol>
          </div>
        </Feature>
        <Feature id="family" n={4} title={ar ? 'استكشاف العلاقات' : 'Explore relationships'} description={ar ? 'استكشف الصلات بين الأشخاص في شبكة تفاعلية، ثم انتقل إلى سيرهم للتعرّف على حياتهم ومصادر المعلومات عنهم.' : 'Explore connections between people in an interactive graph, then open their biographies to read about their lives and the sources behind them.'} example={ar ? 'مثال: شبكة النبي محمد ﷺ مع أسرته وأصهاره. اختر شخصًا لاستكشاف صلاته.' : 'Example: Prophet Muhammad ﷺ, his family and his in-laws. Select a person to explore their connections.'} href={PROPHET_GRAPH_HREF}>
          <HeroGraphPreview />
        </Feature>
        <Feature id="jibril" n={5} title={ar ? 'الحديث نصًا وحوارًا' : 'Hadith as text and conversation'} description={ar ? 'اقرأ الحديث مع فصل الإسناد عن المتن وإظهار المتحدثين في الحوار، وبدّل بين الفقاعات والنص الكامل.' : 'Read a hadith with its chain of narration separated from the main text and its speakers identified. Switch between conversation bubbles and the full text.'} example={ar ? 'مثال: حديث جبريل في صحيح مسلم. شاهد الإسناد والحوار بالفقاعات، أو بدّل إلى النص الكامل.' : 'Example: Hadith Jibril in Sahih Muslim. View its isnad and conversation bubbles, or switch to the full text.'} href="/hadith/muslim-jibril">
          {data.hadith && <HadithPreview view={data.hadith} />}
        </Feature>
        <Feature id="lineage" n={6} title={ar ? 'شجرة النسب' : 'Explore family lineages'} description={ar ? 'تتبّع سلاسل الآباء في شجرة واحدة، وقارن أنساب عدة أشخاص لترى مواضع التقاء سلاسلهم.' : 'Trace paternal lines in one tree and compare several people’s ancestry to see where their lines meet.'} example={ar ? 'مثال: نسب النبي ﷺ وأبي بكر وعمر وعثمان وعلي. تتبّع سلاسل الآباء كاملة.' : 'Example: the complete paternal lines of the Prophet ﷺ, Abu Bakr, Umar, Uthman and Ali.'} href={NASAB_HREF}>
          <NasabPreview />
        </Feature>
        <Feature id="practice" n={7} title={ar ? 'اختبر معرفتك' : 'Test your knowledge'} description={ar ? 'راجع ما تعلّمته بأسئلة تفاعلية، وتعرّف على الإجابة الصحيحة ثم ارجع إلى السيرة والمصادر لمزيد من القراءة.' : 'Review what you have learned with interactive questions, check the correct answer, and open the biography and sources to read further.'} example={ar ? 'مثال: سؤال عن منقبة من مناقب طلحة بن عبيد الله يوم أحد. اختر إجابتك، أو افتح الاختبارات لاختيار موضوع آخر.' : 'Example: a question about one of Talha ibn Ubaydullah’s virtues at Uhud. Choose an answer, or open the quizzes to pick another topic.'} href="/quizzes">
          {data.question && <QuizPreview question={data.question} />}
        </Feature>
        <Exploration />
      </div>
    </div>
  );
}
