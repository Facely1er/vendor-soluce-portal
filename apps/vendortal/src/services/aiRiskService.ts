import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';
import { _RiskAssessment, _RiskFactor, _Vendor, _Asset, _AssetVendorRelationship } from '../types';

interface AIRiskPrediction {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: {
    name: string;
    impact: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    description: string;
  }[];
  recommendations: string[];
  next_assessment_due: string;
}

interface AnomalyDetection {
  anomaly_type: 'unusual_response' | 'pattern_deviation' | 'risk_spike' | 'compliance_gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected_at: string;
  confidence: number;
  affected_entities: string[];
  recommendations: string[];
}

interface MLRiskModel {
  model_id: string;
  model_name: string;
  version: string;
  accuracy: number;
  last_trained: string;
  features: string[];
  is_active: boolean;
}

class AIRiskService {
  private models: Map<string, MLRiskModel> = new Map();

  constructor() {
    this.initializeModels();
  }

  // Initialize ML models
  private initializeModels(): void {
    this.models.set('risk_prediction_v1', {
      model_id: 'risk_prediction_v1',
      model_name: 'Risk Prediction Model v1.0',
      version: '1.0.0',
      accuracy: 0.87,
      last_trained: new Date().toISOString(),
      features: [
        'vendor_compliance_score',
        'assessment_completion_rate',
        'response_consistency',
        'historical_risk_trends',
        'industry_benchmark',
        'asset_criticality',
        'data_access_level',
        'integration_complexity'
      ],
      is_active: true
    });

    this.models.set('anomaly_detection_v1', {
      model_id: 'anomaly_detection_v1',
      model_name: 'Anomaly Detection Model v1.0',
      version: '1.0.0',
      accuracy: 0.82,
      last_trained: new Date().toISOString(),
      features: [
        'response_patterns',
        'assessment_timing',
        'risk_score_changes',
        'compliance_deviations',
        'vendor_behavior'
      ],
      is_active: true
    });
  }

  // Predict risk using ML model
  async predictRisk(
    vendorId: string,
    assetId?: string,
    relationshipId?: string
  ): Promise<AIRiskPrediction> {
    try {
      // Gather historical data for ML prediction
      const historicalData = await this.gatherHistoricalData(vendorId, assetId, relationshipId);
      
      // Simulate ML prediction (in real implementation, this would call ML service)
      const prediction = await this.simulateMLPrediction(historicalData);
      
      // Store prediction in database
      await this.storeRiskPrediction(vendorId, assetId, relationshipId, prediction);
      
      return prediction;
    } catch (error) {
      logger.error('Error predicting risk:', error);
      throw error;
    }
  }

  // Detect anomalies in vendor responses and behavior
  async detectAnomalies(vendorId: string): Promise<AnomalyDetection[]> {
    try {
      const anomalies: AnomalyDetection[] = [];
      
      // Analyze response patterns
      const responseAnomalies = await this.analyzeResponsePatterns(vendorId);
      anomalies.push(...responseAnomalies);
      
      // Analyze risk score changes
      const riskAnomalies = await this.analyzeRiskScoreChanges(vendorId);
      anomalies.push(...riskAnomalies);
      
      // Analyze compliance deviations
      const complianceAnomalies = await this.analyzeComplianceDeviations(vendorId);
      anomalies.push(...complianceAnomalies);
      
      // Store anomalies
      await this.storeAnomalies(vendorId, anomalies);
      
      return anomalies;
    } catch (error) {
      logger.error('Error detecting anomalies:', error);
      throw error;
    }
  }

  // Analyze document content using NLP
  async analyzeDocumentContent(documentUrl: string, documentType: string): Promise<{
    risk_indicators: string[];
    compliance_gaps: string[];
    recommendations: string[];
    confidence: number;
  }> {
    try {
      // Simulate NLP analysis (in real implementation, this would call NLP service)
      const analysis = await this.simulateNLPAnalysis(documentUrl, documentType);
      
      return analysis;
    } catch (error) {
      logger.error('Error analyzing document:', error);
      throw error;
    }
  }

  // Automated control mapping
  async mapControlsToFramework(
    vendorId: string,
    framework: string,
    responses: Record<string, any>
  ): Promise<{
    mapped_controls: Array<{
      control_id: string;
      control_name: string;
      implementation_status: 'implemented' | 'partial' | 'not_implemented';
      evidence: string[];
      confidence: number;
    }>;
    gap_analysis: Array<{
      control_id: string;
      gap_description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      recommendations: string[];
    }>;
  }> {
    try {
      // Simulate automated control mapping
      const mapping = await this.simulateControlMapping(vendorId, framework, responses);
      
      return mapping;
    } catch (error) {
      logger.error('Error mapping controls:', error);
      throw error;
    }
  }

  // Get risk trends and forecasting
  async getRiskTrends(
    organizationId: string,
    timeframe: '30d' | '90d' | '1y' = '90d'
  ): Promise<{
    overall_trend: 'improving' | 'stable' | 'deteriorating';
    trend_data: Array<{
      date: string;
      average_risk_score: number;
      high_risk_count: number;
      critical_risk_count: number;
    }>;
    forecast: Array<{
      date: string;
      predicted_risk_score: number;
      confidence_interval: [number, number];
    }>;
  }> {
    try {
      const trends = await this.calculateRiskTrends(organizationId, timeframe);
      return trends;
    } catch (error) {
      logger.error('Error getting risk trends:', error);
      throw error;
    }
  }

  // Private helper methods
  private async gatherHistoricalData(
    vendorId: string,
    assetId?: string,
    relationshipId?: string
  ): Promise<any> {
    // Gather vendor historical data
    const { data: vendorData } = await supabase
      .from('vs_vendors')
      .select('*')
      .eq('id', vendorId)
      .single();

    // Gather assessment history
    const { data: assessments } = await supabase
      .from('vs_vendor_assessments')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Gather risk assessment history
    const { data: riskAssessments } = await supabase
      .from('vs_risk_assessments')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      vendor: vendorData,
      assessments,
      risk_assessments: riskAssessments,
      asset_id: assetId,
      relationship_id: relationshipId
    };
  }

  private async simulateMLPrediction(historicalData: any): Promise<AIRiskPrediction> {
    // Simulate ML model prediction
    const baseScore = historicalData.vendor?.risk_score || 50;
    const assessmentTrend = this.calculateAssessmentTrend(historicalData.assessments);
    const riskTrend = this.calculateRiskTrend(historicalData.risk_assessments);
    
    // Apply ML-like adjustments
    const mlAdjustment = this.calculateMLAdjustment(historicalData);
    const finalScore = Math.min(Math.max(baseScore + assessmentTrend + riskTrend + mlAdjustment, 0), 100);
    
    const riskLevel = this.getRiskLevel(finalScore);
    const confidence = this.calculateConfidence(historicalData);
    
    return {
      risk_score: Math.round(finalScore),
      risk_level: riskLevel,
      confidence,
      factors: this.generateRiskFactors(historicalData),
      recommendations: this.generateRecommendations(finalScore, historicalData),
      next_assessment_due: this.calculateNextAssessmentDue(finalScore)
    };
  }

  private calculateAssessmentTrend(assessments: any[]): number {
    if (assessments.length < 2) return 0;
    
    const recent = assessments.slice(0, 3);
    const older = assessments.slice(3, 6);
    
    const recentAvg = recent.reduce((sum, a) => sum + (a.overall_score || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, a) => sum + (a.overall_score || 0), 0) / older.length;
    
    return (recentAvg - olderAvg) * 0.1; // 10% weight
  }

  private calculateRiskTrend(riskAssessments: any[]): number {
    if (riskAssessments.length < 2) return 0;
    
    const recent = riskAssessments.slice(0, 3);
    const older = riskAssessments.slice(3, 6);
    
    const recentAvg = recent.reduce((sum, r) => sum + (r.calculated_score || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + (r.calculated_score || 0), 0) / older.length;
    
    return (recentAvg - olderAvg) * 0.15; // 15% weight
  }

  private calculateMLAdjustment(historicalData: any): number {
    // Simulate ML model adjustments based on patterns
    let adjustment = 0;
    
    // Response consistency factor
    const consistency = this.calculateResponseConsistency(historicalData.assessments);
    adjustment += consistency * 5;
    
    // Industry benchmark factor
    const industryBenchmark = this.getIndustryBenchmark(historicalData.vendor?.industry);
    adjustment += industryBenchmark * 3;
    
    // Time-based decay factor
    const timeDecay = this.calculateTimeDecay(historicalData.assessments);
    adjustment += timeDecay * 2;
    
    return adjustment;
  }

  private calculateResponseConsistency(assessments: any[]): number {
    if (assessments.length < 3) return 0;
    
    const scores = assessments.map(a => a.overall_score || 0);
    const variance = this.calculateVariance(scores);
    const consistency = Math.max(0, 1 - (variance / 100));
    
    return (consistency - 0.5) * 10; // Convert to -5 to +5 range
  }

  private calculateVariance(scores: number[]): number {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return variance;
  }

  private getIndustryBenchmark(industry: string): number {
    const benchmarks: Record<string, number> = {
      'Financial': 5,
      'Healthcare': 4,
      'Government': 6,
      'Defense': 7,
      'Technology': 2,
      'Energy': 3,
      'Manufacturing': 1
    };
    
    return benchmarks[industry] || 0;
  }

  private calculateTimeDecay(assessments: any[]): number {
    if (assessments.length === 0) return 5; // Higher risk for no recent assessments
    
    const latestAssessment = assessments[0];
    const daysSinceLastAssessment = (Date.now() - new Date(latestAssessment.created_at).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastAssessment > 365) return 5;
    if (daysSinceLastAssessment > 180) return 3;
    if (daysSinceLastAssessment > 90) return 1;
    return 0;
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private calculateConfidence(historicalData: any): number {
    let confidence = 0.5; // Base confidence
    
    // More data = higher confidence
    if (historicalData.assessments.length >= 5) confidence += 0.2;
    if (historicalData.risk_assessments.length >= 3) confidence += 0.2;
    
    // Recent data = higher confidence
    const hasRecentData = historicalData.assessments.some((a: any) => 
      (Date.now() - new Date(a.created_at).getTime()) < 90 * 24 * 60 * 60 * 1000
    );
    if (hasRecentData) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private generateRiskFactors(historicalData: any): Array<{
    name: string;
    impact: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    description: string;
  }> {
    const factors = [];
    
    // Compliance factor
    const complianceScore = historicalData.vendor?.compliance_status === 'compliant' ? 20 : 80;
    factors.push({
      name: 'Compliance Status',
      impact: complianceScore,
      trend: 'stable',
      description: `Current compliance status: ${historicalData.vendor?.compliance_status}`
    });
    
    // Assessment completion factor
    const completionRate = this.calculateCompletionRate(historicalData.assessments);
    factors.push({
      name: 'Assessment Completion',
      impact: 100 - completionRate,
      trend: completionRate > 80 ? 'decreasing' : 'increasing',
      description: `Assessment completion rate: ${completionRate}%`
    });
    
    // Response consistency factor
    const consistency = this.calculateResponseConsistency(historicalData.assessments);
    factors.push({
      name: 'Response Consistency',
      impact: Math.max(0, 50 - consistency * 10),
      trend: consistency > 0 ? 'decreasing' : 'increasing',
      description: `Response consistency score: ${consistency.toFixed(1)}`
    });
    
    return factors;
  }

  private calculateCompletionRate(assessments: any[]): number {
    if (assessments.length === 0) return 0;
    
    const completed = assessments.filter(a => a.status === 'completed').length;
    return (completed / assessments.length) * 100;
  }

  private generateRecommendations(riskScore: number, historicalData: any): string[] {
    const recommendations = [];
    
    if (riskScore >= 80) {
      recommendations.push('Immediate risk mitigation required');
      recommendations.push('Consider alternative vendors');
      recommendations.push('Implement additional monitoring');
    } else if (riskScore >= 60) {
      recommendations.push('Regular risk monitoring');
      recommendations.push('Quarterly assessments');
      recommendations.push('Enhanced security controls');
    } else if (riskScore >= 40) {
      recommendations.push('Annual risk assessment');
      recommendations.push('Standard security controls');
      recommendations.push('Regular vendor communication');
    } else {
      recommendations.push('Maintain current security posture');
      recommendations.push('Annual review');
    }
    
    // Add specific recommendations based on data
    const completionRate = this.calculateCompletionRate(historicalData.assessments);
    if (completionRate < 70) {
      recommendations.push('Improve assessment completion rates');
    }
    
    return recommendations;
  }

  private calculateNextAssessmentDue(riskScore: number): string {
    const now = new Date();
    let daysToAdd = 365; // Default: 1 year
    
    if (riskScore >= 80) daysToAdd = 30; // Critical: 1 month
    else if (riskScore >= 60) daysToAdd = 90; // High: 3 months
    else if (riskScore >= 40) daysToAdd = 180; // Medium: 6 months
    
    const nextDue = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return nextDue.toISOString();
  }

  private async storeRiskPrediction(
    vendorId: string,
    assetId: string | undefined,
    relationshipId: string | undefined,
    prediction: AIRiskPrediction
  ): Promise<void> {
    const { error } = await supabase
      .from('vs_ai_risk_predictions')
      .insert({
        vendor_id: vendorId,
        asset_id: assetId,
        relationship_id: relationshipId,
        predicted_score: prediction.risk_score,
        predicted_level: prediction.risk_level,
        confidence: prediction.confidence,
        factors: prediction.factors,
        recommendations: prediction.recommendations,
        next_assessment_due: prediction.next_assessment_due,
        model_id: 'risk_prediction_v1'
      });

    if (error) {
      logger.error('Error storing risk prediction:', error);
    }
  }

  private async analyzeResponsePatterns(vendorId: string): Promise<AnomalyDetection[]> {
    // Simulate response pattern analysis
    const anomalies: AnomalyDetection[] = [];
    
    // Check for unusual response times
    const responseTimeAnomaly = await this.checkResponseTimeAnomalies(vendorId);
    if (responseTimeAnomaly) anomalies.push(responseTimeAnomaly);
    
    // Check for response consistency
    const consistencyAnomaly = await this.checkResponseConsistencyAnomalies(vendorId);
    if (consistencyAnomaly) anomalies.push(consistencyAnomaly);
    
    return anomalies;
  }

  private async checkResponseTimeAnomalies(vendorId: string): Promise<AnomalyDetection | null> {
    // Simulate response time analysis
    const avgResponseTime = 2.5; // days
    const currentResponseTime = 8.2; // days
    
    if (currentResponseTime > avgResponseTime * 2) {
      return {
        anomaly_type: 'unusual_response',
        severity: 'medium',
        description: `Response time significantly increased: ${currentResponseTime} days vs average ${avgResponseTime} days`,
        detected_at: new Date().toISOString(),
        confidence: 0.85,
        affected_entities: [vendorId],
        recommendations: ['Investigate vendor responsiveness', 'Consider alternative communication channels']
      };
    }
    
    return null;
  }

  private async checkResponseConsistencyAnomalies(vendorId: string): Promise<AnomalyDetection | null> {
    // Simulate response consistency analysis
    const consistencyScore = 0.3; // Low consistency
    
    if (consistencyScore < 0.5) {
      return {
        anomaly_type: 'pattern_deviation',
        severity: 'high',
        description: `Low response consistency detected: ${(consistencyScore * 100).toFixed(1)}%`,
        detected_at: new Date().toISOString(),
        confidence: 0.92,
        affected_entities: [vendorId],
        recommendations: ['Review vendor assessment process', 'Provide additional guidance']
      };
    }
    
    return null;
  }

  private async analyzeRiskScoreChanges(vendorId: string): Promise<AnomalyDetection[]> {
    // Simulate risk score change analysis
    const anomalies: AnomalyDetection[] = [];
    
    // Check for sudden risk spikes
    const riskSpike = await this.checkRiskSpike(vendorId);
    if (riskSpike) anomalies.push(riskSpike);
    
    return anomalies;
  }

  private async checkRiskSpike(vendorId: string): Promise<AnomalyDetection | null> {
    // Simulate risk spike detection
    const previousScore = 45;
    const currentScore = 78;
    const increase = currentScore - previousScore;
    
    if (increase > 20) {
      return {
        anomaly_type: 'risk_spike',
        severity: 'critical',
        description: `Significant risk increase detected: +${increase} points (${previousScore} → ${currentScore})`,
        detected_at: new Date().toISOString(),
        confidence: 0.95,
        affected_entities: [vendorId],
        recommendations: ['Immediate risk assessment required', 'Escalate to security team']
      };
    }
    
    return null;
  }

  private async analyzeComplianceDeviations(vendorId: string): Promise<AnomalyDetection[]> {
    // Simulate compliance deviation analysis
    const anomalies: AnomalyDetection[] = [];
    
    // Check for compliance gaps
    const complianceGap = await this.checkComplianceGap(vendorId);
    if (complianceGap) anomalies.push(complianceGap);
    
    return anomalies;
  }

  private async checkComplianceGap(vendorId: string): Promise<AnomalyDetection | null> {
    // Simulate compliance gap detection
    const complianceScore = 0.6; // Below threshold
    
    if (complianceScore < 0.7) {
      return {
        anomaly_type: 'compliance_gap',
        severity: 'high',
        description: `Compliance gap detected: ${(complianceScore * 100).toFixed(1)}% compliance score`,
        detected_at: new Date().toISOString(),
        confidence: 0.88,
        affected_entities: [vendorId],
        recommendations: ['Review compliance requirements', 'Implement corrective actions']
      };
    }
    
    return null;
  }

  private async storeAnomalies(vendorId: string, anomalies: AnomalyDetection[]): Promise<void> {
    if (anomalies.length === 0) return;
    
    const { error } = await supabase
      .from('vs_anomaly_detections')
      .insert(
        anomalies.map(anomaly => ({
          vendor_id: vendorId,
          anomaly_type: anomaly.anomaly_type,
          severity: anomaly.severity,
          description: anomaly.description,
          confidence: anomaly.confidence,
          affected_entities: anomaly.affected_entities,
          recommendations: anomaly.recommendations,
          model_id: 'anomaly_detection_v1'
        }))
      );

    if (error) {
      logger.error('Error storing anomalies:', error);
    }
  }

  private async simulateNLPAnalysis(documentUrl: string, documentType: string): Promise<{
    risk_indicators: string[];
    compliance_gaps: string[];
    recommendations: string[];
    confidence: number;
  }> {
    // Simulate NLP analysis results
    return {
      risk_indicators: [
        'Mentions of security incidents',
        'Outdated security policies',
        'Insufficient access controls'
      ],
      compliance_gaps: [
        'Missing GDPR compliance statement',
        'Incomplete data retention policy',
        'Lack of incident response procedures'
      ],
      recommendations: [
        'Update security policies',
        'Implement data retention procedures',
        'Establish incident response plan'
      ],
      confidence: 0.82
    };
  }

  private async simulateControlMapping(
    vendorId: string,
    framework: string,
    responses: Record<string, any>
  ): Promise<{
    mapped_controls: Array<{
      control_id: string;
      control_name: string;
      implementation_status: 'implemented' | 'partial' | 'not_implemented';
      evidence: string[];
      confidence: number;
    }>;
    gap_analysis: Array<{
      control_id: string;
      gap_description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      recommendations: string[];
    }>;
  }> {
    // Simulate automated control mapping
    return {
      mapped_controls: [
        {
          control_id: 'AC-1',
          control_name: 'Access Control Policy',
          implementation_status: 'implemented',
          evidence: ['Policy document provided', 'Implementation evidence'],
          confidence: 0.9
        },
        {
          control_id: 'AC-2',
          control_name: 'Account Management',
          implementation_status: 'partial',
          evidence: ['Basic account procedures'],
          confidence: 0.7
        }
      ],
      gap_analysis: [
        {
          control_id: 'AC-3',
          gap_description: 'Missing automated account provisioning',
          severity: 'medium',
          recommendations: ['Implement automated account management', 'Establish approval workflows']
        }
      ]
    };
  }

  private async calculateRiskTrends(organizationId: string, timeframe: string): Promise<{
    overall_trend: 'improving' | 'stable' | 'deteriorating';
    trend_data: Array<{
      date: string;
      average_risk_score: number;
      high_risk_count: number;
      critical_risk_count: number;
    }>;
    forecast: Array<{
      date: string;
      predicted_risk_score: number;
      confidence_interval: [number, number];
    }>;
  }> {
    // Simulate risk trend calculation
    const days = timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    const trendData = [];
    const forecast = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      trendData.push({
        date: date.toISOString().split('T')[0],
        average_risk_score: 45 + Math.sin(i / 10) * 10 + Math.random() * 5,
        high_risk_count: Math.floor(Math.random() * 5),
        critical_risk_count: Math.floor(Math.random() * 2)
      });
    }
    
    // Generate forecast
    for (let i = 1; i <= 30; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const baseScore = 45;
      const trend = Math.sin(i / 10) * 5;
      const predictedScore = baseScore + trend;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted_risk_score: Math.round(predictedScore),
        confidence_interval: [
          Math.round(predictedScore - 10),
          Math.round(predictedScore + 10)
        ]
      });
    }
    
    const recentScores = trendData.slice(-7).map(d => d.average_risk_score);
    const olderScores = trendData.slice(-14, -7).map(d => d.average_risk_score);
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
    
    let overallTrend: 'improving' | 'stable' | 'deteriorating' = 'stable';
    if (recentAvg < olderAvg - 5) overallTrend = 'improving';
    else if (recentAvg > olderAvg + 5) overallTrend = 'deteriorating';
    
    return {
      overall_trend: overallTrend,
      trend_data: trendData,
      forecast
    };
  }

  // Get active ML models
  getActiveModels(): MLRiskModel[] {
    return Array.from(this.models.values()).filter(model => model.is_active);
  }

  // Get model performance metrics
  async getModelPerformance(modelId: string): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    last_evaluated: string;
  }> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    
    return {
      accuracy: model.accuracy,
      precision: model.accuracy * 0.95,
      recall: model.accuracy * 0.92,
      f1_score: model.accuracy * 0.93,
      last_evaluated: model.last_trained
    };
  }
}

export const aiRiskService = new AIRiskService();