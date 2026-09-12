'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  approveVendor,
  rejectVendor,
  suspendVendor,
  reinstateVendor,
} from '@/app/(admin)/actions';
import type { Vendor, Product } from '@/db/schema';

type VendorWithProducts = Vendor & { products: Product[] };

interface VendorManagementProps {
  vendors: VendorWithProducts[];
}

export default function VendorManagement({ vendors }: VendorManagementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredVendors =
    filter === 'all'
      ? vendors
      : vendors.filter((v) => v.status === filter);

  const handleAction = async (
    vendorId: string,
    action: 'approve' | 'reject' | 'suspend' | 'reinstate'
  ) => {
    setLoading(vendorId);
    try {
      switch (action) {
        case 'approve':
          await approveVendor(vendorId);
          break;
        case 'reject':
          await rejectVendor(vendorId);
          break;
        case 'suspend':
          await suspendVendor(vendorId);
          break;
        case 'reinstate':
          await reinstateVendor(vendorId);
          break;
      }
      router.refresh();
    } catch (e) {
      alert(`Failed to ${action} vendor`);
    }
    setLoading(null);
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected', 'suspended'].map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span style={{ marginLeft: 'var(--space-1)', opacity: 0.7 }}>
                ({vendors.filter((v) => v.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Vendor Table */}
      {filteredVendors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No vendors found</h3>
          <p className="empty-state-description">
            No vendors match the selected filter.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Category</th>
                <th>Products</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>
                    <div>
                      <p style={{ fontWeight: 600 }}>{vendor.shopName}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        /store/{vendor.slug}
                      </p>
                    </div>
                  </td>
                  <td>{vendor.category}</td>
                  <td>{vendor.products.length}</td>
                  <td>
                    <span className={`badge badge-${vendor.status}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                      {vendor.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={() => handleAction(vendor.id, 'approve')}
                            disabled={loading === vendor.id}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleAction(vendor.id, 'reject')}
                            disabled={loading === vendor.id}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {vendor.status === 'approved' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(vendor.id, 'suspend')}
                          disabled={loading === vendor.id}
                        >
                          Suspend
                        </button>
                      )}
                      {(vendor.status === 'suspended' || vendor.status === 'rejected') && (
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={() => handleAction(vendor.id, 'reinstate')}
                          disabled={loading === vendor.id}
                        >
                          Reinstate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
