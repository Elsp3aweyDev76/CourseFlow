import { cookies } from 'next/headers';
import Navbar from './Navbar';

export default async function ServerNavbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('courseflow_token')?.value || cookieStore.get('userId')?.value || null;
  const role = cookieStore.get('courseflow_role')?.value?.toLowerCase() || null;

  return <Navbar initialToken={token} initialRole={role} />;
}