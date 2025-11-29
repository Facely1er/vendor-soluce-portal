import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { VendorAssessmentWithDetails } from '../../hooks/useVendorAssessments';

interface AssessmentProgressTrackerProps {
  assessments: VendorAssessmentWithDetails[];
}

const AssessmentProgressTracker: React.FC<AssessmentProgressTrackerProps> = ({ 
  assessments 
}) => {
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'completed').length;
  const inProgressAssessments = assessments.filter(a => a.status === 'in_progress').length;
  const overdueAssessments = assessments.filter(a => {
    if (!a.due_date) return false;
    return new Date(a.due_date) < new Date() && a.status !== 'completed';
  }).length;

  const averageScore = assessments
    .filter(a => a.overall_score !== null)
    .reduce((sum, a) => sum + (a.overall_score || 0), 0) / 
    Math.max(1, assessments.filter(a => a.overall_score !== null).length);

  const completionRate = totalAssessments > 0 ? (completedAssessments / totalAssessments) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completionRate.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageScore.toFixed(0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Compliance Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inProgressAssessments}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overdueAssessments}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentProgressTracker;