import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, counts }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const tabs = [
    {
      id: 'social-links',
      label: 'Social Links',
      icon: 'Link',
      count: counts.socialLinks || 0
    },
    {
      id: 'ebooks',
      label: 'Ebooks',
      icon: 'BookOpen',
      count: counts.ebooks || 0
    },
    {
      id: 'lead-magnets',
      label: 'Lead Magnets',
      icon: 'FormInput',
      count: counts.leadMagnets || 0
    }
  ];

  // Handle swipe gestures on mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      onTabChange(tabs[currentIndex + 1].id);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      onTabChange(tabs[currentIndex - 1].id);
    }
  };

  return (
    <div className="border-b border-border mb-6">
      {/* Desktop Tab Navigation */}
      <div className="hidden sm:flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 pb-4 border-b-2 transition-all duration-200
              ${activeTab === tab.id
                ? 'border-primary text-primary font-medium' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }
            `}
          >
            <Icon name={tab.icon} size={18} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${activeTab === tab.id
                  ? 'bg-primary/10 text-primary' :'bg-muted text-text-secondary'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile Tab Navigation with Swipe Support */}
      <div 
        className="sm:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all duration-200 min-w-0 flex-shrink-0
                ${activeTab === tab.id
                  ? 'border-primary text-primary font-medium bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab.icon} size={18} />
              <span className="text-sm">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  px-1.5 py-0.5 rounded-full text-xs font-medium
                  ${activeTab === tab.id
                    ? 'bg-primary/10 text-primary' :'bg-muted text-text-secondary'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Swipe Indicator */}
        <div className="flex justify-center mt-2 space-x-1">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${activeTab === tab.id ? 'bg-primary' : 'bg-border'}
              `}
            />
          ))}
        </div>

        {/* Swipe Hint */}
        <div className="text-center mt-2 mb-4">
          <p className="text-xs text-text-secondary">
            Swipe left or right to switch tabs
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;