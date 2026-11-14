'use server'

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
  success?: boolean;
  role?: string;
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 1. تسجيل الدخول (يتعرف على الدور تلقائياً من قاعدة البيانات)
export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
    }

    const cookieStore = await cookies();
    
    // تخزين الـ Cookies بأمان مع دعم httpOnly
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("courseflow_token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("courseflow_role", user.role.toLowerCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "حدث خطأ أثناء الاتصال بقاعدة البيانات." };
  }
}

// 2. إنشاء حساب جديد (يحدد الدور عند التسجيل لأول مرة)
export async function signupAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // 'student', 'instructor', or 'admin'

  if (!name || !email || !password) {
    return { error: "الرجاء تعبئة جميع الحقول المطلوبة." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "البريد الإلكتروني مستخدم بالفعل." };
    }

    let prismaRole: "STUDENT" | "INSTRUCTOR" | "ADMIN" = "STUDENT";
    if (role === "instructor") prismaRole = "INSTRUCTOR";
    if (role === "admin") prismaRole = "ADMIN";

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: prismaRole,
      },
    });

    const cookieStore = await cookies();
    
    cookieStore.set("userId", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("courseflow_token", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("courseflow_role", newUser.role.toLowerCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, role: newUser.role };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "حدث خطأ أثناء إنشاء الحساب." };
  }
}

// 3. تسجيل الخروج (حذف الكوكيز الآمنة من جهة السيرفر والتوجيه لصفحة الدخول)
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("courseflow_token");
  cookieStore.delete("courseflow_role");
  cookieStore.delete("userId");
  // redirect("/login");
}