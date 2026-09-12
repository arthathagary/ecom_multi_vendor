/**
 * Cloudflare for SaaS - Custom Hostnames API wrapper
 * 
 * Phase 5 implementation — requires Cloudflare Business/Enterprise plan
 * with Custom Hostnames add-on enabled.
 * 
 * Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID in .env.local
 */

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

interface CloudflareHostnameResponse {
  success: boolean;
  result: {
    id: string;
    hostname: string;
    status: string;
    ssl: {
      status: string;
    };
    verification_errors?: string[];
  };
  errors: Array<{ code: number; message: string }>;
}

/**
 * Create a custom hostname in Cloudflare for SaaS
 */
export async function createCustomHostname(
  domain: string
): Promise<{ hostnameId: string; status: string } | { error: string }> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId) {
    return { error: 'Cloudflare credentials not configured' };
  }

  try {
    const response = await fetch(
      `${CLOUDFLARE_API_BASE}/zones/${zoneId}/custom_hostnames`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostname: domain,
          ssl: {
            method: 'http',
            type: 'dv',
            settings: {
              min_tls_version: '1.2',
            },
          },
        }),
      }
    );

    const data: CloudflareHostnameResponse = await response.json();

    if (!data.success) {
      return { error: data.errors.map((e) => e.message).join(', ') };
    }

    return {
      hostnameId: data.result.id,
      status: data.result.status,
    };
  } catch (error) {
    return { error: `Failed to create custom hostname: ${error}` };
  }
}

/**
 * Check the status of a custom hostname
 */
export async function checkHostnameStatus(
  hostnameId: string
): Promise<{ status: string; sslStatus: string } | { error: string }> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId) {
    return { error: 'Cloudflare credentials not configured' };
  }

  try {
    const response = await fetch(
      `${CLOUDFLARE_API_BASE}/zones/${zoneId}/custom_hostnames/${hostnameId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: CloudflareHostnameResponse = await response.json();

    if (!data.success) {
      return { error: data.errors.map((e) => e.message).join(', ') };
    }

    return {
      status: data.result.status,
      sslStatus: data.result.ssl.status,
    };
  } catch (error) {
    return { error: `Failed to check hostname status: ${error}` };
  }
}

/**
 * Delete a custom hostname
 */
export async function deleteCustomHostname(
  hostnameId: string
): Promise<{ success: boolean } | { error: string }> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId) {
    return { error: 'Cloudflare credentials not configured' };
  }

  try {
    const response = await fetch(
      `${CLOUDFLARE_API_BASE}/zones/${zoneId}/custom_hostnames/${hostnameId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return { success: data.success };
  } catch (error) {
    return { error: `Failed to delete custom hostname: ${error}` };
  }
}
