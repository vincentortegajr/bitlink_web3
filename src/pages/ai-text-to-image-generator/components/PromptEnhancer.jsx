import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';


const PromptEnhancer = ({ onEnhance, loading = false }) => {
  const [suggestions] = useState([
    "Ultra high resolution, 8K",
    "Professional photography",
    "Cinematic lighting",
    "Hyperrealistic",
    "Award-winning composition",
    "Vibrant colors",
    "Sharp focus",
    "Dramatic shadows"
  ]);

  const [styles] = useState([
    { id: 'photorealistic', label: 'Photorealistic', icon: 'Camera' },
    { id: 'artistic', label: 'Artistic', icon: 'Palette' },
    { id: 'anime', label: 'Anime', icon: 'Sparkles' },
    { id: 'digital-art', label: 'Digital Art', icon: 'Monitor' },
    { id: 'oil-painting', label: 'Oil Painting', icon: 'Paintbrush2' },
    { id: 'watercolor', label: 'Watercolor', icon: 'Droplets' }
  ]);

  const handleSuggestionClick = (suggestion) => {
    onEnhance?.(suggestion);
  };

  const handleStyleClick = (style) => {
    onEnhance?.(style.label + " style");
  };

  return (
    <div className="space-y-4">
      {/* Style Presets */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3">Style Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {styles.map((style) => (
            <Button
              key={style.id}
              variant="outline"
              size="sm"
              onClick={() => handleStyleClick(style)}
              disabled={loading}
              className="justify-start h-10"
              iconName={style.icon}
              iconPosition="left"
            >
              <span className="truncate">{style.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Quality Enhancers */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3">Quality Enhancers</h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={loading}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-colors",
                "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "bg-background text-text-secondary border-border"
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-2 border-t">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEnhance?.("trending on artstation")}
            disabled={loading}
            iconName="TrendingUp"
            iconPosition="left"
          >
            Trending
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEnhance?.("masterpiece, best quality")}
            disabled={loading}
            iconName="Star"
            iconPosition="left"
          >
            Masterpiece
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEnhance?.("highly detailed")}
            disabled={loading}
            iconName="ZoomIn"
            iconPosition="left"
          >
            Detailed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptEnhancer;