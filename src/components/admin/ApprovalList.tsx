'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveVendor, rejectVendor } from '@/app/(admin)/actions';
import type { Vendor } from '@/db/schema';

interface ApprovalListProps {
  vendors: Vendor[];
}

export default function ApprovalList({ vendors }: ApprovalListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const handleApprove = async (vendorId: string) => {
    setLoading(vendorId);
    try {
      await approveVendor(vendorId);
      router.refresh();
    } catch (e) {
      alert('Failed to approve vendor');
    }
    setLoading(null);
  };

  const handleReject = async (vendorId: string) => {
    setLoading(vendorId);
    try {
      await rejectVendor(vendorId, rejectNotes);
      setRejectingId(null);
      setRejectNotes('');
      router.refresh();
    } catch (e) {
      alert('Failed to reject vendor');
    }
    setLoading(null);
  };

  if (vendors.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✅</div>
        <h3 className="empty-state-title">All caught up!</h3>
        <p className="empty-state-description">
          No vendors are waiting for approval right now.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {vendors.map((vendor) => (
        <div key={vendor.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                {vendor.shopName}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <p>📍 <strong>Slug:</strong> /store/{vendor.slug}</p>
                <p>📁 <strong>Category:</strong> {vendor.category}</p>
                <p>💬 <strong>WhatsApp:</strong> {vendor.whatsappNumber}</p>
                <p>📧 <strong>Email:</strong> {vendor.contactEmail}</p>
                {vendor.description && (
                  <p style={{ marginTop: 'var(--space-2)' }}>
                    {vendor.description}
                  </p>
                )}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
                Submitted: {new Date(vendor.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <button
                className="btn btn-accent btn-sm"
                onClick={() => handleApprove(vendor.id)}
                disabled={loading === vendor.id}
              >
                {loading === vendor.id ? <span className="spinner" /> : '✅'} Approve
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  rejectingId === vendor.id
                    ? setRejectingId(null)
                    : setRejectingId(vendor.id)
                }
                disabled={loading === vendor.id}
              >
                ❌ Reject
              </button>
            </div>
          </div>

          {rejectingId === vendor.id && (
            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-default)' }}>
              <div className="form-group">
                <label className="form-label">Rejection Notes (optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Explain why the vendor is being rejected..."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReject(vendor.id)}
                  disabled={loading === vendor.id}
                >
                  Confirm Rejection
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setRejectingId(null); setRejectNotes(''); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
