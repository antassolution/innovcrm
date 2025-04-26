import { User, PermissionType } from "@/types";

/**
 * Checks if a user has the required permission
 */
export function hasPermission(user: User | null | undefined, permission: PermissionType): boolean {
  // Admin role has all permissions
  if (user?.role === 'admin') {
    return true;
  }
  console.log('User permissions:', user?.permissions);
  // Check if user has the specific permission
  return user?.permissions?.includes(permission) || false;
}

/**
 * Check if user has any of the provided permissions or is admin
 */
export function hasAnyPermission(user: User | null | undefined, permissions: PermissionType[]): boolean {
  // Admin role has all permissions
  if (user?.role === 'admin') {
    return true;
  }
  
  // Check if user has any of the specified permissions
  if (user?.permissions && user.permissions.length > 0) {
    return permissions.some(permission => user.permissions?.includes(permission));
  }
  
  return false;
}

/**
 * Check if user has all of the provided permissions or is admin
 */
export function hasAllPermissions(user: User | null | undefined, permissions: PermissionType[]): boolean {
  // Admin role has all permissions
  if (user?.role === 'admin') {
    return true;
  }
  
  // Check if user has all of the specified permissions
  if (user?.permissions && user.permissions.length > 0) {
    return permissions.every(permission => user.permissions?.includes(permission));
  }
  
  return false;
}