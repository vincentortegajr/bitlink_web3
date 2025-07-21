import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const RealismCommunitySharing = ({
  originalImage,
  realisticImage,
  onShare,
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [sharedSuccessfully, setSharedSuccessfully] = useState(false);

  const popularTags = [
    'cartoon-to-realistic', 'skin-transformation', 'ai-realism', 'digital-art',
    'character-design', 'portrait', 'face-enhancement', 'realistic-skin',
    'transformation', 'before-after', 'ai-generated', 'photo-realistic'
  ];

  const transformationCategories = [
    { id: 'anime', name: 'Anime → Realistic', icon: 'Sparkles' },
    { id: 'cartoon', name: 'Cartoon → Realistic', icon: 'Palette' },
    { id: 'digital-art', name: 'Digital Art → Photo', icon: 'Brush' },
    { id: 'character', name: 'Character Design', icon: 'User' },
    { id: 'portrait', name: 'Portrait Enhancement', icon: 'UserCircle' }
  ];

  const handleTagToggle = (tag) => {
    const currentTags = settings?.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onSettingsChange?.({ ...settings, tags: newTags });
  };

  const handleCategorySelect = (categoryId) => {
    onSettingsChange?.({ ...settings, category: categoryId });
  };

  const handleShare = async () => {
    if (!realisticImage || !settings?.title?.trim()) return;

    setIsSharing(true);
    
    try {
      // Simulate API call to share transformation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const shareData = {
        transformationId: `realism-${Date.now()}`,
        title: settings.title.trim(),
        description: settings.description?.trim() || '',
        tags: settings.tags || [],
        category: settings.category || 'cartoon',
        isPublic: settings.isPublic,
        originalImage: {
          url: originalImage?.url,
          name: originalImage?.name,
          dimensions: `${originalImage?.width}×${originalImage?.height}`
        },
        realisticImage: {
          url: realisticImage?.url,
          dimensions: realisticImage?.enhancedSize,
          processingTime: realisticImage?.processingTime,
          settings: realisticImage?.settings
        },
        metadata: {
          realismLevel: realisticImage?.settings?.realismLevel,
          skinSmoothing: realisticImage?.settings?.skinSmoothing,
          faceEnhancement: realisticImage?.settings?.faceEnhancement,
          modelVersion: 'RealismGAN v2.1'
        },
        createdAt: new Date().toISOString()
      };
      
      onShare?.(shareData);
      setSharedSuccessfully(true);
      
      // Reset success state after 4 seconds
      setTimeout(() => setSharedSuccessfully(false), 4000);
      
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const hasValidContent = originalImage && realisticImage;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-1">
          <Icon name="Users" size={18} className="text-pink-500" />
          Community Sharing
        </h3>
        <p className="text-sm text-text-secondary">
          {hasValidContent 
            ? 'Share your cartoon-to-realistic transformation with the community' 
            : 'Complete a transformation to enable community sharing'
          }
        </p>
      </div>

      {hasValidContent && (
        <>
          {/* Privacy Toggle */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon 
                  name={settings?.isPublic ? "Globe" : "Lock"} 
                  size={18} 
                  className={settings?.isPublic ? "text-pink-500" : "text-text-secondary"} 
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">
                    {settings?.isPublic ? 'Public Sharing' : 'Private Collection'}
                  </span>
                  <p className="text-xs text-text-secondary">
                    {settings?.isPublic 
                      ? 'Your transformation will be visible to all community members' 
                      : 'Only visible in your private gallery'
                    }
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onSettingsChange?.({ ...settings, isPublic: !settings?.isPublic })}
                disabled={disabled}
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                  settings?.isPublic ? "bg-gradient-to-r from-pink-500 to-rose-500" : "bg-muted",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                    settings?.isPublic ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Transformation Preview */}
          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="ArrowLeftRight" size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">Transformation Preview</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <img
                  src={originalImage?.url}
                  alt="Original"
                  className="w-full h-24 object-cover rounded-md border"
                />
                <p className="text-xs text-text-secondary mt-1 text-center">Before (Cartoon)</p>
              </div>
              <div>
                <img
                  src={realisticImage?.url}
                  alt="Realistic"
                  className="w-full h-24 object-cover rounded-md border"
                />
                <p className="text-xs text-text-secondary mt-1 text-center">After (Realistic)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 text-xs text-text-secondary">
              <div>
                <span className="font-medium">Processing:</span> {Math.round(realisticImage?.processingTime || 0)}s
              </div>
              <div>
                <span className="font-medium">Quality:</span> {realisticImage?.settings?.realismLevel?.toUpperCase() || 'HIGH'}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Transformation Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {transformationCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={disabled}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                    settings?.category === category.id
                      ? "border-pink-500 bg-pink-50 text-pink-700" :"border-border hover:border-pink-300 text-text-secondary hover:bg-pink-50/30",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon name={category.icon} size={16} />
                  <span className="text-sm font-medium">{category.name}</span>
                  {settings?.category === category.id && (
                    <Icon name="Check" size={14} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Title *</label>
            <Input
              placeholder="Describe your transformation (e.g., 'Anime character to photorealistic portrait')"
              value={settings?.title || ''}
              onChange={(e) => onSettingsChange?.({ ...settings, title: e.target.value })}
              disabled={disabled}
              maxLength={120}
              className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
            />
            <p className="text-xs text-text-secondary">
              {(settings?.title || '').length}/120 characters
            </p>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              placeholder="Share details about your transformation: original source, techniques used, challenges faced, or what inspired you..."
              value={settings?.description || ''}
              onChange={(e) => onSettingsChange?.({ ...settings, description: e.target.value })}
              disabled={disabled}
              maxLength={750}
              rows={4}
              className={cn(
                "flex w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm ring-offset-background",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
                "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              )}
            />
            <p className="text-xs text-text-secondary">
              {(settings?.description || '').length}/750 characters
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Tags</label>
            
            {/* Popular Tags */}
            <div>
              <p className="text-xs text-text-secondary mb-2">Popular transformation tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    disabled={disabled}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                      (settings?.tags || []).includes(tag)
                        ? "border-pink-500 bg-pink-50 text-pink-700" :"border-border text-text-secondary hover:text-text-primary hover:border-pink-300 hover:bg-pink-50/30",
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
                <p className="text-xs text-text-secondary mb-2">
                  Selected tags ({settings.tags.length}/8):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {settings.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-xs font-medium border border-pink-200"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleTagToggle(tag)}
                        disabled={disabled}
                        className="hover:bg-pink-200 rounded-full p-0.5 transition-colors"
                      >
                        <Icon name="X" size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Technical Details */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Settings" size={14} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">Transformation Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Realism Level:</span>
                  <span className="font-medium">{realisticImage?.settings?.realismLevel?.toUpperCase() || 'HIGH'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Skin Smoothing:</span>
                  <span className="font-medium">{realisticImage?.settings?.skinSmoothing?.toUpperCase() || 'BALANCED'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Face Enhancement:</span>
                  <span className="font-medium">{realisticImage?.settings?.faceEnhancement?.toUpperCase() || 'SUBTLE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">AI Model:</span>
                  <span className="font-medium">RealismGAN v2.1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-2">Community Guidelines</p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Share original work or properly credit sources</li>
                  <li>• Keep content appropriate and respectful</li>
                  <li>• Use descriptive titles and relevant tags</li>
                  <li>• Report inappropriate transformations</li>
                  <li>• Respect others' creative work and feedback</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={disabled || !settings?.title?.trim() || isSharing}
            loading={isSharing}
            iconName={sharedSuccessfully ? "CheckCircle" : "Share"}
            iconPosition="left"
            variant={sharedSuccessfully ? "default" : "default"}
            className={cn(
              "w-full",
              sharedSuccessfully 
                ? "bg-green-500 hover:bg-green-600" :"bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            )}
          >
            {isSharing 
              ? 'Sharing transformation...' 
              : sharedSuccessfully 
              ? 'Shared Successfully!' 
              : settings?.isPublic 
              ? 'Share with Community' :'Save to Private Collection'
            }
          </Button>

          {/* Success Message */}
          {sharedSuccessfully && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Icon name="CheckCircle" size={18} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {settings?.isPublic ? 'Transformation shared with community!' : 'Transformation saved to your collection!'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {settings?.isPublic 
                      ? 'Your cartoon-to-realistic transformation is now visible to community members and can inspire others' 
                      : 'Your transformation is safely stored in your private gallery'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
            <div className="text-center">
              <p className="text-lg font-bold text-pink-600">2.8k</p>
              <p className="text-xs text-text-secondary">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-rose-600">1.2k</p>
              <p className="text-xs text-text-secondary">Shared Today</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-pink-600">45k</p>
              <p className="text-xs text-text-secondary">Transformations</p>
            </div>
          </div>
        </>
      )}

      {/* No Content State */}
      {!hasValidContent && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center">
            <Icon name="Users" size={28} className="text-pink-500" />
          </div>
          <h4 className="font-medium text-text-primary mb-2">Complete a Transformation First</h4>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Upload a cartoon or digital art image and transform it to realistic skin to enable community sharing features.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mt-6 text-xs text-text-secondary">
            <div className="flex items-center gap-1 justify-center">
              <Icon name="Upload" size={12} />
              <span>Upload Image</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <Icon name="Sparkles" size={12} />
              <span>Transform</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealismCommunitySharing;