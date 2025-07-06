import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Extend Request type to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userPermissions?: string[];
      userRoles?: string[];
    }
  }
}

/**
 * Middleware to check if user has specific permission
 */
export function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId; // Assuming authentication middleware sets this
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const hasPermission = await storage.userHasPermission(userId, resource, action);
      
      if (!hasPermission) {
        return res.status(403).json({ 
          message: "Insufficient permissions",
          required: `${resource}.${action}`
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

/**
 * Middleware to check if user has any of the specified roles
 */
export function requireRole(...roleNames: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const hasRole = await storage.userHasAnyRole(userId, roleNames);
      
      if (!hasRole) {
        return res.status(403).json({ 
          message: "Insufficient role privileges",
          required: roleNames
        });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

/**
 * Middleware to load user permissions and roles into request
 */
export async function loadUserPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return next();
    }

    // Load user's effective permissions (from roles and direct assignments)
    const userWithRoles = await storage.getUserWithRolesAndPermissions(userId);
    
    if (userWithRoles) {
      // Extract permissions and roles
      const permissions: string[] = [];
      const roles: string[] = [];
      
      // Add role-based permissions
      if (userWithRoles.userRoles) {
        for (const userRole of userWithRoles.userRoles) {
          if (userRole.role) {
            roles.push(userRole.role.name);
            // Note: This would need proper implementation based on your relation structure
          }
        }
      }
      
      req.userPermissions = permissions;
      req.userRoles = roles;
    }

    next();
  } catch (error) {
    console.error("Load permissions error:", error);
    next(); // Continue without permissions rather than failing
  }
}

/**
 * Check if user has permission for a specific resource and action
 */
export async function checkUserPermission(userId: number, resource: string, action: string): Promise<boolean> {
  try {
    return await storage.userHasPermission(userId, resource, action);
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}

/**
 * Get all permissions for a user (for UI display)
 */
export async function getUserEffectivePermissions(userId: number): Promise<string[]> {
  try {
    const permissions: string[] = [];
    
    // Get direct permissions
    const userPermissions = await storage.getUserPermissions(userId);
    for (const up of userPermissions) {
      if (up.granted) {
        const permission = await storage.getPermission(up.permissionId);
        if (permission && permission.isActive) {
          permissions.push(`${permission.resource}.${permission.action}`);
        }
      }
    }
    
    // Get role-based permissions
    const userRoles = await storage.getUserRoles(userId);
    for (const ur of userRoles) {
      const rolePermissions = await storage.getRolePermissions(ur.roleId);
      for (const rp of rolePermissions) {
        const permission = await storage.getPermission(rp.permissionId);
        if (permission && permission.isActive) {
          permissions.push(`${permission.resource}.${permission.action}`);
        }
      }
    }
    
    // Return unique permissions
    return [...new Set(permissions)];
  } catch (error) {
    console.error("Get effective permissions error:", error);
    return [];
  }
}

/**
 * Resource-based permission helpers
 */
export const Permissions = {
  // User management
  USERS_CREATE: "users.create",
  USERS_READ: "users.read",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  USERS_MANAGE_ROLES: "users.manage_roles",

  // Role management
  ROLES_CREATE: "roles.create",
  ROLES_READ: "roles.read",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",
  ROLES_MANAGE_PERMISSIONS: "roles.manage_permissions",

  // Content management
  PAGES_CREATE: "pages.create",
  PAGES_READ: "pages.read",
  PAGES_UPDATE: "pages.update",
  PAGES_DELETE: "pages.delete",
  PAGES_PUBLISH: "pages.publish",

  POSTS_CREATE: "posts.create",
  POSTS_READ: "posts.read",
  POSTS_UPDATE: "posts.update",
  POSTS_DELETE: "posts.delete",
  POSTS_PUBLISH: "posts.publish",

  // Settings
  SETTINGS_READ: "settings.read",
  SETTINGS_UPDATE: "settings.update",

  // Dashboard
  DASHBOARD_ACCESS: "dashboard.access",
} as const;

export type PermissionKey = keyof typeof Permissions;
export type PermissionValue = typeof Permissions[PermissionKey];