'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginAction, AuthState } from '@/app/actions/auth';

const initialState: AuthState = {};

export default function LoginPage() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

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
                    <h1 className="text-2xl font-black text-slate-900">مرحباً بك مجدداً</h1>
                    <p className="text-xs text-slate-500">سجل الدخول للمتابعة إلى لوحة التحكم الخاصة بك</p>
                </div>

                {state?.error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center font-medium">
                        {state.error}
                    </div>
                )}

                {/* Form */}
                <form action={formAction} className="space-y-4">
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
                        <span>{isPending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Link to Signup */}
                <div className="text-center pt-2 border-t border-slate-100">
                    <Link href="/signup" className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all">
                        ليس لديك حساب؟ <span className="text-indigo-600 underline">إنشاء حساب جديد (Sign Up)</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}