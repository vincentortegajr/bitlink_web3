import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsToolbar = ({ 
  selectedItems, 
  onClearSelection, 
  onBulkDelete, 
  onBulkToggleStatus,
  onBulkExport,
  activeTab 
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleBulkAction = (action) => {
    if (action === 'delete') {
      setConfirmAction('delete');
      setIsConfirmModalOpen(true);
    } else if (action === 'activate') {
      onBulkToggleStatus(true);
    } else if (action === 'deactivate') {
      onBulkToggleStatus(false);
    } else if (action === 'export') {
      onBulkExport();
    }
  };

  const confirmBulkDelete = () => {
    onBulkDelete();
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const getItemTypeLabel = () => {
    switch (activeTab) {
      case 'social-links':
        return 'link';
      case 'ebooks':
        return 'ebook';
      case 'lead-magnets':
        return 'lead magnet';
      default:
        return 'item';
    }
  };

  return (
    <>
      <div className="sticky top-32 z-30 bg-primary/95 backdrop-blur-glass border border-primary/20 rounded-lg p-3 mb-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Selection Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-primary-foreground">
              <Icon name="CheckSquare" size={16} />
              <span className="font-medium">
                {selectedItems.length} {getItemTypeLabel()}{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="text-primary-foreground/80 hover:text-primary-foreground text-sm underline transition-smooth"
            >
              Clear selection
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Mobile Actions Dropdown */}
            <div className="sm:hidden w-full">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkAction(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 bg-white text-text-primary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose action...</option>
                <option value="activate">Activate selected</option>
                <option value="deactivate">Deactivate selected</option>
                <option value="export">Export selected</option>
                <option value="delete">Delete selected</option>
              </select>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('activate')}
                iconName="Play"
                iconPosition="left"
              >
                Activate
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
                iconName="Pause"
                iconPosition="left"
              >
                Deactivate
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('export')}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-destructive/10 text-destructive rounded-md">
                  <Icon name="AlertTriangle" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Confirm Bulk Delete
                </h3>
              </div>

              <p className="text-text-secondary mb-6">
                Are you sure you want to delete {selectedItems.length} selected {getItemTypeLabel()}{selectedItems.length !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <Button
                  variant="destructive"
                  onClick={confirmBulkDelete}
                  iconName="Trash2"
                  iconPosition="left"
                  className="flex-1"
                >
                  Delete {selectedItems.length} {getItemTypeLabel()}{selectedItems.length !== 1 ? 's' : ''}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setConfirmAction(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsToolbar;