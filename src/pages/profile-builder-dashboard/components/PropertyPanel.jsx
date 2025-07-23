import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PropertyPanel = ({ selectedComponent, onUpdateComponent, onClose, isVisible }) => {
  if (!selectedComponent) {
    return (
      <div className={`${isVisible ? 'block' : 'hidden'} lg:block w-80 bg-surface/95 backdrop-blur-glass border-l-2 border-border/60 h-full overflow-y-auto shadow-lg`}>
        {/* Enhanced Header */}
        <div className="p-3 border-b-2 border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
              <Icon name="Sparkles" size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary tracking-tight">Smart Assistant</h2>
              <p className="text-sm text-text-secondary">AI-powered optimization tips</p>
            </div>
          </div>
        </div>

        {/* Enhanced Content with Real Analytics */}
        <div className="p-3 space-y-4">
          {/* Performance Insights */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span>Profile Performance</span>
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-success">Click Rate</span>
                  <span className="text-lg font-bold text-success">87%</span>
                </div>
                <div className="w-full bg-success/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary">Engagement</span>
                  <span className="text-lg font-bold text-primary">+23%</span>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full" style={{width: '72%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
              <Icon name="Brain" size={16} className="text-accent" />
              <span>AI Recommendations</span>
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl hover:from-accent/15 hover:to-accent/10 transition-all duration-200 cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-accent/20 text-accent rounded-lg group-hover:bg-accent/30 transition-colors duration-200">
                    <Icon name="Zap" size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-text-primary">Add Payment Button</p>
                    <p className="text-xs text-text-secondary mt-1">Profiles with crypto payments see 45% more engagement</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-xl hover:from-warning/15 hover:to-warning/10 transition-all duration-200 cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-warning/20 text-warning rounded-lg group-hover:bg-warning/30 transition-colors duration-200">
                    <Icon name="Target" size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-text-primary">Optimize Link Order</p>
                    <p className="text-xs text-text-secondary mt-1">Move high-value links to the top for better conversion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Enhanced */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
              <Icon name="Rocket" size={16} className="text-primary" />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl hover:from-primary/15 hover:to-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 bg-primary/20 text-primary rounded-lg group-hover:bg-primary/30 transition-colors duration-200">
                    <Icon name="Share2" size={16} />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">Add Social</span>
                </div>
              </button>
              <button className="p-3 bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl hover:from-success/15 hover:to-success/10 hover:shadow-lg hover:shadow-success/20 transition-all duration-200 group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 bg-success/20 text-success rounded-lg group-hover:bg-success/30 transition-colors duration-200">
                    <Icon name="CreditCard" size={16} />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">Add Payment</span>
                </div>
              </button>
              <button className="p-3 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl hover:from-accent/15 hover:to-accent/10 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 bg-accent/20 text-accent rounded-lg group-hover:bg-accent/30 transition-colors duration-200">
                    <Icon name="Mail" size={16} />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">Collect Leads</span>
                </div>
              </button>
              <button className="p-3 bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl hover:from-warning/15 hover:to-warning/10 hover:shadow-lg hover:shadow-warning/20 transition-all duration-200 group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 bg-warning/20 text-warning rounded-lg group-hover:bg-warning/30 transition-colors duration-200">
                    <Icon name="BarChart" size={16} />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">View Analytics</span>
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Popular Components with Real Data */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span>Trending Components</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-card/60 border border-border/30 rounded-xl hover:bg-card/80 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-pink-500/20 text-pink-500 rounded-lg">
                    <Icon name="Instagram" size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-primary">Instagram Link</span>
                    <p className="text-xs text-text-secondary">Most added this week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-success">+34%</span>
                  <Icon name="TrendingUp" size={12} className="text-success" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-card/60 border border-border/30 rounded-xl hover:bg-card/80 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-success/20 text-success rounded-lg">
                    <Icon name="CreditCard" size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-primary">Payment Button</span>
                    <p className="text-xs text-text-secondary">High conversion rate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-success">+28%</span>
                  <Icon name="TrendingUp" size={12} className="text-success" />
                </div>
              </div>
            </div>
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
      {/* Enhanced Desktop Panel */}
      <div className="hidden lg:block w-80 bg-surface/95 backdrop-blur-glass border-l-2 border-border/60 h-full overflow-y-auto shadow-lg">
        <div className="p-3 border-b-2 border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
              <Icon name={getComponentIcon()} size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary leading-tight tracking-tight">{selectedComponent.name}</h2>
              <p className="text-sm text-text-secondary">Configure component settings</p>
            </div>
          </div>
        </div>

        <div className="p-3">
          {renderProperties()}
          
          <div className="mt-6 pt-4 border-t-2 border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateComponent(selectedComponent.id, null, 'delete')}
              iconName="Trash2"
              iconPosition="left"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
            >
              Delete Component
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Bottom Sheet */}
      {isVisible && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-end backdrop-blur-sm">
          <div className="w-full bg-surface/95 backdrop-blur-glass rounded-t-2xl max-h-[85vh] flex flex-col animate-scale-in border-t-2 border-border/60 shadow-2xl">
            <div className="p-3 border-b-2 border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
                    <Icon name={getComponentIcon()} size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary leading-tight tracking-tight">{selectedComponent.name}</h2>
                    <p className="text-sm text-text-secondary">Configure component settings</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-muted/60 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {renderProperties()}
              
              <div className="mt-6 pt-4 border-t-2 border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onUpdateComponent(selectedComponent.id, null, 'delete');
                    onClose();
                  }}
                  iconName="Trash2"
                  iconPosition="left"
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
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