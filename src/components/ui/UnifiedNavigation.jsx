import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const web3Navigation = useMemo(() => [
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
  ], []);

  // AI Studio Tools (Secondary Features)
  const aiTools = useMemo(() => [
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
  ], []);

  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');

  // CRITICAL FIX: Add missing handleWalletConnect function
  const handleWalletConnect = useCallback(async () => {
    try {
      if (isWalletConnected) {
        // Disconnect wallet
        setIsWalletConnected(false);
        setWalletAddress('');
        setBalance('0.00');
        console.log('Wallet disconnected');
      } else {
        // Connect wallet
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setWalletAddress(accounts[0]);
            
            // Get balance
            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest']
            });
            
            // Convert from wei to ETH
            const ethBalance = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
            setBalance(ethBalance);
            
            console.log('Wallet connected:', accounts[0]);
          }
        } else {
          // No wallet found
          alert('Please install MetaMask or another Web3 wallet to connect.');
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  }, [isWalletConnected]);

  // CRITICAL FIX: Enhanced scroll detection with better performance and debouncing
  useEffect(() => {
    let timeoutId;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsScrolled(scrollTop > 10);
          }, 16); // 60fps throttling
          ticking = false;
        });
        ticking = true;
      }
    };

    // CRITICAL FIX: Better event listener options for performance
    window.addEventListener('scroll', handleScroll, { passive: true, capture: false });
    
    // Set initial state
    const initialScroll = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(initialScroll > 10);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // CRITICAL FIX: Enhanced route detection with better error handling
  useEffect(() => {
    const currentPath = location.pathname;
    
    try {
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
        setShowAIStudio(false);
      } else {
        // For unknown routes, maintain current state but close AI Studio
        setShowAIStudio(false);
      }
    } catch (error) {
      console.error('Navigation route detection error:', error);
      // Fallback to safe state
      setActiveTab('build');
      setCurrentContext('web3');
      setShowAIStudio(false);
    }
  }, [location.pathname, aiTools, web3Navigation]);

  // CRITICAL FIX: Enhanced click outside handler with better performance and error handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        if (showAIStudio && event.target && !event.target.closest('[data-ai-studio-container]')) {
          setShowAIStudio(false);
          
          // Reset tab state when closing AI Studio
          if (currentContext !== 'ai') {
            const currentPath = location.pathname;
            const web3Route = web3Navigation.find(nav => nav.route === currentPath);
            setActiveTab(web3Route?.id || 'build');
          }
        }
      } catch (error) {
        console.error('Click outside handler error:', error);
        // Fallback: close AI Studio
        setShowAIStudio(false);
      }
    };

    if (showAIStudio) {
      // CRITICAL FIX: Use capture phase for better performance and reliability
      document.addEventListener('mousedown', handleClickOutside, { capture: true, passive: true });
      document.addEventListener('touchstart', handleClickOutside, { passive: true, capture: true });
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
      document.removeEventListener('touchstart', handleClickOutside, { capture: true });
    };
  }, [showAIStudio, currentContext, location.pathname, web3Navigation]);

  // CRITICAL FIX: Enhanced navigation handler with error handling
  const handleNavigation = useCallback((route, context = 'web3') => {
    try {
      navigate(route);
      setCurrentContext(context);
      setShowAIStudio(false);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = route;
    }
  }, [navigate]);

  // CRITICAL FIX: Enhanced tab click handler with error handling
  const handleTabClick = useCallback((tabId) => {
    try {
      const navItem = web3Navigation.find(nav => nav.id === tabId);
      if (navItem) {
        setActiveTab(tabId);
        setCurrentContext('web3');
        setShowAIStudio(false);
        navigate(navItem.route);
      }
    } catch (error) {
      console.error('Tab click error:', error);
      // Fallback
      setActiveTab('build');
      navigate('/');
    }
  }, [navigate, web3Navigation]);

  // CRITICAL FIX: Enhanced AI Studio toggle with better state management
  const handleAIStudioToggle = useCallback(() => {
    try {
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
    } catch (error) {
      console.error('AI Studio toggle error:', error);
      setShowAIStudio(false);
    }
  }, [showAIStudio, currentContext, location.pathname, web3Navigation]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      {/* CRITICAL FIX: Enhanced Apple-Style Header with improved backdrop and accessibility */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out will-change-transform",
        isScrolled 
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-900/5" 
          : "bg-transparent"
      )}>
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Logo Section - Enhanced with better error handling */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
            aria-label="BitLink Web3 Platform Home"
            onClick={() => {
              setActiveTab('build');
              setCurrentContext('web3');
              setShowAIStudio(false);
            }}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg shadow-lg">
              <Icon name="Link2" size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 dark:from-white to-blue-600 dark:to-blue-400 bg-clip-text text-transparent contrast-more:text-black contrast-more:font-extrabold">
              BitLink
            </span>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-700 contrast-more:text-black contrast-more:bg-emerald-100 contrast-more:font-semibold">
              Web3
            </span>
          </Link>

          {/* Desktop Navigation - Enhanced with better accessibility */}
          <nav className="hidden lg:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
            {web3Navigation.map((item) => {
              const isActive = activeTab === item.id && currentContext === 'web3';
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] touch-manipulation",
                    isActive 
                      ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 shadow-lg backdrop-blur-sm contrast-more:bg-blue-600 contrast-more:text-white contrast-more:border-blue-800" 
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:backdrop-blur-sm contrast-more:text-black contrast-more:hover:bg-slate-200 contrast-more:font-semibold"
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
            
            {/* CRITICAL FIX: Enhanced AI Studio button with better state indication */}
            <div className="relative" data-ai-studio-container>
              <Button
                variant={activeTab === 'ai-studio' || currentContext === 'ai' ? 'default' : 'ghost'}
                onClick={handleAIStudioToggle}
                iconName="Sparkles"
                iconPosition="left"
                className={cn(
                  "transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation",
                  (activeTab === 'ai-studio' || currentContext === 'ai') && "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg contrast-more:bg-blue-600 contrast-more:text-white contrast-more:border-blue-800",
                  showAIStudio && currentContext !== 'ai' && "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 contrast-more:bg-blue-100 contrast-more:text-blue-900 contrast-more:border-blue-600"
                )}
                data-ai-studio-trigger
                aria-label="Open AI Studio tools"
                aria-expanded={showAIStudio}
                aria-haspopup="true"
              >
                AI Studio
                <Icon 
                  name="ChevronDown" 
                  size={14} 
                  className={cn(
                    "transition-transform duration-300 ml-1", 
                    showAIStudio && "rotate-180"
                  )} 
                />
              </Button>

              {/* CRITICAL FIX: Enhanced AI Tools Dropdown with MAXIMUM CONTRAST */}
              {showAIStudio && (
                <div className="absolute top-full right-0 mt-2 w-80 glass-morphism dark:glass-morphism-dark rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/95 dark:bg-slate-800/95">
                    <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 max-contrast-text dark:max-contrast-text-dark no-text-shadow">
                      <Icon name="Sparkles" size={16} className="text-emerald-600 dark:text-emerald-400" />
                      AI Creative Studio
                    </h3>
                    <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 max-contrast-text dark:max-contrast-text-dark no-text-shadow">
                      AI tools for content creation
                    </p>
                  </div>
                  <div className="p-2 max-h-80 overflow-y-auto mobile-scroll-container scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-500 scrollbar-track-transparent">
                    <div className="space-y-1">
                      {aiTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleNavigation(tool.route, 'ai')}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/80 active:bg-slate-200/90 dark:active:bg-slate-600/90 transition-all duration-300 text-left group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 min-h-[56px] touch-manipulation border border-transparent hover:border-slate-200/60 dark:hover:border-slate-600/60"
                          aria-label={`Open ${tool.name}: ${tool.description}`}
                        >
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r shrink-0 shadow-md", tool.gradient)}>
                            <Icon name={tool.icon} size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 dark:text-white text-sm truncate max-contrast-text dark:max-contrast-text-dark no-text-shadow">
                                {tool.name}
                              </span>
                              {tool.isNew && (
                                <span className="px-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-[10px] rounded-full font-medium shrink-0 shadow-sm">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 truncate max-contrast-text dark:max-contrast-text-dark no-text-shadow">
                              {tool.description}
                            </p>
                          </div>
                          <Icon 
                            name="ChevronRight" 
                            size={16} 
                            className="text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors shrink-0 max-contrast-text dark:max-contrast-text-dark" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ENHANCED: Wallet Status & Actions with improved contrast */}
          <div className="flex items-center space-x-3">
            {/* Desktop Wallet Status - IMPROVED CONTRAST */}
            {isWalletConnected ? (
              <div className="hidden sm:flex items-center space-x-2 bg-green-50/90 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-2 rounded-xl border border-green-200/60 dark:border-green-700/60 contrast-more:bg-green-100 contrast-more:text-green-800 contrast-more:border-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium font-mono contrast-more:font-bold">{formatAddress(walletAddress)}</span>
                  <span className="text-xs opacity-80 contrast-more:opacity-100 contrast-more:font-medium">{balance} ETH</span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 bg-amber-50/90 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-2 rounded-xl border border-amber-200/60 dark:border-amber-700/60 contrast-more:bg-amber-100 contrast-more:text-amber-800 contrast-more:border-amber-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full shadow-sm"></div>
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
              className="hidden sm:flex hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation"
              aria-label={isWalletConnected ? 'Disconnect wallet' : 'Connect wallet'}
            >
              {isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
            </Button>

            {/* Profile Actions - ENHANCED CONTRAST */}
            <div className="hidden sm:flex items-center space-x-2">
              <button 
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] touch-manipulation contrast-more:text-black contrast-more:hover:bg-slate-200"
                aria-label="Notifications"
              >
                <Icon name="Bell" size={18} />
              </button>
              <button 
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] touch-manipulation contrast-more:text-black contrast-more:hover:bg-slate-200"
                aria-label="Settings"
              >
                <Icon name="Settings" size={18} />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
            </div>

            {/* Mobile Combined Action Button */}
            <div className="sm:hidden flex items-center space-x-2">
              <Button
                variant={isWalletConnected ? "outline" : "default"}
                size="icon"
                onClick={handleWalletConnect}
                className="min-h-[48px] min-w-[48px] hover:scale-105 transition-transform duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={isWalletConnected ? 'Disconnect wallet' : 'Connect wallet'}
              >
                <Icon name={isWalletConnected ? "LogOut" : "Wallet"} size={16} />
              </Button>
              
              {/* Mobile Profile Photo */}
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CRITICAL FIX: AI Studio Mobile Slide-Up Panel - MAXIMUM CONTRAST AND ACCESSIBILITY */}
      {showAIStudio && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 dark:bg-black/80 z-[60] flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAIStudio(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="AI Studio Tools"
        >
          <div className="w-full glass-morphism dark:glass-morphism-dark rounded-t-3xl max-h-[85vh] overflow-hidden border-t border-slate-200/60 dark:border-slate-700/60 shadow-2xl" data-ai-studio-container>
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/95 dark:bg-slate-800/95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Icon name="Sparkles" size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white max-contrast-text dark:max-contrast-text-dark no-text-shadow">AI Studio</h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300 max-contrast-text dark:max-contrast-text-dark no-text-shadow">
                      AI tools for content creation
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAIStudio(false)}
                  className="min-h-[48px] min-w-[48px] hover:scale-105 transition-transform duration-300 touch-manipulation text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 max-contrast-text dark:max-contrast-text-dark"
                  iconName="X"
                  aria-label="Close AI Studio"
                />
              </div>
            </div>
            
            {/* CRITICAL FIX: Enhanced mobile scrolling with maximum contrast */}
            <div className="overflow-y-auto mobile-scroll-container scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-500 scrollbar-track-transparent" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="p-4 space-y-3 pb-6">
                {aiTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleNavigation(tool.route, 'ai')}
                    className="flex items-center gap-4 p-4 bg-slate-50/95 dark:bg-slate-800/95 rounded-2xl border-2 border-slate-200/70 dark:border-slate-600/70 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 active:bg-slate-200/90 dark:active:bg-slate-600/90 transition-all duration-300 text-left group hover:scale-[1.02] w-full touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 min-h-[76px] shadow-sm hover:shadow-md"
                    aria-label={`Open ${tool.name}: ${tool.description}`}
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r shrink-0 shadow-lg", tool.gradient)}>
                      <Icon name={tool.icon} size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-slate-900 dark:text-white truncate max-contrast-text dark:max-contrast-text-dark no-text-shadow">
                          {tool.name}
                        </h3>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-xs rounded-full font-medium shrink-0 shadow-sm">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm truncate max-contrast-text dark:max-contrast-text-dark no-text-shadow">
                        {tool.description}
                      </p>
                    </div>
                    <Icon 
                      name="ChevronRight" 
                      size={16} 
                      className="text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors shrink-0 max-contrast-text dark:max-contrast-text-dark" 
                    />
                  </button>
                ))}
              </div>
              {/* Enhanced safe area for better scrolling */}
              <div className="h-8 safe-area-pb"></div>
            </div>
          </div>
        </div>
      )}

      {/* CRITICAL FIX: Enhanced Mobile Bottom Navigation - BULLETPROOF POSITIONING */}
      <div 
        className="lg:hidden mobile-nav-enhanced"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 55,
          // CRITICAL: Force hardware acceleration and bulletproof positioning
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // CRITICAL: Isolate stacking context and prevent disconnection
          isolation: 'isolate',
          contain: 'layout style paint',
          // CRITICAL: Additional iOS Safari fixes
          WebkitTransformStyle: 'preserve-3d',
          perspective: 1000,
          // CRITICAL: Prevent any movement during scroll
          pointerEvents: 'auto',
          touchAction: 'manipulation'
        }}
      >
        {/* CRITICAL FIX: Enhanced safe area handling with bulletproof stacking */}
        <div 
          className="bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
          style={{
            borderTop: '1px solid rgba(148, 163, 184, 0.5)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            // CRITICAL: Additional positioning fixes
            position: 'relative',
            zIndex: 1,
            // CRITICAL: Prevent scroll interference
            overscrollBehavior: 'none',
            WebkitOverscrollBehavior: 'none'
          }}
        >
          <div 
            className="flex items-center justify-around px-2 py-3"
            style={{
              paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
              minHeight: '72px' // CRITICAL: Ensure minimum touch target height
            }}
          >
            {web3Navigation.slice(0, 4).map((nav) => {
              const isActive = activeTab === nav.id && currentContext === 'web3';
              return (
                <button
                  key={nav.id}
                  onClick={() => handleTabClick(nav.id)}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-2 rounded-2xl text-xs font-medium transition-all duration-300 min-w-[52px] min-h-[52px] touch-manipulation hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    isActive
                      ? "text-blue-700 dark:text-blue-300 bg-blue-500/15 border border-blue-500/30 shadow-lg backdrop-blur-sm contrast-more:bg-blue-600 contrast-more:text-white contrast-more:border-blue-800" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 contrast-more:text-black contrast-more:hover:bg-slate-200 contrast-more:font-semibold"
                  )}
                  aria-label={`Navigate to ${nav.name}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 mb-1",
                    isActive && "bg-gradient-to-r shadow-lg " + nav.gradient
                  )}>
                    <Icon 
                      name={nav.icon} 
                      size={16} 
                      className={isActive ? 'text-white' : 'text-current'} 
                    />
                  </div>
                  <span className="truncate max-w-[48px] leading-tight text-[10px] font-medium">
                    {nav.name}
                  </span>
                </button>
              );
            })}
            
            {/* AI Studio Access Button - CRITICAL FIX for highlighting and maximum contrast */}
            <button
              onClick={handleAIStudioToggle}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 rounded-2xl text-xs font-medium transition-all duration-300 min-w-[52px] min-h-[52px] touch-manipulation hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                (activeTab === 'ai-studio' || currentContext === 'ai')
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-lg backdrop-blur-sm contrast-more:bg-emerald-600 contrast-more:text-white contrast-more:border-emerald-800" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 contrast-more:text-black contrast-more:hover:bg-slate-200 contrast-more:font-semibold"
              )}
              data-ai-studio-trigger
              aria-label="Open AI Studio"
              aria-expanded={showAIStudio}
            >
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 mb-1",
                (activeTab === 'ai-studio' || currentContext === 'ai') && "bg-gradient-to-r from-emerald-500 to-blue-600 shadow-lg"
              )}>
                <Icon 
                  name="Sparkles" 
                  size={16} 
                  className={(activeTab === 'ai-studio' || currentContext === 'ai') ? 'text-white' : 'text-current'} 
                />
              </div>
              <span className="truncate max-w-[48px] leading-tight text-[10px] font-medium">
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