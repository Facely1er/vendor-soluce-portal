import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';
import { Role, Permission, UserRole, Organization, TenantContext, SYSTEM_ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../types/rbac';

class RBACService {
  private currentContext: TenantContext | null = null;

  // Initialize RBAC context for current user
  async initializeContext(userId: string): Promise<TenantContext | null> {
    try {
      // Get user's organization and role
      const { data: userRole, error: userRoleError } = await supabase
        .from('vs_user_roles')
        .select(`
          *,
          role:vs_roles(*),
          organization:vs_organizations(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (userRoleError || !userRole) {
        logger.error('Error fetching user role:', userRoleError);
        return null;
      }

      this.currentContext = {
        organization_id: userRole.organization_id || '',
        user_id: userId,
        role: userRole.role.name,
        permissions: userRole.role.permissions || [],
        subscription_tier: userRole.organization?.subscription_tier || 'starter'
      };

      return this.currentContext;
    } catch (error) {
      logger.error('Error initializing RBAC context:', error);
      return null;
    }
  }

  // Get current context
  getCurrentContext(): TenantContext | null {
    return this.currentContext;
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    if (!this.currentContext) return false;
    return this.currentContext.permissions.includes(permission);
  }

  // Check if user has any of the specified permissions
  hasAnyPermission(permissions: string[]): boolean {
    if (!this.currentContext) return false;
    return permissions.some(permission => this.currentContext!.permissions.includes(permission));
  }

  // Check if user has all specified permissions
  hasAllPermissions(permissions: string[]): boolean {
    if (!this.currentContext) return false;
    return permissions.every(permission => this.currentContext!.permissions.includes(permission));
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    if (!this.currentContext) return false;
    return this.currentContext.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    if (!this.currentContext) return false;
    return roles.includes(this.currentContext.role);
  }

  // Check if user can access resource (with optional conditions)
  canAccessResource(resource: string, action: string, conditions?: Record<string, any>): boolean {
    const permission = `${resource}:${action}`;
    if (!this.hasPermission(permission)) return false;

    // Apply additional conditions if provided
    if (conditions) {
      return this.evaluateConditions(conditions);
    }

    return true;
  }

  // Evaluate access conditions
  private evaluateConditions(conditions: Record<string, any>): boolean {
    if (!this.currentContext) return false;

    // Example conditions evaluation
    if (conditions.organization_id && conditions.organization_id !== this.currentContext.organization_id) {
      return false;
    }

    if (conditions.subscription_tier) {
      const tierLevels = { starter: 1, professional: 2, enterprise: 3, federal: 4 };
      const userTier = tierLevels[this.currentContext.subscription_tier as keyof typeof tierLevels] || 0;
      const requiredTier = tierLevels[conditions.subscription_tier as keyof typeof tierLevels] || 0;
      if (userTier < requiredTier) return false;
    }

    return true;
  }

  // Get user's accessible resources
  getAccessibleResources(): string[] {
    if (!this.currentContext) return [];
    
    const resources = new Set<string>();
    this.currentContext.permissions.forEach(permission => {
      const [resource] = permission.split(':');
      resources.add(resource);
    });
    
    return Array.from(resources);
  }

  // Create organization
  async createOrganization(organizationData: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Promise<Organization> {
    const { data, error } = await supabase
      .from('vs_organizations')
      .insert(organizationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create role
  async createRole(roleData: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<Role> {
    const { data, error } = await supabase
      .from('vs_roles')
      .insert(roleData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Assign role to user
  async assignRoleToUser(userId: string, roleId: string, organizationId?: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('vs_user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
        organization_id: organizationId,
        granted_by: this.currentContext?.user_id || userId,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user roles
  async getUserRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('vs_user_roles')
      .select(`
        *,
        role:vs_roles(*),
        organization:vs_organizations(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  // Get organization users
  async getOrganizationUsers(organizationId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('vs_user_roles')
      .select(`
        *,
        user:vs_profiles(*),
        role:vs_roles(*)
      `)
      .eq('organization_id', organizationId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  // Update user role
  async updateUserRole(userRoleId: string, updates: Partial<UserRole>): Promise<UserRole> {
    const { data, error } = await supabase
      .from('vs_user_roles')
      .update(updates)
      .eq('id', userRoleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove user role
  async removeUserRole(userRoleId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_user_roles')
      .update({ is_active: false })
      .eq('id', userRoleId);

    if (error) throw error;
  }

  // Get all roles
  async getRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from('vs_roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Get all permissions
  async getPermissions(): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('vs_permissions')
      .select('*')
      .order('resource', 'action');

    if (error) throw error;
    return data || [];
  }

  // Initialize default roles and permissions
  async initializeDefaultRoles(): Promise<void> {
    try {
      // Create permissions
      const permissions = Object.values(PERMISSIONS).map(permission => {
        const [resource, action] = permission.split(':');
        return {
          name: permission,
          resource,
          action
        };
      });

      const { error: permissionsError } = await supabase
        .from('vs_permissions')
        .upsert(permissions, { onConflict: 'name' });

      if (permissionsError) {
        logger.error('Error creating permissions:', permissionsError);
        return;
      }

      // Create roles
      const roles = Object.entries(ROLE_PERMISSIONS).map(([roleName, rolePermissions]) => ({
        name: roleName,
        description: `System role: ${roleName}`,
        permissions: rolePermissions,
        is_system_role: true
      }));

      const { error: rolesError } = await supabase
        .from('vs_roles')
        .upsert(roles, { onConflict: 'name' });

      if (rolesError) {
        logger.error('Error creating roles:', rolesError);
      }
    } catch (error) {
      logger.error('Error initializing default roles:', error);
    }
  }

  // Check if user can perform action on specific resource
  canPerformAction(resource: string, action: string, resourceId?: string): boolean {
    const permission = `${resource}:${action}`;
    
    if (!this.hasPermission(permission)) {
      return false;
    }

    // Additional resource-specific checks can be added here
    if (resourceId && this.currentContext) {
      // Example: Check if user can only access resources from their organization
      // This would require additional data fetching in a real implementation
    }

    return true;
  }

  // Get filtered data based on user permissions
  async getFilteredData<T>(
    tableName: string,
    selectQuery: string = '*',
    additionalFilters?: Record<string, any>
  ): Promise<T[]> {
    if (!this.currentContext) return [];

    let query = supabase.from(tableName).select(selectQuery);

    // Apply organization filter for multi-tenant data isolation
    if (this.currentContext.organization_id) {
      query = query.eq('organization_id', this.currentContext.organization_id);
    }

    // Apply additional filters
    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) {
      logger.error(`Error fetching filtered data from ${tableName}:`, error);
      return [];
    }

    return data || [];
  }
}

export const rbacService = new RBACService();