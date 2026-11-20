'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LogOut, GraduationCap, LayoutDashboard, UserCheck, ShieldCheck } from 'lucide-react';

export interface NavbarContentProps {
    initialToken?: string;
    role?: string;
    logoutAction: () => Promise<void>;
}

export default function NavbarContent({ initialToken, role, logoutAction }: NavbarContentProps) {
    const pathname = usePathname();

    // إخفاء الروابط الجانبية في صفحات تسجيل الدخول وإنشاء الحساب
    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
        return (
            <header className="w-full py-6 px-8 flex justify-center items-center bg-white border-b border-slate-100" dir="rtl">
                <Link href="/" className="flex items-center gap-2.5 font-black text-xl text-slate-900">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <span>CourseFlow</span>
                </Link>
            </header>
        );
    }

    // توحيد الحروف لتلافي مشاكل اختلاف الأحرف (مثل admin أو ADMIN)
    const userRole = role?.toLowerCase();

    return (
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs" dir="rtl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* الشعار */}
                <Link href="/" className="flex items-center gap-2.5 font-black text-xl text-slate-900">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <span>CourseFlow</span>
                </Link>

                {/* روابط التنقل الرئيسية */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className={`text-sm font-bold transition-all ${pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                            }`}
                    >
                        الرئيسية
                    </Link>

                    {/* تصفح الدورات (عام للجميع) */}
                    <Link
                        href="/courses"
                        className={`text-sm font-bold transition-all flex items-center gap-1.5 ${pathname.startsWith('/courses') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>تصفح الدورات</span>
                    </Link>

                    {/* لوحة تحكم الطالب (تظهر بناءً على المجلد student/) */}
                    {initialToken && userRole === 'student' && (
                        <Link
                            href="/student"
                            className={`text-sm font-bold transition-all flex items-center gap-1.5 ${pathname.startsWith('/student') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>لوحة الطالب</span>
                        </Link>
                    )}

                    {/* لوحة تحكم المحاضر (تظهر بناءً على المجلد instructor/) */}
                    {initialToken && userRole === 'instructor' && (
                        <Link
                            href="/instructor"
                            className={`text-sm font-bold transition-all flex items-center gap-1.5 ${pathname.startsWith('/instructor') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                                }`}
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>لوحة المحاضر</span>
                        </Link>
                    )}

                    {/* لوحة الإدارة (تظهر بناءً على المجلد admin/) */}
                    {initialToken && userRole === 'admin' && (
                        <Link
                            href="/admin"
                            className={`text-sm font-bold transition-all flex items-center gap-1.5 ${pathname.startsWith('/admin') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                                }`}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>لوحة الإدارة</span>
                        </Link>
                    )}
                </nav>

                {/* أزرار المصادقة (تسجيل الدخول / تسجيل الخروج) */}
                <div className="flex items-center gap-4">
                    {!initialToken ? (
                        <Link
                            href="/login"
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                        >
                            تسجيل الدخول
                        </Link>
                    ) : (
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold px-4 py-2.5 rounded-xl transition-all text-sm cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </header>
    );
}