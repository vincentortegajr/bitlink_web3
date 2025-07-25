import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const VideoPreview = ({
  isProcessing = false,
  progress = 0,
  estimatedTime = 0,
  generatedVideo = null,
  uploadedImages = [],
  onDownload,
  onRegenerate
}) => {
  const [previewMode, setPreviewMode] = useState('video'); // video, grid, single

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Processing State
  if (isProcessing) {
    return (
      <div className="bg-card rounded-lg p-6 border">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Video" size={20} className="text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Generating Video...</h3>
              <p className="text-sm text-text-secondary">Processing on RunPod GPU</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Progress: {Math.round(progress)}%</span>
              <span className="text-text-secondary">
                ETA: {estimatedTime > 0 ? formatTime(estimatedTime) : 'Calculating...'}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Icon 
                name={progress < 25 ? "Loader2" : "Check"} 
                size={16} 
                className={cn(
                  progress < 25 ? "animate-spin text-primary" : "text-success"
                )} 
              />
              <span className={progress < 25 ? "text-text-primary" : "text-success"}>
                Image preprocessing
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Icon 
                name={progress < 50 ? (progress < 25 ? "Circle" : "Loader2") : "Check"} 
                size={16} 
                className={cn(
                  progress < 25 ? "text-text-secondary" : 
                  progress < 50 ? "animate-spin text-primary" : "text-success"
                )} 
              />
              <span className={cn(
                progress < 25 ? "text-text-secondary" :
                progress < 50 ? "text-text-primary" : "text-success"
              )}>
                Motion analysis
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Icon 
                name={progress < 75 ? (progress < 50 ? "Circle" : "Loader2") : "Check"} 
                size={16} 
                className={cn(
                  progress < 50 ? "text-text-secondary" : 
                  progress < 75 ? "animate-spin text-primary" : "text-success"
                )} 
              />
              <span className={cn(
                progress < 50 ? "text-text-secondary" :
                progress < 75 ? "text-text-primary" : "text-success"
              )}>
                Frame generation
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Icon 
                name={progress < 100 ? (progress < 75 ? "Circle" : "Loader2") : "Check"} 
                size={16} 
                className={cn(
                  progress < 75 ? "text-text-secondary" : 
                  progress < 100 ? "animate-spin text-primary" : "text-success"
                )} 
              />
              <span className={cn(
                progress < 75 ? "text-text-secondary" :
                progress < 100 ? "text-text-primary" : "text-success"
              )}>
                Video encoding
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generated Video State
  if (generatedVideo) {
    return (
      <div className="bg-card rounded-lg p-4 border">
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              className="w-full h-full object-cover"
              controls
              poster={generatedVideo.thumbnail}
              preload="metadata"
            >
              <source src={generatedVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Overlay Info */}
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {generatedVideo.resolution}
            </div>
          </div>

          {/* Video Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-text-secondary">Duration</p>
              <p className="font-medium text-text-primary">
                {formatTime(generatedVideo.duration)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-text-secondary">Frame Rate</p>
              <p className="font-medium text-text-primary">
                {generatedVideo.fps} FPS
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-text-secondary">Processing Time</p>
              <p className="font-medium text-text-primary">
                {Math.round(generatedVideo.processingTime)}s
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-text-secondary">Quality</p>
              <p className="font-medium text-text-primary capitalize">
                {generatedVideo.settings?.quality || 'High'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onDownload}
              iconName="Download"
              iconPosition="left"
              className="flex-1"
            >
              Download
            </Button>
            <Button
              variant="outline"
              onClick={onRegenerate}
              iconName="RefreshCw"
              iconPosition="left"
              className="flex-1"
            >
              Regenerate
            </Button>
          </div>

          {/* Generation Info */}
          <div className="bg-success/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <div>
                <p className="text-sm font-medium text-success">Video Generated Successfully</p>
                <p className="text-xs text-success/80">
                  Ready for download in multiple formats
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default State - No Images
  if (uploadedImages.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Video" size={32} className="text-text-secondary" />
          </div>
          
          <div>
            <h3 className="font-semibold text-text-primary mb-2">No Images Uploaded</h3>
            <p className="text-sm text-text-secondary">
              Upload images to start creating your video
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Preview State - With Images
  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="space-y-4">
        {/* Preview Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Preview</h3>
          <div className="flex rounded-md bg-muted p-1">
            {[
              { id: 'video', icon: 'Video', label: 'Video' },
              { id: 'grid', icon: 'Grid3X3', label: 'Grid' },
              { id: 'single', icon: 'Square', label: 'Single' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPreviewMode(mode.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                  previewMode === mode.id
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Icon name={mode.icon} size={14} />
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Content */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {previewMode === 'video' && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Icon name="Play" size={24} className="text-primary" />
                </div>
                <p className="text-sm text-text-secondary">Video Preview</p>
                <p className="text-xs text-text-secondary">
                  {uploadedImages.length} images ready for processing
                </p>
              </div>
            </div>
          )}

          {previewMode === 'grid' && (
            <div className="grid grid-cols-2 gap-1 p-2 h-full">
              {uploadedImages.slice(0, 4).map((image, index) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.preview}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {previewMode === 'single' && (
            <div className="relative w-full h-full">
              <img
                src={uploadedImages[0]?.preview}
                alt="Main frame"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Frame 1 of {uploadedImages.length}
              </div>
            </div>
          )}
        </div>

        {/* Preview Info */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-primary">Ready to Generate</p>
              <p className="text-xs text-text-secondary">
                {uploadedImages.length} images loaded • Click Generate Video to start processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;