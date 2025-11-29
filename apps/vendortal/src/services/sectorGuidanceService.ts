import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export interface SectorGuidance {
  id: string;
  sector: string;
  service_type: string;
  data_types: string[];
  required_frameworks: string[];
  recommended_assessments: string[];
  compliance_requirements: string[];
  security_controls: Record<string, any>;
  best_practices: string[];
  guidance_content: Record<string, any>;
}

export interface VendorProfile {
  service_types: string[];
  data_types_accessed: string[];
  industry?: string;
  sector?: string;
}

export interface FrameworkRecommendation {
  framework: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  estimated_time?: string;
}

export interface AssessmentRecommendation {
  assessment: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  estimated_time?: string;
}

export interface ComplianceRequirement {
  requirement: string;
  category: string;
  applicable: boolean;
  description: string;
}

export interface SecurityControl {
  control: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

class SectorGuidanceService {
  /**
   * Get sector-specific guidance based on vendor profile
   */
  async getGuidanceByProfile(vendorProfile: VendorProfile): Promise<SectorGuidance[]> {
    try {
      const { data, error } = await supabase
        .from('vs_sector_guidance')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Filter guidance based on vendor profile
      const relevantGuidance = data.filter((guidance) => {
        // Match by service type
        const serviceTypeMatch = vendorProfile.service_types.some(
          (st) => guidance.service_type === st
        );

        // Match by data types
        const dataTypeMatch = vendorProfile.data_types_accessed.some(
          (dt) => guidance.data_types.includes(dt)
        );

        // Match by sector/industry if provided
        const sectorMatch = vendorProfile.sector
          ? guidance.sector.toLowerCase() === vendorProfile.sector.toLowerCase()
          : true;

        return (serviceTypeMatch || dataTypeMatch) && sectorMatch;
      });

      return relevantGuidance as SectorGuidance[];
    } catch (error) {
      logger.error('Error fetching sector guidance:', error);
      throw error;
    }
  }

  /**
   * Get required frameworks based on service type and data types
   */
  async getRequiredFrameworks(
    serviceType: string,
    dataTypes: string[]
  ): Promise<FrameworkRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('vs_sector_guidance')
        .select('required_frameworks, service_type, data_types, guidance_content')
        .eq('is_active', true)
        .or(`service_type.eq.${serviceType},data_types.cs.{${dataTypes.join(',')}}`);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Aggregate frameworks from all matching guidance
      const frameworkMap = new Map<string, FrameworkRecommendation>();

      data.forEach((guidance) => {
        const frameworks = guidance.required_frameworks || [];
        frameworks.forEach((framework: string) => {
          if (!frameworkMap.has(framework)) {
            frameworkMap.set(framework, {
              framework,
              priority: this.determineFrameworkPriority(framework, guidance),
              reason: this.getFrameworkReason(framework, guidance),
              estimated_time: this.getFrameworkEstimatedTime(framework),
            });
          }
        });
      });

      return Array.from(frameworkMap.values()).sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      logger.error('Error fetching required frameworks:', error);
      throw error;
    }
  }

  /**
   * Get recommended assessments based on service type and data types
   */
  async getRecommendedAssessments(
    serviceType: string,
    dataTypes: string[]
  ): Promise<AssessmentRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('vs_sector_guidance')
        .select('recommended_assessments, service_type, data_types, guidance_content')
        .eq('is_active', true)
        .or(`service_type.eq.${serviceType},data_types.cs.{${dataTypes.join(',')}}`);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Aggregate assessments from all matching guidance
      const assessmentMap = new Map<string, AssessmentRecommendation>();

      data.forEach((guidance) => {
        const assessments = guidance.recommended_assessments || [];
        assessments.forEach((assessment: string) => {
          if (!assessmentMap.has(assessment)) {
            assessmentMap.set(assessment, {
              assessment,
              priority: this.determineAssessmentPriority(assessment, guidance),
              reason: this.getAssessmentReason(assessment, guidance),
              estimated_time: this.getAssessmentEstimatedTime(assessment),
            });
          }
        });
      });

      return Array.from(assessmentMap.values()).sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      logger.error('Error fetching recommended assessments:', error);
      throw error;
    }
  }

  /**
   * Get compliance requirements based on sector, service type, and data types
   */
  async getComplianceRequirements(
    sector: string,
    serviceType: string,
    dataTypes: string[]
  ): Promise<ComplianceRequirement[]> {
    try {
      const { data, error } = await supabase
        .from('vs_sector_guidance')
        .select('compliance_requirements, sector, service_type, data_types')
        .eq('is_active', true)
        .or(`sector.eq.${sector},service_type.eq.${serviceType},data_types.cs.{${dataTypes.join(',')}}`);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Aggregate compliance requirements
      const requirements: ComplianceRequirement[] = [];

      data.forEach((guidance) => {
        const complianceReqs = guidance.compliance_requirements || [];
        complianceReqs.forEach((req: string) => {
          requirements.push({
            requirement: req,
            category: this.categorizeRequirement(req),
            applicable: true,
            description: this.getRequirementDescription(req),
          });
        });
      });

      // Remove duplicates
      const uniqueRequirements = Array.from(
        new Map(requirements.map((r) => [r.requirement, r])).values()
      );

      return uniqueRequirements;
    } catch (error) {
      logger.error('Error fetching compliance requirements:', error);
      throw error;
    }
  }

  /**
   * Get security controls based on service type and data types
   */
  async getSecurityControls(
    serviceType: string,
    dataTypes: string[]
  ): Promise<SecurityControl[]> {
    try {
      const { data, error } = await supabase
        .from('vs_sector_guidance')
        .select('security_controls, service_type, data_types')
        .eq('is_active', true)
        .or(`service_type.eq.${serviceType},data_types.cs.{${dataTypes.join(',')}}`);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Aggregate security controls
      const controls: SecurityControl[] = [];

      data.forEach((guidance) => {
        const securityControls = guidance.security_controls || {};
        Object.entries(securityControls).forEach(([key, value]) => {
          controls.push({
            control: key,
            category: this.categorizeControl(key),
            priority: this.determineControlPriority(key, value),
            description: typeof value === 'string' ? value : JSON.stringify(value),
          });
        });
      });

      // Remove duplicates
      const uniqueControls = Array.from(
        new Map(controls.map((c) => [c.control, c])).values()
      );

      return uniqueControls.sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      logger.error('Error fetching security controls:', error);
      throw error;
    }
  }

  /**
   * Get best practices based on sector and service type
   */
  async getBestPractices(sector: string, serviceType: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('vs_sector_guidance')
        .select('best_practices, sector, service_type')
        .eq('is_active', true)
        .or(`sector.eq.${sector},service_type.eq.${serviceType}`);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Aggregate best practices
      const practices = new Set<string>();

      data.forEach((guidance) => {
        const bestPractices = guidance.best_practices || [];
        bestPractices.forEach((practice: string) => {
          practices.add(practice);
        });
      });

      return Array.from(practices);
    } catch (error) {
      logger.error('Error fetching best practices:', error);
      throw error;
    }
  }

  // Helper methods

  private determineFrameworkPriority(
    framework: string,
    guidance: any
  ): 'High' | 'Medium' | 'Low' {
    const priority = guidance.guidance_content?.priority;
    if (priority === 'Critical' || priority === 'High') return 'High';
    if (priority === 'Medium') return 'Medium';
    return 'Low';
  }

  private getFrameworkReason(framework: string, guidance: any): string {
    return `Required for ${guidance.service_type} services handling ${guidance.data_types.join(', ')}`;
  }

  private getFrameworkEstimatedTime(framework: string): string {
    const timeMap: Record<string, string> = {
      'HIPAA': '2-3 months',
      'PCI DSS': '3-6 months',
      'SOC 2': '6-12 months',
      'ISO 27001': '6-12 months',
      'GDPR': '1-2 months',
      'CCPA': '1-2 months',
    };
    return timeMap[framework] || 'Variable';
  }

  private determineAssessmentPriority(
    assessment: string,
    guidance: any
  ): 'High' | 'Medium' | 'Low' {
    const priority = guidance.guidance_content?.priority;
    if (priority === 'Critical' || priority === 'High') return 'High';
    if (priority === 'Medium') return 'Medium';
    return 'Low';
  }

  private getAssessmentReason(assessment: string, guidance: any): string {
    return `Recommended for ${guidance.service_type} services to demonstrate compliance`;
  }

  private getAssessmentEstimatedTime(assessment: string): string {
    if (assessment.includes('HIPAA')) return '2-3 hours';
    if (assessment.includes('PCI DSS')) return '4-6 hours';
    if (assessment.includes('SOC 2')) return '2-3 hours';
    if (assessment.includes('ISO 27001')) return '3-4 hours';
    return '1-2 hours';
  }

  private categorizeRequirement(requirement: string): string {
    if (requirement.includes('HIPAA')) return 'Healthcare';
    if (requirement.includes('PCI')) return 'Financial';
    if (requirement.includes('GDPR') || requirement.includes('CCPA')) return 'Privacy';
    if (requirement.includes('SOC 2') || requirement.includes('ISO')) return 'Security';
    return 'General';
  }

  private getRequirementDescription(requirement: string): string {
    const descriptions: Record<string, string> = {
      'HIPAA Privacy Rule': 'Protects the privacy of individually identifiable health information',
      'HIPAA Security Rule': 'Sets standards for the security of electronic protected health information',
      'PCI DSS Level 1': 'Highest level of PCI DSS compliance for merchants processing large volumes of card transactions',
      'GDPR': 'European Union General Data Protection Regulation',
      'CCPA': 'California Consumer Privacy Act',
    };
    return descriptions[requirement] || `Compliance requirement for ${requirement}`;
  }

  private categorizeControl(control: string): string {
    if (control.includes('encryption')) return 'Data Protection';
    if (control.includes('access')) return 'Access Control';
    if (control.includes('audit') || control.includes('logging')) return 'Monitoring';
    if (control.includes('network')) return 'Network Security';
    return 'General Security';
  }

  private determineControlPriority(
    control: string,
    value: any
  ): 'High' | 'Medium' | 'Low' {
    if (control.includes('encryption') || control.includes('Required')) return 'High';
    if (control.includes('access') || control.includes('authentication')) return 'High';
    return 'Medium';
  }
}

export const sectorGuidanceService = new SectorGuidanceService();

