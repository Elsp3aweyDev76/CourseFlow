import { redirect } from 'next/navigation';
import { getLessonPlayerData } from '@/app/actions/progress';
import LessonPlayerClient from '../[lessonId]/LessonPlayerClient';

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const data = await getLessonPlayerData(courseId, lessonId);

  if ('error' in data && data.error !== 'LOCKED') {
    if (data.error === 'UNAUTHORIZED') redirect('/login');
    redirect('/student');
  }

  if ('error' in data && data.error === 'LOCKED') {
    return (
      <LessonPlayerClient
        courseId={courseId}
        courseTitle={data.course?.title || ''}
        lessons={data.lessons || []}
        activeLessonId={lessonId}
        lockedReason={data.reason || 'الدرس مقفل'}
        enrollmentProgress={0}
      />
    );
  }

  if (!('success' in data)) redirect('/student');

  return (
    <LessonPlayerClient
      courseId={data.course.id}
      courseTitle={data.course.title}
      lessons={data.lessons}
      activeLessonId={data.activeLesson.id}
      lockedReason={null}
      enrollmentProgress={data.enrollmentProgress}
    />
  );
}