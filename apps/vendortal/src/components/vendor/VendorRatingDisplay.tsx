import React, { useEffect, useState, useCallback } from 'react';
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { vendorRatingService, RatingBreakdown, IndustryBenchmark } from '../../services/vendorRatingService';

interface VendorRatingDisplayProps {
  vendorId: string;
  industry?: string;
  showBreakdown?: boolean;
  showBenchmark?: boolean;
}

const VendorRatingDisplay: React.FC<VendorRatingDisplayProps> = ({
  vendorId,
  industry,
  showBreakdown = true,
  showBenchmark = true,
}) => {
  const [overallRating, setOverallRating] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<RatingBreakdown | null>(null);
  const [benchmark, setBenchmark] = useState<IndustryBenchmark | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRating = useCallback(async () => {
    try {
      setLoading(true);
      const rating = await vendorRatingService.calculateVendorRating(vendorId);
      setOverallRating(rating.overall_rating);

      if (showBreakdown) {
        const breakdownData = await vendorRatingService.getRatingBreakdown(vendorId);
        setBreakdown(breakdownData);
      }

      if (showBenchmark && industry) {
        const benchmarkData = await vendorRatingService.getIndustryBenchmark(industry);
        setBenchmark(benchmarkData);
      }
    } catch (error) {
      console.error('Error loading rating:', error);
    } finally {
      setLoading(false);
    }
  }, [vendorId, industry, showBreakdown, showBenchmark]);

  useEffect(() => {
    loadRating();
  }, [loadRating]);

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600 dark:text-green-400';
    if (rating >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 20);
    const hasHalfStar = rating % 20 >= 10;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300 dark:text-gray-600" />);
      }
    }

    return stars;
  };

  const getComparisonIcon = (vendorRating: number, benchmarkRating: number) => {
    if (vendorRating > benchmarkRating) {
      return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
    } else if (vendorRating < benchmarkRating) {
      return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (overallRating === null) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">No rating available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className={`text-5xl font-bold ${getRatingColor(overallRating)} mb-2`}>
            {overallRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {getRatingStars(overallRating)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Rating</p>
        </div>

        {/* Industry Benchmark */}
        {showBenchmark && benchmark && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Industry Comparison
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Your Rating</span>
                <span className={`font-medium ${getRatingColor(overallRating)}`}>
                  {overallRating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Industry Average</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {benchmark.average_rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Industry Median</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {benchmark.median_rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Comparison</span>
                <div className="flex items-center gap-2">
                  {getComparisonIcon(overallRating, benchmark.average_rating)}
                  <span className="text-sm text-gray-900 dark:text-white">
                    {overallRating > benchmark.average_rating
                      ? 'Above Average'
                      : overallRating < benchmark.average_rating
                      ? 'Below Average'
                      : 'Average'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating Breakdown */}
        {showBreakdown && breakdown && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Rating Breakdown
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Assessment Score', value: breakdown.assessment_score, weight: breakdown.weights.assessment },
                { label: 'Compliance Score', value: breakdown.compliance_score, weight: breakdown.weights.compliance },
                { label: 'Response Time', value: breakdown.response_time_score, weight: breakdown.weights.response_time },
                { label: 'Completion Rate', value: breakdown.completion_rate, weight: breakdown.weights.completion_rate },
                { label: 'Security Posture', value: breakdown.security_posture_score, weight: breakdown.weights.security_posture },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className={`text-sm font-medium ${getRatingColor(item.value)}`}>
                      {item.value.toFixed(1)} ({Math.round(item.weight * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getRatingColor(item.value).replace('text-', 'bg-')}`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorRatingDisplay;

