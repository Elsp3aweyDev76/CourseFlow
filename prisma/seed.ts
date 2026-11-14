import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// إعداد الاتصال باستخدام Pool لضمان التوافق مع Supabase والـ Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seeding...");

  // إنشاء محاضر افتراضي
  const instructor = await prisma.user.upsert({
    where: { email: 'ahmed@courseflow.com' },
    update: {},
    create: {
      name: 'د. أحمد خالد',
      email: 'ahmed@courseflow.com',
      password: 'hashed_password_123', // يفضل لاحقاً تشفير كلمة المرور بـ bcrypt
      role: 'INSTRUCTOR',
    },
  });

  // إنشاء طالب افتراضي
  const student = await prisma.user.upsert({
    where: { email: 'mohsen@courseflow.com' },
    update: {},
    create: {
      name: 'محسن',
      email: 'mohsen@courseflow.com',
      password: 'hashed_password_123',
      role: 'STUDENT',
    },
  });

  console.log('✅ تم إدخال البيانات بنجاح:', { instructor, student });
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // إغلاق الـ pool لمنع تعليق الـ Terminal بعد انتهاء السكريبت
  });