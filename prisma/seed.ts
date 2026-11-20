import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "CourseFlow@2026";

async function main() {
  console.log("🌱 Starting seeding...");
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

const adminPass = await bcrypt.hash("102030", 12);
const instructorPass = await bcrypt.hash("102030", 12);
const studentPass = await bcrypt.hash("102030", 12);

await prisma.user.upsert({
  where: { email: "admin@courseflow.com" },
  update: { password: adminPass, role: Role.ADMIN },
  create: {
    name: "مدير النظام",
    email: "admin@courseflow.com",
    password: adminPass,
    role: Role.ADMIN,
  },
});

  const instructor = await prisma.user.upsert({
    where: { email: "ahmed@courseflow.com" },
    update: { password: instructorPass , role: Role.INSTRUCTOR },
    create: {
      name: "د. أحمد خالد",
      email: "ahmed@courseflow.com",
      password: instructorPass,
      role: Role.INSTRUCTOR,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "mohsen@courseflow.com" },
    update: { password: hashedPassword, role: Role.STUDENT },
    create: {
      name: "محسن",
      email: "mohsen@courseflow.com",
      password: studentPass,
      role: Role.STUDENT,
    },
  });

  let course = await prisma.course.findFirst({
    where: {
      title: "تطوير تطبيقات الويب الشاملة (Full Stack)",
      instructorId: instructor.id,
    },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: "تطوير تطبيقات الويب الشاملة (Full Stack)",
        description:
          "مسار عملي من الصفر لبناء تطبيقات ويب كاملة باستخدام Next.js و Prisma و PostgreSQL.",
        price: 0,
        category: "برمجة وتطوير",
        level: "متوسط",
        published: true,
        instructorId: instructor.id,
      },
    });
  }

  const lessonsData = [
    {
      title: "مقدمة حول قواعد البيانات العلائقية",
      videoUrl: "/videos/lesson-12.mp4",
      order: 1,
      duration: "12 دقيقة",
      quizQuestion: "ما الذي يميز قواعد البيانات العلائقية؟",
      quizOptions: JSON.stringify([
        "تخزين البيانات في جداول مترابطة بعلاقات",
        "تخزين الصور فقط",
        "تشغيل الواجهات الأمامية",
      ]),
      quizCorrect: 0,
    },
    {
      title: "إعداد Supabase واتصال السيرفر",
      videoUrl: "/videos/lesson-13.mp4",
      order: 2,
      duration: "15 دقيقة",
      quizQuestion: "ما هو Supabase؟",
      quizOptions: JSON.stringify([
        "محرر نصوص للكود",
        "منصة توفر قاعدة بيانات PostgreSQL وخدمات خلفية جاهزة",
        "مكتبة لتنسيق CSS",
      ]),
      quizCorrect: 1,
    },
    {
      title: "ربط قواعد البيانات بـ Prisma ORM",
      videoUrl: "/videos/lesson-14.mp4",
      order: 3,
      duration: "18 دقيقة",
      quizQuestion: "ما هو دور Prisma ORM الأساسي؟",
      quizOptions: JSON.stringify([
        "إدارة النماذج والاتصال بقاعدة البيانات عبر TypeScript بأمان",
        "تصميم الواجهات الأمامية بلغة CSS",
        "تسريع تشغيل ملفات السيرفر فقط",
      ]),
      quizCorrect: 0,
    },
    {
      title: "بناء واجهات الـ APIs الديناميكية",
      videoUrl: "/videos/lesson-15.mp4",
      order: 4,
      duration: "20 دقيقة",
      quizQuestion: "ما وظيفة الـ API؟",
      quizOptions: JSON.stringify([
        "تلوين الصفحات",
        "ضغط الصور",
        "وسيط لتبادل البيانات بين الواجهة والخادم",
      ]),
      quizCorrect: 2,
    },
    {
      title: "المشروع النهائي واختبار المنصة",
      videoUrl: "/videos/lesson-16.mp4",
      order: 5,
      duration: "25 دقيقة",
      quizQuestion: "ما الهدف من المشروع النهائي؟",
      quizOptions: JSON.stringify([
        "تطبيق كل ما تعلمته في مشروع متكامل",
        "حفظ الدروس عن ظهر قلب",
        "حذف قاعدة البيانات",
      ]),
      quizCorrect: 0,
    },
  ];

  for (const data of lessonsData) {
    const existing = await prisma.lesson.findFirst({
      where: { courseId: course.id, order: data.order },
    });
    if (!existing) {
      await prisma.lesson.create({ data: { ...data, courseId: course.id } });
    }
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course.id } },
    update: {},
    create: { userId: student.id, courseId: course.id, progress: 0 },
  });

  console.log("✅ تم إدخال البيانات بنجاح");
  console.log("كلمة المرور الموحدة:", DEFAULT_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });