'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Film, Upload, X, Link2 } from 'lucide-react';
import { createLessonAction } from '@/app/actions/instructor';

type CourseOption = { id: string; title: string };

function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} ك.ب`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
}

export default function CreateLessonForm({
    courses,
}: {
    courses: CourseOption[];
}) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [useLink, setUseLink] = useState(false);

    if (courses.length === 0) {
        return (
            <p className="text-sm text-slate-400 bg-slate-950 border border-slate-800 rounded-2xl p-6">
                أنشئ دورة أولاً ثم أضف لها دروساً بالفيديو.
            </p>
        );
    }

    function pickFile(next: File | null) {
        if (!next) return;
        if (!next.type.startsWith('video/')) {
            setError('اختر ملف فيديو MP4 أو WebM');
            return;
        }
        if (next.size > 100 * 1024 * 1024) {
            setError('حجم الفيديو يجب ألا يتجاوز 100 ميجابايت');
            return;
        }
        setError('');
        setFile(next);
        setUseLink(false);
    }

    function clearFile() {
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        if (file) formData.set('videoFile', file);

        const res = await createLessonAction(formData);
        setLoading(false);

        if (res?.error) {
            setError(res.error);
            return;
        }

        setSuccess('تم حفظ الدرس بنجاح');
        e.currentTarget.reset();
        clearFile();
        router.refresh();
    }

    const field =
        'w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white';

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5"
        >
            <div>
                <h2 className="text-lg font-bold text-white">إضافة درس بفيديو</h2>
                <p className="text-xs text-slate-500 mt-1">
                    ارفع فيديو، وحدد اختباراً اختيارياً يُفتح بعد مشاهدة الدرس.
                </p>
            </div>

            {error && (
                <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3">
                    {success}
                </p>
            )}

            <label className="block space-y-1.5 text-sm">
                <span className="text-slate-300 font-medium">الدورة</span>
                <select name="courseId" required className={field}>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.title}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block space-y-1.5 text-sm">
                <span className="text-slate-300 font-medium">عنوان الدرس</span>
                <input
                    name="title"
                    required
                    className={field}
                    placeholder="مثال: مقدمة قواعد البيانات"
                />
            </label>

            <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300 font-medium">الترتيب</span>
                    <input
                        name="order"
                        type="number"
                        min={1}
                        defaultValue={1}
                        className={field}
                    />
                </label>
                <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300 font-medium">المدة</span>
                    <input name="duration" defaultValue="10 دقائق" className={field} />
                </label>
            </div>

            <label className="block space-y-1.5 text-sm">
                <span className="text-slate-300 font-medium">ملاحظات / محتوى نصي (اختياري)</span>
                <textarea name="content" rows={3} className={`${field} resize-y`} />
            </label>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setUseLink(false)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${!useLink
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-800 text-slate-400'
                        }`}
                >
                    رفع ملف
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setUseLink(true);
                        clearFile();
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${useLink
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-800 text-slate-400'
                        }`}
                >
                    رابط فيديو
                </button>
            </div>

            {!useLink ? (
                <div>
                    <input
                        ref={inputRef}
                        name="videoFile"
                        type="file"
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                    />
                    {!file ? (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragOver(false);
                                pickFile(e.dataTransfer.files?.[0] ?? null);
                            }}
                            className={`w-full rounded-2xl border border-dashed px-6 py-10 text-center transition ${dragOver
                                    ? 'border-indigo-400 bg-indigo-500/10'
                                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                                }`}
                        >
                            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                                <Upload className="w-6 h-6" />
                            </span>
                            <span className="block font-bold text-slate-100">
                                اسحب الفيديو هنا أو اضغط للاختيار
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                                MP4 أو WebM · حتى 100 م.ب
                            </span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                                <Film className="w-5 h-5" />
                            </span>
                            <span className="min-w-0 flex-1 text-right">
                                <span className="block truncate text-sm font-bold text-white">
                                    {file.name}
                                </span>
                                <span className="block text-xs text-slate-500">
                                    {formatSize(file.size)} · جاهز للرفع
                                </span>
                            </span>
                            <button
                                type="button"
                                onClick={clearFile}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                                aria-label="إزالة الملف"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300 font-medium flex items-center gap-2">
                        <Link2 className="w-4 h-4" /> رابط الفيديو
                    </span>
                    <input
                        name="videoUrl"
                        required={useLink}
                        placeholder="https://... أو /videos/lesson.mp4"
                        className={field}
                    />
                </label>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-4">
                <div>
                    <h3 className="font-bold text-sm text-white">اختبار الدرس (اختياري)</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        إن تركت السؤال فارغاً يُحفظ الدرس بدون اختبار.
                    </p>
                </div>

                <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300 font-medium">سؤال الاختبار</span>
                    <input
                        name="quizQuestion"
                        placeholder="مثال: ما الذي يميز قواعد البيانات العلائقية؟"
                        className={field}
                    />
                </label>

                <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300 font-medium">
                        الخيارات (كل خيار في سطر)
                    </span>
                    <textarea
                        name="quizOptions"
                        rows={4}
                        placeholder={
                            'تخزين البيانات في جداول مترابطة\nتخزين الصور فقط\nتشغيل الواجهات الأمامية'
                        }
                        className={`${field} resize-y min-h-[100px]`}
                    />
                </label>

                <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300 font-medium">
                        رقم الإجابة الصحيحة
                    </span>
                    <input
                        name="quizCorrect"
                        type="number"
                        min={0}
                        defaultValue={0}
                        className={field}
                    />
                    <span className="text-xs text-slate-500">
                        0 = الخيار الأول، 1 = الثاني، 2 = الثالث...
                    </span>
                </label>
            </div>

            <button
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl"
            >
                {loading ? 'جاري رفع الدرس...' : 'حفظ الدرس'}
            </button>
        </form>
    );
}