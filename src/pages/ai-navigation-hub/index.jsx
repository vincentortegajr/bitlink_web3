import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

const AINavigationHub = () => {
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('explore'); // explore, create, organize, menu
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, text-to-image, image-to-image, etc.
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, trending
  const [communityFeed, setCommunityFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: 'user_creator',
    avatar: '/api/placeholder/40/40',
    creationsCount: 127,
    likesReceived: 1243
  });

  // AI Tools Configuration - Expandable Architecture
  const aiTools = [
    {
      id: 'text-to-image',
      name: 'Text-to-Image',
      description: 'Generate stunning images from text prompts',
      route: '/ai-text-to-image-generator',
      icon: 'ImageIcon',
      color: 'bg-blue-500',
      category: 'generate',
      preview: '/api/placeholder/300/300?text=AI+Generated',
      isNew: false,
      popularity: 9.2
    },
    {
      id: 'image-to-image',
      name: 'Image-to-Image',
      description: 'Transform and enhance existing images',
      route: '/ai-image-to-image-transformer',
      icon: 'RefreshCw',
      color: 'bg-purple-500',
      category: 'transform',
      preview: '/api/placeholder/300/300?text=Image+Transform',
      isNew: false,
      popularity: 8.7
    },
    {
      id: 'image-to-video',
      name: 'Image-to-Video',
      description: 'Create dynamic videos from static images',
      route: '/ai-image-to-video-creator',
      icon: 'Video',
      color: 'bg-green-500',
      category: 'animate',
      preview: '/api/placeholder/300/300?text=Video+Creation',
      isNew: false,
      popularity: 8.9
    },
    {
      id: 'video-to-lipsync',
      name: 'Video-to-Lipsync',
      description: 'Sync lips to audio with AI precision',
      route: '/ai-video-to-lipsync-generator',
      icon: 'Mic',
      color: 'bg-red-500',
      category: 'sync',
      preview: '/api/placeholder/300/300?text=Lip+Sync',
      isNew: true,
      popularity: 7.8
    },
    {
      id: 'text-to-audio',
      name: 'Text-to-Audio',
      description: 'Generate realistic speech and sounds',
      route: '/ai-text-to-audio-generator',
      icon: 'Volume2',
      color: 'bg-orange-500',
      category: 'audio',
      preview: '/api/placeholder/300/300?text=Audio+Gen',
      isNew: true,
      popularity: 8.1
    }
  ];

  // Mock community creations data
  const mockCommunityData = [
    {
      id: '1',
      type: 'text-to-image',
      image: '/api/placeholder/400/400?text=Cyberpunk+City',
      prompt: 'Cyberpunk city at night with neon lights',
      user: { username: 'cyber_artist', avatar: '/api/placeholder/32/32' },
      likes: 234,
      isPublic: true,
      createdAt: '2 hours ago',
      tool: 'Text-to-Image'
    },
    {
      id: '2',
      type: 'image-to-video',
      image: '/api/placeholder/400/600?text=Ocean+Waves',
      prompt: 'Calming ocean waves animation',
      user: { username: 'nature_lover', avatar: '/api/placeholder/32/32' },
      likes: 189,
      isPublic: true,
      createdAt: '4 hours ago',
      tool: 'Image-to-Video'
    },
    {
      id: '3',
      type: 'image-to-image',
      image: '/api/placeholder/300/400?text=Portrait+Art',
      prompt: 'Renaissance style portrait transformation',
      user: { username: 'art_master', avatar: '/api/placeholder/32/32' },
      likes: 456,
      isPublic: true,
      createdAt: '6 hours ago',
      tool: 'Image Transform'
    },
    {
      id: '4',
      type: 'video-to-lipsync',
      image: '/api/placeholder/400/300?text=Lip+Sync+Demo',
      prompt: 'Character speaking with perfect sync',
      user: { username: 'sync_pro', avatar: '/api/placeholder/32/32' },
      likes: 321,
      isPublic: true,
      createdAt: '8 hours ago',
      tool: 'Lip Sync'
    },
    {
      id: '5',
      type: 'text-to-image',
      image: '/api/placeholder/500/300?text=Fantasy+Dragon',
      prompt: 'Majestic dragon in fantasy landscape',
      user: { username: 'fantasy_world', avatar: '/api/placeholder/32/32' },
      likes: 678,
      isPublic: true,
      createdAt: '12 hours ago',
      tool: 'Text-to-Image'
    },
    {
      id: '6',
      type: 'image-to-video',
      image: '/api/placeholder/300/500?text=Space+Galaxy',
      prompt: 'Spiral galaxy rotation animation',
      user: { username: 'space_explorer', avatar: '/api/placeholder/32/32' },
      likes: 543,
      isPublic: true,
      createdAt: '1 day ago',
      tool: 'Image-to-Video'
    }
  ];

  // Load community feed data
  useEffect(() => {
    const loadCommunityFeed = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCommunityFeed(mockCommunityData);
      } catch (error) {
        console.error('Failed to load community feed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunityFeed();
  }, [sortBy, filterType]);

  // Filter and sort community feed
  const filteredFeed = communityFeed.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleToolNavigation = (tool) => {
    navigate(tool.route);
  };

  const handleLike = (creationId) => {
    setCommunityFeed(prev => prev.map(item => 
      item.id === creationId 
        ? { ...item, likes: item.likes + 1 }
        : item
    ));
  };

  const handleShare = (creation) => {
    if (navigator.share) {
      navigator.share({
        title: `${creation.tool} Creation`,
        text: creation.prompt,
        url: window.location.href
      });
    } else {
      // Fallback for desktop
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRemix = (creation) => {
    const tool = aiTools.find(t => t.type === creation.type);
    if (tool) {
      navigate(tool.route, { state: { remix: creation } });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      {/* Desktop Header Navigation */}
      <div className="hidden md:block sticky top-16 bg-surface/95 backdrop-blur-glass border-b border-border z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-text-primary">AI Creative Hub</h1>
              <div className="flex items-center gap-4">
                {['explore', 'create', 'organize'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium capitalize transition-all",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-text-secondary hover:text-text-primary hover:bg-muted"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-64">
                <Input
                  placeholder="Search creations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              </div>
              
              {/* Filter Dropdown */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
              >
                <option value="all">All Tools</option>
                <option value="text-to-image">Text-to-Image</option>
                <option value="image-to-image">Image Transform</option>
                <option value="image-to-video">Image-to-Video</option>
                <option value="video-to-lipsync">Video Lip Sync</option>
              </select>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
              >
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Header */}
      <div className="md:hidden sticky top-16 bg-surface/95 backdrop-blur-glass border-b border-border z-40">
        <div className="px-4 py-3">
          <div className="relative">
            <Input
              placeholder="Search AI creations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Create Menu Overlay (Mobile) */}
        {showCreateMenu && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="w-full bg-surface rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">AI Creation Tools</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateMenu(false)}
                  iconName="X"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {aiTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      handleToolNavigation(tool);
                      setShowCreateMenu(false);
                    }}
                    className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", tool.color)}>
                      <Icon name={tool.icon} size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text-primary">{tool.name}</h3>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-md font-medium">
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
        )}

        {/* Tab Content */}
        {activeTab === 'explore' && (
          <div>
            {/* Featured AI Tools Grid (Desktop) */}
            <div className="hidden md:block mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">AI Creative Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {aiTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolNavigation(tool)}
                    className="group cursor-pointer bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={tool.preview}
                        alt={tool.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={cn("absolute top-3 left-3 w-10 h-10 rounded-lg flex items-center justify-center", tool.color)}>
                        <Icon name={tool.icon} size={16} className="text-white" />
                      </div>
                      {tool.isNew && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-accent rounded-md">
                          <span className="text-xs font-medium text-white">NEW</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-text-primary mb-1">{tool.name}</h3>
                      <p className="text-text-secondary text-sm">{tool.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-text-secondary">★ {tool.popularity}</span>
                        <Button size="sm" variant="ghost" iconName="ArrowRight" iconPosition="right">
                          Try Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Feed - Masonry Style Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary">Community Creations</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" iconName="Filter">
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                  <Button variant="outline" size="sm" iconName="SortAsc">
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg aspect-square mb-3"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredFeed.map((creation) => (
                    <div
                      key={creation.id}
                      className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="relative">
                        <img
                          src={creation.image}
                          alt={creation.prompt}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(creation.id);
                            }}
                            className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                          >
                            <Icon name="Heart" size={14} />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(creation);
                            }}
                            className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                          >
                            <Icon name="Share" size={14} />
                          </Button>
                        </div>

                        {/* Tool Badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-md">
                            {creation.tool}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={creation.user.avatar}
                            alt={creation.user.username}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium text-text-primary">
                            {creation.user.username}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {creation.createdAt}
                          </span>
                        </div>
                        
                        <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                          {creation.prompt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-text-secondary">
                            <Icon name="Heart" size={14} />
                            <span className="text-sm">{creation.likes}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemix(creation)}
                            iconName="RefreshCw"
                            iconPosition="left"
                          >
                            Remix
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Create with AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleToolNavigation(tool)}
                  className="group cursor-pointer bg-card rounded-xl border p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center", tool.color)}>
                      <Icon name={tool.icon} size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-text-primary text-lg">{tool.name}</h3>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-md font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary">{tool.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-text-secondary">
                      ★ {tool.popularity} rating
                    </div>
                    <Button variant="primary" iconName="ArrowRight" iconPosition="right">
                      Create Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'organize' && (
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-text-primary mb-6">My Creations</h2>
            <div className="bg-card rounded-lg border p-8 text-center">
              <Icon name="FolderOpen" size={48} className="text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No Creations Yet</h3>
              <p className="text-text-secondary mb-6">Start creating with AI tools to see your work here</p>
              <Button onClick={() => setActiveTab('create')} iconName="Plus" iconPosition="left">
                Create First Project
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation - Midjourney Style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-glass border-t border-border z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {[
            { id: 'menu', label: 'Menu', icon: 'Menu' },
            { id: 'explore', label: 'Explore', icon: 'Compass' },
            { id: 'create', label: 'Create', icon: 'Plus' },
            { id: 'organize', label: 'Organize', icon: 'FolderOpen' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'create') {
                  setShowCreateMenu(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-all min-w-[44px] min-h-[44px] touch-manipulation",
                activeTab === tab.id && tab.id !== 'create'
                  ? "text-primary bg-primary/10 border border-primary/20" :"text-text-secondary hover:text-text-primary hover:bg-muted/50"
              )}
            >
              <Icon 
                name={tab.icon} 
                size={20} 
                className={activeTab === tab.id && tab.id !== 'create' ? 'text-primary' : 'text-current'} 
              />
              <span className="truncate max-w-[60px] leading-tight">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AINavigationHub;