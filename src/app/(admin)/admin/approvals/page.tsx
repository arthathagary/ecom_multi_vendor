import { getPendingVendors } from '@/app/(admin)/actions';
import ApprovalList from '@/components/admin/ApprovalList';

export const metadata = {
  title: 'Approval Queue',
};

export const instant = false;

export default async function ApprovalsPage() {
  const pendingVendors = await getPendingVendors();

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
        Approval Queue
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
        {pendingVendors.length} vendor{pendingVendors.length !== 1 ? 's' : ''} pending review
      </p>

      <ApprovalList vendors={pendingVendors} />
    </div>
  );
}
