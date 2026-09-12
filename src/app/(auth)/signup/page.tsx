'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from '../auth.module.css';

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'vendor',
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // If email confirmation is disabled, redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 1500);
  };

  if (success) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authGlow} />
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>
                ✉️
              </div>
              <h1 className={styles.authTitle}>Check your email</h1>
              <p className={styles.authSubtitle}>
                We&apos;ve sent you a confirmation link. Click it to activate
                your account, then you can set up your shop!
              </p>
            </div>
            <Link
              href="/login"
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authGlow} />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <Link href="/" className={styles.authLogo}>
              <span>🏪</span>
              <span className={styles.authLogoText}>VendorHub</span>
            </Link>
            <h1 className={styles.authTitle}>Create your shop</h1>
            <p className={styles.authSubtitle}>
              Start selling online in minutes — completely free
            </p>
          </div>

          <form onSubmit={handleSignUp} className={styles.authForm}>
            {error && (
              <div className="alert alert-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating account...
                </>
              ) : (
                'Create Free Account'
              )}
            </button>

            <p className={styles.authTerms}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className={styles.authFooter}>
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
