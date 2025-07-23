import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { PROFILE_THEMES } from '../../../utils/themes';

const TopToolbar = ({ 
  viewMode, 
  onViewModeChange, 
  onSave, 
  onPublish, 
  isPublished, 
  isSaving,
  onPreview,
  onShare,
  selectedTheme = 'pink',
  onThemeChange
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

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

  const handleThemeSelect = (themeKey) => {
    onThemeChange(themeKey);
    setShowThemeMenu(false);
  };

  return (
    <div className="sticky top-16 z-30 bg-surface/98 backdrop-blur-glass border-2 border-border/60 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="px-3 lg:px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Enhanced Left Section - View Mode Toggle + Theme Selector */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-muted/80 rounded-xl p-1 border border-border/40 shadow-sm">
              <button
                onClick={() => onViewModeChange('mobile')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:shadow-md ${
                  viewMode === 'mobile' ?'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25' :'text-text-secondary hover:text-text-primary hover:bg-surface/80 hover:shadow-sm'
                }`}
              >
                <Icon name="Smartphone" size={16} />
                <span className="hidden sm:inline text-xs">Mobile</span>
              </button>
              <button
                onClick={() => onViewModeChange('desktop')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:shadow-md ${
                  viewMode === 'desktop' ?'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25' :'text-text-secondary hover:text-text-primary hover:bg-surface/80 hover:shadow-sm'
                }`}
              >
                <Icon name="Monitor" size={16} />
                <span className="hidden sm:inline text-xs">Desktop</span>
              </button>
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                iconName={PROFILE_THEMES[selectedTheme]?.icon || 'Palette'}
                iconPosition="left"
                className="hidden sm:flex hover:shadow-lg hover:shadow-accent/20"
              >
                <span className="text-xs font-semibold">Theme</span>
              </Button>

              {/* Mobile Theme Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="sm:hidden hover:shadow-lg hover:shadow-accent/20"
              >
                <Icon name={PROFILE_THEMES[selectedTheme]?.icon || 'Palette'} size={16} />
              </Button>

              {/* Theme Dropdown */}
              {showThemeMenu && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-surface/98 backdrop-blur-glass border-2 border-border/60 rounded-xl shadow-2xl z-50 animate-scale-in overflow-hidden">
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-text-primary mb-3 px-1">Profile Themes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PROFILE_THEMES).map(([key, theme]) => (
                        <button
                          key={key}
                          onClick={() => handleThemeSelect(key)}
                          className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200 hover:shadow-lg group ${
                            selectedTheme === key
                              ? 'bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/60 shadow-lg'
                              : 'bg-gradient-to-br from-muted/30 to-muted/20 hover:from-muted/50 hover:to-muted/30 border-2 border-border/40 hover:border-primary/40'
                          }`}
                        >
                          <div className={`w-8 h-8 bg-gradient-to-br ${theme.background} rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200 flex items-center justify-center`}>
                            <Icon name={theme.icon} size={16} className="text-white drop-shadow-sm" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-semibold text-text-primary leading-tight">{theme.name}</div>
                            <div className="text-xs text-text-secondary mt-0.5">{theme.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Center Section - Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-surface to-surface/80 rounded-lg border border-border/40 shadow-sm">
              {isSaving ? (
                <>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-warning to-warning/80 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-xs text-warning font-bold">Saving...</span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-success to-success/80 rounded-full shadow-sm"></div>
                  <span className="text-xs text-success font-bold">Saved</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-surface to-surface/80 rounded-lg border border-border/40 shadow-sm">
              <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                isPublished 
                  ? 'bg-gradient-to-r from-success to-success/80' :'bg-gradient-to-r from-warning to-warning/80'
              }`}></div>
              <span className={`text-xs font-bold ${isPublished ? 'text-success' : 'text-warning'}`}>
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          {/* Enhanced Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Enhanced Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              iconName="Eye"
              iconPosition="left"
              className="hidden sm:flex hover:shadow-lg hover:shadow-accent/20"
            >
              <span className="text-xs font-semibold">Preview</span>
            </Button>

            {/* Enhanced Mobile Preview Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onPreview}
              className="sm:hidden hover:shadow-lg hover:shadow-accent/20"
            >
              <Icon name="Eye" size={16} />
            </Button>

            {/* Enhanced Share Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
                iconName="Share"
                iconPosition="left"
                className="hidden sm:flex hover:shadow-lg hover:shadow-primary/20"
              >
                <span className="text-xs font-semibold">Share</span>
              </Button>

              {/* Enhanced Mobile Share Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="sm:hidden hover:shadow-lg hover:shadow-primary/20"
              >
                <Icon name="Share" size={16} />
              </Button>

              {/* Enhanced Share Dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface/98 backdrop-blur-glass border-2 border-border/60 rounded-xl shadow-2xl z-50 animate-scale-in overflow-hidden">
                  <div className="p-2">
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-text-primary hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 rounded-lg transition-all duration-200 hover:shadow-md group"
                    >
                      <Icon name="Copy" size={16} className="group-hover:text-primary transition-colors duration-200" />
                      <span className="text-xs font-semibold">Copy Link</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-text-primary hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 rounded-lg transition-all duration-200 hover:shadow-md group"
                    >
                      <Icon name="Twitter" size={16} className="group-hover:text-blue-500 transition-colors duration-200" />
                      <span className="text-xs font-semibold">Share on Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('qr')}
                      className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-text-primary hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 rounded-lg transition-all duration-200 hover:shadow-md group"
                    >
                      <Icon name="QrCode" size={16} className="group-hover:text-accent transition-colors duration-200" />
                      <span className="text-xs font-semibold">QR Code</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Save Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              className="hidden sm:flex hover:shadow-lg hover:shadow-success/20"
            >
              <span className="text-xs font-semibold">Save</span>
            </Button>

            {/* Enhanced Publish/Unpublish Button */}
            <Button
              variant={isPublished ? "outline" : "default"}
              size="sm"
              onClick={onPublish}
              iconName={isPublished ? "EyeOff" : "Globe"}
              iconPosition="left"
              className="hover:shadow-lg hover:shadow-primary/25"
            >
              <span className="text-xs font-semibold">{isPublished ? 'Unpublish' : 'Publish'}</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Status Bar */}
        <div className="md:hidden flex items-center justify-between mt-2.5 pt-2.5 border-t-2 border-border/40">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-2.5 py-1 bg-gradient-to-r from-surface to-surface/80 rounded-lg border border-border/40 shadow-sm">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-gradient-to-r from-warning to-warning/80 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-xs text-warning font-bold">Saving...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gradient-to-r from-success to-success/80 rounded-full shadow-sm"></div>
                  <span className="text-xs text-success font-bold">Saved</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2 px-2.5 py-1 bg-gradient-to-r from-surface to-surface/80 rounded-lg border border-border/40 shadow-sm">
              <div className={`w-2 h-2 rounded-full shadow-sm ${
                isPublished 
                  ? 'bg-gradient-to-r from-success to-success/80' :'bg-gradient-to-r from-warning to-warning/80'
              }`}></div>
              <span className={`text-xs font-bold ${isPublished ? 'text-success' : 'text-warning'}`}>
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
            className="hover:shadow-md hover:shadow-success/20"
          >
            <span className="text-xs font-semibold">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;