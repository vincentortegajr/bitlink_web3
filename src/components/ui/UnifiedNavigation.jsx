import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { cn } from '../../utils/cn';

const UnifiedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation state management
  const [activeTab, setActiveTab] = useState('build');
  const [showAIStudio, setShowAIStudio] = useState(false);
  const [currentContext, setCurrentContext] = useState('web3');
  const [isScrolled, setIsScrolled] = useState(false);

  // Web3 LinkTree Navigation (Primary Platform)
  const web3Navigation = [
    {
      id: 'build',
      name: 'Build',
      description: 'Create your Web3 profile',
      route: '/profile-builder-dashboard',
      icon: 'User',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'manage',
      name: 'Manage',
      description: 'Links & Content',
      route: '/link-content-management',
      icon: 'Link',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'payments',
      name: 'Payments',
      description: 'Crypto Setup',
      route: '/crypto-payment-setup',
      icon: 'CreditCard',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'leads',
      name: 'Leads',
      description: 'Lead Generation',
      route: '/lead-generation-hub',
      icon: 'Target',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Performance Dashboard',
      route: '/analytics-performance-dashboard',
      icon: 'BarChart3',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600'
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
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'image-to-image',
      name: 'Image-to-Image',
      description: 'Transform existing images',
      route: '/ai-image-to-image-transformer',
      icon: 'RefreshCw',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'image-to-video',
      name: 'Image-to-Video',
      description: 'Animate static images',
      route: '/ai-image-to-video-creator',
      icon: 'Video',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'video-lipsync',
      name: 'Video-to-Lipsync',
      description: 'Sync lips to audio',
      route: '/ai-video-to-lipsync-generator',
      icon: 'Mic',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'text-to-audio',
      name: 'Text-to-Audio',
      description: 'Generate speech & sounds',
      route: '/ai-text-to-audio-generator',
      icon: 'Volume2',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'image-upscaler',
      name: 'Image Upscaler',
      description: 'Enhance image quality',
      route: '/ai-image-upscaler',
      icon: 'Maximize2',
      color: 'bg-cyan-500',
      gradient: 'from-cyan-500 to-blue-500',
      isNew: true
    },
    {
      id: 'image-realism',
      name: 'Image Realism Model',
      description: 'Cartoon to realistic skin',
      route: '/ai-image-realism-model',
      icon: 'Sparkles',
      color: 'bg-pink-500',
      gradient: 'from-pink-500 to-rose-500',
      isNew: true
    }
  ];

  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');

  // Scroll detection for transparent header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Route detection and tab management
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check Web3 LinkTree routes
    const web3Route = web3Navigation.find(nav => nav.route === currentPath);
    if (web3Route) {
      setActiveTab(web3Route.id);
      setCurrentContext('web3');
      setShowAIStudio(false); // Close AI Studio when navigating to Web3 routes
      return;
    }

    // Check AI tool routes
    const aiRoute = aiTools.find(tool => tool.route === currentPath);
    if (aiRoute) {
      setActiveTab('ai-studio'); // Set AI Studio as active tab when on AI route
      setCurrentContext('ai');
      setShowAIStudio(false); // Close AI Studio dropdown when navigating to AI route
      return;
    }

    // Default to build (Web3 LinkTree primary)
    setActiveTab('build');
    setCurrentContext('web3');
    setShowAIStudio(false); // Ensure AI Studio is closed by default
  }, [location.pathname]);

  const handleNavigation = (route, context = 'web3') => {
    navigate(route);
    setCurrentContext(context);
    setShowAIStudio(false); // Always close AI Studio when navigating
  };

  const handleTabClick = (tabId) => {
    const navItem = web3Navigation.find(nav => nav.id === tabId);
    if (navItem) {
      setActiveTab(tabId);
      setShowAIStudio(false); // Close AI Studio when clicking other nav items
      handleNavigation(navItem.route, 'web3');
    }
  };

  const handleWalletConnect = () => {
    if (!isWalletConnected) {
      setIsWalletConnected(true);
      setWalletAddress('0x742d...4B2f');
      setBalance('2.45');
    } else {
      setIsWalletConnected(false);
      setWalletAddress('');
      setBalance('0.00');
    }
  };

  const handleAIStudioToggle = () => {
    const newShowState = !showAIStudio;
    setShowAIStudio(newShowState);
    
    // When opening AI Studio dropdown, set it as active if not on a specific AI route
    if (newShowState && currentContext !== 'ai') {
      setActiveTab('ai-studio');
    } else if (!newShowState && currentContext !== 'ai') {
      // When closing, revert to appropriate tab based on current route
      const currentPath = location.pathname;
      const web3Route = web3Navigation.find(nav => nav.route === currentPath);
      if (web3Route) {
        setActiveTab(web3Route.id);
      } else {
        setActiveTab('build');
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close AI Studio when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAIStudio && !event.target.closest('[data-ai-studio-container]')) {
        setShowAIStudio(false);
        
        // CRITICAL FIX: Reset tab state when closing AI Studio
        if (currentContext !== 'ai') {
          const currentPath = location.pathname;
          const web3Route = web3Navigation.find(nav => nav.route === currentPath);
          if (web3Route) {
            setActiveTab(web3Route.id);
          } else {
            setActiveTab('build');
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAIStudio, currentContext, location.pathname, web3Navigation]);

  return (
    <>
      {/* Apple-Style Transparent Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isScrolled 
          ? "bg-surface/90 backdrop-blur-xl border-b border-border/50 shadow-lg" 
          : "bg-transparent"
      )}>
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg">
              <Icon name="Link2" size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent">BitLink</span>
            <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20">Web3</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {web3Navigation.map((item) => {
              const isActive = activeTab === item.id && currentContext === 'web3';
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-lg" 
                      : "text-text-secondary hover:text-text-primary hover:bg-muted/50 hover:backdrop-blur-sm"
                  )}
                  title={item.description}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}
            
            {/* AI Studio Access */}
            <div className="relative" data-ai-studio-container>
              <Button
                variant={activeTab === 'ai-studio' || currentContext === 'ai' ? 'default' : 'ghost'}
                onClick={handleAIStudioToggle}
                iconName="Sparkles"
                iconPosition="left"
                className={cn(
                  "transition-all duration-300 hover:scale-105",
                  (activeTab === 'ai-studio' || currentContext === 'ai') && "bg-gradient-to-r from-accent to-primary text-white",
                  showAIStudio && !currentContext === 'ai' && "bg-primary/10 text-primary border border-primary/20"
                )}
                data-ai-studio-trigger
              >
                AI Studio
                <Icon name="ChevronDown" size={14} className={cn("transition-transform duration-300", showAIStudio && "rotate-180")} />
              </Button>

              {/* AI Tools Dropdown - FIXED TEXT CONTRAST & MOBILE SCROLLING */}
              {showAIStudio && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-surface/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-border/50 bg-primary/10">
                    <h3 className="font-semibold text-text-primary contrast-more:text-black flex items-center gap-2">
                      <Icon name="Sparkles" size={16} className="text-accent" />
                      AI Creative Studio
                    </h3>
                    <p className="text-xs text-text-secondary contrast-more:text-gray-700 mt-1">AI tools for content creation</p>
                  </div>
                  <div className="p-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent mobile-scroll-container">
                    <div className="space-y-1">
                      {aiTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleNavigation(tool.route, 'ai')}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 active:bg-muted/80 transition-all duration-300 text-left group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface min-h-[56px] touch-manipulation"
                        >
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r shrink-0", tool.gradient)}>
                            <Icon name={tool.icon} size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text-primary contrast-more:text-black text-sm truncate">{tool.name}</span>
                              {tool.isNew && (
                                <span className="px-1.5 py-0.5 bg-gradient-to-r from-accent to-primary text-white text-[10px] rounded-full font-medium shrink-0">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary contrast-more:text-gray-700 truncate">{tool.description}</p>
                          </div>
                          <Icon name="ChevronRight" size={16} className="text-text-secondary group-hover:text-text-primary contrast-more:text-gray-600 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Wallet Status & Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Wallet Status */}
            {isWalletConnected ? (
              <div className="hidden sm:flex items-center space-x-2 bg-success/10 text-success px-3 py-2 rounded-xl border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium font-mono">{formatAddress(walletAddress)}</span>
                  <span className="text-xs opacity-80">{balance} ETH</span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 bg-warning/10 text-warning px-3 py-2 rounded-xl border border-warning/20">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs font-medium">Not Connected</span>
              </div>
            )}

            {/* Connect/Disconnect Button */}
            <Button
              variant={isWalletConnected ? "outline" : "default"}
              size="sm"
              onClick={handleWalletConnect}
              iconName={isWalletConnected ? "LogOut" : "Wallet"}
              iconPosition="left"
              className="hidden sm:flex hover:scale-105 transition-transform duration-300"
            >
              {isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
            </Button>

            {/* Mobile Wallet Button */}
            <Button
              variant={isWalletConnected ? "outline" : "default"}
              size="icon"
              onClick={handleWalletConnect}
              className="sm:hidden min-h-[44px] min-w-[44px] hover:scale-105 transition-transform duration-300 touch-manipulation"
            >
              <Icon name={isWalletConnected ? "LogOut" : "Wallet"} size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* AI Studio Mobile Slide-Up Panel - FIXED TEXT CONTRAST & SCROLLING */}
      {showAIStudio && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-end backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAIStudio(false);
            }
          }}
        >
          <div className="w-full bg-surface/98 backdrop-blur-xl rounded-t-3xl max-h-[85vh] overflow-hidden border-t border-border/60" data-ai-studio-container>
            <div className="p-4 border-b border-border/50 bg-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
                    <Icon name="Sparkles" size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary contrast-more:text-black">AI Studio</h2>
                    <p className="text-xs text-text-secondary contrast-more:text-gray-700">AI tools for content creation</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAIStudio(false)}
                  className="min-h-[44px] min-w-[44px] hover:scale-105 transition-transform duration-300 touch-manipulation text-text-primary hover:bg-muted/50"
                  iconName="X"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto mobile-scroll-container scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="p-4 space-y-3 pb-safe-area">
                {aiTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleNavigation(tool.route, 'ai')}
                    className="flex items-center gap-4 p-4 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/60 hover:bg-muted/60 active:bg-muted/80 transition-all duration-300 text-left group hover:scale-[1.02] w-full touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface min-h-[72px]"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r shrink-0", tool.gradient)}>
                      <Icon name={tool.icon} size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary contrast-more:text-black truncate">{tool.name}</h3>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-gradient-to-r from-accent to-primary text-white text-xs rounded-full font-medium shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary contrast-more:text-gray-700 text-sm truncate">{tool.description}</p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-text-secondary group-hover:text-text-primary contrast-more:text-gray-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
              {/* Add bottom padding for safe scrolling */}
              <div className="h-6 safe-area-pb"></div>
            </div>
          </div>
        </div>
      )}

      {/* UNIFIED Mobile Bottom Navigation - FIXED AI STUDIO HIGHLIGHT */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-border/50 z-50 shadow-2xl">
        <div className="safe-area-pb">
          <div className="flex items-center justify-around px-2 py-3">
            {web3Navigation.slice(0, 4).map((nav) => {
              const isActive = activeTab === nav.id && currentContext === 'web3';
              return (
                <button
                  key={nav.id}
                  onClick={() => handleTabClick(nav.id)}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-2 rounded-2xl text-xs font-medium transition-all duration-300 min-w-[44px] min-h-[44px] touch-manipulation hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isActive
                      ? "text-primary bg-primary/10 border border-primary/20 shadow-lg backdrop-blur-sm" 
                      : "text-text-secondary hover:text-text-primary hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive && "bg-gradient-to-r " + nav.gradient + " shadow-lg"
                  )}>
                    <Icon 
                      name={nav.icon} 
                      size={16} 
                      className={isActive ? 'text-white' : 'text-current'} 
                    />
                  </div>
                  <span className="truncate max-w-[50px] leading-tight mt-1">
                    {nav.name}
                  </span>
                </button>
              );
            })}
            
            {/* AI Studio Access Button - FIXED HIGHLIGHTING */}
            <button
              onClick={handleAIStudioToggle}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 rounded-2xl text-xs font-medium transition-all duration-300 min-w-[44px] min-h-[44px] touch-manipulation hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                (activeTab === 'ai-studio' || currentContext === 'ai')
                  ? "text-accent bg-accent/10 border border-accent/20 shadow-lg backdrop-blur-sm" 
                  : "text-text-secondary hover:text-text-primary hover:bg-muted/30"
              )}
              data-ai-studio-trigger
            >
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                (activeTab === 'ai-studio' || currentContext === 'ai') && "bg-gradient-to-r from-accent to-primary shadow-lg"
              )}>
                <Icon 
                  name="Sparkles" 
                  size={16} 
                  className={(activeTab === 'ai-studio' || currentContext === 'ai') ? 'text-white' : 'text-current'} 
                />
              </div>
              <span className="truncate max-w-[50px] leading-tight mt-1">
                AI Studio
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedNavigation;