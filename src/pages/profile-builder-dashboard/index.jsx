import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';


import Icon from '../../components/AppIcon';
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
    name: 'Alex Chen',
    bio: 'Web3 Developer & Crypto Enthusiast\nBuilding the future of decentralized web',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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

  return (
    <div className="min-h-screen bg-background pb-6 lg:pb-0">
      {/* NAVIGATION INTEGRATION - Easy AI Studio Access */}
      <div className="container mx-auto px-4 py-6">
        {/* Quick AI Tools Access Banner */}
        <div className="mb-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-4 border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Enhance with AI Tools</h3>
                <p className="text-sm text-text-secondary">Create content to drive traffic to your profile</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              className="hover:scale-105 transition-transform duration-300"
              onClick={() => {
                // This will be handled by the unified navigation
                document.querySelector('[data-ai-studio-trigger]')?.click();
              }}
            >
              Open AI Studio
            </Button>
          </div>
        </div>

        <Header />
        
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

        <div className="flex h-[calc(100vh-8rem)]">
          {/* Component Library */}
          <ComponentLibrary
            onDragStart={handleDragStart}
            isVisible={showComponentLibrary}
            onClose={() => setShowComponentLibrary(false)}
          />

          {/* Main Preview Area */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-muted/30">
            <div className="max-w-4xl mx-auto pb-24 md:pb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">Profile Builder</h1>
                    <p className="text-text-secondary">Create your Web3 profile page</p>
                  </div>
                  
                  {/* Mobile Action Buttons - IMPROVED ACCESSIBILITY */}
                  <div className="lg:hidden flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowComponentLibrary(true)}
                      className="min-h-[44px] min-w-[44px] touch-manipulation"
                      aria-label="Open component library"
                    >
                      <Icon name="Layers" size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowQuickActions(true)}
                      className="min-h-[44px] min-w-[44px] touch-manipulation"
                      aria-label="Open quick actions"
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>
              </div>

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
            </div>
          </div>

          {/* Property Panel */}
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

        {/* Quick Actions */}
        <QuickActions
          onAddComponent={handleAddComponent}
          isVisible={showQuickActions}
          onClose={() => setShowQuickActions(false)}
        />
      </div>
    </div>
  );
};

export default ProfileBuilderDashboard;