import { getCurrentVendor } from '@/app/(dashboard)/actions';
import ShopProfileForm from '@/components/dashboard/ShopProfileForm';

export const metadata = {
  title: 'Shop Profile',
};

export const instant = false;

export default async function ShopPage() {
  const vendor = await getCurrentVendor();

  return <ShopProfileForm vendor={vendor} />;
}
