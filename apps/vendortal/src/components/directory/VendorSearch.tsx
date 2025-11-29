import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { serviceCategories } from '../../data/serviceTypes';

interface VendorSearchProps {
  onSearch: (filters: VendorSearchFilters) => void;
  initialFilters?: VendorSearchFilters;
}

export interface VendorSearchFilters {
  search?: string;
  industry?: string;
  service_types?: string[];
  data_types?: string[];
  min_rating?: number;
  max_rating?: number;
  compliance_status?: string;
  company_size?: string;
  sort_by?: 'rating' | 'name' | 'recent' | 'relevance';
  sort_order?: 'asc' | 'desc';
}

const VendorSearch: React.FC<VendorSearchProps> = ({ onSearch, initialFilters = {} }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VendorSearchFilters>({
    ...initialFilters,
    service_types: initialFilters.service_types || [],
    data_types: initialFilters.data_types || [],
  });

  const handleSearch = () => {
    onSearch({
      ...filters,
      search: searchTerm,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof VendorSearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleServiceTypeToggle = (type: string) => {
    setFilters((prev) => {
      const current = prev.service_types || [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, service_types: updated };
    });
  };

  // Data type toggle handler - kept for future use
  // const handleDataTypeToggle = (type: string) => {
  //   setFilters((prev) => {
  //     const current = prev.data_types || [];
  //     const updated = current.includes(type)
  //       ? current.filter((t) => t !== type)
  //       : [...current, type];
  //     return { ...prev, data_types: updated };
  //   });
  // };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      service_types: [],
      data_types: [],
    });
    onSearch({});
  };

  const hasActiveFilters = () => {
    return (
      searchTerm ||
      filters.industry ||
      (filters.service_types && filters.service_types.length > 0) ||
      (filters.data_types && filters.data_types.length > 0) ||
      filters.min_rating !== undefined ||
      filters.max_rating !== undefined ||
      filters.compliance_status ||
      filters.company_size
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors by name, industry, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
          />
        </div>
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        {hasActiveFilters() && (
          <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry
            </label>
            <select
              value={filters.industry || ''}
              onChange={(e) => handleFilterChange('industry', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Filter by industry"
              title="Filter by industry"
            >
              <option value="">All Industries</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Technology">Technology</option>
              <option value="Business Operations">Business Operations</option>
              <option value="Analytics">Analytics</option>
            </select>
          </div>

          {/* Service Types Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Service Types
            </label>
            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleServiceTypeToggle(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.service_types?.includes(category)
                      ? 'bg-vendortal-purple text-white border-vendortal-purple'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-vendortal-purple'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                value={filters.min_rating || ''}
                onChange={(e) =>
                  handleFilterChange('min_rating', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                value={filters.max_rating || ''}
                onChange={(e) =>
                  handleFilterChange('max_rating', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Compliance Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compliance Status
            </label>
            <select
              value={filters.compliance_status || ''}
              onChange={(e) => handleFilterChange('compliance_status', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Filter by compliance status"
              title="Filter by compliance status"
            >
              <option value="">All Statuses</option>
              <option value="compliant">Compliant</option>
              <option value="partial">Partial</option>
              <option value="non-compliant">Non-Compliant</option>
            </select>
          </div>

          {/* Company Size Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Size
            </label>
            <select
              value={filters.company_size || ''}
              onChange={(e) => handleFilterChange('company_size', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Filter by company size"
              title="Filter by company size"
            >
              <option value="">All Sizes</option>
              <option value="startup">Startup (1-10)</option>
              <option value="small">Small (11-50)</option>
              <option value="medium">Medium (51-200)</option>
              <option value="large">Large (201-1000)</option>
              <option value="enterprise">Enterprise (1000+)</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={filters.sort_by || 'rating'}
                onChange={(e) => handleFilterChange('sort_by', e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                aria-label="Sort by"
                title="Sort by"
              >
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="recent">Most Recent</option>
                <option value="relevance">Relevance</option>
              </select>
              <select
                value={filters.sort_order || 'desc'}
                onChange={(e) => handleFilterChange('sort_order', e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                aria-label="Sort order"
                title="Sort order"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSearch} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSearch;

