'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
  ROLE_COOKIE,
} from '@/lib/session';

export async function registerAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'يرجى ملء جميع الحقول المطلوبة' };
  }
  if (password.length < 6) {
    return { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: 'البريد الإلكتروني مستخدم بالفعل' };

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
      },
    });

    const token = await createSessionToken(newUser.id, newUser.role);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);
    cookieStore.set(ROLE_COOKIE, newUser.role.toLowerCase(), {
      path: '/',
      maxAge: sessionCookieOptions.maxAge,
      sameSite: 'lax',
    });

    return { success: true };
  } catch (error) {
    console.error('Register error:', error);
    return { error: 'حدث خطأ أثناء إنشاء الحساب' };
  }
}

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.password) {
      return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
    if (!user.password.startsWith('$2')) {
      return {
        error: 'حسابك يحتاج إعادة تعيين كلمة المرور. تواصل مع الدعم.',
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    const token = await createSessionToken(user.id, user.role);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);
    cookieStore.set(ROLE_COOKIE, user.role.toLowerCase(), {
      path: '/',
      maxAge: sessionCookieOptions.maxAge,
      sameSite: 'lax',
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'حدث خطأ أثناء تسجيل الدخول' };
  }
}

export async function logoutAction() {
  'use server';
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(ROLE_COOKIE);
}