import { db } from '@/db';
import { vendors, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cacheTag } from 'next/cache';
import ClassicProductDetail from '@/components/storefront/templates/classic/ClassicProductDetail';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

export const instant = false;

async function getCachedProduct(vendorId: string, productId: string) {
  'use cache';
  cacheTag(`vendor-${vendorId}`);

  return db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.vendorId, vendorId)),
  });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, productId } = await params;

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.slug, slug),
  });

  if (!vendor || vendor.status !== 'approved') {
    return { title: 'Product Not Found' };
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.vendorId, vendor.id)),
  });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | ${vendor.shopName}`,
    description: product.description || `${product.name} — LKR ${product.price}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, productId } = await params;

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.slug, slug),
  });

  if (!vendor || vendor.status !== 'approved') notFound();

  const product = await getCachedProduct(vendor.id, productId);

  if (!product) notFound();

  return <ClassicProductDetail vendor={vendor} product={product} />;
}
