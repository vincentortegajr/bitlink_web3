import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const CommunitySharing = ({
  audio,
  onShare,
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [sharedSuccessfully, setSharedSuccessfully] = useState(false);

  const popularTags = [
    'voiceover', 'storytelling', 'educational', 'podcast', 'audiobook',
    'meditation', 'announcement', 'commercial', 'demo', 'tutorial'
  ];

  const handleTagToggle = (tag) => {
    const currentTags = settings?.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onSettingsChange?.({ ...settings, tags: newTags });
  };

  const handleShare = async () => {
    if (!audio || !settings?.title?.trim()) return;

    setIsSharing(true);
    
    try {
      // Simulate API call to share audio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const shareData = {
        audioId: audio.id,
        title: settings.title.trim(),
        description: settings.description?.trim() || '',
        tags: settings.tags || [],
        isPublic: settings.isPublic,
        voice: audio.voice?.name || 'Default',
        duration: audio.duration,
        createdAt: new Date().toISOString()
      };
      
      onShare?.(shareData);
      setSharedSuccessfully(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => setSharedSuccessfully(false), 3000);
      
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-1">
          <Icon name="Users" size={18} />
          Community Sharing
        </h3>
        <p className="text-sm text-text-secondary">
          {audio ? 'Share your creation with the community' : 'Generate audio to enable sharing'}
        </p>
      </div>

      {audio && (
        <>
          {/* Privacy Toggle */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon 
                  name={settings?.isPublic ? "Globe" : "Lock"} 
                  size={16} 
                  className={settings?.isPublic ? "text-primary" : "text-text-secondary"} 
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">
                    {settings?.isPublic ? 'Public' : 'Private'}
                  </span>
                  <p className="text-xs text-text-secondary">
                    {settings?.isPublic 
                      ? 'Visible to all community members' :'Only visible to you'
                    }
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onSettingsChange?.({ ...settings, isPublic: !settings?.isPublic })}
                disabled={disabled}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  settings?.isPublic ? "bg-primary" : "bg-muted",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    settings?.isPublic ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Title *</label>
            <Input
              placeholder="Give your audio creation a title..."
              value={settings?.title || ''}
              onChange={(e) => onSettingsChange?.({ ...settings, title: e.target.value })}
              disabled={disabled}
              maxLength={100}
            />
            <p className="text-xs text-text-secondary">
              {(settings?.title || '').length}/100 characters
            </p>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              placeholder="Describe your audio creation, how you made it, or what inspired you..."
              value={settings?.description || ''}
              onChange={(e) => onSettingsChange?.({ ...settings, description: e.target.value })}
              disabled={disabled}
              maxLength={500}
              rows={3}
              className={cn(
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              )}
            />
            <p className="text-xs text-text-secondary">
              {(settings?.description || '').length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Tags</label>
            
            {/* Popular Tags */}
            <div>
              <p className="text-xs text-text-secondary mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    disabled={disabled}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                      (settings?.tags || []).includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-text-secondary hover:text-text-primary hover:bg-muted/70",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Tags */}
            {settings?.tags && settings.tags.length > 0 && (
              <div>
                <p className="text-xs text-text-secondary mb-2">Selected tags ({settings.tags.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {settings.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleTagToggle(tag)}
                        disabled={disabled}
                        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                      >
                        <Icon name="X" size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Preview */}
          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Volume2" size={14} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">Audio Preview</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Duration:</span>
                <span className="font-medium">{audio.duration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Voice:</span>
                <span className="font-medium">{audio.voice?.name || 'Default'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Quality:</span>
                <span className="font-medium">{audio.settings?.quality || 'High'}</span>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary mb-1">Community Guidelines</p>
                <ul className="text-xs text-text-secondary space-y-0.5">
                  <li>• Keep content appropriate and respectful</li>
                  <li>• Add descriptive titles and tags</li>
                  <li>• Credit sources if using existing text</li>
                  <li>• Report inappropriate content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={disabled || !settings?.title?.trim() || isSharing}
            loading={isSharing}
            iconName={sharedSuccessfully ? "Check" : "Share"}
            iconPosition="left"
            variant={sharedSuccessfully ? "success" : "default"}
            className="w-full"
          >
            {isSharing 
              ? 'Sharing...' 
              : sharedSuccessfully 
              ? 'Shared Successfully!' 
              : settings?.isPublic 
              ? 'Share with Community' :'Save Privately'
            }
          </Button>

          {/* Success Message */}
          {sharedSuccessfully && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={16} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-success">
                    {settings?.isPublic ? 'Shared with community!' : 'Saved privately!'}
                  </p>
                  <p className="text-xs text-success/80">
                    {settings?.isPublic 
                      ? 'Your audio is now visible to other community members' :'Your audio is saved in your private collection'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-card rounded-lg border">
            <div className="text-center">
              <p className="text-sm font-semibold text-text-primary">1.2k</p>
              <p className="text-xs text-text-secondary">Community</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-text-primary">856</p>
              <p className="text-xs text-text-secondary">Shared Today</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-text-primary">24k</p>
              <p className="text-xs text-text-secondary">Total Creations</p>
            </div>
          </div>
        </>
      )}

      {/* No Audio State */}
      {!audio && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-text-secondary text-sm">
            Generate audio first to share with the community
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunitySharing;