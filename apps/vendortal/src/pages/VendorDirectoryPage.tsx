import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building, Star, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import VendorSearch, { VendorSearchFilters } from '../components/directory/VendorSearch';
import TrustBadges from '../components/vendor/TrustBadges';
import { vendorDirectoryService, PublicVendorProfile, VendorDirectoryStats } from '../services/vendorDirectoryService';
import { logger } from '../utils/logger';

const VendorDirectoryPage: React.FC = () => {
  const [vendors, setVendors] = useState<PublicVendorProfile[]>([]);
  const [stats, setStats] = useState<VendorDirectoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VendorSearchFilters>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
    loadVendors();
  }, []);

  useEffect(() => {
    loadVendors();
  }, [filters, page]);

  const loadStats = async () => {
    try {
      const data = await vendorDirectoryService.getVendorDirectoryStats();
      setStats(data);
    } catch (err) {
      logger.error('Error loading directory stats:', err);
    }
  };

  const loadVendors = async () => {
    try {
      setLoading(true);
      const result = await vendorDirectoryService.searchVendors({
        ...filters,
        limit: 20,
        offset: (page - 1) * 20,
      });
      setVendors(result.vendors);
      setTotal(result.total);
    } catch (err) {
      logger.error('Error loading vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters: VendorSearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleViewProfile = (vendorId: string) => {
    navigate(`/directory/vendor/${vendorId}`);
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 20);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Vendor Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover pre-verified vendors with strong security postures
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-vendortal-purple">{stats.total_vendors}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Vendors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-vendortal-purple">
                  {stats.average_rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-vendortal-purple">{stats.top_rated_count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Top Rated</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-vendortal-purple">
                  {Object.keys(stats.by_industry).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Industries</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <VendorSearch onSearch={handleSearch} initialFilters={filters} />

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : vendors.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No vendors found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search filters or check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {vendors.length} of {total} vendors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewProfile(vendor.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {vendor.company_name}
                        </h3>
                        {vendor.industry && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.industry}</p>
                        )}
                      </div>
                      {vendor.logo_url && (
                        <img
                          src={vendor.logo_url}
                          alt={vendor.company_name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                    </div>

                    {vendor.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {vendor.description}
                      </p>
                    )}

                    {vendor.vendor_rating !== null && vendor.vendor_rating !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {getRatingStars(vendor.vendor_rating)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {vendor.vendor_rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}

                    <TrustBadges
                      vendorRating={vendor.vendor_rating}
                      securityPostureScore={vendor.security_posture_score}
                      frameworks={vendor.service_types || []}
                      sbomComplianceStatus={vendor.sbom_compliance_status}
                      assetCount={vendor.asset_count}
                      criticalAssetsCount={vendor.critical_assets_count}
                      className="mb-4"
                    />

                    {vendor.service_types && vendor.service_types.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {vendor.service_types.slice(0, 3).map((type) => (
                            <span
                              key={type}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                            >
                              {type}
                            </span>
                          ))}
                          {vendor.service_types.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                              +{vendor.service_types.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(vendor.id);
                      }}
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {total > 20 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {Math.ceil(total / 20)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendorDirectoryPage;

