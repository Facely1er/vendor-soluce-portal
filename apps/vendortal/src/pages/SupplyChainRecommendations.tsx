import { logger } from '../utils/logger';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generateRecommendationsPdf } from '../utils/generatePdf';
import { useSupplyChainAssessments } from '../hooks/useSupplyChainAssessments';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  FileText,
  Target,
  Calendar,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';

interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  effort: 'minimal' | 'moderate' | 'significant';
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  impact: string;
  steps: string[];
  references: {
    title: string;
    url: string;
  }[];
  status?: 'not-started' | 'in-progress' | 'completed';
}

interface FilterState {
  priority: string;
  category: string;
  timeframe: string;
  effort: string;
  status: string;
}

const SupplyChainRecommendations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assessments, loading, error } = useSupplyChainAssessments();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    priority: 'all',
    category: 'all',
    timeframe: 'all',
    effort: 'all',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());

  // Generate recommendations based on assessment results
  useEffect(() => {
    if (!loading && assessments.length > 0) {
      const completedAssessment = assessments.find(a => a.status === 'completed');
      
      if (completedAssessment && completedAssessment.section_scores) {
        const sectionScores = completedAssessment.section_scores as any[];
        const generatedRecommendations = generateRecommendations(sectionScores);
        setRecommendations(generatedRecommendations);
      } else {
        setRecommendations(enhancedMockRecommendations);
      }
    } else if (!loading) {
      setRecommendations(enhancedMockRecommendations);
    }
  }, [assessments, loading]);

  // Generate recommendations based on section scores
  const generateRecommendations = (sectionScores: any[]): RecommendationItem[] => {
    const generatedRecommendations: RecommendationItem[] = [];
    
    sectionScores.forEach(section => {
      if (section.percentage < 60) {
        if (section.title.includes('Supplier Risk')) {
          generatedRecommendations.push({
            ...enhancedMockRecommendations[0],
            priority: section.percentage < 40 ? 'critical' : 'high'
          });
        }
        
        if (section.title.includes('Incident Response')) {
          generatedRecommendations.push({
            ...enhancedMockRecommendations[1],
            priority: section.percentage < 40 ? 'critical' : 'high'
          });
        }
        
        if (section.title.includes('Vulnerability')) {
          generatedRecommendations.push({
            ...enhancedMockRecommendations[2],
            priority: section.percentage < 40 ? 'critical' : 'high'
          });
        }
      }
    });
    
    if (generatedRecommendations.length === 0) {
      return enhancedMockRecommendations;
    }
    
    const remainingRecommendations = enhancedMockRecommendations.filter(rec => 
      !generatedRecommendations.some(genRec => genRec.id === rec.id)
    );
    
    const additionalCount = Math.min(5, remainingRecommendations.length);
    for (let i = 0; i < additionalCount; i++) {
      generatedRecommendations.push(remainingRecommendations[i]);
    }
    
    return generatedRecommendations;
  };

  // Filter and search recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rec.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = filters.priority === 'all' || rec.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || rec.category === filters.category;
      const matchesTimeframe = filters.timeframe === 'all' || rec.timeframe === filters.timeframe;
      const matchesEffort = filters.effort === 'all' || rec.effort === filters.effort;
      const matchesStatus = filters.status === 'all' || (rec.status || 'not-started') === filters.status;
      
      return matchesSearch && matchesPriority && matchesCategory && matchesTimeframe && matchesEffort && matchesStatus;
    });
  }, [recommendations, searchTerm, filters]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    return {
      priorities: [...new Set(recommendations.map(r => r.priority))],
      categories: [...new Set(recommendations.map(r => r.category))],
      timeframes: [...new Set(recommendations.map(r => r.timeframe))],
      efforts: [...new Set(recommendations.map(r => r.effort))]
    };
  }, [recommendations]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = recommendations.length;
    const critical = recommendations.filter(r => r.priority === 'critical').length;
    const completed = recommendations.filter(r => completedRecommendations.has(r.id)).length;
    const inProgress = recommendations.filter(r => (r.status || 'not-started') === 'in-progress').length;
    
    return { total, critical, completed, inProgress };
  }, [recommendations, completedRecommendations]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await generateRecommendationsPdf(
        t('supplyChainRecommendations.title'),
        filteredRecommendations,
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        'supply-chain-recommendations.pdf'
      );
    } catch (err) {
      logger.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleRecommendationStatus = (id: string) => {
    setCompletedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Loading skeleton */}
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('supplyChainRecommendations.errors.loadingError')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-vendortal-navy text-white rounded-md hover:bg-vendortal-navy/90 transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('supplyChainRecommendations.actions.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/supply-chain-results')}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-vendortal-navy focus:ring-offset-2 rounded-md p-1"
                aria-label={t('supplyChainRecommendations.navigation.backToResults')}
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                {t('supplyChainRecommendations.navigation.backToResults')}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-vendortal-navy focus:ring-offset-2"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t('supplyChainRecommendations.actions.filters')}
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || filteredRecommendations.length === 0}
                className="inline-flex items-center px-4 py-2 bg-vendortal-navy text-white rounded-md hover:bg-vendortal-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-vendortal-navy focus:ring-offset-2"
              >
                <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                {isExporting ? t('supplyChainRecommendations.actions.exporting') : t('supplyChainRecommendations.actions.exportPdf')}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-vendortal-navy" />
              {t('supplyChainRecommendations.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('supplyChainRecommendations.subtitle')}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('supplyChainRecommendations.stats.totalRecommendations')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('supplyChainRecommendations.stats.criticalPriority')}</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('supplyChainRecommendations.stats.inProgress')}</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('supplyChainRecommendations.stats.completed')}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('supplyChainRecommendations.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-vendortal-navy focus:border-transparent transition-colors"
              />
            </div>

            {showFilters && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('supplyChainRecommendations.filters.priority')}</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({...filters, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-vendortal-navy focus:border-transparent"
                    >
                      <option value="all">{t('supplyChainRecommendations.filters.allPriorities')}</option>
                      {filterOptions.priorities.map(priority => (
                        <option key={priority} value={priority} className="capitalize">{t(`supplyChainRecommendations.priorities.${priority}`)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('supplyChainRecommendations.filters.category')}</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-vendortal-navy focus:border-transparent"
                    >
                      <option value="all">{t('supplyChainRecommendations.filters.allCategories')}</option>
                      {filterOptions.categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('supplyChainRecommendations.filters.timeframe')}</label>
                    <select
                      value={filters.timeframe}
                      onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-vendortal-navy focus:border-transparent"
                    >
                      <option value="all">{t('supplyChainRecommendations.filters.allTimeframes')}</option>
                      {filterOptions.timeframes.map(timeframe => (
                        <option key={timeframe} value={timeframe} className="capitalize">{t(`supplyChainRecommendations.timeframes.${timeframe.replace('-', '')}`)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('supplyChainRecommendations.filters.effort')}</label>
                    <select
                      value={filters.effort}
                      onChange={(e) => setFilters({...filters, effort: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-vendortal-navy focus:border-transparent"
                    >
                      <option value="all">{t('supplyChainRecommendations.filters.allEffortLevels')}</option>
                      {filterOptions.efforts.map(effort => (
                        <option key={effort} value={effort} className="capitalize">{t(`supplyChainRecommendations.efforts.${effort}`)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('supplyChainRecommendations.filters.status')}</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-vendortal-navy focus:border-transparent"
                    >
                      <option value="all">{t('supplyChainRecommendations.filters.allStatuses')}</option>
                      <option value="not-started">{t('supplyChainRecommendations.statuses.notStarted')}</option>
                      <option value="in-progress">{t('supplyChainRecommendations.statuses.inProgress')}</option>
                      <option value="completed">{t('supplyChainRecommendations.statuses.completed')}</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFilters({
                      priority: 'all',
                      category: 'all',
                      timeframe: 'all',
                      effort: 'all',
                      status: 'all'
                    })}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t('supplyChainRecommendations.filters.clearAll')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6">
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('supplyChainRecommendations.emptyState.noRecommendations')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('supplyChainRecommendations.emptyState.tryDifferentFilters')}</p>
            </div>
          ) : (
            filteredRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                          {getPriorityIcon(recommendation.priority)}
                          <span className="ml-1 capitalize">{t(`supplyChainRecommendations.priorities.${recommendation.priority}`)}</span>
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                          {recommendation.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {recommendation.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {recommendation.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleRecommendationStatus(recommendation.id)}
                      className={`flex-shrink-0 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-vendortal-navy focus:ring-offset-2 ${
                        completedRecommendations.has(recommendation.id)
                          ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {completedRecommendations.has(recommendation.id) 
                        ? t('supplyChainRecommendations.actions.completed') 
                        : t('supplyChainRecommendations.actions.markComplete')
                      }
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">{t('supplyChainRecommendations.labels.timeframe')}:</span>
                      <span className="ml-1 capitalize">{t(`supplyChainRecommendations.timeframes.${recommendation.timeframe.replace('-', '')}`)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-medium">{t('supplyChainRecommendations.labels.effort')}:</span>
                      <span className="ml-1 capitalize">{t(`supplyChainRecommendations.efforts.${recommendation.effort}`)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span className="font-medium">{t('supplyChainRecommendations.labels.impact')}:</span>
                      <span className="ml-1">{t('supplyChainRecommendations.impactLevels.high')}</span>
                    </div>
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-vendortal-navy hover:text-vendortal-navy/80 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-vendortal-navy focus:ring-offset-2 rounded">
                      {t('supplyChainRecommendations.actions.viewSteps')}
                    </summary>
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('supplyChainRecommendations.labels.expectedImpact')}:</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{recommendation.impact}</p>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('supplyChainRecommendations.labels.implementationSteps')}:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          {recommendation.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      {recommendation.references.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('supplyChainRecommendations.labels.references')}:</h4>
                          <ul className="space-y-1 text-sm">
                            {recommendation.references.map((ref, index) => (
                              <li key={index}>
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-vendortal-navy hover:text-vendortal-navy/80 hover:underline transition-colors"
                                >
                                  {ref.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show results count */}
        {filteredRecommendations.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('supplyChainRecommendations.resultsCount', { 
              filtered: filteredRecommendations.length, 
              total: recommendations.length 
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced mock recommendations with status
const enhancedMockRecommendations: RecommendationItem[] = [
  {
    id: "sc1",
    title: "Implement Supplier Risk Tiering System",
    description: "Develop a formal risk-based tiering system for suppliers to prioritize assessment and monitoring activities based on criticality and access to sensitive data or systems.",
    priority: "critical",
    category: "Supplier Risk Management",
    effort: "moderate",
    timeframe: "short-term",
    impact: "A structured supplier tiering system enables efficient allocation of resources to the most critical supplier relationships and helps focus security requirements proportional to risk.",
    steps: [
      "Define criteria for supplier categorization (e.g., access to sensitive data, operational importance, ease of replacement)",
      "Develop a scoring methodology to determine supplier tier assignment",
      "Classify all existing suppliers according to the new system",
      "Document differentiated security requirements for each tier",
      "Implement tier-specific assessment and monitoring processes"
    ],
    references: [
      {
        title: "NIST SP 800-161r1 - Supply Chain Risk Management Practices",
        url: "https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final"
      },
      {
        title: "ISO 28001:2007 Security management systems for the supply chain",
        url: "https://www.iso.org/standard/45654.html"
      }
    ],
    status: "not-started"
  },
  {
    id: "sc2",
    title: "Establish Supply Chain Incident Response Procedures",
    description: "Develop specific incident response procedures for supply chain security incidents, including third-party breaches, compromised software components, and hardware tampering.",
    priority: "high",
    category: "Incident Response",
    effort: "significant",
    timeframe: "short-term",
    impact: "Dedicated supply chain incident procedures reduce response time and improve coordination during incidents that involve suppliers or third parties.",
    steps: [
      "Identify supply chain incident scenarios specific to your organization",
      "Define roles and responsibilities for supply chain incident response",
      "Establish communication protocols with key suppliers",
      "Create playbooks for common supply chain incident types",
      "Conduct tabletop exercises to test procedures",
      "Document recovery and continuity procedures for critical supplier disruptions"
    ],
    references: [
      {
        title: "NIST SP 800-161r1 - Appendix C: Supply Chain Threat Scenarios",
        url: "https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final"
      },
      {
        title: "CISA Cyber Supply Chain Risk Management",
        url: "https://www.cisa.gov/cyber-supply-chain-risk-management"
      }
    ],
    status: "in-progress"
  },
  {
    id: "sc3",
    title: "Implement Software Component Analysis",
    description: "Deploy automated tools to inventory and analyze software dependencies, libraries, and components used in applications to identify potential security vulnerabilities in the software supply chain.",
    priority: "high",
    category: "Vulnerability Management",
    effort: "moderate",
    timeframe: "short-term",
    impact: "Software component analysis enables early identification of vulnerable dependencies and reduces the risk of supply chain compromises through third-party code.",
    steps: [
      "Select and implement a software composition analysis (SCA) tool",
      "Integrate SCA into development and build pipelines",
      "Generate a software bill of materials (SBOM) for all applications",
      "Establish a process to review and remediate identified vulnerabilities",
      "Document acceptable risk thresholds for different component types",
      "Implement continuous monitoring for newly discovered vulnerabilities"
    ],
    references: [
      {
        title: "NIST SP 800-218 - Secure Software Development Framework",
        url: "https://csrc.nist.gov/publications/detail/sp/800-218/final"
      },
      {
        title: "NTIA Software Bill of Materials",
        url: "https://www.ntia.gov/sbom"
      }
    ],
    status: "not-started"
  },
  {
    id: "sc4",
    title: "Implement Vendor Security Requirements in Contracts",
    description: "Develop standardized security language for supplier contracts that clearly defines security requirements, assessment rights, incident notification, and compliance expectations.",
    priority: "high",
    category: "Governance",
    effort: "moderate",
    timeframe: "medium-term",
    impact: "Contractual security requirements establish clear expectations and provide leverage to enforce security practices across the supply chain.",
    steps: [
      "Work with legal and procurement teams to develop standard security clauses",
      "Define tiered security requirements based on supplier criticality",
      "Include requirements for incident notification, right-to-audit, and vulnerability disclosure",
      "Establish consequences for non-compliance with security requirements",
      "Implement a review process for security terms in all new contracts",
      "Develop a roadmap for updating existing contracts"
    ],
    references: [
      {
        title: "NIST IR 8276 - Key Practices in Cyber Supply Chain Risk Management",
        url: "https://csrc.nist.gov/publications/detail/nistir/8276/final"
      },
      {
        title: "Cloud Security Alliance - Consensus Assessments Initiative Questionnaire",
        url: "https://cloudsecurityalliance.org/research/guidance/"
      }
    ],
    status: "not-started"
  },
  {
    id: "sc5",
    title: "Create Secure Supplier Remote Access Controls",
    description: "Implement enhanced security controls for supplier remote access to internal systems, including dedicated access pathways, MFA, and granular monitoring.",
    priority: "critical",
    category: "Access Control",
    effort: "significant",
    timeframe: "immediate",
    impact: "Secured supplier access reduces the risk of unauthorized access through trusted third-party connections, a common attack vector in supply chain compromises.",
    steps: [
      "Inventory all supplier remote access connections",
      "Implement dedicated access methods (e.g., VPNs, secure gateways) for supplier connections",
      "Require MFA for all supplier remote access",
      "Implement just-in-time and just-enough access principles",
      "Deploy enhanced monitoring and logging for supplier activities",
      "Establish regular access review processes for supplier accounts"
    ],
    references: [
      {
        title: "NIST SP 800-207 - Zero Trust Architecture",
        url: "https://csrc.nist.gov/publications/detail/sp/800-207/final"
      },
      {
        title: "NSA/CISA Guidance for Securing Remote Access",
        url: "https://www.cisa.gov/publication/securing-remote-access-software"
      }
    ],
    status: "not-started"
  },
  {
    id: "sc6",
    title: "Develop Supplier Contingency Plans",
    description: "Create contingency plans for critical supplier disruptions, including identification of alternate suppliers, service continuity procedures, and emergency response actions.",
    priority: "medium",
    category: "Business Continuity",
    effort: "moderate",
    timeframe: "medium-term",
    impact: "Supplier contingency planning improves organizational resilience and reduces the impact of supply chain disruptions.",
    steps: [
      "Identify single points of failure in the supply chain",
      "Qualify alternate suppliers for critical components",
      "Develop continuity procedures for supplier disruptions",
      "Create emergency acquisition procedures",
      "Establish inventory management strategies for critical components",
      "Test contingency plans through tabletop exercises"
    ],
    references: [
      {
        title: "NIST SP 800-34r1 - Contingency Planning Guide",
        url: "https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final"
      },
      {
        title: "ISO 22301 - Business Continuity Management",
        url: "https://www.iso.org/standard/75106.html"
      }
    ],
    status: "not-started"
  },
  {
    id: "sc7",
    title: "Establish Threat Intelligence Sharing with Suppliers",
    description: "Create a framework for sharing relevant threat intelligence with key suppliers and receiving intelligence about supply chain threats from partners.",
    priority: "medium",
    category: "Information Sharing",
    effort: "moderate",
    timeframe: "medium-term",
    impact: "Collaborative threat intelligence sharing improves detection and prevention capabilities across the supply chain ecosystem.",
    steps: [
      "Identify the types of threat intelligence relevant to share with suppliers",
      "Establish secure channels for intelligence exchange",
      "Develop information sharing agreements with key suppliers",
      "Implement automated threat intelligence sharing where possible",
      "Join relevant information sharing communities like ISACs",
      "Create processes to act on received intelligence"
    ],
    references: [
      {
        title: "NIST SP 800-150 - Guide to Cyber Threat Information Sharing",
        url: "https://csrc.nist.gov/publications/detail/sp/800-150/final"
      },
      {
        title: "CISA Information Sharing and Awareness",
        url: "https://www.cisa.gov/information-sharing-and-awareness"
      }
    ],
    status: "not-started"
  },
  {
    id: "sc8",
    title: "Implement Secure Software Delivery Verification",
    description: "Establish processes to verify the integrity and authenticity of software delivered through the supply chain using code signing, checksum verification, and secure delivery methods.",
    priority: "low",
    category: "Software Security",
    effort: "moderate",
    timeframe: "medium-term",
    impact: "Software verification reduces the risk of compromised or tampered code entering the environment through trusted supply chain channels.",
    steps: [
      "Require suppliers to implement code signing for all software deliverables",
      "Establish secure hash verification procedures",
      "Document secure software delivery and verification processes",
      "Train relevant staff on verification procedures",
      "Implement automated verification where possible",
      "Establish incident procedures for failed verifications"
    ],
    references: [
      {
        title: "NIST SP 800-218 - Secure Software Development Framework",
        url: "https://csrc.nist.gov/publications/detail/sp/800-218/final"
      },
      {
        title: "SLSA Framework for Supply Chain Integrity",
        url: "https://slsa.dev/"
      }
    ],
    status: "not-started"
  }
];

export default SupplyChainRecommendations;