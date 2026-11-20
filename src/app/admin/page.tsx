import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAdminDashboardData } from '@/app/actions/admin';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default async function AdminPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    if (session.role.toUpperCase() !== 'ADMIN') {
        redirect('/courses');
    }

    let data;
    try {
        data = await getAdminDashboardData();
    } catch {
        redirect('/courses');
    }

    return (
        <AdminDashboardClient
            initialUsers={data.users}
            stats={data.stats}
        />
    );
}