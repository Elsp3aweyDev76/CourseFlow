import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import CoursesCatalogClient, { CourseItem } from '@/components/CoursesCatalogClient';

export default async function CoursesPage() {
    const session = await getSession();

    const coursesFromDb = await prisma.course.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: {
            instructor: {
                select: { name: true },
            },
            lessons: {
                orderBy: { order: 'asc' },
                take: 1,
                select: { id: true },
            },
            _count: {
                select: { lessons: true, enrollments: true },
            },
        },
    });

    let enrolledCourseIds: string[] = [];
    if (session?.userId) {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: session.userId },
            select: { courseId: true },
        });
        enrolledCourseIds = enrollments.map((e) => e.courseId);
    }

    const formattedCourses: CourseItem[] = coursesFromDb.map((course) => {
        const extraFields = course as unknown as {
            category?: string;
            level?: string;
            image?: string | null;
        };

        return {
            id: course.id,
            title: course.title,
            description: course.description || 'لا يوجد وصف متاح لهذه الدورة.',
            price: course.price,
            category: extraFields.category || 'برمجة وتطوير',
            level: extraFields.level || 'مبتدئ',
            image: extraFields.image || null,
            instructorName: course.instructor?.name || 'محاضر بالمنصة',
            lessonsCount: course._count.lessons,
            studentsCount: course._count.enrollments,
            firstLessonId: course.lessons[0]?.id || 'lesson-1',
        };
    });

    return (
        <div className="min-h-screen bg-slate-900 text-white py-12 px-6 font-sans" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h1 className="text-3xl font-bold">تصفح الدورات التدريبية</h1>
                    <p className="text-sm text-slate-400">
                        اكتشف أحدث الدورات المضافة من نخبة المحاضرين وابدأ رحلة التعلم
                    </p>
                </div>

                <CoursesCatalogClient
                    initialCourses={formattedCourses}
                    enrolledCourseIds={enrolledCourseIds}
                    isLoggedIn={Boolean(session)}
                />
            </div>
        </div>
    );
}