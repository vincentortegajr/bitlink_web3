import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfilePreview = ({ 
  profileData, 
  components, 
  selectedComponent, 
  onComponentSelect, 
  onComponentDelete,
  onDrop,
  onDragOver,
  viewMode 
}) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const componentHeight = 80; // Approximate height of each component
    const index = Math.floor(y / componentHeight);
    setDragOverIndex(index);
    onDragOver(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
    onDrop(e, dragOverIndex);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const renderComponent = (component, index) => {
    const isSelected = selectedComponent?.id === component.id;
    
    switch (component.type) {
      case 'twitter-link': case'instagram-link': case'linkedin-link': case'youtube-link': case'discord-link':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
              isSelected 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <Icon name={component.icon} size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-text-primary">{component.title || component.name}</h3>
                <p className="text-sm text-text-secondary">{component.url || component.preview}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1 text-text-secondary hover:text-destructive transition-smooth"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        );

      case 'payment-button': case'donation-button': case'subscription-button': case'tip-jar':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
              isSelected 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 text-success rounded-md">
                  <Icon name={component.icon} size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{component.title || component.name}</h3>
                  <p className="text-sm text-text-secondary">
                    {component.amount ? `${component.amount} ${component.currency || 'ETH'}` : 'Set amount'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1 text-text-secondary hover:text-destructive transition-smooth"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        );

      case 'email-signup': case'contact-form': case'lead-magnet': case'waitlist-signup':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
              isSelected 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 text-accent rounded-md">
                    <Icon name={component.icon} size={20} />
                  </div>
                  <h3 className="font-medium text-text-primary">{component.title || component.name}</h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentDelete(component.id);
                  }}
                  className="p-1 text-text-secondary hover:text-destructive transition-smooth"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  disabled
                />
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                  {component.buttonText || 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'ebook-download':
      case 'text-block': case'video-embed': case'image-gallery':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
              isSelected 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 text-warning rounded-md">
                  <Icon name={component.icon} size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{component.title || component.name}</h3>
                  <p className="text-sm text-text-secondary">{component.description || 'Click to configure'}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1 text-text-secondary hover:text-destructive transition-smooth"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const containerClass = viewMode === 'mobile' ?'w-full max-w-sm mx-auto' :'w-full max-w-2xl mx-auto';

  return (
    <div className={`${containerClass} bg-background border border-border rounded-lg overflow-hidden shadow-medium`}>
      {/* Profile Header */}
      <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Image
              src={profileData.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
              alt="Profile Avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-surface"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-surface flex items-center justify-center">
              <Icon name="Check" size={12} color="white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{profileData.name || 'Your Name'}</h1>
            <p className="text-text-secondary">{profileData.bio || 'Your bio goes here...'}</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success font-medium">Web3 Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Components Area */}
      <div
        className="p-4 min-h-96 space-y-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        {components.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Icon name="Plus" size={24} className="text-text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary">Start Building</h3>
              <p className="text-text-secondary">Drag components from the library to build your profile</p>
            </div>
          </div>
        ) : (
          <>
            {components.map((component, index) => (
              <React.Fragment key={component.id}>
                {dragOverIndex === index && (
                  <div className="h-2 bg-primary/20 rounded-full border-2 border-dashed border-primary"></div>
                )}
                {renderComponent(component, index)}
              </React.Fragment>
            ))}
            {dragOverIndex === components.length && (
              <div className="h-2 bg-primary/20 rounded-full border-2 border-dashed border-primary"></div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-muted/50 border-t border-border text-center">
        <p className="text-xs text-text-secondary">
          Powered by <span className="font-medium text-primary">BitLink Web3</span>
        </p>
      </div>
    </div>
  );
};

export default ProfilePreview;