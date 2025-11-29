import React, { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { sectorGuidanceService, AssessmentRecommendation } from '../../services/sectorGuidanceService';
import { useNavigate } from 'react-router-dom';

interface AssessmentRecommenderProps {
  serviceTypes: string[];
  dataTypes: string[];
  onStartAssessment?: (assessmentName: string) => void;
}

const AssessmentRecommender: React.FC<AssessmentRecommenderProps> = ({
  serviceTypes,
  dataTypes,
  onStartAssessment,
}) => {
  const [recommendations, setRecommendations] = useState<AssessmentRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadRecommendations = useCallback(async () => {
    if (serviceTypes.length === 0 || dataTypes.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await sectorGuidanceService.getRecommendedAssessments(
        serviceTypes[0],
        dataTypes
      );
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [serviceTypes, dataTypes]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleStartAssessment = (assessmentName: string) => {
    if (onStartAssessment) {
      onStartAssessment(assessmentName);
    } else {
      navigate('/vendor/assessments/proactive', { state: { assessmentName } });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (serviceTypes.length === 0 || dataTypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Please select service types and data types to get assessment recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No assessment recommendations available at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Assessments</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Based on your service types and data types, here are the assessments we recommend
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendortal-purple transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {recommendation.assessment}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                        recommendation.priority
                      )}`}
                    >
                      {recommendation.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {recommendation.reason}
                  </p>
                  {recommendation.estimated_time && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      Estimated time: {recommendation.estimated_time}
                    </div>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStartAssessment(recommendation.assessment)}
                >
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentRecommender;

