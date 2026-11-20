import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  ROLE_COOKIE,
  verifySessionToken,
  type SessionPayload,
} from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    },
  });
}

export async function requireRole(...roles: string[]) {
  const session = await requireSession();
  const allowed = roles.map((r) => r.toUpperCase());
  if (!allowed.includes(session.role.toUpperCase())) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

export { SESSION_COOKIE, ROLE_COOKIE };
export type { SessionPayload };