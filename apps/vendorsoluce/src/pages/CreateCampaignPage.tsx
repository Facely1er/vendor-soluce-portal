// Create Campaign Page
// Page for creating new marketing campaigns
// File: src/pages/CreateCampaignPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignForm } from '../components/marketing/CampaignForm';

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/admin/marketing');
  };

  const handleCancel = () => {
    navigate('/admin/marketing');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Marketing Campaign
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set up a new automated email campaign
        </p>
      </div>

      <div className="max-w-2xl">
        <CampaignForm onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default CreateCampaignPage;

