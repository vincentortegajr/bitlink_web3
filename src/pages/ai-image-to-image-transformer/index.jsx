import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Components
import ImageUploader from './components/ImageUploader';
import TransformationSettings from './components/TransformationSettings';
import ComparisonView from './components/ComparisonView';
import GPUResourceMonitor from '../ai-text-to-image-generator/components/GPUResourceMonitor';
import GenerationHistory from '../ai-text-to-image-generator/components/GenerationHistory';

const AIImageToImageTransformer = () => {
  const navigate = useNavigate();
  
  // State management
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transformedImages, setTransformedImages] = useState([]);
  const [activeTab, setActiveTab] = useState('transform'); // transform, history, monitor
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    strength: '0.7',
    styleTransfer: 'photorealistic',
    denoising: '0.5',
    guidanceScale: '7.5',
    steps: 20,
    batchSize: 1,
    controlPrompt: '',
    negativePrompt: '',
    seed: '',
    maskStrength: 0.8,
    preserveColors: false,
    highQuality: false
  });

  // FastAPI endpoint integration
  const transformImage = useCallback(async () => {
    if (!uploadedImage || !settings.controlPrompt.trim()) return;

    setIsTransforming(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage.file);
      formData.append('prompt', settings.controlPrompt.trim());
      formData.append('negative_prompt', settings.negativePrompt);
      formData.append('strength', settings.strength);
      formData.append('denoising_strength', settings.denoising);
      formData.append('guidance_scale', settings.guidanceScale);
      formData.append('steps', settings.steps);
      formData.append('batch_size', settings.batchSize);
      formData.append('seed', settings.seed || -1);

      const response = await fetch('/api/v1/image-to-image/transform', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(100, prev + Math.random() * 12));
        }, 1000);

        // Simulate completion
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          
          // Mock transformed images
          const newImages = Array.from({ length: settings.batchSize }, (_, index) => ({
            id: `transform-${Date.now()}-${index}`,
            url: `/api/placeholder/512/512?text=Transformed+${index + 1}`,
            thumbnail: `/api/placeholder/128/128?text=T${index + 1}`,
            seed: settings.seed || Math.floor(Math.random() * 1000000),
            strength: settings.strength,
            quality: settings.highQuality ? 'High' : 'Standard',
            processingTime: 95 + Math.random() * 40,
            settings: { ...settings }
          }));

          setTransformedImages(newImages);
          setIsTransforming(false);
        }, 8000);

      } else {
        throw new Error('Transformation failed');
      }
    } catch (error) {
      console.error('Transformation error:', error);
      setIsTransforming(false);
      setProgress(0);
    }
  }, [uploadedImage, settings]);

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setTransformedImages([]); // Clear previous results
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    setTransformedImages([]);
  };

  const handlePromptSelect = (selectedPrompt) => {
    setSettings(prev => ({
      ...prev,
      controlPrompt: selectedPrompt
    }));
    setActiveTab('transform');
  };

  const handleImageRegenerate = (selectedPrompt, selectedSettings) => {
    setSettings(prev => ({
      ...prev,
      controlPrompt: selectedPrompt,
      ...selectedSettings
    }));
    setActiveTab('transform');
    setTimeout(() => transformImage(), 100);
  };

  const handleApplyToProfile = (image) => {
    // Navigate to profile builder with the enhanced image
    navigate('/profile-builder-dashboard', {
      state: { enhancedImage: image }
    });
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

  const handleRegenerate = (image) => {
    if (image?.settings) {
      setSettings({ ...settings, ...image.settings });
      setTimeout(() => transformImage(), 100);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Icon name="RefreshCw" size={20} className="text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">AI Image-to-Image Transformer</h1>
              <p className="text-text-secondary">Transform and enhance your images using RunPod GPU</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Upload & Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Image Upload */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Upload Image</h3>
              <ImageUploader
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                uploadedImage={uploadedImage}
                loading={isTransforming}
              />
            </div>

            {/* Transformation Settings */}
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text-primary">Transform Settings</h3>
                <Button
                  onClick={transformImage}
                  disabled={!uploadedImage || !settings.controlPrompt.trim() || isTransforming}
                  loading={isTransforming}
                  iconName="Zap"
                  iconPosition="left"
                  size="sm"
                >
                  Transform
                </Button>
              </div>
              <TransformationSettings
                settings={settings}
                onSettingsChange={setSettings}
                loading={isTransforming}
              />
            </div>
          </div>

          {/* Center - Comparison View */}
          <div className="lg:col-span-5">
            <ComparisonView
              originalImage={uploadedImage}
              transformedImages={transformedImages}
              isTransforming={isTransforming}
              progress={progress}
              onDownload={handleDownload}
              onRegenerate={handleRegenerate}
              onApplyToProfile={handleApplyToProfile}
            />
          </div>

          {/* Right Sidebar - Monitor & History */}
          <div className="lg:col-span-3 space-y-6">
            <GPUResourceMonitor isGenerating={isTransforming} />
            <div className="bg-card rounded-lg p-4 border">
              <GenerationHistory
                onPromptSelect={handlePromptSelect}
                onImageRegenerate={handleImageRegenerate}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted p-1 mb-4">
            {[
              { id: 'transform', label: 'Transform', icon: 'RefreshCw' },
              { id: 'history', label: 'History', icon: 'Clock' },
              { id: 'monitor', label: 'Monitor', icon: 'Activity' }
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
          {activeTab === 'transform' && (
            <div className="space-y-4">
              {/* Comparison View */}
              <ComparisonView
                originalImage={uploadedImage}
                transformedImages={transformedImages}
                isTransforming={isTransforming}
                progress={progress}
                onDownload={handleDownload}
                onRegenerate={handleRegenerate}
                onApplyToProfile={handleApplyToProfile}
              />

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileSettings(!showMobileSettings)}
                  iconName="Settings"
                  iconPosition="left"
                  size="sm"
                  className="flex-1"
                >
                  Settings
                </Button>
                <Button
                  onClick={transformImage}
                  disabled={!uploadedImage || !settings.controlPrompt.trim() || isTransforming}
                  loading={isTransforming}
                  iconName="Zap"
                  iconPosition="left"
                  size="sm"
                  className="flex-1"
                >
                  Transform
                </Button>
              </div>

              {/* Image Upload */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Upload Image</h3>
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  uploadedImage={uploadedImage}
                  loading={isTransforming}
                />
              </div>

              {/* Mobile Settings */}
              {showMobileSettings && (
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-text-primary">Transform Settings</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileSettings(false)}
                      iconName="X"
                    />
                  </div>
                  <TransformationSettings
                    settings={settings}
                    onSettingsChange={setSettings}
                    loading={isTransforming}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-card rounded-lg p-4 border">
              <GenerationHistory
                onPromptSelect={handlePromptSelect}
                onImageRegenerate={handleImageRegenerate}
              />
            </div>
          )}

          {activeTab === 'monitor' && (
            <GPUResourceMonitor isGenerating={isTransforming} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImageToImageTransformer;