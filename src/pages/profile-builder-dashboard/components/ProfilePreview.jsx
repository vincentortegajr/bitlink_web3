import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { getTheme } from '../../../utils/themes';

const ProfilePreview = ({ 
  profileData, 
  components, 
  selectedComponent, 
  onComponentSelect, 
  onComponentDelete,
  onDrop,
  onDragOver,
  viewMode,
  selectedTheme = 'pink',
  onProfileUpdate
}) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedName, setEditedName] = useState(profileData?.name || '');
  const [editedBio, setEditedBio] = useState(profileData?.bio || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const fileInputRef = useRef(null);
  
  const theme = getTheme(selectedTheme);

  // Enhanced profile picture upload with better error handling
  const handleProfilePictureClick = () => {
    setUploadError('');
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enhanced validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > maxSize) {
      setUploadError('File must be smaller than 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imageUrl = event.target.result;
        onProfileUpdate?.({ avatar: imageUrl });
        setHasChanges(true);
        setUploadError('');
      } catch (error) {
        setUploadError('Failed to process image. Please try again.');
        console.error('Image processing error:', error);
      }
    };
    
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };

  // Enhanced name editing with validation
  const handleNameClick = () => {
    setIsEditingName(true);
    setEditedName(profileData?.name || '');
    setSaveError('');
  };

  const handleNameSave = () => {
    const trimmedName = editedName.trim();
    
    if (!trimmedName) {
      setSaveError('Name cannot be empty');
      return;
    }
    
    if (trimmedName.length > 50) {
      setSaveError('Name must be 50 characters or less');
      return;
    }
    
    if (trimmedName !== profileData?.name) {
      setHasChanges(true);
    }
    setIsEditingName(false);
    setSaveError('');
  };

  const handleNameCancel = () => {
    setEditedName(profileData?.name || '');
    setIsEditingName(false);
    setSaveError('');
  };

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleNameCancel();
    }
  };

  // Enhanced bio editing with validation
  const handleBioClick = () => {
    setIsEditingBio(true);
    setEditedBio(profileData?.bio || '');
    setSaveError('');
  };

  const handleBioSave = () => {
    const trimmedBio = editedBio.trim();
    
    if (trimmedBio.length > 150) {
      setSaveError('Bio must be 150 characters or less');
      return;
    }
    
    if (trimmedBio !== profileData?.bio) {
      setHasChanges(true);
    }
    setIsEditingBio(false);
    setSaveError('');
  };

  const handleBioCancel = () => {
    setEditedBio(profileData?.bio || '');
    setIsEditingBio(false);
    setSaveError('');
  };

  const handleBioKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBioSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleBioCancel();
    }
  };

  // Enhanced save with better error handling
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveError('');
    
    try {
      const updatedData = {
        ...profileData,
        name: editedName.trim() || profileData?.name,
        bio: editedBio.trim() || profileData?.bio
      };
      
      await onProfileUpdate?.(updatedData);
      setHasChanges(false);
      
      // Simulate save delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('Failed to save changes. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const componentHeight = 80;
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
            className={`p-2.5 border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl group transform hover:scale-[1.02] backdrop-blur-sm ${
              isSelected 
                ? `${theme.socialBorder} bg-gradient-to-br ${theme.socialBg} ${theme.socialShadow}` 
                : `border-white/20 hover:${theme.socialBorder} bg-gradient-to-br from-white/10 via-white/5 to-white/8 hover:from-white/15 hover:to-white/12`
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 bg-gradient-to-br ${theme.socialIcon} text-white rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <Icon name={component.icon} size={16} />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-white leading-tight tracking-tight drop-shadow-sm">{component.title || component.name}</h3>
                <p className="text-xs text-white/80 mt-0.5 drop-shadow-sm opacity-90">{component.url || component.preview}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1 text-white/70 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/20 hover:shadow-lg backdrop-blur-sm"
              >
                <Icon name="Trash2" size={12} />
              </button>
            </div>
          </div>
        );

      case 'payment-button': case'donation-button': case'subscription-button': case'tip-jar':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-2.5 border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl group transform hover:scale-[1.02] backdrop-blur-sm ${
              isSelected 
                ? 'border-green-400/60 bg-gradient-to-br from-green-500/15 via-emerald-400/10 to-teal-500/15 shadow-green-500/30' 
                : 'border-white/20 hover:border-green-400/50 bg-gradient-to-br from-white/10 via-white/5 to-green-100/10 hover:from-white/15 hover:to-green-100/15'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-gradient-to-br from-green-500/20 via-emerald-400/15 to-teal-500/20 text-white rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Icon name={component.icon} size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white leading-tight tracking-tight drop-shadow-sm">{component.title || component.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5 drop-shadow-sm opacity-90">
                    {component.amount ? `${component.amount} ${component.currency || 'ETH'}` : 'Set amount'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1 text-white/70 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/20 hover:shadow-lg backdrop-blur-sm"
              >
                <Icon name="Trash2" size={12} />
              </button>
            </div>
          </div>
        );

      case 'email-signup': case'contact-form': case'lead-magnet': case'waitlist-signup':
        return (
          <div
            key={component.id}
            onClick={() => onComponentSelect(component)}
            className={`p-2.5 border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl group transform hover:scale-[1.02] backdrop-blur-sm ${
              isSelected 
                ? 'border-blue-400/60 bg-gradient-to-br from-blue-500/15 via-indigo-400/10 to-purple-500/15 shadow-blue-500/30' 
                : 'border-white/20 hover:border-blue-400/50 bg-gradient-to-br from-white/10 via-white/5 to-blue-100/10 hover:from-white/15 hover:to-blue-100/15'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 via-indigo-400/15 to-purple-500/20 text-white rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Icon name={component.icon} size={16} />
                  </div>
                  <h3 className="text-xs font-semibold text-white leading-tight tracking-tight drop-shadow-sm">{component.title || component.name}</h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentDelete(component.id);
                  }}
                  className="p-1 text-white/70 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/20 hover:shadow-lg backdrop-blur-sm"
                >
                  <Icon name="Trash2" size={12} />
                </button>
              </div>
              <div className="space-y-1.5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-2.5 py-1.5 border-2 border-white/20 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                  disabled
                />
                <button className="w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg text-xs font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 border border-white/20 backdrop-blur-sm transform hover:scale-[1.02]">
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
            className={`p-2.5 border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl group backdrop-blur-sm ${
              isSelected 
                ? 'border-orange-400/60 bg-gradient-to-br from-orange-500/15 via-yellow-400/10 to-red-500/15 shadow-orange-500/30' : 'border-white/20 hover:border-orange-400/50 bg-gradient-to-br from-white/10 via-white/5 to-orange-100/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-gradient-to-br from-orange-500/20 via-yellow-400/15 to-red-500/20 text-white rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Icon name={component.icon} size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-white leading-tight drop-shadow-sm">{component.title || component.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5 drop-shadow-sm opacity-90">{component.description || 'Click to configure'}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
                className="p-1 text-white/70 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/20 backdrop-blur-sm"
              >
                <Icon name="Trash2" size={10} />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const containerClass = viewMode === 'mobile' ? 'w-full max-w-sm mx-auto' : 'w-full max-w-2xl mx-auto';

  return (
    <div className="px-2 sm:px-6 lg:px-8">
      <div className={`${containerClass} relative bg-gradient-to-br ${theme.background} rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 backdrop-blur-lg`}>
        {/* TikTok-style animated gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.overlay} animate-pulse`}></div>
        
        {/* Profile Header with enhanced editing functionality */}
        <div className="relative p-5 text-center space-y-3 backdrop-blur-sm">
          {/* Profile Picture with enhanced upload */}
          <div className="relative inline-block group">
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.accent} rounded-full animate-pulse blur-sm`}></div>
            <div className="relative cursor-pointer" onClick={handleProfilePictureClick}>
              <Image
                src={profileData?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                alt="Profile Avatar"
                className="relative w-20 h-20 rounded-full object-cover border-3 border-white shadow-2xl ring-4 ring-white/30 backdrop-blur-sm group-hover:opacity-75 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Icon name="Camera" size={16} className="text-white drop-shadow-sm" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-xl">
                <Icon name={uploadError ? "AlertCircle" : "Check"} size={12} className={`${uploadError ? "text-red-500" : "text-white"} drop-shadow-sm`} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleProfilePictureChange}
              className="hidden"
              aria-label="Upload profile picture"
            />
          </div>
          
          {/* Error Messages */}
          {(uploadError || saveError) && (
            <div className="max-w-xs mx-auto p-2 bg-red-500/20 border border-red-400/60 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-red-200 font-medium">
                {uploadError || saveError}
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            {/* Enhanced Editable Name */}
            <div className="cursor-pointer group" onClick={handleNameClick}>
              {isEditingName ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleNameKeyPress}
                  className="text-sm font-bold text-white bg-white/20 border-2 border-white/40 rounded-lg px-3 py-1 text-center backdrop-blur-sm focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30 max-w-xs mx-auto"
                  placeholder="Enter your name"
                  autoFocus
                  maxLength={50}
                />
              ) : (
                <h1 className="text-sm font-bold text-white leading-tight tracking-tight drop-shadow-lg group-hover:bg-white/10 group-hover:rounded-lg px-2 py-1 transition-all duration-300 inline-block">
                  {profileData?.name || 'Click to edit name'}
                  <Icon name="Edit2" size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline" />
                </h1>
              )}
            </div>
            
            {/* Enhanced Editable Bio */}
            <div className="max-w-xs mx-auto cursor-pointer group" onClick={handleBioClick}>
              {isEditingBio ? (
                <div className="relative">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    onBlur={handleBioSave}
                    onKeyDown={handleBioKeyPress}
                    className="text-xs text-white bg-white/20 border-2 border-white/40 rounded-lg px-3 py-2 text-center backdrop-blur-sm focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30 w-full resize-none"
                    placeholder="Enter your bio..."
                    autoFocus
                    rows={3}
                    maxLength={150}
                  />
                  <div className="absolute bottom-1 right-2 text-xs text-white/60">
                    {editedBio.length}/150
                  </div>
                </div>
              ) : (
                <p className="text-xs text-white/90 leading-relaxed drop-shadow-md font-medium whitespace-pre-line group-hover:bg-white/10 group-hover:rounded-lg px-2 py-1 transition-all duration-300 min-h-[20px]">
                  {profileData?.bio || 'Click to edit bio...'}
                  <Icon name="Edit2" size={10} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline" />
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-1 pt-0.5">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-xs text-white font-semibold tracking-wide drop-shadow-sm">Web3 Verified</span>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>

          {/* Enhanced Save Changes Button */}
          {hasChanges && (
            <div className="pt-3">
              <Button
                onClick={handleSaveChanges}
                loading={isSaving}
                variant="success"
                size="sm"
                iconName="Save"
                iconPosition="left"
                className="text-xs font-bold shadow-xl hover:shadow-2xl hover:shadow-green-500/30"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Components Area with enhanced styling */}
        <div
          className="relative p-4 min-h-96 space-y-3 backdrop-blur-sm"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          {components.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto border-2 border-white/30 shadow-2xl backdrop-blur-sm">
                  <Icon name="Plus" size={20} className="text-white drop-shadow-sm" />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.accent} rounded-full animate-pulse blur-sm`}></div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white leading-tight tracking-tight drop-shadow-lg">Start Building</h3>
                <p className="text-xs text-white/80 mt-0.5 drop-shadow-md opacity-90">Drag components from the library to build your profile</p>
              </div>
            </div>
          ) : (
            <>
              {components.map((component, index) => (
                <React.Fragment key={component.id}>
                  {dragOverIndex === index && (
                    <div className="h-2 bg-gradient-to-r from-white/40 via-purple-400/30 to-pink-400/40 rounded-full border-2 border-dashed border-white/60 shadow-lg backdrop-blur-sm"></div>
                  )}
                  {renderComponent(component, index)}
                </React.Fragment>
              ))}
              {dragOverIndex === components.length && (
                <div className="h-2 bg-gradient-to-r from-white/40 via-purple-400/30 to-pink-400/40 rounded-full border-2 border-dashed border-white/60 shadow-lg backdrop-blur-sm"></div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Footer with TikTok styling */}
        <div className="relative p-2.5 bg-gradient-to-r from-black/20 via-black/10 to-black/20 border-t border-white/20 text-center backdrop-blur-lg">
          <p className="text-xs text-white/80 font-medium drop-shadow-sm">
            Powered by <span className="font-semibold text-white tracking-wide drop-shadow-md">BitLink Web3</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;