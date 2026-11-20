'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Mail, ArrowLeft } from 'lucide-react';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // router.push('/');
      // router.refresh();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white">تسجيل الدخول</h1>
          <p className="text-xs text-slate-400">سجل الدخول للمتابعة إلى منصة CourseFlow</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold p-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</span>
            {!loading && <ArrowLeft className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="text-indigo-400 font-bold hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </div>
      </div>
    </div>
  );
}