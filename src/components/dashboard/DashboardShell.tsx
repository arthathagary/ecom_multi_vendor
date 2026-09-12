'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/(dashboard)/actions';
import type { Vendor } from '@/db/schema';
import type { User } from '@supabase/supabase-js';
import styles from './DashboardShell.module.css';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/shop', label: 'Shop Profile', icon: '🏪' },
  { href: '/dashboard/products', label: 'Products', icon: '📦' },
  { href: '/dashboard/preview', label: 'Preview', icon: '👁️' },
  { href: '/dashboard/domain', label: 'Domain', icon: '🌐' },
];

interface DashboardShellProps {
  user: User;
  vendor: (Vendor & { template?: { name: string } | null }) | null;
  children: React.ReactNode;
}

export default function DashboardShell({ user, vendor, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <span>🏪</span>
            <span className={styles.logoText}>VendorHub</span>
          </Link>
          <button
            className={`btn btn-icon ${styles.closeSidebar}`}
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          {vendor && (
            <div className={styles.shopInfo}>
              <div className={styles.shopAvatar}>
                {vendor.shopName.charAt(0).toUpperCase()}
              </div>
              <div className={styles.shopDetails}>
                <p className={styles.shopName}>{vendor.shopName}</p>
                <span className={`badge badge-${vendor.status}`}>
                  {vendor.status}
                </span>
              </div>
            </div>
          )}
          <div className={styles.userInfo}>
            <p className={styles.userEmail}>{user.email}</p>
            <form action={signOut}>
              <button type="submit" className="btn btn-ghost btn-sm">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.topBar}>
          <button
            className={`btn btn-icon ${styles.menuToggle}`}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className={styles.topBarRight}>
            {vendor?.status === 'approved' && (
              <Link
                href={`/store/${vendor.slug}`}
                target="_blank"
                className="btn btn-secondary btn-sm"
              >
                🔗 View Live Shop
              </Link>
            )}
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
