import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import Link from "next/link";
import { ArrowRight, PlaySquare, Award } from "lucide-react";
import { Suspense } from "react";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// دالة لتحويل روابط يوتيوب العادية إلى روابط Embed قابلة للتشغيل الحقيقي
function getValidEmbedUrl(url: string | null) {
  if (!url) {
    return "https://www.youtube.com/embed/ZVnjOPwW4ZA"; // فيديو افتراضي للتأكد من التشغيل
  }
  if (url.includes("youtube.com/embed/")) {
    return url;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
}

// المكون الداخلي لجلب البيانات وعرض محتوى الدرس والفيديو
async function LessonPlayerContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      course: {
        include: { lessons: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  if (!lesson) {
    return <div className="p-8 text-center font-bold text-slate-700" dir="rtl">الدرس غير موجود.</div>;
  }

  const videoSrc = getValidEmbedUrl(lesson.videoUrl);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col" dir="rtl">
      {/* شريط علوي للمشغل */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href={`/courses/${lesson.courseId}`} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm transition-all">
          <ArrowRight className="w-4 h-4" />
          <span>العودة لتفاصيل الدورة</span>
        </Link>
        <span className="font-bold text-sm text-slate-300">{lesson.course.title}</span>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4">
        {/* منطقة عرض الفيديو والمحتوى */}
        <div className="lg:col-span-3 p-6 md:p-10 flex flex-col justify-center space-y-6">
          <div className="w-full aspect-video bg-black rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl relative">
            <iframe
              src={videoSrc}
              title={lesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black">{lesson.title}</h1>
              <p className="text-slate-400 text-sm mt-2">{lesson.content || "شاهد الدرس بعناية لتطبيق المفاهيم العملية."}</p>
            </div>

            {/* بطاقة شهادة الإتمام (من تصميمك) */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-indigo-400" />
                <div>
                  <h4 className="font-bold text-white text-sm">شهادة الإتمام</h4>
                  <p className="text-xs text-slate-400">تفتح فور إكمال كافة الدروس بنجاح</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* القائمة الجانبية للدروس */}
        <div className="bg-slate-950 border-t lg:border-t-0 lg:border-r border-slate-800 p-6 space-y-4">
          <h3 className="font-black text-sm text-slate-300">محتويات الدورة</h3>
          <div className="space-y-2">
            {lesson.course.lessons.map((l, index) => (
              <Link
                key={l.id}
                href={`/lessons/${l.id}`}
                className={`flex items-center gap-3 p-3 rounded-2xl text-xs font-bold transition-all ${l.id === lesson.id ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                  }`}
              >
                <span>{index + 1}.</span>
                <span className="line-clamp-1">{l.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// المكون الرئيسي مغلف بـ Suspense لحل مشاكل الـ Prerendering
export default function LessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-bold" dir="rtl">جاري تحميل الدرس...</div>}>
      <LessonPlayerContent params={params} />
    </Suspense>
  );
}