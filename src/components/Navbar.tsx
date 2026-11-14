"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, GraduationCap, Shield, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';

interface NavbarProps {
    initialToken: string | null;
    initialRole: string | null;
}

export default function Navbar({ initialToken, initialRole }: NavbarProps) {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            // 1. حذف الكوكيز الآمنة من جهة السيرفر
            await logoutAction();
            // 2. إعادة توجيه فورية إلى الصفحة الرئيسية كزائر عادي مع مسح الذاكرة المؤقتة
            window.location.href = '/';
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // إخفاء الـ Navbar بالكامل في صفحة تسجيل الدخول، إنشاء الحساب، أو مشغل الدروس
    if (pathname === '/login' || pathname === '/signup' || pathname?.includes('/lessons/')) {
        return null;
    }

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm" dir="rtl">
            {/* الشعار */}
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                        CF
                    </div>
                    <span className="text-xl font-black text-slate-900">CourseFlow</span>
                </Link>
            </div>

            {/* روابط التنقل الديناميكية */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
                <Link href="/" className="hover:text-indigo-600 transition-all">الرئيسية</Link>
                <Link href="/courses" className="hover:text-indigo-600 transition-all">تصفح الدورات</Link>

                {/* إظهار لوحة التحكم الخاصة بدور المستخدم المسجل فقط دون غيرها */}
                {initialToken && initialRole === 'student' && (
                    <Link href="/student" className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3.5 py-2 rounded-xl transition-all">
                        <GraduationCap className="w-4 h-4" />
                        <span>لوحة الطالب</span>
                    </Link>
                )}

                {initialToken && initialRole === 'instructor' && (
                    <Link href="/instructor" className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3.5 py-2 rounded-xl transition-all">
                        <BookOpen className="w-4 h-4" />
                        <span>لوحة المحاضر</span>
                    </Link>
                )}

                {initialToken && initialRole === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-1.5 text-purple-600 bg-purple-50 px-3.5 py-2 rounded-xl transition-all">
                        <Shield className="w-4 h-4" />
                        <span>لوحة المسؤول</span>
                    </Link>
                )}
            </nav>

            {/* أزرار المصادقة (دخول للزوار / خروج للمسجلين) */}
            <div className="flex items-center gap-3">
                {!initialToken ? (
                    <Link href="/login" className="px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-sm transition-all">
                        تسجيل الدخول
                    </Link>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2.5 rounded-xl transition-all text-sm cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                    </button>
                )}
            </div>
        </header>
    );
}