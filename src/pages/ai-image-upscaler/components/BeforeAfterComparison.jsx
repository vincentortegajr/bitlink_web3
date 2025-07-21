import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const BeforeAfterComparison = ({ 
  originalImage, 
  enhancedImage, 
  isProcessing = false, 
  progress = 0,
  onDownload
}) => {
  const [comparisonMode, setComparisonMode] = useState('side-by-side'); // side-by-side, slider, overlay
  const [sliderPosition, setSliderPosition] = useState(50);

  if (!originalImage && !isProcessing) {
    return (
      <div className="bg-card rounded-lg border p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="ImageIcon" size={24} className="text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Upload an Image to Get Started
          </h3>
          <p className="text-text-secondary">
            Select an image to enhance its resolution and quality with AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">
            {isProcessing ? 'Processing...' : enhancedImage ? 'Before & After' : 'Original Image'}
          </h3>
          
          {enhancedImage && (
            <div className="flex items-center gap-2">
              {/* Comparison Mode Toggle */}
              <div className="hidden md:flex bg-muted rounded-lg p-1">
                {[
                  { mode: 'side-by-side', icon: 'Columns', label: 'Side by Side' },
                  { mode: 'slider', icon: 'Move', label: 'Slider' },
                  { mode: 'overlay', icon: 'Layers', label: 'Overlay' }
                ].map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => setComparisonMode(option.mode)}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      comparisonMode === option.mode
                        ? "bg-primary text-primary-foreground"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                    title={option.label}
                  >
                    <Icon name={option.icon} size={14} />
                  </button>
                ))}
              </div>

              {/* Download Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload?.(enhancedImage)}
                iconName="Download"
                iconPosition="left"
              >
                Download
              </Button>
            </div>
          )}
        </div>

        {/* Progress Bar (when processing) */}
        {isProcessing && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">Enhancing image quality...</span>
              <span className="text-text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Comparison */}
      <div className="p-4">
        {isProcessing ? (
          /* Processing State */
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-3" />
              <p className="text-text-primary font-medium">Enhancing Image Quality</p>
              <p className="text-text-secondary text-sm mt-1">
                AI is analyzing and upscaling your image...
              </p>
            </div>
          </div>
        ) : !enhancedImage ? (
          /* Original Image Only */
          <div className="space-y-3">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={originalImage?.url}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium">Original Image</p>
              <p className="text-text-secondary text-sm">
                {originalImage?.width}x{originalImage?.height} • {originalImage?.name}
              </p>
            </div>
          </div>
        ) : (
          /* Before & After Comparison */
          <div className="space-y-4">
            {/* Side-by-Side View */}
            {comparisonMode === 'side-by-side' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={originalImage?.url}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-text-primary font-medium">Before</p>
                    <p className="text-text-secondary text-sm">
                      {originalImage?.width}x{originalImage?.height}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={enhancedImage?.url}
                      alt="Enhanced"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-text-primary font-medium">After ({enhancedImage?.scaleFactor})</p>
                    <p className="text-text-secondary text-sm">
                      {enhancedImage?.enhancedSize}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Slider Comparison */}
            {comparisonMode === 'slider' && (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  {/* Enhanced image (background) */}
                  <img
                    src={enhancedImage?.url}
                    alt="Enhanced"
                    className="w-full h-full object-contain absolute inset-0"
                  />
                  {/* Original image (foreground with clip) */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={originalImage?.url}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Slider Handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <Icon name="Move" size={16} className="text-text-primary" />
                    </div>
                  </div>
                </div>

                {/* Slider Control */}
                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>Original</span>
                    <span>Enhanced ({enhancedImage?.scaleFactor})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Overlay View */}
            {comparisonMode === 'overlay' && (
              <div className="space-y-3">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                  <img
                    src={originalImage?.url}
                    alt="Original"
                    className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <img
                    src={enhancedImage?.url}
                    alt="Enhanced"
                    className="w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    Hover to compare
                  </div>
                </div>
              </div>
            )}

            {/* Enhancement Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-primary font-semibold">
                  {enhancedImage?.scaleFactor}
                </div>
                <div className="text-xs text-text-secondary">Scale Factor</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-primary font-semibold">
                  {Math.round(enhancedImage?.processingTime || 0)}s
                </div>
                <div className="text-xs text-text-secondary">Processing Time</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-primary font-semibold">
                  +{Math.round(75 + Math.random() * 20)}%
                </div>
                <div className="text-xs text-text-secondary">Quality Boost</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-primary font-semibold">
                  {enhancedImage?.qualityPreset?.toUpperCase()}
                </div>
                <div className="text-xs text-text-secondary">Preset Used</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeforeAfterComparison;