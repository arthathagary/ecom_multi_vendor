import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Panel',
};

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (user.user_metadata?.role !== 'admin') redirect('/');

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-secondary)' }}>
      {/* Admin Nav */}
      <nav
        style={{
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-default)',
          padding: '0 var(--space-6)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-sticky)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            gap: 'var(--space-6)',
          }}
        >
          <Link
            href="/admin"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'var(--text-lg)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span>🛡️</span>
            <span>Admin</span>
          </Link>
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <Link href="/admin" className="btn btn-ghost btn-sm">
              Dashboard
            </Link>
            <Link href="/admin/approvals" className="btn btn-ghost btn-sm">
              Approvals
            </Link>
            <Link href="/admin/vendors" className="btn btn-ghost btn-sm">
              Vendors
            </Link>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link href="/dashboard" className="btn btn-secondary btn-sm">
              ← Vendor Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-6)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
