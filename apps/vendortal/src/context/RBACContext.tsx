import { logger } from '../utils/logger';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { rbacService } from '../services/rbacService';
import { TenantContext, SYSTEM_ROLES, PERMISSIONS } from '../types/rbac';

interface RBACContextType {
  context: TenantContext | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  canAccessResource: (resource: string, action: string, conditions?: Record<string, any>) => boolean;
  canPerformAction: (resource: string, action: string, resourceId?: string) => boolean;
  getAccessibleResources: () => string[];
  loading: boolean;
  error: string | null;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [context, setContext] = useState<TenantContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeRBAC = async () => {
      if (!user) {
        setContext(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const rbacContext = await rbacService.initializeContext(user.id);
        setContext(rbacContext);
      } catch (err) {
        logger.error('Error initializing RBAC:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize RBAC');
      } finally {
        setLoading(false);
      }
    };

    initializeRBAC();
  }, [user]);

  const hasPermission = (permission: string): boolean => {
    return rbacService.hasPermission(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return rbacService.hasAnyPermission(permissions);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return rbacService.hasAllPermissions(permissions);
  };

  const hasRole = (role: string): boolean => {
    return rbacService.hasRole(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return rbacService.hasAnyRole(roles);
  };

  const canAccessResource = (resource: string, action: string, conditions?: Record<string, any>): boolean => {
    return rbacService.canAccessResource(resource, action, conditions);
  };

  const canPerformAction = (resource: string, action: string, resourceId?: string): boolean => {
    return rbacService.canPerformAction(resource, action, resourceId);
  };

  const getAccessibleResources = (): string[] => {
    return rbacService.getAccessibleResources();
  };

  const value: RBACContextType = {
    context,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccessResource,
    canPerformAction,
    getAccessibleResources,
    loading,
    error
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

// Higher-order component for permission-based rendering
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  fallback?: React.ComponentType<P>
) => {
  return (props: P) => {
    const { hasPermission } = useRBAC();
    
    if (hasPermission(requiredPermission)) {
      return <Component {...props} />;
    }
    
    if (fallback) {
      return <fallback {...props} />;
    }
    
    return null;
  };
};

// Higher-order component for role-based rendering
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
  fallback?: React.ComponentType<P>
) => {
  return (props: P) => {
    const { hasRole } = useRBAC();
    
    if (hasRole(requiredRole)) {
      return <Component {...props} />;
    }
    
    if (fallback) {
      return <fallback {...props} />;
    }
    
    return null;
  };
};

// Hook for conditional rendering based on permissions
export const usePermission = (permission: string): boolean => {
  const { hasPermission } = useRBAC();
  return hasPermission(permission);
};

// Hook for conditional rendering based on roles
export const useRole = (role: string): boolean => {
  const { hasRole } = useRBAC();
  return hasRole(role);
};

// Hook for multiple permission checks
export const usePermissions = (permissions: string[]): boolean[] => {
  const { hasPermission } = useRBAC();
  return permissions.map(permission => hasPermission(permission));
};

// Hook for multiple role checks
export const useRoles = (roles: string[]): boolean[] => {
  const { hasRole } = useRBAC();
  return roles.map(role => hasRole(role));
};

// Permission constants for easy use
export { PERMISSIONS, SYSTEM_ROLES };