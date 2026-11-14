"use client";

import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-bold inline-block">
            منصة CourseFlow التعليمية المتكاملة 🚀
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            ابني مستقبلـك البرمجي باحترافية <br />
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
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">لماذا يختار الطلاب منصة CourseFlow؟</h2>
          <p className="text-slate-500 text-sm">مُميزات مصممة خصيصاً لتمنحك أفضل تجربة تعليمية ممكنة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">نظام القفل التسلسلي</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              لا يمكن الانتقال للدرس التالي إلا بعد إكمال مشاهدة الفيديو الحالي واجتياز اختبار التحصيل بنجاح لضمان الفهم.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">محتوى عملي وتطبيقي</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              دورات مبنية على مشاريع حقيقية وسوق العمل المباشر لتكون جاهزاً للتوظيف فور إتمام مسارك التدريبي.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">شهادات إتمام معتمدة</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              احصل على شهادات رسمية موثقة تثبت مهاراتك وتزيد من فرص قبولك في كبرى الشركات التقنية.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}