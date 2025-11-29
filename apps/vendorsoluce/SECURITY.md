# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Security Headers

Comprehensive security headers configured in `vercel.json`:

- **Content-Security-Policy (CSP)**
- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricted camera, microphone, geolocation

## Reporting a Vulnerability

Report security issues to: security@vendorsoluce.com

**Do NOT** create public GitHub issues for security vulnerabilities.

## Security Features

### Authentication & Authorization
- Supabase Authentication with PKCE flow
- Row Level Security (RLS) enabled on all tables
- User data isolation guaranteed
- Protected routes with authentication guards

### Database Security
- RLS policies on all tables:
  - `vs_profiles` - User-scoped
  - `vs_vendors` - User-scoped
  - `vs_sbom_analyses` - User-scoped
  - `vs_supply_chain_assessments` - User-scoped
  - `vs_contact_submissions` - Admin-scoped

### Data Protection
- DOMPurify for XSS protection
- Input validation throughout
- Secure localStorage utilities
- No sensitive data in error messages

### API Security
- Supabase anon key with RLS enforcement
- Rate limiting (via Supabase)
- Request validation
- Secure API key management

## Dependency Security

- Regular `npm audit` checks
- Automated dependency updates (recommended)
- Security scanning in CI/CD

## Compliance

- NIST SP 800-161 compliant assessments
- GDPR considerations
- OWASP Top 10 aligned

---

**Last Updated**: January 2025

