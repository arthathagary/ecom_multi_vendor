import { getAllVendors } from '@/app/(admin)/actions';
import VendorManagement from '@/components/admin/VendorManagement';

export const metadata = {
  title: 'Vendor Management',
};

export const instant = false;

export default async function VendorsPage() {
  const vendors = await getAllVendors();

  return (
    <div className="animate-in">
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          marginBottom: 'var(--space-2)',
        }}
      >
        All Vendors
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
        {vendors.length} total vendor{vendors.length !== 1 ? 's' : ''}
      </p>

      <VendorManagement vendors={vendors} />
    </div>
  );
}
