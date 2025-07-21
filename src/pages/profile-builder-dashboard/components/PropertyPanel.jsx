import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PropertyPanel = ({ selectedComponent, onUpdateComponent, onClose, isVisible }) => {
  if (!selectedComponent) {
    return (
      <div className={`${isVisible ? 'block' : 'hidden'} lg:block w-80 bg-surface border-l border-border h-full p-6`}>
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Icon name="Settings" size={24} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary">No Component Selected</h3>
            <p className="text-text-secondary">Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    onUpdateComponent(selectedComponent.id, { [field]: value });
  };

  const renderSocialLinkProperties = () => (
    <div className="space-y-4">
      <Input
        label="Link Title"
        type="text"
        value={selectedComponent.title || ''}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="Enter link title"
      />
      <Input
        label="URL"
        type="url"
        value={selectedComponent.url || ''}
        onChange={(e) => handleInputChange('url', e.target.value)}
        placeholder="https://..."
      />
      <Select
        label="Link Style"
        options={[
          { value: 'default', label: 'Default' },
          { value: 'filled', label: 'Filled' },
          { value: 'outline', label: 'Outline' }
        ]}
        value={selectedComponent.style || 'default'}
        onChange={(value) => handleInputChange('style', value)}
      />
    </div>
  );

  const renderPaymentProperties = () => (
    <div className="space-y-4">
      <Input
        label="Button Text"
        type="text"
        value={selectedComponent.title || ''}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="Pay with Crypto"
      />
      <Input
        label="Amount"
        type="number"
        value={selectedComponent.amount || ''}
        onChange={(e) => handleInputChange('amount', e.target.value)}
        placeholder="0.01"
        description="Leave empty for custom amount"
      />
      <Select
        label="Currency"
        options={[
          { value: 'ETH', label: 'Ethereum (ETH)' },
          { value: 'USDC', label: 'USD Coin (USDC)' },
          { value: 'BASE', label: 'Base Token' }
        ]}
        value={selectedComponent.currency || 'ETH'}
        onChange={(value) => handleInputChange('currency', value)}
      />
      <Input
        label="Wallet Address"
        type="text"
        value={selectedComponent.walletAddress || ''}
        onChange={(e) => handleInputChange('walletAddress', e.target.value)}
        placeholder="0x..."
        description="Your receiving wallet address"
      />
    </div>
  );

  const renderLeadGenProperties = () => (
    <div className="space-y-4">
      <Input
        label="Form Title"
        type="text"
        value={selectedComponent.title || ''}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="Join Newsletter"
      />
      <Input
        label="Description"
        type="text"
        value={selectedComponent.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Get updates and exclusive content"
      />
      <Input
        label="Button Text"
        type="text"
        value={selectedComponent.buttonText || ''}
        onChange={(e) => handleInputChange('buttonText', e.target.value)}
        placeholder="Subscribe"
      />
      <Input
        label="Success Message"
        type="text"
        value={selectedComponent.successMessage || ''}
        onChange={(e) => handleInputChange('successMessage', e.target.value)}
        placeholder="Thanks for subscribing!"
      />
    </div>
  );

  const renderContentProperties = () => (
    <div className="space-y-4">
      <Input
        label="Title"
        type="text"
        value={selectedComponent.title || ''}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="Content title"
      />
      <Input
        label="Description"
        type="text"
        value={selectedComponent.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Content description"
      />
      {selectedComponent.type === 'ebook-download' && (
        <Input
          label="Download URL"
          type="url"
          value={selectedComponent.downloadUrl || ''}
          onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
          placeholder="https://..."
        />
      )}
      {selectedComponent.type === 'video-embed' && (
        <Input
          label="Video URL"
          type="url"
          value={selectedComponent.videoUrl || ''}
          onChange={(e) => handleInputChange('videoUrl', e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      )}
    </div>
  );

  const renderProperties = () => {
    const socialTypes = ['twitter-link', 'instagram-link', 'linkedin-link', 'youtube-link', 'discord-link'];
    const paymentTypes = ['payment-button', 'donation-button', 'subscription-button', 'tip-jar'];
    const leadTypes = ['email-signup', 'contact-form', 'lead-magnet', 'waitlist-signup'];
    const contentTypes = ['ebook-download', 'text-block', 'video-embed', 'image-gallery'];

    if (socialTypes.includes(selectedComponent.type)) {
      return renderSocialLinkProperties();
    } else if (paymentTypes.includes(selectedComponent.type)) {
      return renderPaymentProperties();
    } else if (leadTypes.includes(selectedComponent.type)) {
      return renderLeadGenProperties();
    } else if (contentTypes.includes(selectedComponent.type)) {
      return renderContentProperties();
    }
    return null;
  };

  const getComponentIcon = () => {
    return selectedComponent.icon || 'Settings';
  };

  return (
    <>
      {/* Desktop Panel */}
      <div className="hidden lg:block w-80 bg-surface border-l border-border h-full overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 text-primary rounded-md">
              <Icon name={getComponentIcon()} size={16} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{selectedComponent.name}</h2>
              <p className="text-sm text-text-secondary">Configure component</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {renderProperties()}
          
          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateComponent(selectedComponent.id, null, 'delete')}
              iconName="Trash2"
              iconPosition="left"
              className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              Delete Component
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isVisible && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-surface rounded-t-lg max-h-[80vh] flex flex-col animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-md">
                    <Icon name={getComponentIcon()} size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">{selectedComponent.name}</h2>
                    <p className="text-sm text-text-secondary">Configure component</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {renderProperties()}
              
              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onUpdateComponent(selectedComponent.id, null, 'delete');
                    onClose();
                  }}
                  iconName="Trash2"
                  iconPosition="left"
                  className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  Delete Component
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyPanel;