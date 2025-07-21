import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopToolbar = ({ 
  viewMode, 
  onViewModeChange, 
  onSave, 
  onPublish, 
  isPublished, 
  isSaving,
  onPreview,
  onShare 
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShare = (platform) => {
    const profileUrl = `https://bitlink.web3/${localStorage.getItem('username') || 'demo'}`;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(profileUrl);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=Check out my Web3 profile&url=${profileUrl}`);
        break;
      case 'qr': onShare('qr', profileUrl);
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-glass border-b border-border">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('mobile')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  viewMode === 'mobile' ?'bg-surface text-text-primary shadow-subtle' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name="Smartphone" size={16} />
                <span className="hidden sm:inline">Mobile</span>
              </button>
              <button
                onClick={() => onViewModeChange('desktop')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  viewMode === 'desktop' ?'bg-surface text-text-primary shadow-subtle' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name="Monitor" size={16} />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>
          </div>

          {/* Center Section - Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <span className="text-sm text-warning">Saving...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-success">Saved</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPublished ? 'bg-success' : 'bg-warning'}`}></div>
              <span className={`text-sm ${isPublished ? 'text-success' : 'text-warning'}`}>
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              iconName="Eye"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Preview
            </Button>

            {/* Mobile Preview Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onPreview}
              className="sm:hidden"
            >
              <Icon name="Eye" size={16} />
            </Button>

            {/* Share Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
                iconName="Share"
                iconPosition="left"
                className="hidden sm:flex"
              >
                Share
              </Button>

              {/* Mobile Share Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="sm:hidden"
              >
                <Icon name="Share" size={16} />
              </Button>

              {/* Share Dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-prominent z-50 animate-scale-in">
                  <div className="p-2">
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-text-primary hover:bg-muted rounded-md transition-smooth"
                    >
                      <Icon name="Copy" size={16} />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-text-primary hover:bg-muted rounded-md transition-smooth"
                    >
                      <Icon name="Twitter" size={16} />
                      <span>Share on Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('qr')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-text-primary hover:bg-muted rounded-md transition-smooth"
                    >
                      <Icon name="QrCode" size={16} />
                      <span>QR Code</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Save
            </Button>

            {/* Publish/Unpublish Button */}
            <Button
              variant={isPublished ? "outline" : "default"}
              size="sm"
              onClick={onPublish}
              iconName={isPublished ? "EyeOff" : "Globe"}
              iconPosition="left"
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="md:hidden flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <span className="text-xs text-warning">Saving...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success">Saved</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPublished ? 'bg-success' : 'bg-warning'}`}></div>
              <span className={`text-xs ${isPublished ? 'text-success' : 'text-warning'}`}>
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;