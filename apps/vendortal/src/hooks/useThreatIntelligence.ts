/**
 * React hook for threat intelligence data
 */

import { logger } from '../utils/logger';
import { useState, useEffect, useCallback } from 'react';
import { 
  ThreatStats, 
  ThreatSource, 
  VulnerabilityData, 
  ThreatIndicator,
  fetchThreatStats,
  fetchCVEData,
  fetchThreatFoxData,
  fetchMISPData,
  getCachedData,
  setCachedData,
  THREAT_SOURCES
} from '../utils/threatIntelligence';

export interface ThreatIntelligenceState {
  stats: ThreatStats;
  vulnerabilities: VulnerabilityData[];
  threatIndicators: ThreatIndicator[];
  sources: ThreatSource[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
}

export function useThreatIntelligence() {
  const [state, setState] = useState<ThreatIntelligenceState>({
    stats: {
      activeSources: 0,
      threatsToday: 0,
      coverage: 0,
      lastUpdated: new Date().toISOString()
    },
    vulnerabilities: [],
    threatIndicators: [],
    sources: THREAT_SOURCES,
    loading: true,
    error: null,
    lastUpdated: new Date().toISOString()
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check cache first
      const cachedStats = getCachedData<ThreatStats>('threat-stats');
      const cachedVulns = getCachedData<VulnerabilityData[]>('vulnerabilities');
      const cachedIndicators = getCachedData<ThreatIndicator[]>('threat-indicators');

      if (cachedStats && cachedVulns && cachedIndicators) {
        setState(prev => ({
          ...prev,
          stats: cachedStats,
          vulnerabilities: cachedVulns,
          threatIndicators: cachedIndicators,
          loading: false,
          lastUpdated: cachedStats.lastUpdated
        }));
        return;
      }

      // Fetch fresh data
      const [stats, vulnerabilities, threatFoxData, mispData] = await Promise.allSettled([
        fetchThreatStats(),
        fetchCVEData(),
        fetchThreatFoxData(),
        fetchMISPData()
      ]);

      const newStats = stats.status === 'fulfilled' ? stats.value : {
        activeSources: 0,
        threatsToday: 0,
        coverage: 0,
        lastUpdated: new Date().toISOString()
      };
      const newVulns = vulnerabilities.status === 'fulfilled' ? vulnerabilities.value : [];
      const newIndicators = [
        ...(threatFoxData.status === 'fulfilled' ? threatFoxData.value : []),
        ...(mispData.status === 'fulfilled' ? mispData.value : [])
      ];

      // Update sources status
      const updatedSources = THREAT_SOURCES.map(source => ({
        ...source,
        status: (() => {
          if (source.name === 'CVE Database') return vulnerabilities.status === 'fulfilled' ? 'active' : 'error';
          if (source.name === 'ThreatFox') return threatFoxData.status === 'fulfilled' ? 'active' : 'error';
          if (source.name === 'MISP') return mispData.status === 'fulfilled' ? 'active' : 'error';
          return 'inactive';
        })() as 'active' | 'inactive' | 'error',
        lastCheck: new Date().toISOString(),
        threatCount: newIndicators.filter(ind => ind.source === source.name).length
      }));

      // Cache the results
      setCachedData('threat-stats', newStats);
      setCachedData('vulnerabilities', newVulns);
      setCachedData('threat-indicators', newIndicators);

      setState(prev => ({
        ...prev,
        stats: newStats,
        vulnerabilities: newVulns,
        threatIndicators: newIndicators,
        sources: updatedSources,
        loading: false,
        lastUpdated: newStats.lastUpdated
      }));

    } catch (error) {
      logger.error('Failed to fetch threat intelligence:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch threat data'
      }));
    }
  }, []);

  const refresh = useCallback(() => {
    // Clear cache and fetch fresh data
    setCachedData('threat-stats', null);
    setCachedData('vulnerabilities', null);
    setCachedData('threat-indicators', null);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    ...state,
    refresh,
    refetch: fetchData
  };
}

// Hook for specific threat data
export function useVulnerabilityData() {
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVulns = async () => {
      try {
        setLoading(true);
        const cached = getCachedData<VulnerabilityData[]>('vulnerabilities');
        
        if (cached) {
          setVulnerabilities(cached);
          setLoading(false);
          return;
        }

        const data = await fetchCVEData();
        setCachedData('vulnerabilities', data);
        setVulnerabilities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vulnerabilities');
      } finally {
        setLoading(false);
      }
    };

    fetchVulns();
  }, []);

  return { vulnerabilities, loading, error };
}

// Hook for threat indicators
export function useThreatIndicators() {
  const [indicators, setIndicators] = useState<ThreatIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoading(true);
        const cached = getCachedData<ThreatIndicator[]>('threat-indicators');
        
        if (cached) {
          setIndicators(cached);
          setLoading(false);
          return;
        }

        const [threatFoxData, mispData] = await Promise.allSettled([
          fetchThreatFoxData(),
          fetchMISPData()
        ]);

        const allIndicators = [
          ...(threatFoxData.status === 'fulfilled' ? threatFoxData.value : []),
          ...(mispData.status === 'fulfilled' ? mispData.value : [])
        ];

        setCachedData('threat-indicators', allIndicators);
        setIndicators(allIndicators);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch threat indicators');
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, []);

  return { indicators, loading, error };
}
