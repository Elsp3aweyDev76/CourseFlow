import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
    BookOpen,
    Clock,
    GraduationCap,
    PlayCircle,
    User,
    CheckCircle,
    Lock,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import EnrollButton from './EnrollButton';

export default async function CourseDetailsPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const session = await getSession();

    const course = await prisma.course.findFirst({
        where: { id: courseId, published: true },
        include: {
            instructor: { select: { id: true, name: true } },
            lessons: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    order: true,
                    quizQuestion: true,
                },
            },
            _count: { select: { enrollments: true, lessons: true } },
        },
    });

    if (!course) notFound();

    let enrollment: { id: string; progress: number } | null = null;
    let completedLessonIds = new Set<string>();

    if (session) {
        enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId: session.userId, courseId },
            },
            select: { id: true, progress: true },
        });

        if (enrollment) {
            const done = await prisma.lessonProgress.findMany({
                where: {
                    userId: session.userId,
                    isCompleted: true,
                    lesson: { courseId },
                },
                select: { lessonId: true },
            });
            completedLessonIds = new Set(done.map((d) => d.lessonId));
        }
    }

    const firstIncomplete =
        course.lessons.find((l) => !completedLessonIds.has(l.id)) ??
        course.lessons[0];

    return (
        <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
            <div className="bg-gradient-to-l from-indigo-950 via-slate-950 to-slate-950 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
                    <Link
                        href="/courses"
                        className="text-sm text-slate-400 hover:text-white transition"
                    >
                        ← العودة للدورات
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap gap-2 text-xs font-bold">
                                <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full">
                                    {course.category}
                                </span>
                                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                                    {course.level}
                                </span>
                                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                                    {course.price === 0 ? 'مجاني' : `${course.price} ر.س`}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-slate-300 leading-relaxed max-w-2xl">
                                {course.description || 'لا يوجد وصف لهذه الدورة.'}
                            </p>

                            <div className="flex flex-wrap gap-5 text-sm text-slate-400">
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-400" />
                                    {course.instructor.name || 'محاضر'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-indigo-400" />
                                    {course._count.lessons} درس
                                </span>
                                <span className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                                    {course._count.enrollments} طالب
                                </span>
                            </div>

                            <div className="pt-2">
                                {!session ? (
                                    <Link
                                        href={`/login?next=/courses/${course.id}`}
                                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl"
                                    >
                                        سجّل الدخول للانضمام
                                    </Link>
                                ) : enrollment ? (
                                    <div className="space-y-3">
                                        <div className="text-sm text-slate-300">
                                            تقدمك:{' '}
                                            <span className="font-bold text-indigo-300">
                                                {Math.round(enrollment.progress)}%
                                            </span>
                                        </div>
                                        {firstIncomplete ? (
                                            <Link
                                                href={`/student/courses/${course.id}/lessons/${firstIncomplete.id}`}
                                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl"
                                            >
                                                <PlayCircle className="w-5 h-5" />
                                                متابعة التعلم
                                            </Link>
                                        ) : (
                                            <p className="text-emerald-400 font-bold text-sm">
                                                أكملت جميع دروس هذه الدورة
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <EnrollButton courseId={course.id} />
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-72 shrink-0">
                            <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center">
                                {course.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <GraduationCap className="w-16 h-16 text-white/80" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                <h2 className="text-xl font-bold">محتوى الدورة</h2>

                {course.lessons.length === 0 ? (
                    <p className="text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        لم تُضف دروس بعد.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {course.lessons.map((lesson, index) => {
                            const done = completedLessonIds.has(lesson.id);
                            const canOpen = Boolean(enrollment);
                            const href = canOpen
                                ? `/student/courses/${course.id}/lessons/${lesson.id}`
                                : undefined;

                            const row = (
                                <div
                                    className={`flex items-center gap-4 p-4 rounded-2xl border ${done
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-slate-800 bg-slate-900'
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${done
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : canOpen
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-800 text-slate-500'
                                            }`}
                                    >
                                        {done ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : canOpen ? (
                                            index + 1
                                        ) : (
                                            <Lock className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{lesson.title}</p>
                                        <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {lesson.duration || '—'}
                                            </span>
                                            {lesson.quizQuestion && (
                                                <span className="text-indigo-400">يشمل اختباراً</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );

                            return href ? (
                                <Link key={lesson.id} href={href} className="block hover:opacity-90 transition">
                                    {row}
                                </Link>
                            ) : (
                                <div key={lesson.id}>{row}</div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}