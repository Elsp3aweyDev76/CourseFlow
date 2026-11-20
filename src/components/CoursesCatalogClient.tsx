'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Search,
    GraduationCap,
    Users,
    PlayCircle,
} from 'lucide-react';

export type CatalogCourse = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    level: string;
    price: number;
    image: string | null;
    instructorName: string;
    lessonsCount: number;
    studentsCount: number;
    firstLessonId: string | null;
};

type Props = {
    initialCourses: CatalogCourse[];
};

export default function CoursesCatalogClient({ initialCourses }: Props) {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('الكل');
    const [level, setLevel] = useState('الكل');

    const categories = useMemo(() => {
        const set = new Set(initialCourses.map((c) => c.category).filter(Boolean));
        return ['الكل', ...Array.from(set)];
    }, [initialCourses]);

    const levels = useMemo(() => {
        const set = new Set(initialCourses.map((c) => c.level).filter(Boolean));
        return ['الكل', ...Array.from(set)];
    }, [initialCourses]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return initialCourses.filter((course) => {
            const matchCategory = category === 'الكل' || course.category === category;
            const matchLevel = level === 'الكل' || course.level === level;
            const matchQuery =
                !q ||
                course.title.toLowerCase().includes(q) ||
                (course.description || '').toLowerCase().includes(q) ||
                course.instructorName.toLowerCase().includes(q);
            return matchCategory && matchLevel && matchQuery;
        });
    }, [initialCourses, query, category, level]);

    return (
        <div className="space-y-8" dir="rtl">
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ابحث عن دورة أو محاضر..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-11 pl-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c === 'الكل' ? 'كل التصنيفات' : c}
                        </option>
                    ))}
                </select>

                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                    {levels.map((l) => (
                        <option key={l} value={l}>
                            {l === 'الكل' ? 'كل المستويات' : l}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
                <span>
                    {filtered.length} دورة
                    {query || category !== 'الكل' || level !== 'الكل' ? ' مطابقة' : ''}
                </span>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                    <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="font-bold text-slate-300">لا توجد دورات مطابقة</p>
                    <p className="text-sm text-slate-500">جرّب تغيير البحث أو الفلاتر</p>
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setCategory('الكل');
                            setLevel('الكل');
                        }}
                        className="text-indigo-400 font-bold text-sm hover:underline"
                    >
                        مسح الفلاتر
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((course) => (
                        <article
                            key={course.id}
                            className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-indigo-500/40 transition-all group"
                        >
                            <div className="aspect-[16/10] bg-gradient-to-br from-indigo-600 to-violet-800 relative overflow-hidden">
                                {course.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <GraduationCap className="w-14 h-14 text-white/80" />
                                    </div>
                                )}
                                <span className="absolute top-3 right-3 bg-black/50 backdrop-blur text-xs font-bold px-3 py-1 rounded-full">
                                    {course.price === 0 ? 'مجاني' : `${course.price} ر.س`}
                                </span>
                            </div>

                            <div className="p-5 flex flex-col flex-1 space-y-3">
                                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                                    <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                                        {course.category}
                                    </span>
                                    <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-full">
                                        {course.level}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg leading-snug line-clamp-2 text-white">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">
                                    {course.description || 'لا يوجد وصف مختصر لهذه الدورة.'}
                                </p>

                                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                                    <span className="truncate max-w-[50%]">
                                        {course.instructorName}
                                    </span>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {course.lessonsCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {course.studentsCount}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={`/courses/${course.id}`}
                                    className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 rounded-2xl transition-all"
                                >
                                    <PlayCircle className="w-4 h-4" />
                                    عرض التفاصيل
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}