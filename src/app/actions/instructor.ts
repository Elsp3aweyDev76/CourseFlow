'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function createCourseAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: 'يرجى تسجيل الدخول أولاً' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return { error: 'عذراً، هذه الصلاحية متاحة للمحاضرين فقط' };
    }

    const title = (formData.get('title') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const category = (formData.get('category') as string) || 'برمجة وتطوير';
    const level = (formData.get('level') as string) || 'مبتدئ';
    const price = parseFloat(formData.get('price') as string) || 0;

    if (!title || !description) {
      return { error: 'يرجى إدخال عنوان الدورة ووصفها' };
    }

    let imagePath: string | null =
      (formData.get('imageUrl') as string)?.trim() || null;
    const imageFile = formData.get('imageFile') as File | null;

    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return { error: 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)' };
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت' };
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'courses');
      await mkdir(uploadDir, { recursive: true });

      const ext = path.extname(imageFile.name) || '.jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      await writeFile(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/courses/${fileName}`;
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level,
        price,
        image: imagePath,
        instructorId: user.id,
        published: true,
      },
    });

    revalidatePath('/courses');
    revalidatePath('/instructor');
    revalidatePath('/admin');

    return { success: true, courseId: course.id };
  } catch (error) {
    console.error('Create course error:', error);
    return { error: 'حدث خطأ أثناء إنشاء الدورة، يرجى المحاولة لاحقاً' };
  }
}

export async function createLessonAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: 'يرجى تسجيل الدخول أولاً' };
  }

  try {
    const courseId = (formData.get('courseId') as string)?.trim();
    const title = (formData.get('title') as string)?.trim();
    const duration =
      (formData.get('duration') as string)?.trim() || '10 دقائق';
    const order = parseInt(formData.get('order') as string, 10) || 1;
    const content = (formData.get('content') as string)?.trim() || null;

    if (!courseId || !title) {
      return { error: 'يرجى اختيار الدورة وإدخال عنوان الدرس' };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, role: true },
    });

    if (
      !course ||
      !user ||
      (course.instructorId !== user.id && user.role !== 'ADMIN')
    ) {
      return { error: 'لا تملك صلاحية إضافة دروس لهذه الدورة' };
    }

    let finalVideoUrl: string | null =
      (formData.get('videoUrl') as string)?.trim() || null;
    const videoFile = formData.get('videoFile') as File | null;

    if (videoFile && videoFile.size > 0) {
      if (!videoFile.type.startsWith('video/')) {
        return { error: 'يرجى اختيار ملف فيديو صالح (MP4, WebM)' };
      }

      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
      await mkdir(uploadDir, { recursive: true });

      const ext = path.extname(videoFile.name) || '.mp4';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      await writeFile(path.join(uploadDir, fileName), buffer);
      finalVideoUrl = `/uploads/videos/${fileName}`;
    }

    if (!finalVideoUrl) {
      return { error: 'يرجى رفع ملف فيديو أو إدخال رابط الفيديو' };
    }

    const quizQuestion =
      (formData.get('quizQuestion') as string)?.trim() || null;
    const quizOptionsRaw =
      (formData.get('quizOptions') as string)?.trim() || '';
    const quizCorrectRaw = formData.get('quizCorrect') as string;

    let quizOptions: string | null = null;
    let quizCorrect: number | null = null;

    if (quizQuestion) {
      const options = quizOptionsRaw
        .split('\n')
        .map((o) => o.trim())
        .filter(Boolean);

      if (options.length < 2) {
        return {
          error: 'أدخل خيارين على الأقل للاختبار (كل خيار في سطر)',
        };
      }

      const correct = parseInt(quizCorrectRaw, 10);
      if (
        Number.isNaN(correct) ||
        correct < 0 ||
        correct >= options.length
      ) {
        return {
          error: 'رقم الإجابة الصحيحة غير صالح (0 للخيار الأول، 1 للثاني...)',
        };
      }

      quizOptions = JSON.stringify(options);
      quizCorrect = correct;
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl: finalVideoUrl,
        duration,
        order,
        courseId,
        quizQuestion,
        quizOptions,
        quizCorrect,
      },
    });

    revalidatePath('/instructor');
    revalidatePath('/courses');
    revalidatePath(`/student/courses/${courseId}/lessons/${lesson.id}`);

    return { success: true, lessonId: lesson.id };
  } catch (error) {
    console.error('Create lesson error:', error);
    return { error: 'حدث خطأ أثناء رفع الدرس، يرجى المحاولة مرة أخرى' };
  }
}