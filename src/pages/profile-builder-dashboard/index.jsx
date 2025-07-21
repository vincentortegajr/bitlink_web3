import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';

import Header from '../../components/ui/Header';
import TopToolbar from './components/TopToolbar';
import ComponentLibrary from './components/ComponentLibrary';
import ProfilePreview from './components/ProfilePreview';
import PropertyPanel from './components/PropertyPanel';
import QuickActions from './components/QuickActions';
import { useNavigate } from 'react-router-dom';

const ProfileBuilderDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('mobile');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [components, setComponents] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState(null);

  const [profileData, setProfileData] = useState({
    name: 'Aura Lennox - Your Digital Muse',
    bio: '✨ Click the bitlink in my bio: [bitlink.my/auralennox]\n💋 Unlock exclusive vibes, luxury looks, and a world of empowerment!\n🌟 Own your journey with me - let\'s build an empire together!',
    avatar: 'https://ortegajr.com/images/portraits/aura-lennox-golden-hour-selfie-turquoise-water-mediterranean-sunset-1024x1024-1x1.png',
    username: 'alexchen',
    walletAddress: '0x742d35Cc6Bb1d4B2f',
    isVerified: true
  });

  useEffect(() => {
    // Load saved profile data
    const savedProfile = localStorage.getItem('profile_data');
    const savedComponents = localStorage.getItem('profile_components');
    const publishStatus = localStorage.getItem('profile_published');

    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    }
    if (publishStatus) {
      setIsPublished(publishStatus === 'true');
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('profile_data', JSON.stringify(profileData));
    localStorage.setItem('profile_components', JSON.stringify(components));
    
    setIsSaving(false);
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

  return (
    <div className="mobile-full-height mobile-viewport-fix bg-background overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto px-4 py-6 h-full flex flex-col">
            <Header />
            
            <div className="shrink-0">
              <TopToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSave={handleSave}
                onPublish={handlePublish}
                isPublished={isPublished}
                isSaving={isSaving}
                onPreview={handlePreview}
                onShare={handleShare}
              />
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              <ComponentLibrary
                onDragStart={handleDragStart}
                isVisible={showComponentLibrary}
                onClose={() => setShowComponentLibrary(false)}
              />

              <div className="flex-1 p-2 lg:p-6 order-2 lg:order-1 overflow-hidden flex flex-col">
                <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
                  <div className="mb-4 lg:mb-6 shrink-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-text-primary contrast-more:text-black contrast-more:font-bold">
                          Profile Builder
                        </h1>
                        <p className="text-sm lg:text-base text-text-secondary contrast-more:text-gray-700 contrast-more:font-medium">
                          Create your Web3 profile page
                        </p>
                      </div>
                      
                      <div className="lg:hidden flex items-center space-x-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowComponentLibrary(true)}
                          className="flex-1 sm:flex-none min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                          className="flex-1 sm:flex-none min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                    <div className="h-full mobile-scroll-container scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                      <ProfilePreview
                        profileData={profileData}
                        components={components}
                        selectedComponent={selectedComponent}
                        onComponentSelect={handleComponentSelect}
                        onComponentDelete={handleComponentDelete}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        viewMode={viewMode}
                      />
                      <div className="h-8 lg:h-0 pb-mobile-safe"></div>
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