// RBAC (Role-Based Access Control) Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  organization_id?: string;
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  subscription_tier: 'starter' | 'professional' | 'enterprise' | 'federal';
  max_users: number;
  max_vendors: number;
  settings: OrganizationSettings;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettings {
  sso_enabled: boolean;
  sso_provider?: 'saml' | 'oidc' | 'ldap';
  sso_config?: Record<string, any>;
  data_retention_days: number;
  audit_logging_enabled: boolean;
  risk_thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  notification_preferences: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
  };
}

export interface TenantContext {
  organization_id: string;
  user_id: string;
  role: string;
  permissions: string[];
  subscription_tier: string;
}

// Predefined system roles
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'org_admin',
  SECURITY_MANAGER: 'security_manager',
  COMPLIANCE_OFFICER: 'compliance_officer',
  VENDOR_MANAGER: 'vendor_manager',
  ASSESSOR: 'assessor',
  VENDOR: 'vendor',
  VIEWER: 'viewer'
} as const;

// Predefined permissions
export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_INVITE: 'user:invite',
  
  // Organization Management
  ORG_CREATE: 'organization:create',
  ORG_READ: 'organization:read',
  ORG_UPDATE: 'organization:update',
  ORG_DELETE: 'organization:delete',
  ORG_SETTINGS: 'organization:settings',
  
  // Vendor Management
  VENDOR_CREATE: 'vendor:create',
  VENDOR_READ: 'vendor:read',
  VENDOR_UPDATE: 'vendor:update',
  VENDOR_DELETE: 'vendor:delete',
  VENDOR_APPROVE: 'vendor:approve',
  VENDOR_REJECT: 'vendor:reject',
  
  // Assessment Management
  ASSESSMENT_CREATE: 'assessment:create',
  ASSESSMENT_READ: 'assessment:read',
  ASSESSMENT_UPDATE: 'assessment:update',
  ASSESSMENT_DELETE: 'assessment:delete',
  ASSESSMENT_SEND: 'assessment:send',
  ASSESSMENT_REVIEW: 'assessment:review',
  ASSESSMENT_APPROVE: 'assessment:approve',
  
  // Risk Management
  RISK_READ: 'risk:read',
  RISK_UPDATE: 'risk:update',
  RISK_ESCALATE: 'risk:escalate',
  RISK_MITIGATE: 'risk:mitigate',
  
  // Compliance Management
  COMPLIANCE_READ: 'compliance:read',
  COMPLIANCE_UPDATE: 'compliance:update',
  COMPLIANCE_AUDIT: 'compliance:audit',
  COMPLIANCE_REPORT: 'compliance:report',
  
  // Asset Management
  ASSET_CREATE: 'asset:create',
  ASSET_READ: 'asset:read',
  ASSET_UPDATE: 'asset:update',
  ASSET_DELETE: 'asset:delete',
  
  // Reporting
  REPORT_READ: 'report:read',
  REPORT_CREATE: 'report:create',
  REPORT_EXPORT: 'report:export',
  
  // System Administration
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_AUDIT: 'system:audit',
  SYSTEM_BACKUP: 'system:backup'
} as const;

// Role-Permission mappings
export const ROLE_PERMISSIONS = {
  [SYSTEM_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [SYSTEM_ROLES.ORG_ADMIN]: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_INVITE,
    PERMISSIONS.ORG_READ,
    PERMISSIONS.ORG_UPDATE,
    PERMISSIONS.ORG_SETTINGS,
    PERMISSIONS.VENDOR_CREATE,
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.VENDOR_UPDATE,
    PERMISSIONS.VENDOR_DELETE,
    PERMISSIONS.VENDOR_APPROVE,
    PERMISSIONS.VENDOR_REJECT,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_DELETE,
    PERMISSIONS.ASSESSMENT_SEND,
    PERMISSIONS.ASSESSMENT_REVIEW,
    PERMISSIONS.ASSESSMENT_APPROVE,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.RISK_UPDATE,
    PERMISSIONS.RISK_ESCALATE,
    PERMISSIONS.RISK_MITIGATE,
    PERMISSIONS.COMPLIANCE_READ,
    PERMISSIONS.COMPLIANCE_UPDATE,
    PERMISSIONS.COMPLIANCE_AUDIT,
    PERMISSIONS.COMPLIANCE_REPORT,
    PERMISSIONS.ASSET_CREATE,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_UPDATE,
    PERMISSIONS.ASSET_DELETE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_EXPORT
  ],
  [SYSTEM_ROLES.SECURITY_MANAGER]: [
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.VENDOR_UPDATE,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_SEND,
    PERMISSIONS.ASSESSMENT_REVIEW,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.RISK_UPDATE,
    PERMISSIONS.RISK_ESCALATE,
    PERMISSIONS.RISK_MITIGATE,
    PERMISSIONS.COMPLIANCE_READ,
    PERMISSIONS.COMPLIANCE_UPDATE,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_UPDATE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_CREATE
  ],
  [SYSTEM_ROLES.COMPLIANCE_OFFICER]: [
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.ASSESSMENT_REVIEW,
    PERMISSIONS.ASSESSMENT_APPROVE,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.COMPLIANCE_READ,
    PERMISSIONS.COMPLIANCE_UPDATE,
    PERMISSIONS.COMPLIANCE_AUDIT,
    PERMISSIONS.COMPLIANCE_REPORT,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_CREATE
  ],
  [SYSTEM_ROLES.VENDOR_MANAGER]: [
    PERMISSIONS.VENDOR_CREATE,
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.VENDOR_UPDATE,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_SEND,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.REPORT_READ
  ],
  [SYSTEM_ROLES.ASSESSOR]: [
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_REVIEW,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.COMPLIANCE_READ,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.REPORT_READ
  ],
  [SYSTEM_ROLES.VENDOR]: [
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.RISK_READ
  ],
  [SYSTEM_ROLES.VIEWER]: [
    PERMISSIONS.VENDOR_READ,
    PERMISSIONS.ASSESSMENT_READ,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.COMPLIANCE_READ,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.REPORT_READ
  ]
} as const;