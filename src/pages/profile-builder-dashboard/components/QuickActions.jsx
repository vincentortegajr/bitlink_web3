import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuickActions = ({ onAddComponent, isVisible, onClose }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [formData, setFormData] = useState({});

  const quickActions = [
    {
      id: 'add-link',
      title: 'Add Social Link',
      description: 'Quickly add a social media link',
      icon: 'Link',
      color: 'primary',
      fields: [
        { name: 'platform', label: 'Platform', type: 'select', options: [
          { value: 'twitter', label: 'Twitter' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'youtube', label: 'YouTube' }
        ]},
        { name: 'url', label: 'URL', type: 'url', placeholder: 'https://...' },
        { name: 'title', label: 'Display Text', type: 'text', placeholder: 'Follow me on...' }
      ]
    },
    {
      id: 'add-payment',
      title: 'Payment Button',
      description: 'Accept crypto payments',
      icon: 'CreditCard',
      color: 'success',
      fields: [
        { name: 'type', label: 'Payment Type', type: 'select', options: [
          { value: 'payment-button', label: 'One-time Payment' },
          { value: 'donation-button', label: 'Donation' },
          { value: 'tip-jar', label: 'Tip Jar' }
        ]},
        { name: 'title', label: 'Button Text', type: 'text', placeholder: 'Pay with Crypto' },
        { name: 'amount', label: 'Amount (optional)', type: 'number', placeholder: '0.01' },
        { name: 'currency', label: 'Currency', type: 'select', options: [
          { value: 'ETH', label: 'Ethereum (ETH)' },
          { value: 'USDC', label: 'USD Coin (USDC)' }
        ]}
      ]
    },
    {
      id: 'add-lead-form',
      title: 'Lead Capture',
      description: 'Collect email subscribers',
      icon: 'Mail',
      color: 'accent',
      fields: [
        { name: 'type', label: 'Form Type', type: 'select', options: [
          { value: 'email-signup', label: 'Email Signup' },
          { value: 'lead-magnet', label: 'Lead Magnet' },
          { value: 'waitlist-signup', label: 'Waitlist' }
        ]},
        { name: 'title', label: 'Form Title', type: 'text', placeholder: 'Join Newsletter' },
        { name: 'description', label: 'Description', type: 'text', placeholder: 'Get exclusive updates' },
        { name: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Subscribe' }
      ]
    },
    {
      id: 'upload-content',
      title: 'Upload Content',
      description: 'Share ebooks and media',
      icon: 'Upload',
      color: 'warning',
      fields: [
        { name: 'type', label: 'Content Type', type: 'select', options: [
          { value: 'ebook-download', label: 'Ebook Download' },
          { value: 'video-embed', label: 'Video Embed' },
          { value: 'image-gallery', label: 'Image Gallery' }
        ]},
        { name: 'title', label: 'Content Title', type: 'text', placeholder: 'Free Guide' },
        { name: 'description', label: 'Description', type: 'text', placeholder: 'Learn about...' }
      ]
    }
  ];

  const handleActionClick = (action) => {
    setActiveAction(action);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!activeAction) return;

    const componentData = {
      id: `${activeAction.id}-${Date.now()}`,
      type: formData.type || activeAction.id.replace('add-', '') + '-button',
      name: activeAction.title,
      icon: activeAction.icon,
      ...formData
    };

    onAddComponent(componentData);
    setActiveAction(null);
    setFormData({});
    onClose?.();
  };

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      accent: 'bg-accent/10 text-accent border-accent/20',
      warning: 'bg-warning/10 text-warning border-warning/20'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <>
      {/* Desktop Floating Actions */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <div className="flex flex-col space-y-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`p-3 rounded-full border shadow-medium transition-smooth hover:scale-110 glass-button liquid-glass-hover ${getColorClasses(action.color)}`}
              title={action.title}
            >
              <Icon name={action.icon} size={20} />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Quick Actions */}
      {isVisible && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full glass-panel rounded-t-lg max-h-[80vh] flex flex-col animate-fade-in">
            <div className="p-4 border-b border-white/20 glass-morphism">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary glass-text-readable">Quick Actions</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-md transition-smooth glass-button liquid-glass-hover"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 liquid-glass-light">
              {!activeAction ? (
                <div className="grid grid-cols-1 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="p-4 border border-white/20 rounded-lg text-left hover:border-primary/50 transition-smooth glass-card liquid-glass-hover"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-md border glass-button ${getColorClasses(action.color)}`}>
                          <Icon name={action.icon} size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary glass-text-readable">{action.title}</h3>
                          <p className="text-sm text-text-secondary mt-1 glass-text-overlay">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveAction(null)}
                      className="p-2 hover:bg-muted rounded-md transition-smooth glass-button liquid-glass-hover"
                    >
                      <Icon name="ArrowLeft" size={16} />
                    </button>
                    <h3 className="text-lg font-medium text-text-primary glass-text-readable">{activeAction.title}</h3>
                  </div>

                  <div className="space-y-4">
                    {activeAction.fields.map((field) => (
                      <div key={field.name}>
                        {field.type === 'select' ? (
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2 glass-text-readable">
                              {field.label}
                            </label>
                            <select
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="w-full px-3 py-2 border border-white/20 rounded-md glass-morphism text-text-primary glass-text-readable"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <Input
                            label={field.label}
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            className="glass-morphism glass-text-readable"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="default"
                      onClick={handleSubmit}
                      className="flex-1 glass-button liquid-glass-hover"
                    >
                      Add Component
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveAction(null)}
                      className="flex-1 glass-button liquid-glass-hover"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Modal */}
      {activeAction && (
        <div className="hidden lg:block fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-lg shadow-prominent max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary glass-text-readable">{activeAction.title}</h3>
                <button
                  onClick={() => setActiveAction(null)}
                  className="p-2 hover:bg-muted rounded-md transition-smooth glass-button liquid-glass-hover"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {activeAction.fields.map((field) => (
                  <div key={field.name}>
                    {field.type === 'select' ? (
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 glass-text-readable">
                          {field.label}
                        </label>
                        <select
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full px-3 py-2 border border-white/20 rounded-md glass-morphism text-text-primary glass-text-readable"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <Input
                        label={field.label}
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="glass-morphism glass-text-readable"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  className="flex-1 glass-button liquid-glass-hover"
                >
                  Add Component
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveAction(null)}
                  className="flex-1 glass-button liquid-glass-hover"
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

export default QuickActions;