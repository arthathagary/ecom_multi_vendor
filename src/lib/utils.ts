/**
 * Combine class names conditionally
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format price in LKR
 */
export function formatPrice(price: string | number, currency = 'LKR'): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Build WhatsApp deep link
 */
export function buildWhatsAppLink(
  whatsappNumber: string,
  productName: string,
  price: string | number,
  qty = 1
): string {
  const message = encodeURIComponent(
    `Hi, I'd like to order:\n\n` +
    `📦 ${productName}\n` +
    `💰 ${formatPrice(price)}\n` +
    `📝 Quantity: ${qty}\n\n` +
    `Please confirm availability and total. Thank you!`
  );
  // Remove any non-digit chars from phone number
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${message}`;
}

/**
 * Generate a URL-safe slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get the full storefront URL for a vendor
 */
export function getStorefrontUrl(slug: string): string {
  const protocol = process.env.NEXT_PUBLIC_PLATFORM_PROTOCOL || 'http';
  const domain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost:3000';
  
  // In development, use path-based routing
  if (domain.includes('localhost')) {
    return `${protocol}://${domain}/store/${slug}`;
  }
  
  // In production, use subdomain-based routing
  return `${protocol}://${slug}.${domain}`;
}
