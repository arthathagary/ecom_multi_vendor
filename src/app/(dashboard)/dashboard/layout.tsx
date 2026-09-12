import { redirect } from 'next/navigation';
import { getCurrentUser, getCurrentVendor } from '../actions';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'Dashboard',
};

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const vendor = await getCurrentVendor();

  return (
    <DashboardShell user={user} vendor={vendor}>
      {children}
    </DashboardShell>
  );
}
