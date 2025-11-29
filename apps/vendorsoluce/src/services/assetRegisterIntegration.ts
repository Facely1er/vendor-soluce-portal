import { supabase } from '../lib/supabase';
import type { VendorProfile, VendorAssessment } from './vendorService';

/**
 * VendorSoluce Asset & Risk Register Integration
 * Syncs vendors, assessments, and SBOM analyses to the shared ERMITS Asset & Risk Register
 */
export class VendorSoluceAssetRegisterIntegration {
  /**
   * Sync vendors, assessments, and SBOM analyses to Asset & Risk Register
   */
  static async syncToAssetRegister(userId: string): Promise<{ assetsAdded: number; risksAdded: number }> {
    if (typeof window === 'undefined' || !(window as any).ERMITSAssetRegisterAPI) {
      console.warn('ERMITSAssetRegisterAPI not available');
      return { assetsAdded: 0, risksAdded: 0 };
    }

    try {
      const vendors = await this.fetchAllVendors(userId);
      const assessments = await this.fetchAllAssessments(userId);
      const sbomAnalyses = await this.fetchAllSBOMAnalyses(userId);

      const api = (window as any).ERMITSAssetRegisterAPI;
      return api.syncFromVendorSoluce(vendors, assessments, sbomAnalyses);
    } catch (error) {
      console.error('Failed to sync VendorSoluce data to Asset Register:', error);
      return { assetsAdded: 0, risksAdded: 0 };
    }
  }

  /**
   * Sync single vendor to register
   */
  static async syncVendorToAssetRegister(vendorId: string): Promise<{ assetCreated: boolean; risksAdded: number }> {
    if (typeof window === 'undefined' || !(window as any).ERMITSAssetRegisterAPI) {
      return { assetCreated: false, risksAdded: 0 };
    }

    try {
      const { vendorService } = await import('./vendorService');
      const vendor = await vendorService.getVendorProfile(vendorId);
      
      if (!vendor) {
        return { assetCreated: false, risksAdded: 0 };
      }

      const assessments = await vendorService.getVendorAssessments(vendorId);
      const api = (window as any).ERMITSAssetRegisterAPI;
      const result = api.syncFromVendorSoluce([vendor], assessments, []);

      return {
        assetCreated: result.assetsAdded > 0,
        risksAdded: result.risksAdded
      };
    } catch (error) {
      console.error('Failed to sync vendor to Asset Register:', error);
      return { assetCreated: false, risksAdded: 0 };
    }
  }

  /**
   * Read assets and risks from register
   */
  static readFromAssetRegister() {
    if (typeof window === 'undefined' || !(window as any).ERMITSAssetRegisterAPI) {
      return {
        vendorAssets: [],
        vendorRisks: [],
        allAssets: [],
        allRisks: []
      };
    }

    const api = (window as any).ERMITSAssetRegisterAPI;
    
    return {
      vendorAssets: api.getAssetsBySource('vendorsoluce'),
      vendorRisks: api.getRisksBySource('vendorsoluce'),
      allAssets: api.getAssets(),
      allRisks: api.getRisks()
    };
  }

  /**
   * Get risks for a specific vendor from register
   */
  static getVendorRisksFromRegister(vendorId: string) {
    if (typeof window === 'undefined' || !(window as any).ERMITSAssetRegisterAPI) {
      return [];
    }

    const api = (window as any).ERMITSAssetRegisterAPI;
    return api.getRisksByVendor(vendorId);
  }

  /**
   * Update vendor risk in register when vendor assessment changes
   */
  static async updateVendorRiskInRegister(vendorId: string, assessment: VendorAssessment) {
    if (typeof window === 'undefined' || !(window as any).ERMITSAssetRegisterAPI) {
      return;
    }

    const api = (window as any).ERMITSAssetRegisterAPI;
    const vendorAsset = api.getAssets().find((a: any) => 
      a.source === 'vendorsoluce' && a.sourceId === vendorId
    );

    if (vendorAsset && assessment.score !== undefined && assessment.score < 70) {
      const existingRisk = api.getRisks().find((r: any) => 
        r.source === 'vendorsoluce' && 
        r.sourceId === `assessment-${assessment.id}`
      );

      const severityMap = (score: number) => {
        if (score < 40) return 'Critical';
        if (score < 60) return 'High';
        if (score < 70) return 'Medium';
        return 'Low';
      };

      if (existingRisk) {
        api.updateRisk(existingRisk.id, {
          severity: severityMap(assessment.score),
          description: `Vendor assessment scored ${assessment.score}% (below threshold). Framework: ${assessment.framework || 'Unknown'}`,
          lastUpdated: new Date().toISOString()
        }, 'vendorsoluce');
      } else {
        api.addRisk({
          title: `Vendor Assessment Risk: ${assessment.title || 'Low Compliance Score'}`,
          description: `Vendor assessment scored ${assessment.score}% (below threshold). Framework: ${assessment.framework || 'Unknown'}`,
          severity: severityMap(assessment.score),
          status: 'Open',
          category: 'Vendor Risk',
          riskType: 'Compliance Gap',
          sourceId: `assessment-${assessment.id}`,
          affectedAssets: [vendorAsset.id],
          metadata: {
            vendorId: assessment.vendor_id,
            assessmentId: assessment.id,
            framework: assessment.framework,
            score: assessment.score
          }
        }, 'vendorsoluce');
      }
    }
  }

  /**
   * Check if Asset Register API is available
   */
  static isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ERMITSAssetRegisterAPI;
  }

  /**
   * Load the Asset Register API script if not already loaded
   */
  static async loadAssetRegisterAPI(): Promise<boolean> {
    if (this.isAvailable()) {
      return true;
    }

    try {
      const script = document.createElement('script');
      script.src = '/shared/js/ermits-asset-register-api.js';
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          resolve(this.isAvailable());
        };
        script.onerror = () => {
          reject(new Error('Failed to load Asset Register API'));
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Failed to load Asset Register API:', error);
      return false;
    }
  }

  // Private helper methods
  private static async fetchAllVendors(userId: string): Promise<VendorProfile[]> {
    try {
      const { data, error } = await supabase
        .from('vs_vendor_profiles')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      return [];
    }
  }

  private static async fetchAllAssessments(userId: string): Promise<VendorAssessment[]> {
    try {
      const vendors = await this.fetchAllVendors(userId);
      const { vendorService } = await import('./vendorService');
      const allAssessments: VendorAssessment[] = [];
      
      for (const vendor of vendors) {
        try {
          const assessments = await vendorService.getVendorAssessments(vendor.id);
          allAssessments.push(...assessments);
        } catch (error) {
          console.error(`Failed to fetch assessments for vendor ${vendor.id}:`, error);
        }
      }
      
      return allAssessments;
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      return [];
    }
  }

  private static async fetchAllSBOMAnalyses(userId: string): Promise<any[]> {
    try {
      // Try to fetch from SBOM analyses table if it exists
      const { data, error } = await supabase
        .from('vs_sbom_analyses')
        .select('*')
        .eq('user_id', userId);

      if (error && error.code !== 'PGRST116') {
        // Table might not exist, which is okay
        console.warn('SBOM analyses table not found:', error);
      }

      return data || [];
    } catch (error) {
      console.warn('Failed to fetch SBOM analyses:', error);
      return [];
    }
  }
}

