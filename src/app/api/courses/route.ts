import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// جلب جميع الدورات من قاعدة البيانات
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { name: true, email: true },
        },
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'فشل في جلب الدورات' }, { status: 500 });
  }
}

// إنشاء دورة تدريبية جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, instructorEmail } = body;

    if (!title) {
      return NextResponse.json({ error: 'عنوان الدورة مطلوب' }, { status: 400 });
    }

    // البحث عن المحاضر (نستخدم المحاضر الافتراضي إذا لم يُمرر بريد)
    const instructor = await prisma.user.findFirst({
      where: {
        email: instructorEmail || 'ahmed@courseflow.com',
        role: 'INSTRUCTOR',
      },
    });

    if (!instructor) {
      return NextResponse.json({ error: 'لم يتم العثور على حساب المحاضر' }, { status: 404 });
    }

    // تنظيف السعر وتحويله لرقم
    const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

    const newCourse = await prisma.course.create({
      data: {
        title,
        description: description || 'وصف الدورة التدريبية الشاملة',
        price: numericPrice,
        published: false, // تبدأ كمسودة بانتظار موافقة المسؤول
        imageBg: 'from-indigo-500 to-violet-600',
        instructorId: instructor.id,
      },
      include: {
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الدورة' }, { status: 500 });
  }
}