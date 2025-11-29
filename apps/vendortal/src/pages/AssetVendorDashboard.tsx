import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Building, 
  Shield, 
  AlertTriangle, 
  Search,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  BarChart3,
  Network,
  Zap
} from 'lucide-react';
import { AssetWithVendors, VendorWithAssets, Alert } from '../types';
import { assetService } from '../services/assetService';
import { useAuth } from '../context/AuthContext';
import { useVendors } from '../hooks/useVendors';

const AssetVendorDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { vendors: vendorsData, loading: vendorsLoading } = useVendors();
  const [assets, setAssets] = useState<AssetWithVendors[]>([]);
  const [vendors, setVendors] = useState<VendorWithAssets[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'assets' | 'vendors'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'assets' | 'vendors' | 'relationships' | 'alerts'>('overview');

  useEffect(() => {
    if (user?.id && !vendorsLoading) {
      loadDashboardData();
    }
  }, [user?.id, vendorsLoading, vendorsData]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load assets with vendor relationships
      const assetsData = await assetService.getAssets(user!.id);
      const assetsWithVendors = await Promise.all(
        assetsData.map(asset => assetService.getAssetWithVendors(asset.id))
      );
      setAssets(assetsWithVendors.filter(Boolean) as AssetWithVendors[]);

      // Load vendors with asset relationships
      // Map vendors to include asset relationships
      const vendorsWithAssets = await Promise.all(
        vendorsData.map(async (vendor) => {
          try {
            const relationships = await assetService.getVendorAssetRelationships(vendor.id);
            const assets = await Promise.all(
              relationships.map(async (rel) => {
                const asset = await assetService.getAsset(rel.asset_id);
                return asset;
              })
            );
            return {
              ...vendor,
              assets: assets.filter(Boolean) as any[],
              asset_relationships: relationships,
              due_diligence_requirements: [],
              overall_risk_score: vendor.risk_score || 0,
              critical_assets_count: 0,
              high_risk_relationships_count: 0,
              overdue_assessments_count: 0
            };
          } catch (error) {
            logger.error(`Error loading vendor ${vendor.id}:`, error);
            return {
              ...vendor,
              assets: [],
              asset_relationships: [],
              due_diligence_requirements: [],
              overall_risk_score: vendor.risk_score || 0,
              critical_assets_count: 0,
              high_risk_relationships_count: 0,
              overdue_assessments_count: 0
            };
          }
        })
      );
      setVendors(vendorsWithAssets as VendorWithAssets[]);

      // Load alerts
      const alertsData = await assetService.getAlerts(user!.id);
      setAlerts(alertsData);

    } catch (error) {
      logger.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-600 bg-red-100 dark:bg-red-900/20' };
    if (score >= 60) return { level: 'High', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20' };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' };
    return { level: 'Low', color: 'text-green-600 bg-green-100 dark:bg-green-900/20' };
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || 
                       (asset.risk_score && getRiskLevel(asset.risk_score).level.toLowerCase() === riskFilter);
    return matchesSearch && matchesRisk;
  });

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.industry && vendor.industry.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = riskFilter === 'all' || 
                       (vendor.overall_risk_score && getRiskLevel(vendor.overall_risk_score).level.toLowerCase() === riskFilter);
    return matchesSearch && matchesRisk;
  });

  const criticalAssets = assets.filter(a => a.criticality_level === 'critical').length;
  const highRiskVendors = vendors.filter(v => v.overall_risk_score >= 70).length;
  const overdueAssessments = alerts.filter(a => a.type === 'overdue_assessment' && !a.resolved).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('assetDashboard.loading', 'Loading dashboard...')}</p>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('assetDashboard.title', 'Asset-Vendor Risk Dashboard')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('assetDashboard.subtitle', 'Comprehensive view of asset inventory and vendor relationships')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('common.refresh', 'Refresh')}
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('assetDashboard.addAsset', 'Add Asset')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{assets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Assets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{criticalAssets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Risk Vendors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{highRiskVendors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{criticalAlerts}</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Assessments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'assets', label: 'Assets', icon: Shield },
              { id: 'vendors', label: 'Vendors', icon: Building },
              { id: 'relationships', label: 'Relationships', icon: Network },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                  selectedTab === tab.id
                    ? 'border-vendortal-navy text-vendortal-navy dark:text-vendortal-purple'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('assetDashboard.search.placeholder', 'Search assets, vendors, or relationships...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">{t('assetDashboard.filters.allItems', 'All Items')}</option>
              <option value="assets">{t('assetDashboard.filters.assetsOnly', 'Assets Only')}</option>
              <option value="vendors">{t('assetDashboard.filters.vendorsOnly', 'Vendors Only')}</option>
            </select>
            
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">{t('assetDashboard.filters.allRisks', 'All Risk Levels')}</option>
              <option value="low">{t('assetDashboard.filters.lowRisk', 'Low Risk')}</option>
              <option value="medium">{t('assetDashboard.filters.mediumRisk', 'Medium Risk')}</option>
              <option value="high">{t('assetDashboard.filters.highRisk', 'High Risk')}</option>
              <option value="critical">{t('assetDashboard.filters.criticalRisk', 'Critical Risk')}</option>
            </select>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset-Vendor Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Asset-Vendor Risk Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
              {assets.slice(0, 5).map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">{asset.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(asset.criticality_level)}`}>
                          {asset.criticality_level}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {t('assetDashboard.vendorCount', '{{count}} vendor(s)', { count: asset.vendors.length })} • {t('assetDashboard.relationshipCount', '{{count}} relationship(s)', { count: asset.vendor_relationships.length })}
                      </div>
                      {asset.primary_vendor && (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{t('assetDashboard.primaryVendor', 'Primary Vendor: ')}</span>
                          <span className="font-medium">{asset.primary_vendor.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>{t('assetDashboard.recentAlerts', 'Recent Alerts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-orange-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'assets' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('assetDashboard.assets.title', 'Assets')} ({filteredAssets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.asset', 'Asset')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.type', 'Type')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.criticality', 'Criticality')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.riskScore', 'Risk Score')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.vendors', 'Vendors')}</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('common.actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => {
                      const riskLevel = asset.risk_score ? getRiskLevel(asset.risk_score) : null;
                      return (
                        <tr key={asset.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{asset.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{asset.description}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white">{asset.asset_type}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(asset.criticality_level)}`}>
                              {asset.criticality_level}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {asset.risk_score ? (
                              <div>
                                <span className={`font-medium ${riskLevel?.color.split(' ')[0]}`}>
                                  {asset.risk_score}
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {t('assetDashboard.risk.label', '{{level}} Risk', { level: riskLevel?.level })}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">{t('assetDashboard.notAssessed', 'Not assessed')}</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white">
                            {t('assetDashboard.vendorCount', '{{count}} vendor(s)', { count: asset.vendors.length })}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'vendors' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('assetDashboard.vendors.title', 'Vendors')} ({filteredVendors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.vendor', 'Vendor')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.industry', 'Industry')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.riskScore', 'Risk Score')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.assets', 'Assets')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('assetDashboard.table.criticalAssets', 'Critical Assets')}</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t('common.actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => {
                      const riskLevel = getRiskLevel(vendor.overall_risk_score);
                      return (
                        <tr key={vendor.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{vendor.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{vendor.industry}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white">{vendor.industry}</td>
                          <td className="py-4 px-4">
                            <div>
                              <span className={`font-medium ${riskLevel.color.split(' ')[0]}`}>
                                {vendor.overall_risk_score}
                              </span>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {t('assetDashboard.risk.label', '{{level}} Risk', { level: riskLevel.level })}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white">
                            {t('assetDashboard.assetCount', '{{count}} asset(s)', { count: vendor.assets.length })}
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white">
                            {t('assetDashboard.criticalCount', '{{count}} critical', { count: vendor.critical_assets_count })}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'relationships' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
              <CardTitle>{t('assetDashboard.relationships.title', 'Asset-Vendor Relationships')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">{asset.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(asset.criticality_level)}`}>
                          {asset.criticality_level}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {asset.vendor_relationships.map((relationship) => (
                          <div key={relationship.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {relationship.vendor_id || t('assetDashboard.unknownVendor', 'Unknown Vendor')}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {relationship.relationship_type} • {relationship.data_access_level} {t('assetDashboard.access', 'access')}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(relationship.criticality_to_asset)}`}>
                                {relationship.criticality_to_asset}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'alerts' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('assetDashboard.systemAlerts', 'System Alerts')} ({alerts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      alert.severity === 'critical' ? 'bg-red-500' :
                      alert.severity === 'high' ? 'bg-orange-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">{alert.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {alert.severity}
                          </span>
                          {alert.acknowledged && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              Acknowledged
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(alert.created_at).toLocaleDateString()} at {new Date(alert.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!alert.acknowledged && (
                        <Button variant="outline" size="sm">
                          {t('assetDashboard.acknowledge', 'Acknowledge')}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssetVendorDashboard;