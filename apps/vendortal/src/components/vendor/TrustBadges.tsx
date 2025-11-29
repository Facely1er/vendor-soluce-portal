import React from 'react';
import { Shield, CheckCircle, Zap, Star, Award, FileJson, Server } from 'lucide-react';

interface TrustBadgesProps {
  vendorRating?: number;
  complianceStatus?: string;
  responseTimeScore?: number;
  securityPostureScore?: number;
  frameworks?: string[];
  sbomComplianceStatus?: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';
  assetCount?: number;
  criticalAssetsCount?: number;
  className?: string;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({
  vendorRating,
  complianceStatus,
  responseTimeScore,
  securityPostureScore,
  frameworks = [],
  sbomComplianceStatus,
  assetCount,
  criticalAssetsCount,
  className = '',
}) => {
  const badges: Array<{ icon: React.ReactNode; label: string; color: string }> = [];

  // Security Verified badge
  if (securityPostureScore !== undefined && securityPostureScore >= 80) {
    badges.push({
      icon: <Shield className="w-4 h-4" />,
      label: 'Security Verified',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700',
    });
  }

  // Compliance Ready badge
  if (complianceStatus === 'compliant' || complianceStatus === 'Compliant') {
    badges.push({
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Compliance Ready',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    });
  }

  // Fast Responder badge
  if (responseTimeScore !== undefined && responseTimeScore >= 80) {
    badges.push({
      icon: <Zap className="w-4 h-4" />,
      label: 'Fast Responder',
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    });
  }

  // High Rating badge
  if (vendorRating !== undefined && vendorRating >= 80) {
    badges.push({
      icon: <Star className="w-4 h-4" />,
      label: 'High Rating',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    });
  }

  // SBOM Compliance badge
  if (sbomComplianceStatus === 'compliant') {
    badges.push({
      icon: <FileJson className="w-4 h-4" />,
      label: 'SBOM Compliant',
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    });
  } else if (sbomComplianceStatus === 'partial') {
    badges.push({
      icon: <FileJson className="w-4 h-4" />,
      label: 'SBOM Partial',
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    });
  }

  // Asset Management badge
  if (assetCount !== undefined && assetCount > 0) {
    badges.push({
      icon: <Server className="w-4 h-4" />,
      label: `${assetCount} Asset${assetCount > 1 ? 's' : ''}${criticalAssetsCount && criticalAssetsCount > 0 ? ` (${criticalAssetsCount} Critical)` : ''}`,
      color: 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    });
  }

  // Framework-specific badges
  frameworks.forEach((framework) => {
    if (framework === 'HIPAA') {
      badges.push({
        icon: <Award className="w-4 h-4" />,
        label: 'HIPAA Compliant',
        color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
      });
    } else if (framework === 'PCI DSS') {
      badges.push({
        icon: <Award className="w-4 h-4" />,
        label: 'PCI DSS Compliant',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
      });
    } else if (framework === 'SOC 2') {
      badges.push({
        icon: <Award className="w-4 h-4" />,
        label: 'SOC 2 Certified',
        color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700',
      });
    } else if (framework === 'ISO 27001') {
      badges.push({
        icon: <Award className="w-4 h-4" />,
        label: 'ISO 27001 Certified',
        color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
      });
    }
  });

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${badge.color}`}
        >
          {badge.icon}
          {badge.label}
        </span>
      ))}
    </div>
  );
};

export default TrustBadges;

