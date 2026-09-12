import Link from 'next/link';
import { formatPrice, buildWhatsAppLink } from '@/lib/utils';
import type { Vendor, Product } from '@/db/schema';
import styles from './Classic.module.css';

interface ClassicHomeProps {
  vendor: Vendor;
  products: Product[];
}

export default function ClassicHome({ vendor, products }: ClassicHomeProps) {
  return (
    <div className={styles.storefront}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {vendor.logoUrl && (
            <img
              src={vendor.logoUrl}
              alt={`${vendor.shopName} logo`}
              className={styles.logo}
            />
          )}
          <h1 className={styles.shopTitle}>{vendor.shopName}</h1>
          <p className={styles.shopCategory}>{vendor.category}</p>
        </div>
      </header>

      {/* Banner */}
      {vendor.bannerUrl && (
        <div className={styles.banner}>
          <img
            src={vendor.bannerUrl}
            alt={`${vendor.shopName} banner`}
            className={styles.bannerImg}
          />
        </div>
      )}

      {/* About */}
      {vendor.description && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>About Us</h2>
            <p className={styles.aboutText}>{vendor.description}</p>
          </div>
        </section>
      )}

      {/* Products */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Products</h2>

          {products.length === 0 ? (
            <div className={styles.emptyProducts}>
              <p>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <div className={styles.productImageWrap}>
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      {product.stockStatus === 'out_of_stock' && (
                        <div className={styles.outOfStockOverlay}>
                          Out of Stock
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.productImagePlaceholder}>
                      <span>📷</span>
                      {product.stockStatus === 'out_of_stock' && (
                        <div className={styles.outOfStockOverlay}>
                          Out of Stock
                        </div>
                      )}
                    </div>
                  )}

                  <div className={styles.productInfo}>
                    <Link
                      href={`/store/${vendor.slug}/product/${product.id}`}
                      className={styles.productName}
                    >
                      {product.name}
                    </Link>
                    <p className={styles.productPrice}>
                      {formatPrice(product.price)}
                    </p>
                    {product.description && (
                      <p className={styles.productDesc}>
                        {product.description.length > 100
                          ? product.description.substring(0, 100) + '...'
                          : product.description}
                      </p>
                    )}

                    <div className={styles.productActions}>
                      <Link
                        href={`/store/${vendor.slug}/product/${product.id}`}
                        className={`btn btn-secondary btn-sm ${styles.viewBtn}`}
                      >
                        View Details
                      </Link>
                      {product.stockStatus === 'in_stock' && (
                        <a
                          href={buildWhatsAppLink(
                            vendor.whatsappNumber,
                            product.name,
                            product.price
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`btn btn-whatsapp btn-sm`}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.612C7.9 23.177 9.9 23.71 12 23.71 18.627 23.71 24 18.337 24 11.71S18.627 0 12 0zm0 21.71c-1.86 0-3.628-.503-5.166-1.452l-.37-.22-3.845 1.008 1.026-3.748-.24-.382A9.672 9.672 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 9.71-10 9.71z"/>
                          </svg>
                          Order via WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div>
              <h3 className={styles.footerTitle}>{vendor.shopName}</h3>
              {vendor.description && (
                <p className={styles.footerDesc}>
                  {vendor.description.length > 150
                    ? vendor.description.substring(0, 150) + '...'
                    : vendor.description}
                </p>
              )}
            </div>
            <div className={styles.footerContact}>
              <h4 className={styles.footerContactTitle}>Contact Us</h4>
              <p>📧 {vendor.contactEmail}</p>
              <p>💬 {vendor.whatsappNumber}</p>
              <a
                href={`https://wa.me/${vendor.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                style={{ marginTop: 'var(--space-3)' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.612C7.9 23.177 9.9 23.71 12 23.71 18.627 23.71 24 18.337 24 11.71S18.627 0 12 0zm0 21.71c-1.86 0-3.628-.503-5.166-1.452l-.37-.22-3.845 1.008 1.026-3.748-.24-.382A9.672 9.672 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 9.71-10 9.71z"/>
                </svg>
                Chat with us
              </a>
            </div>
          </div>
          <p className={styles.footerCopy}>
            Powered by <strong>VendorHub</strong> 🇱🇰
          </p>
        </div>
      </footer>
    </div>
  );
}
