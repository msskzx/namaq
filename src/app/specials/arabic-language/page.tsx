"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

export default function Arabic() {
  const speakersChartRef = useRef<HTMLCanvasElement>(null);
  const frequencyChartRef = useRef<HTMLCanvasElement>(null);

  // Chart.js utility functions (moved inside the component or outside as helpers)
  const wrapLabel = (label: string, maxWidth: number): string[] => {
    const words = label.split(' ');
    const result: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      if ((currentLine + ' ' + words[i]).length > maxWidth) {
        result.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine += ' ' + words[i];
      }
    }
    result.push(currentLine);
    return result;
  };

  interface TooltipItem {
    chart: {
      data: {
        labels?: (string | string)[];
      };
    };
    dataIndex: number;
  }

  const tooltipTitleCallback = useCallback((tooltipItems: TooltipItem[]): string => {
    try {
      const item = tooltipItems[0];
      const label = item?.chart?.data?.labels?.[item.dataIndex];
      if (Array.isArray(label)) {
        return label.join(' ');
      }
      return label || '';
    } catch {
      return '';
    }
  }, []);

  useEffect(() => {
    // Chart 1: Speakers Chart
    let speakersChart: Chart | null = null;
    if (speakersChartRef.current) {
      const speakersCtx = speakersChartRef.current.getContext('2d');
      if (speakersCtx) {
        const speakersData = {
          labels: [
            'مصر', 'الجزائر', 'السودان', 'العراق', 
            wrapLabel('المملكة العربية السعودية', 16), 'المغرب', 'اليمن', 'سوريا',
            'تونس', 'ليبيا', 'الأردن', 'لبنان', 'الكويت', 'عُمان', 'قطر',
            'البحرين', 'الإمارات', 'موريتانيا', 'جزر القمر', 'جيبوتي', 'فلسطين',
            'إريتريا', 'تشاد', 'الصومال', 'جنوب السودان'
          ],
          datasets: [{
            label: 'عدد المتحدثين التقريبي (بالملايين)',
            data: [
              109, 45, 46, 43, 37, 37, 32, 22, 12, 7, 10, 5, 4, 5, 2, 2, 5, 4, 1, 1, 5, 1, 1, 15, 12
            ],
            backgroundColor: '#0066FF',
            borderColor: '#0049B7',
            borderWidth: 2,
            borderRadius: 5,
          }]
        };
        speakersChart = new Chart(speakersCtx, {
          type: 'bar',
          data: speakersData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: tooltipTitleCallback as unknown as (this: unknown, tooltipItems: unknown[]) => string | string[] | void
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'عدد المتحدثين (بالملايين)',
                  font: {
                    family: 'Noto Sans Arabic',
                    size: 16
                  }
                },
                ticks: {
                  font: {
                    family: 'Noto Sans Arabic'
                  }
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 14,
                    family: 'Noto Sans Arabic'
                  }
                }
              }
            }
          }
        });
      }
    }

    // Chart 2: Frequency Chart
    let frequencyChart: Chart | null = null;
    if (frequencyChartRef.current) {
      const frequencyCtx = frequencyChartRef.current.getContext('2d');
      if (frequencyCtx) {
        const frequencyData = {
          labels: ['ألف (ا)', 'لام (ل)', 'ياء (ي)', 'ميم (م)', 'نون (ن)', 'واو (و)', 'هاء (ه)', 'باء (ب)', 'راء (ر)', 'كاف (ك)'],
          datasets: [{
            label: 'التردد النسبي (%)',
            data: [12.5, 9.8, 8.5, 7.2, 6.9, 6.5, 5.8, 5.1, 4.8, 4.2],
            backgroundColor: ['#0049B7', '#0055D4', '#0066FF', '#2A7BFF', '#5DA9E9', '#72B5EB', '#87CEEB', '#9CD8F0', '#B2E2F5', '#C7EDFA'],
            borderColor: '#0049B7',
            borderWidth: 1
          }]
        };
        frequencyChart = new Chart(frequencyCtx, {
          type: 'bar',
          data: frequencyData,
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: tooltipTitleCallback as unknown as (this: unknown, tooltipItems: unknown[]) => string | string[] | void
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'التردد النسبي (%)',
                  font: {
                    family: 'Noto Sans Arabic',
                    size: 16
                  }
                },
                ticks: {
                  font: {
                    family: 'Noto Sans Arabic'
                  }
                }
              },
              y: {
                ticks: {
                  font: {
                    family: 'Noto Sans Arabic',
                    size: 14
                  }
                }
              }
            }
          }
        });
      }
    }

    // Cleanup function to destroy charts on component unmount
    return () => {
      if (speakersChart) {
        speakersChart.destroy();
      }
      if (frequencyChart) {
        frequencyChart.destroy();
      }
    };
  }, [tooltipTitleCallback]); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-gray-800" dir="rtl">
      {/* Font imports for Next.js */}
      

      {/* Inline styles for specific font families and chart containers */}
      <style jsx>{`
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f0f4f8;
        }
        .arabic-text {
            font-family: 'Noto Sans Arabic', sans-serif;
            direction: rtl;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            height: 450px;
            max-height: 50vh;
        }
        .kufi-style {
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .naskh-style {
            font-family: 'Times New Roman', Times, serif;
            font-style: italic;
        }
        .diwani-style {
            font-family: 'Brush Script MT', cursive;
        }
      `}</style>

      <div className="container mx-auto p-4 md:p-8 max-w-7xl">

        {/* Section 1: Hero */}
        <header className="text-center my-12 md:my-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#0049B7] tracking-tight arabic-text">فن وتشريح اللغة العربية</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 arabic-text">رحلة بصرية إلى إحدى أكثر اللغات تأثيراً في العالم.</p>
          <div className="mt-10 bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border-4 border-[#0066FF]">
            <p className="text-2xl font-bold text-gray-700 arabic-text">لغة عالمية يتحدث بها أكثر من</p>
            <p className="text-7xl md:text-8xl font-extrabold text-[#0049B7] my-4 arabic-text">٤٢٢ مليون</p>
            <p className="text-2xl font-bold text-gray-700 arabic-text">شخص حول العالم</p>
          </div>
        </header>

        {/* Section 2: Global Reach */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 my-12">
          <h2 className="text-3xl font-bold text-center mb-2 arabic-text">الانتشار العالمي</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto arabic-text">اللغة العربية هي اللغة الرسمية في أكثر من 20 دولة. يوضح الرسم البياني أدناه العدد التقريبي للمتحدثين في بعض الدول الرئيسية، مما يوضح التركيز الديموغرافي الأساسي للغة.</p>
          <div className="chart-container">
            <canvas ref={speakersChartRef} id="speakersChart"></canvas>
          </div>
        </section>
        
        {/* Number of Words in World Languages */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 my-12">
          <h2 className="text-3xl font-bold text-center mb-6 arabic-text">ثروة المفردات: مقارنة بين اللغات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <p className="text-5xl md:text-7xl font-extrabold text-[#0049B7] my-4">١٢٫٣ مليون</p>
              <p className="text-2xl font-bold text-gray-700 mb-2 arabic-text">العربية</p>
              <p className="text-gray-500 mb-6 arabic-text">أكثر من 12 مليون كلمة</p>
              
              <div className="mt-8 space-y-4 text-right">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-r-4 border-blue-500">
                  <span className="text-gray-700 font-semibold">العربية</span>
                  <span className="font-bold text-blue-600">١٢٫٣ مليون</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الإنجليزية</span>
                  <span className="font-bold">٦٠٠ ألف</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الفرنسية</span>
                  <span className="font-bold">٣٥٠ ألف</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الألمانية</span>
                  <span className="font-bold">٢٠٠ ألف</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الروسية</span>
                  <span className="font-bold">١٥٠ ألف</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الإيطالية</span>
                  <span className="font-bold">١٥٠ ألف</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الاسبانية</span>
                  <span className="font-bold">١٥٠ ألف</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">البرتغالية</span>
                  <span className="font-bold">١٥٠ ألف</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-lg leading-relaxed arabic-text">
                تحتل اللغة العربية مرتبة متقدمة بين لغات العالم من حيث ثراء المفردات، حيث تحتوي على أكثر من ١٢ مليون كلمة، 
                مقارنة بنحو ٦٠٠ ألف كلمة في الإنجليزية و٣٥٠ ألف كلمة في الفرنسية. 
                وتتميز العربية بقدرتها على الاشتقاق من الجذور اللغوية، حيث يمكن اشتقاق مئات الكلمات من الجذر الواحد.
              </p>
              <p className="text-gray-500 text-lg mt-4 leading-relaxed arabic-text">
                من المثير للاهتمام أن المعاجم العربية القديمة مثل لسان العرب لابن منظور تحتوي على أكثر من ٨٠ ألف مادة، 
                بينما تحتوي أضخم معاجم اللغة الإنجليزية (أكسفورد) على حوالي ٦٠٠ ألف كلمة.
              </p>
            </div>
          </div>
        </section>

        {/* Number of Letters in World Languages */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 my-12">
          <h2 className="text-3xl font-bold text-center mb-6 arabic-text">حروف اللغات: مقارنة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="p-4">
              <p className="text-gray-500 text-lg leading-relaxed arabic-text">
                تتميز اللغة العربية بنظام كتابة فريد يتكون من ٢٨ حرفاً، وهو عدد معتدل مقارنة بلغات أخرى. 
                تتفاوت أبجديات اللغات بشكل كبير، فبعض اللغات مثل الخميرية (الخمير) تحتوي على ٧٤ حرفاً، 
                بينما تحتوي لغة روتوكاس في بابوا غينيا الجديدة على ١٢ حرفاً فقط.
              </p>
              <p className="text-gray-500 text-lg mt-4 leading-relaxed arabic-text">
                تتميز الأبجدية العربية بكونها نظام كتابة متصل، حيث تتغير أشكال الحروف حسب موقعها في الكلمة، 
                مما يجعلها واحدة من أكثر أنظمة الكتابة جمالاً ومرونة في العالم.
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border-r-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800 arabic-text">العربية</span>
                  <span className="text-3xl font-black text-blue-600">٢٨</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">الإنجليزية</span>
                  <span className="text-2xl font-bold">٢٦</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{ width: '93%' }}></div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">الروسية</span>
                  <span className="text-2xl font-bold">٣٣</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">اليابانية (هيراغانا)</span>
                  <span className="text-2xl font-bold">٤٦</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{ width: '61%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Alphabet */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 my-12">
          <h2 className="text-3xl font-bold text-center mb-8 arabic-text">الحروف الثمانية والعشرون للأبجدية العربية</h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-14 gap-2 text-center">
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ا</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ب</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ت</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ث</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ج</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ح</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">خ</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">د</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ذ</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ر</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ز</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">س</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ش</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ص</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ض</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ط</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ظ</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ع</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">غ</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ف</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ق</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ك</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ل</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">م</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ن</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ه</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">و</div>
            <div className="arabic-text text-5xl bg-blue-50 p-4 rounded-lg shadow-inner">ي</div>
          </div>
        </section>

        {/* Section 4: Core Concepts */}
        <section className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-center mb-4 arabic-text">تُقرأ من اليمين إلى اليسار (RTL)</h3>
              <p className="text-center text-gray-600 mb-6 arabic-text">على عكس الإنجليزية، يتدفق النص العربي من اليمين إلى اليسار، وهي خاصية أساسية تشكل طباعته وتصميمه.</p>
              <div className="bg-gray-100 p-4 rounded-lg text-right">
                <p className="font-semibold text-gray-700 arabic-text">الإنجليزية (من اليسار إلى اليمين):</p>
                <div className="flex items-center justify-between text-lg mt-2">
                  <span className="text-2xl text-[#0066FF] font-bold">→</span>
                  <span>The book is on the table.</span>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mt-4 text-right">
                <p className="font-semibold text-gray-700 arabic-text">العربية (من اليمين إلى اليسار):</p>
                <div className="flex items-center justify-between text-lg mt-2">
                  <p className="arabic-text text-2xl">الكتاب على الطاولة.</p>
                  <span className="text-2xl text-[#0066FF] font-bold">←</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-center mb-4 arabic-text">إنها أبجدية</h3>
              <p className="text-gray-500 mb-6 arabic-text">تتميز اللغة العربية بغناها اللغوي الفريد، حيث تحتوي على نظام جذور كلمات ثلاثي يسمح بإنشاء آلاف الكلمات من جذر واحد. على سبيل المثال، من الجذر &quot;كتب&quot; يمكن اشتقاق كلمات مثل: كاتب، مكتوب، مكتبة، كتاب، يكتب، إلخ.</p>
              <div className="text-center bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold text-gray-700 arabic-text">الكلمة الأساسية (الحروف الساكنة):</p>
                <p className="arabic-text text-6xl my-2">ك ت ب</p>
                <p className="text-gray-600 arabic-text">(ك-ت-ب، متعلقة بـ &quot;الكتابة&quot;)</p>
              </div>
              <div className="flex justify-around mt-4">
                <div className="text-center">
                  <p className="arabic-text text-2xl">كَتَبَ</p>
                  <p className="text-gray-500 arabic-text">(كتب)</p>
                </div>
                <div className="text-center">
                  <p className="arabic-text text-2xl">كُتُب</p>
                  <p className="text-gray-500 arabic-text">(كتب)</p>
                </div>
                <div className="text-center">
                  <p className="arabic-text text-2xl">كَاتِب</p>
                  <p className="text-gray-500 arabic-text">(كاتب)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Letter Frequency */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 my-12">
          <h2 className="text-3xl font-bold text-center mb-2 arabic-text">تردد الحروف في اللغة العربية</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto arabic-text">ليست كل الحروف متساوية. يوضح هذا الرسم البياني التردد النسبي للحروف الأكثر شيوعًا في اللغة العربية الفصحى الحديثة، مع تسليط الضوء على اللبنات الأساسية للغة المكتوبة.</p>
          <div className="chart-container" style={{ height: '500px', maxHeight: '70vh' }}>
            <canvas ref={frequencyChartRef} id="frequencyChart"></canvas>
          </div>
        </section>

        {/* Section 6: Art & Culture */}
        <section className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-center mb-6 arabic-text">فن الخط</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-xl font-bold text-[#0049B7] arabic-text">الخط الكوفي</h4>
                  <p className="kufi-style text-3xl mt-1 arabic-text">بسم الله</p>
                  <p className="text-sm text-gray-600 mt-2 arabic-text">نمط مبكر، زاوي وجريء، غالبًا ما يستخدم في العمارة والمصاحف القديمة.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-xl font-bold text-[#0049B7] arabic-text">خط النسخ</h4>
                  <p className="naskh-style text-4xl mt-1 arabic-text">بسم الله</p>
                  <p className="text-sm text-gray-600 mt-2 arabic-text">خط واضح ومائل أصبح المعيار للطباعة والكتابة اليومية.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-xl font-bold text-[#0049B7] arabic-text">الخط الديواني</h4>
                  <p className="diwani-style text-5xl mt-1 arabic-text">بسم الله</p>
                  <p className="text-sm text-gray-600 mt-2 arabic-text">نمط زخرفي ومعقد للغاية تطور خلال العصر العثماني للمراسيم الملكية.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-center mb-6 arabic-text">كلمات إنجليزية ذات أصول عربية</h3>
              <div className="relative flex flex-wrap gap-4 items-center justify-center h-full min-h-[300px]">
                <span className="bg-[#0066FF] text-white text-xl font-bold p-4 rounded-full shadow-lg arabic-text">الجبر</span>
                <span className="bg-[#5DA9E9] text-white text-lg p-3 rounded-full shadow-md arabic-text">قهوة</span>
                <span className="bg-[#87CEEB] text-gray-800 text-2xl font-bold p-5 rounded-full shadow-lg arabic-text">خوارزمية</span>
                <span className="bg-[#5DA9E9] text-white text-md p-2 rounded-full shadow-sm arabic-text">سكر</span>
                <span className="bg-[#0049B7] text-white text-xl font-bold p-4 rounded-full shadow-lg arabic-text">غول</span>
                <span className="bg-[#87CEEB] text-gray-800 text-lg p-3 rounded-full shadow-md arabic-text">قطن</span>
                <span className="bg-[#0066FF] text-white text-2xl font-bold p-5 rounded-full shadow-xl arabic-text">صفر</span>
                <span className="bg-[#5DA9E9] text-white text-md p-2 rounded-full shadow-sm arabic-text">ليمون</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Numerals */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 my-12">
          <h2 className="text-3xl font-bold text-center mb-2 arabic-text">حكاية رقمين</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto arabic-text">الأرقام العربية المستخدمة في الغرب نشأت في الهند وانتقلت عبر العلماء العرب. الأرقام المستخدمة في العديد من الدول الناطقة بالعربية اليوم تُعرف بالأرقام العربية الشرقية.</p>
          <div className="overflow-x-auto">
            <table className="w-full max-w-lg mx-auto text-center">
              <thead>
                <tr>
                  <th className="p-4 bg-blue-100 text-[#0049B7] rounded-r-lg arabic-text">الأرقام العربية الشرقية</th>
                  <th className="p-4 bg-blue-100 text-[#0049B7] rounded-l-lg arabic-text">الأرقام العربية الغربية</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blue-100">
                  <td className="p-4 text-2xl font-bold arabic-text" dir="rtl">٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩</td>
                  <td className="p-4 text-2xl font-bold arabic-text" dir="ltr">0 1 2 3 4 5 6 7 8 9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
