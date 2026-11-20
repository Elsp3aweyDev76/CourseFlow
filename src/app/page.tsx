"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Award,
  GraduationCap,
  ChevronDown,
  Lock,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import AboutSection from "@/components/AboutUsSection";

/* ============================== بيانات الصفحة ============================== */

const features = [
  {
    icon: Lock,
    title: "نظام القفل التسلسلي",
    desc: "لا يمكن الانتقال للدرس التالي إلا بعد إكمال مشاهدة الفيديو الحالي واجتياز اختبار التحصيل بنجاح لضمان الفهم.",
    theme: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: BookOpen,
    title: "محتوى عملي وتطبيقي",
    desc: "دورات مبنية على مشاريع حقيقية وسوق العمل المباشر لتكون جاهزاً للتوظيف فور إتمام مسارك التدريبي.",
    theme: "bg-violet-50 text-violet-600",
  },
  {
    icon: Award,
    title: "شهادات إتمام معتمدة",
    desc: "احصل على شهادات رسمية موثقة تثبت مهاراتك وتزيد من فرص قبولك في كبرى الشركات التقنية.",
    theme: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "تتبع نسبة الإنجاز",
    desc: "شريط تقدم واضح لكل دورة يوضح ما أنجزته وما تبقى، لتبقى متحمساً حتى خط النهاية.",
    theme: "bg-amber-50 text-amber-600",
  },
];

const steps = [
  { n: "01", title: "أنشئ حسابك", desc: "سجّل مجاناً في أقل من دقيقة وابدأ رحلتك." },
  { n: "02", title: "اختر دورتك", desc: "تصفح الدورات واختر المسار الذي يناسب هدفك." },
  { n: "03", title: "تعلّم خطوة بخطوة", desc: "شاهد الدروس بالترتيب واجتز الاختبارات لفتح الدرس التالي." },
  { n: "04", title: "احصل على شهادتك", desc: "أكمل المسار واحصل على شهادة إتمام موثقة." },
];

const faqs = [
  {
    q: "ما هو القفل التسلسلي للدروس؟",
    a: "هو نظام يمنعك من فتح الدرس التالي قبل إكمال الدرس الحالي واجتياز اختباره، حتى تتأكد من فهمك لكل مرحلة قبل الانتقال لما بعدها.",
  },
  {
    q: "هل أستطيع التعلم في أي وقت؟",
    a: "نعم، المحتوى متاح على مدار الساعة، وتتعلم بالسرعة التي تناسبك ويُحفظ تقدمك تلقائياً.",
  },
  {
    q: "هل أحصل على شهادة بعد إنهاء الدورة؟",
    a: "نعم، تحصل على شهادة إتمام بعد إنهاء جميع دروس الدورة واجتياز اختباراتها.",
  },
  {
    q: "كيف أتابع تقدمي؟",
    a: "تعرض لك كل دورة نسبة الإنجاز المئوية، وتُحدَّث مع كل درس تُكمله.",
  },
];

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================== الصفحة ============================== */

const noopSubscribe = () => () => { };

// السنة الحالية: على الخادم قيمة ثابتة، وفي المتصفح السنة الفعلية
// (Cache Components لا تسمح باستخدام new Date() أثناء العرض على الخادم)
function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => 2026
  );
  return <>{year}</>;
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
      {/* ============ الواجهة الرئيسية (Hero) ============ */}
      <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-24 bottom-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-bold inline-block">
            منصة CourseFlow التعليمية المتكاملة 🚀
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            ابنِ مستقبلك البرمجي باحترافية <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              من الصفر وحتى الاحتراف
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            منصة تعليمية ذكية تدعم مسارات التعلم التفاعلية، القفل التسلسلي للدروس، تتبع نسبة الإنجاز، واختبارات التحصيل الفورية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/courses"
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>تصفح الدورات المتاحة</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how"
              onClick={(e) => scrollToSection(e, "#how")}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
            >
              كيف تعمل المنصة؟
            </a>
          </div>
        </div>
      </section>

      {/* ============ المميزات ============ */}
      <section id="features" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20 w-full space-y-12">
        <Reveal className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            لماذا يختار الطلاب منصة CourseFlow؟
          </h2>
          <p className="text-slate-500 text-sm">
            مميزات مصممة خصيصاً لتمنحك أفضل تجربة تعليمية ممكنة.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 100}>
                <div className="h-full bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl ${f.theme} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ من نحن (مكوّن مستقل) ============ */}
      <AboutSection />

      {/* ============ كيف تعمل المنصة ============ */}
      <section id="how" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20 w-full space-y-12">
        <Reveal className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">كيف تعمل المنصة؟</h2>
          <p className="text-slate-500 text-sm">أربع خطوات بسيطة تفصلك عن شهادتك.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="h-full bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-3 relative overflow-hidden">
                <span className="absolute top-3 left-5 text-6xl font-black text-indigo-50 select-none" dir="ltr">
                  {s.n}
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center relative z-10">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 relative z-10">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed relative z-10">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ الأسئلة الشائعة ============ */}
      <section id="faq" className="scroll-mt-20 max-w-3xl mx-auto px-6 pb-20 w-full space-y-10">
        <Reveal className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">الأسئلة الشائعة</h2>
          <p className="text-slate-500 text-sm">إجابات سريعة على أكثر ما يسأل عنه الطلاب.</p>
        </Reveal>

        <Reveal>
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 p-5 text-right"
                  >
                    <span className="font-bold text-slate-900 text-sm md:text-base">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-indigo-600 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ============ دعوة أخيرة ============ */}
      <section className="px-6 pb-20">
        <Reveal>
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 rounded-3xl p-10 md:p-14 text-center text-white space-y-5 relative overflow-hidden">
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-2xl md:text-4xl font-black relative z-10">جاهز لتبدأ رحلتك التعليمية؟</h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto relative z-10">
              انضم الآن وابدأ أول درس لك اليوم، وتابع تقدمك خطوة بخطوة حتى الاحتراف.
            </p>
            <Link
              href="/courses"
              className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm shadow-xl transition-all"
            >
              <span>ابدأ الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ التذييل ============ */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-black text-slate-900">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            CourseFlow
          </div>
          <p>© <CurrentYear /> CourseFlow. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}