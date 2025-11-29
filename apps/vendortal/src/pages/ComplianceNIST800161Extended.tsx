import React, { useEffect, useMemo, useState } from 'react';
import { FeatureGate } from '../components/billing/FeatureGate';
import { complianceService } from '../services/complianceService';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

interface FrameworkSummary {
  id: string;
  name: string;
}

interface ControlResult {
  id: string;
  control_id: string;
  status: string;
  score: number | null;
  evidence: any;
}

const ComplianceNIST800161Extended: React.FC = () => {
  const { user } = useAuth();
  const [framework, setFramework] = useState<FrameworkSummary | null>(null);
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [controls, setControls] = useState<Array<{ id: string; control_id: string; title: string }>>([]);
  const [results, setResults] = useState<ControlResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const featureKey = 'nist_800_161_extended';

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Find the NIST 800-161 Extended framework
        const frameworks = await complianceService.getFrameworks();
        const fw = frameworks.find(f => f.name === 'NIST SP 800-161 Extended') as any;
        if (!fw) {
          setLoading(false);
          return;
        }
        setFramework({ id: fw.id, name: fw.name });

        // Create a working assessment in draft if none exists in state
        if (user?.id) {
          const assessment = await complianceService.createAssessment({
            framework_id: fw.id,
            vendor_id: undefined,
            asset_id: undefined,
            assessment_name: 'NIST SP 800-161 Extended - Client Assessment',
            status: 'in_progress',
            overall_score: 0,
            compliance_percentage: 0,
            control_scores: {},
            gaps: [],
            recommendations: [],
            assessor_id: user.id,
            assessment_date: new Date().toISOString(),
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: '' as any,
            updated_at: '' as any,
          } as any);
          setAssessmentId(assessment.id);
        }

        // Fetch framework details to list controls
        const fwDetails = await complianceService.getFramework((fw as any).id);
        const list = (fwDetails?.controls || []).map(c => ({ id: c.id, control_id: c.control_id, title: c.title }));
        setControls(list);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user?.id]);

  useEffect(() => {
    const loadResults = async () => {
      if (!assessmentId) return;
      const r = await complianceService.getControlResults(assessmentId);
      setResults(r);
    };
    loadResults();
  }, [assessmentId]);

  const resultByControl = useMemo(() => {
    const map: Record<string, ControlResult> = {};
    results.forEach(r => { map[r.control_id] = r; });
    return map;
  }, [results]);

  const handleMarkImplemented = async (controlId: string) => {
    if (!assessmentId) return;
    await complianceService.upsertControlResult({
      assessment_id: assessmentId,
      control_id: controlId,
      status: 'implemented',
      score: 90,
      evidence: [],
    });
    const r = await complianceService.getControlResults(assessmentId);
    setResults(r);
  };

  return (
    <FeatureGate feature={featureKey} requiredTier={'federal'}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">NIST SP 800-161 Extended</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Client assessment with audit and vendor mapping hooks.</p>

        {loading && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendortal-purple" />
        )}

        {!loading && framework && (
          <div className="space-y-4">
            {controls.map(c => (
              <div key={c.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{c.control_id}</div>
                  <div className="text-gray-900 dark:text-white font-medium">{c.title}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {(resultByControl[c.id]?.status || 'not_started')}
                  </div>
                  <Button size="sm" onClick={() => handleMarkImplemented(c.id)}>Mark Implemented</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FeatureGate>
  );
};

export default ComplianceNIST800161Extended;
