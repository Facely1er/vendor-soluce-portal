import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AlertTriangle, Shield, TrendingUp, ExternalLink, Clock, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

interface ThreatIntelligenceItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: string;
  affectedVendors: string[];
  category: 'data_breach' | 'vulnerability' | 'geopolitical' | 'financial' | 'operational';
  actionRequired: boolean;
}

interface ThreatIntelligenceFeedProps {
  vendorIds?: string[];
}

const ThreatIntelligenceFeed: React.FC<ThreatIntelligenceFeedProps> = ({ vendorIds = [] }) => {
  const [threats, setThreats] = useState<ThreatIntelligenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'actionable'>('all');

  useEffect(() => {
    // Simulate threat intelligence feed
    const mockThreats: ThreatIntelligenceItem[] = [
      {
        id: 'ti-001',
        title: 'Major Cloud Provider Security Incident',
        description: 'A leading cloud infrastructure provider experienced a data breach affecting customer configuration data. Organizations using affected services should review access logs.',
        severity: 'high',
        source: 'Cyber Threat Intelligence',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        affectedVendors: ['cloud-vendor-1', 'saas-provider-2'],
        category: 'data_breach',
        actionRequired: true
      },
      {
        id: 'ti-002',
        title: 'Critical Vulnerability in Popular JavaScript Library',
        description: 'CVE-2024-12345: Remote code execution vulnerability discovered in widely-used npm package. All versions below 2.1.4 are affected.',
        severity: 'critical',
        source: 'NVD',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        affectedVendors: ['software-vendor-3'],
        category: 'vulnerability',
        actionRequired: true
      },
      {
        id: 'ti-003',
        title: 'Geopolitical Risk Alert: Trade Restrictions',
        description: 'New export controls announced affecting technology components from specific regions. Supply chain diversification recommended.',
        severity: 'medium',
        source: 'Geopolitical Risk Monitor',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        affectedVendors: ['hardware-vendor-1'],
        category: 'geopolitical',
        actionRequired: false
      },
      {
        id: 'ti-004',
        title: 'Financial Instability Warning',
        description: 'Credit rating downgrade for mid-tier software vendor may impact service continuity. Contingency planning recommended.',
        severity: 'medium',
        source: 'Financial Risk Monitor',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        affectedVendors: ['software-vendor-4'],
        category: 'financial',
        actionRequired: false
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setThreats(mockThreats);
      setLoading(false);
    }, 1500);
  }, [vendorIds]);

  const filteredThreats = threats.filter(threat => {
    if (filter === 'all') return true;
    if (filter === 'actionable') return threat.actionRequired;
    return threat.severity === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data_breach': return <Shield className="h-4 w-4" />;
      case 'vulnerability': return <AlertTriangle className="h-4 w-4" />;
      case 'geopolitical': return <Globe className="h-4 w-4" />;
      case 'financial': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-supply-chain-teal" />
            Threat Intelligence Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-vendorsoluce-teal" />
            Threat Intelligence Feed
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter === 'critical' ? 'primary' : 'outline'}
              onClick={() => setFilter('critical')}
            >
              Critical
            </Button>
            <Button
              size="sm"
              variant={filter === 'actionable' ? 'primary' : 'outline'}
              onClick={() => setFilter('actionable')}
            >
              Action Required
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredThreats.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No threats match the current filter.</p>
            </div>
          ) : (
            filteredThreats.map((threat) => (
              <div
                key={threat.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-vendorsoluce-teal dark:hover:border-vendorsoluce-teal transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                      {getCategoryIcon(threat.category)}
                      <span className="ml-1">{threat.severity.toUpperCase()}</span>
                    </span>
                    {threat.actionRequired && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                        Action Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimestamp(threat.timestamp)}
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{threat.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{threat.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Source: {threat.source}
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatIntelligenceFeed;