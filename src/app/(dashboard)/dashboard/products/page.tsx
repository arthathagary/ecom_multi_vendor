import { getVendorProducts, getCurrentVendor } from '@/app/(dashboard)/actions';
import ProductList from '@/components/dashboard/ProductList';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Products',
};

export const instant = false;

export default async function ProductsPage() {
  const vendor = await getCurrentVendor();
  if (!vendor) redirect('/dashboard/shop');

  const products = await getVendorProducts();

  return <ProductList products={products} vendor={vendor} />;
}
