import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  BarChart, 
  Download, 
  ArrowLeft, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Users, 
  Network, 
  Database, 
  File
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
}

interface RecommendationsProps {
  title: string;
  subtitle: string;
  assessmentType: string;
  recommendations: RecommendationItem[];
  onBack: () => void;
  onExport: () => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  title,
  subtitle,
  recommendations,
  onBack,
  onExport,
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  
  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-destructive bg-destructive/10 dark:bg-destructive/20';
      case 'high': return 'text-warning bg-warning/10 dark:bg-warning/20';
      case 'medium': return 'text-primary bg-primary/10 dark:bg-primary/20';
      case 'low': return 'text-success bg-success/10 dark:bg-success/20';
      default: return 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'minimal': return '●';
      case 'moderate': return '●●';
      case 'significant': return '●●●';
      default: return '●';
    }
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return '< 30 days';
      case 'short-term': return '1-3 months';
      case 'medium-term': return '3-6 months';
      case 'long-term': return '6+ months';
      default: return 'Undefined';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'authentication': return <Lock className="h-5 w-5 text-primary" />;
      case 'access control': return <Users className="h-5 w-5 text-primary" />;
      case 'network': return <Network className="h-5 w-5 text-primary" />;
      case 'data protection': return <Database className="h-5 w-5 text-primary" />;
      case 'governance': return <Shield className="h-5 w-5 text-primary" />;
      case 'documentation': return <File className="h-5 w-5 text-primary" />;
      default: return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  // Filter recommendations by priority
  const filteredRecommendations = activeFilter === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.priority === activeFilter);

  // Group recommendations by category
  const groupedRecommendations: Record<string, RecommendationItem[]> = {};
  filteredRecommendations.forEach(rec => {
    if (!groupedRecommendations[rec.category]) {
      groupedRecommendations[rec.category] = [];
    }
    groupedRecommendations[rec.category].push(rec);
  });

  return (
    <div>
      <div className="mb-6 flex justify-between flex-col md:flex-row items-start md:items-center gap-4">
        <div>
          <Button
            variant="outline"
            className="mb-2"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
        </div>
        <Button onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Recommendations
        </Button>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium text-gray-900 dark:text-white">Filter by Priority:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm"
              variant={activeFilter === 'all' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'critical' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('critical')}
              className={activeFilter === 'critical' ? '' : 'border-destructive/50 text-destructive hover:bg-destructive/10'}
            >
              <AlertTriangle className="h-4 w-4 mr-1 text-destructive" /> 
              Critical
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'high' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('high')}
              className={activeFilter === 'high' ? '' : 'border-warning/50 text-warning hover:bg-warning/10'}
            >
              <AlertTriangle className="h-4 w-4 mr-1 text-warning" />
              High
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'medium' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('medium')}
              className={activeFilter === 'medium' ? '' : 'border-primary/50 text-primary hover:bg-primary/10'}
            >
              Medium
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'low' ? 'primary' : 'outline'}
              onClick={() => setActiveFilter('low')}
              className={activeFilter === 'low' ? '' : 'border-success/50 text-success hover:bg-success/10'}
            >
              <CheckCircle className="h-4 w-4 mr-1 text-success" />
              Low
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedRecommendations).length === 0 ? (
          <Card className="border dark:border-gray-700 text-center p-12">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Recommendations Needed</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Great job! No recommendations were found for the selected filter.
            </p>
          </Card>
        ) : (
          Object.entries(groupedRecommendations).map(([category, items]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center mb-4">
                {getCategoryIcon(category)}
                <h2 className="text-xl font-semibold ml-2 text-gray-900 dark:text-white">{category}</h2>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="border dark:border-gray-700">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <div 
                        className="flex justify-between items-start cursor-pointer" 
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority.toUpperCase()}
                            </span>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                              {getTimeframeText(item.timeframe)}
                            </span>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                              Effort: {getEffortIcon(item.effort)}
                            </span>
                          </div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{item.title}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon">
                          {expandedItems[item.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className={`px-4 pt-2 pb-4 ${expandedItems[item.id] ? 'block' : 'hidden'}`}>
                      <CardDescription className="mb-4 text-gray-600 dark:text-gray-400">{item.description}</CardDescription>
                      
                      <div className="bg-gray-100/30 dark:bg-gray-800/30 p-3 rounded-lg mb-4">
                        <div className="flex items-center mb-2">
                          <Shield className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium text-sm text-gray-900 dark:text-white">Expected Impact</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.impact}</p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium text-sm text-gray-900 dark:text-white">Implementation Steps</span>
                        </div>
                        <ol className="list-decimal list-inside space-y-2">
                          {item.steps.map((step, index) => (
                            <li key={index} className="text-sm text-gray-900 dark:text-white">
                              <span className="text-gray-600 dark:text-gray-400">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      {item.references.length > 0 && (
                        <div>
                          <div className="flex items-center mb-2">
                            <File className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium text-sm text-gray-900 dark:text-white">References</span>
                          </div>
                          <ul className="space-y-1">
                            {item.references.map((ref, index) => (
                              <li key={index} className="text-sm">
                                <a 
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {ref.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recommendations;