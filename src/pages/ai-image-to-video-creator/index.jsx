import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Components
import ImageUploader from './components/ImageUploader';
import TimelineEditor from './components/TimelineEditor';
import AnimationPresets from './components/AnimationPresets';
import VideoPreview from './components/VideoPreview';
import AdvancedControls from './components/AdvancedControls';
import GPUResourceMonitor from './components/GPUResourceMonitor';
import ExportSettings from './components/ExportSettings';
import BatchProcessor from './components/BatchProcessor';

const AIImageToVideoCreator = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State management
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('create'); // create, batch, monitor
  const [showMobileTimeline, setShowMobileTimeline] = useState(false);

  // Video settings state
  const [videoSettings, setVideoSettings] = useState({
    duration: 3, // seconds
    fps: 30,
    resolution: '512x512',
    motionStrength: 0.7,
    frameInterpolation: true,
    quality: 'high',
    format: 'mp4'
  });

  // Animation settings
  const [animationSettings, setAnimationSettings] = useState({
    preset: 'none',
    cameraMovement: 'static',
    objectAnimation: 'none',
    environmentEffect: 'none',
    customMotion: {
      x: 0,
      y: 0,
      zoom: 0,
      rotation: 0
    }
  });

  // Timeline state
  const [timelineData, setTimelineData] = useState({
    keyframes: [],
    totalDuration: 3,
    currentTime: 0
  });

  // FastAPI endpoint integration
  const generateVideo = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setEstimatedTime(120); // Initial estimate for video processing

    try {
      const formData = new FormData();
      
      // Add images
      uploadedImages.forEach((image, index) => {
        formData.append(`images`, image.file);
      });

      // Add settings
      formData.append('video_settings', JSON.stringify(videoSettings));
      formData.append('animation_settings', JSON.stringify(animationSettings));
      formData.append('timeline_data', JSON.stringify(timelineData));

      const response = await fetch('/api/v1/image-to-video/generate', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Simulate progress updates for video processing
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(100, prev + Math.random() * 8);
            setEstimatedTime(prev => Math.max(0, prev - 3));
            return newProgress;
          });
        }, 2000);

        // Simulate completion after processing
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setEstimatedTime(0);
          
          // Mock generated video
          const newVideo = {
            id: `video-${Date.now()}`,
            url: `/api/placeholder/512/512?text=Generated+Video`,
            thumbnail: uploadedImages[0]?.preview,
            duration: videoSettings.duration,
            fps: videoSettings.fps,
            resolution: videoSettings.resolution,
            processingTime: 95 + Math.random() * 45,
            settings: { ...videoSettings, ...animationSettings }
          };

          setGeneratedVideo(newVideo);
          setIsProcessing(false);
        }, 12000);

      } else {
        throw new Error('Video generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setIsProcessing(false);
      setProgress(0);
      // Handle error state
    }
  }, [uploadedImages, videoSettings, animationSettings, timelineData]);

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: `img-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleImageRemove = (imageId) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Clean up object URLs
      const removed = prev.find(img => img.id === imageId);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handlePresetSelect = (preset) => {
    setAnimationSettings(prev => ({ ...prev, preset }));
    
    // Apply preset configurations
    const presetConfigs = {
      'zoom-in': {
        cameraMovement: 'zoom',
        customMotion: { zoom: 0.3, x: 0, y: 0, rotation: 0 }
      },
      'pan-right': {
        cameraMovement: 'pan',
        customMotion: { x: 0.2, y: 0, zoom: 0, rotation: 0 }
      },
      'rotate': {
        cameraMovement: 'rotate',
        customMotion: { rotation: 15, x: 0, y: 0, zoom: 0 }
      }
    };

    if (presetConfigs[preset]) {
      setAnimationSettings(prev => ({
        ...prev,
        ...presetConfigs[preset]
      }));
    }
  };

  const handleTimelineUpdate = (newTimelineData) => {
    setTimelineData(newTimelineData);
  };

  const handleVideoDownload = () => {
    if (generatedVideo?.url) {
      const link = document.createElement('a');
      link.href = generatedVideo.url;
      link.download = `ai-video-${generatedVideo.id || Date.now()}.${videoSettings.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleVideoRegenerate = () => {
    generateVideo();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Video" size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">AI Image-to-Video Creator</h1>
              <p className="text-text-secondary">Transform static images into dynamic videos using RunPod GPU</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Image Upload */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Source Images</h3>
              <ImageUploader
                onImageUpload={handleImageUpload}
                uploadedImages={uploadedImages}
                onImageRemove={handleImageRemove}
                disabled={isProcessing}
              />
            </div>

            {/* Animation Presets */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Animation Presets</h3>
              <AnimationPresets
                selectedPreset={animationSettings.preset}
                onPresetSelect={handlePresetSelect}
                disabled={isProcessing}
              />
            </div>

            {/* Advanced Controls */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Motion Controls</h3>
              <AdvancedControls
                videoSettings={videoSettings}
                animationSettings={animationSettings}
                onVideoSettingsChange={setVideoSettings}
                onAnimationSettingsChange={setAnimationSettings}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Center - Preview & Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Video Preview */}
            <VideoPreview
              isProcessing={isProcessing}
              progress={progress}
              estimatedTime={estimatedTime}
              generatedVideo={generatedVideo}
              uploadedImages={uploadedImages}
              onDownload={handleVideoDownload}
              onRegenerate={handleVideoRegenerate}
            />

            {/* Timeline Editor */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Timeline Editor</h3>
              <TimelineEditor
                timelineData={timelineData}
                onTimelineUpdate={handleTimelineUpdate}
                videoSettings={videoSettings}
                disabled={isProcessing}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateVideo}
              disabled={uploadedImages.length === 0 || isProcessing}
              loading={isProcessing}
              iconName="Play"
              iconPosition="left"
              size="lg"
              className="w-full"
            >
              {isProcessing ? 'Generating Video...' : 'Generate Video'}
            </Button>
          </div>

          {/* Right Sidebar - Monitor & Export */}
          <div className="lg:col-span-3 space-y-6">
            <GPUResourceMonitor isProcessing={isProcessing} />
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Export Settings</h3>
              <ExportSettings
                videoSettings={videoSettings}
                onSettingsChange={setVideoSettings}
                disabled={isProcessing}
              />
            </div>

            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Batch Processing</h3>
              <BatchProcessor
                disabled={isProcessing}
                onBatchProcess={(batchSettings) => console.log('Batch process:', batchSettings)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted p-1 mb-4">
            {[
              { id: 'create', label: 'Create', icon: 'Video' },
              { id: 'batch', label: 'Batch', icon: 'Layers' },
              { id: 'monitor', label: 'GPU', icon: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              {/* Video Preview */}
              <VideoPreview
                isProcessing={isProcessing}
                progress={progress}
                estimatedTime={estimatedTime}
                generatedVideo={generatedVideo}
                uploadedImages={uploadedImages}
                onDownload={handleVideoDownload}
                onRegenerate={handleVideoRegenerate}
              />

              {/* Image Upload */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Source Images</h3>
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  uploadedImages={uploadedImages}
                  onImageRemove={handleImageRemove}
                  disabled={isProcessing}
                />
              </div>

              {/* Animation Presets */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Animation Presets</h3>
                <AnimationPresets
                  selectedPreset={animationSettings.preset}
                  onPresetSelect={handlePresetSelect}
                  disabled={isProcessing}
                />
              </div>

              {/* Mobile Timeline Toggle */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileTimeline(!showMobileTimeline)}
                  iconName="Clock"
                  iconPosition="left"
                  className="flex-1"
                >
                  Timeline
                </Button>
                <Button
                  onClick={generateVideo}
                  disabled={uploadedImages.length === 0 || isProcessing}
                  loading={isProcessing}
                  iconName="Play"
                  iconPosition="left"
                  className="flex-2"
                >
                  Generate
                </Button>
              </div>

              {/* Mobile Timeline */}
              {showMobileTimeline && (
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-text-primary">Timeline Editor</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileTimeline(false)}
                      iconName="X"
                    />
                  </div>
                  <TimelineEditor
                    timelineData={timelineData}
                    onTimelineUpdate={handleTimelineUpdate}
                    videoSettings={videoSettings}
                    disabled={isProcessing}
                    mobile={true}
                  />
                </div>
              )}

              {/* Advanced Controls */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Motion Controls</h3>
                <AdvancedControls
                  videoSettings={videoSettings}
                  animationSettings={animationSettings}
                  onVideoSettingsChange={setVideoSettings}
                  onAnimationSettingsChange={setAnimationSettings}
                  disabled={isProcessing}
                  mobile={true}
                />
              </div>
            </div>
          )}

          {activeTab === 'batch' && (
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <BatchProcessor
                  disabled={isProcessing}
                  onBatchProcess={(batchSettings) => console.log('Batch process:', batchSettings)}
                  mobile={true}
                />
              </div>
              
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Export Settings</h3>
                <ExportSettings
                  videoSettings={videoSettings}
                  onSettingsChange={setVideoSettings}
                  disabled={isProcessing}
                  mobile={true}
                />
              </div>
            </div>
          )}

          {activeTab === 'monitor' && (
            <GPUResourceMonitor isProcessing={isProcessing} mobile={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImageToVideoCreator;