import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle, PlayCircle, Award, LogOut } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logoutAction } from '@/app/actions/auth';

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, title: true, order: true },
          },
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const completed = await prisma.lessonProgress.findMany({
    where: { userId: user.id, isCompleted: true },
    select: { lessonId: true, lesson: { select: { courseId: true } } },
  });

  const doneByCourse = new Map<string, Set<string>>();
  for (const row of completed) {
    const set = doneByCourse.get(row.lesson.courseId) ?? new Set<string>();
    set.add(row.lessonId);
    doneByCourse.set(row.lesson.courseId, set);
  }

  const gradients = [
    'from-indigo-500 to-violet-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      <aside className="w-64 bg-white border-l border-slate-200 hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">CF</div>
            <span className="text-xl font-black text-slate-900">CourseFlow</span>
          </div>
          <nav className="space-y-2">
            <Link href="/student" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
              <BookOpen className="w-5 h-5" /> دوراتي
            </Link>
            <Link href="/courses" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium">
              <PlayCircle className="w-5 h-5" /> تصفح الدورات
            </Link>
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-medium">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </form>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <h1 className="text-2xl font-black text-slate-900">أهلاً بك، {user.name || 'طالب'}</h1>
            <p className="text-sm text-slate-500 mt-1">دوراتك المسجّلة من قاعدة البيانات.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-2xl font-black mt-2">{enrollments.length}</h3>
              <p className="text-sm text-slate-500">دورات</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-2xl font-black mt-2">{completed.length}</h3>
              <p className="text-sm text-slate-500">دروس مكتملة</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border">
              <Award className="w-5 h-5 text-violet-600" />
              <h3 className="text-2xl font-black mt-2">
                {enrollments.filter((e) => e.progress >= 100).length}
              </h3>
              <p className="text-sm text-slate-500">دورات مكتملة</p>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-3xl border p-12 text-center">
              <p className="font-bold text-slate-600 mb-4">لم تسجّل في أي دورة بعد</p>
              <Link href="/courses" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
                تصفح الدورات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment, idx) => {
                const course = enrollment.course;
                const done = doneByCourse.get(course.id)?.size ?? 0;
                const total = course._count.lessons;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                const current =
                  course.lessons.find((l) => !doneByCourse.get(course.id)?.has(l.id)) ??
                  course.lessons[0];

                return (
                  <div key={enrollment.id} className="bg-white rounded-3xl border overflow-hidden">
                    <div className={`h-28 bg-gradient-to-r ${gradients[idx % gradients.length]} p-6 text-white`}>
                      <h3 className="font-bold text-lg">{course.title}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>الإنجاز</span>
                          <span>{percent}% ({done}/{total})</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                      {current ? (
                        <>
                          <p className="text-sm font-bold text-slate-800">الدرس: {current.title}</p>
                          <Link
                            href={`/student/courses/${course.id}/lessons/${current.id}`}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                          >
                            <PlayCircle className="w-5 h-5" /> متابعة التعلم
                          </Link>
                        </>
                      ) : (
                        <p className="text-sm text-slate-400">لا توجد دروس بعد</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}