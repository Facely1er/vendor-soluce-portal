import React, { useState } from 'react';
import { Sync, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAssetRegister } from '../hooks/useAssetRegister';
import { useAuth } from '../context/AuthContext';

interface AssetRegisterSyncButtonProps {
  vendorId?: string;
  onSyncComplete?: (result: { assetCreated: boolean; risksAdded: number } | { assetsAdded: number; risksAdded: number }) => void;
  className?: string;
  syncAll?: boolean;
}

/**
 * Component for syncing VendorSoluce vendor data to Asset & Risk Register
 */
export const AssetRegisterSyncButton: React.FC<AssetRegisterSyncButtonProps> = ({
  vendorId,
  onSyncComplete,
  className = '',
  syncAll = false
}) => {
  const { user } = useAuth();
  const { syncToRegister, syncVendor, isLoading, error, isAvailable } = useAssetRegister();
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleSync = async () => {
    try {
      let result;
      if (syncAll && user?.id) {
        result = await syncToRegister(user.id);
      } else if (vendorId) {
        result = await syncVendor(vendorId);
      } else {
        throw new Error('Either vendorId or syncAll with user must be provided');
      }
      
      setSyncResult(result);
      onSyncComplete?.(result);
    } catch (err) {
      console.error('Failed to sync to Asset Register:', err);
    }
  };

  if (!isAvailable) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span>Asset Register API not available</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        onClick={handleSync}
        disabled={isLoading || (!vendorId && !syncAll)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : (
          <>
            <Sync className="w-4 h-4" />
            <span>{syncAll ? 'Sync All Vendors' : 'Sync to Asset Register'}</span>
          </>
        )}
      </button>

      {syncResult && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>
            {syncAll ? (
              <>Synced {syncResult.assetsAdded} assets and {syncResult.risksAdded} risks</>
            ) : (
              <>
                {syncResult.assetCreated ? 'Vendor synced' : 'No new data'} - {syncResult.risksAdded} risks added
              </>
            )}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

