'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

type PaymentInput = {
  courseId: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

/**
 * معالجة الدفع ثم التسجيل في الدورة
 * - الدورات المجانية: تسجيل مباشر
 * - الدورات المدفوعة: محاكاة دفع ثم تسجيل
 */
export async function processPaymentAndEnroll(input: PaymentInput) {
  const session = await getSession();
  if (!session) {
    return { error: 'يجب تسجيل الدخول أولاً' };
  }

  const { courseId, cardHolder, cardNumber, expiry, cvv } = input;

  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId, published: true },
      select: { id: true, title: true, price: true },
    });

    if (!course) {
      return { error: 'الدورة غير موجودة أو غير متاحة' };
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.userId,
          courseId,
        },
      },
    });

    if (existing) {
      return { success: true, message: 'أنت مسجل بالفعل في هذه الدورة', alreadyEnrolled: true };
    }

    const price = course.price ?? 0;

    // دورة مدفوعة: التحقق من بيانات البطاقة (محاكاة)
    if (price > 0) {
      const cleanCard = (cardNumber || '').replace(/\s+/g, '');

      if (!cardHolder?.trim()) {
        return { error: 'يرجى إدخال اسم حامل البطاقة' };
      }
      if (!/^\d{16}$/.test(cleanCard)) {
        return { error: 'رقم البطاقة يجب أن يكون 16 رقماً' };
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry || '')) {
        return { error: 'تاريخ الانتهاء بصيغة MM/YY' };
      }
      if (!/^\d{3,4}$/.test(cvv || '')) {
        return { error: 'رمز CVV غير صالح' };
      }

      // أي بطاقة تنتهي بـ 0000 تُرفض (للتجربة)
      if (cleanCard.endsWith('0000')) {
        return { error: 'تم رفض البطاقة. جرّب بطاقة أخرى.' };
      }

      // محاكاة تأخير بوابة الدفع
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    await prisma.enrollment.create({
      data: {
        userId: session.userId,
        courseId,
        progress: 0,
      },
    });

    revalidatePath(`/student/courses/${courseId}`);
    revalidatePath('/student');
    revalidatePath('/courses');

    const message =
      price > 0
        ? `تم الدفع بنجاح (${price}$) والتسجيل في «${course.title}»`
        : `تم التسجيل في «${course.title}» بنجاح`;

    return {
      success: true,
      message,
      paid: price > 0,
      amount: price,
    };
  } catch (error) {
    console.error('processPaymentAndEnroll error:', error);
    return { error: 'حدث خطأ أثناء معالجة الدفع أو التسجيل' };
  }
}