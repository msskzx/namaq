const alternative = location.pathname.endsWith('study-desk.html');
const main = document.querySelector('#main');
const overlay = document.querySelector('#overlay');
const sheet = document.querySelector('#sheet');
let active = 'home', intent = 'read', previousFocus;
const icon = name => icons[name] || icons.BookOpen;
const iconButton = (name, label, action) => `<button class="icon-button" aria-label="${label}" data-action="${action}">${icon(name)}</button>`;
const link = (label, action) => `<button class="link" data-action="${action}">${label}${icon('ChevronLeft')}</button>`;
const row = (label, name, action, sub = '') => `<button class="sheet-row" data-action="${action}">${icon(name)}<span>${label}${sub ? `<small> · ${sub}</small>` : ''}</span>${icon('ChevronLeft')}</button>`;
const quranTools = [
 ['المصحف','BookOpen'],['المتشابهات · الأشجار والمصفوفة','TreeIcon'],['مقارنة السور','ArrowLeftRight'],['التسميع','EyeOff'],['الإعراب','TextSearch'],['البلاغة','Feather'],['لطائف','MessagesSquare'],['افتتاح السور','ListStart'],['الأقسام','SunMoon'],['القراءات','BookOpen'],['التفسير','BookMarked'],['الاستماع','AudioLines'],['البحث في القرآن','Search'],['ألفاظ القرآن وعدّ الكلمات','TextSearch'],['تحفة الأطفال','BookMarked'],['ترتيب السور','ListOrdered']
];
const sections = {
 quran: {label:'القرآن', icon:'BookOpen', sub:'اقرأ، وراجع، وتدبّر.', items:quranTools},
 hadith: {label:'الحديث', icon:'ScrollText', sub:'مجلس حديث، على قدر ما تيسّر.', items:[['باب العلم','ScrollText'],['المحفوظ من الحديث','Bookmark']]},
 tarajim: {label:'التراجم', icon:'Users', sub:'تعرّف إلى أهل العلم، واتّبع أثر الأنبياء.', items:[['الأعلام','Users'],['الخط الزمني للأنبياء','ScrollText'],['الرسوم والعلاقات','Network']]},
 quizzes: {label:'الاختبارات', icon:'Feather', sub:'اختبر ما تعلّمت، وحدك أو مع الصحبة.', items:[['اختبار فردي','Feather'],['اختبار جماعي','Users']]},
 books: {label:'الكتب', icon:'LibraryBig', sub:'كتابك وفاصلتك، حيث توقفت.', items:[['قارئ الكتب','BookOpen'],['مكتبة الكتب','LibraryBig'],['تيسير الكريم الرحمن','BookMarked'],['التبيان في إعراب القرآن','BookMarked'],['الكشاف عن حقائق التنزيل','BookMarked']]}
};
const saved = [['المحفوظات','Bookmark'],['تأملاتي','NotebookPen'],['ما نسيته','LightbulbOff'],['ما أحفظه','BookMarked'],['الأدوات · الصلاة والقبلة والتقويم','Compass']];
function tabs() {
 document.querySelector('#tabs').innerHTML = ['quran','hadith','home','tarajim','quizzes'].map(key => {
  const item = sections[key] || {label:'الرئيسية',icon:'House'};
  return `<button class="tab" data-action="tab:${key}" ${active===key ? 'aria-current="page"' : ''} aria-label="${item.label}">${icon(item.icon)}<span>${item.label}</span></button>`;
 }).join('');
}
function compact(title, sub, name, action) {
 return `<button class="card compact" data-action="${action}">${icon(name)}<span class="copy">${title}<small>${sub}</small></span><span class="chevron">${icon('ChevronLeft')}</span></button>`;
}
function heading(title, action) { return `<div class="heading"><h2>${title}</h2>${link('عرض الكل',action)}</div>`; }
function shelf(key, body, action) { return `<section class="shelf">${heading(sections[key].label,'tab:'+key)}${body}${link('افتح '+(key==='tarajim'?'القصة':key==='books'?'الكتاب':'المجلس'),action)}</section>`; }
function startingHome() {
 return `<div class="intro"><p class="eyebrow">اليوم في نمق</p><h1>شيء تقرؤه، وعلم تراجعه.</h1></div>
 <div class="stories" aria-label="يتجدد اليوم">${[['جزء اليوم','BookOpen','جزء اليوم'],['آية للمراجعة','EyeOff','آية للمراجعة'],['أذكار المساء','SunMoon','أذكار المساء'],['نبي اليوم','ScrollText','يوسف عليه السلام']].map(([label,name,dest])=>`<button class="story" data-action="daily:${dest}"><span class="ring">${icon(name)}</span>${label}</button>`).join('')}</div>
 <h2>من حيث توقفت</h2>
 <article class="card" style="margin-top:10px"><div class="card-head">${icon('Bookmark')}<span>فاصلتك · الفاتحة</span>${iconButton('MoreHorizontal','خيارات الفاصلة','menu')}</div><p class="quran" data-ayah="1:5">${mushaf['1:5']}</p><div class="card-foot"><small>تابع القراءة</small>${link('افتح المصحف','open:المصحف')}</div></article>
 ${compact('تابع التسميع','الفاتحة · من موضعك الأخير','EyeOff','open:التسميع')}
 ${compact('راجع ما نسيت','عد إلى الكلمة في سياقها','LightbulbOff','open:ما نسيته')}
 ${shelf('quran',`<article class="card"><div class="card-head">${icon('Feather')}<span>آية للتدبّر · الفاتحة</span></div><p class="quran" data-ayah="1:2">${mushaf['1:2']}</p><small>التفسير والإعراب والبلاغة من الآية نفسها.</small></article>`,'open:التفسير')}
 ${shelf('hadith','<article class="card"><div class="card-head">'+icon('ScrollText')+'<span>مجلس اليوم</span></div><h3 class="book-title">باب العلم</h3><small>اقرأ الحديث، ثم ارجع إلى شرحه.</small></article>','open:باب العلم')}
 ${shelf('tarajim','<article class="card"><div class="card-head">'+icon('ScrollText')+'<span>من الخط الزمني</span></div><h3 class="book-title">يوسف عليه السلام</h3><small>تابع القصة في مواضعها من القرآن.</small></article>','open:يوسف عليه السلام')}
 ${shelf('books','<article class="card spine"><div class="card-head">'+icon('LibraryBig')+'<span>على رفّك</span></div><h3 class="book-title">تيسير الكريم الرحمن</h3><small>السعدي · تابع عند فاصلتك</small></article>','open:تيسير الكريم الرحمن')}
 <button class="browse" data-action="all"><span>تصفّح كل ما في نمق</span>${icon('Compass')}</button>`;
}
const intentContent = {
 read: {tag:'فاصلتك · الفاتحة',title:'افتح كتابك من حيث توقفت.',sub:'المصحف عند فاصلتك، دون اختيار جديد.',cta:'تابع القراءة',dest:'المصحف',ayah:'1:5',icon:'Bookmark'},
 review: {tag:'راجع ما نسيت · الفاتحة',title:'أعطِ هذه الآية وقتها.',sub:'سمّعها، ثم ارجع إلى الكلمة في سياقها.',cta:'ابدأ المراجعة',dest:'ما نسيته',ayah:'1:2',icon:'EyeOff'},
 explore: {tag:'من قصص الأنبياء',title:'يوسف عليه السلام',sub:'افتح القصة وتتبّع مواضعها في الخط الزمني.',cta:'افتح القصة',dest:'يوسف عليه السلام',icon:'ScrollText'}
};
function deskHome() {
 const item = intentContent[intent];
 return `<div class="intro"><p class="eyebrow">مجلسك اليوم</p><h1>بمَ تحب أن تبدأ؟</h1><p class="muted">اختر ما يناسب وقتك الآن.</p></div>
 <div class="chips" aria-label="ماذا تريد أن تفعل؟">${[['read','أقرأ'],['review','أراجع'],['explore','أستكشف']].map(([key,label])=>`<button class="chip" aria-pressed="${intent===key}" data-action="intent:${key}">${label}</button>`).join('')}</div>
 <article class="card hero"><div class="card-head">${icon(item.icon)}<span>${item.tag}</span>${iconButton('MoreHorizontal','خيارات المجلس','menu')}</div><h2>${item.title}</h2>${item.ayah?`<p class="quran" data-ayah="${item.ayah}">${mushaf[item.ayah]}</p>`:''}<p class="muted">${item.sub}</p><button class="primary" data-action="open:${item.dest}"><span>${item.cta}</span>${icon('ArrowLeft')}</button></article>
 <div class="heading"><h2>على مكتبك</h2>${link('المحفوظات','open:المحفوظات')}</div>
 ${[['تابع التسميع','الفاتحة · من موضعك الأخير','EyeOff','التسميع'],['كلمة أراجعها','من الكلمات التي نسيتها','LightbulbOff','ما نسيته'],['تيسير الكريم الرحمن','السعدي · عند فاصلتك','BookMarked','تيسير الكريم الرحمن']].map(([title,sub,name,dest])=>`<button class="desk-row" data-action="open:${dest}">${icon(name)}<span>${title}<small>${sub}</small></span>${icon('ChevronLeft')}</button>`).join('')}
 <div class="heading"><h2>اقتراح اليوم</h2>${link('الحديث','tab:hadith')}</div>
 <button class="card compact" data-action="open:باب العلم">${icon('ScrollText')}<span class="copy">باب العلم<small>مجلس حديث تقرؤه حين يتّسع وقتك.</small></span><span class="chevron">${icon('ChevronLeft')}</span></button>
 <button class="browse" data-action="all"><span>تصفّح كل ما في نمق</span>${icon('Compass')}</button><p class="note">القرآن، والحديث، والتراجم، والكتب، والاختبارات.</p>`;
}
function home() { active='home'; main.innerHTML = alternative ? deskHome() : startingHome(); tabs(); }
function hub(key) {
 if(key==='home') return home();
 const section=sections[key]; active=key==='books'?'home':key;
 main.innerHTML=`<button class="return" data-action="tab:home">${icon('ChevronRight')}الرئيسية</button><div class="hub-intro"><p class="eyebrow">نمق</p><h1>${section.label}</h1><p class="muted">${section.sub}</p></div>${key==='quran'?compact('المصحف','افتح عند فاصلتك','BookOpen','open:المصحف'):''}<div class="hub-list">${section.items.filter(([label])=>key!=='quran'||label!=='المصحف').map(([label,name])=>row(label,name,'open:'+label)).join('')}</div>`;
 tabs(); window.scrollTo(0,0);
}
function showSheet(title, body) {
 if(!overlay.classList.contains('open')) previousFocus=document.activeElement;
 sheet.innerHTML=`<div class="handle"></div><div class="sheet-head"><h2 id="sheet-title">${title}</h2>${iconButton('X','إغلاق','close')}</div>${body}`;
 overlay.classList.add('open'); document.querySelector('.phone').inert=true;document.body.style.overflow='hidden';sheet.focus();
}
function closeSheet() { overlay.classList.remove('open');document.querySelector('.phone').inert=false;document.body.style.overflow='';previousFocus?.focus(); }
function browse(search=false) {
 showSheet(search?'ابحث في نمق':'كل ما في نمق',`<input class="search" aria-label="ابحث عن أداة أو قسم" placeholder="ابحث عن أداة أو قسم" type="search"><div id="directory">${Object.entries(sections).map(([key,section])=>`<section><h3>${section.label}</h3>${row('افتح '+section.label,section.icon,'tab:'+key)}${section.items.map(([label,name])=>row(label,name,'open:'+label)).join('')}</section>`).join('')}<section><h3>أشياؤك وأدواتك</h3>${saved.map(([label,name])=>row(label,name,'open:'+label)).join('')}</section></div><p id="no-results" class="empty" hidden>لا توجد نتيجة. جرّب اسم الأداة.</p>`);
 if(search) sheet.querySelector('input').focus();
}
function destination(title, daily=false) {
 const owner = Object.entries(sections).find(([,section]) => section.items.some(([label]) => label === title))?.[0]
  || (title.includes('يوسف') ? 'tarajim' : /جزء|آية للمراجعة/.test(title) ? 'quran' : 'home');
 const quran = owner === 'quran';
 showSheet(title,`<p class="eyebrow">${daily?'من محتوى اليوم':'معاينة الوجهة'}</p>${quran?`<p class="quran" data-ayah="1:5">${mushaf['1:5']}</p>`:''}<p class="muted">${title==='أذكار المساء'?'تفتح أذكار الوقت من هنا.':title.includes('يوسف')?'تفتح قصة يوسف في الخط الزمني من هنا.':'يفتح هذا الاختيار في صفحته داخل القسم.'}</p><p class="note">هذه معاينة تنقّل في الرسم، وليست شاشة الأداة.</p>${link('عرض القسم', 'tab:'+owner)}`);
}
function handle(action) {
 const [type,...parts]=action.split(':');const value=parts.join(':');
 if(type==='close') return closeSheet();
 if(type==='tab'){if(overlay.classList.contains('open'))closeSheet();hub(value);return;}
 if(type==='intent'){intent=value;home();document.querySelector(`[data-action="intent:${value}"]`).focus();return;}
 if(type==='all'||type==='search')return browse(type==='search');
 if(type==='menu')return showSheet('خيارات الآية',`<div class="frost-menu">${[['BookOpen','المصحف'],['Bookmark','المحفوظات'],['NotebookPen','تأملاتي'],['ArrowLeftRight','مقارنة السور']].map(([name,label])=>`<button data-action="open:${label}">${icon(name)}${label}</button>`).join('')}</div>`);
 if(type==='settings')return showSheet('الإعدادات',row('المظهر الداكن','Settings','open:المظهر الداكن')+row('الخط والقراءة','BookOpen','open:الخط والقراءة')+row('المصادر والنسب','BookMarked','open:المصادر والنسب'));
 destination(value,type==='daily');
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button)handle(button.dataset.action);else if(event.target===overlay)closeSheet();});
document.addEventListener('input',event=>{if(!event.target.matches('.search'))return;const term=event.target.value.trim();let found=false;sheet.querySelectorAll('#directory section').forEach(section=>{let visible=false;section.querySelectorAll('.sheet-row').forEach(button=>{button.hidden=!button.textContent.includes(term);button.style.display=button.hidden?'none':'';visible ||= !button.hidden;});section.hidden=!visible;found ||= visible;});sheet.querySelector('#no-results').hidden=found;});
document.addEventListener('keydown',event=>{if(!overlay.classList.contains('open'))return;if(event.key==='Escape')closeSheet();if(event.key==='Tab'){const list=[...sheet.querySelectorAll('button,input')].filter(el=>el.getClientRects().length);const first=list[0],last=list.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===sheet)){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
document.querySelector('#tools').innerHTML=iconButton('Search','البحث','search')+iconButton('Compass','كل ما في نمق','all')+iconButton('Settings','الإعدادات','settings');
home();
