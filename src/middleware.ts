import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // جلب الـ Token أو الدور من الكوكيز (Cookies)
  const token = request.cookies.get('courseflow_token')?.value;
  const userRole = request.cookies.get('courseflow_role')?.value; // 'student' | 'instructor' | 'admin'

  // 1. حماية لوحة المسؤول (Admin)
  if (pathname.startsWith('/admin')) {
    if (!token || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. حماية لوحة المحاضر (Instructor)
  if (pathname.startsWith('/instructor')) {
    if (!token || (userRole !== 'instructor' && userRole !== 'admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. حماية لوحة الطالب (Student)
  if (pathname.startsWith('/student')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// تحديد المسارات التي سيتم تطبيق الـ Middleware عليها
export const config = {
  matcher: ['/admin/:path*', '/instructor/:path*', '/student/:path*'],
};