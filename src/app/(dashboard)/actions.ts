'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { vendors, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

/* ─── Auth Helpers ─── */

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentVendor() {
  const user = await getCurrentUser();
  if (!user) return null;

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.userId, user.id),
    with: {
      template: true,
    },
  });

  return vendor || null;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

/* ─── Vendor Profile ─── */

export async function createVendorProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const shopName = formData.get('shopName') as string;
  const slug = formData.get('slug') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;
  const contactEmail = formData.get('contactEmail') as string;

  // Check slug uniqueness
  const existing = await db.query.vendors.findFirst({
    where: eq(vendors.slug, slug),
  });

  if (existing) {
    return { error: 'This shop URL is already taken. Try another one.' };
  }

  const [newVendor] = await db
    .insert(vendors)
    .values({
      userId: user.id,
      shopName,
      slug,
      category,
      description,
      whatsappNumber,
      contactEmail,
      status: 'pending',
    })
    .returning();

  return { success: true, vendor: newVendor };
}

export async function updateVendorProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const vendor = await getCurrentVendor();
  if (!vendor) throw new Error('Vendor not found');

  const shopName = formData.get('shopName') as string;
  const slug = formData.get('slug') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;
  const contactEmail = formData.get('contactEmail') as string;
  const logoUrl = formData.get('logoUrl') as string | null;
  const bannerUrl = formData.get('bannerUrl') as string | null;

  // Check slug uniqueness (if changed)
  if (slug !== vendor.slug) {
    const existing = await db.query.vendors.findFirst({
      where: eq(vendors.slug, slug),
    });
    if (existing) {
      return { error: 'This shop URL is already taken.' };
    }
  }

  await db
    .update(vendors)
    .set({
      shopName,
      slug,
      category,
      description,
      whatsappNumber,
      contactEmail,
      ...(logoUrl !== null && { logoUrl }),
      ...(bannerUrl !== null && { bannerUrl }),
      updatedAt: new Date(),
    })
    .where(eq(vendors.id, vendor.id));

  revalidateTag(`vendor-${vendor.id}`, 'max');

  return { success: true };
}

export async function checkSlugAvailability(slug: string) {
  const existing = await db.query.vendors.findFirst({
    where: eq(vendors.slug, slug),
  });
  return { available: !existing };
}

export async function submitForReview() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const vendor = await getCurrentVendor();
  if (!vendor) throw new Error('Vendor not found');

  await db
    .update(vendors)
    .set({ status: 'pending', updatedAt: new Date() })
    .where(eq(vendors.id, vendor.id));

  return { success: true };
}

/* ─── Products ─── */

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const vendor = await getCurrentVendor();
  if (!vendor) throw new Error('Vendor not found');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const category = formData.get('category') as string;
  const stockStatus = formData.get('stockStatus') as 'in_stock' | 'out_of_stock';
  const imageUrlsRaw = formData.get('imageUrls') as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const [newProduct] = await db
    .insert(products)
    .values({
      vendorId: vendor.id,
      name,
      description,
      price,
      category,
      stockStatus,
      imageUrls,
    })
    .returning();

  revalidateTag(`vendor-${vendor.id}`, 'max');

  return { success: true, product: newProduct };
}

export async function updateProduct(productId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const vendor = await getCurrentVendor();
  if (!vendor) throw new Error('Vendor not found');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const category = formData.get('category') as string;
  const stockStatus = formData.get('stockStatus') as 'in_stock' | 'out_of_stock';
  const imageUrlsRaw = formData.get('imageUrls') as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  await db
    .update(products)
    .set({
      name,
      description,
      price,
      category,
      stockStatus,
      imageUrls,
      updatedAt: new Date(),
    })
    .where(
      and(eq(products.id, productId), eq(products.vendorId, vendor.id))
    );

  revalidateTag(`vendor-${vendor.id}`, 'max');

  return { success: true };
}

export async function deleteProduct(productId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const vendor = await getCurrentVendor();
  if (!vendor) throw new Error('Vendor not found');

  await db
    .delete(products)
    .where(
      and(eq(products.id, productId), eq(products.vendorId, vendor.id))
    );

  revalidateTag(`vendor-${vendor.id}`, 'max');

  return { success: true };
}

export async function getVendorProducts() {
  const vendor = await getCurrentVendor();
  if (!vendor) return [];

  const vendorProducts = await db.query.products.findMany({
    where: eq(products.vendorId, vendor.id),
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return vendorProducts;
}

/* ─── File Upload ─── */

export async function uploadFile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const file = formData.get('file') as File;
  const bucket = formData.get('bucket') as string || 'vendor-assets';
  const folder = formData.get('folder') as string || user.id;

  const supabase = await createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { success: true, url: publicUrl.publicUrl };
}
