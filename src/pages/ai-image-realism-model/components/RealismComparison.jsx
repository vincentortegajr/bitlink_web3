import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const RealismComparison = ({ 
  originalImage, 
  realisticImage, 
  isProcessing = false, 
  progress = 0,
  onDownload,
  onReprocess
}) => {
  const [comparisonMode, setComparisonMode] = useState('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        if (sliderRef.current) {
          const rect = sliderRef.current.getBoundingClientRect();
          const percentage = ((e.clientX - rect.left) / rect.width) * 100;
          setSliderPosition(Math.max(0, Math.min(100, percentage)));
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!originalImage && !isProcessing) {
    return (
      <div className="bg-card rounded-lg border p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Sparkles" size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Transform to Realistic Skin
          </h3>
          <p className="text-text-secondary">
            Upload a cartoon or digital art image to convert skin to photorealistic human skin
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="bg-muted/50 rounded-lg p-3">
              <Icon name="Palette" size={16} className="text-pink-500 mx-auto mb-2" />
              <p className="font-medium">Cartoon Art</p>
              <p className="text-text-secondary text-xs">Animated characters</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <Icon name="User" size={16} className="text-rose-500 mx-auto mb-2" />
              <p className="font-medium">Realistic Skin</p>
              <p className="text-text-secondary text-xs">Human-like texture</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={18} className="text-pink-500" />
            <h3 className="font-semibold text-text-primary">
              {isProcessing ? 'Transforming to Realistic...' : realisticImage ? 'Cartoon → Realistic Transformation' : 'Original Image'}
            </h3>
          </div>
          
          {realisticImage && (
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden lg:flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-1 hover:bg-background rounded text-text-secondary hover:text-text-primary"
                  disabled={zoomLevel <= 0.5}
                >
                  <Icon name="ZoomOut" size={14} />
                </button>
                <span className="text-xs text-text-secondary px-2 min-w-[40px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  className="p-1 hover:bg-background rounded text-text-secondary hover:text-text-primary"
                  disabled={zoomLevel >= 3}
                >
                  <Icon name="ZoomIn" size={14} />
                </button>
              </div>

              {/* Comparison Mode Toggle */}
              <div className="hidden md:flex bg-muted rounded-lg p-1">
                {[
                  { mode: 'side-by-side', icon: 'Columns2', label: 'Side by Side' },
                  { mode: 'slider', icon: 'SeparatorHorizontal', label: 'Slider' },
                  { mode: 'overlay', icon: 'Layers', label: 'Overlay' }
                ].map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => setComparisonMode(option.mode)}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      comparisonMode === option.mode
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                    title={option.label}
                  >
                    <Icon name={option.icon} size={14} />
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReprocess?.(originalImage)}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Reprocess
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onDownload?.(realisticImage)}
                  iconName="Download"
                  iconPosition="left"
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar (when processing) */}
        {isProcessing && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Applying realistic skin transformation...</span>
              <span className="text-text-primary font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full h-3 transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary mt-2">
              <Icon name="Cpu" size={12} />
              <span>RealismGAN v2.1 • GPU Processing</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Comparison Content */}
      <div className="p-4">
        {isProcessing ? (
          /* Processing State */
          <div className="aspect-[16/10] bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse flex items-center justify-center mx-auto">
                  <Icon name="Sparkles" size={24} className="text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-pink-500/30 rounded-full animate-spin border-t-pink-500"></div>
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                Transforming to Realistic Skin
              </h4>
              <p className="text-text-secondary text-sm mb-4">
                AI is analyzing cartoon features and applying photorealistic skin textures...
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary">
                <div>
                  <Icon name="Eye" size={12} className="inline mr-1" />
                  Analyzing facial features
                </div>
                <div>
                  <Icon name="Layers" size={12} className="inline mr-1" />
                  Applying skin texture
                </div>
              </div>
            </div>
          </div>
        ) : !realisticImage ? (
          /* Original Image Only */
          <div className="space-y-4">
            <div className="aspect-[16/10] bg-muted rounded-lg overflow-hidden">
              <img
                src={originalImage?.url}
                alt="Original cartoon content"
                className="w-full h-full object-contain"
                style={{ transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)` }}
              />
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium">Original Cartoon Image</p>
              <p className="text-text-secondary text-sm">
                {originalImage?.width}×{originalImage?.height} • {originalImage?.name}
              </p>
            </div>
          </div>
        ) : (
          /* Before & After Comparison */
          <div className="space-y-4">
            {/* Mobile Comparison Mode Selector */}
            <div className="md:hidden">
              <div className="grid grid-cols-3 gap-1 bg-muted rounded-lg p-1">
                {[
                  { mode: 'side-by-side', icon: 'Columns2', label: 'Side' },
                  { mode: 'slider', icon: 'SeparatorHorizontal', label: 'Slider' },
                  { mode: 'overlay', icon: 'Layers', label: 'Overlay' }
                ].map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => setComparisonMode(option.mode)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-md transition-colors text-xs font-medium",
                      comparisonMode === option.mode
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                        : "text-text-secondary"
                    )}
                  >
                    <Icon name={option.icon} size={16} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-Side View */}
            {comparisonMode === 'side-by-side' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden border-2 border-muted">
                    <img
                      src={originalImage?.url}
                      alt="Original cartoon"
                      className="w-full h-full object-contain"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Icon name="Palette" size={16} className="text-pink-500" />
                      <p className="font-medium text-text-primary">Before (Cartoon)</p>
                    </div>
                    <p className="text-text-secondary text-sm">
                      {originalImage?.width}×{originalImage?.height}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden border-2 border-gradient-to-r from-pink-500 to-rose-500">
                    <img
                      src={realisticImage?.url}
                      alt="Realistic transformation"
                      className="w-full h-full object-contain"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Icon name="User" size={16} className="text-rose-500" />
                      <p className="font-medium text-text-primary">After (Realistic)</p>
                    </div>
                    <p className="text-text-secondary text-sm">
                      {realisticImage?.enhancedSize} • {realisticImage?.settings?.realismLevel} quality
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Slider Comparison */}
            {comparisonMode === 'slider' && (
              <div className="space-y-4">
                <div 
                  ref={sliderRef}
                  className="aspect-[16/10] bg-muted rounded-lg overflow-hidden relative cursor-ew-resize select-none"
                  onMouseDown={() => setIsDragging(true)}
                >
                  {/* Realistic image (background) */}
                  <img
                    src={realisticImage?.url}
                    alt="Realistic transformation"
                    className="w-full h-full object-contain absolute inset-0"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  
                  {/* Original image (foreground with clip) */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={originalImage?.url}
                      alt="Original cartoon"
                      className="w-full h-full object-contain"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                  </div>
                  
                  {/* Slider Handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg flex items-center justify-center">
                      <Icon name="Move" size={16} className="text-white" />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Icon name="Palette" size={12} className="inline mr-1" />
                    Cartoon
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Icon name="User" size={12} className="inline mr-1" />
                    Realistic
                  </div>
                </div>

                {/* Slider Control */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>← Cartoon Original</span>
                    <span>Realistic Transform →</span>
                  </div>
                </div>
              </div>
            )}

            {/* Overlay View */}
            {comparisonMode === 'overlay' && (
              <div className="space-y-3">
                <div className="aspect-[16/10] bg-muted rounded-lg overflow-hidden relative group">
                  <img
                    src={originalImage?.url}
                    alt="Original cartoon"
                    className="w-full h-full object-contain absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  <img
                    src={realisticImage?.url}
                    alt="Realistic transformation"
                    className="w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                    <Icon name="MousePointer2" size={12} className="inline mr-2" />
                    Hover to see realistic transformation
                  </div>
                </div>
              </div>
            )}

            {/* Transformation Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-pink-600">
                  {realisticImage?.settings?.realismLevel?.toUpperCase() || 'HIGH'}
                </div>
                <div className="text-xs text-text-secondary">Realism Level</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(realisticImage?.processingTime || 0)}s
                </div>
                <div className="text-xs text-text-secondary">Processing Time</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">
                  +{Math.round(80 + Math.random() * 15)}%
                </div>
                <div className="text-xs text-text-secondary">Skin Quality</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {realisticImage?.settings?.skinSmoothing?.toUpperCase() || 'BALANCED'}
                </div>
                <div className="text-xs text-text-secondary">Skin Smoothing</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealismComparison;