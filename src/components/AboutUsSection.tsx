"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Award,
  Users,
  Target,
  Eye,
  Sparkles,
  GraduationCap,
  Globe,
} from "lucide-react";
import { Reveal, Counter } from "../components/Reveal";

// ملاحظة: هذه أرقام تجريبية، استبدلها بأرقامك الحقيقية قبل النشر
const stats = [
  { label: "طالب نشط ومتعلم", value: 10000, prefix: "+", suffix: "", icon: Users, theme: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { label: "دورة تدريبية متخصصة", value: 150, prefix: "+", suffix: "", icon: BookOpen, theme: "bg-violet-50 text-violet-600 border-violet-100" },
  { label: "محاضر وخبير تقني", value: 40, prefix: "+", suffix: "", icon: Award, theme: "bg-amber-50 text-amber-600 border-amber-100" },
  { label: "نسبة إكمال ناجحة", value: 94, prefix: "", suffix: "%", icon: Globe, theme: "bg-emerald-50 text-emerald-600 border-emerald-100" },
];

const values = [
  { title: "تطبيق عملي 100%", desc: "مناهج مبنية على مشاريع حقيقية تحاكي متطلبات سوق العمل المباشر.", color: "text-indigo-600 bg-indigo-50" },
  { title: "مرونة كاملة في التعلم", desc: "ادرس في أي وقت ومن أي مكان بالسرعة التي تناسب جدولك اليومي.", color: "text-violet-600 bg-violet-50" },
  { title: "مجتمع تعليمي داعم", desc: "تواصل مستمر مع المحاضرين والزملاء لتبادل الخبرات وحل التحديات.", color: "text-emerald-600 bg-emerald-50" },
  { title: "شهادات موثقة ومعتمدة", desc: "احصل على شهادة إتمام رسمية تعزز ملفك المهني فور إنهاء المسار.", color: "text-amber-600 bg-amber-50" },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 py-24 px-6 md:px-12 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* العنوان */}
        <Reveal className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-bold shadow-sm">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>من نحن</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            نرتقي بتجربة{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-violet-600">
              التعلم الرقمي
            </span>{" "}
            لبناء جيل مبدع
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            نؤمن بأن التعليم الجيد هو المفتاح الحقيقي لصناعة المستقبل. في{" "}
            <strong className="text-slate-900">CourseFlow</strong>، نصمم مسارات تعليمية متكاملة تجمع بين وضوح المعلومة ومتعة التطبيق العملي.
          </p>
        </Reveal>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 100}>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 flex flex-col items-center text-center space-y-3 group hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl border ${s.theme} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  <p className="text-xs md:text-sm font-bold text-slate-500">{s.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* الرؤية والرسالة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal>
            <div className="h-full bg-white p-8 md:p-10 rounded-3xl border border-indigo-100/80 shadow-sm space-y-6 relative overflow-hidden group hover:shadow-lg hover:shadow-indigo-100 transition-all">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 relative z-10">
                <Eye className="w-7 h-7" />
              </div>
              <div className="space-y-3 relative z-10">
                <span className="text-xs font-extrabold tracking-wider text-indigo-600">تطلعاتنا</span>
                <h3 className="text-2xl font-black text-slate-900">رؤيتنا التعليمية</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  أن نصبح الوجهة الأولى والأكثر موثوقية للتعليم التقني والمهني في العالم العربي، من خلال تقديم تجربة تعليمية ذكية تضاهي أرقى الأكاديميات العالمية وتواكب تطورات المستقبل.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full bg-white p-8 md:p-10 rounded-3xl border border-emerald-100/80 shadow-sm space-y-6 relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-100 transition-all">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 relative z-10">
                <Target className="w-7 h-7" />
              </div>
              <div className="space-y-3 relative z-10">
                <span className="text-xs font-extrabold tracking-wider text-emerald-600">التزامنا</span>
                <h3 className="text-2xl font-black text-slate-900">رسالتنا لطلابنا</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  تمكين كل متعلم من اكتساب مهارات حقيقية قابلة للتطبيق الفوري، عبر بيئة تفاعلية منظمة، شروحات مبسطة، ومتابعة مستمرة تضمن تحويل الشغف إلى احتراف وإنجاز ملموس.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* القيم */}
        <Reveal>
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>ركائز الجودة لدينا</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">لماذا يفضل الطلاب التعلم معنا؟</h3>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:opacity-95 transition-all"
              >
                <span>استكشف الدورات المتاحة</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}