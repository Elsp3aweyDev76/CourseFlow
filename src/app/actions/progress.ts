'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const WATCH_THRESHOLD = 0.9;

type ProgressRow = {
  id: string;
  userId: string;
  lessonId: string;
  maxWatchedSeconds: number;
  lastTimestamp: number;
  isCompleted: boolean;
  quizPassed: boolean;
};

type LessonRow = {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: string | null;
  order: number;
  content: string | null;
  quizQuestion: string | null;
  quizOptions: string | null;
  quizCorrect: number | null;
};

export async function updateWatchProgress(params: {
  lessonId: string;
  currentTime: number;
  duration: number;
}) {
  const session = await getSession();
  if (!session) return { error: 'يجب تسجيل الدخول' };

  const { lessonId, currentTime, duration } = params;
  if (!lessonId || currentTime < 0) return { error: 'بيانات غير صالحة' };

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, courseId: true, order: true },
    });
    if (!lesson) return { error: 'الدرس غير موجود' };

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.userId,
          courseId: lesson.courseId,
        },
      },
    });
    if (!enrollment) return { error: 'أنت غير مسجل في هذه الدورة' };

    const lockCheck = await canAccessLesson(
      session.userId,
      lesson.courseId,
      lesson.order
    );
    if (!lockCheck.allowed) {
      return { error: lockCheck.reason || 'هذا الدرس مقفل' };
    }

    const existing = (await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId: session.userId, lessonId },
      },
    })) as ProgressRow | null;

    const maxWatched = Math.max(existing?.maxWatchedSeconds ?? 0, currentTime);
    const isVideoComplete =
      duration > 0 && maxWatched >= duration * WATCH_THRESHOLD;

    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId: session.userId, lessonId },
      },
      create: {
        userId: session.userId,
        lessonId,
        maxWatchedSeconds: maxWatched,
        lastTimestamp: currentTime,
        isCompleted: false,
        quizPassed: false,
      },
      update: {
        maxWatchedSeconds: maxWatched,
        lastTimestamp: currentTime,
      },
    });

    return {
      success: true,
      maxWatchedSeconds: maxWatched,
      isVideoComplete,
    };
  } catch (error) {
    console.error('updateWatchProgress error:', error);
    return { error: 'فشل تحديث التقدم' };
  }
}

export async function submitQuizAnswer(params: {
  lessonId: string;
  selectedIndex: number;
}) {
  const session = await getSession();
  if (!session) return { error: 'يجب تسجيل الدخول' };

  const { lessonId, selectedIndex } = params;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        courseId: true,
        order: true,
        quizCorrect: true,
        quizQuestion: true,
      },
    });
    if (!lesson) return { error: 'الدرس غير موجود' };

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.userId,
          courseId: lesson.courseId,
        },
      },
    });
    if (!enrollment) return { error: 'أنت غير مسجل في هذه الدورة' };

    const lockCheck = await canAccessLesson(
      session.userId,
      lesson.courseId,
      lesson.order
    );
    if (!lockCheck.allowed) {
      return { error: lockCheck.reason || 'هذا الدرس مقفل' };
    }

    // بدون اختبار: إكمال الدرس مباشرة
    if (lesson.quizCorrect == null || !lesson.quizQuestion) {
      return completeLessonWithoutQuiz(session.userId, lesson);
    }

    // إنشاء progress إن لم يكن موجوداً (لا يشترط مشاهدة الفيديو)
    let progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId: session.userId, lessonId },
      },
    });

    if (!progress) {
      progress = await prisma.lessonProgress.create({
        data: {
          userId: session.userId,
          lessonId,
          maxWatchedSeconds: 0,
          lastTimestamp: 0,
          isCompleted: false,
          quizPassed: false,
        },
      });
    }

    const passed = selectedIndex === lesson.quizCorrect;
    if (!passed) {
      return {
        success: true,
        passed: false,
        message: 'الإجابة غير صحيحة، حاول مجدداً',
      };
    }

    await prisma.lessonProgress.update({
      where: {
        userId_lessonId: { userId: session.userId, lessonId },
      },
      data: { isCompleted: true, quizPassed: true },
    });

    await recalculateEnrollmentProgress(session.userId, lesson.courseId);

    revalidatePath(`/student/courses/${lesson.courseId}/lessons/${lessonId}`);
    revalidatePath('/student');

    return {
      success: true,
      passed: true,
      message: 'أحسنت! تم اجتياز الاختبار وفتح الدرس التالي',
    };
  } catch (error) {
    console.error('submitQuizAnswer error:', error);
    return { error: 'فشل تسليم الإجابة' };
  }
}

async function completeLessonWithoutQuiz(
  userId: string,
  lesson: { id: string; courseId: string }
) {
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
    create: {
      userId,
      lessonId: lesson.id,
      isCompleted: true,
      quizPassed: true,
      maxWatchedSeconds: 0,
      lastTimestamp: 0,
    },
    update: { isCompleted: true, quizPassed: true },
  });
  await recalculateEnrollmentProgress(userId, lesson.courseId);
  revalidatePath(`/student/courses/${lesson.courseId}/lessons/${lesson.id}`);
  revalidatePath('/student');
  return { success: true, passed: true, message: 'تم إكمال الدرس' };
}

export async function canAccessLesson(
  userId: string,
  courseId: string,
  lessonOrder: number
): Promise<{ allowed: boolean; reason?: string }> {
  if (lessonOrder <= 1) return { allowed: true };

  const previousLesson = await prisma.lesson.findFirst({
    where: { courseId, order: lessonOrder - 1 },
    select: { id: true, title: true },
  });
  if (!previousLesson) return { allowed: true };

  const prevProgress = (await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: { userId, lessonId: previousLesson.id },
    },
  })) as ProgressRow | null;

  if (!prevProgress?.isCompleted) {
    return {
      allowed: false,
      reason: `يجب إكمال الدرس السابق أولاً: «${previousLesson.title}»`,
    };
  }
  return { allowed: true };
}

async function recalculateEnrollmentProgress(
  userId: string,
  courseId: string
) {
  const totalLessons = await prisma.lesson.count({ where: { courseId } });
  if (totalLessons === 0) return;

  const completedCount = await prisma.lessonProgress.count({
    where: {
      userId,
      isCompleted: true,
      lesson: { courseId },
    },
  });

  await prisma.enrollment.updateMany({
    where: { userId, courseId },
    data: {
      progress: Math.round((completedCount / totalLessons) * 100),
    },
  });
}

export async function getLessonPlayerData(
  courseId: string,
  lessonId: string
) {
  const session = await getSession();
  if (!session) return { error: 'UNAUTHORIZED' as const };

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.userId, courseId },
    },
  });
  if (!enrollment) return { error: 'NOT_ENROLLED' as const };

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      lessons: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          videoUrl: true,
          duration: true,
          order: true,
          content: true,
          quizQuestion: true,
          quizOptions: true,
          quizCorrect: true,
        },
      },
    },
  });
  if (!course) return { error: 'NOT_FOUND' as const };

  const lessons = course.lessons as LessonRow[];
  const lessonIds = lessons.map((lesson) => lesson.id);

  const progressRows = (await prisma.lessonProgress.findMany({
    where: {
      userId: session.userId,
      lessonId: { in: lessonIds },
    },
  })) as ProgressRow[];

  const progressMap = new Map(
    progressRows.map((p) => [p.lessonId, p] as const)
  );

  const lessonsWithState = [];

  for (const lesson of lessons) {
    const prog = progressMap.get(lesson.id);
    const lock = await canAccessLesson(
      session.userId,
      courseId,
      lesson.order
    );

    let quizOptions: string[] = [];
    if (lesson.quizOptions) {
      try {
        quizOptions = JSON.parse(lesson.quizOptions) as string[];
      } catch {
        quizOptions = [];
      }
    }

    lessonsWithState.push({
      id: lesson.id,
      title: lesson.title,
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || '10 دقائق',
      order: lesson.order,
      content: lesson.content,
      isCompleted: prog?.isCompleted ?? false,
      isLocked: !lock.allowed,
      maxWatchedSeconds: prog?.maxWatchedSeconds ?? 0,
      lastTimestamp: prog?.lastTimestamp ?? 0,
      quizPassed: prog?.quizPassed ?? false,
      quiz: lesson.quizQuestion
        ? {
            question: lesson.quizQuestion,
            options: quizOptions,
            correct: lesson.quizCorrect ?? 0,
          }
        : null,
    });
  }

  const activeLesson = lessonsWithState.find((l) => l.id === lessonId);
  if (!activeLesson) return { error: 'LESSON_NOT_FOUND' as const };

  if (activeLesson.isLocked) {
    return {
      error: 'LOCKED' as const,
      reason: 'هذا الدرس مقفل. أكمل الدروس السابقة أولاً.',
      course: { id: course.id, title: course.title },
      lessons: lessonsWithState,
    };
  }

  return {
    success: true as const,
    course: { id: course.id, title: course.title },
    lessons: lessonsWithState,
    activeLesson,
    enrollmentProgress: enrollment.progress,
  };
}