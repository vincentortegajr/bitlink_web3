import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ComparisonView = ({
  originalImage,
  transformedImages = [],
  isTransforming = false,
  progress = 0,
  onDownload,
  onRegenerate,
  onApplyToProfile
}) => {
  const [selectedTransformIndex, setSelectedTransformIndex] = useState(0);
  const [comparisonMode, setComparisonMode] = useState('side-by-side'); // 'side-by-side', 'before-after', 'overlay'
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // For before-after slider

  const selectedTransform = transformedImages[selectedTransformIndex];

  const handleSliderChange = (e) => {
    setSliderPosition(parseInt(e.target.value));
  };

  const handleDownload = (image) => {
    if (image?.url) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `transformed-${image.id || Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleApplyToProfile = (image) => {
    onApplyToProfile?.(image);
  };

  const renderProcessing = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 mx-auto">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div>
          <p className="font-medium text-text-primary">Transforming Image...</p>
          <p className="text-sm text-text-secondary">Processing on RunPod GPU</p>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-3">
        <Icon name="Images" size={48} className="text-muted-foreground mx-auto" />
        <div>
          <p className="font-medium text-text-primary">Ready to Transform</p>
          <p className="text-sm text-text-secondary">Upload an image and configure settings</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Comparison Mode Selector */}
      {originalImage && transformedImages.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex rounded-lg bg-muted p-1">
            {[
              { id: 'side-by-side', label: 'Side by Side', icon: 'Columns' },
              { id: 'before-after', label: 'Before/After', icon: 'ArrowLeftRight' },
              { id: 'overlay', label: 'Overlay', icon: 'Layers' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setComparisonMode(mode.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  comparisonMode === mode.id
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Icon name={mode.icon} size={14} />
                {mode.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullscreen(true)}
            iconName="Maximize2"
            iconPosition="left"
          >
            Fullscreen
          </Button>
        </div>
      )}

      {/* Main Comparison Area */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="aspect-video bg-muted/30 relative min-h-[300px] md:min-h-[400px]">
          {isTransforming ? (
            renderProcessing()
          ) : !originalImage ? (
            renderEmptyState()
          ) : transformedImages.length === 0 ? (
            // Show only original image
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={originalImage.url}
                alt="Original"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : comparisonMode === 'side-by-side' ? (
            // Side by side comparison
            <div className="grid grid-cols-2 h-full gap-1">
              <div className="relative bg-background flex items-center justify-center">
                <img
                  src={originalImage.url}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-white text-sm font-medium">Original</span>
                </div>
              </div>
              <div className="relative bg-background flex items-center justify-center">
                <img
                  src={selectedTransform?.url}
                  alt="Transformed"
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-white text-sm font-medium">Transformed</span>
                </div>
              </div>
            </div>
          ) : comparisonMode === 'before-after' ? (
            // Before/After slider
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={originalImage.url}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={selectedTransform?.url}
                  alt="Transformed"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Slider Control */}
              <div className="absolute inset-0 flex items-center">
                <div className="relative w-full h-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={handleSliderChange}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${sliderPosition}%, rgba(0,0,0,0.3) ${sliderPosition}%, rgba(0,0,0,0.3) 100%)`
                    }}
                  />
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md"
                    style={{ left: `${sliderPosition}%` }}
                  />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-sm font-medium">Before</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-sm font-medium">After</span>
              </div>
            </div>
          ) : (
            // Overlay mode
            <div className="relative w-full h-full">
              <img
                src={selectedTransform?.url}
                alt="Transformed"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                >
                  <Icon name="Eye" size={16} />
                  Overlay Mode
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Selection and Actions */}
      {transformedImages.length > 0 && (
        <div className="bg-card rounded-lg p-4 border">
          {/* Thumbnail Selection */}
          {transformedImages.length > 1 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-text-primary mb-2">Variations</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {transformedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedTransformIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all",
                      selectedTransformIndex === index
                        ? "border-primary scale-105" :"border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={image.thumbnail || image.url}
                      alt={`Variation ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleDownload(selectedTransform)}
              iconName="Download"
              iconPosition="left"
              size="sm"
            >
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => onRegenerate?.(selectedTransform)}
              iconName="RefreshCw"
              iconPosition="left"
              size="sm"
            >
              Regenerate
            </Button>
            <Button
              variant="outline"
              onClick={() => handleApplyToProfile(selectedTransform)}
              iconName="User"
              iconPosition="left"
              size="sm"
            >
              Apply to Profile
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigator.share?.({ url: selectedTransform?.url })}
              iconName="Share2"
              iconPosition="left"
              size="sm"
            >
              Share
            </Button>
          </div>

          {/* Image Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t text-sm">
            <div>
              <label className="text-text-secondary">Processing Time</label>
              <p className="font-medium text-text-primary">
                {selectedTransform?.processingTime || 0}s
              </p>
            </div>
            <div>
              <label className="text-text-secondary">Strength</label>
              <p className="font-medium text-text-primary">
                {(selectedTransform?.strength || 0.7) * 100}%
              </p>
            </div>
            <div>
              <label className="text-text-secondary">Quality</label>
              <p className="font-medium text-text-primary">
                {selectedTransform?.quality || 'Standard'}
              </p>
            </div>
            <div>
              <label className="text-text-secondary">Seed</label>
              <p className="font-medium text-text-primary">
                {selectedTransform?.seed || 'Random'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="relative max-w-[95vw] max-h-[95vh] w-full">
            {comparisonMode === 'side-by-side' && originalImage && selectedTransform ? (
              <div className="grid grid-cols-2 h-full gap-4 max-h-[90vh]">
                <div className="flex items-center justify-center">
                  <img
                    src={originalImage.url}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={selectedTransform.url}
                    alt="Transformed"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <img
                src={selectedTransform?.url}
                alt="Transformed"
                className="max-w-full max-h-full object-contain mx-auto"
              />
            )}
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;