import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { cn } from '../../utils/cn';

const web3Navigation = [
  { id: 'build', name: 'Build', route: '/profile-builder-dashboard', icon: 'User' },
  { id: 'manage', name: 'Manage', route: '/link-content-management', icon: 'Link' },
  { id: 'payments', name: 'Payments', route: '/crypto-payment-setup', icon: 'CreditCard' },
  { id: 'leads', name: 'Leads', route: '/lead-generation-hub', icon: 'Target' },
  { id: 'analytics', name: 'Analytics', route: '/analytics-performance-dashboard', icon: 'BarChart3' },
];

const aiTools = [
  { id: 'text-to-image', name: 'Text-to-Image', route: '/ai-text-to-image-generator', icon: 'ImageIcon' },
  { id: 'image-to-image', name: 'Image-to-Image', route: '/ai-image-to-image-transformer', icon: 'RefreshCw' },
  { id: 'image-to-video', name: 'Image-to-Video', route: '/ai-image-to-video-creator', icon: 'Video' },
  { id: 'video-lipsync', name: 'Video-to-Lipsync', route: '/ai-video-to-lipsync-generator', icon: 'Mic' },
  { id: 'text-to-audio', name: 'Text-to-Audio', route: '/ai-text-to-audio-generator', icon: 'Volume2' },
  { id: 'image-upscaler', name: 'Image Upscaler', route: '/ai-image-upscaler', icon: 'Maximize2' },
  { id: 'image-realism', name: 'Image Realism', route: '/ai-image-realism-model', icon: 'Sparkles' },
  { id: 'ai-chat-assistant', name: 'AI Chat Assistant', route: '/ai-chat-assistant', icon: 'MessageCircle' },
];

const BetterNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState('build');
  const [showAIStudio, setShowAIStudio] = useState(false);

  useEffect(() => {
    const current = [...web3Navigation, ...aiTools].find(i => i.route === location.pathname);
    if (current) {
      setActive(current.id);
    }
  }, [location.pathname]);

  const handleNavigate = (route, id) => {
    setActive(id);
    navigate(route);
    setShowAIStudio(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-glass border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2" aria-label="Home">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
              <Icon name="Link2" size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-text-primary">BitLink</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-3" aria-label="Main navigation">
            {web3Navigation.map(item => (
              <Button
                key={item.id}
                variant={active === item.id ? 'default' : 'ghost'}
                onClick={() => handleNavigate(item.route, item.id)}
                iconName={item.icon}
                size="sm"
                aria-current={active === item.id ? 'page' : undefined}
              >
                {item.name}
              </Button>
            ))}
            <Button
              variant={active.startsWith('ai') ? 'default' : 'ghost'}
              onClick={() => setShowAIStudio(!showAIStudio)}
              iconName="Sparkles"
              size="sm"
              aria-expanded={showAIStudio}
              aria-haspopup="true"
              aria-current={active.startsWith('ai') ? 'page' : undefined}
            >
              AI Studio
            </Button>
          </nav>
        </div>
        {showAIStudio && (
          <div
            className="hidden md:block absolute right-4 top-16 bg-card border border-border rounded-xl shadow-xl w-60 p-2 z-50"
            role="menu"
            aria-label="AI tools"
          >
            {aiTools.map(tool => (
              <Button
                key={tool.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigate(tool.route, tool.id)}
                iconName={tool.icon}
                role="menuitem"
              >
                {tool.name}
              </Button>
            ))}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-glass border-t border-border">
        <div className="flex items-center justify-around py-2">
          {web3Navigation.slice(0,4).map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.route, item.id)}
              className={cn(
                'flex flex-col items-center text-xs font-medium px-2',
                active === item.id ? 'text-primary' : 'text-text-secondary'
              )}
              aria-label={item.name}
              aria-current={active === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={20} />
              <span className="mt-1">{item.name}</span>
            </button>
          ))}
          <button
            onClick={() => setShowAIStudio(!showAIStudio)}
            className={cn(
              'flex flex-col items-center text-xs font-medium px-2',
              active.startsWith('ai') ? 'text-accent' : 'text-text-secondary'
            )}
            aria-label="AI Studio"
            aria-expanded={showAIStudio}
            aria-current={active.startsWith('ai') ? 'page' : undefined}
          >
            <Icon name="Sparkles" size={20} />
            <span className="mt-1">AI Studio</span>
          </button>
        </div>
      </nav>

      {/* Mobile AI Studio Panel */}
      {showAIStudio && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 flex items-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAIStudio(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-card rounded-t-2xl w-full max-h-[80vh] overflow-y-auto p-4 space-y-2"
            role="menu"
            aria-label="AI tools"
          >
            {aiTools.map(tool => (
              <Button
                key={tool.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigate(tool.route, tool.id)}
                iconName={tool.icon}
                role="menuitem"
              >
                {tool.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BetterNavigation;
