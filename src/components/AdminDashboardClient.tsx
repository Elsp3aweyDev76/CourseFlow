'use client';

import React, { useState, useTransition } from 'react';
import {
    Shield,
    Users,
    BookOpen,
    GraduationCap,
    Trash2,
    Search,
    AlertCircle,
} from 'lucide-react';
import {
    updateUserRoleAction,
    deleteUserAction,
} from '@/app/actions/admin';

export type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | string;
    createdAt: string;
};

type Stats = {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
};

const ROLE_LABELS: Record<string, string> = {
    STUDENT: 'طالب',
    INSTRUCTOR: 'محاضر',
    ADMIN: 'مسؤول',
    student: 'طالب',
    instructor: 'محاضر',
    admin: 'مسؤول',
};

const ROLE_BADGE: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    INSTRUCTOR: 'bg-indigo-100 text-indigo-700',
    STUDENT: 'bg-slate-200 text-slate-700',
    admin: 'bg-purple-100 text-purple-700',
    instructor: 'bg-indigo-100 text-indigo-700',
    student: 'bg-slate-200 text-slate-700',
};

function normalizeRole(role: string): 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' {
    const r = role.toUpperCase();
    if (r === 'ADMIN') return 'ADMIN';
    if (r === 'INSTRUCTOR') return 'INSTRUCTOR';
    return 'STUDENT';
}

export default function AdminDashboardClient({
    initialUsers,
    stats,
}: {
    initialUsers: AdminUser[];
    stats: Stats;
}) {
    const [users, setUsers] = useState<AdminUser[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleDeleteUser = (userId: string, userName: string) => {
        const isConfirmed = window.confirm(
            `هل أنت متأكد من حذف المستخدم «${userName}» نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`
        );
        if (!isConfirmed) return;

        setLoadingId(userId);
        startTransition(async () => {
            const res = await deleteUserAction(userId);
            setLoadingId(null);

            if (res?.error) {
                showMessage('error', res.error);
                return;
            }

            setUsers((prev) => prev.filter((u) => u.id !== userId));
            showMessage('success', 'تم حذف المستخدم بنجاح.');
        });
    };

    const handleRoleChange = (userId: string, newRole: string) => {
        const previousUsers = users;

        // تحديث فوري للواجهة
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, role: normalizeRole(newRole) } : u
            )
        );

        startTransition(async () => {
            const res = await updateUserRoleAction(userId, newRole);

            if (res?.error) {
                // التراجع عند الفشل
                setUsers(previousUsers);
                showMessage('error', res.error);
                return;
            }

            showMessage('success', 'تم تحديث دور المستخدم بنجاح.');
        });
    };

    const filteredUsers = users.filter(
        (user) =>
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
                            <p className="text-slate-500 text-sm mt-1">
                                إدارة شاملة للمستخدمين، الصلاحيات، ومتابعة إحصائيات المنصة
                            </p>
                        </div>
                    </div>
                </div>

                {/* رسائل النجاح/الفشل */}
                {message && (
                    <div
                        className={`p-4 rounded-2xl text-sm font-bold border ${message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* بطاقات الإحصائيات */}
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

                {/* قسم إدارة المستخدمين */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">إدارة حسابات المستخدمين</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                التحكم في أدوار الصلاحيات ({users.length} مستخدم)
                            </p>
                        </div>

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

                    <div className="space-y-3">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => {
                                const roleKey = normalizeRole(user.role);
                                return (
                                    <div
                                        key={user.id}
                                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-all gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${ROLE_BADGE[roleKey] || ROLE_BADGE.STUDENT
                                                        }`}
                                                >
                                                    {ROLE_LABELS[roleKey] || roleKey}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                            <select
                                                value={roleKey}
                                                disabled={isPending || loadingId === user.id}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm disabled:opacity-50"
                                            >
                                                <option value="STUDENT">طالب</option>
                                                <option value="INSTRUCTOR">محاضر</option>
                                                <option value="ADMIN">مسؤول</option>
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                disabled={loadingId === user.id || isPending}
                                                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                                title="حذف المستخدم"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 space-y-2">
                                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                                <p className="text-sm font-bold text-slate-600">
                                    {searchQuery ? 'لا توجد نتائج مطابقة لبحثك' : 'لا يوجد مستخدمون بعد'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}