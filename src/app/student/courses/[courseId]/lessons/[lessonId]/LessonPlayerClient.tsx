'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    CheckCircle,
    Lock,
    PlayCircle,
    Play,
    Pause,
    ArrowRight,
    CheckSquare,
    Award,
} from 'lucide-react';
import { submitQuizAnswer, updateWatchProgress } from '@/app/actions/progress';

export type PlayerLesson = {
    id: string;
    title: string;
    videoUrl: string;
    duration: string;
    order: number;
    isCompleted: boolean;
    isLocked: boolean;
    maxWatchedSeconds: number;
    lastTimestamp: number;
    quizPassed: boolean;
    quiz: { question: string; options: string[]; correct: number } | null;
};

type Props = {
    courseId: string;
    courseTitle: string;
    lessons: PlayerLesson[];
    activeLessonId: string;
    lockedReason: string | null;
    enrollmentProgress: number;
};

export default function LessonPlayerClient({
    courseId,
    courseTitle,
    lessons,
    activeLessonId,
    lockedReason,
    enrollmentProgress,
}: Props) {
    const router = useRouter();
    const active = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
    const activeIndex = lessons.findIndex((l) => l.id === active?.id);
    const nextLesson = lessons[activeIndex + 1];
    const completedCount = lessons.filter((l) => l.isCompleted).length;

    const videoRef = useRef<HTMLVideoElement>(null);
    const lastSent = useRef(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [isVideoCompleted, setIsVideoCompleted] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [currentTime, setCurrentTime] = useState(active?.lastTimestamp ?? 0);
    const [duration, setDuration] = useState(0);

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(
        Boolean(active?.isCompleted || active?.quizPassed)
    );
    const [isQuizPassed, setIsQuizPassed] = useState(
        Boolean(active?.isCompleted || active?.quizPassed)
    );
    const [quizMessage, setQuizMessage] = useState(
        active?.isCompleted || active?.quizPassed
            ? 'تم اجتياز هذا الدرس مسبقاً'
            : ''
    );
    const [submitting, setSubmitting] = useState(false);

    if (!active) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                الدرس غير موجود
            </div>
        );
    }

    if (lockedReason || active.isLocked) {
        return (
            <div
                className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6"
                dir="rtl"
            >
                <div className="max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
                    <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                    <h1 className="text-xl font-bold">الدرس مقفل</h1>
                    <p className="text-sm text-slate-400">
                        {lockedReason || 'أكمل الدرس السابق أولاً'}
                    </p>
                    <Link
                        href="/student"
                        className="inline-block bg-indigo-600 px-5 py-3 rounded-xl font-bold text-sm"
                    >
                        العودة للوحة التحكم
                    </Link>
                </div>
            </div>
        );
    }

    const allCompleted = lessons.every(
        (l) => l.isCompleted || (l.id === active.id && isQuizPassed)
    );

    const formatTime = (sec: number) => {
        if (!sec || !isFinite(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (videoError) return;
        const el = videoRef.current;
        if (!el) return;
        if (el.paused) {
            el.play().catch(() => {
                setVideoError(true);
                setIsPlaying(false);
            });
        } else {
            el.pause();
        }
    };

    const handleTimeUpdate = async (
        e: React.SyntheticEvent<HTMLVideoElement>
    ) => {
        const el = e.currentTarget;
        if (!el.duration) return;
        const percent = Math.floor((el.currentTime / el.duration) * 100);
        setVideoProgress(percent);
        setCurrentTime(el.currentTime);
        setDuration(el.duration);
        if (percent >= 90) setIsVideoCompleted(true);

        const now = Date.now();
        if (now - lastSent.current > 8000) {
            lastSent.current = now;
            await updateWatchProgress({
                lessonId: active.id,
                currentTime: el.currentTime,
                duration: el.duration,
            });
        }
    };

    const handleEnded = async () => {
        setVideoProgress(100);
        setIsVideoCompleted(true);
        const el = videoRef.current;
        await updateWatchProgress({
            lessonId: active.id,
            currentTime: el?.duration ?? duration,
            duration: el?.duration ?? duration,
        });
    };

    const handleQuizSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAnswer === null) return;
        setSubmitting(true);
        const res = await submitQuizAnswer({
            lessonId: active.id,
            selectedIndex: selectedAnswer,
        });
        setSubmitting(false);
        setIsQuizSubmitted(true);

        if (res && 'passed' in res && res.passed) {
            setIsQuizPassed(true);
            setQuizMessage(res.message || 'تم اجتياز الاختبار');
            router.refresh();
        } else {
            setIsQuizPassed(false);
            setQuizMessage(
                (res && 'message' in res && res.message) ||
                (res && 'error' in res && res.error) ||
                'الإجابة غير صحيحة'
            );
        }
    };

    const openLesson = (lesson: PlayerLesson) => {
        if (lesson.isLocked) return;
        router.push(`/student/courses/${courseId}/lessons/${lesson.id}`);
    };

    const quiz = active.quiz;

    return (
        <div
            className="min-h-screen bg-slate-900 text-slate-100 flex flex-col"
            dir="rtl"
        >
            <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/courses/${courseId}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        <ArrowRight className="w-4 h-4" />
                        تفاصيل الدورة
                    </Link>
                    <h1 className="text-lg font-bold text-white hidden sm:block">
                        {courseTitle}
                    </h1>
                </div>
                <div className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-full font-bold">
                    الإنجاز {Math.round(enrollmentProgress)}%
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-6 lg:p-8 space-y-6 overflow-y-auto">
                    <div className="bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative aspect-video flex items-center justify-center">
                        <video
                            key={`${active.id}-${retryKey}`}
                            ref={videoRef}
                            src={active.videoUrl}
                            className="w-full h-full cursor-pointer"
                            playsInline
                            preload="metadata"
                            onClick={togglePlay}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onLoadedMetadata={(e) => {
                                const el = e.currentTarget;
                                setDuration(el.duration);
                                if (
                                    active.lastTimestamp > 0 &&
                                    active.lastTimestamp < el.duration
                                ) {
                                    el.currentTime = active.lastTimestamp;
                                }
                            }}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleEnded}
                            onError={() => {
                                setVideoError(true);
                                setIsPlaying(false);
                            }}
                        />

                        {!videoError && (isPlaying || videoProgress > 0) && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={togglePlay}
                                    className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-5 h-5" />
                                    ) : (
                                        <Play className="w-5 h-5" />
                                    )}
                                </button>
                                <div
                                    className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden"
                                    dir="ltr"
                                >
                                    <div
                                        className="h-full bg-indigo-500"
                                        style={{ width: `${videoProgress}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold tabular-nums" dir="ltr">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>
                        )}

                        {videoError && (
                            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-3 p-6 text-center">
                                <p className="font-bold text-rose-400">تعذّر تحميل الفيديو</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVideoError(false);
                                        setRetryKey((k) => k + 1);
                                    }}
                                    className="bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                                >
                                    إعادة المحاولة
                                </button>
                            </div>
                        )}

                        {!videoError && !isPlaying && videoProgress === 0 && (
                            <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center space-y-4">
                                <button
                                    type="button"
                                    onClick={togglePlay}
                                    className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center"
                                >
                                    <PlayCircle className="w-10 h-10" />
                                </button>
                                <p className="font-bold text-slate-200">
                                    اضغط لتشغيل الفيديو (اختياري)
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-800/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-400 font-bold block">
                                {active.title}
                            </span>
                            <p className="text-sm font-bold text-white">
                                {isVideoCompleted
                                    ? 'انتهت مشاهدة الفيديو'
                                    : videoProgress > 0
                                        ? `تقدّم المشاهدة: ${videoProgress}%`
                                        : 'يمكنك مشاهدة الفيديو أو الانتقال مباشرة للاختبار'}
                            </p>
                        </div>
                        <span className="bg-slate-700/50 text-slate-300 border border-slate-600 px-4 py-2 rounded-xl text-xs font-bold">
                            مشاهدة اختيارية
                        </span>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-800 p-6 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">اختبار التحصيل</h3>
                                <p className="text-xs text-slate-400">
                                    أجب عن السؤال لتجاوز الدرس وفتح التالي — دون إلزام بمشاهدة
                                    الفيديو
                                </p>
                            </div>
                            <CheckSquare className="w-6 h-6 text-indigo-400" />
                        </div>

                        {!quiz ? (
                            <button
                                type="button"
                                disabled={submitting || isQuizPassed}
                                onClick={async () => {
                                    setSubmitting(true);
                                    const res = await submitQuizAnswer({
                                        lessonId: active.id,
                                        selectedIndex: 0,
                                    });
                                    setSubmitting(false);
                                    setIsQuizSubmitted(true);
                                    if (res && 'passed' in res && res.passed) {
                                        setIsQuizPassed(true);
                                        setQuizMessage(res.message || 'تم إكمال الدرس');
                                        router.refresh();
                                    } else if (res && 'error' in res) {
                                        setQuizMessage(res.error || 'حدث خطأ');
                                    }
                                }}
                                className="bg-indigo-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm"
                            >
                                {isQuizPassed
                                    ? 'تم إكمال الدرس'
                                    : submitting
                                        ? 'جاري الحفظ...'
                                        : 'إنهاء الدرس وفتح التالي'}
                            </button>
                        ) : (
                            <form onSubmit={handleQuizSubmit} className="space-y-4">
                                <p className="font-bold text-slate-200 text-sm">
                                    {quiz.question}
                                </p>
                                <div className="space-y-2">
                                    {quiz.options.map((option, idx) => (
                                        <label
                                            key={idx}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer ${selectedAnswer === idx
                                                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                                    : 'bg-slate-900 border-slate-800 text-slate-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="quizOption"
                                                className="hidden"
                                                checked={selectedAnswer === idx}
                                                onChange={() => setSelectedAnswer(idx)}
                                                disabled={isQuizPassed}
                                            />
                                            <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm">{option}</span>
                                        </label>
                                    ))}
                                </div>

                                {!isQuizPassed && (
                                    <button
                                        type="submit"
                                        disabled={selectedAnswer === null || submitting}
                                        className="bg-indigo-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm"
                                    >
                                        {submitting ? 'جاري الإرسال...' : 'إرسال الإجابة'}
                                    </button>
                                )}

                                {isQuizSubmitted && quizMessage && (
                                    <div
                                        className={`p-4 rounded-2xl text-sm font-bold ${isQuizPassed
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-rose-500/10 text-rose-400'
                                            }`}
                                    >
                                        {quizMessage}
                                    </div>
                                )}

                                {isQuizPassed && nextLesson && !nextLesson.isLocked && (
                                    <button
                                        type="button"
                                        onClick={() => openLesson(nextLesson)}
                                        className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm"
                                    >
                                        الانتقال إلى الدرس التالي
                                    </button>
                                )}

                                {isQuizPassed && allCompleted && (
                                    <Link
                                        href={`/student/certificates/${courseId}`}
                                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-xl text-sm"
                                    >
                                        <Award className="w-4 h-4" />
                                        عرض شهادة الإتمام
                                    </Link>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                <div className="bg-slate-950 border-t lg:border-r border-slate-800 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <h2 className="font-bold text-white">محتوى الدورة</h2>
                        <span className="text-xs text-slate-400">
                            {Math.min(
                                completedCount + (isQuizPassed && !active.isCompleted ? 1 : 0),
                                lessons.length
                            )}{' '}
                            من {lessons.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {lessons.map((lesson, idx) => {
                            const done =
                                lesson.isCompleted ||
                                (lesson.id === active.id && isQuizPassed);
                            return (
                                <button
                                    key={lesson.id}
                                    type="button"
                                    onClick={() => openLesson(lesson)}
                                    disabled={lesson.isLocked}
                                    className={`w-full text-right p-4 rounded-2xl border flex items-center gap-3 ${lesson.id === active.id
                                            ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                                            : lesson.isLocked
                                                ? 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'bg-slate-900 border-slate-800 text-slate-300'
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${done
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : lesson.isLocked
                                                    ? 'bg-slate-800 text-slate-600'
                                                    : 'bg-indigo-600 text-white'
                                            }`}
                                    >
                                        {done ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : lesson.isLocked ? (
                                            <Lock className="w-4 h-4" />
                                        ) : (
                                            idx + 1
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">{lesson.title}</p>
                                        <span className="text-[10px] text-slate-500">
                                            {lesson.duration}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {allCompleted ? (
                        <Link
                            href={`/student/certificates/${courseId}`}
                            className="block bg-amber-500/15 border border-amber-500/40 p-5 rounded-3xl hover:bg-amber-500/25 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Award className="w-8 h-8 text-amber-400" />
                                <div>
                                    <h4 className="font-bold text-white text-sm">
                                        شهادة الإتمام جاهزة
                                    </h4>
                                    <p className="text-xs text-amber-200/80">
                                        اضغط لعرض الشهادة وتحميلها
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="bg-indigo-900/30 border border-indigo-500/30 p-5 rounded-3xl flex items-center gap-3">
                            <Award className="w-8 h-8 text-indigo-400" />
                            <div>
                                <h4 className="font-bold text-white text-sm">شهادة الإتمام</h4>
                                <p className="text-xs text-slate-400">
                                    تظهر عند إكمال كل الدروس
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}