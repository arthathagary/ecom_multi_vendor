'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  createVendorProfile,
  updateVendorProfile,
  checkSlugAvailability,
  submitForReview,
} from '@/app/(dashboard)/actions';
import { slugify } from '@/lib/utils';
import type { Vendor } from '@/db/schema';

interface ShopProfileFormProps {
  vendor: Vendor | null;
}

export default function ShopProfileForm({ vendor }: ShopProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);

  const [formData, setFormData] = useState({
    shopName: vendor?.shopName || '',
    slug: vendor?.slug || '',
    category: vendor?.category || 'general',
    description: vendor?.description || '',
    whatsappNumber: vendor?.whatsappNumber || '',
    contactEmail: vendor?.contactEmail || '',
  });

  // Debounced slug check
  const checkSlug = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null);
      return;
    }
    if (vendor && slug === vendor.slug) {
      setSlugAvailable(true);
      return;
    }
    setSlugChecking(true);
    const result = await checkSlugAvailability(slug);
    setSlugAvailable(result.available);
    setSlugChecking(false);
  }, [vendor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.slug) {
        checkSlug(formData.slug);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, checkSlug]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      shopName: name,
      slug: vendor ? prev.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    try {
      const result = vendor
        ? await updateVendorProfile(fd)
        : await createVendorProfile(fd);

      if ('error' in result && result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: vendor ? 'Shop profile updated!' : 'Shop profile created!' });
        router.refresh();
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }

    setLoading(false);
  };

  const handleSubmitForReview = async () => {
    setLoading(true);
    try {
      await submitForReview();
      setMessage({ type: 'success', text: 'Shop submitted for review!' });
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit for review.' });
    }
    setLoading(false);
  };

  const categories = [
    'general',
    'clothing',
    'electronics',
    'food',
    'beauty',
    'home',
    'sports',
    'books',
    'toys',
    'jewelry',
    'health',
    'automotive',
    'other',
  ];

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          {vendor ? 'Shop Profile' : 'Set Up Your Shop'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {vendor
            ? 'Update your shop details'
            : 'Fill in your shop details to get started'}
        </p>
      </div>

      {message && (
        <div
          className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}
          style={{ marginBottom: 'var(--space-6)' }}
        >
          <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="form-group">
            <label htmlFor="shopName" className="form-label">
              Shop Name *
            </label>
            <input
              id="shopName"
              type="text"
              className="form-input"
              placeholder="My Awesome Shop"
              value={formData.shopName}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug" className="form-label">
              Shop URL *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                /store/
              </span>
              <input
                id="slug"
                type="text"
                className={`form-input ${slugAvailable === false ? 'error' : ''}`}
                placeholder="my-shop"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: slugify(e.target.value),
                  }))
                }
                required
                minLength={3}
                style={{ flex: 1 }}
              />
            </div>
            <span className={slugAvailable === false ? 'form-error' : 'form-helper'}>
              {slugChecking
                ? '⏳ Checking availability...'
                : slugAvailable === true
                  ? '✅ This URL is available!'
                  : slugAvailable === false
                    ? '❌ This URL is taken. Try another one.'
                    : 'Min. 3 characters. Only lowercase letters, numbers, and hyphens.'}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              className="form-input form-select"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Shop Description
            </label>
            <textarea
              id="description"
              className="form-input form-textarea"
              placeholder="Tell customers what your shop is about..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsappNumber" className="form-label">
              WhatsApp Number * (with country code)
            </label>
            <input
              id="whatsappNumber"
              type="tel"
              className="form-input"
              placeholder="+94771234567"
              value={formData.whatsappNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  whatsappNumber: e.target.value,
                }))
              }
              required
            />
            <span className="form-helper">
              Include country code (e.g., +94 for Sri Lanka)
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail" className="form-label">
              Contact Email *
            </label>
            <input
              id="contactEmail"
              type="email"
              className="form-input"
              placeholder="shop@example.com"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactEmail: e.target.value,
                }))
              }
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || slugAvailable === false}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Saving...
                </>
              ) : vendor ? (
                'Save Changes'
              ) : (
                'Create Shop'
              )}
            </button>

            {vendor && vendor.status !== 'pending' && vendor.status !== 'approved' && (
              <button
                type="button"
                className="btn btn-accent"
                onClick={handleSubmitForReview}
                disabled={loading}
              >
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
