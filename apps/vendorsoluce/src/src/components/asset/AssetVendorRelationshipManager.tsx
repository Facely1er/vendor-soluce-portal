import { logger } from '../../utils/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  Shield, 
  FileText
} from 'lucide-react';
import { AssetVendorRelationship, Asset, Vendor, DueDiligenceRequirement } from '../../types';
import { assetService } from '../../services/assetService';
import { supabase } from '../../lib/supabase';

interface AssetVendorRelationshipManagerProps {
  assetId: string;
  onRelationshipChange?: () => void;
}

const AssetVendorRelationshipManager: React.FC<AssetVendorRelationshipManagerProps> = ({
  assetId,
  onRelationshipChange
}) => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [relationships, setRelationships] = useState<AssetVendorRelationship[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [dueDiligenceRequirements, setDueDiligenceRequirements] = useState<DueDiligenceRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<AssetVendorRelationship | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<string>('primary_vendor');
  const [criticalityToAsset, setCriticalityToAsset] = useState<string>('medium');
  const [dataAccessLevel, setDataAccessLevel] = useState<string>('read_only');
  const [integrationType, setIntegrationType] = useState<string>('api');
  const [contractId, setContractId] = useState<string>('');
  const [contractStartDate, setContractStartDate] = useState<string>('');
  const [contractEndDate, setContractEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Get asset data
      const assetData = await assetService.getAssetById(assetId);
      setAsset(assetData);

      // Get relationships
      const relationshipsData = await assetService.getAssetVendorRelationships(assetId);
      setRelationships(relationshipsData);

      // Get all vendors for the dropdown
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .order('name');
      
      if (vendorsError) throw vendorsError;
      setVendors(vendorsData || []);

      // Get due diligence requirements for this asset
      const allRequirements: DueDiligenceRequirement[] = [];
      for (const rel of relationshipsData) {
        const requirements = await assetService.getDueDiligenceRequirements(assetId, rel.vendor_id);
        allRequirements.push(...requirements);
      }
      setDueDiligenceRequirements(allRequirements);
    } catch (error) {
      logger.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddRelationship = async () => {
    if (!selectedVendor) return;

    try {
      const relationshipData = {
        asset_id: assetId,
        vendor_id: selectedVendor,
        relationship_type: relationshipType as any,
        criticality_to_asset: criticalityToAsset as any,
        data_access_level: dataAccessLevel as any,
        integration_type: integrationType as any,
        contract_id: contractId || undefined,
        contract_start_date: contractStartDate || undefined,
        contract_end_date: contractEndDate || undefined,
        notes: notes || undefined,
        security_requirements: [],
        compliance_requirements: [],
        risk_factors: [],
        mitigation_controls: []
      };

      await assetService.createAssetVendorRelationship(relationshipData);
      
      await loadData();
      setShowAddModal(false);
      resetForm();
      onRelationshipChange?.();
    } catch (error) {
      logger.error('Error adding relationship:', error);
    }
  };

  const handleEditRelationship = async () => {
    if (!editingRelationship) return;

    try {
      await assetService.updateAssetVendorRelationship(editingRelationship.id, {
        relationship_type: relationshipType as any,
        criticality_to_asset: criticalityToAsset as any,
        data_access_level: dataAccessLevel as any,
        integration_type: integrationType as any,
        contract_id: contractId || undefined,
        contract_start_date: contractStartDate || undefined,
        contract_end_date: contractEndDate || undefined,
        notes: notes || undefined
      });

      await loadData();
      setEditingRelationship(null);
      setShowAddModal(false);
      resetForm();
      onRelationshipChange?.();
    } catch (error) {
      logger.error('Error updating relationship:', error);
    }
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    if (!confirm('Are you sure you want to delete this relationship?')) return;

    try {
      await assetService.deleteAssetVendorRelationship(relationshipId);
      await loadData();
      onRelationshipChange?.();
    } catch (error) {
      logger.error('Error deleting relationship:', error);
    }
  };

  const resetForm = () => {
    setSelectedVendor('');
    setRelationshipType('primary_vendor');
    setCriticalityToAsset('medium');
    setDataAccessLevel('read_only');
    setIntegrationType('api');
    setContractId('');
    setContractStartDate('');
    setContractEndDate('');
    setNotes('');
  };

  const openEditModal = (relationship: AssetVendorRelationship) => {
    setEditingRelationship(relationship);
    setSelectedVendor(relationship.vendor_id);
    setRelationshipType(relationship.relationship_type);
    setCriticalityToAsset(relationship.criticality_to_asset);
    setDataAccessLevel(relationship.data_access_level);
    setIntegrationType(relationship.integration_type || 'api');
    setContractId(relationship.contract_id || '');
    setContractStartDate(relationship.contract_start_date || '');
    setContractEndDate(relationship.contract_end_date || '');
    setNotes(relationship.notes || '');
    setShowAddModal(true);
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full_access': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'read_write': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'read_only': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'none': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendorsoluce-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Asset Information */}
      {asset && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Asset: {asset.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</label>
                <p className="text-gray-900 dark:text-white">{asset.asset_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Criticality</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(asset.criticality_level)}`}>
                  {asset.criticality_level}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Business Impact</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(asset.business_impact)}`}>
                  {asset.business_impact}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relationships */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Vendor Relationships ({relationships.length})
            </CardTitle>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Relationship
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {relationships.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No vendor relationships found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Add a relationship to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {relationships.map((relationship) => {
                const vendor = vendors.find(v => v.id === relationship.vendor_id);
                return (
                  <div key={relationship.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {vendor?.name || 'Unknown Vendor'}
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {relationship.relationship_type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(relationship)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRelationship(relationship.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Criticality to Asset</label>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(relationship.criticality_to_asset)}`}>
                            {relationship.criticality_to_asset}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Access Level</label>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(relationship.data_access_level)}`}>
                            {relationship.data_access_level.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Integration Type</label>
                        <p className="text-sm text-gray-900 dark:text-white">{relationship.integration_type?.replace('_', ' ') || 'Not specified'}</p>
                      </div>
                    </div>

                    {relationship.contract_id && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Contract ID</label>
                            <p className="text-sm text-gray-900 dark:text-white">{relationship.contract_id}</p>
                          </div>
                          {relationship.contract_start_date && (
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date</label>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {new Date(relationship.contract_start_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {relationship.contract_end_date && (
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">End Date</label>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {new Date(relationship.contract_end_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {relationship.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                        <p className="text-sm text-gray-900 dark:text-white">{relationship.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Due Diligence Requirements */}
      {dueDiligenceRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Due Diligence Requirements ({dueDiligenceRequirements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dueDiligenceRequirements.map((requirement) => (
                <div key={requirement.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{requirement.description}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        requirement.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        requirement.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                        requirement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {requirement.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        requirement.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        requirement.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        requirement.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {requirement.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Framework</label>
                      <p className="text-sm text-gray-900 dark:text-white">{requirement.framework.toUpperCase()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(requirement.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {requirement.requirements && requirement.requirements.length > 0 && (
                    <div className="mt-3">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Requirements</label>
                      <ul className="mt-1 text-sm text-gray-900 dark:text-white">
                        {requirement.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-gray-400 mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingRelationship ? 'Edit Relationship' : 'Add Vendor Relationship'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vendor
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={!!editingRelationship}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Relationship Type
                  </label>
                  <select
                    value={relationshipType}
                    onChange={(e) => setRelationshipType(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="primary_vendor">Primary Vendor</option>
                    <option value="secondary_vendor">Secondary Vendor</option>
                    <option value="support_vendor">Support Vendor</option>
                    <option value="licensing_vendor">Licensing Vendor</option>
                    <option value="maintenance_vendor">Maintenance Vendor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Criticality to Asset
                  </label>
                  <select
                    value={criticalityToAsset}
                    onChange={(e) => setCriticalityToAsset(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Access Level
                  </label>
                  <select
                    value={dataAccessLevel}
                    onChange={(e) => setDataAccessLevel(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="none">None</option>
                    <option value="read_only">Read Only</option>
                    <option value="read_write">Read/Write</option>
                    <option value="full_access">Full Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Integration Type
                  </label>
                  <select
                    value={integrationType}
                    onChange={(e) => setIntegrationType(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="api">API</option>
                    <option value="database">Database</option>
                    <option value="file_transfer">File Transfer</option>
                    <option value="web_service">Web Service</option>
                    <option value="direct_access">Direct Access</option>
                    <option value="cloud_service">Cloud Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contract ID
                  </label>
                  <input
                    type="text"
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contract Start Date
                  </label>
                  <input
                    type="date"
                    value={contractStartDate}
                    onChange={(e) => setContractStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contract End Date
                  </label>
                  <input
                    type="date"
                    value={contractEndDate}
                    onChange={(e) => setContractEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Additional notes about this relationship..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingRelationship(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingRelationship ? handleEditRelationship : handleAddRelationship}
                disabled={!selectedVendor}
              >
                {editingRelationship ? 'Update Relationship' : 'Add Relationship'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetVendorRelationshipManager;

