import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VideoUploader = ({ onVideoUpload, onVideoRemove, uploadedVideo, loading = false }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileSelect(videoFile);
    }
  }, [handleFileSelect]);

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('video/')) {
      // Simulate upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          onVideoUpload?.({
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            duration: '0:00' // Would be calculated from actual video
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  }, [onVideoUpload]);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveVideo = () => {
    setUploadProgress(0);
    onVideoRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!uploadedVideo && uploadProgress === 0 && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            isDragging 
              ? "border-primary bg-primary/5" :"border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={loading}
          />
          
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Video" size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-text-primary">Upload Video</p>
              <p className="text-sm text-text-secondary">
                Drag and drop or click to browse
              </p>
            </div>
            <p className="text-xs text-text-secondary">
              Supports: MP4, MOV, AVI, WebM (Max 100MB)
            </p>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Uploading...</span>
            <span className="text-sm text-text-secondary">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Video Preview */}
      {uploadedVideo && (
        <div className="space-y-4">
          <div className="relative bg-card rounded-lg border overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={uploadedVideo.url}
                className="max-w-full max-h-full"
                controls
                preload="metadata"
              >
                Your browser does not support video playback.
              </video>
            </div>
            
            {/* Video Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleRemoveVideo}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>

          {/* Video Details */}
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">Video Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Replace
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-text-secondary block mb-1">Filename</label>
                <p className="font-medium text-text-primary truncate">
                  {uploadedVideo.name}
                </p>
              </div>
              <div>
                <label className="text-text-secondary block mb-1">File Size</label>
                <p className="font-medium text-text-primary">
                  {formatFileSize(uploadedVideo.size)}
                </p>
              </div>
              <div>
                <label className="text-text-secondary block mb-1">Format</label>
                <p className="font-medium text-text-primary uppercase">
                  {uploadedVideo.type?.split('/')[1] || 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-text-secondary block mb-1">Duration</label>
                <p className="font-medium text-text-primary">
                  {uploadedVideo.duration || 'Calculating...'}
                </p>
              </div>
            </div>

            {/* Video Quality Info */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Recommended Settings</h4>
              <div className="text-sm text-text-secondary space-y-1">
                <p>• Best results with clear facial visibility</p>
                <p>• Recommended resolution: 720p or higher</p>
                <p>• Optimal duration: 10 seconds to 2 minutes</p>
                <p>• Ensure good lighting on the subject's face</p>
              </div>
            </div>
          </div>

          {/* Video Analysis */}
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold text-text-primary mb-3">AI Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Faces Detected</span>
                <span className="font-medium text-success">1 person</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Video Quality</span>
                <span className="font-medium text-success">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Facial Visibility</span>
                <span className="font-medium text-success">Clear</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Processing Readiness</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="font-medium text-success">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;