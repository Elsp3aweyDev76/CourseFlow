'use client';

import React, { useState } from 'react';
import {
    Shield,
    Users,
    BookOpen,
    GraduationCap,
    Trash2,
    Search,
    UserCheck,
    AlertCircle
} from 'lucide-react';

// مثال لبيانات المستخدمين (يمكنك استبدالها ببيانات حقيقية تأتي من الـ Props أو السيرفر)
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'instructor' | 'student';
    status: 'نشط' | 'معلق' | 'محظور';
}

interface AdminDashboardProps {
    initialUsers?: User[];
    stats?: {
        totalUsers: number;
        totalCourses: number;
        totalEnrollments: number;
    };
}

export default function AdminDashboard({
    initialUsers = [
        { id: '1', name: 'أحمد الإسناوي', email: 'elsp3awey@courseflow.com', role: 'admin', status: 'نشط' },
        { id: '2', name: 'محمد علي', email: 'mohamed@courseflow.com', role: 'instructor', status: 'نشط' },
        { id: '3', name: 'سارة خالد', email: 'sara@courseflow.com', role: 'student', status: 'معلق' },
    ],
    stats = { totalUsers: 125, totalCourses: 14, totalEnrollments: 340 }
}: AdminDashboardProps) {

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // دالة متقدمة لحذف المستخدم مع تأكيد
    const handleDeleteUser = async (userId: string) => {
        const isConfirmed = window.confirm("هل أنت متأكد من رغبتك في حذف هذا المستخدم نهائياً؟");
        if (!isConfirmed) return;

        setLoadingId(userId);
        try {
            // هنا يمكنك استدعاء السيرفر أكشن الفعلي لحذف المستخدم من قاعدة البيانات
            // await deleteUserAction(userId);

            // تحديث الحالة المحلية لإزالة المستخدم فوراً من الواجهة
            setUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (error) {
            console.error("فشل حذف المستخدم:", error);
            alert("حدث خطأ أثناء محاولة الحذف.");
        } finally {
            setLoadingId(null);
        }
    };

    // دالة تغيير دور المستخدم
    const handleRoleChange = async (userId: string, newRole: 'admin' | 'instructor' | 'student') => {
        setUsers((prev) =>
            prev.map((user) => user.id === userId ? { ...user, role: newRole } : user)
        );
        // استدعاء السيرفر أكشن لتحديث الدور في قاعدة البيانات
        // await updateUserRoleAction(userId, newRole);
    };

    // تصفية المستخدمين بناءً على البحث
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 md:px-12" dir="rtl">
            <main className="max-w-7xl mx-auto space-y-8">

                {/* رأس الصفحة */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-inner">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">لوحة تحكم المسؤول</h1>
                            <p className="text-slate-500 text-sm mt-1">إدارة شاملة للمستخدمين، الصلاحيات، ومتابعة إحصائيات المنصة</p>
                        </div>
                    </div>
                </div>

                {/* بطاقات الإحصائيات العامة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold">إجمالي المستخدمين</p>
                            <h3 className="text-2xl font-black text-slate-900">{stats.totalUsers}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold">إجمالي الدورات</p>
                            <h3 className="text-2xl font-black text-slate-900">{stats.totalCourses}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold">إجمالي التسجيلات</p>
                            <h3 className="text-2xl font-black text-slate-900">{stats.totalEnrollments}</h3>
                        </div>
                    </div>
                </div>

                {/* قسم إدارة المستخدمين مع البحث */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">إدارة حسابات المستخدمين</h2>
                            <p className="text-xs text-slate-500 mt-1">التحكم في أدوار الصلاحيات وحالة الحسابات</p>
                        </div>

                        {/* شريط البحث المتقدم */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث بالاسم أو البريد..."
                                className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs bg-slate-50"
                            />
                        </div>
                    </div>

                    {/* قائمة المستخدمين */}
                    <div className="space-y-3">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-all gap-4"
                                >
                                    {/* معلومات المستخدم */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'instructor' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-slate-200 text-slate-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {user.email} | الحالة: <span className="font-bold text-emerald-600">{user.status}</span>
                                        </p>
                                    </div>

                                    {/* إجراءات التعديل والحذف (متوافقة تماماً مع ما ظهر في صورتك) */}
                                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">

                                        {/* تعديل الدور */}
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                                        >
                                            <option value="student">طالب</option>
                                            <option value="instructor">محاضر</option>
                                            <option value="admin">مسؤول</option>
                                        </select>

                                        {/* زر الحذف */}
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={loadingId === user.id}
                                            className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                            title="حذف المستخدم"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 space-y-2">
                                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                                <p className="text-sm font-bold text-slate-600">لا توجد نتائج مطابقة لبحثك</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}