import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { PieChart, CheckCircle, AlertTriangle, Download, FileOutput, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionScore {
  title: string;
  percentage: number;
  completed: boolean;
}

interface ResultData {
  overallScore: number;
  sectionScores: SectionScore[];
  assessmentType: 'ransomware' | 'supplychain' | 'cui' | 'privacy';
  frameworkName: string;
  completedDate: string;
  assessmentId?: string;
}

interface AssessmentResultsProps {
  data: ResultData;
  onExport: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ data, onExport }) => {
  // Helper functions
  const getRecommendationsLink = (assessmentType: string, assessmentId?: string) => {
    const id = assessmentId || 'demo';
    // Map assessment types to their correct route paths
    const typeMap: Record<string, string> = {
      'supplychain': 'supply-chain',
      'ransomware': 'supply-chain', // Currently only supply-chain recommendations exist
      'cui': 'supply-chain',
      'privacy': 'supply-chain'
    };
    const routeType = typeMap[assessmentType] || 'supply-chain';
    return `/${routeType}-recommendations/${id}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-success/10 dark:bg-success/20';
    if (score >= 60) return 'bg-primary/10 dark:bg-primary/20';
    if (score >= 40) return 'bg-warning/10 dark:bg-warning/20';
    return 'bg-destructive/10 dark:bg-destructive/20';
  };

  const getSeverityText = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Moderate Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  };

  const frameworkLogos = {
    'ransomware': <PieChart className="h-12 w-12 text-destructive" />,
    'supplychain': <CheckCircle className="h-12 w-12 text-primary" />,
    'cui': <FileOutput className="h-12 w-12 text-secondary" />,
    'privacy': <Info className="h-12 w-12 text-accent" />
  };

  return (
    <div>
      <Card className="mb-6 border dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {frameworkLogos[data.assessmentType]}
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Results</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">{data.frameworkName} • {data.completedDate}</p>
              </div>
            </div>
            <Button onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className={`text-6xl font-bold ${getScoreColor(data.overallScore)}`}>{data.overallScore}%</div>
                  <div className={`text-sm font-medium mt-1 ${getScoreColor(data.overallScore)}`}>{getSeverityText(data.overallScore)}</div>
                  
                  {/* Circular progress indicator */}
                  <svg className="absolute -top-4 -left-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className="fill-none stroke-gray-200 dark:stroke-gray-700 stroke-[5%]"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className={`fill-none ${getScoreColor(data.overallScore)} stroke-[5%]`}
                      strokeDasharray={`${data.overallScore} 100`}
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Overall Compliance Score</div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${getScoreBackground(data.overallScore)}`} 
                    style={{ width: `${data.overallScore}%` }}>
                  </div>
                </div>
              </div>

              {data.overallScore < 70 && (
                <div className="mt-4 p-3 bg-warning/10 dark:bg-warning/20 rounded-lg flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 text-warning mr-2" />
                  <div>
                    <span className="font-medium">Action required.</span> Your assessment indicates gaps that should be addressed.
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Link to={getRecommendationsLink(data.assessmentType, data.assessmentId)}>
                  <Button className="w-full">
                    View Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Section Scores</h3>
              <div className="space-y-4">
                {data.sectionScores.map((section, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{section.title}</div>
                      <div className={`text-sm font-medium ${getScoreColor(section.percentage)}`}>{section.percentage}%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${getScoreBackground(section.percentage)}`} 
                        style={{ width: `${section.percentage}%` }}>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border dark:border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="text-lg font-bold text-success">Strengths</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Areas of good compliance</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border dark:border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <div className="text-lg font-bold text-warning">Improvement Areas</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Areas requiring attention</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border dark:border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <FileOutput className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold text-primary">Documentation</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Evidence requirements</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResults;

export { AssessmentResults }