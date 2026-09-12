import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  numeric,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* ─── Enums ─── */

export const vendorStatusEnum = pgEnum('vendor_status', [
  'pending',
  'approved',
  'rejected',
  'suspended',
]);

export const stockStatusEnum = pgEnum('stock_status', [
  'in_stock',
  'out_of_stock',
]);

export const domainStatusEnum = pgEnum('domain_status', [
  'pending',
  'verifying',
  'active',
  'failed',
]);

/* ─── Templates ─── */

export const templates = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  componentKey: text('component_key').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

/* ─── Vendors ─── */

export const vendors = pgTable('vendors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(), // FK -> auth.users (Supabase managed)
  shopName: text('shop_name').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull().default('general'),
  description: text('description').notNull().default(''),
  logoUrl: text('logo_url'),
  bannerUrl: text('banner_url'),
  whatsappNumber: text('whatsapp_number').notNull(),
  contactEmail: text('contact_email').notNull(),
  templateId: uuid('template_id').references(() => templates.id),
  status: vendorStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Products ─── */

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  vendorId: uuid('vendor_id')
    .references(() => vendors.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('LKR').notNull(),
  imageUrls: jsonb('image_urls').$type<string[]>().default([]).notNull(),
  stockStatus: stockStatusEnum('stock_status').default('in_stock').notNull(),
  category: text('category').notNull().default('general'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Domains ─── */

export const domains = pgTable('domains', {
  id: uuid('id').defaultRandom().primaryKey(),
  vendorId: uuid('vendor_id')
    .references(() => vendors.id, { onDelete: 'cascade' })
    .notNull(),
  domainName: text('domain_name').notNull(),
  status: domainStatusEnum('status').default('pending').notNull(),
  cloudflareHostnameId: text('cloudflare_hostname_id'),
  sslStatus: text('ssl_status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Admin Actions (audit log) ─── */

export const adminActions = pgTable('admin_actions', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminId: uuid('admin_id').notNull(), // FK -> auth.users
  vendorId: uuid('vendor_id')
    .references(() => vendors.id, { onDelete: 'cascade' })
    .notNull(),
  action: text('action').notNull(), // approve | reject | suspend | reinstate
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Relations ─── */

export const vendorRelations = relations(vendors, ({ one, many }) => ({
  template: one(templates, {
    fields: [vendors.templateId],
    references: [templates.id],
  }),
  products: many(products),
  domains: many(domains),
  adminActions: many(adminActions),
}));

export const productRelations = relations(products, ({ one }) => ({
  vendor: one(vendors, {
    fields: [products.vendorId],
    references: [vendors.id],
  }),
}));

export const domainRelations = relations(domains, ({ one }) => ({
  vendor: one(vendors, {
    fields: [domains.vendorId],
    references: [vendors.id],
  }),
}));

export const adminActionRelations = relations(adminActions, ({ one }) => ({
  vendor: one(vendors, {
    fields: [adminActions.vendorId],
    references: [vendors.id],
  }),
}));

export const templateRelations = relations(templates, ({ many }) => ({
  vendors: many(vendors),
}));

/* ─── Type exports ─── */

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type Domain = typeof domains.$inferSelect;
export type AdminAction = typeof adminActions.$inferSelect;
