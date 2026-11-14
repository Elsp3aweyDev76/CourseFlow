'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, GraduationCap, BookOpen, Shield } from 'lucide-react';
import { signupAction, AuthState } from '@/app/actions/auth';

const initialState: AuthState = {};

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<'student' | 'instructor' | 'admin'>('student');
    const [state, formAction, isPending] = useActionState(signupAction, initialState);

    useEffect(() => {
        if (state.success && state.role) {
            const userRole = state.role.toLowerCase();
            if (userRole === 'admin') {
                router.push('/admin');
            } else if (userRole === 'instructor') {
                router.push('/instructor');
            } else {
                router.push('/student');
            }
        }
    }, [state, router]);

    return (
        <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-6" dir="rtl">
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                        CF
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">إنشاء حساب جديد</h1>
                    <p className="text-xs text-slate-500">انضم إلى منصة CourseFlow وابدأ رحلتك</p>
                </div>

                {state?.error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center font-medium">
                        {state.error}
                    </div>
                )}

                {/* Form */}
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="role" value={role} />

                    {/* Role Selector Tabs (طالب، محاضر، مسؤول) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">اختر نوع الحساب (الدور)</label>
                        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>طالب</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('instructor')}
                                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${role === 'instructor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>محاضر</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${role === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <Shield className="w-4 h-4" />
                                <span>مسؤول</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">الاسم الكامل</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="أدخل اسمك الكامل"
                                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-sm"
                            />
                            <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">البريد الإلكتروني</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="name@example.com"
                                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-sm"
                            />
                            <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-sm"
                            />
                            <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all text-sm mt-2 disabled:opacity-50"
                    >
                        <span>{isPending ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب (Sign Up)'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Link to Login */}
                <div className="text-center pt-2 border-t border-slate-100">
                    <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all">
                        لديك حساب بالفعل؟ <span className="text-indigo-600 underline">سجل دخولك</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}