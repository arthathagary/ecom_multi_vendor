# Build Agenda: Multi-Vendor Website Builder Platform (Sri Lanka)

> Purpose: this file is a build spec meant to be handed to an AI coding
> assistant (e.g. Claude Code) to generate the application. It reflects the
> finalized architecture and scope after several rounds of revision.

---

## 1. Project Context

A no-code, multi-tenant website builder for Sri Lankan small business owners
who currently have no online presence. Vendors sign up, fill in shop and
product details using a single template, get approved by an admin, and go
live on a subdomain (with optional custom domain). Ordering happens via a
direct WhatsApp link — no in-platform checkout or payment processing in this
phase.

---

## 2. Confirmed Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript — consolidated frontend + backend (Server Actions / Route Handlers), single codebase |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle ORM |
| Auth | Supabase Auth (email or OTP), with role field for `vendor` vs `admin` |
| Authorization | Supabase Row-Level Security (RLS) — enforce tenant isolation at the DB level |
| File Storage | Supabase Storage (logos, banners, product images) |
| Hosting | Vercel |
| Caching Strategy | Next.js Incremental Static Regeneration (ISR) with `revalidateTag` — no custom build queue |
| Multi-tenant Routing | Next.js Edge Middleware, hostname → tenant_id lookup via a fast KV/edge cache (e.g. Vercel Edge Config), NOT a direct Postgres query per request |
| Custom Domains & SSL | Cloudflare for SaaS (Custom Hostnames API) — 100 hostnames free, then $0.10/hostname/month up to 50,000 |
| Ordering | Direct WhatsApp deep link (`wa.me`), no payment gateway in this phase |

---

## 3. Data Model (Drizzle / Postgres)

```
vendors
  id                uuid, pk
  user_id           uuid, fk -> auth.users
  shop_name         text
  slug              text, unique (used for subdomain)
  category          text
  description       text
  logo_url          text, nullable
  banner_url        text, nullable
  whatsapp_number   text
  contact_email     text
  template_id       uuid, fk -> templates.id
  status            enum: pending | approved | rejected | suspended
  created_at        timestamptz
  updated_at        timestamptz

products
  id                uuid, pk
  vendor_id         uuid, fk -> vendors.id
  name              text
  description       text
  price             numeric
  currency          text, default 'LKR'
  image_urls        text[] / jsonb
  stock_status      enum: in_stock | out_of_stock
  category          text
  created_at        timestamptz
  updated_at        timestamptz

templates
  id                uuid, pk
  name              text
  slug              text, unique
  component_key     text   -- maps to a React component in the templates folder
  is_active         boolean, default true

domains
  id                    uuid, pk
  vendor_id             uuid, fk -> vendors.id
  domain_name           text
  status                enum: pending | verifying | active | failed
  cloudflare_hostname_id text, nullable
  ssl_status            text, nullable
  created_at            timestamptz

admin_actions   (lightweight audit log — optional but recommended)
  id            uuid, pk
  admin_id      uuid, fk -> auth.users
  vendor_id     uuid, fk -> vendors.id
  action        text   -- approve | reject | suspend | reinstate
  notes         text, nullable
  created_at    timestamptz
```

**RLS rules to implement:**
- Vendors can only read/write their own `vendors`, `products`, and `domains` rows (match on `user_id` / `vendor_id`).
- Public (anon) role can only read `vendors`, `products` where `status = 'approved'`.
- Admin role bypasses vendor-level restrictions (checked via a role claim, not by table structure).

---

## 4. Architecture & Request Flow

1. Request comes in for `shopname.platform.lk` or a linked custom domain.
2. Edge Middleware reads the hostname, looks up the matching `tenant_id`/`vendor_id` from a fast edge cache (Edge Config or KV — not a live DB call), and internally rewrites the request to `app/storefront/[vendorId]/...`.
3. The storefront route is only served if `vendor.status === 'approved'` — otherwise return 404 / "not live yet" page.
4. Storefront pages are cached via ISR, tagged with `vendor-{vendorId}`.
5. Any vendor data mutation (product edit, profile edit) calls `revalidateTag('vendor-{vendorId}')` so the next visitor gets fresh content immediately — no rebuild queue needed.
6. Product pages render a WhatsApp CTA button that builds a `wa.me/{vendor.whatsapp_number}?text=...` link pre-filled with product name, price, and quantity.
7. Custom domain flow: vendor submits a domain → Server Action calls Cloudflare for SaaS API to create a custom hostname → poll/verify → update `domains.status` → once active, middleware resolves that hostname to the same `vendor_id` as the subdomain.

---

## 5. Feature Build Phases

### Phase 1 — Foundation
- [ ] Scaffold Next.js App Router + TypeScript project
- [ ] Set up Supabase project (Auth, Postgres, Storage)
- [ ] Define Drizzle schema per Section 3, run migrations
- [ ] Write RLS policies per Section 3
- [ ] Deploy skeleton to Vercel
- [ ] Build Edge Middleware: hostname parsing + tenant lookup + rewrite (with Edge Config/KV cache)

### Phase 2 — Vendor Onboarding & Dashboard
- [ ] Vendor sign-up / login (Supabase Auth)
- [ ] Protected vendor dashboard shell
- [ ] Shop profile form: name, slug (live uniqueness check), category, description, logo/banner upload, WhatsApp number, contact email
- [ ] Product CRUD form: name, description, price, images, stock status, category
- [ ] Template picker (single active template for MVP, UI built to support more later)
- [ ] "Submit for review" action → sets `vendors.status = 'pending'`
- [ ] Vendor-only preview route showing the storefront before approval

### Phase 3 — Admin Panel
- [ ] Admin login (role-gated)
- [ ] Approval queue: list vendors where `status = 'pending'`
- [ ] Approve action → `status = 'approved'`, triggers `revalidateTag`
- [ ] Reject action → `status = 'rejected'` with optional notes
- [ ] Vendor management list with suspend/reinstate actions
- [ ] Log actions to `admin_actions`

### Phase 4 — Public Storefront & WhatsApp Ordering
- [ ] Storefront routes rendered via Server Components from `templates/{component_key}`
- [ ] Home / About / Product listing / Product detail pages
- [ ] WhatsApp CTA button with pre-filled message (product, price, qty)
- [ ] Gate storefront rendering on `status === 'approved'`
- [ ] Confirm ISR caching + `revalidateTag` wired into every vendor/product mutation

### Phase 5 — Custom Domains
- [ ] Domain entry UI in vendor dashboard, showing required DNS records
- [ ] Server Action: Cloudflare for SaaS API integration (create hostname, poll verification, store `cloudflare_hostname_id`, `ssl_status`)
- [ ] Domain status view (pending/verifying/active/failed) with manual refresh
- [ ] Middleware updated to resolve tenant from custom domain, not just subdomain

### Phase 6 — QA & Launch
- [ ] End-to-end test: sign up → build shop → submit → admin approves → storefront live → WhatsApp order link works → custom domain (optional) resolves correctly
- [ ] RLS policy verification (attempt cross-tenant reads/writes and confirm they fail)
- [ ] Mobile responsiveness check on dashboard + storefront
- [ ] Basic error logging/monitoring in place

---

## 6. Explicitly Out of Scope for This Build

- Payment gateway integration (PayHere / WebXPay)
- In-platform cart or checkout
- Commission tracking, vendor ledger, payout automation
- Multiple templates (build one well, expand later)
- WhatsApp Business API (use free `wa.me` links only, no paid messaging API)

---

## 7. Assumptions Made (confirm or adjust before building)

- **Admin approval gate re-added.** An earlier draft of this plan dropped the pre-publish approval step; it's reinstated here per the original requirement that vendors only go live after admin approval. Remove Phase 3's approve/reject gate if self-serve publishing is actually preferred.
- Single template is hardcoded as active for MVP; the picker UI exists but only offers one real choice.
- All prices assumed in LKR.
