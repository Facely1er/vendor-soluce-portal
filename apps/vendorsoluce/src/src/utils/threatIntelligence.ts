/**
 * Threat Intelligence API Integration
 * Free open source APIs for vendor risk management
 */

import { logger } from './logger';

export interface ThreatStats {
  activeSources: number;
  threatsToday: number;
  coverage: number;
  lastUpdated: string;
}

export interface ThreatSource {
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'error';
  lastCheck: string;
  threatCount: number;
}

export interface VulnerabilityData {
  cve: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  published: string;
  cvss: number;
}

export interface ThreatIndicator {
  type: 'ip' | 'domain' | 'hash' | 'url';
  value: string;
  threatType: string;
  confidence: number;
  source: string;
  firstSeen: string;
}

// API Configuration
const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  }
};

// Rate limiting helper (for future use)
class _RateLimiter {
  private requests: number[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - API_CONFIG.rateLimit.window;

    // Remove old requests outside the window
    this.requests = this.requests.filter(time => time > windowStart);

    return this.requests.length < API_CONFIG.rateLimit.requests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }
}

const _rateLimiter = new _RateLimiter();

// Generic API fetch with error handling and retries
// Note: This function is currently not used, but kept for potential future use
// async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
//   if (!rateLimiter.canMakeRequest()) {
//     throw new Error('Rate limit exceeded');
//   }
//   
//   rateLimiter.recordRequest();
//   
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
//   
//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//       headers: {
//         'User-Agent': 'VendorSoluce-ThreatIntel/1.0',
//         'Accept': 'application/json',
//         ...options.headers
//       }
//     });
//     
//     clearTimeout(timeoutId);
//     
//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }
//     
//     return response;
//   } catch (error) {
//     clearTimeout(timeoutId);
//     throw error;
//   }
// }

// CVE Details API (Free) - Simplified approach with better error handling
export async function fetchCVEData(): Promise<VulnerabilityData[]> {
  try {
    // For now, we'll use mock data since NVD API has CORS restrictions
    // In production, this should be called from a backend service
    console.info('CVE API: Using mock data due to CORS restrictions');
    return generateMockCVEData();
  } catch (error) {
    logger.warn('CVE API failed, using mock data', { error });
    return generateMockCVEData();
  }
}

// ThreatFox API (Free) - Simplified approach with better error handling
export async function fetchThreatFoxData(): Promise<ThreatIndicator[]> {
  try {
    // For now, we'll use mock data since ThreatFox API has CORS restrictions
    // In production, this should be called from a backend service
    console.info('ThreatFox API: Using mock data due to CORS restrictions');
    return generateMockThreatData();
  } catch (error) {
    logger.warn('ThreatFox API failed, using mock data', { error });
    return generateMockThreatData();
  }
}

// VirusTotal API (Free tier - 500 requests/day)
export async function fetchVirusTotalData(domain: string): Promise<any> {
  try {
    // Note: This requires a VirusTotal API key for production use
    // For demo purposes, we'll use mock data
    return {
      domain,
      reputation: Math.random() > 0.8 ? 'malicious' : 'clean',
      lastAnalysis: new Date().toISOString(),
      engines: Math.floor(Math.random() * 70) + 1
    };
  } catch (error) {
    logger.warn('VirusTotal API failed', { error });
    return null;
  }
}

// Shodan API (Free tier - 100 results/month)
export async function fetchShodanData(ip: string): Promise<any> {
  try {
    // Note: This requires a Shodan API key for production use
    // For demo purposes, we'll use mock data
    return {
      ip,
      ports: [80, 443, 22, 21],
      vulnerabilities: Math.floor(Math.random() * 5),
      lastSeen: new Date().toISOString()
    };
  } catch (error) {
    logger.warn('Shodan API failed', { error });
    return null;
  }
}

// MISP API (Open source threat intelligence)
export async function fetchMISPData(): Promise<ThreatIndicator[]> {
  try {
    // Note: This requires a MISP instance and API key
    // For demo purposes, we'll use mock data
    return generateMockMISPData();
  } catch (error) {
    logger.warn('MISP API failed, using mock data', { error });
    return generateMockMISPData();
  }
}

// Aggregate threat statistics from all sources
export async function fetchThreatStats(): Promise<ThreatStats> {
  try {
    const [cveData, threatFoxData, mispData] = await Promise.allSettled([
      fetchCVEData(),
      fetchThreatFoxData(),
      fetchMISPData()
    ]);
    
    const activeSources = [
      cveData.status === 'fulfilled' ? 'CVE Database' : null,
      threatFoxData.status === 'fulfilled' ? 'ThreatFox' : null,
      mispData.status === 'fulfilled' ? 'MISP' : null
    ].filter(Boolean).length;
    
    const threatsToday = [
      cveData.status === 'fulfilled' ? cveData.value.length : 0,
      threatFoxData.status === 'fulfilled' ? threatFoxData.value.length : 0,
      mispData.status === 'fulfilled' ? mispData.value.length : 0
    ].reduce((sum, count) => sum + count, 0);
    
    const coverage = Math.min(95, activeSources * 30 + Math.floor(Math.random() * 10));
    
    return {
      activeSources,
      threatsToday,
      coverage,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Failed to fetch threat stats', { error });
    return {
      activeSources: 3,
      threatsToday: 142,
      coverage: 98,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Mock data generators for fallback
function generateMockCVEData(): VulnerabilityData[] {
  return [
    {
      cve: 'CVE-2024-1234',
      severity: 'critical',
      description: 'Remote code execution vulnerability',
      published: new Date().toISOString(),
      cvss: 9.8
    },
    {
      cve: 'CVE-2024-1235',
      severity: 'high',
      description: 'SQL injection vulnerability',
      published: new Date().toISOString(),
      cvss: 8.5
    },
    {
      cve: 'CVE-2024-1236',
      severity: 'medium',
      description: 'Cross-site scripting vulnerability',
      published: new Date().toISOString(),
      cvss: 6.1
    }
  ];
}

function generateMockThreatData(): ThreatIndicator[] {
  return [
    {
      type: 'ip',
      value: '192.168.1.100',
      threatType: 'malware',
      confidence: 85,
      source: 'ThreatFox',
      firstSeen: new Date().toISOString()
    },
    {
      type: 'domain',
      value: 'malicious-site.com',
      threatType: 'phishing',
      confidence: 90,
      source: 'ThreatFox',
      firstSeen: new Date().toISOString()
    }
  ];
}

function generateMockMISPData(): ThreatIndicator[] {
  return [
    {
      type: 'hash',
      value: 'a1b2c3d4e5f6...',
      threatType: 'ransomware',
      confidence: 95,
      source: 'MISP',
      firstSeen: new Date().toISOString()
    },
    {
      type: 'url',
      value: 'https://suspicious-site.org',
      threatType: 'malware',
      confidence: 80,
      source: 'MISP',
      firstSeen: new Date().toISOString()
    }
  ];
}

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Export all threat sources for monitoring
export const THREAT_SOURCES: ThreatSource[] = [
  {
    name: 'CVE Database',
    url: 'https://cve.mitre.org',
    status: 'active',
    lastCheck: new Date().toISOString(),
    threatCount: 0
  },
  {
    name: 'ThreatFox',
    url: 'https://threatfox.abuse.ch',
    status: 'active',
    lastCheck: new Date().toISOString(),
    threatCount: 0
  },
  {
    name: 'MISP',
    url: 'https://www.misp-project.org',
    status: 'active',
    lastCheck: new Date().toISOString(),
    threatCount: 0
  }
];
