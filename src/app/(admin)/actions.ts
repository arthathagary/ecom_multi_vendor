'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { vendors, adminActions, products } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');
  if (user.user_metadata?.role !== 'admin') throw new Error('Not authorized');

  return user;
}

export async function getAdminStats() {
  const admin = await requireAdmin();

  const [pendingResult] = await db
    .select({ count: count() })
    .from(vendors)
    .where(eq(vendors.status, 'pending'));

  const [approvedResult] = await db
    .select({ count: count() })
    .from(vendors)
    .where(eq(vendors.status, 'approved'));

  const [totalVendorsResult] = await db
    .select({ count: count() })
    .from(vendors);

  const [totalProductsResult] = await db
    .select({ count: count() })
    .from(products);

  return {
    pending: pendingResult?.count || 0,
    approved: approvedResult?.count || 0,
    totalVendors: totalVendorsResult?.count || 0,
    totalProducts: totalProductsResult?.count || 0,
  };
}

export async function getPendingVendors() {
  await requireAdmin();

  return db.query.vendors.findMany({
    where: eq(vendors.status, 'pending'),
    orderBy: (vendors, { asc }) => [asc(vendors.createdAt)],
  });
}

export async function getAllVendors() {
  await requireAdmin();

  return db.query.vendors.findMany({
    orderBy: (vendors, { desc }) => [desc(vendors.createdAt)],
    with: {
      products: true,
    },
  });
}

export async function approveVendor(vendorId: string, notes?: string) {
  const admin = await requireAdmin();

  await db
    .update(vendors)
    .set({ status: 'approved', updatedAt: new Date() })
    .where(eq(vendors.id, vendorId));

  await db.insert(adminActions).values({
    adminId: admin.id,
    vendorId,
    action: 'approve',
    notes: notes || null,
  });

  revalidateTag(`vendor-${vendorId}`, 'max');

  return { success: true };
}

export async function rejectVendor(vendorId: string, notes?: string) {
  const admin = await requireAdmin();

  await db
    .update(vendors)
    .set({ status: 'rejected', updatedAt: new Date() })
    .where(eq(vendors.id, vendorId));

  await db.insert(adminActions).values({
    adminId: admin.id,
    vendorId,
    action: 'reject',
    notes: notes || null,
  });

  revalidateTag(`vendor-${vendorId}`, 'max');

  return { success: true };
}

export async function suspendVendor(vendorId: string, notes?: string) {
  const admin = await requireAdmin();

  await db
    .update(vendors)
    .set({ status: 'suspended', updatedAt: new Date() })
    .where(eq(vendors.id, vendorId));

  await db.insert(adminActions).values({
    adminId: admin.id,
    vendorId,
    action: 'suspend',
    notes: notes || null,
  });

  revalidateTag(`vendor-${vendorId}`, 'max');

  return { success: true };
}

export async function reinstateVendor(vendorId: string, notes?: string) {
  const admin = await requireAdmin();

  await db
    .update(vendors)
    .set({ status: 'approved', updatedAt: new Date() })
    .where(eq(vendors.id, vendorId));

  await db.insert(adminActions).values({
    adminId: admin.id,
    vendorId,
    action: 'reinstate',
    notes: notes || null,
  });

  revalidateTag(`vendor-${vendorId}`, 'max');

  return { success: true };
}
