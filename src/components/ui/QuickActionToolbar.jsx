import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionToolbar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const getActionsForPage = (pathname) => {
    switch (pathname) {
      case '/profile-builder-dashboard':
        return [
          { id: 'upload-avatar', label: 'Upload Avatar', icon: 'ImagePlus', primary: true },
          { id: 'add-bio', label: 'Add Bio', icon: 'FileText', primary: false },
          { id: 'customize-theme', label: 'Customize Theme', icon: 'Palette', primary: false },
          { id: 'preview-profile', label: 'Preview', icon: 'Eye', primary: false }
        ];
      case '/link-content-management':
        return [
          { id: 'add-link', label: 'Add Link', icon: 'Plus', primary: true },
          { id: 'upload-ebook', label: 'Upload Ebook', icon: 'BookOpen', primary: true },
          { id: 'create-collection', label: 'Create Collection', icon: 'FolderPlus', primary: false },
          { id: 'bulk-import', label: 'Bulk Import', icon: 'Upload', primary: false }
        ];
      case '/crypto-payment-setup':
        return [
          { id: 'add-payment-button', label: 'Payment Button', icon: 'CreditCard', primary: true },
          { id: 'setup-subscription', label: 'Subscription', icon: 'Repeat', primary: true },
          { id: 'configure-wallet', label: 'Configure Wallet', icon: 'Wallet', primary: false },
          { id: 'test-payment', label: 'Test Payment', icon: 'TestTube', primary: false }
        ];
      case '/lead-generation-hub':
        return [
          { id: 'create-form', label: 'Create Form', icon: 'FileText', primary: true },
          { id: 'add-popup', label: 'Add Popup', icon: 'MessageSquare', primary: true },
          { id: 'setup-automation', label: 'Automation', icon: 'Zap', primary: false },
          { id: 'export-leads', label: 'Export Leads', icon: 'Download', primary: false }
        ];
      case '/analytics-performance-dashboard':
        return [
          { id: 'generate-report', label: 'Generate Report', icon: 'FileBarChart', primary: true },
          { id: 'export-data', label: 'Export Data', icon: 'Download', primary: false },
          { id: 'schedule-report', label: 'Schedule Report', icon: 'Calendar', primary: false },
          { id: 'share-insights', label: 'Share Insights', icon: 'Share', primary: false }
        ];
      default:
        return [];
    }
  };

  const actions = getActionsForPage(location.pathname);

  if (actions.length === 0) {
    return null;
  }

  const handleActionClick = (actionId) => {
    setModalType(actionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const primaryActions = actions.filter(action => action.primary);
  const secondaryActions = actions.filter(action => !action.primary);

  return (
    <>
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-glass border-b border-border">
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Primary Actions */}
            <div className="flex items-center space-x-2">
              {primaryActions.map((action) => (
                <Button
                  key={action.id}
                  variant="default"
                  size="sm"
                  onClick={() => handleActionClick(action.id)}
                  iconName={action.icon}
                  iconPosition="left"
                  className="shadow-subtle"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Secondary Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {secondaryActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick(action.id)}
                  iconName={action.icon}
                  iconPosition="left"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Secondary Actions - Mobile Dropdown */}
            {secondaryActions.length > 0 && (
              <div className="md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MoreHorizontal"
                  className="relative"
                >
                  More
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Secondary Actions - Horizontal Scroll */}
          {secondaryActions.length > 0 && (
            <div className="md:hidden mt-3 -mx-4 px-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {secondaryActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleActionClick(action.id)}
                    iconName={action.icon}
                    iconPosition="left"
                    className="whitespace-nowrap flex-shrink-0"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {actions.find(a => a.id === modalType)?.label}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-text-secondary">
                  This action would open the {actions.find(a => a.id === modalType)?.label.toLowerCase()} workflow.
                </p>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="default"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActionToolbar;