import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NavbarContent from '@/components/NavbarContent';
import {
  SESSION_COOKIE,
  ROLE_COOKIE,
  verifySessionToken,
} from '@/lib/session';

async function logoutAction() {
  'use server';
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(ROLE_COOKIE);
  redirect('/login');
}

export default async function ServerNavbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  return (
    <NavbarContent
      initialToken={session?.userId}
      role={session?.role?.toLowerCase()}
      logoutAction={logoutAction}
    />
  );
}