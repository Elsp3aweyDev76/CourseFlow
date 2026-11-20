'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';

/** التحقق من أن المستخدم الحالي مسؤول */
async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role.toUpperCase() !== 'ADMIN') {
    throw new Error('غير مسموح لك بالقيام بهذا الإجراء.');
  }
  return session;
}

/** جلب بيانات لوحة الإدارة (مستخدمين + إحصائيات) */
export async function getAdminDashboardData() {
  await verifyAdmin();

  const [users, totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
  ]);

  return {
    users: users.map((u) => ({
      id: u.id,
      name: u.name || 'بدون اسم',
      email: u.email || '—',
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    })),
    stats: {
      totalUsers,
      totalCourses,
      totalEnrollments,
    },
  };
}

/** تحديث دور مستخدم */
export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  const session = await verifyAdmin();

  // منع المسؤول من تخفيض دوره بنفسه
  if (session.userId === targetUserId && newRole.toUpperCase() !== 'ADMIN') {
    return { error: 'لا يمكنك تغيير دور حسابك الخاص كمسؤول.' };
  }

  const roleMap: Record<string, Role> = {
    student: Role.STUDENT,
    instructor: Role.INSTRUCTOR,
    admin: Role.ADMIN,
    STUDENT: Role.STUDENT,
    INSTRUCTOR: Role.INSTRUCTOR,
    ADMIN: Role.ADMIN,
  };

  const role = roleMap[newRole];
  if (!role) {
    return { error: 'دور غير صالح.' };
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('updateUserRoleAction error:', error);
    return { error: 'فشل تحديث دور المستخدم.' };
  }
}

/** حذف مستخدم */
export async function deleteUserAction(targetUserId: string) {
  const session = await verifyAdmin();

  // منع المسؤول من حذف نفسه
  if (session.userId === targetUserId) {
    return { error: 'لا يمكنك حذف حسابك الخاص.' };
  }

  try {
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('deleteUserAction error:', error);
    return { error: 'فشل حذف المستخدم. قد يكون مرتبطاً ببيانات أخرى.' };
  }
}