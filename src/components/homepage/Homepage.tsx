'use client';

import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Circle, CircleCheck, CircleX, RotateCcw } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import Button from '../common/Button';
import BranchTree from '@/app/quran/branches/BranchTree';
import PageSpread, { MatchLegend } from '../quran/PageSpread';
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
  const Forward = ar ? ArrowLeft : ArrowRight;
  return (
    <section id={id} className={styles.feature} aria-labelledby={`${id}-title`}>
      <header className={styles.featureHeading}>
        <span className={styles.indexNumber}>{n.toLocaleString(ar ? 'ar-u-nu-arab' : 'en', { minimumIntegerDigits: 2 })}</span>
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{description}</p>
          <p className={styles.exampleCaption}>{example}</p>
          <Button href={href} aria-label={`${ar ? 'افتح' : 'Open'} ${title}`} className={styles.featureAction}>
            {ar ? 'افتح' : 'Open'}<Forward size={16} aria-hidden />
          </Button>
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
          <Button key={choice.value} onClick={() => answer === null && setAnswer(choice.value)} aria-pressed={answer === choice.value} aria-disabled={answer !== null} data-result={answer !== null ? choice.value === question.answer ? 'correct' : answer === choice.value ? 'incorrect' : undefined : undefined}>
            {answer !== null && choice.value === question.answer ? <CircleCheck size={16} aria-hidden /> : answer === choice.value ? <CircleX size={16} aria-hidden /> : <Circle size={16} aria-hidden />}
            <span lang="ar" dir="rtl">{choice.labelArabic}</span>
          </Button>
        ))}
      </div>
      <div role="status" className={styles.answer} data-result={answer === null ? undefined : correct ? 'correct' : 'incorrect'}>
        {answer !== null && <p>{correct ? (ar ? 'إجابة صحيحة.' : 'Correct.') : (ar ? 'الإجابة الصحيحة: ' : 'The correct answer is: ')}{!correct && <span lang="ar" dir="rtl">{question.choices.find(choice => choice.value === question.answer)?.labelArabic}</span>}</p>}
      </div>
      <div className={styles.previewActions}>
        {answer !== null && <Button size="sm" onClick={() => setAnswer(null)}><RotateCcw size={16} aria-hidden />{ar ? 'حاول مجددًا' : 'Try again'}</Button>}
        <Button size="sm" href={question.profile}><BookOpen size={16} aria-hidden />{ar ? 'السيرة والمصادر' : 'Biography and sources'}</Button>
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
        <Feature id="comparison" n={2} title={ar ? 'مقارنة الآيات' : 'Compare Quranic passages'} description={ar ? 'اقرأ مقطعين من القرآن جنبًا إلى جنب، مع محاذاة الآيات المتقابلة وتمييز الكلمات المشتركة لمقارنة ألفاظهما.' : 'Read two Quranic passages side by side, with corresponding verses aligned and shared words highlighted to help you compare their wording.'} example={ar ? 'مثال: الشعراء ٤١–٤٥ والأعراف ١١٣–١١٧. مقتطفان من قصة موسى، تُميَّز الكلمة المشتركة بلفظها بلون، والكلمة التي تشترك في جذرها بلفظ مختلف بلون آخر تحته خط منقّط.' : 'Example: Al-Shu‘ara 41–45 and Al-A‘raf 113–117. Two excerpts from Musa’s story, with words shared exactly in one colour and words that share only a root in another, underlined with dots.'} href={COMPARE_HREF}>
          <PageSpread pages={(['a', 'b'] as const).map(side => ({
            title: side === 'a' ? 'سورة الشعراء' : 'سورة الأعراف',
            subtitle: ar ? `مقتطف · الآيات ${side === 'a' ? '٤١–٤٥' : '١١٣–١١٧'}` : `Excerpt · verses ${side === 'a' ? '41–45' : '113–117'}`,
            label: side === 'a' ? 'الشعراء ٤١–٤٥' : 'الأعراف ١١٣–١١٧',
            rows: data.comparisons.map(pair => [{
              number: pair[side].number,
              words: pair[side].display,
              marks: Object.fromEntries(pair[side].display.flatMap((_, index) => pair.different[side].includes(index) ? [] : [[index, pair.rooted[side].includes(index) ? { kind: 'root' as const, title: ar ? 'من جذر مشترك بلفظ مختلف' : 'Same root, different wording' } : { kind: 'exact' as const }]])),
            }]),
          }))} />
          <MatchLegend exact={ar ? 'كلمة مشتركة بلفظها' : 'Same word'} root={ar ? 'كلمة من جذر مشترك بلفظ مختلف' : 'Same root, different wording'} />
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
