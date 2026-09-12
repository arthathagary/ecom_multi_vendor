-- ============================================================
-- RLS Policies for Multi-Vendor Platform
-- Run this in your Supabase SQL Editor after schema migration
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- ─── Helper: Check if user is admin ───
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TEMPLATES - Readable by all, writable by admin only
-- ============================================================

CREATE POLICY "Templates are viewable by everyone"
  ON templates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage templates"
  ON templates FOR ALL
  USING (is_admin());

-- ============================================================
-- VENDORS
-- ============================================================

-- Public can read approved vendors
CREATE POLICY "Public can view approved vendors"
  ON vendors FOR SELECT
  USING (status = 'approved');

-- Vendors can read their own record (any status)
CREATE POLICY "Vendors can view own record"
  ON vendors FOR SELECT
  USING (auth.uid() = user_id);

-- Vendors can insert their own record
CREATE POLICY "Vendors can create own record"
  ON vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Vendors can update their own record
CREATE POLICY "Vendors can update own record"
  ON vendors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all vendors"
  ON vendors FOR ALL
  USING (is_admin());

-- ============================================================
-- PRODUCTS
-- ============================================================

-- Public can read products of approved vendors
CREATE POLICY "Public can view products of approved vendors"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.status = 'approved'
    )
  );

-- Vendors can read their own products
CREATE POLICY "Vendors can view own products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Vendors can insert products for their own shop
CREATE POLICY "Vendors can create own products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Vendors can update their own products
CREATE POLICY "Vendors can update own products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Vendors can delete their own products
CREATE POLICY "Vendors can delete own products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Admins can manage all products
CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
  USING (is_admin());

-- ============================================================
-- DOMAINS
-- ============================================================

-- Vendors can read their own domains
CREATE POLICY "Vendors can view own domains"
  ON domains FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = domains.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Vendors can insert domains for their own shop
CREATE POLICY "Vendors can create own domains"
  ON domains FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = domains.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Vendors can update their own domains
CREATE POLICY "Vendors can update own domains"
  ON domains FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = domains.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Admins can manage all domains
CREATE POLICY "Admins can manage all domains"
  ON domains FOR ALL
  USING (is_admin());

-- ============================================================
-- ADMIN ACTIONS - Only admins can read/write
-- ============================================================

CREATE POLICY "Admins can manage admin actions"
  ON admin_actions FOR ALL
  USING (is_admin());

-- Vendors can read actions about their own shop (read-only)
CREATE POLICY "Vendors can view actions on own shop"
  ON admin_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = admin_actions.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- ============================================================
-- STORAGE POLICIES (run in Supabase Storage settings)
-- ============================================================
-- Create a bucket named 'vendor-assets' with public access
-- Then add these policies:
--
-- SELECT (read): allow public access to all files
-- INSERT: allow authenticated users to upload to their own folder
--   (path starts with their user_id)
-- UPDATE: allow authenticated users to update their own files
-- DELETE: allow authenticated users to delete their own files

-- ============================================================
-- SEED DATA: Default template
-- ============================================================

INSERT INTO templates (name, slug, component_key, is_active)
VALUES ('Classic Shop', 'classic', 'classic', true)
ON CONFLICT (slug) DO NOTHING;
