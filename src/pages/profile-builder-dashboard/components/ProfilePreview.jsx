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
            className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
              isSelected 
                ? 'border-primary bg-primary/8 shadow-lg' : 'border-border/60 hover:border-primary/70 bg-card'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg shadow-sm">
                <Icon name={component.icon} size={18} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">{component.title || component.name}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{component.url || component.preview}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1.5 text-text-secondary hover:text-destructive transition-smooth rounded-md hover:bg-destructive/10"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          </div>
        );

      case 'payment-button': case'donation-button': case'subscription-button': case'tip-jar':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
              isSelected 
                ? 'border-primary bg-primary/8 shadow-lg' : 'border-border/60 hover:border-primary/70 bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 text-success rounded-lg shadow-sm">
                  <Icon name={component.icon} size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{component.title || component.name}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {component.amount ? `${component.amount} ${component.currency || 'ETH'}` : 'Set amount'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1.5 text-text-secondary hover:text-destructive transition-smooth rounded-md hover:bg-destructive/10"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          </div>
        );

      case 'email-signup': case'contact-form': case'lead-magnet': case'waitlist-signup':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
              isSelected 
                ? 'border-primary bg-primary/8 shadow-lg' : 'border-border/60 hover:border-primary/70 bg-card'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 text-accent rounded-lg shadow-sm">
                    <Icon name={component.icon} size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">{component.title || component.name}</h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentDelete(component.id);
                  }}
                  className="p-1.5 text-text-secondary hover:text-destructive transition-smooth rounded-md hover:bg-destructive/10"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-border rounded-md text-xs"
                  disabled
                />
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-md text-xs font-medium">
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
            className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
              isSelected 
                ? 'border-primary bg-primary/8 shadow-lg' : 'border-border/60 hover:border-primary/70 bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 text-warning rounded-lg shadow-sm">
                  <Icon name={component.icon} size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{component.title || component.name}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{component.description || 'Click to configure'}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1.5 text-text-secondary hover:text-destructive transition-smooth rounded-md hover:bg-destructive/10"
              >
                <Icon name="Trash2" size={14} />
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
    <div className={`${containerClass} bg-background border-2 border-border/60 rounded-xl overflow-hidden shadow-lg`}>
      {/* Profile Header */}
      <div className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-b-2 border-border/30">
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <Image
              src={profileData.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
              alt="Profile Avatar"
              className="w-18 h-18 rounded-full object-cover border-4 border-surface shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-surface flex items-center justify-center shadow-sm">
              <Icon name="Check" size={10} color="white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary mb-1">{profileData.name || 'Your Name'}</h1>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">{profileData.bio || 'Your bio goes here...'}</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success font-medium">Web3 Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Components Area */}
      <div
        className="p-4 min-h-96 space-y-3"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        {components.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 bg-muted/60 rounded-full flex items-center justify-center mx-auto border-2 border-border/30">
              <Icon name="Plus" size={22} className="text-text-secondary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Start Building</h3>
              <p className="text-sm text-text-secondary">Drag components from the library to build your profile</p>
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
      <div className="p-3 bg-muted/40 border-t-2 border-border/30 text-center">
        <p className="text-xs text-text-secondary">
          Powered by <span className="font-semibold text-primary">BitLink Web3</span>
        </p>
      </div>
    </div>
  );
};

export default ProfilePreview;