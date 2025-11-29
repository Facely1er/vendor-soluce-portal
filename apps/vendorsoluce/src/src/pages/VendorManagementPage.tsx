import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Building, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { VendorProfile } from '../services/vendorService';
import VendorVerification from '../components/vendor/VendorVerification';
import { logger } from '../utils/logger';

interface VendorStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageRiskScore: number;
  complianceBreakdown: {
    compliant: number;
    'non-compliant': number;
    partial: number;
  };
}

const VendorManagementPage: React.FC = () => {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadVendors();
    loadStats();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to get all vendors
      // For now, we'll simulate with mock data
      const mockVendors: VendorProfile[] = [
        {
          id: '1',
          company_name: 'TechCorp Solutions',
          legal_name: 'TechCorp Solutions Inc.',
          website: 'https://techcorp.com',
          industry: 'Technology',
          company_size: 'large',
          founded_year: 2010,
          headquarters: 'San Francisco, CA, USA',
          description: 'Leading technology solutions provider',
          status: 'pending',
          risk_score: 75,
          compliance_status: 'compliant',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          user_id: 'user-1'
        },
        {
          id: '2',
          company_name: 'SecureData Ltd',
          legal_name: 'SecureData Limited',
          website: 'https://securedata.com',
          industry: 'Cybersecurity',
          company_size: 'medium',
          founded_year: 2015,
          headquarters: 'London, UK',
          description: 'Cybersecurity and data protection services',
          status: 'approved',
          risk_score: 85,
          compliance_status: 'compliant',
          created_at: '2024-01-10T14:30:00Z',
          updated_at: '2024-01-12T09:15:00Z',
          user_id: 'user-2'
        },
        {
          id: '3',
          company_name: 'CloudSoft Inc',
          legal_name: 'CloudSoft Incorporated',
          website: 'https://cloudsoft.com',
          industry: 'Cloud Services',
          company_size: 'small',
          founded_year: 2020,
          headquarters: 'Austin, TX, USA',
          description: 'Cloud infrastructure and software services',
          status: 'rejected',
          risk_score: 45,
          compliance_status: 'non-compliant',
          created_at: '2024-01-08T16:45:00Z',
          updated_at: '2024-01-09T11:20:00Z',
          user_id: 'user-3'
        }
      ];
      
      setVendors(mockVendors);
    } catch (error) {
      logger.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const mockStats = {
        total: 25,
        pending: 8,
        approved: 15,
        rejected: 2,
        averageRiskScore: 72.5,
        complianceBreakdown: {
          compliant: 15,
          'non-compliant': 5,
          partial: 5
        }
      };
      setStats(mockStats);
    } catch (error) {
      logger.error('Error loading stats:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || vendor.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'under-review':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-600' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  const handleVendorVerified = (vendorId: string, status: 'approved' | 'rejected') => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status } : vendor
    ));
    setSelectedVendor(null);
  };

  if (selectedVendor) {
    return (
      <VendorVerification 
        vendorId={selectedVendor.id} 
        onVendorVerified={handleVendorVerified}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Vendor Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage vendor registrations and verifications
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={loadVendors}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vendors</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Risk Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRiskScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="under-review">Under Review</option>
              </select>
              
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                aria-label="Filter by industry"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Services">Cloud Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Financial">Financial</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Industry</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Risk Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Compliance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Created</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVendors.map((vendor) => {
                    const riskLevel = vendor.risk_score ? getRiskLevel(vendor.risk_score) : null;
                    return (
                      <tr key={vendor.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {vendor.company_name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {vendor.headquarters}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-900 dark:text-white">
                          {vendor.industry}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {vendor.risk_score ? (
                            <div>
                              <span className={`font-medium ${riskLevel?.color}`}>
                                {vendor.risk_score}
                              </span>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {riskLevel?.level} Risk
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Not assessed</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.compliance_status)}`}>
                            {vendor.compliance_status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-900 dark:text-white">
                          {new Date(vendor.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedVendor(vendor)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* Handle edit */}}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* Handle delete */}}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredVendors.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * itemsPerPage >= filteredVendors.length}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorManagementPage;