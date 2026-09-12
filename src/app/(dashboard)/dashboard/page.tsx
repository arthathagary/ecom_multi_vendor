import { redirect } from 'next/navigation';
import { getCurrentVendor } from '../actions';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard',
};

export const instant = false;

export default async function DashboardPage() {
  const vendor = await getCurrentVendor();

  // If no vendor profile exists, redirect to setup
  if (!vendor) {
    redirect('/dashboard/shop');
  }

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Welcome back! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here&apos;s what&apos;s happening with <strong>{vendor.shopName}</strong>
        </p>
      </div>

      {/* Status Banner */}
      <div
        className="card"
        style={{
          background:
            vendor.status === 'approved'
              ? 'var(--color-accent-50)'
              : vendor.status === 'pending'
                ? '#fffbeb'
                : '#fef2f2',
          borderColor:
            vendor.status === 'approved'
              ? 'var(--color-accent-200)'
              : vendor.status === 'pending'
                ? '#fde68a'
                : '#fecaca',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '1.5rem' }}>
            {vendor.status === 'approved' ? '✅' : vendor.status === 'pending' ? '⏳' : '❌'}
          </span>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
              Shop Status:{' '}
              <span className={`badge badge-${vendor.status}`}>
                {vendor.status}
              </span>
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {vendor.status === 'approved'
                ? 'Your shop is live! Customers can find you online.'
                : vendor.status === 'pending'
                  ? 'Your shop is under review. We\'ll notify you once it\'s approved.'
                  : 'Your shop needs attention. Please check the notes from admin.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <Link
          href="/dashboard/products"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>📦</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
            Manage Products
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Add, edit, or remove products from your shop
          </p>
        </Link>

        <Link
          href="/dashboard/shop"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🏪</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
            Shop Profile
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Update your shop name, logo, and details
          </p>
        </Link>

        <Link
          href="/dashboard/preview"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>👁️</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
            Preview Shop
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            See how your shop looks to customers
          </p>
        </Link>

        <Link
          href="/dashboard/domain"
          className="card card-interactive"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🌐</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
            Custom Domain
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Connect your own domain name
          </p>
        </Link>
      </div>

      {/* Shop URL */}
      {vendor.status === 'approved' && (
        <div className="card" style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-primary-800)' }}>
            🔗 Your Shop URL
          </p>
          <code
            style={{
              display: 'block',
              background: 'white',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-primary-700)',
              wordBreak: 'break-all',
            }}
          >
            {typeof window !== 'undefined'
              ? `${window.location.origin}/store/${vendor.slug}`
              : `/store/${vendor.slug}`}
          </code>
        </div>
      )}
    </div>
  );
}
