"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Star, User, ArrowRight, Layers } from 'lucide-react';

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // قائمة تجريبية للدورات المتاحة في المنصة
    const courses = [
        {
            id: 'fullstack-01',
            title: 'تطوير تطبيقات الويب الشاملة (Full Stack)',
            category: 'web',
            instructor: 'م. أحمد خالد',
            rating: 4.9,
            reviewsCount: 128,
            lessonsCount: 20,
            price: 'مجاناً',
            imageBg: 'from-indigo-500 to-violet-600',
            description: 'تعلم بناء تطبيقات ويب متكاملة باستخدام Next.js، Node.js، وقواعد البيانات عبر Prisma ORM.'
        },
        {
            id: 'python-02',
            title: 'البرمجة بلغة بايثون وتطوير REST APIs',
            category: 'backend',
            instructor: 'د. سارة محمود',
            rating: 4.8,
            reviewsCount: 94,
            lessonsCount: 15,
            price: '$49',
            imageBg: 'from-blue-500 to-cyan-600',
            description: 'احتراف لغة بايثون وبناء واجهات برمجية آمنة وعالية الأداء باستخدام Django REST Framework.'
        },
        {
            id: 'flutter-03',
            title: 'تطوير تطبيقات الهواتف الذكية بـ Flutter',
            category: 'mobile',
            instructor: 'م. محمد علي',
            rating: 4.7,
            reviewsCount: 112,
            lessonsCount: 24,
            price: '$79',
            imageBg: 'from-emerald-500 to-teal-600',
            description: 'أنشئ تطبيقات تعمل على أندرويد وآي أو إس بكود واحد باستخدام فلاتر ودارت مع ربط Firebase.'
        },
        {
            id: 'ui-ux-04',
            title: 'أساسيات تصميم واجهات المستخدم UI/UX',
            category: 'design',
            instructor: 'أ. ليلى عبد الله',
            rating: 4.9,
            reviewsCount: 85,
            lessonsCount: 12,
            price: 'مجاناً',
            imageBg: 'from-pink-500 to-rose-600',
            description: 'تعلم مبادئ التصميم الحديثة، نظرية الألوان، وتصميم تجارب مستخدم تفاعلية باستخدام Figma.'
        }
    ];

    // تصفية الدورات بناء على البحث والفئة
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-10">

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-900 to-violet-900 text-white p-8 md:p-12 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
                    <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold inline-block">
                        منصة CourseFlow التعليمية
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black leading-tight">استكشف مئات الدورات واكتسب مهارات المستقبل</h1>
                    <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                        طور مهاراتك البرمجية والتقنية مع نخبة من الخبراء عبر مسارات تعليمية عملية ومنهجية دقيقة.
                    </p>

                    {/* Search Bar */}
                    <div className="pt-4 max-w-xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث عن دورة (مثال: Full Stack, Python, Flutter...)"
                                className="w-full pr-12 pl-4 py-3.5 bg-white text-slate-900 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium"
                            />
                            <Search className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Categories Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'جميع الدورات' },
                        { id: 'web', label: 'تطوير الويب' },
                        { id: 'backend', label: 'الخلفيات والـ APIs' },
                        { id: 'mobile', label: 'تطبيقات الجوال' },
                        { id: 'design', label: 'التصميم UI/UX' },
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Courses Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900">الدورات المتاحة ({filteredCourses.length})</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                                <div className={`h-40 bg-gradient-to-r ${course.imageBg} p-6 flex flex-col justify-between text-white relative`}>
                                    <div className="flex justify-between items-center">
                                        <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full">
                                            {course.price}
                                        </span>
                                        <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">
                                            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                            <span>{course.rating}</span>
                                            <span className="text-white/70">({course.reviewsCount})</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-xl leading-snug">{course.title}</h3>
                                </div>

                                <div className="p-6 space-y-5">
                                    <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>

                                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-4 h-4 text-indigo-600" />
                                            <span>{course.instructor}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="w-4 h-4 text-indigo-600" />
                                            <span>{course.lessonsCount} دروس تعليمية</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/student/courses/${course.id}/lessons/lesson-14`}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all text-sm"
                                    >
                                        <span>استعراض الدورة والبدء</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 space-y-3">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                            <h3 className="text-lg font-bold text-slate-800">لا توجد دورات مطابقة لبحثك</h3>
                            <p className="text-sm text-slate-500">جرب البحث بكلمات مفتاحية أخرى أو إعادة ضبط الفلاتر.</p>
                        </div>
                    )}
                </div>

            </main>

        </div>
    );
}