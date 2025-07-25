import React, { useState, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Components
import ImageUploader from './components/ImageUploader';
import QualitySettings from './components/QualitySettings';
import GPUResourceMonitor from './components/GPUResourceMonitor';
import ProcessingHistory from './components/ProcessingHistory';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import BatchProcessor from './components/BatchProcessor';

const AIImageUpscaler = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('upscale'); // upscale, batch, history, monitor
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [processingQueue, setProcessingQueue] = useState([]);

  // Enhancement settings state
  const [settings, setSettings] = useState({
    scaleFactor: '4x', // 2x, 4x, 8x
    qualityPreset: 'balanced', // fast, balanced, high_quality
    noiseReduction: 0.5,
    sharpening: 0.7,
    artifactRemoval: true,
    colorEnhancement: true,
    format: 'png', // png, jpg, webp
    compression: 85
  });

  // Processing statistics
  const [stats, setStats] = useState({
    processingTime: 0,
    originalSize: '0x0',
    enhancedSize: '0x0',
    qualityImprovement: 0,
    compressionRatio: 1.0
  });

  // FastAPI endpoint integration for upscaling
  const upscaleImage = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);
    setEstimatedTime(120); // Initial estimate based on scale factor

    try {
      const formData = new FormData();
      formData.append('image', selectedImage.file);
      formData.append('scale_factor', settings.scaleFactor.replace('x', ''));
      formData.append('quality_preset', settings.qualityPreset);
      formData.append('noise_reduction', settings.noiseReduction);
      formData.append('sharpening', settings.sharpening);
      formData.append('artifact_removal', settings.artifactRemoval);
      formData.append('color_enhancement', settings.colorEnhancement);
      formData.append('output_format', settings.format);

      const response = await fetch('/api/v1/image-upscaler/enhance', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Simulate progress updates for upscaling process
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(95, prev + Math.random() * 10);
            const remainingTime = (100 - newProgress) * (settings.scaleFactor === '8x' ? 2 : 1);
            setEstimatedTime(Math.ceil(remainingTime));
            return newProgress;
          });
        }, 1500);

        // Simulate completion
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setEstimatedTime(0);
          
          const originalDimensions = `${selectedImage.width}x${selectedImage.height}`;
          const scaleMultiplier = parseInt(settings.scaleFactor.replace('x', ''));
          const enhancedDimensions = `${selectedImage.width * scaleMultiplier}x${selectedImage.height * scaleMultiplier}`;
          
          const mockProcessedImage = {
            id: `upscaled-${Date.now()}`,
            url: `/api/placeholder/${selectedImage.width * scaleMultiplier}/${selectedImage.height * scaleMultiplier}?text=Upscaled+${settings.scaleFactor}`,
            originalUrl: selectedImage.url,
            scaleFactor: settings.scaleFactor,
            qualityPreset: settings.qualityPreset,
            processingTime: 85 + Math.random() * 60,
            originalSize: originalDimensions,
            enhancedSize: enhancedDimensions,
            settings: { ...settings }
          };

          setProcessedImage(mockProcessedImage);
          setStats({
            processingTime: mockProcessedImage.processingTime,
            originalSize: originalDimensions,
            enhancedSize: enhancedDimensions,
            qualityImprovement: 75 + Math.random() * 20,
            compressionRatio: settings.format === 'jpg' ? 0.3 : 0.8
          });
          
          setIsProcessing(false);
        }, 12000);

      } else {
        throw new Error('Upscaling failed');
      }
    } catch (error) {
      console.error('Upscaling error:', error);
      setIsProcessing(false);
      setProgress(0);
      // Handle error state
    }
  }, [selectedImage, settings]);

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
    setProcessedImage(null);
    setProgress(0);
  };

  const handleDownload = (image) => {
    if (image?.url) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `upscaled-${image.scaleFactor}-${Date.now()}.${settings.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBatchProcess = (images) => {
    setProcessingQueue(images);
    // Batch processing logic would go here
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setProgress(0);
    setEstimatedTime(0);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Icon name="Maximize2" size={20} className="text-cyan-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">AI Image Upscaler</h1>
              <p className="text-text-secondary">Enhance image resolution and quality with advanced AI</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Upload & Settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* Image Upload */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Upload Image</h3>
              <ImageUploader
                onImageSelect={handleImageSelect}
                loading={isProcessing}
                maxFileSize={10 * 1024 * 1024} // 10MB limit
                acceptedFormats={['jpg', 'jpeg', 'png', 'webp']}
              />
              
              {selectedImage && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-text-secondary">
                    <div>Resolution: {selectedImage.width}x{selectedImage.height}</div>
                    <div>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    iconName="X"
                    iconPosition="left"
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Quality Settings */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Enhancement Settings</h3>
              <QualitySettings
                settings={settings}
                onSettingsChange={setSettings}
                loading={isProcessing}
              />
            </div>

            {/* Process Button */}
            <div className="bg-card rounded-lg p-4 border">
              <Button
                onClick={upscaleImage}
                disabled={!selectedImage || isProcessing}
                loading={isProcessing}
                iconName="Zap"
                iconPosition="left"
                className="w-full"
              >
                {isProcessing ? 'Upscaling...' : 'Enhance Image'}
              </Button>
              
              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Progress</span>
                    <span className="text-text-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-text-secondary text-center">
                    Estimated time remaining: {Math.ceil(estimatedTime)}s
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center - Before/After Comparison */}
          <div className="lg:col-span-5">
            <BeforeAfterComparison
              originalImage={selectedImage}
              enhancedImage={processedImage}
              isProcessing={isProcessing}
              progress={progress}
              onDownload={handleDownload}
            />
          </div>

          {/* Right Sidebar - Monitor & Stats */}
          <div className="lg:col-span-3 space-y-6">
            <GPUResourceMonitor isProcessing={isProcessing} />
            
            {/* Processing Stats */}
            {(processedImage || isProcessing) && (
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Processing Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Processing Time</span>
                    <span className="text-text-primary">{Math.round(stats.processingTime)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Original Size</span>
                    <span className="text-text-primary">{stats.originalSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Enhanced Size</span>
                    <span className="text-text-primary">{stats.enhancedSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Quality Boost</span>
                    <span className="text-primary">+{Math.round(stats.qualityImprovement)}%</span>
                  </div>
                </div>
              </div>
            )}

            <ProcessingHistory />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted p-1 mb-4 overflow-x-auto">
            {[
              { id: 'upscale', label: 'Upscale', icon: 'Maximize2' },
              { id: 'batch', label: 'Batch', icon: 'Grid3x3' },
              { id: 'history', label: 'History', icon: 'Clock' },
              { id: 'monitor', label: 'Monitor', icon: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
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
          {activeTab === 'upscale' && (
            <div className="space-y-4">
              {/* Before/After Comparison */}
              <BeforeAfterComparison
                originalImage={selectedImage}
                enhancedImage={processedImage}
                isProcessing={isProcessing}
                progress={progress}
                onDownload={handleDownload}
              />

              {/* Image Upload */}
              <div className="bg-card rounded-lg p-4 border">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  loading={isProcessing}
                  maxFileSize={10 * 1024 * 1024}
                  acceptedFormats={['jpg', 'jpeg', 'png', 'webp']}
                />
                
                {selectedImage && (
                  <div className="mt-3 text-sm text-text-secondary">
                    {selectedImage.width}x{selectedImage.height} • {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>

              {/* Mobile Process Controls */}
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMobileSettings(!showMobileSettings)}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Settings
                  </Button>
                  <Button
                    onClick={upscaleImage}
                    disabled={!selectedImage || isProcessing}
                    loading={isProcessing}
                    iconName="Zap"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Enhance
                  </Button>
                </div>
                
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Progress</span>
                      <span className="text-text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-text-secondary text-center">
                      {Math.ceil(estimatedTime)}s remaining
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Settings Panel */}
              {showMobileSettings && (
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-text-primary">Settings</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileSettings(false)}
                      iconName="X"
                    />
                  </div>
                  <QualitySettings
                    settings={settings}
                    onSettingsChange={setSettings}
                    loading={isProcessing}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'batch' && (
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Batch Processing</h3>
              <BatchProcessor
                onBatchProcess={handleBatchProcess}
                settings={settings}
                processingQueue={processingQueue}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-card rounded-lg p-4 border">
              <ProcessingHistory />
            </div>
          )}

          {activeTab === 'monitor' && (
            <GPUResourceMonitor isProcessing={isProcessing} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImageUpscaler;