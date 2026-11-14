"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, BookOpen, Users, DollarSign, BarChart2, Video, Trash2, LogOut, Loader2 } from 'lucide-react';

interface CourseItem {
  id: string;
  title: string;
  price: number;
  published: boolean;
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export default function InstructorDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // حالة نموذج إضافة دورة جديدة
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // جلب الدورات عند تحميل الصفحة بطريقة آمنة لتجنب تحذيرات الـ Linter
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          price: newPrice,
          instructorEmail: 'ahmed@courseflow.com',
        }),
      });

      if (res.ok) {
        const createdCourse = await res.json();
        setCourses([createdCourse, ...courses]);
        setNewTitle('');
        setNewPrice('');
        setIsAddingCourse(false);
      }
    } catch (error) {
      console.error('Error adding course:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCourses(courses.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleLogout = () => {
    document.cookie = 'courseflow_token=; path=/; max-age=0';
    document.cookie = 'courseflow_role=; path=/; max-age=0';
    router.push('/login');
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
              لوحة تحكم المحاضر
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">أهلاً بك، د. أحمد 👨‍🏫</h1>
            <p className="text-sm text-slate-500 mt-1">قم بإدارة دوراتك التدريبية، رفع المحاضرات، ومتابعة أداء الطلاب.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingCourse(!isAddingCourse)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all text-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>إنشاء دورة جديدة</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{courses.length}</h3>
            <p className="text-sm text-slate-500">إجمالي الدورات</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{totalStudents}</h3>
            <p className="text-sm text-slate-500">إجمالي الطلاب المسجلين</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">$0</h3>
            <p className="text-sm text-slate-500">الأرباح الإجمالية</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">100%</h3>
            <p className="text-sm text-slate-500">حالة الاتصال بالقاعدة</p>
          </div>
        </div>

        {/* Add Course Form Box */}
        {isAddingCourse && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-indigo-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-lg text-slate-900">إضافة دورة تدريبية جديدة</h3>
              <button onClick={() => setIsAddingCourse(false)} className="text-slate-400 hover:text-slate-600 font-bold">إلغاء</button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block text-right">عنوان الدورة</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: احتراف بناء واجهات المستخدم بـ Tailwind CSS"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block text-right">سعر الدورة ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="مثال: 49 أو 0 للمجاني"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-indigo-100 text-sm transition-all flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submitting ? 'جاري الحفظ...' : 'حفظ وإنشاء الدورة'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Courses Management List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
          <h2 className="text-xl font-black text-slate-900">إدارة الدورات الخاصة بي</h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">لا توجد دورات مسجلة في قاعدة البيانات بعد. ابدأ بإنشاء أول دورة!</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{course.title}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${course.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {course.published ? 'منشور' : 'مسودة / قيد المراجعة'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      السعر: {course.price === 0 ? 'مجاناً' : `$${course.price}`} | الطلاب: {course._count?.enrollments || 0} | المحاضرات: {course._count?.lessons || 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <Link
                      href={`/instructor/courses/${course.id}`}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Video className="w-4 h-4 text-indigo-600" />
                      <span>إدارة المحتوى</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                      title="حذف الدورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}