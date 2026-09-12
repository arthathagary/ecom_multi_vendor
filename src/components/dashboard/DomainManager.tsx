'use client';

import { useState } from 'react';
import type { Vendor, Domain } from '@/db/schema';

interface DomainManagerProps {
  vendor: Vendor;
  domains: Domain[];
}

export default function DomainManager({ vendor, domains }: DomainManagerProps) {
  const [domainInput, setDomainInput] = useState('');

  const statusColors: Record<string, string> = {
    pending: 'var(--color-status-pending)',
    verifying: 'var(--color-info)',
    active: 'var(--color-status-approved)',
    failed: 'var(--color-status-rejected)',
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Custom Domain
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Connect your own domain name for a fully branded experience
        </p>
      </div>

      {/* DNS Instructions */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', maxWidth: '600px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
          📋 DNS Setup Instructions
        </h3>
        <ol style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          <li>Go to your domain registrar (e.g., GoDaddy, Namecheap)</li>
          <li>
            Add a <strong>CNAME</strong> record:
            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--space-2)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <p><strong>Type:</strong> CNAME</p>
              <p><strong>Name:</strong> @ or www</p>
              <p><strong>Value:</strong> {process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'your-platform.vercel.app'}</p>
            </div>
          </li>
          <li>Wait for DNS propagation (usually 5-30 minutes)</li>
          <li>Enter your domain below and click &quot;Add Domain&quot;</li>
        </ol>
      </div>

      {/* Add Domain Form */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', maxWidth: '600px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
          Add a Domain
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            type="text"
            className="form-input"
            placeholder="shop.example.com"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" disabled>
            Add Domain
          </button>
        </div>
        <p className="form-helper" style={{ marginTop: 'var(--space-2)' }}>
          ⚠️ Custom domain integration requires Cloudflare credentials. 
          Contact the admin to configure.
        </p>
      </div>

      {/* Existing Domains */}
      {domains.length > 0 && (
        <div style={{ maxWidth: '600px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
            Your Domains
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {domains.map((domain) => (
              <div key={domain.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{domain.domainName}</p>
                  {domain.sslStatus && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      SSL: {domain.sslStatus}
                    </p>
                  )}
                </div>
                <span
                  className="badge"
                  style={{
                    background: `${statusColors[domain.status]}20`,
                    color: statusColors[domain.status],
                  }}
                >
                  {domain.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {domains.length === 0 && (
        <div className="card" style={{ maxWidth: '600px', textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
          <p style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🌐</p>
          <p>No custom domains configured yet.</p>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Your shop is available at: <strong>/store/{vendor.slug}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
