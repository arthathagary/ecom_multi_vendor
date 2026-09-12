import { db } from '@/db';
import { vendors, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cacheTag } from 'next/cache';
import ClassicHome from '@/components/storefront/templates/classic/ClassicHome';
import type { Metadata } from 'next';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

async function getVendorProducts(vendorId: string) {
  'use cache';
  cacheTag(`vendor-${vendorId}`);

  return db.query.products.findMany({
    where: eq(products.vendorId, vendorId),
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.slug, slug),
  });

  if (!vendor || vendor.status !== 'approved') {
    return { title: 'Shop Not Found' };
  }

  return {
    title: vendor.shopName,
    description: vendor.description || `Shop at ${vendor.shopName} — browse products and order via WhatsApp`,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.slug, slug),
  });

  if (!vendor) notFound();

  // Gate on approved status
  if (vendor.status !== 'approved') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-secondary)',
          textAlign: 'center',
          padding: 'var(--space-8)',
        }}
      >
        <div>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🔒</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            Shop Not Available
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            This shop is not yet live. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  const vendorProducts = await getVendorProducts(vendor.id);

  return <ClassicHome vendor={vendor} products={vendorProducts} />;
}
