import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// حذف دورة تدريبية
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف الدورة بنجاح' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'فشل في حذف الدورة' }, { status: 500 });
  }
}

// تحديث حالة الدورة (موافقة المسؤول / نشر)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        published: body.published,
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'فشل في تحديث حالة الدورة' }, { status: 500 });
  }
}