import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Award, CheckCircle, Calendar, User, BookOpen } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CertificateActions from './CertificateActions';

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    include: {
      course: {
        include: {
          instructor: {
            select: { name: true },
          },
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
  });

  if (!enrollment) {
    notFound();
  }

  const course = enrollment.course;
  const totalLessons = course._count.lessons;

  const completedCount = await prisma.lessonProgress.count({
    where: {
      userId: user.id,
      isCompleted: true,
      lesson: { courseId },
    },
  });

  const isCompleted =
    totalLessons > 0 &&
    (enrollment.progress >= 100 || completedCount >= totalLessons);

  if (!isCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900">الشهادة غير متاحة بعد</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            يجب إكمال جميع دروس الدورة «{course.title}» أولاً حتى تتمكن من الحصول على شهادة الإتمام.
          </p>
          <div className="text-sm font-bold text-indigo-600">
            تقدمك الحالي: {Math.round(enrollment.progress)}% ({completedCount}/{totalLessons} درس)
          </div>
          <Link
            href="/student"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
          >
            العودة إلى دوراتي
          </Link>
        </div>
      </div>
    );
  }

  const completionDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/student"
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            ← العودة إلى دوراتي
          </Link>
          <CertificateActions />
        </div>

        <div
          id="certificate"
          className="bg-white rounded-3xl border-4 border-indigo-600 shadow-2xl overflow-hidden relative"
        >
          <div className="h-3 bg-gradient-to-l from-indigo-600 via-violet-500 to-indigo-600" />

          <div className="p-8 md:p-12 space-y-8 text-center relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute top-10 right-10 w-40 h-40 border-4 border-indigo-600 rounded-full" />
              <div className="absolute bottom-10 left-10 w-32 h-32 border-4 border-violet-500 rounded-full" />
            </div>

            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-indigo-600 tracking-widest">COURSEFLOW</h2>
                <p className="text-xs text-slate-400">منصة التعلم التفاعلية</p>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                شهادة إتمام دورة
              </h1>
              <div className="w-24 h-1 bg-gradient-to-l from-indigo-600 to-violet-500 mx-auto rounded-full" />
            </div>

            <div className="space-y-6 relative z-10 max-w-2xl mx-auto">
              <p className="text-slate-500 text-sm">يُشهد بأن</p>

              <h2 className="text-2xl md:text-3xl font-black text-indigo-700">
                {user.name || 'طالب'}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                قد أتمّ بنجاح متطلبات الدورة التدريبية التالية واجتاز جميع الاختبارات المقررة
              </p>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">
                  {course.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto relative z-10 pt-4">
              <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <User className="w-5 h-5 text-indigo-500" />
                <span className="text-xs text-slate-400">المحاضر</span>
                <span className="text-sm font-bold text-slate-800">
                  {course.instructor?.name || 'محاضر المنصة'}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span className="text-xs text-slate-400">عدد الدروس</span>
                <span className="text-sm font-bold text-slate-800">
                  {totalLessons} درس
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span className="text-xs text-slate-400">تاريخ الإتمام</span>
                <span className="text-sm font-bold text-slate-800">
                  {completionDate}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-4 relative z-10">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600">
                تم التحقق من إكمال الدورة بنسبة 100%
              </span>
            </div>
          </div>

          <div className="h-3 bg-gradient-to-l from-indigo-600 via-violet-500 to-indigo-600" />
        </div>

        <p className="text-center text-xs text-slate-400">
          يمكنك طباعة الشهادة أو حفظها كملف PDF من خلال زر الطباعة أعلاه
        </p>
      </div>
    </div>
  );
}