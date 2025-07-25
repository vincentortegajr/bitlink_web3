import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

const UnifiedNavigationSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [activeTab, setActiveTab] = useState('build');
  const [showAIStudio, setShowAIStudio] = useState(false);
  const [currentContext, setCurrentContext] = useState('web3'); // web3 or ai

  // Web3 LinkTree Navigation (Primary Platform)
  const web3Navigation = [
    {
      id: 'build',
      name: 'Build',
      description: 'Create your Web3 profile',
      route: '/profile-builder-dashboard',
      icon: 'User',
      color: 'bg-blue-500',
      isCore: true
    },
    {
      id: 'manage',
      name: 'Manage',
      description: 'Links & Content',
      route: '/link-content-management',
      icon: 'Link',
      color: 'bg-purple-500',
      isCore: true
    },
    {
      id: 'payments',
      name: 'Payments',
      description: 'Crypto Setup',
      route: '/crypto-payment-setup',
      icon: 'CreditCard',
      color: 'bg-green-500',
      isCore: true
    },
    {
      id: 'leads',
      name: 'Leads',
      description: 'Lead Generation',
      route: '/lead-generation-hub',
      icon: 'Target',
      color: 'bg-orange-500',
      isCore: true
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Performance Dashboard',
      route: '/analytics-performance-dashboard',
      icon: 'BarChart3',
      color: 'bg-red-500',
      isCore: true
    }
  ];

  // AI Studio Tools (Secondary Features)
  const aiTools = [
    {
      id: 'text-to-image',
      name: 'Text-to-Image',
      description: 'Generate images from text',
      route: '/ai-text-to-image-generator',
      icon: 'ImageIcon',
      color: 'bg-blue-500',
      category: 'generate'
    },
    {
      id: 'image-to-image',
      name: 'Image Transform',
      description: 'Transform existing images',
      route: '/ai-image-to-image-transformer',
      icon: 'RefreshCw',
      color: 'bg-purple-500',
      category: 'transform'
    },
    {
      id: 'image-to-video',
      name: 'Image-to-Video',
      description: 'Animate static images',
      route: '/ai-image-to-video-creator',
      icon: 'Video',
      color: 'bg-green-500',
      category: 'animate'
    },
    {
      id: 'video-lipsync',
      name: 'Video Lipsync',
      description: 'Sync lips to audio',
      route: '/ai-video-to-lipsync-generator',
      icon: 'Mic',
      color: 'bg-red-500',
      category: 'sync'
    },
    {
      id: 'text-to-audio',
      name: 'Text-to-Audio',
      description: 'Generate speech & sounds',
      route: '/ai-text-to-audio-generator',
      icon: 'Volume2',
      color: 'bg-orange-500',
      category: 'audio'
    },
    {
      id: 'image-upscaler',
      name: 'Image Upscaler',
      description: 'Enhance image quality',
      route: '/ai-image-upscaler',
      icon: 'Maximize2',
      color: 'bg-cyan-500',
      category: 'enhance',
      isNew: true
    },
    {
      id: 'image-realism',
      name: 'Image Realism',
      description: 'Cartoon to realistic skin',
      route: '/ai-image-realism-model',
      icon: 'Sparkles',
      color: 'bg-pink-500',
      category: 'transform',
      isNew: true
    }
  ];

  // Determine active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check Web3 LinkTree routes
    const web3Route = web3Navigation.find(nav => nav.route === currentPath);
    if (web3Route) {
      setActiveTab(web3Route.id);
      setCurrentContext('web3');
      return;
    }

    // Check AI tool routes
    const aiRoute = aiTools.find(tool => tool.route === currentPath);
    if (aiRoute) {
      setCurrentContext('ai');
      return;
    }

    // Default to build (Web3 LinkTree primary)
    setActiveTab('build');
    setCurrentContext('web3');
  }, [location.pathname]);

  const handleNavigation = (route, context = 'web3') => {
    navigate(route);
    setCurrentContext(context);
    if (context === 'ai') {
      setShowAIStudio(false);
    }
  };

  const handleTabClick = (tabId) => {
    const navItem = web3Navigation.find(nav => nav.id === tabId);
    if (navItem) {
      setActiveTab(tabId);
      handleNavigation(navItem.route, 'web3');
    }
  };

  const handleAIStudioToggle = () => {
    setShowAIStudio(!showAIStudio);
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* Desktop Dual Sidebar Layout */}
      <div className="hidden lg:flex h-[calc(100vh-4rem)]">
        {/* Primary Sidebar - Web3 LinkTree */}
        <div className="w-64 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">BitLink Web3</h2>
            <p className="text-sm text-text-secondary">Your decentralized profile</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {web3Navigation.map((nav) => (
              <button
                key={nav.id}
                onClick={() => handleNavigation(nav.route, 'web3')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                  activeTab === nav.id && currentContext === 'web3'
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted"
                )}
              >
                <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", nav.color)}>
                  <Icon name={nav.icon} size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{nav.name}</div>
                  <div className="text-xs opacity-75">{nav.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Secondary Sidebar - AI Studio */}
        <div className="w-64 bg-muted/50 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={16} className="text-primary" />
              <h3 className="font-semibold text-text-primary">AI Studio</h3>
            </div>
            <p className="text-xs text-text-secondary mt-1">Enhance with AI tools</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {aiTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleNavigation(tool.route, 'ai')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all text-sm",
                  location.pathname === tool.route && currentContext === 'ai'
                    ? "bg-primary/10 text-primary border border-primary/20" :"text-text-secondary hover:text-text-primary hover:bg-background/50"
                )}
              >
                <div className={cn("w-6 h-6 rounded-sm flex items-center justify-center", tool.color)}>
                  <Icon name={tool.icon} size={12} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-1">
                    {tool.name}
                    {tool.isNew && (
                      <span className="px-1.5 py-0.5 bg-accent text-white text-[10px] rounded-sm font-medium">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {/* Breadcrumb Navigation */}
            <div className="bg-surface/95 backdrop-blur-glass border-b border-border sticky top-0 z-10">
              <div className="container mx-auto px-6 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-secondary">BitLink</span>
                  <Icon name="ChevronRight" size={14} className="text-text-secondary" />
                  <span className={cn(
                    "font-medium",
                    currentContext === 'web3' ? "text-primary" : "text-text-secondary"
                  )}>
                    {currentContext === 'web3' ? 'Web3 LinkTree' : 'AI Studio'}
                  </span>
                  {currentContext === 'ai' && (
                    <>
                      <Icon name="ChevronRight" size={14} className="text-text-secondary" />
                      <span className="text-primary font-medium">
                        {aiTools.find(t => t.route === location.pathname)?.name || 'AI Tool'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content placeholder - would be replaced by actual page content */}
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-lg border p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Navigation" size={24} className="text-text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Unified Navigation System
                  </h3>
                  <p className="text-text-secondary mb-6">
                    This system integrates Web3 LinkTree (primary platform) with AI Studio tools (secondary features).
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={() => handleNavigation('/profile-builder-dashboard', 'web3')}
                      iconName="User"
                      iconPosition="left"
                    >
                      Start Building Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleNavigation('/ai-text-to-image-generator', 'ai')}
                      iconName="Sparkles"
                      iconPosition="left"
                    >
                      Explore AI Tools
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* AI Studio Slide-up Panel */}
        {showAIStudio && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="w-full bg-surface rounded-t-2xl max-h-[75vh] overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Sparkles" size={20} className="text-primary" />
                    <h2 className="text-lg font-bold text-text-primary">AI Studio</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAIStudioToggle}
                    iconName="X"
                    className="min-h-[44px] min-w-[44px]"
                  />
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  AI tools for content creation & enhancement
                </p>
              </div>
              
              <div className="overflow-y-auto">
                <div className="p-4 grid grid-cols-1 gap-3">
                  {aiTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleNavigation(tool.route, 'ai')}
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", tool.color)}>
                        <Icon name={tool.icon} size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary">{tool.name}</h3>
                          {tool.isNew && (
                            <span className="px-2 py-1 bg-accent text-white text-xs rounded-md font-medium">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-text-secondary text-sm">{tool.description}</p>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Content Area */}
        <div className="min-h-[calc(100vh-8rem)] pb-20">
          {/* Context Indicator */}
          <div className="bg-surface/95 backdrop-blur-glass border-b border-border sticky top-16 z-10">
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">BitLink</span>
                <Icon name="ChevronRight" size={12} className="text-text-secondary" />
                <span className={cn(
                  "font-medium",
                  currentContext === 'web3' ? "text-primary" : "text-accent"
                )}>
                  {currentContext === 'web3' ? 'Web3 LinkTree' : 'AI Studio'}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile content placeholder */}
          <div className="p-4">
            <div className="bg-card rounded-lg border p-6 text-center">
              <Icon name="Smartphone" size={32} className="text-text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">
                Mobile Navigation Fixed
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Web3 LinkTree is now the primary platform with AI tools as secondary features.
              </p>
              <Button
                onClick={() => handleNavigation('/profile-builder-dashboard', 'web3')}
                iconName="User"
                iconPosition="left"
                className="w-full"
              >
                Build Your Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UnifiedNavigationSystem;