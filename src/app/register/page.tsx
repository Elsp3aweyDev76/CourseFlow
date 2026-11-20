'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { registerAction } from '@/app/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await registerAction(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/');
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white">إنشاء حساب طالب جديد</h1>
          <p className="text-xs text-slate-400">انضم إلى المنصة وابدأ رحلتك التعليمية الآن</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold p-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">الاسم الكامل</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-500 absolute right-3.5 top-3.5" />
              <input
                name="name"
                type="text"
                required
                placeholder="أدخل اسمك الكامل"
                className="w-full pr-11 pl-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute right-3.5 top-3.5" />
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pr-11 pl-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute right-3.5 top-3.5" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full pr-11 pl-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all text-sm mt-2 disabled:opacity-50"
          >
            <span>{isPending ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition-all">
            لديك حساب بالفعل؟ <span className="text-indigo-400 underline">سجل دخولك</span>
          </Link>
        </div>
      </div>
    </div>
  );
}