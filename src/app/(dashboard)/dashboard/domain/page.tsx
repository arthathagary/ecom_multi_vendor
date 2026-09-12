import { redirect } from 'next/navigation';
import { getCurrentVendor } from '@/app/(dashboard)/actions';
import { db } from '@/db';
import { domains } from '@/db/schema';
import { eq } from 'drizzle-orm';
import DomainManager from '@/components/dashboard/DomainManager';

export const metadata = {
  title: 'Custom Domain',
};

export const instant = false;

export default async function DomainPage() {
  const vendor = await getCurrentVendor();
  if (!vendor) redirect('/dashboard/shop');

  const vendorDomains = await db.query.domains.findMany({
    where: eq(domains.vendorId, vendor.id),
    orderBy: (domains, { desc }) => [desc(domains.createdAt)],
  });

  return <DomainManager vendor={vendor} domains={vendorDomains} />;
}
