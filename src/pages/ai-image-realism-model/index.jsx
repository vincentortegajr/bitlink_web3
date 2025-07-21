import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Import shared components from image upscaler
import GPUResourceMonitor from '../ai-image-upscaler/components/GPUResourceMonitor';
import ProcessingHistory from '../ai-image-upscaler/components/ProcessingHistory';

const AIImageRealismModel = () => {
  const navigate = useNavigate();
  
  // State management
  const [inputImage, setInputImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [outputImage, setOutputImage] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // upload, process, monitor
  const [dragActive, setDragActive] = useState(false);

  // Processing settings
  const [settings, setSettings] = useState({
    realismLevel: 'high', // low, medium, high, ultra
    skinSmoothing: 'balanced', // natural, balanced, enhanced
    faceEnhancement: 'subtle', // none, subtle, moderate, strong
    colorCorrection: 'auto', // none, auto, manual
    outputFormat: 'PNG', // PNG, JPG
    outputQuality: 95
  });

  const [processingStats, setProcessingStats] = useState({
    processingTime: 0,
    gpuUsage: 0,
    memoryUsed: 0,
    modelVersion: 'RealismGAN v2.1'
  });

  // File upload handler
  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setInputImage({
        file,
        url: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      });
      setOutputImage(null); // Clear previous output
    };
    reader.readAsDataURL(file);
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Process image to realistic skin
  const processImage = useCallback(async () => {
    if (!inputImage) return;

    setIsProcessing(true);
    setProgress(0);
    setEstimatedTime(120); // Initial estimate in seconds
    setActiveTab('process');

    try {
      // Simulate API call to realism model
      const formData = new FormData();
      formData.append('image', inputImage.file);
      formData.append('realism_level', settings.realismLevel);
      formData.append('skin_smoothing', settings.skinSmoothing);
      formData.append('face_enhancement', settings.faceEnhancement);
      formData.append('color_correction', settings.colorCorrection);
      formData.append('output_format', settings.outputFormat.toLowerCase());
      formData.append('output_quality', settings.outputQuality);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(95, prev + Math.random() * 8);
          setEstimatedTime(prev => Math.max(0, prev - 3));
          setProcessingStats(prev => ({
            ...prev,
            processingTime: prev.processingTime + 1,
            gpuUsage: 85 + Math.random() * 10,
            memoryUsed: 6.2 + Math.random() * 1.5
          }));
          return newProgress;
        });
      }, 1500);

      // Simulate completion after processing
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setEstimatedTime(0);
        
        // Mock realistic output
        setOutputImage({
          url: `/api/placeholder/512/512?text=Realistic+Skin+Output`,
          originalSize: inputImage.size,
          processedSize: Math.floor(inputImage.size * 1.2),
          resolution: '1024x1024',
          processingTime: 87 + Math.random() * 20,
          modelUsed: 'RealismGAN v2.1',
          settings: { ...settings }
        });

        setProcessingStats(prev => ({
          ...prev,
          processingTime: 89,
          gpuUsage: 45,
          memoryUsed: 3.1
        }));

        setIsProcessing(false);
      }, 12000);

    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      setProgress(0);
      alert('Processing failed. Please try again.');
    }
  }, [inputImage, settings]);

  const handleDownload = () => {
    if (outputImage?.url) {
      const link = document.createElement('a');
      link.href = outputImage.url;
      link.download = `realistic-${inputImage?.name || 'processed-image'}.${settings.outputFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetProcess = () => {
    setInputImage(null);
    setOutputImage(null);
    setProgress(0);
    setIsProcessing(false);
    setEstimatedTime(0);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">AI Image Realism Model</h1>
              <p className="text-text-secondary">Transform cartoon skin into photorealistic human skin</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Cpu" size={16} />
            <span>Powered by RealismGAN v2.1</span>
            <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
            <Icon name="Zap" size={16} />
            <span>GPU Accelerated</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Upload & Settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* Image Upload */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Upload Image</h3>
              {!inputImage ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                    dragActive
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-border hover:border-primary hover:bg-muted/30"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon name="Upload" size={20} className="text-white" />
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">Drop your image here</h4>
                  <p className="text-sm text-text-secondary mb-4">
                    or click to browse files
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-input').click()}
                    iconName="FolderOpen"
                    iconPosition="left"
                  >
                    Choose File
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <p className="text-xs text-text-secondary mt-3">
                    Supports JPG, PNG, WebP up to 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={inputImage.url}
                      alt="Input"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={resetProcess}
                        iconName="X"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary space-y-1">
                    <div className="flex justify-between">
                      <span>File:</span>
                      <span className="truncate max-w-[150px]">{inputImage.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{(inputImage.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="uppercase">{inputImage.type.split('/')[1]}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Processing Settings */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Realism Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Realism Level
                  </label>
                  <select
                    value={settings.realismLevel}
                    onChange={(e) => setSettings(prev => ({ ...prev, realismLevel: e.target.value }))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">Low - Subtle enhancement</option>
                    <option value="medium">Medium - Balanced realism</option>
                    <option value="high">High - Strong realism</option>
                    <option value="ultra">Ultra - Maximum realism</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Skin Smoothing
                  </label>
                  <select
                    value={settings.skinSmoothing}
                    onChange={(e) => setSettings(prev => ({ ...prev, skinSmoothing: e.target.value }))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="natural">Natural</option>
                    <option value="balanced">Balanced</option>
                    <option value="enhanced">Enhanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Face Enhancement
                  </label>
                  <select
                    value={settings.faceEnhancement}
                    onChange={(e) => setSettings(prev => ({ ...prev, faceEnhancement: e.target.value }))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="none">None</option>
                    <option value="subtle">Subtle</option>
                    <option value="moderate">Moderate</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Output Quality ({settings.outputQuality}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={settings.outputQuality}
                    onChange={(e) => setSettings(prev => ({ ...prev, outputQuality: parseInt(e.target.value) }))}
                    disabled={isProcessing}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Process Button */}
            <Button
              onClick={processImage}
              disabled={!inputImage || isProcessing}
              loading={isProcessing}
              iconName="Sparkles"
              iconPosition="left"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              {isProcessing ? 'Processing...' : 'Transform to Realistic'}
            </Button>
          </div>

          {/* Center Panel - Processing & Results */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-lg p-4 border h-full">
              {!isProcessing && !outputImage ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Sparkles" size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Ready to Transform
                  </h3>
                  <p className="text-text-secondary max-w-sm">
                    Upload an image and click "Transform to Realistic" to convert cartoon skin into photorealistic human skin.
                  </p>
                </div>
              ) : isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-24 h-24 relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-spin">
                      <div className="absolute inset-2 bg-card rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-text-primary">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Transforming to Realistic Skin
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {estimatedTime > 0 ? `Estimated time: ${Math.ceil(estimatedTime)}s` : 'Finalizing...'}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-text-secondary space-y-1 text-center">
                    <div>Processing with {processingStats.modelVersion}</div>
                    <div>GPU Usage: {Math.round(processingStats.gpuUsage)}%</div>
                    <div>VRAM: {processingStats.memoryUsed.toFixed(1)} GB</div>
                  </div>
                </div>
              ) : outputImage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary">Realistic Result</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('comparison')}
                        iconName="ArrowLeftRight"
                      >
                        Compare
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownload}
                        iconName="Download"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={outputImage.url}
                      alt="Realistic output"
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Resolution:</span>
                        <span className="text-text-primary">{outputImage.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Process Time:</span>
                        <span className="text-text-primary">{outputImage.processingTime.toFixed(1)}s</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Model:</span>
                        <span className="text-text-primary">{outputImage.modelUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Quality:</span>
                        <span className="text-text-primary">{settings.outputQuality}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Panel - Monitor & History */}
          <div className="lg:col-span-3 space-y-6">
            <GPUResourceMonitor isGenerating={isProcessing} />
            <div className="bg-card rounded-lg p-4 border">
              <ProcessingHistory />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted p-1 mb-4">
            {[
              { id: 'upload', label: 'Upload', icon: 'Upload' },
              { id: 'process', label: 'Process', icon: 'Sparkles' },
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

          {/* Mobile Tab Content */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Mobile Upload */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Upload Image</h3>
                {!inputImage ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name="Upload" size={20} className="text-white" />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('mobile-file-input').click()}
                      iconName="FolderOpen"
                      iconPosition="left"
                      className="mb-2"
                    >
                      Choose File
                    </Button>
                    <input
                      id="mobile-file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <p className="text-xs text-text-secondary">
                      JPG, PNG, WebP up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={inputImage.url}
                        alt="Input"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={resetProcess}
                          iconName="X"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Settings */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Realism Level
                    </label>
                    <select
                      value={settings.realismLevel}
                      onChange={(e) => setSettings(prev => ({ ...prev, realismLevel: e.target.value }))}
                      disabled={isProcessing}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-text-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="ultra">Ultra</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button
                onClick={processImage}
                disabled={!inputImage || isProcessing}
                loading={isProcessing}
                iconName="Sparkles"
                iconPosition="left"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
              >
                {isProcessing ? 'Processing...' : 'Transform'}
              </Button>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="bg-card rounded-lg p-4 border">
              {!isProcessing && !outputImage ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Sparkles" size={24} className="text-white" />
                  </div>
                  <p className="text-text-secondary">Upload an image to start processing</p>
                </div>
              ) : isProcessing ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 relative mb-4 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-spin">
                      <div className="absolute inset-2 bg-card rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-text-primary">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">Processing...</h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {estimatedTime > 0 ? `${Math.ceil(estimatedTime)}s remaining` : 'Almost done...'}
                  </p>
                </div>
              ) : outputImage ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Result</h3>
                  <img
                    src={outputImage.url}
                    alt="Result"
                    className="w-full rounded-lg"
                  />
                  <Button
                    onClick={handleDownload}
                    iconName="Download"
                    iconPosition="left"
                    className="w-full"
                  >
                    Download Result
                  </Button>
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'monitor' && (
            <GPUResourceMonitor isGenerating={isProcessing} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImageRealismModel;