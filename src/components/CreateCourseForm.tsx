'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, DollarSign, FileText, Image as ImageIcon, Layers, PlusCircle, Upload, Link2, X } from 'lucide-react';
import { createCourseAction } from '@/app/actions/instructor';

export default function CreateCourseForm() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPending, startTransition] = useTransition();

    // حالة طريقة إدخال الصورة والمعاينة
    const [imageMode, setImageMode] = useState<'file' | 'url'>('file');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setFileName('');
            setPreviewUrl(null);
        }
    };

    const clearImage = () => {
        setPreviewUrl(null);
        setFileName('');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            const res = await createCourseAction(formData);

            if (res?.error) {
                setError(res.error);
            } else {
                setSuccess('تم إنشاء الدورة بنجاح!');
                form.reset();
                clearImage();
                router.refresh();
            }
        });
    };

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl" dir="rtl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center">
                    <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">إضافة دورة تدريبية جديدة</h2>
                    <p className="text-xs text-slate-400">أدخل تفاصيل الدورة الأساسية لتظهر للطلاب على المنصة</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold p-3.5 rounded-2xl">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold p-3.5 rounded-2xl">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* عنوان الدورة */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">عنوان الدورة *</label>
                        <div className="relative">
                            <BookOpen className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder="مثال: احتراف Next.js من الصفر"
                                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600"
                            />
                        </div>
                    </div>

                    {/* السعر */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">السعر (بالدولار - اتركه 0 للمجاني)</label>
                        <div className="relative">
                            <DollarSign className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue="0"
                                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600"
                            />
                        </div>
                    </div>

                    {/* التصنيف */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">التصنيف</label>
                        <div className="relative">
                            <Layers className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                            <select
                                name="category"
                                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600"
                            >
                                <option value="برمجة وتطوير">برمجة وتطوير</option>
                                <option value="تصميم وجرافيك">تصميم وجرافيك</option>
                                <option value="أعمال وتسويق">أعمال وتسويق</option>
                                <option value="ذكاء اصطناعي">ذكاء اصطناعي</option>
                            </select>
                        </div>
                    </div>

                    {/* المستوى */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">المستوى</label>
                        <select
                            name="level"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600"
                        >
                            <option value="مبتدئ">مبتدئ</option>
                            <option value="متوسط">متوسط</option>
                            <option value="متقدم">متقدم</option>
                        </select>
                    </div>
                </div>

                {/* صورة الغلاف (اختيار من الجهاز أو رابط) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">صورة غلاف الدورة (اختياري)</label>
                        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                            <button
                                type="button"
                                onClick={() => {
                                    setImageMode('file');
                                    clearImage();
                                }}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${imageMode === 'file' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>من الجهاز</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setImageMode('url');
                                    clearImage();
                                }}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${imageMode === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Link2 className="w-3.5 h-3.5" />
                                <span>رابط خارجي</span>
                            </button>
                        </div>
                    </div>

                    {imageMode === 'file' ? (
                        <div className="space-y-3">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 hover:border-indigo-600 rounded-2xl bg-slate-900/50 cursor-pointer transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <Upload className="w-7 h-7 text-indigo-400 mb-2" />
                                    <p className="text-xs font-bold text-slate-300">
                                        {fileName ? fileName : 'اضغط هنا لاختيار صورة من جهازك (Browse)'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WebP (بحد أقصى 5MB)</p>
                                </div>
                                <input
                                    name="imageFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            {previewUrl && (
                                <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-slate-700">
                                    <img src={previewUrl} alt="معاينة الغلاف" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-1.5 left-1.5 bg-slate-950/80 hover:bg-rose-600 text-white p-1 rounded-full transition-all"
                                        title="إزالة الصورة"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <ImageIcon className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                            <input
                                name="imageUrl"
                                type="url"
                                placeholder="https://example.com/course-cover.jpg"
                                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600"
                            />
                        </div>
                    )}
                </div>

                {/* وصف الدورة */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">وصف الدورة *</label>
                    <div className="relative">
                        <FileText className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                        <textarea
                            name="description"
                            rows={4}
                            required
                            placeholder="اكتب وصفاً واضحاً لما سيتعلمه الطالب في هذه الدورة..."
                            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm disabled:opacity-50"
                >
                    {isPending ? 'جاري حفظ الدورة...' : 'نشر الدورة الآن'}
                </button>
            </form>
        </div>
    );
}