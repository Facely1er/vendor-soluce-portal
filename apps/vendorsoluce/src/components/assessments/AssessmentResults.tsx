import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { PieChart, CheckCircle, AlertTriangle, Download, FileOutput, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AssessmentResults.css';

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
  // Refs for progress bars
  const overallProgressRef = useRef<HTMLDivElement>(null);
  const sectionProgressRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set CSS custom properties for overall progress bar
  useEffect(() => {
    if (overallProgressRef.current) {
      overallProgressRef.current.style.setProperty('--progress-width', `${data.overallScore}%`);
    }
  }, [data.overallScore]);

  // Set CSS custom properties for section progress bars
  useEffect(() => {
    sectionProgressRefs.current.forEach((ref, index) => {
      if (ref && data.sectionScores[index]) {
        ref.style.setProperty('--progress-width', `${data.sectionScores[index].percentage}%`);
      }
    });
  }, [data.sectionScores]);

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
      <Card className="mb-5 border dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">{frameworkLogos[data.assessmentType]}</div>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Assessment Results</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{data.frameworkName} • {data.completedDate}</p>
              </div>
            </div>
            <Button onClick={onExport} size="sm" className="flex-shrink-0">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Overall Score Card - Optimized */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-5">
                <div className="relative inline-block">
                  <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(data.overallScore)} leading-none`}>{data.overallScore}%</div>
                  <div className={`text-xs sm:text-sm font-medium mt-2 ${getScoreColor(data.overallScore)}`}>{getSeverityText(data.overallScore)}</div>
                  
                  {/* Circular progress indicator - Optimized */}
                  <svg className="absolute -top-3 -left-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className="fill-none stroke-gray-200 dark:stroke-gray-700 stroke-[4%]"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className={`fill-none ${getScoreColor(data.overallScore)} stroke-[4%] transition-all duration-500`}
                      strokeDasharray={`${data.overallScore} 100`}
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Overall Compliance Score</div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    ref={overallProgressRef}
                    className={`assessment-progress-bar assessment-progress-bar-overall ${getScoreBackground(data.overallScore)}`}>
                  </div>
                </div>
              </div>

              {data.overallScore < 70 && (
                <div className="mt-4 p-2.5 bg-warning/10 dark:bg-warning/20 rounded-lg flex items-start gap-2 text-xs sm:text-sm">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Action required.</span> Your assessment indicates gaps that should be addressed.
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Link to={getRecommendationsLink(data.assessmentType, data.assessmentId)}>
                  <Button className="w-full text-sm" size="sm">
                    View Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Section Scores - Optimized */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">Section Scores</h3>
              <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2">
                {data.sectionScores.map((section, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate pr-2">{section.title}</div>
                      <div className={`text-xs sm:text-sm font-semibold ${getScoreColor(section.percentage)} flex-shrink-0`}>{section.percentage}%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div 
                        ref={(el) => {
                          sectionProgressRefs.current[index] = el;
                        }}
                        className={`assessment-progress-bar assessment-progress-bar-section ${getScoreBackground(section.percentage)}`}>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards - More compact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <Card className="border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-1.5 text-success" />
                  <div className="text-sm sm:text-base font-semibold text-success">Strengths</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Good compliance areas</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="text-center">
                  <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-1.5 text-warning" />
                  <div className="text-sm sm:text-base font-semibold text-warning">Improvements</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Areas needing attention</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="text-center">
                  <FileOutput className="h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-1.5 text-primary" />
                  <div className="text-sm sm:text-base font-semibold text-primary">Documentation</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Evidence requirements</div>
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