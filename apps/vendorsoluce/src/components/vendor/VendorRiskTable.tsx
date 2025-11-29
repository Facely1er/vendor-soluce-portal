import React from 'react';
import { useState } from 'react';
import { VendorRisk } from '../../types';
import RiskBadge from '../ui/RiskBadge';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import BulkDataOperations from '../data/BulkDataOperations';

interface VendorRiskTableProps {
  vendors: VendorRisk[];
  onEdit?: (vendor: VendorRisk) => void;
  onDelete?: (vendorId: string) => void;
  onView?: (vendor: VendorRisk) => void;
  onRefresh?: () => void;
}

const VendorRiskTable: React.FC<VendorRiskTableProps> = ({ 
  vendors,
  onEdit,
  onDelete,
  onView,
  onRefresh
}) => {
  const { t } = useTranslation();
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  
  const handleSelectAll = (checked: boolean) => {
    setSelectedVendors(checked ? vendors.map(v => v.id) : []);
  };
  
  const handleSelectVendor = (vendorId: string, checked: boolean) => {
    if (checked) {
      setSelectedVendors(prev => [...prev, vendorId]);
    } else {
      setSelectedVendors(prev => prev.filter(id => id !== vendorId));
    }
  };
  
  if (vendors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No vendors found.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      // Try to parse as ISO date string
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      }
      // If it's not a valid date, just return the original string
      return dateString;
    } catch {
      return dateString;
    }
  };
  
  return (
    <div>
      <BulkDataOperations
        dataType="vendors"
        selectedItems={selectedVendors}
        onSelectionChange={setSelectedVendors}
        onOperationComplete={() => {
          if (onRefresh) onRefresh();
        }}
      />
      
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedVendors.length === vendors.length && vendors.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-vendorsoluce-green focus:ring-vendorsoluce-green border-gray-300 rounded"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('vendorRisk.table.vendor')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('vendorRisk.table.riskScore')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('vendorRisk.table.riskLevel')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('vendorRisk.table.complianceStatus')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('vendorRisk.table.lastAssessment')}
            </th>
            {(onEdit || onDelete || onView) && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={(e) => handleSelectVendor(vendor.id, e.target.checked)}
                  className="h-4 w-4 text-vendorsoluce-green focus:ring-vendorsoluce-green border-gray-300 rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{vendor.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Last updated {formatDate(vendor.lastAssessment)}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div 
                    className="h-2 w-16 rounded bg-gray-200 dark:bg-gray-700"
                  >
                    <div 
                      className={`h-full rounded ${
                        vendor.riskScore >= 80 ? 'bg-green-500' : 
                        vendor.riskScore >= 60 ? 'bg-yellow-500' : 
                        vendor.riskScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${vendor.riskScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-gray-900 dark:text-white font-medium">{vendor.riskScore}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <RiskBadge level={vendor.riskLevel} />
                {vendor.riskLevel === 'Critical' && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">Immediate action required</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  vendor.complianceStatus === 'Compliant' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                  vendor.complianceStatus === 'Partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  {vendor.complianceStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(vendor.lastAssessment)}
              </td>
              {(onEdit || onDelete || onView) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(vendor)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(vendor)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(vendor.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default VendorRiskTable;