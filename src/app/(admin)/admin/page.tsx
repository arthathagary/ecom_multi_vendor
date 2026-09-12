import { getAdminStats } from '@/app/(admin)/actions';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard',
};

export const instant = false;

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="animate-in">
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          marginBottom: 'var(--space-8)',
        }}
      >
        Admin Dashboard
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-status-pending)' }}>
            {stats.pending}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
            Pending Approvals
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-status-approved)' }}>
            {stats.approved}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
            Active Shops
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-primary-600)' }}>
            {stats.totalVendors}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
            Total Vendors
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-accent-600)' }}>
            {stats.totalProducts}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
            Total Products
          </p>
        </div>
      </div>

      {stats.pending > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)' }}>
          <span>⏳</span>
          <div>
            You have <strong>{stats.pending}</strong> vendor{stats.pending > 1 ? 's' : ''} waiting for approval.{' '}
            <Link href="/admin/approvals" style={{ fontWeight: 600 }}>
              Review now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
