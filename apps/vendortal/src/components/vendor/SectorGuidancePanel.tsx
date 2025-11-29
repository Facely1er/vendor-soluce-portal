import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Shield, FileText, Lightbulb, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { sectorGuidanceService, SectorGuidance } from '../../services/sectorGuidanceService';
import { VendorProfile } from '../../services/sectorGuidanceService';

interface SectorGuidancePanelProps {
  vendorProfile: VendorProfile;
}

const SectorGuidancePanel: React.FC<SectorGuidancePanelProps> = ({ vendorProfile }) => {
  const [guidance, setGuidance] = useState<SectorGuidance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'frameworks' | 'assessments' | 'compliance' | 'controls' | 'practices'>('frameworks');

  const loadGuidance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sectorGuidanceService.getGuidanceByProfile(vendorProfile);
      setGuidance(data);
    } catch (error) {
      console.error('Error loading guidance:', error);
    } finally {
      setLoading(false);
    }
  }, [vendorProfile]);

  useEffect(() => {
    loadGuidance();
  }, [loadGuidance]);

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

  if (guidance.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No sector-specific guidance available. Please complete your vendor profile with service types and data types.
          </p>
        </CardContent>
      </Card>
    );
  }

  const frameworks = guidance.flatMap((g) => g.required_frameworks);
  const assessments = guidance.flatMap((g) => g.recommended_assessments);
  const compliance = guidance.flatMap((g) => g.compliance_requirements);
  const controls = guidance.flatMap((g) => Object.entries(g.security_controls || {}));
  const practices = guidance.flatMap((g) => g.best_practices);

  const uniqueFrameworks = Array.from(new Set(frameworks));
  const uniqueAssessments = Array.from(new Set(assessments));
  const uniqueCompliance = Array.from(new Set(compliance));
  const uniquePractices = Array.from(new Set(practices));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-vendortal-purple" />
          Sector-Specific Guidance
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Recommendations based on your service types and data types
        </p>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('frameworks')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'frameworks'
                ? 'border-vendortal-purple text-vendortal-purple'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Required Frameworks ({uniqueFrameworks.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'assessments'
                ? 'border-vendortal-purple text-vendortal-purple'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <ListChecks className="w-4 h-4 inline mr-2" />
            Recommended Assessments ({uniqueAssessments.length})
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'compliance'
                ? 'border-vendortal-purple text-vendortal-purple'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Compliance Requirements ({uniqueCompliance.length})
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'controls'
                ? 'border-vendortal-purple text-vendortal-purple'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Security Controls ({controls.length})
          </button>
          <button
            onClick={() => setActiveTab('practices')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'practices'
                ? 'border-vendortal-purple text-vendortal-purple'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Best Practices ({uniquePractices.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'frameworks' && (
            <div className="space-y-3">
              {uniqueFrameworks.map((framework) => (
                <div
                  key={framework}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{framework}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Required framework for your service types and data types
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-3">
              {uniqueAssessments.map((assessment) => (
                <div
                  key={assessment}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <ListChecks className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{assessment}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Recommended assessment to demonstrate compliance
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-3">
              {uniqueCompliance.map((requirement) => (
                <div
                  key={requirement}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{requirement}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Compliance requirement that must be met
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-3">
              {controls.map(([control, description], idx) => (
                <div
                  key={`${control}-${idx}`}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {control.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {typeof description === 'string' ? description : JSON.stringify(description)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'practices' && (
            <div className="space-y-3">
              {uniquePractices.map((practice) => (
                <div
                  key={practice}
                  className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{practice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorGuidancePanel;

