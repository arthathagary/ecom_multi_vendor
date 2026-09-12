import Link from 'next/link';
import { formatPrice, buildWhatsAppLink } from '@/lib/utils';
import type { Vendor, Product } from '@/db/schema';
import styles from './Classic.module.css';

interface ClassicProductDetailProps {
  vendor: Vendor;
  product: Product;
}

export default function ClassicProductDetail({
  vendor,
  product,
}: ClassicProductDetailProps) {
  return (
    <div className={styles.storefront}>
      {/* Header */}
      <header className={styles.headerCompact}>
        <div className={styles.container}>
          <div className={styles.headerCompactInner}>
            <Link
              href={`/store/${vendor.slug}`}
              className={styles.backLink}
            >
              ← {vendor.shopName}
            </Link>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <section className={styles.productDetail}>
        <div className={styles.container}>
          <div className={styles.productDetailGrid}>
            {/* Image */}
            <div className={styles.productDetailImage}>
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className={styles.productDetailImg}
                />
              ) : (
                <div className={styles.productDetailPlaceholder}>
                  <span style={{ fontSize: '4rem' }}>📷</span>
                  <p>No image available</p>
                </div>
              )}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className={styles.productThumbnails}>
                  {product.imageUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${product.name} ${i + 1}`}
                      className={styles.thumbnail}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={styles.productDetailInfo}>
              <div className={styles.productDetailBadges}>
                <span
                  className={`badge badge-${product.stockStatus === 'in_stock' ? 'in-stock' : 'out-of-stock'}`}
                >
                  {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  {product.category}
                </span>
              </div>

              <h1 className={styles.productDetailName}>{product.name}</h1>
              <p className={styles.productDetailPrice}>
                {formatPrice(product.price)}
              </p>

              {product.description && (
                <div className={styles.productDetailDescription}>
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>
              )}

              {/* WhatsApp CTA */}
              {product.stockStatus === 'in_stock' && (
                <a
                  href={buildWhatsAppLink(
                    vendor.whatsappNumber,
                    product.name,
                    product.price
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-whatsapp btn-lg ${styles.whatsappCta}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.612C7.9 23.177 9.9 23.71 12 23.71 18.627 23.71 24 18.337 24 11.71S18.627 0 12 0zm0 21.71c-1.86 0-3.628-.503-5.166-1.452l-.37-.22-3.845 1.008 1.026-3.748-.24-.382A9.672 9.672 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 9.71-10 9.71z"/>
                  </svg>
                  Order via WhatsApp
                </a>
              )}

              {product.stockStatus === 'out_of_stock' && (
                <div className="alert alert-warning" style={{ marginTop: 'var(--space-4)' }}>
                  <span>⚠️</span>
                  This product is currently out of stock.
                </div>
              )}

              {/* Shop Info */}
              <div className={styles.shopInfoCard}>
                <h4>Sold by</h4>
                <Link
                  href={`/store/${vendor.slug}`}
                  className={styles.shopInfoLink}
                >
                  {vendor.shopName}
                </Link>
                <p className={styles.shopInfoContact}>
                  📧 {vendor.contactEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
