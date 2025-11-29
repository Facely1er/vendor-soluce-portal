# VendorSoluce Security Guide

## Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [Infrastructure Security](#infrastructure-security)
6. [Compliance](#compliance)
7. [Security Monitoring](#security-monitoring)
8. [Incident Response](#incident-response)
9. [Security Best Practices](#security-best-practices)
10. [Security Checklist](#security-checklist)

## Security Overview

VendorSoluce is built with security-first principles to protect sensitive supply chain data and ensure compliance with industry standards. This guide outlines our security measures, best practices, and recommendations for secure usage.

### Security Principles

- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Minimal necessary access permissions
- **Zero Trust**: Verify everything, trust nothing
- **Data Minimization**: Collect only necessary data
- **Encryption Everywhere**: Data encrypted in transit and at rest

## Authentication & Authorization

### Multi-Factor Authentication (MFA)

#### Implementation

```typescript
// src/components/auth/MFASetup.tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const MFASetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(false);

  const enableMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) throw error;
      setQrCode(data.qr_code);
    } catch (error) {
      console.error('MFA setup error:', error);
    }
  };

  const verifyMFA = async (token: string) => {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: 'factor_id',
        code: token,
      });

      if (error) throw error;
      setIsEnabled(true);
    } catch (error) {
      console.error('MFA verification error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3>Two-Factor Authentication</h3>
      {!isEnabled ? (
        <div>
          <button onClick={enableMFA}>Enable MFA</button>
          {qrCode && (
            <div>
              <img src={qrCode} alt="QR Code" />
              <p>Scan with your authenticator app</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-green-600">MFA is enabled</p>
      )}
    </div>
  );
};
```

### Role-Based Access Control (RBAC)

#### Database Policies

```sql
-- Row Level Security Policies
CREATE POLICY "Users can only access their organization's data" ON vendors
  FOR ALL USING (
    organization_id = (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Admin role policy
CREATE POLICY "Admins can access all data" ON vendors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Read-only role policy
CREATE POLICY "Read-only users can only view data" ON vendors
  FOR SELECT USING (
    organization_id = (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
  );
```

#### Frontend Authorization

```typescript
// src/hooks/usePermissions.ts
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user, profile } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;

    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage_users'],
      manager: ['read', 'write', 'manage_assessments'],
      analyst: ['read', 'write'],
      viewer: ['read'],
    };

    return rolePermissions[profile.role]?.includes(permission) || false;
  };

  const canAccessVendor = (vendorId: string): boolean => {
    // Check if user can access specific vendor
    return hasPermission('read');
  };

  return {
    hasPermission,
    canAccessVendor,
    isAdmin: profile?.role === 'admin',
    isManager: profile?.role === 'manager',
  };
};
```

### Session Management

```typescript
// src/utils/sessionManager.ts
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  static async validateSession(): Promise<boolean> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return false;
    }

    const now = Date.now();
    const expiresAt = session.expires_at * 1000;
    
    if (now >= expiresAt) {
      await this.logout();
      return false;
    }

    // Refresh token if close to expiry
    if (expiresAt - now < this.REFRESH_THRESHOLD) {
      await this.refreshSession();
    }

    return true;
  }

  static async refreshSession(): Promise<void> {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh failed:', error);
      await this.logout();
    }
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut();
    clearUserContext(); // Clear Sentry context
    window.location.href = '/signin';
  }
}
```

## Data Protection

### Encryption

#### Data at Rest

```sql
-- Enable encryption for sensitive columns
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Data in Transit

```typescript
// src/utils/encryption.ts
import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static readonly SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}
```

### Data Masking

```typescript
// src/utils/dataMasking.ts
export class DataMaskingService {
  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.substring(0, 2) + '*'.repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  }

  static maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
  }

  static maskCreditCard(cardNumber: string): string {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  static maskSensitiveData(data: any, fields: string[]): any {
    const masked = { ...data };
    fields.forEach(field => {
      if (masked[field]) {
        masked[field] = this.maskEmail(masked[field]);
      }
    });
    return masked;
  }
}
```

### Data Retention

```sql
-- Data retention policy
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete old audit logs (retain for 7 years)
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '7 years';

  -- Archive old assessments (retain for 5 years)
  INSERT INTO archived_assessments 
  SELECT * FROM vendor_assessments 
  WHERE created_at < NOW() - INTERVAL '5 years';

  DELETE FROM vendor_assessments 
  WHERE created_at < NOW() - INTERVAL '5 years';

  -- Delete old sessions (retain for 30 days)
  DELETE FROM user_sessions 
  WHERE last_activity < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job
SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');
```

## API Security

### Input Validation

```typescript
// src/utils/validation.ts
import Joi from 'joi';

export const vendorSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().optional(),
  industry: Joi.string().valid('technology', 'manufacturing', 'services', 'other').required(),
  risk_level: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
});

export const validateInput = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
  }
  return value;
};
```

### Rate Limiting

```typescript
// src/middleware/rateLimiter.ts
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();
  private static readonly WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
  private static readonly MAX_REQUESTS = 100;

  static isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.WINDOW_SIZE
    );

    if (validRequests.length >= this.MAX_REQUESTS) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}
```

### API Security Headers

```typescript
// src/utils/securityHeaders.ts
export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};
```

## Infrastructure Security

### Environment Security

```env
# Production environment variables
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
VITE_SENTRY_DSN=https://your_sentry_dsn
VITE_ENCRYPTION_KEY=your_encryption_key
```

### Database Security

```sql
-- Enable audit logging
CREATE EXTENSION IF NOT EXISTS pgaudit;

-- Configure audit settings
ALTER SYSTEM SET pgaudit.log = 'all';
ALTER SYSTEM SET pgaudit.log_catalog = off;
ALTER SYSTEM SET pgaudit.log_parameter = on;
ALTER SYSTEM SET pgaudit.log_statement_once = on;

-- Create audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    inet_client_addr()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER vendors_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON vendors
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### Network Security

```typescript
// src/utils/networkSecurity.ts
export class NetworkSecurityService {
  static async validateRequest(req: Request): Promise<boolean> {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
    ];

    const body = await req.text();
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(body)
    );

    if (hasSuspiciousContent) {
      await this.logSecurityEvent('suspicious_request', {
        ip: req.headers.get('x-forwarded-for'),
        userAgent: req.headers.get('user-agent'),
        body: body.substring(0, 1000), // Log first 1000 chars
      });
      return false;
    }

    return true;
  }

  static async logSecurityEvent(event: string, details: any): Promise<void> {
    await supabase.from('security_events').insert({
      event_type: event,
      details,
      ip_address: details.ip,
      user_agent: details.userAgent,
      created_at: new Date().toISOString(),
    });
  }
}
```

## Compliance

### GDPR Compliance

```typescript
// src/services/gdprService.ts
export class GDPRService {
  static async exportUserData(userId: string): Promise<any> {
    const [profile, vendors, assessments] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('vendors').select('*').eq('organization_id', profile.organization_id),
      supabase.from('vendor_assessments').select('*').eq('assessor_id', userId),
    ]);

    return {
      profile: profile.data,
      vendors: vendors.data,
      assessments: assessments.data,
      exported_at: new Date().toISOString(),
    };
  }

  static async deleteUserData(userId: string): Promise<void> {
    // Anonymize instead of delete for audit purposes
    await supabase.from('profiles').update({
      email: 'deleted@example.com',
      full_name: 'Deleted User',
      deleted_at: new Date().toISOString(),
    }).eq('id', userId);

    // Delete personal data
    await supabase.from('user_sessions').delete().eq('user_id', userId);
    await supabase.from('user_preferences').delete().eq('user_id', userId);
  }

  static async getDataProcessingConsent(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('consent_records')
      .select('consent_given')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data?.consent_given || false;
  }
}
```

### SOC 2 Compliance

```sql
-- Access control monitoring
CREATE TABLE access_control_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL, -- 'allowed' or 'denied'
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data integrity monitoring
CREATE TABLE data_integrity_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  check_type TEXT NOT NULL,
  result TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Monitoring

### Real-time Monitoring

```typescript
// src/services/securityMonitoringService.ts
export class SecurityMonitoringService {
  static async monitorFailedLogins(): Promise<void> {
    const { data: failedLogins } = await supabase
      .from('auth_logs')
      .select('*')
      .eq('event_type', 'login_failed')
      .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString());

    if (failedLogins.length > 5) {
      await this.triggerSecurityAlert('multiple_failed_logins', {
        count: failedLogins.length,
        timeWindow: '15 minutes',
      });
    }
  }

  static async monitorSuspiciousActivity(): Promise<void> {
    const { data: suspiciousActivity } = await supabase
      .from('security_events')
      .select('*')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    const suspiciousCount = suspiciousActivity.filter(
      event => event.event_type === 'suspicious_request'
    ).length;

    if (suspiciousCount > 10) {
      await this.triggerSecurityAlert('high_suspicious_activity', {
        count: suspiciousCount,
        timeWindow: '1 hour',
      });
    }
  }

  static async triggerSecurityAlert(type: string, details: any): Promise<void> {
    // Log to security events
    await supabase.from('security_alerts').insert({
      alert_type: type,
      details,
      severity: this.getSeverity(type),
      status: 'open',
      created_at: new Date().toISOString(),
    });

    // Send notification to security team
    await this.sendSecurityNotification(type, details);
  }

  private static getSeverity(type: string): string {
    const severityMap = {
      'multiple_failed_logins': 'medium',
      'high_suspicious_activity': 'high',
      'data_breach_attempt': 'critical',
    };
    return severityMap[type] || 'low';
  }
}
```

### Security Dashboard

```typescript
// src/components/security/SecurityDashboard.tsx
export const SecurityDashboard: React.FC = () => {
  const [securityMetrics, setSecurityMetrics] = useState({
    failedLogins: 0,
    suspiciousActivity: 0,
    activeAlerts: 0,
    lastIncident: null,
  });

  useEffect(() => {
    const fetchSecurityMetrics = async () => {
      const [failedLogins, suspiciousActivity, activeAlerts] = await Promise.all([
        supabase.from('auth_logs').select('*').eq('event_type', 'login_failed').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('security_events').select('*').eq('event_type', 'suspicious_request').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('security_alerts').select('*').eq('status', 'open'),
      ]);

      setSecurityMetrics({
        failedLogins: failedLogins.data?.length || 0,
        suspiciousActivity: suspiciousActivity.data?.length || 0,
        activeAlerts: activeAlerts.data?.length || 0,
        lastIncident: null, // Implement last incident logic
      });
    };

    fetchSecurityMetrics();
    const interval = setInterval(fetchSecurityMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Failed Logins (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{securityMetrics.failedLogins}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Activity (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{securityMetrics.suspiciousActivity}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{securityMetrics.activeAlerts}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Last Incident</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {securityMetrics.lastIncident || 'No recent incidents'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

## Incident Response

### Incident Response Plan

```typescript
// src/services/incidentResponseService.ts
export class IncidentResponseService {
  static async createIncident(incident: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedUsers?: number;
    initialAssessment?: string;
  }): Promise<string> {
    const { data, error } = await supabase
      .from('security_incidents')
      .insert({
        ...incident,
        status: 'open',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Notify security team
    await this.notifySecurityTeam(data.id, incident);

    return data.id;
  }

  static async updateIncidentStatus(
    incidentId: string,
    status: 'open' | 'investigating' | 'contained' | 'resolved',
    notes?: string
  ): Promise<void> {
    await supabase
      .from('security_incidents')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', incidentId);
  }

  static async notifySecurityTeam(incidentId: string, incident: any): Promise<void> {
    // Send email notification
    await this.sendEmailNotification(incidentId, incident);
    
    // Send Slack notification
    await this.sendSlackNotification(incidentId, incident);
    
    // Log notification
    await supabase.from('incident_notifications').insert({
      incident_id: incidentId,
      notification_type: 'security_team',
      sent_at: new Date().toISOString(),
    });
  }
}
```

## Security Best Practices

### Development Security

1. **Secure Coding Practices**:
   - Input validation and sanitization
   - Output encoding
   - Parameterized queries
   - Secure error handling

2. **Dependency Management**:
   - Regular security updates
   - Vulnerability scanning
   - License compliance

3. **Code Review**:
   - Security-focused code reviews
   - Automated security scanning
   - Threat modeling

### Operational Security

1. **Access Management**:
   - Principle of least privilege
   - Regular access reviews
   - Multi-factor authentication

2. **Monitoring**:
   - Continuous security monitoring
   - Log analysis
   - Anomaly detection

3. **Backup and Recovery**:
   - Regular backups
   - Encrypted backups
   - Recovery testing

## Security Checklist

### Pre-Deployment Security Checklist

- [ ] All environment variables are properly configured
- [ ] Database security policies are enabled
- [ ] SSL/TLS certificates are valid
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] Error handling doesn't leak sensitive information
- [ ] Audit logging is enabled
- [ ] Backup procedures are in place
- [ ] Incident response plan is documented

### Regular Security Maintenance

- [ ] Update dependencies monthly
- [ ] Review access permissions quarterly
- [ ] Conduct security assessments annually
- [ ] Test incident response procedures
- [ ] Review and update security policies
- [ ] Monitor security metrics
- [ ] Conduct penetration testing
- [ ] Update security documentation

### Security Monitoring Checklist

- [ ] Failed login attempts
- [ ] Suspicious API activity
- [ ] Unusual data access patterns
- [ ] System performance anomalies
- [ ] Error rate increases
- [ ] Unauthorized access attempts
- [ ] Data integrity issues
- [ ] Compliance violations

---

*This security guide is regularly updated. For the latest version, visit our documentation site.*
