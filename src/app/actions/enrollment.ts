'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function enrollInCourse(courseId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: 'يجب تسجيل الدخول أولاً للتسجيل في الدورة' };
    }

    const userId = session.userId;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existingEnrollment) {
      return { success: true, message: 'أنت مسجل بالفعل في هذه الدورة' };
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, published: true },
      select: { id: true },
    });
    if (!course) return { error: 'الدورة غير موجودة أو غير متاحة' };

    await prisma.enrollment.create({ data: { userId, courseId } });

    revalidatePath(`/student/courses/${courseId}`);
    revalidatePath('/student');
    revalidatePath('/courses');

    return { success: true, message: 'تم التسجيل في الدورة بنجاح!' };
  } catch (error) {
    console.error('Enrollment error:', error);
    return { error: 'حدث خطأ أثناء محاولة التسجيل في الدورة' };
  }
}