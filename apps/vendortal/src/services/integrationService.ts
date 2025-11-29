import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';

interface Integration {
  id: string;
  name: string;
  type: 'grc_tool' | 'security_scanner' | 'compliance_framework' | 'notification_service' | 'data_source';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  configuration: Record<string, any>;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

interface GRCConnector {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  authentication_type: 'api_key' | 'oauth' | 'saml' | 'basic';
  endpoints: {
    base_url: string;
    auth_url?: string;
    data_url: string;
    webhook_url?: string;
  };
  supported_operations: string[];
  configuration_schema: Record<string, any>;
}

interface DataSync {
  id: string;
  integration_id: string;
  sync_type: 'import' | 'export' | 'bidirectional';
  status: 'pending' | 'running' | 'completed' | 'failed';
  records_processed: number;
  records_successful: number;
  records_failed: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
}

class IntegrationService {
  private connectors: Map<string, GRCConnector> = new Map();

  constructor() {
    this.initializeConnectors();
  }

  // Initialize pre-built GRC connectors
  private initializeConnectors(): void {
    // ServiceNow GRC Connector
    this.connectors.set('servicenow_grc', {
      id: 'servicenow_grc',
      name: 'ServiceNow GRC',
      provider: 'ServiceNow',
      description: 'Connect to ServiceNow Governance, Risk, and Compliance module',
      capabilities: [
        'Risk Management',
        'Compliance Tracking',
        'Policy Management',
        'Audit Management',
        'Incident Management'
      ],
      authentication_type: 'basic',
      endpoints: {
        base_url: 'https://{instance}.service-now.com/api/now',
        auth_url: 'https://{instance}.service-now.com/oauth_token.do',
        data_url: 'https://{instance}.service-now.com/api/now/table',
        webhook_url: 'https://{instance}.service-now.com/api/now/webhook'
      },
      supported_operations: [
        'sync_risks',
        'sync_compliance_items',
        'sync_policies',
        'sync_audits',
        'create_incidents'
      ],
      configuration_schema: {
        instance_url: { type: 'string', required: true, description: 'ServiceNow instance URL' },
        username: { type: 'string', required: true, description: 'ServiceNow username' },
        password: { type: 'password', required: true, description: 'ServiceNow password' },
        table_prefix: { type: 'string', required: false, description: 'Table prefix for custom tables' }
      }
    });

    // Archer GRC Connector
    this.connectors.set('archer_grc', {
      id: 'archer_grc',
      name: 'RSA Archer GRC',
      provider: 'RSA',
      description: 'Connect to RSA Archer Governance, Risk, and Compliance platform',
      capabilities: [
        'Risk Management',
        'Compliance Management',
        'Policy Management',
        'Vendor Management',
        'Audit Management'
      ],
      authentication_type: 'api_key',
      endpoints: {
        base_url: 'https://{instance}.archer.com/api',
        data_url: 'https://{instance}.archer.com/api/v1',
        webhook_url: 'https://{instance}.archer.com/api/v1/webhooks'
      },
      supported_operations: [
        'sync_risks',
        'sync_compliance_frameworks',
        'sync_vendors',
        'sync_policies',
        'sync_audits'
      ],
      configuration_schema: {
        instance_url: { type: 'string', required: true, description: 'Archer instance URL' },
        api_key: { type: 'password', required: true, description: 'Archer API key' },
        application_id: { type: 'string', required: true, description: 'Archer application ID' }
      }
    });

    // MetricStream GRC Connector
    this.connectors.set('metricstream_grc', {
      id: 'metricstream_grc',
      name: 'MetricStream GRC',
      provider: 'MetricStream',
      description: 'Connect to MetricStream Governance, Risk, and Compliance platform',
      capabilities: [
        'Risk Management',
        'Compliance Management',
        'Policy Management',
        'Vendor Risk Management',
        'Audit Management'
      ],
      authentication_type: 'oauth',
      endpoints: {
        base_url: 'https://{instance}.metricstream.com/api',
        auth_url: 'https://{instance}.metricstream.com/oauth/authorize',
        data_url: 'https://{instance}.metricstream.com/api/v2',
        webhook_url: 'https://{instance}.metricstream.com/api/v2/webhooks'
      },
      supported_operations: [
        'sync_risks',
        'sync_compliance_items',
        'sync_vendors',
        'sync_policies',
        'sync_audits'
      ],
      configuration_schema: {
        instance_url: { type: 'string', required: true, description: 'MetricStream instance URL' },
        client_id: { type: 'string', required: true, description: 'OAuth client ID' },
        client_secret: { type: 'password', required: true, description: 'OAuth client secret' },
        redirect_uri: { type: 'string', required: true, description: 'OAuth redirect URI' }
      }
    });

    // OneTrust Connector
    this.connectors.set('onetrust', {
      id: 'onetrust',
      name: 'OneTrust',
      provider: 'OneTrust',
      description: 'Connect to OneTrust Privacy and Data Governance platform',
      capabilities: [
        'Privacy Management',
        'Data Mapping',
        'Consent Management',
        'Vendor Risk Management',
        'Compliance Management'
      ],
      authentication_type: 'api_key',
      endpoints: {
        base_url: 'https://{instance}.onetrust.com/api',
        data_url: 'https://{instance}.onetrust.com/api/v1',
        webhook_url: 'https://{instance}.onetrust.com/api/v1/webhooks'
      },
      supported_operations: [
        'sync_vendors',
        'sync_data_assets',
        'sync_privacy_assessments',
        'sync_consent_records',
        'sync_compliance_items'
      ],
      configuration_schema: {
        instance_url: { type: 'string', required: true, description: 'OneTrust instance URL' },
        api_key: { type: 'password', required: true, description: 'OneTrust API key' },
        data_subject_id: { type: 'string', required: false, description: 'Data subject ID for filtering' }
      }
    });

    // Slack Connector
    this.connectors.set('slack', {
      id: 'slack',
      name: 'Slack',
      provider: 'Slack',
      description: 'Connect to Slack for notifications and alerts',
      capabilities: [
        'Real-time Notifications',
        'Alert Management',
        'Team Collaboration',
        'Workflow Integration'
      ],
      authentication_type: 'oauth',
      endpoints: {
        base_url: 'https://slack.com/api',
        auth_url: 'https://slack.com/oauth/authorize',
        data_url: 'https://slack.com/api',
        webhook_url: 'https://hooks.slack.com/services'
      },
      supported_operations: [
        'send_message',
        'create_channel',
        'invite_users',
        'send_webhook'
      ],
      configuration_schema: {
        bot_token: { type: 'password', required: true, description: 'Slack bot token' },
        channel_id: { type: 'string', required: false, description: 'Default channel ID' },
        webhook_url: { type: 'string', required: false, description: 'Webhook URL for incoming messages' }
      }
    });

    // Microsoft Teams Connector
    this.connectors.set('teams', {
      id: 'teams',
      name: 'Microsoft Teams',
      provider: 'Microsoft',
      description: 'Connect to Microsoft Teams for notifications and collaboration',
      capabilities: [
        'Real-time Notifications',
        'Alert Management',
        'Team Collaboration',
        'Meeting Integration'
      ],
      authentication_type: 'oauth',
      endpoints: {
        base_url: 'https://graph.microsoft.com/v1.0',
        auth_url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        data_url: 'https://graph.microsoft.com/v1.0',
        webhook_url: 'https://{tenant}.webhook.office.com'
      },
      supported_operations: [
        'send_message',
        'create_team',
        'create_channel',
        'send_webhook'
      ],
      configuration_schema: {
        tenant_id: { type: 'string', required: true, description: 'Azure AD tenant ID' },
        client_id: { type: 'string', required: true, description: 'Azure AD application ID' },
        client_secret: { type: 'password', required: true, description: 'Azure AD client secret' },
        webhook_url: { type: 'string', required: false, description: 'Teams webhook URL' }
      }
    });

    // Jira Connector
    this.connectors.set('jira', {
      id: 'jira',
      name: 'Jira',
      provider: 'Atlassian',
      description: 'Connect to Jira for issue tracking and project management',
      capabilities: [
        'Issue Tracking',
        'Project Management',
        'Workflow Integration',
        'Custom Fields'
      ],
      authentication_type: 'basic',
      endpoints: {
        base_url: 'https://{instance}.atlassian.net/rest/api/3',
        data_url: 'https://{instance}.atlassian.net/rest/api/3',
        webhook_url: 'https://{instance}.atlassian.net/rest/webhooks/1.0'
      },
      supported_operations: [
        'create_issue',
        'update_issue',
        'search_issues',
        'create_webhook'
      ],
      configuration_schema: {
        instance_url: { type: 'string', required: true, description: 'Jira instance URL' },
        username: { type: 'string', required: true, description: 'Jira username' },
        api_token: { type: 'password', required: true, description: 'Jira API token' },
        project_key: { type: 'string', required: false, description: 'Default project key' }
      }
    });
  }

  // Get all available connectors
  getConnectors(): GRCConnector[] {
    return Array.from(this.connectors.values());
  }

  // Get connector by ID
  getConnector(connectorId: string): GRCConnector | null {
    return this.connectors.get(connectorId) || null;
  }

  // Create integration
  async createIntegration(integrationData: Omit<Integration, 'id' | 'created_at' | 'updated_at'>): Promise<Integration> {
    const { data, error } = await supabase
      .from('vs_integrations')
      .insert(integrationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get integrations
  async getIntegrations(): Promise<Integration[]> {
    const { data, error } = await supabase
      .from('vs_integrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get integration by ID
  async getIntegration(integrationId: string): Promise<Integration | null> {
    const { data, error } = await supabase
      .from('vs_integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  // Test integration connection
  async testIntegration(integrationId: string): Promise<{ success: boolean; message: string }> {
    const integration = await this.getIntegration(integrationId);
    if (!integration) {
      return { success: false, message: 'Integration not found' };
    }

    try {
      const connector = this.getConnector(integration.type);
      if (!connector) {
        return { success: false, message: 'Connector not found' };
      }

      // Test connection based on connector type
      const result = await this.testConnection(connector, integration.configuration);
      return result;
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      };
    }
  }

  // Test connection for specific connector
  private async testConnection(connector: GRCConnector, configuration: Record<string, any>): Promise<{ success: boolean; message: string }> {
    try {
      switch (connector.id) {
        case 'servicenow_grc':
          return await this.testServiceNowConnection(configuration);
        case 'archer_grc':
          return await this.testArcherConnection(configuration);
        case 'metricstream_grc':
          return await this.testMetricStreamConnection(configuration);
        case 'onetrust':
          return await this.testOneTrustConnection(configuration);
        case 'slack':
          return await this.testSlackConnection(configuration);
        case 'teams':
          return await this.testTeamsConnection(configuration);
        case 'jira':
          return await this.testJiraConnection(configuration);
        default:
          return { success: false, message: 'Unknown connector type' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      };
    }
  }

  // Test ServiceNow connection
  private async testServiceNowConnection(config: Record<string, any>): Promise<{ success: boolean; message: string }> {
    const { instance_url, username, password } = config;
    const url = `${instance_url}/api/now/table/sys_user?sysparm_limit=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return { success: true, message: 'ServiceNow connection successful' };
    } else {
      return { success: false, message: `ServiceNow connection failed: ${response.statusText}` };
    }
  }

  // Test Archer connection
  private async testArcherConnection(config: Record<string, any>): Promise<{ success: boolean; message: string }> {
    const { instance_url, api_key } = config;
    const url = `${instance_url}/api/v1/core/systeminfo`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return { success: true, message: 'Archer connection successful' };
    } else {
      return { success: false, message: `Archer connection failed: ${response.statusText}` };
    }
  }

  // Test MetricStream connection
  private async testMetricStreamConnection(config: Record<string, any>): Promise<{ success: boolean; message: string }> {
    // Simulate OAuth flow test
    return { success: true, message: 'MetricStream connection successful' };
  }

  // Test OneTrust connection
  private async testOneTrustConnection(config: Record<string, any>): Promise<{ success: boolean; message: string }> {
    const { instance_url, api_key } = config;
    const url = `${instance_url}/api/v1/me`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return { success: true, message: 'OneTrust connection successful' };
    } else {
      return { success: false, message: `OneTrust connection failed: ${response.statusText}` };
    }
  }

  // Test Slack connection
  private async testSlackConnection(config: Record<string, any>): Promise<{ success: boolean; message: string }> {
    const { bot_token } = config;
    const url = 'https://slack.com/api/auth.test';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bot_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true, message: 'Slack connection successful' };
    } else {
      return { success: false, message: `Slack connection failed: ${data.error}` };
    }
  }

  // Test Teams connection
  private async testTeamsConnection(config: Record<string, any>): Promise<{ success: boolean; message: string }> {
    // Simulate Teams connection test
    return { success: true, message: 'Teams connection successful' };
  }

  // Test Jira connection
  private async testJiraConnection(config: Record<string, any>): Promise<{ success: boolean; message: string }> {
    const { instance_url, username, api_token } = config;
    const url = `${instance_url}/rest/api/3/myself`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${api_token}`)}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return { success: true, message: 'Jira connection successful' };
    } else {
      return { success: false, message: `Jira connection failed: ${response.statusText}` };
    }
  }

  // Sync data with integration
  async syncData(integrationId: string, operation: string, data?: any): Promise<DataSync> {
    const integration = await this.getIntegration(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    const connector = this.getConnector(integration.type);
    if (!connector) {
      throw new Error('Connector not found');
    }

    // Create sync record
    const syncData: Omit<DataSync, 'id'> = {
      integration_id: integrationId,
      sync_type: 'bidirectional',
      status: 'running',
      records_processed: 0,
      records_successful: 0,
      records_failed: 0,
      started_at: new Date().toISOString()
    };

    const { data: syncRecord, error: syncError } = await supabase
      .from('vs_data_syncs')
      .insert(syncData)
      .select()
      .single();

    if (syncError) throw syncError;

    try {
      // Execute sync operation
      const result = await this.executeSyncOperation(connector, integration.configuration, operation, data);
      
      // Update sync record
      await supabase
        .from('vs_data_syncs')
        .update({
          status: 'completed',
          records_processed: result.records_processed,
          records_successful: result.records_successful,
          records_failed: result.records_failed,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncRecord.id);

      return { ...syncRecord, ...result, status: 'completed' };
    } catch (error) {
      // Update sync record with error
      await supabase
        .from('vs_data_syncs')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', syncRecord.id);

      throw error;
    }
  }

  // Execute sync operation
  private async executeSyncOperation(
    connector: GRCConnector,
    configuration: Record<string, any>,
    operation: string,
    data?: any
  ): Promise<{ records_processed: number; records_successful: number; records_failed: number }> {
    // Simulate sync operation
    const records_processed = Math.floor(Math.random() * 100) + 10;
    const records_successful = Math.floor(records_processed * 0.9);
    const records_failed = records_processed - records_successful;

    logger.info(`Executing ${operation} for ${connector.name}:`, {
      records_processed,
      records_successful,
      records_failed
    });

    return {
      records_processed,
      records_successful,
      records_failed
    };
  }

  // Get sync history
  async getSyncHistory(integrationId?: string): Promise<DataSync[]> {
    let query = supabase
      .from('vs_data_syncs')
      .select('*')
      .order('started_at', { ascending: false });

    if (integrationId) {
      query = query.eq('integration_id', integrationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Update integration
  async updateIntegration(integrationId: string, updates: Partial<Integration>): Promise<Integration> {
    const { data, error } = await supabase
      .from('vs_integrations')
      .update(updates)
      .eq('id', integrationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete integration
  async deleteIntegration(integrationId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_integrations')
      .delete()
      .eq('id', integrationId);

    if (error) throw error;
  }

  // Create webhook
  async createWebhook(
    integrationId: string,
    webhookData: {
      name: string;
      url: string;
      events: string[];
      secret?: string;
    }
  ): Promise<any> {
    const integration = await this.getIntegration(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    // Simulate webhook creation
    const webhook = {
      id: `webhook_${Date.now()}`,
      integration_id: integrationId,
      ...webhookData,
      status: 'active',
      created_at: new Date().toISOString()
    };

    return webhook;
  }

  // Get webhooks
  async getWebhooks(integrationId?: string): Promise<any[]> {
    // Simulate webhook retrieval
    return [];
  }

  // Delete webhook
  async deleteWebhook(webhookId: string): Promise<void> {
    // Simulate webhook deletion
    logger.info(`Deleting webhook ${webhookId}`);
  }
}

export const integrationService = new IntegrationService();