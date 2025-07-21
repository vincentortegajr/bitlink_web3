import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GenerationPreview = ({ 
  isGenerating = false, 
  progress = 0, 
  estimatedTime = 0,
  generatedImages = [],
  onDownload,
  onRegenerate 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Mock progress simulation for demo
  useEffect(() => {
    if (isGenerating && progress < 100) {
      const interval = setInterval(() => {
        // This would be replaced by actual progress from FastAPI
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, progress]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };

  return (
    <div className="space-y-4">
      {/* Preview Canvas */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="aspect-square bg-muted/30 relative flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          {!isGenerating && generatedImages.length === 0 && (
            <div className="text-center space-y-3">
              <Icon name="ImageIcon" size={48} className="text-muted-foreground mx-auto" />
              <div>
                <p className="font-medium text-text-primary">Ready to Generate</p>
                <p className="text-sm text-text-secondary">Enter your prompt and click generate</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                      className="text-primary transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">{Math.round(progress)}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-text-primary">Generating Image...</p>
                <p className="text-sm text-text-secondary">
                  Estimated time remaining: {formatTime(estimatedTime)}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
                  <Icon name="Server" size={12} />
                  <span>RunPod GPU Processing</span>
                </div>
              </div>
            </div>
          )}

          {!isGenerating && generatedImages.length > 0 && (
            <div className="w-full h-full relative">
              <img
                src={generatedImages[selectedImageIndex]?.url || '/api/placeholder/512/512'}
                alt="Generated"
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setShowFullscreen(true)}
              />
              
              {/* Image Navigation */}
              {generatedImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-2">
                    {generatedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          selectedImageIndex === index ? "bg-white" : "bg-white/40"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Image Actions */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setShowFullscreen(true)}
                    className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                  >
                    <Icon name="Maximize2" size={16} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onDownload?.(generatedImages[selectedImageIndex])}
                    className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generation Info */}
      {!isGenerating && generatedImages.length > 0 && (
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">Generation Details</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerate?.(generatedImages[selectedImageIndex])}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Regenerate
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onDownload?.(generatedImages[selectedImageIndex])}
                iconName="Download"
                iconPosition="left"
              >
                Download
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-text-secondary">Seed</label>
              <p className="font-medium text-text-primary">
                {generatedImages[selectedImageIndex]?.seed || 'Random'}
              </p>
            </div>
            <div>
              <label className="text-text-secondary">Quality</label>
              <p className="font-medium text-text-primary">
                {generatedImages[selectedImageIndex]?.quality || 'Standard'}
              </p>
            </div>
            <div>
              <label className="text-text-secondary">Processing Time</label>
              <p className="font-medium text-text-primary">
                {formatTime(generatedImages[selectedImageIndex]?.processingTime || 0)}
              </p>
            </div>
            <div>
              <label className="text-text-secondary">Resolution</label>
              <p className="font-medium text-text-primary">
                {generatedImages[selectedImageIndex]?.resolution || '512x512'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && generatedImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={generatedImages[selectedImageIndex]?.url}
              alt="Generated"
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            >
              <Icon name="X" size={20} />
            </Button>

            {/* Navigation */}
            {generatedImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : generatedImages.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                >
                  <Icon name="ChevronLeft" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImageIndex(prev => prev < generatedImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                >
                  <Icon name="ChevronRight" size={20} />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {generatedImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                {selectedImageIndex + 1} / {generatedImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationPreview;