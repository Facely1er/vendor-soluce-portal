import React, { createContext, useContext, useEffect } from 'react';
import * as i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';

// Extend base translations with missing namespaces/keys used in the UI
// Humanize missing translation keys so UI never shows raw namespace.key strings
const humanizeMissingKey = (key: string) => {
  try {
    const withoutNamespace = key.includes(':') ? key.split(':').pop() as string : key;
    const lastSegment = withoutNamespace.includes('.') ? withoutNamespace.split('.').pop() as string : withoutNamespace;
    const withSpaces = lastSegment
      .replace(/[_\-]/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .trim();
    return withSpaces
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } catch {
    return key;
  }
};
const extendedEn = {
  ...enTranslation as any,
  common: {
    ...(enTranslation as any).common,
    other: 'Other'
  },
  onboarding: {
    welcome: {
      title: 'Welcome to VendorTal',
      subtitle: 'Your complete supply chain risk management platform',
      greeting: 'Welcome, {{name}}!',
      description: 'VendorTal helps you assess, monitor, and mitigate third-party risks across your supply chain with tools aligned with NIST SP 800-161.',
      cards: {
        assessVendors: { title: 'Assess Vendors', desc: 'NIST 800-161 compliant assessments' },
        monitorRisks: { title: 'Monitor Risks', desc: 'Real-time risk dashboards' },
        analyzeSboms: { title: 'Analyze SBOMs', desc: 'Software bill of materials analysis' }
      }
    },
    profile: {
      title: 'Your Role & Organization',
      subtitle: 'Help us tailor your experience',
      header: 'Tell us about yourself',
      helper: 'This helps us show you the most relevant features and content',
      roleLabel: 'Your Primary Role',
      role: {
        placeholder: 'Select your role',
        security: 'Security Professional',
        procurement: 'Procurement Manager',
        compliance: 'Compliance Officer',
        risk: 'Risk Manager',
        it: 'IT Manager',
        executive: 'Executive'
      },
      sizeLabel: 'Organization Size',
      size: {
        placeholder: 'Select size',
        startup: 'Startup (1-50 employees)',
        small: 'Small Business (51-200 employees)',
        medium: 'Medium Business (201-1000 employees)',
        large: 'Large Enterprise (1000+ employees)'
      },
      industryLabel: 'Industry',
      industry: {
        placeholder: 'Select industry',
        technology: 'Technology',
        healthcare: 'Healthcare',
        financial: 'Financial Services',
        manufacturing: 'Manufacturing',
        government: 'Government/Public Sector',
        defense: 'Defense/Aerospace',
        energy: 'Energy/Utilities',
        retail: 'Retail/E-commerce'
      }
    },
    getStarted: {
      title: 'Get Started',
      subtitle: 'Choose your first action',
      question: 'What would you like to do first?',
      helper: 'Choose an action to get started with VendorTal',
      assessment: {
        title: 'Run Supply Chain Assessment',
        desc: "Evaluate your organization's supply chain security posture"
      },
      vendor: { title: 'Add Your First Vendor', desc: 'Start building your vendor risk portfolio' },
      sbom: { title: 'Analyze Software Components', desc: 'Upload and analyze a Software Bill of Materials' },
      tour: { title: 'Take a Quick Tour', desc: 'Learn about key features with a guided walkthrough' }
    },
    tour: {
      title: 'Quick Tour',
      subtitle: 'Key features overview',
      header: 'VendorTal Key Features',
      assessments: {
        title: 'Supply Chain Assessments',
        desc: 'Comprehensive NIST SP 800-161 aligned assessments to evaluate your supply chain security posture across 6 key domains.'
      },
      vendorRisk: {
        title: 'Vendor Risk Management',
        desc: 'Track and monitor vendor risks with automated scoring, compliance tracking, and customizable dashboards.'
      },
      sbom: {
        title: 'SBOM Analysis',
        desc: 'Analyze Software Bills of Materials for vulnerabilities, license compliance, and component risks with support for SPDX and CycloneDX formats.'
      },
      quickTools: {
        title: 'Quick Tools',
        desc: 'Access rapid assessment tools like the Vendor Risk Calculator, SBOM Quick Scan, and NIST 800-161 Checklist.'
      }
    },
    actions: {
      skipTour: 'Skip Tour',
      getStarted: 'Get Started'
    }
  },
  assetDashboard: {
    loading: 'Loading dashboard...',
    title: 'Asset-Vendor Risk Dashboard',
    subtitle: 'Comprehensive view of asset inventory and vendor relationships',
    addAsset: 'Add Asset',
    search: { placeholder: 'Search assets, vendors, or relationships...' },
    filters: {
      allItems: 'All Items',
      assetsOnly: 'Assets Only',
      vendorsOnly: 'Vendors Only',
      allRisks: 'All Risk Levels',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
      criticalRisk: 'Critical Risk'
    },
    vendorCount: '{{count}} vendor(s)',
    relationshipCount: '{{count}} relationship(s)',
    primaryVendor: 'Primary Vendor: ',
    recentAlerts: 'Recent Alerts',
    assets: { title: 'Assets' },
    vendors: { title: 'Vendors' },
    relationships: { title: 'Asset-Vendor Relationships' },
    table: {
      asset: 'Asset',
      type: 'Type',
      criticality: 'Criticality',
      riskScore: 'Risk Score',
      vendors: 'Vendors',
      vendor: 'Vendor',
      industry: 'Industry',
      assets: 'Assets',
      criticalAssets: 'Critical Assets'
    },
    risk: { label: '{{level}} Risk' },
    notAssessed: 'Not assessed',
    assetCount: '{{count}} asset(s)',
    criticalCount: '{{count}} critical',
    unknownVendor: 'Unknown Vendor',
    access: 'access',
    systemAlerts: 'System Alerts',
    acknowledge: 'Acknowledge'
  }
};

const extendedFr = {
  ...frTranslation as any,
  common: {
    ...(frTranslation as any).common,
    other: 'Autre'
  },
  onboarding: {
    welcome: {
      title: 'Bienvenue sur VendorTal',
      subtitle: 'Votre plateforme complète de gestion des risques de la chaîne d’approvisionnement',
      greeting: 'Bienvenue, {{name}} !',
      description: 'VendorTal vous aide à évaluer, surveiller et atténuer les risques tiers dans votre chaîne d’approvisionnement avec des outils alignés sur le NIST SP 800-161.',
      cards: {
        assessVendors: { title: 'Évaluer les fournisseurs', desc: 'Évaluations conformes au NIST 800-161' },
        monitorRisks: { title: 'Surveiller les risques', desc: 'Tableaux de bord en temps réel' },
        analyzeSboms: { title: 'Analyser les SBOM', desc: 'Analyse de nomenclatures logicielles' }
      }
    },
    profile: {
      title: 'Votre rôle et votre organisation',
      subtitle: 'Aidez-nous à personnaliser votre expérience',
      header: 'Parlez-nous de vous',
      helper: 'Cela nous aide à vous montrer les fonctionnalités les plus pertinentes',
      roleLabel: 'Votre rôle principal',
      role: {
        placeholder: 'Sélectionnez votre rôle',
        security: 'Professionnel de la sécurité',
        procurement: 'Responsable des achats',
        compliance: 'Responsable conformité',
        risk: 'Gestionnaire des risques',
        it: 'Responsable informatique',
        executive: 'Cadre dirigeant'
      },
      sizeLabel: "Taille de l'organisation",
      size: {
        placeholder: 'Sélectionnez la taille',
        startup: 'Startup (1-50 employés)',
        small: 'Petite entreprise (51-200 employés)',
        medium: 'Moyenne entreprise (201-1000 employés)',
        large: 'Grande entreprise (1000+ employés)'
      },
      industryLabel: 'Secteur',
      industry: {
        placeholder: 'Sélectionnez un secteur',
        technology: 'Technologie',
        healthcare: 'Santé',
        financial: 'Services financiers',
        manufacturing: 'Fabrication',
        government: 'Secteur public',
        defense: 'Défense/Aérospatial',
        energy: 'Énergie/Services publics',
        retail: 'Commerce de détail/E-commerce'
      }
    },
    getStarted: {
      title: 'Commencer',
      subtitle: 'Choisissez votre première action',
      question: 'Que souhaitez-vous faire en premier ?',
      helper: 'Choisissez une action pour commencer avec VendorTal',
      assessment: {
        title: 'Lancer une évaluation de la chaîne d’approvisionnement',
        desc: 'Évaluez la posture de sécurité de votre chaîne d’approvisionnement'
      },
      vendor: { title: 'Ajouter votre premier fournisseur', desc: 'Commencez à constituer votre portefeuille de risques fournisseurs' },
      sbom: { title: 'Analyser les composants logiciels', desc: 'Téléchargez et analysez une nomenclature logicielle (SBOM)' },
      tour: { title: 'Faire une visite rapide', desc: 'Découvrez les fonctionnalités clés avec un guide' }
    },
    tour: {
      title: 'Visite rapide',
      subtitle: 'Aperçu des fonctionnalités clés',
      header: 'Fonctionnalités clés de VendorTal',
      assessments: {
        title: 'Évaluations de la chaîne d’approvisionnement',
        desc: 'Évaluations alignées sur le NIST SP 800-161 couvrant 6 domaines clés.'
      },
      vendorRisk: {
        title: 'Gestion des risques fournisseurs',
        desc: 'Suivez et surveillez les risques avec une notation automatisée, le suivi de conformité et des tableaux de bord personnalisables.'
      },
      sbom: {
        title: 'Analyse SBOM',
        desc: 'Analysez les SBOM pour les vulnérabilités, la conformité des licences et les risques de composants, avec support SPDX et CycloneDX.'
      },
      quickTools: {
        title: 'Outils rapides',
        desc: 'Accédez à des outils rapides comme le Calculateur de risque fournisseur, le Scan SBOM rapide et la Checklist NIST 800-161.'
      }
    },
    actions: {
      skipTour: 'Ignorer la visite',
      getStarted: 'Commencer'
    }
  },
  assetDashboard: {
    loading: 'Chargement du tableau de bord...',
    title: 'Tableau de bord Risques Actifs-Fournisseurs',
    subtitle: "Vue complète de l'inventaire des actifs et des relations fournisseurs",
    addAsset: 'Ajouter un actif',
    search: { placeholder: 'Rechercher des actifs, fournisseurs ou relations...' },
    filters: {
      allItems: 'Tous les éléments',
      assetsOnly: 'Uniquement les actifs',
      vendorsOnly: 'Uniquement les fournisseurs',
      allRisks: 'Tous les niveaux de risque',
      lowRisk: 'Risque faible',
      mediumRisk: 'Risque moyen',
      highRisk: 'Risque élevé',
      criticalRisk: 'Risque critique'
    },
    vendorCount: '{{count}} fournisseur(s)',
    relationshipCount: '{{count}} relation(s)',
    primaryVendor: 'Fournisseur principal : ',
    recentAlerts: 'Alertes récentes',
    assets: { title: 'Actifs' },
    vendors: { title: 'Fournisseurs' },
    relationships: { title: 'Relations Actifs-Fournisseurs' },
    table: {
      asset: 'Actif',
      type: 'Type',
      criticality: 'Criticité',
      riskScore: 'Score de risque',
      vendors: 'Fournisseurs',
      vendor: 'Fournisseur',
      industry: 'Secteur',
      assets: 'Actifs',
      criticalAssets: 'Actifs critiques'
    },
    risk: { label: 'Risque {{level}}' },
    notAssessed: 'Non évalué',
    assetCount: '{{count}} actif(s)',
    criticalCount: '{{count}} critique(s)',
    unknownVendor: 'Fournisseur inconnu',
    access: 'accès',
    systemAlerts: 'Alertes système',
    acknowledge: 'Accuser réception'
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect language from browser
  .use(initReactI18next) // Bind i18next to React
  .init({
    resources: {
      en: { translation: extendedEn as any },
      fr: { translation: extendedFr as any }
    },
    fallbackLng: 'en',
    debug: false,
    saveMissing: false,
    parseMissingKeyHandler: humanizeMissingKey,
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  });

// Create context for language switcher
interface I18nContextType {
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
  supportedLanguages: { code: string; name: string }[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  
  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    // Apply RTL direction if needed based on language
    // Currently none of our languages are RTL, but this is for future-proofing
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <I18nContext.Provider
      value={{
        changeLanguage,
        currentLanguage: i18n.language,
        supportedLanguages
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export default i18n;