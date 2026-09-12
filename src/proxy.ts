import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a Supabase client for session refresh
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Auth Protection ───
  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Check admin role from user metadata
    const role = user.user_metadata?.role;
    if (role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/signup') && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // ─── Multi-tenant Storefront Routing ───
  const hostname = request.headers.get('host') || '';
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost:3000';

  // Skip for localhost development (use path-based /store/[slug] instead)
  if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    // Check if this is a subdomain request
    if (hostname.endsWith(`.${platformDomain}`)) {
      const subdomain = hostname.replace(`.${platformDomain}`, '');

      // Don't rewrite for system subdomains
      if (subdomain && subdomain !== 'www' && subdomain !== 'admin') {
        // Rewrite to the storefront route
        const url = request.nextUrl.clone();
        url.pathname = `/store/${subdomain}${pathname === '/' ? '' : pathname}`;
        return NextResponse.rewrite(url);
      }
    }

    // Check for custom domain mapping
    // In production, this would check an edge cache/KV store
    // For now, pass the hostname as a header for the route to resolve
    if (!hostname.includes(platformDomain)) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-custom-domain', hostname);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
