import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Components
import PromptEnhancer from './components/PromptEnhancer';
import GenerationSettings from './components/GenerationSettings';
import GPUResourceMonitor from './components/GPUResourceMonitor';
import GenerationHistory from './components/GenerationHistory';
import GenerationPreview from './components/GenerationPreview';
import Header from '../../components/ui/Header';


const AITextToImageGenerator = () => {
  const navigate = useNavigate();
  
  // State management
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [activeTab, setActiveTab] = useState('generate'); // generate, history, monitor
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    aspectRatio: '1:1',
    quality: 'standard',
    steps: 20,
    cfgScale: 7,
    samplingMethod: 'euler_a',
    negativePrompt: '',
    batchSize: 1,
    seed: ''
  });

  // FastAPI endpoint integration
  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setEstimatedTime(60); // Initial estimate

    try {
      const response = await fetch('/api/v1/text-to-image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negative_prompt: settings.negativePrompt,
          width: settings.aspectRatio === '1:1' ? 512 : settings.aspectRatio === '16:9' ? 768 : 512,
          height: settings.aspectRatio === '1:1' ? 512 : settings.aspectRatio === '9:16' ? 768 : 512,
          steps: settings.steps,
          cfg_scale: settings.cfgScale,
          sampler: settings.samplingMethod,
          batch_size: settings.batchSize,
          seed: settings.seed || -1
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Simulate progress updates (would be replaced by WebSocket/SSE in production)
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(100, prev + Math.random() * 15);
            setEstimatedTime(prev => Math.max(0, prev - 2));
            return newProgress;
          });
        }, 1000);

        // Simulate completion after processing
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setEstimatedTime(0);
          
          // Mock generated images
          const newImages = Array.from({ length: settings.batchSize }, (_, index) => ({
            id: `img-${Date.now()}-${index}`,
            url: `/api/placeholder/512/512?text=Generated+${index + 1}`,
            seed: settings.seed || Math.floor(Math.random() * 1000000),
            quality: settings.quality,
            processingTime: 85 + Math.random() * 30,
            resolution: '512x512',
            settings: { ...settings }
          }));

          setGeneratedImages(newImages);
          setIsGenerating(false);
        }, 8000);

      } else {
        throw new Error('Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      setProgress(0);
      // Handle error state
    }
  }, [prompt, settings]);

  const handlePromptEnhance = (enhancement) => {
    setPrompt(prev => prev ? `${prev}, ${enhancement}` : enhancement);
  };

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
    setActiveTab('generate');
  };

  const handleImageRegenerate = (selectedPrompt, selectedSettings) => {
    setPrompt(selectedPrompt);
    setSettings({ ...settings, ...selectedSettings });
    setActiveTab('generate');
    setTimeout(() => generateImage(), 100);
  };

  const handleDownload = (image) => {
    if (image?.url) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `ai-generated-${image.id || Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRegenerate = (image) => {
    if (image?.settings) {
      setSettings({ ...settings, ...image.settings });
      setTimeout(() => generateImage(), 100);
    }
  };

  return (
    <div className="mobile-full-height mobile-viewport-fix bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 mobile-container">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="ImageIcon" size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">AI Text-to-Image Generator</h1>
              <p className="text-text-secondary">Create stunning images from text prompts using RunPod GPU</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 pb-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Prompt Input */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Prompt</h3>
              <textarea
                className={cn(
                  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                )}
                placeholder="Describe the image you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                rows={4}
              />
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-text-secondary">
                  {prompt.length} characters
                </span>
                <Button
                  onClick={generateImage}
                  disabled={!prompt.trim() || isGenerating}
                  loading={isGenerating}
                  iconName="Zap"
                  iconPosition="left"
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Prompt Enhancer */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Enhance Prompt</h3>
              <PromptEnhancer
                onEnhance={handlePromptEnhance}
                loading={isGenerating}
              />
            </div>

            {/* Generation Settings */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Settings</h3>
              <GenerationSettings
                settings={settings}
                onSettingsChange={setSettings}
                loading={isGenerating}
              />
            </div>
          </div>

          {/* Center - Preview */}
          <div className="lg:col-span-5">
            <GenerationPreview
              isGenerating={isGenerating}
              progress={progress}
              estimatedTime={estimatedTime}
              generatedImages={generatedImages}
              onDownload={handleDownload}
              onRegenerate={handleRegenerate}
            />
          </div>

          {/* Right Sidebar - Monitor & History */}
          <div className="lg:col-span-3 space-y-6">
            <GPUResourceMonitor isGenerating={isGenerating} />
            <div className="bg-card rounded-lg p-4 border">
              <GenerationHistory
                onPromptSelect={handlePromptSelect}
                onImageRegenerate={handleImageRegenerate}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - FIXED SCROLLING */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted p-1 mb-4">
            {[
              { id: 'generate', label: 'Generate', icon: 'Zap' },
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

          {/* Tab Content - FIXED MOBILE SCROLLING */}
          <div className="mobile-scroll-container">
            {activeTab === 'generate' && (
              <div className="space-y-4 pb-6">
                {/* Preview */}
                <GenerationPreview
                  isGenerating={isGenerating}
                  progress={progress}
                  estimatedTime={estimatedTime}
                  generatedImages={generatedImages}
                  onDownload={handleDownload}
                  onRegenerate={handleRegenerate}
                />

                {/* Prompt Input */}
                <div className="bg-card rounded-lg p-4 border">
                  <textarea
                    className={cn(
                      "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none mb-3"
                    )}
                    placeholder="Describe the image you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                    rows={3}
                  />
                  
                  <div className="flex items-center gap-2">
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
                      onClick={generateImage}
                      disabled={!prompt.trim() || isGenerating}
                      loading={isGenerating}
                      iconName="Zap"
                      iconPosition="left"
                      className="flex-1"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                {/* Prompt Enhancer */}
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-semibold text-text-primary mb-3">Enhance Prompt</h3>
                  <PromptEnhancer
                    onEnhance={handlePromptEnhance}
                    loading={isGenerating}
                  />
                </div>

                {/* Mobile Settings */}
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
                    <GenerationSettings
                      settings={settings}
                      onSettingsChange={setSettings}
                      loading={isGenerating}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-card rounded-lg p-4 border pb-6">
                <GenerationHistory
                  onPromptSelect={handlePromptSelect}
                  onImageRegenerate={handleImageRegenerate}
                />
              </div>
            )}

            {activeTab === 'monitor' && (
              <div className="pb-6">
                <GPUResourceMonitor isGenerating={isGenerating} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITextToImageGenerator;