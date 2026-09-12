import { redirect } from 'next/navigation';
import { getCurrentVendor } from '@/app/(dashboard)/actions';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ClassicHome from '@/components/storefront/templates/classic/ClassicHome';

export const metadata = {
  title: 'Shop Preview',
};

export const instant = false;

export default async function PreviewPage() {
  const vendor = await getCurrentVendor();
  if (!vendor) redirect('/dashboard/shop');

  const vendorProducts = await db.query.products.findMany({
    where: eq(products.vendorId, vendor.id),
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return (
    <div>
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)',
        }}
      >
        <span>👁️</span>
        <strong>Preview Mode</strong> — This is how your shop looks to customers.
        {vendor.status !== 'approved' && (
          <span style={{ color: 'var(--text-tertiary)' }}>
            &nbsp;(Not live yet — submit for review to go live)
          </span>
        )}
      </div>

      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <ClassicHome
          vendor={{ ...vendor, status: 'approved' }}
          products={vendorProducts}
        />
      </div>
    </div>
  );
}
