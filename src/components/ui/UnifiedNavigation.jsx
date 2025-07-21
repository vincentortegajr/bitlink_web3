import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { cn } from '../../utils/cn';

const UnifiedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation state management with proper state synchronization
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
    },
    {
      id: 'ai-chat-assistant',
      name: 'AI Chat Assistant',
      description: 'Chat with Ollama models',
      route: '/ai-chat-assistant',
      icon: 'MessageCircle',
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');

  // Scroll detection for transparent header effect with proper debouncing
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 10);
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Route detection and tab management with proper synchronization
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check Web3 LinkTree routes first
    const web3Route = web3Navigation.find(nav => nav.route === currentPath);
    if (web3Route) {
      setActiveTab(web3Route.id);
      setCurrentContext('web3');
      setShowAIStudio(false);
      return;
    }

    // Check AI tool routes
    const aiRoute = aiTools.find(tool => tool.route === currentPath);
    if (aiRoute) {
      setActiveTab('ai-studio');
      setCurrentContext('ai');
      setShowAIStudio(false); // Close dropdown when on specific AI route
      return;
    }

    // Default handling for unknown routes
    if (currentPath === '/') {
      setActiveTab('build');
      setCurrentContext('web3');
    } else {
      // For unknown routes, maintain current state but close AI Studio
      setShowAIStudio(false);
    }
  }, [location.pathname]);

  // Navigation handler with proper state management
  const handleNavigation = useCallback((route, context = 'web3') => {
    navigate(route);
    setCurrentContext(context);
    setShowAIStudio(false);
  }, [navigate]);

  // Tab click handler with immediate state updates
  const handleTabClick = useCallback((tabId) => {
    const navItem = web3Navigation.find(nav => nav.id === tabId);
    if (navItem) {
      setActiveTab(tabId);
      setCurrentContext('web3');
      setShowAIStudio(false);
      navigate(navItem.route);
    }
  }, [navigate]);

  // Wallet connection handler
  const handleWalletConnect = useCallback(() => {
    if (!isWalletConnected) {
      setIsWalletConnected(true);
      setWalletAddress('0x742d...4B2f');
      setBalance('2.45');
    } else {
      setIsWalletConnected(false);
      setWalletAddress('');
      setBalance('0.00');
    }
  }, [isWalletConnected]);

  // AI Studio toggle with proper state synchronization
  const handleAIStudioToggle = useCallback(() => {
    const newShowState = !showAIStudio;
    setShowAIStudio(newShowState);
    
    // Update active tab state based on context
    if (newShowState) {
      // Opening AI Studio - set as active if not on a specific AI route
      if (currentContext !== 'ai') {
        setActiveTab('ai-studio');
      }
    } else {
      // Closing AI Studio - revert to appropriate tab
      if (currentContext !== 'ai') {
        const currentPath = location.pathname;
        const web3Route = web3Navigation.find(nav => nav.route === currentPath);
        setActiveTab(web3Route?.id || 'build');
      }
    }
  }, [showAIStudio, currentContext, location.pathname]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Click outside handler with proper cleanup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAIStudio && !event.target.closest('[data-ai-studio-container]')) {
        setShowAIStudio(false);
        
        // Reset tab state when closing AI Studio
        if (currentContext !== 'ai') {
          const currentPath = location.pathname;
          const web3Route = web3Navigation.find(nav => nav.route === currentPath);
          setActiveTab(web3Route?.id || 'build');
        }
      }
    };

    if (showAIStudio) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAIStudio, currentContext, location.pathname]);

  return (
    <>
      {/* Apple-Style Transparent Header with proper backdrop */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isScrolled 
          ? "bg-surface/95 backdrop-blur-xl border-b border-border/50 shadow-lg" 
          : "bg-transparent"
      )}>
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Logo Section - ENHANCED ACCESSIBILITY */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
            aria-label="BitLink Web3 Platform Home"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg">
              <Icon name="Link2" size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent">BitLink</span>
            <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20">Web3</span>
          </Link>

          {/* Desktop Navigation - IMPROVED CONTRAST & ACCESSIBILITY */}
          <nav className="hidden lg:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
            {web3Navigation.map((item) => {
              const isActive = activeTab === item.id && currentContext === 'web3';
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isActive 
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-lg contrast-more:bg-primary contrast-more:text-white" 
                      : "text-text-secondary hover:text-text-primary hover:bg-muted/60 hover:backdrop-blur-sm contrast-more:text-black"
                  )}
                  title={item.description}
                  aria-label={`Navigate to ${item.name}: ${item.description}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}
            
            {/* CRITICAL FIX: AI Studio Access with enhanced visibility */}
            <div className="relative" data-ai-studio-container>
              <Button
                variant={activeTab === 'ai-studio' || currentContext === 'ai' ? 'default' : 'ghost'}
                onClick={handleAIStudioToggle}
                iconName="Sparkles"
                iconPosition="left"
                className={cn(
                  "transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  (activeTab === 'ai-studio' || currentContext === 'ai') && "bg-gradient-to-r from-accent to-primary text-white shadow-lg",
                  showAIStudio && currentContext !== 'ai' && "bg-primary/15 text-primary border border-primary/30"
                )}
                data-ai-studio-trigger
                aria-label="Open AI Studio tools"
                aria-expanded={showAIStudio}
                aria-haspopup="true"
              >
                AI Studio
                <Icon name="ChevronDown" size={14} className={cn("transition-transform duration-300", showAIStudio && "rotate-180")} />
              </Button>

              {/* CRITICAL FIX: AI Tools Dropdown - Enhanced text contrast & mobile scrolling */}
              {showAIStudio && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-surface/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-border/50 bg-primary/10">
                    <h3 className="font-semibold text-text-primary contrast-more:text-black flex items-center gap-2">
                      <Icon name="Sparkles" size={16} className="text-accent" />
                      AI Creative Studio
                    </h3>
                    <p className="text-xs text-text-secondary contrast-more:text-gray-800 contrast-more:font-medium mt-1">
                      AI tools for content creation
                    </p>
                  </div>
                  <div className="p-2 max-h-80 overflow-y-auto mobile-scroll-container scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <div className="space-y-1">
                      {aiTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleNavigation(tool.route, 'ai')}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/70 active:bg-muted/90 transition-all duration-300 text-left group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface min-h-[56px] touch-manipulation"
                          aria-label={`Open ${tool.name}: ${tool.description}`}
                        >
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r shrink-0 shadow-md", tool.gradient)}>
                            <Icon name={tool.icon} size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text-primary contrast-more:text-black contrast-more:font-semibold text-sm truncate">
                                {tool.name}
                              </span>
                              {tool.isNew && (
                                <span className="px-1.5 py-0.5 bg-gradient-to-r from-accent to-primary text-white text-[10px] rounded-full font-medium shrink-0">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary contrast-more:text-gray-700 contrast-more:font-medium truncate">
                              {tool.description}
                            </p>
                          </div>
                          <Icon name="ChevronRight" size={16} className="text-text-secondary group-hover:text-text-primary contrast-more:text-gray-700 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ENHANCED: Wallet Status & Actions with better accessibility */}
          <div className="flex items-center space-x-3">
            {/* Desktop Wallet Status - IMPROVED CONTRAST */}
            {isWalletConnected ? (
              <div className="hidden sm:flex items-center space-x-2 bg-success/15 text-success px-3 py-2 rounded-xl border border-success/30 contrast-more:bg-success contrast-more:text-white">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium font-mono contrast-more:font-bold">{formatAddress(walletAddress)}</span>
                  <span className="text-xs opacity-80 contrast-more:opacity-100">{balance} ETH</span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 bg-warning/15 text-warning px-3 py-2 rounded-xl border border-warning/30 contrast-more:bg-warning contrast-more:text-black">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs font-medium contrast-more:font-bold">Not Connected</span>
              </div>
            )}

            {/* Connect/Disconnect Button - ENHANCED ACCESSIBILITY */}
            <Button
              variant={isWalletConnected ? "outline" : "default"}
              size="sm"
              onClick={handleWalletConnect}
              iconName={isWalletConnected ? "LogOut" : "Wallet"}
              iconPosition="left"
              className="hidden sm:flex hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={isWalletConnected ? 'Disconnect wallet' : 'Connect wallet'}
            >
              {isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
            </Button>

            {/* Mobile Wallet Button - ENHANCED TOUCH TARGET */}
            <Button
              variant={isWalletConnected ? "outline" : "default"}
              size="icon"
              onClick={handleWalletConnect}
              className="sm:hidden min-h-[44px] min-w-[44px] hover:scale-105 transition-transform duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={isWalletConnected ? 'Disconnect wallet' : 'Connect wallet'}
            >
              <Icon name={isWalletConnected ? "LogOut" : "Wallet"} size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* CRITICAL FIX: AI Studio Mobile Slide-Up Panel - Enhanced text contrast & scrolling */}
      {showAIStudio && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-end backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAIStudio(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="AI Studio Tools"
        >
          <div className="w-full bg-surface/98 backdrop-blur-xl rounded-t-3xl max-h-[85vh] overflow-hidden border-t border-border/60 shadow-2xl" data-ai-studio-container>
            <div className="p-4 border-b border-border/50 bg-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center shadow-lg">
                    <Icon name="Sparkles" size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary contrast-more:text-black">AI Studio</h2>
                    <p className="text-xs text-text-secondary contrast-more:text-gray-800 contrast-more:font-medium">
                      AI tools for content creation
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAIStudio(false)}
                  className="min-h-[44px] min-w-[44px] hover:scale-105 transition-transform duration-300 touch-manipulation text-text-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  iconName="X"
                  aria-label="Close AI Studio"
                />
              </div>
            </div>
            
            {/* CRITICAL FIX: Enhanced mobile scrolling with proper safe areas */}
            <div className="overflow-y-auto mobile-scroll-container scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="p-4 space-y-3 pb-6">
                {aiTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleNavigation(tool.route, 'ai')}
                    className="flex items-center gap-4 p-4 bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 hover:bg-muted/70 active:bg-muted/90 transition-all duration-300 text-left group hover:scale-[1.02] w-full touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface min-h-[72px] shadow-sm"
                    aria-label={`Open ${tool.name}: ${tool.description}`}
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r shrink-0 shadow-lg", tool.gradient)}>
                      <Icon name={tool.icon} size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary contrast-more:text-black contrast-more:font-bold truncate">
                          {tool.name}
                        </h3>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-gradient-to-r from-accent to-primary text-white text-xs rounded-full font-medium shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary contrast-more:text-gray-700 contrast-more:font-medium text-sm truncate">
                        {tool.description}
                      </p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-text-secondary group-hover:text-text-primary contrast-more:text-gray-700 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
              {/* Enhanced safe area for better scrolling */}
              <div className="h-8 safe-area-pb"></div>
            </div>
          </div>
        </div>
      )}

      {/* CRITICAL FIX: Enhanced Mobile Bottom Navigation - Fixed positioning for scrolling */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/98 backdrop-blur-xl border-t border-border/50 z-50 shadow-2xl">
        {/* CRITICAL FIX: Enhanced safe area handling to prevent disconnection */}
        <div className="safe-area-pb" style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'var(--color-surface)',
          position: 'sticky',
          bottom: 0,
          zIndex: 51
        }}>
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
                      ? "text-primary bg-primary/15 border border-primary/30 shadow-lg backdrop-blur-sm contrast-more:bg-primary contrast-more:text-white" 
                      : "text-text-secondary hover:text-text-primary hover:bg-muted/50 contrast-more:text-black"
                  )}
                  aria-label={`Navigate to ${nav.name}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive && "bg-gradient-to-r shadow-lg " + nav.gradient
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
            
            {/* AI Studio Access Button - CRITICAL FIX for highlighting */}
            <button
              onClick={handleAIStudioToggle}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 rounded-2xl text-xs font-medium transition-all duration-300 min-w-[44px] min-h-[44px] touch-manipulation hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                (activeTab === 'ai-studio' || currentContext === 'ai')
                  ? "text-accent bg-accent/15 border border-accent/30 shadow-lg backdrop-blur-sm contrast-more:bg-accent contrast-more:text-white" 
                  : "text-text-secondary hover:text-text-primary hover:bg-muted/50 contrast-more:text-black"
              )}
              data-ai-studio-trigger
              aria-label="Open AI Studio"
              aria-expanded={showAIStudio}
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