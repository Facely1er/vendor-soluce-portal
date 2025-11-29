// Marketing Admin Page
// Admin interface for managing marketing campaigns and workflows
// File: src/pages/MarketingAdminPage.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  TrendingUp, 
  Users, 
  Calendar, 
  Play, 
  Pause, 
  Edit, 
  Plus,
  BarChart3,
  Send,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { MarketingAutomationService, MarketingCampaign, MarketingWorkflow, EmailSend } from '../services/marketingAutomationService';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/monitoring';

const MarketingAdminPage: React.FC = () => {
  const { t: _t } = useTranslation();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [workflows, setWorkflows] = useState<MarketingWorkflow[]>([]);
  const [pendingEmails, setPendingEmails] = useState<EmailSend[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadCampaigns(),
        loadWorkflows(),
        loadPendingEmails(),
        loadAnalytics(),
      ]);
    } catch (error) {
      logger.error('Error loading marketing admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    const data = await MarketingAutomationService.getActiveCampaigns();
    setCampaigns(data);
  };

  const loadWorkflows = async () => {
    // Get all active workflows (admin view)
    const { data, error } = await supabase
      .from('vs_marketing_workflows')
      .select(`
        *,
        vs_marketing_campaigns(name, type),
        vs_profiles(email, full_name)
      `)
      .in('status', ['active', 'paused', 'completed'])
      .order('started_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setWorkflows(data as any);
    }
  };

  const loadPendingEmails = async () => {
    const { data, error } = await supabase
      .from('vs_email_sends')
      .select(`
        *,
        vs_profiles(email, full_name),
        vs_marketing_campaigns(name)
      `)
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true })
      .limit(50);

    if (!error && data) {
      setPendingEmails(data as any);
    }
  };

  const loadAnalytics = async () => {
    const { data, error } = await supabase
      .from('vs_campaign_analytics')
      .select(`
        *,
        vs_marketing_campaigns(name, type)
      `)
      .order('date', { ascending: false })
      .limit(30);

    if (!error && data) {
      setAnalytics(data as any);
    }
  };

  const toggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await supabase
        .from('vs_marketing_campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId);

      await loadCampaigns();
    } catch (error) {
      logger.error('Error toggling campaign status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: <CheckCircle2 className="w-3 h-3" /> },
      paused: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', icon: <Pause className="w-3 h-3" /> },
      draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', icon: <Edit className="w-3 h-3" /> },
      archived: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', icon: <XCircle className="w-3 h-3" /> },
      completed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: <CheckCircle2 className="w-3 h-3" /> },
    };

    const variant = variants[status] || variants.draft;
    return (
      <Badge className={variant.color}>
        <span className="flex items-center gap-1">
          {variant.icon}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  const getCampaignTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      welcome: <Mail className="w-5 h-5" />,
      trial: <Clock className="w-5 h-5" />,
      abandoned_cart: <Send className="w-5 h-5" />,
      win_back: <Users className="w-5 h-5" />,
      feature_announcement: <TrendingUp className="w-5 h-5" />,
      educational: <BarChart3 className="w-5 h-5" />,
      upgrade_prompt: <TrendingUp className="w-5 h-5" />,
    };
    return icons[type] || <Mail className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading marketing data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Marketing Automation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage campaigns, workflows, and email analytics
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="emails">Pending Emails</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Marketing Campaigns</h2>
            <Button onClick={() => window.location.href = '/admin/marketing/campaigns/new'}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCampaignTypeIcon(campaign.type)}
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{campaign.type}</p>
                      </div>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {campaign.description || 'No description'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                    >
                      {campaign.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {campaigns.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No campaigns found</p>
                <Button className="mt-4" onClick={() => window.location.href = '/admin/marketing/campaigns/new'}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <h2 className="text-xl font-semibold">Active Workflows</h2>
          
          <div className="space-y-4">
            {workflows.map((workflow: any) => (
              <Card key={workflow.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{workflow.vs_marketing_campaigns?.name || 'Unknown Campaign'}</h3>
                        {getStatusBadge(workflow.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-500">User</p>
                          <p className="font-medium">{workflow.vs_profiles?.email || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Started</p>
                          <p className="font-medium">
                            {new Date(workflow.started_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Step</p>
                          <p className="font-medium">{workflow.current_step} / ?</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">{workflow.vs_marketing_campaigns?.type || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {workflow.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            await MarketingAutomationService.cancelWorkflow(workflow.id);
                            await loadWorkflows();
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {workflows.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No active workflows</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pending Emails Tab */}
        <TabsContent value="emails" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pending Emails</h2>
            <Button onClick={loadPendingEmails} variant="outline">
              Refresh
            </Button>
          </div>

          <div className="space-y-2">
            {pendingEmails.map((email: any) => (
              <Card key={email.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{email.subject}</h3>
                        <Badge variant="outline">
                          {email.vs_marketing_campaigns?.name || 'No Campaign'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">To</p>
                          <p className="font-medium">{email.vs_profiles?.email || email.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Scheduled For</p>
                          <p className="font-medium">
                            {new Date(email.scheduled_for).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        <div>
                          <p className="text-gray-500">Time Until Send</p>
                          <p className="font-medium">
                            {Math.max(0, Math.floor((new Date(email.scheduled_for).getTime() - Date.now()) / (1000 * 60 * 60)))}h
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pendingEmails.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Send className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No pending emails</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">Campaign Analytics</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {analytics.reduce((sum, a) => sum + (a.emails_sent || 0), 0)}
                </div>
                <p className="text-sm text-gray-500">Total Emails Sent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {analytics.reduce((sum, a) => sum + (a.emails_opened || 0), 0)}
                </div>
                <p className="text-sm text-gray-500">Total Opens</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {analytics.reduce((sum, a) => sum + (a.emails_clicked || 0), 0)}
                </div>
                <p className="text-sm text-gray-500">Total Clicks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {analytics.length > 0
                    ? Math.round(
                        (analytics.reduce((sum, a) => sum + (a.emails_opened || 0), 0) /
                          analytics.reduce((sum, a) => sum + (a.emails_sent || 0), 1)) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-sm text-gray-500">Average Open Rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {analytics.map((stat: any) => {
              const openRate = stat.emails_sent > 0 
                ? Math.round((stat.emails_opened / stat.emails_sent) * 100) 
                : 0;
              const clickRate = stat.emails_sent > 0 
                ? Math.round((stat.emails_clicked / stat.emails_sent) * 100) 
                : 0;

              return (
                <Card key={stat.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{stat.vs_marketing_campaigns?.name || 'Unknown Campaign'}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(stat.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>{stat.vs_marketing_campaigns?.type || 'N/A'}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Sent</p>
                        <p className="font-semibold text-lg">{stat.emails_sent || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Opened</p>
                        <p className="font-semibold text-lg">{stat.emails_opened || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Clicked</p>
                        <p className="font-semibold text-lg">{stat.emails_clicked || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Open Rate</p>
                        <p className="font-semibold text-lg text-green-600">{openRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Click Rate</p>
                        <p className="font-semibold text-lg text-blue-600">{clickRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {analytics.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No analytics data yet</p>
                <p className="text-sm text-gray-500 mt-2">Analytics will appear here once campaigns start sending emails</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingAdminPage;

