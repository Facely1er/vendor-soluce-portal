/**
 * Security utilities for production environment
 */

import DOMPurify from 'dompurify';
import { devConsole } from './monitoring';

// Content Security Policy configuration
export const getCSPHeader = () => {
  const directives = [
    "default-src 'self'",
    // Note: 'unsafe-inline' should be removed in production and replaced with nonces
    // For now, we allow it for React's inline styles and event handlers
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://*.stripe.com",
    "style-src 'self' 'unsafe-inline' https://rsms.me https://fonts.googleapis.com",
    "font-src 'self' https://rsms.me https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.osv.dev https://api.vendorsoluce.com https://*.stripe.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ];

  return directives.join('; ');
};

// Input sanitization using DOMPurify
export const sanitizeInput = (input: string): string => {
  // Use DOMPurify for robust HTML sanitization
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    KEEP_CONTENT: true, // Keep text content
  });
};

// Sanitize HTML content (allows safe HTML)
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Rate limiting for client-side
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
  
  getRemainingRequests(key: string): number {
    const requests = this.requests.get(key) || [];
    const now = Date.now();
    const validRequests = requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Create default rate limiter instance
export const defaultRateLimiter = new RateLimiter();

// Secure storage utilities
export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      // In production, consider encrypting sensitive data
      localStorage.setItem(key, value);
    } catch (error) {
      devConsole.warn('Failed to save to localStorage:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      devConsole.warn('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      devConsole.warn('Failed to remove from localStorage:', error);
    }
  }
};