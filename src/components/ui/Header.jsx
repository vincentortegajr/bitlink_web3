import React from 'react';
import Icon from '../AppIcon';

const Header = () => {
  return (
    <div className="shrink-0 bg-surface/95 backdrop-blur-glass border-b border-border/50 shadow-subtle">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-text-primary tracking-tight">BitLink Web3</h1>
            <p className="text-xs text-text-secondary -mt-0.5">Profile Builder</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-muted/60 rounded-lg transition-all duration-200 hover:shadow-sm">
            <Icon name="Bell" size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-muted/60 rounded-lg transition-all duration-200 hover:shadow-sm">
            <Icon name="Settings" size={18} />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-full border-2 border-surface shadow-sm hover:shadow-md transition-shadow duration-200">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
