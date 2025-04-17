/**
 * Get the current tenant ID from various possible sources
 * (URL path, session, cookie, etc.)
 */
export function getCurrentTenantId(): string {
  // In a browser environment
  if (typeof window !== 'undefined') {
    // Extract from URL path (assuming URL like /tenant-name/...)
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1]) {
      return pathParts[1];
    }
    
    // Could also check for tenant in local storage, cookies, etc.
  }
  
  // In server environment, could check request headers, etc.
  
  // Default tenant if nothing else is found
  return process.env.DEFAULT_TENANT_ID || 'default';
}
