import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useVendorStore } from '../../stores/vendorStore';
import { useAppStore } from '../../stores/appStore';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import RiskBadge from '../ui/RiskBadge';

const EnhancedVendorManagement: React.FC = () => {
  const { user } = useAuth();
  const addNotification = useAppStore((state) => state.addNotification);
  const openModal = useAppStore((state) => state.openModal);
  
  // Zustand vendor store
  const {
    vendors,
    loading,
    error,
    searchTerm,
    riskLevelFilter,
    complianceFilter,
    sortBy,
    sortOrder,
    fetchVendors,
    // createVendor,
    // updateVendor,
    deleteVendor,
    setSearchTerm,
    setRiskLevelFilter,
    setComplianceFilter,
    setSorting,
    clearFilters,
    getFilteredVendors,
    getRiskDistribution,
    getComplianceStats
  } = useVendorStore();

  // Fetch vendors on mount
  useEffect(() => {
    if (user?.id) {
      fetchVendors(user.id);
    }
  }, [user?.id, fetchVendors]);

  // Get filtered and sorted vendors
  const filteredVendors = getFilteredVendors();
  const riskDistribution = getRiskDistribution();
  const complianceStats = getComplianceStats();

  // const handleCreateVendor = async (vendorData: Record<string, unknown>) => {
  //   if (!user?.id) return;
    
  //   try {
  //     await createVendor(vendorData, user.id);
  //     addNotification({
  //       title: 'Vendor Created',
  //       message: `${vendorData.name} has been successfully added to your portfolio.`,
  //       type: 'success'
  //     });
  //   } catch (error) {
  //     addNotification({
  //       title: 'Creation Failed',
  //       message: 'Failed to create vendor. Please try again.',
  //       type: 'error'
  //     });
  //   }
  // };

  const handleDeleteVendor = async (id: string, name: string) => {
    if (!user?.id) return;
    
    try {
      await deleteVendor(id, user.id);
      addNotification({
        title: 'Vendor Deleted',
        message: `${name} has been removed from your portfolio.`,
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Deletion Failed',
        message: 'Failed to delete vendor. Please try again.',
        type: 'error'
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{vendors.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Vendors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {riskDistribution.critical + riskDistribution.high}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {complianceStats.compliant}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Compliant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {complianceStats.partial}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Partial Compliance</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filters */}
            <select
              value={riskLevelFilter}
              onChange={(e) => setRiskLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>

            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Compliance</option>
              <option value="Compliant">Compliant</option>
              <option value="Partial">Partial</option>
              <option value="Non-Compliant">Non-Compliant</option>
            </select>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSorting(e.target.value as 'name' | 'risk_level' | 'compliance_status' | 'created_at', sortOrder)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="name">Sort by Name</option>
                <option value="risk_score">Sort by Risk Score</option>
                <option value="last_assessment_date">Sort by Last Assessment</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSorting(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>

            {/* Action Buttons */}
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => openModal('addVendor')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Vendors ({filteredVendors.length})
            {loading && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                {searchTerm || riskLevelFilter !== 'all' || complianceFilter !== 'all' 
                  ? 'No vendors match your current filters.'
                  : 'No vendors found. Add your first vendor to get started.'
                }
              </div>
              {searchTerm || riskLevelFilter !== 'all' || complianceFilter !== 'all' ? (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  className="mt-4"
                  onClick={() => openModal('addVendor')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Vendor
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Assessment
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{vendor.name}</div>
                          {vendor.industry && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.industry}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (vendor.risk_score || 0) >= 80 ? 'bg-green-500' : 
                                (vendor.risk_score || 0) >= 60 ? 'bg-yellow-500' : 
                                (vendor.risk_score || 0) >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${vendor.risk_score || 0}%` }}
                            />
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {vendor.risk_score || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RiskBadge level={vendor.risk_level as 'Low' | 'Medium' | 'High' | 'Critical' || 'Medium'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          vendor.compliance_status === 'Compliant' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                          vendor.compliance_status === 'Partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}>
                          {vendor.compliance_status || 'Non-Compliant'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(vendor.last_assessment_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVendorManagement;