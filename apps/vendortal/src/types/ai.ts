// AI-Powered Risk Assessment Types

export interface AIRiskPrediction {
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

export interface AnomalyDetection {
  anomaly_type: 'unusual_response' | 'pattern_deviation' | 'risk_spike' | 'compliance_gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected_at: string;
  confidence: number;
  affected_entities: string[];
  recommendations: string[];
}

export interface MLRiskModel {
  model_id: string;
  model_name: string;
  version: string;
  accuracy: number;
  last_trained: string;
  features: string[];
  is_active: boolean;
}

export interface DocumentAnalysis {
  risk_indicators: string[];
  compliance_gaps: string[];
  recommendations: string[];
  confidence: number;
}

export interface ControlMapping {
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
}

export interface RiskTrends {
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
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  last_evaluated: string;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affected_entities: string[];
  recommendations: string[];
  created_at: string;
  expires_at?: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface AIConfiguration {
  model_settings: {
    risk_prediction: {
      enabled: boolean;
      model_id: string;
      confidence_threshold: number;
      update_frequency: 'hourly' | 'daily' | 'weekly';
    };
    anomaly_detection: {
      enabled: boolean;
      model_id: string;
      sensitivity: 'low' | 'medium' | 'high';
      alert_threshold: number;
    };
    document_analysis: {
      enabled: boolean;
      supported_formats: string[];
      nlp_confidence_threshold: number;
    };
    control_mapping: {
      enabled: boolean;
      supported_frameworks: string[];
      auto_mapping_threshold: number;
    };
  };
  notification_settings: {
    email_alerts: boolean;
    slack_alerts: boolean;
    webhook_alerts: boolean;
    alert_frequency: 'immediate' | 'hourly' | 'daily';
  };
  data_retention: {
    predictions_days: number;
    anomalies_days: number;
    insights_days: number;
  };
}