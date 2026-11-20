import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateCourseForm from '@/components/CreateCourseForm';
import { getSession } from '@/lib/auth';
import CreateLessonForm from '@/components/CreateLessonForm';
async function InstructorContent() {
  const session = await getSession();
  if (!session) redirect('/login');

  const instructor = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      courses: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { lessons: true, enrollments: true } },
        },
      },
    },
  });

  if (!instructor || (instructor.role !== 'INSTRUCTOR' && instructor.role !== 'ADMIN')) {
    redirect('/');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold">لوحة تحكم المحاضر</h1>
        <p className="text-sm text-slate-400">مرحباً {instructor.name}، يمكنك إنشاء وإدارة دوراتك من هنا</p>
      </div>

      {/* نموذج إضافة دورة */}
      <CreateCourseForm />
      <CreateLessonForm
        courses={instructor.courses.map((c) => ({ id: c.id, title: c.title }))}
      />
      {/* قائمة دورات المحاضر */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">دوراتي ({instructor.courses.length})</h2>
        {instructor.courses.length === 0 ? (
          <p className="text-sm text-slate-400 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">
            لم تقم بإضافة أي دورات بعد.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instructor.courses.map((course) => (
              <div key={course.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                    {course._count.lessons} درس
                  </span>
                  <span className="text-xs text-slate-400">
                    {course.price === 0 ? 'مجاني' : `$${course.price}`}
                  </span>
                </div>
                <h3 className="font-bold text-base">{course.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span>الدروس: {course._count.lessons}</span>
                  <span>الطلاب: {course._count.enrollments}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstructorDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 font-sans" dir="rtl">
      <Suspense fallback={<div className="max-w-5xl mx-auto text-center py-20 text-slate-400">جاري تحميل لوحة تحكم المحاضر...</div>}>
        <InstructorContent />
      </Suspense>
    </div>
  );
}