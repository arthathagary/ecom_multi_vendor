import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VendorHub - Build Your Online Shop',
    template: '%s | VendorHub',
  },
  description:
    'Create your online shop in minutes. No coding required. Reach customers in Sri Lanka with your own branded storefront and WhatsApp ordering.',
  keywords: ['online shop', 'Sri Lanka', 'e-commerce', 'vendor', 'WhatsApp ordering'],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
