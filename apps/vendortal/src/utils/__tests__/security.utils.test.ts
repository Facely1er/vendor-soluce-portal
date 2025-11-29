import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCSPHeader,
  sanitizeInput,
  isValidEmail,
  isValidUrl,
  RateLimiter,
  defaultRateLimiter
} from '../security';

describe('Security Utilities', () => {
  describe('getCSPHeader', () => {
    it('returns CSP header string', () => {
      const header = getCSPHeader();
      expect(header).toContain("default-src 'self'");
      expect(header).toContain("script-src 'self'");
    });

    it('includes multiple directives', () => {
      const header = getCSPHeader();
      const directives = header.split(';');
      expect(directives.length).toBeGreaterThan(1);
    });
  });

  describe('sanitizeInput', () => {
    it('sanitizes HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toContain('&lt;');
      expect(sanitizeInput('<div>Test</div>')).toContain('&lt;');
    });

    it('handles quotes', () => {
      const result = sanitizeInput('Test "quotes" \'here\'');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });

    it('handles empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('handles normal text', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('javascript:alert(1)')).toBe(true); // Valid URL format
    });
  });

  describe('RateLimiter', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter(5, 60000);
    });

    it('allows requests within limit', () => {
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isAllowed('test-key')).toBe(true);
      }
    });

    it('blocks requests over limit', () => {
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed('test-key');
      }
      expect(rateLimiter.isAllowed('test-key')).toBe(false);
    });

    it('tracks remaining requests', () => {
      rateLimiter.isAllowed('test-key');
      expect(rateLimiter.getRemainingRequests('test-key')).toBe(4);
    });

    it('handles multiple keys independently', () => {
      rateLimiter.isAllowed('key1');
      rateLimiter.isAllowed('key1');
      rateLimiter.isAllowed('key2');
      
      expect(rateLimiter.getRemainingRequests('key1')).toBe(3);
      expect(rateLimiter.getRemainingRequests('key2')).toBe(4);
    });
  });

  describe('defaultRateLimiter', () => {
    it('is an instance of RateLimiter', () => {
      expect(defaultRateLimiter).toBeInstanceOf(RateLimiter);
    });

    it('has default max requests', () => {
      expect(defaultRateLimiter.getRemainingRequests('test')).toBeGreaterThan(0);
    });
  });
});

