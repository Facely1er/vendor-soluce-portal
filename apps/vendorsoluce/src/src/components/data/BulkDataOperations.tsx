import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Trash2, 
  Archive, 
  CheckSquare, 
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { logger } from '../../utils/logger';

interface BulkDataOperationsProps {
  dataType: 'vendors' | 'sbom_analyses' | 'assessments';
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  onOperationComplete: () => void;
}

const BulkDataOperations: React.FC<BulkDataOperationsProps> = ({
  dataType,
  selectedItems,
  onSelectionChange,
  onOperationComplete
}) => {
  const { user } = useAuth();
  const [isOperating, setIsOperating] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const getTableName = () => {
    switch (dataType) {
      case 'vendors': return 'vendors';
      case 'sbom_analyses': return 'sbom_analyses';
      case 'assessments': return 'supply_chain_assessments';
      default: return '';
    }
  };

  const handleBulkDelete = async () => {
    if (!user || selectedItems.length === 0) return;
    
    setIsOperating(true);
    try {
      const { error } = await supabase
        .from(getTableName())
        .delete()
        .in('id', selectedItems)
        .eq('user_id', user.id);

      if (error) throw error;
      
      onSelectionChange([]);
      onOperationComplete();
      setConfirmAction(null);
    } catch (error) {
      logger.error('Bulk delete error:', error);
      alert(`Failed to delete items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsOperating(false);
    }
  };

  const handleBulkUpdateStatus = async (status: string) => {
    if (!user || selectedItems.length === 0) return;
    
    setIsOperating(true);
    try {
      let updateData: Record<string, string> = {};
      
      if (dataType === 'vendors') {
        updateData.compliance_status = status;
      } else if (dataType === 'assessments') {
        updateData.status = status;
      }
      
      const { error } = await (supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type workaround
        .from(getTableName()) as any
        )
        .update(updateData)
        .in('id', selectedItems)
        .eq('user_id', user.id);

      if (error) throw error;
      
      onSelectionChange([]);
      onOperationComplete();
    } catch (error) {
      logger.error('Bulk update error:', error);
      alert(`Failed to update items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsOperating(false);
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mb-4 border-l-4 border-l-vendorsoluce-green">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 text-vendorsoluce-green mr-2" />
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {dataType === 'vendors' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkUpdateStatus('Compliant')}
                    disabled={isOperating}
                  >
                    Mark Compliant
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkUpdateStatus('Non-Compliant')}
                    disabled={isOperating}
                  >
                    Mark Non-Compliant
                  </Button>
                </>
              )}
              
              {dataType === 'assessments' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkUpdateStatus('archived')}
                    disabled={isOperating}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction('delete')}
                disabled={isOperating}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectionChange([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Confirm {confirmAction === 'delete' ? 'Deletion' : 'Action'}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {confirmAction === 'delete' 
                  ? `Are you sure you want to delete ${selectedItems.length} selected item${selectedItems.length > 1 ? 's' : ''}? This action cannot be undone.`
                  : `Are you sure you want to perform this action on ${selectedItems.length} selected item${selectedItems.length > 1 ? 's' : ''}?`
                }
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmAction(null)}
                  disabled={isOperating}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmAction === 'delete' ? handleBulkDelete : () => {}}
                  disabled={isOperating}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isOperating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {confirmAction === 'delete' ? 'Delete' : 'Confirm'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkDataOperations;