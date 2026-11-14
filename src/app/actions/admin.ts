'use server'

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client"; //

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// دالة أمان للتحقق من صلاحية المسؤول
async function verifyAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const role = cookieStore.get("courseflow_role")?.value?.toLowerCase();

  if (!userId || role !== "admin") {
    throw new Error("غير مسموح لك بالقيام بهذا الإجراء.");
  }
}

// 1. تحديث دور المستخدم (ترقية لمحاضر، أو إعادة لطالب، إلخ)
export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  await verifyAdmin();

  await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole as Role }, // <-- إضافة as Role أو as any هنا لتصحيح نوع البيانات
  });

  revalidatePath("/admin");
}

// 2. حذف مستخدم من النظام
export async function deleteUserAction(targetUserId: string) {
  await verifyAdmin();

  await prisma.user.delete({
    where: { id: targetUserId },
  });

  revalidatePath("/admin");
}