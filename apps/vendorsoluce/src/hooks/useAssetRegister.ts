import { useState, useEffect, useCallback } from 'react';
import { VendorSoluceAssetRegisterIntegration } from '../services/assetRegisterIntegration';
import { useAuth } from '../context/AuthContext';

interface AssetRegisterData {
  vendorAssets: any[];
  vendorRisks: any[];
  allAssets: any[];
  allRisks: any[];
}

interface UseAssetRegisterReturn {
  data: AssetRegisterData;
  isLoading: boolean;
  error: string | null;
  syncToRegister: (userId: string) => Promise<{ assetsAdded: number; risksAdded: number }>;
  syncVendor: (vendorId: string) => Promise<{ assetCreated: boolean; risksAdded: number }>;
  refresh: () => void;
  isAvailable: boolean;
  getVendorRisks: (vendorId: string) => any[];
}

/**
 * Hook for integrating with ERMITS Asset & Risk Register
 */
export function useAssetRegister(): UseAssetRegisterReturn {
  const { user } = useAuth();
  const [data, setData] = useState<AssetRegisterData>({
    vendorAssets: [],
    vendorRisks: [],
    allAssets: [],
    allRisks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check if API is available
  useEffect(() => {
    const checkAvailability = async () => {
      const available = VendorSoluceAssetRegisterIntegration.isAvailable();
      if (!available) {
        // Try to load the API
        await VendorSoluceAssetRegisterIntegration.loadAssetRegisterAPI();
      }
      setIsAvailable(VendorSoluceAssetRegisterIntegration.isAvailable());
    };

    checkAvailability();
  }, []);

  // Load data from register
  const refresh = useCallback(() => {
    if (!isAvailable) return;

    try {
      const registerData = VendorSoluceAssetRegisterIntegration.readFromAssetRegister();
      setData(registerData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Asset Register data');
    }
  }, [isAvailable]);

  // Sync all vendor data to register
  const syncToRegister = useCallback(async (userId: string) => {
    if (!isAvailable) {
      throw new Error('Asset Register API is not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await VendorSoluceAssetRegisterIntegration.syncToAssetRegister(userId);
      refresh(); // Refresh data after sync
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync to Asset Register';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable, refresh]);

  // Sync single vendor to register
  const syncVendor = useCallback(async (vendorId: string) => {
    if (!isAvailable) {
      throw new Error('Asset Register API is not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await VendorSoluceAssetRegisterIntegration.syncVendorToAssetRegister(vendorId);
      refresh(); // Refresh data after sync
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync vendor to Asset Register';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable, refresh]);

  // Get risks for a specific vendor
  const getVendorRisks = useCallback((vendorId: string) => {
    if (!isAvailable) return [];
    return VendorSoluceAssetRegisterIntegration.getVendorRisksFromRegister(vendorId);
  }, [isAvailable]);

  // Initial load
  useEffect(() => {
    if (isAvailable) {
      refresh();
    }
  }, [isAvailable, refresh]);

  // Auto-sync when user is available
  useEffect(() => {
    if (isAvailable && user?.id) {
      // Optionally auto-sync on mount
      // syncToRegister(user.id).catch(console.error);
    }
  }, [isAvailable, user?.id]);

  return {
    data,
    isLoading,
    error,
    syncToRegister,
    syncVendor,
    refresh,
    isAvailable,
    getVendorRisks
  };
}

