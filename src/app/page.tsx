import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🏪</span>
            <span className={styles.logoText}>VendorHub</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Built for Sri Lankan Businesses
          </div>
          <h1 className={styles.heroTitle}>
            Launch Your
            <br />
            <span className={styles.heroGradient}>Online Shop</span>
            <br />
            in Minutes
          </h1>
          <p className={styles.heroDescription}>
            No coding. No complexity. Create a stunning online storefront, add your
            products, and start receiving orders via WhatsApp — completely free to start.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Create Your Shop →
            </Link>
            <Link href="#features" className="btn btn-secondary btn-lg">
              See How It Works
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>100+</span>
              <span className={styles.heroStatLabel}>Shops Live</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>LKR 0</span>
              <span className={styles.heroStatLabel}>To Get Started</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>5 min</span>
              <span className={styles.heroStatLabel}>Setup Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionSubtitle}>
            A complete platform to take your business online
          </p>
          <div className={styles.featureGrid}>
            <div className={`card card-interactive ${styles.featureCard}`}>
              <div className={styles.featureIcon}>🎨</div>
              <h3 className={styles.featureTitle}>Beautiful Storefront</h3>
              <p className={styles.featureDesc}>
                Professional, mobile-responsive templates that make your products
                shine. Your own branded URL included.
              </p>
            </div>
            <div className={`card card-interactive ${styles.featureCard}`}>
              <div className={styles.featureIcon}>💬</div>
              <h3 className={styles.featureTitle}>WhatsApp Ordering</h3>
              <p className={styles.featureDesc}>
                Customers tap a button, and a WhatsApp message is instantly drafted
                with their order details. Simple and familiar.
              </p>
            </div>
            <div className={`card card-interactive ${styles.featureCard}`}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Easy Management</h3>
              <p className={styles.featureDesc}>
                Add products, upload images, set prices — all from a simple dashboard.
                No technical skills required.
              </p>
            </div>
            <div className={`card card-interactive ${styles.featureCard}`}>
              <div className={styles.featureIcon}>🌐</div>
              <h3 className={styles.featureTitle}>Custom Domain</h3>
              <p className={styles.featureDesc}>
                Use your own domain name for a fully branded experience. SSL
                certificate included automatically.
              </p>
            </div>
            <div className={`card card-interactive ${styles.featureCard}`}>
              <div className={styles.featureIcon}>🇱🇰</div>
              <h3 className={styles.featureTitle}>Made for Sri Lanka</h3>
              <p className={styles.featureDesc}>
                Prices in LKR, optimized for local networks, and designed with
                Sri Lankan small businesses in mind.
              </p>
            </div>
            <div className={`card card-interactive ${styles.featureCard}`}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Lightning Fast</h3>
              <p className={styles.featureDesc}>
                Your shop loads instantly for every visitor. Built on modern
                infrastructure that scales with your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Get Started in 3 Steps</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Sign Up & Set Up</h3>
              <p className={styles.stepDesc}>
                Create your account, name your shop, add your logo, and enter your
                WhatsApp number.
              </p>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Add Products</h3>
              <p className={styles.stepDesc}>
                Upload product photos, set prices in LKR, and write descriptions. 
                It's as easy as posting to social media.
              </p>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Go Live!</h3>
              <p className={styles.stepDesc}>
                Submit for approval and your shop goes live. Share your link and 
                start receiving WhatsApp orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>
              Ready to Bring Your Business Online?
            </h2>
            <p className={styles.ctaDesc}>
              Join hundreds of Sri Lankan businesses already selling online with
              VendorHub.
            </p>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Create Your Free Shop →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <span className={styles.logo}>
              <span className={styles.logoIcon}>🏪</span>
              <span className={styles.logoText}>VendorHub</span>
            </span>
            <p className={styles.footerDesc}>
              Empowering Sri Lankan businesses to sell online.
            </p>
          </div>
          <p className={styles.footerCopy}>
            © 2026 VendorHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
