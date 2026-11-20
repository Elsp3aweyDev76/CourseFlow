// import Link from 'next/link';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { GraduationCap, LogOut, LayoutDashboard, Shield, BookOpen, Home } from 'lucide-react';

// // Server Action لتسجيل الخروج وحذف الكوكيز الخاصة بالمستخدم
// async function logoutAction() {
//     'use server';
//     const cookieStore = await cookies();
//     cookieStore.delete('courseflow_token');
//     cookieStore.delete('userId');
//     cookieStore.delete('courseflow_role');
//     redirect('/login');
// }

// export default async function ServerNavbar() {
//     const cookieStore = await cookies();
//     const initialToken = cookieStore.get('courseflow_token')?.value || cookieStore.get('userId')?.value;
//     const role = cookieStore.get('courseflow_role')?.value;

//     return (
//         <header className="w-full bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md" dir="rtl">

//             {/* الشعار وروابط التنقل الأساسية */}
//             <div className="flex items-center gap-8">
//                 <Link href="/" className="flex items-center gap-2.5 group">
//                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:bg-indigo-500 transition-all">
//                         <GraduationCap className="w-6 h-6" />
//                     </div>
//                     <span className="font-black text-lg text-white tracking-wide">CourseFlow</span>
//                 </Link>

//                 <nav className="hidden md:flex items-center gap-6">
//                     <Link
//                         href="/"
//                         className="text-sm font-bold text-slate-300 hover:text-indigo-400 transition-all flex items-center gap-1.5"
//                     >
//                         <Home className="w-4 h-4" />
//                         الرئيسية
//                     </Link>

//                     <Link
//                         href="/student/courses"
//                         className="text-sm font-bold text-slate-300 hover:text-indigo-400 transition-all flex items-center gap-1.5"
//                     >
//                         <BookOpen className="w-4 h-4" />
//                         تصفح الدورات
//                     </Link>

//                     {initialToken && (
//                         <Link
//                             href="/student"
//                             className="text-sm font-bold text-slate-300 hover:text-indigo-400 transition-all flex items-center gap-1.5"
//                         >
//                             <LayoutDashboard className="w-4 h-4" />
//                             لوحة التحكم
//                         </Link>
//                     )}

//                     {role === 'admin' && (
//                         <Link
//                             href="/admin"
//                             className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl"
//                         >
//                             <Shield className="w-4 h-4" />
//                             لوحة المسؤول
//                         </Link>
//                     )}
//                 </nav>
//             </div>

//             {/* أزرار المصادقة (دخول للزوار / خروج للمسجلين) */}
//             <div className="flex items-center gap-3">
//                 {!initialToken ? (
//                     <Link
//                         href="/login"
//                         className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
//                     >
//                         تسجيل الدخول
//                     </Link>
//                 ) : (
//                     <form action={logoutAction}>
//                         <button
//                             type="submit"
//                             className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold px-4 py-2.5 rounded-xl transition-all text-sm cursor-pointer"
//                         >
//                             <LogOut className="w-4 h-4" />
//                             <span>تسجيل الخروج</span>
//                         </button>
//                     </form>
//                 )}
//             </div>

//         </header>
//     );
// }