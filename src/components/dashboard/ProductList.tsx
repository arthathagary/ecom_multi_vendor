'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, deleteProduct } from '@/app/(dashboard)/actions';
import { formatPrice } from '@/lib/utils';
import type { Product, Vendor } from '@/db/schema';

interface ProductListProps {
  products: Product[];
  vendor: Vendor;
}

export default function ProductList({ products, vendor }: ProductListProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'general',
    stockStatus: 'in_stock' as 'in_stock' | 'out_of_stock',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'general',
      stockStatus: 'in_stock',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stockStatus: product.stockStatus,
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('price', formData.price);
    fd.append('category', formData.category);
    fd.append('stockStatus', formData.stockStatus);
    fd.append('imageUrls', JSON.stringify([]));

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, fd);
        setMessage({ type: 'success', text: 'Product updated!' });
      } else {
        await createProduct(fd);
        setMessage({ type: 'success', text: 'Product created!' });
      }
      resetForm();
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' });
    }

    setLoading(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      await deleteProduct(productId);
      setMessage({ type: 'success', text: 'Product deleted.' });
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete product.' });
    }
    setLoading(false);
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            Products
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {products.length} {products.length === 1 ? 'product' : 'products'} in your shop
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
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

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{ marginBottom: 'var(--space-6)', maxWidth: '600px' }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
            {editingProduct ? 'Edit Product' : 'New Product'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label htmlFor="productName" className="form-label">Product Name *</label>
              <input
                id="productName"
                type="text"
                className="form-input"
                placeholder="Product name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productDescription" className="form-label">Description</label>
              <textarea
                id="productDescription"
                className="form-input form-textarea"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label htmlFor="productPrice" className="form-label">Price (LKR) *</label>
                <input
                  id="productPrice"
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productCategory" className="form-label">Category</label>
                <select
                  id="productCategory"
                  className="form-input form-select"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="general">General</option>
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="food">Food</option>
                  <option value="beauty">Beauty</option>
                  <option value="home">Home</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Stock Status</label>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  <input
                    type="radio"
                    name="stockStatus"
                    value="in_stock"
                    checked={formData.stockStatus === 'in_stock'}
                    onChange={() => setFormData((p) => ({ ...p, stockStatus: 'in_stock' }))}
                  />
                  In Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  <input
                    type="radio"
                    name="stockStatus"
                    value="out_of_stock"
                    checked={formData.stockStatus === 'out_of_stock'}
                    onChange={() => setFormData((p) => ({ ...p, stockStatus: 'out_of_stock' }))}
                  />
                  Out of Stock
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" /> Saving...
                  </>
                ) : editingProduct ? (
                  'Update Product'
                ) : (
                  'Add Product'
                )}
              </button>
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Product List */}
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">No products yet</h3>
          <p className="empty-state-description">
            Add your first product to get your shop started.
          </p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add First Product
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {products.map((product) => (
            <div key={product.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <h3 style={{ fontWeight: 600 }}>{product.name}</h3>
                  <span className={`badge badge-${product.stockStatus === 'in_stock' ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                  {product.description || 'No description'}
                </p>
                <p style={{ fontWeight: 600, color: 'var(--color-primary-700)' }}>
                  {formatPrice(product.price)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.id)}
                  disabled={loading}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
