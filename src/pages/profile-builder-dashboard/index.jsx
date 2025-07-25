import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';

import TopToolbar from './components/TopToolbar';
import ComponentLibrary from './components/ComponentLibrary';
import ProfilePreview from './components/ProfilePreview';
import PropertyPanel from './components/PropertyPanel';
import QuickActions from './components/QuickActions';
import { loadTheme, saveTheme } from '../../utils/themes';

const ProfileBuilderDashboard = () => {
  const [viewMode, setViewMode] = useState('mobile');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [components, setComponents] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('pink');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const [profileData, setProfileData] = useState({
    name: 'Aura Lennox',
    bio: 'Digital creator • Web3 enthusiast • Building the future',
    avatar: 'https://ortegajr.com/images/portraits/aura-lennox-golden-hour-selfie-turquoise-water-mediterranean-sunset-1024x1024-1x1.png',
    username: 'alexchen',
    walletAddress: '0x742d35Cc6Bb1d4B2f',
    isVerified: true
  });

  useEffect(() => {
    // Load saved profile data and theme
    const savedProfile = localStorage.getItem('profile_data');
    const savedComponents = localStorage.getItem('profile_components');
    const publishStatus = localStorage.getItem('profile_published');
    const savedTheme = loadTheme();

    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    }
    if (publishStatus) {
      setIsPublished(publishStatus === 'true');
    }
    setSelectedTheme(savedTheme);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate save delay with potential failure handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 95% success rate for MVP stability
          if (Math.random() > 0.05) {
            resolve();
          } else {
            reject(new Error('Network error'));
          }
        }, 1000);
      });
      
      localStorage.setItem('profile_data', JSON.stringify(profileData));
      localStorage.setItem('profile_components', JSON.stringify(components));
      
    } catch (error) {
      console.error('Save failed:', error);
      // Auto-retry once
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('profile_data', JSON.stringify(profileData));
        localStorage.setItem('profile_components', JSON.stringify(components));
      } catch (retryError) {
        console.error('Retry save failed:', retryError);
        alert('Failed to save. Please check your connection and try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!isPublished) {
      await handleSave();
      setIsPublished(true);
      localStorage.setItem('profile_published', 'true');
    } else {
      setIsPublished(false);
      localStorage.setItem('profile_published', 'false');
    }
  };

  const handlePreview = () => {
    const previewUrl = `https://bitlink.web3/${profileData.username}`;
    window.open(previewUrl, '_blank');
  };

  const handleShare = (type, url) => {
    if (type === 'qr') {
      // Generate QR code modal would open here
      console.log('Generate QR code for:', url);
    }
  };

  const handleThemeChange = (themeKey) => {
    setSelectedTheme(themeKey);
    saveTheme(themeKey);
  };

  const handleDragStart = (component) => {
    setDraggedComponent(component);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    
    if (draggedComponent) {
      const newComponent = {
        ...draggedComponent,
        id: `${draggedComponent.id}-${Date.now()}`,
        type: draggedComponent.id
      };
      
      const newComponents = [...components];
      if (typeof index === 'number') {
        newComponents.splice(index, 0, newComponent);
      } else {
        newComponents.push(newComponent);
      }
      
      setComponents(newComponents);
      setDraggedComponent(null);
    }
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    setShowPropertyPanel(true);
  };

  const handleComponentUpdate = (componentId, updates, action) => {
    if (action === 'delete') {
      setComponents(prev => prev.filter(c => c.id !== componentId));
      setSelectedComponent(null);
      setShowPropertyPanel(false);
      return;
    }

    setComponents(prev => 
      prev.map(component => 
        component.id === componentId 
          ? { ...component, ...updates }
          : component
      )
    );
  };

  const handleComponentDelete = (componentId) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
      setShowPropertyPanel(false);
    }
  };

  const handleAddComponent = (componentData) => {
    const newComponent = {
      ...componentData,
      id: `${componentData.type}-${Date.now()}`
    };
    setComponents(prev => [...prev, newComponent]);
  };

  const handleOpenAIStudio = () => {
    const aiStudioTrigger = document.querySelector('[data-ai-studio-trigger]');
    if (aiStudioTrigger) {
      aiStudioTrigger.click();
    }
  };

  const handleAddLink = () => {
    setShowQuickActions(true);
  };

  const handleProfileUpdate = async (updatedProfileData) => {
    try {
      const newProfileData = { ...profileData, ...updatedProfileData };
      setProfileData(newProfileData);
      
      // Auto-save if enabled
      if (autoSaveEnabled) {
        localStorage.setItem('profile_data', JSON.stringify(newProfileData));
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  React.useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Escape to close panels
      if (e.key === 'Escape') {
        setShowComponentLibrary(false);
        setShowPropertyPanel(false);
        setShowQuickActions(false);
        setSelectedComponent(null);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <div 
      className="mobile-full-height mobile-viewport-fix bg-background overflow-hidden"
      style={{
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        paddingBottom: 'var(--mobile-total-bottom)'
      }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto px-2 lg:px-4 py-1 lg:py-3 h-full flex flex-col">
            
            <div className="shrink-0 mb-1 lg:mb-3">
              <TopToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSave={handleSave}
                onPublish={handlePublish}
                isPublished={isPublished}
                isSaving={isSaving}
                onPreview={handlePreview}
                onShare={handleShare}
                selectedTheme={selectedTheme}
                onThemeChange={handleThemeChange}
              />
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              <ComponentLibrary
                onDragStart={handleDragStart}
                isVisible={showComponentLibrary}
                onClose={() => setShowComponentLibrary(false)}
              />

              <div className="flex-1 px-1 lg:px-3 order-2 lg:order-1 overflow-hidden flex flex-col">
                <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
                  <div className="mb-2 lg:mb-4 shrink-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 lg:gap-3">
                      <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white contrast-more:text-black contrast-more:font-extrabold leading-tight tracking-tight">
                          Profile Builder
                        </h1>
                        <p className="text-sm lg:text-sm text-slate-700 dark:text-slate-300 contrast-more:text-black contrast-more:font-semibold mt-1 leading-relaxed">
                          Create your professional Web3 profile
                        </p>
                      </div>
                      
                      <div className="lg:hidden flex items-center space-x-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowComponentLibrary(true)}
                          className="flex-1 sm:flex-none min-h-[48px] touch-manipulation"
                          iconName="Layers"
                          iconPosition="left"
                          aria-label="Open component library"
                        >
                          Components
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleAddLink}
                          className="flex-1 sm:flex-none min-h-[48px] touch-manipulation"
                          iconName="Plus"
                          iconPosition="left"
                          aria-label="Add new link to profile"
                        >
                          Add Link
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="h-full mobile-scroll-container scrollbar-thin scrollbar-thumb-slate-600 dark:scrollbar-thumb-slate-400 scrollbar-track-transparent">
                      <ProfilePreview
                        profileData={profileData}
                        components={components}
                        selectedComponent={selectedComponent}
                        onComponentSelect={handleComponentSelect}
                        onComponentDelete={handleComponentDelete}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        viewMode={viewMode}
                        selectedTheme={selectedTheme}
                        onProfileUpdate={handleProfileUpdate}
                      />
                      <div className="h-4 lg:h-0 pb-mobile-safe"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-3 lg:order-2 shrink-0">
                <PropertyPanel
                  selectedComponent={selectedComponent}
                  onUpdateComponent={handleComponentUpdate}
                  onClose={() => {
                    setShowPropertyPanel(false);
                    setSelectedComponent(null);
                  }}
                  isVisible={showPropertyPanel}
                />
              </div>
            </div>

            <QuickActions
              onAddComponent={handleAddComponent}
              isVisible={showQuickActions}
              onClose={() => setShowQuickActions(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBuilderDashboard;