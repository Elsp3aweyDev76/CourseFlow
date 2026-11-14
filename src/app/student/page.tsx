"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle, PlayCircle, Award, LogOut } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();

  // بيانات تجريبية للدورات المسجل بها الطالب
  const [courses] = useState([
    {
      id: 'fullstack-01',
      title: 'تطوير تطبيقات الويب الشاملة (Full Stack)',
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
      currentLessonId: 'lesson-14',
      currentLessonTitle: 'ربط قواعد البيانات بـ Prisma ORM',
      imageBg: 'from-indigo-500 to-violet-600',
    },
    {
      id: 'python-02',
      title: 'البرمجة بلغة بايثون وتطوير REST APIs',
      progress: 30,
      totalLessons: 15,
      completedLessons: 4,
      currentLessonId: 'lesson-05',
      currentLessonTitle: 'إنشاء Endpoints وإدارة الـ Routes',
      imageBg: 'from-blue-500 to-cyan-600',
    }
  ]);

  const handleLogout = () => {
    document.cookie = 'courseflow_token=; path=/; max-age=0';
    document.cookie = 'courseflow_role=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              CF
            </div>
            <span className="text-xl font-black text-slate-900">CourseFlow</span>
          </div>

          <nav className="space-y-2">
            <Link href="/student" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
              <BookOpen className="w-5 h-5" />
              دوراتي التعليمية
            </Link>
            <Link href="/student/certificates" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium">
              <Award className="w-5 h-5" />
              الشهادات المكتسبة
            </Link>
          </nav>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-all text-right"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Top Bar */}
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h1 className="text-2xl font-black text-slate-900">أهلاً بك، محسن 👋</h1>
              <p className="text-sm text-slate-500 mt-1">تابع تقدمك في الدورات واستمر في التعلم بدون انقطاع.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                م
              </div>
              <button
                onClick={handleLogout}
                className="md:hidden p-2.5 rounded-xl bg-rose-50 text-rose-600"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">2</h3>
              <p className="text-sm text-slate-500">الدورات النشطة حالياً</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">17</h3>
              <p className="text-sm text-slate-500">درساً مكتملة</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">1</h3>
              <p className="text-sm text-slate-500">شهادة تم تحقيقها</p>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">دوراتي التدريبية</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                  <div className={`h-32 bg-gradient-to-r ${course.imageBg} p-6 flex flex-col justify-between text-white`}>
                    <span className="bg-white/20 backdrop-blur-md self-start text-xs font-bold px-3 py-1 rounded-full">
                      مستمر في التعلم
                    </span>
                    <h3 className="font-bold text-lg leading-snug">{course.title}</h3>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>نسبة الإنجاز</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Current Lesson Info */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-xs font-bold text-indigo-600 block">الدرس الحالي:</span>
                      <p className="text-sm font-bold text-slate-800">{course.currentLessonTitle}</p>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/student/courses/${course.id}/lessons/${course.currentLessonId}`}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle className="w-5 h-5" />
                      متابعة التعلم
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}