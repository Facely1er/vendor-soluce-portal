// Campaign Form Component
// Form for creating/editing marketing campaigns
// File: src/components/marketing/CampaignForm.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { MarketingCampaign } from '../../services/marketingAutomationService';

interface CampaignFormProps {
  campaignId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ campaignId, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'welcome' as MarketingCampaign['type'],
    trigger_type: 'event' as 'event' | 'schedule' | 'manual',
    trigger_config: {} as Record<string, any>,
    status: 'draft' as 'draft' | 'active' | 'paused' | 'archived',
  });

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId]);

  const loadCampaign = async () => {
    const { data } = await supabase
      .from('vs_marketing_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (data) {
      setFormData({
        name: data.name,
        description: data.description || '',
        type: data.type,
        trigger_type: data.trigger_type,
        trigger_config: data.trigger_config || {},
        status: data.status,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (campaignId) {
        await supabase
          .from('vs_marketing_campaigns')
          .update(formData)
          .eq('id', campaignId);
      } else {
        await supabase
          .from('vs_marketing_campaigns')
          .insert(formData);
      }

      onSave?.();
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{campaignId ? 'Edit Campaign' : 'Create Campaign'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Campaign Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MarketingCampaign['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="welcome">Welcome</option>
              <option value="trial">Trial</option>
              <option value="abandoned_cart">Abandoned Cart</option>
              <option value="win_back">Win-Back</option>
              <option value="feature_announcement">Feature Announcement</option>
              <option value="educational">Educational</option>
              <option value="upgrade_prompt">Upgrade Prompt</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trigger Type</label>
            <select
              value={formData.trigger_type}
              onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="event">Event-Based</option>
              <option value="schedule">Scheduled</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {formData.trigger_type === 'event' && (
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <input
                type="text"
                value={formData.trigger_config.event_type || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  trigger_config: { ...formData.trigger_config, event_type: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., user_signup, checkout_started"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : campaignId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

