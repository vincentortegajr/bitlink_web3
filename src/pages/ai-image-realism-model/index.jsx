import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Import dedicated components for realism transformation
import RealismComparison from './components/RealismComparison';
import RealismBatchProcessor from './components/RealismBatchProcessor';
import RealismCommunitySharing from './components/RealismCommunitySharing';
import RunPodGPUMonitor from './components/RunPodGPUMonitor';

const AIImageRealismModel = () => {
  const navigate = useNavigate();
  
  // State management
  const [inputImage, setInputImage] = useState(null);
  const [realisticImage, setRealisticImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [activeTab, setActiveTab] = useState('transform');
  const [dragActive, setDragActive] = useState(false);

  // Transformation settings
  const [settings, setSettings] = useState({
    realismLevel: 'high',
    skinSmoothing: 'balanced',
    faceEnhancement: 'subtle',
    colorCorrection: 'auto',
    preserveEyes: true,
    preserveHair: true,
    outputFormat: 'PNG',
    outputQuality: 95
  });

  // Community sharing settings
  const [communitySettings, setCommunitySettings] = useState({
    title: '',
    description: '',
    tags: [],
    category: 'cartoon',
    isPublic: false
  });

  const [processingStats, setProcessingStats] = useState({
    processingTime: 0,
    gpuUsage: 0,
    memoryUsed: 0,
    modelVersion: 'RealismGAN v2.1'
  });

  // Processing history
  const [processingHistory, setProcessingHistory] = useState([]);

  // File upload handler with validation
  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 15MB for realism processing)
    if (file.size > 15 * 1024 * 1024) {
      alert('File size must be less than 15MB for optimal realism processing');
      return;
    }

    // Create image object to get dimensions
    const img = new Image();
    img.onload = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputImage({
          file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height
        });
        setRealisticImage(null); // Clear previous output
        setProgress(0);
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
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

  // Process image to realistic skin with RunPod integration
  const processImage = useCallback(async () => {
    if (!inputImage) return;

    setIsProcessing(true);
    setProgress(0);
    setEstimatedTime(120); // Initial estimate in seconds
    setActiveTab('transform');

    try {
      // Simulate RunPod API call for realism transformation
      const formData = new FormData();
      formData.append('image', inputImage.file);
      formData.append('realism_level', settings.realismLevel);
      formData.append('skin_smoothing', settings.skinSmoothing);
      formData.append('face_enhancement', settings.faceEnhancement);
      formData.append('color_correction', settings.colorCorrection);
      formData.append('preserve_eyes', settings.preserveEyes);
      formData.append('preserve_hair', settings.preserveHair);
      formData.append('output_format', settings.outputFormat.toLowerCase());
      formData.append('output_quality', settings.outputQuality);

      // Simulate realistic processing times based on settings
      const processingTimeEstimate = {
        'low': 60000,      // 1 minute
        'medium': 90000,   // 1.5 minutes
        'high': 120000,    // 2 minutes
        'ultra': 180000    // 3 minutes
      }[settings.realismLevel] || 120000;

      // Simulate progress updates with realistic timing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(97, prev + Math.random() * 6);
          setEstimatedTime(prev => Math.max(0, prev - 4));
          setProcessingStats(prev => ({
            ...prev,
            processingTime: prev.processingTime + 1,
            gpuUsage: 85 + Math.random() * 12,
            memoryUsed: 8.2 + Math.random() * 2.8
          }));
          return newProgress;
        });
      }, 2000);

      // Complete processing
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setEstimatedTime(0);
        
        // Calculate realistic dimensions based on input
        const outputWidth = Math.min(2048, inputImage.width * 1.5);
        const outputHeight = Math.min(2048, inputImage.height * 1.5);
        
        const processedResult = {
          url: `/api/placeholder/${outputWidth}/${outputHeight}?text=Realistic+Skin+Transformation`,
          originalSize: inputImage.size,
          processedSize: Math.floor(inputImage.size * 1.4),
          enhancedSize: `${outputWidth}×${outputHeight}`,
          processingTime: processingTimeEstimate / 1000 + Math.random() * 30 - 15,
          modelUsed: 'RealismGAN v2.1',
          settings: { ...settings },
          quality: settings.outputQuality,
          transformationType: 'cartoon-to-realistic'
        };

        setRealisticImage(processedResult);

        // Add to processing history
        const historyEntry = {
          id: `realism-${Date.now()}`,
          originalName: inputImage.name,
          originalUrl: inputImage.url,
          realisticUrl: processedResult.url,
          settings: { ...settings },
          processedAt: new Date(),
          processingTime: processedResult.processingTime,
          originalSize: `${inputImage.width}×${inputImage.height}`,
          enhancedSize: processedResult.enhancedSize,
          status: 'completed'
        };

        setProcessingHistory(prev => [historyEntry, ...prev.slice(0, 19)]); // Keep last 20

        setProcessingStats(prev => ({
          ...prev,
          processingTime: Math.round(processedResult.processingTime),
          gpuUsage: 35,
          memoryUsed: 4.1
        }));

        setIsProcessing(false);
      }, processingTimeEstimate);

    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      setProgress(0);
      alert('Realism transformation failed. Please try again.');
    }
  }, [inputImage, settings]);

  // Handle batch processing
  const handleBatchProcess = useCallback((files, batchSettings) => {
    console.log('Starting batch realism processing:', files, batchSettings);
    // Batch processing logic would be implemented here
  }, []);

  // Handle community sharing
  const handleCommunityShare = useCallback((shareData) => {
    console.log('Sharing realism transformation:', shareData);
    // Community sharing logic would be implemented here
  }, []);

  // Handle RunPod instance management
  const handleInstanceManagement = useCallback((action) => {
    console.log('RunPod instance action:', action);
    // RunPod management logic would be implemented here
  }, []);

  const handleDownload = () => {
    if (realisticImage?.url) {
      const link = document.createElement('a');
      link.href = realisticImage.url;
      link.download = `realistic-${inputImage?.name || 'transformed-image'}.${settings.outputFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetProcess = () => {
    setInputImage(null);
    setRealisticImage(null);
    setProgress(0);
    setIsProcessing(false);
    setEstimatedTime(0);
    setActiveTab('transform');
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg">
              <Icon name="Sparkles" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">AI Image Realism Model</h1>
              <p className="text-text-secondary text-lg">Transform cartoon & digital art into photorealistic human skin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Icon name="Cpu" size={16} className="text-pink-500" />
              <span>Powered by RealismGAN v2.1</span>
            </div>
            <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-rose-500" />
              <span>RunPod GPU Accelerated</span>
            </div>
            <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-purple-500" />
              <span>Community Powered</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Upload & Settings */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Upload */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Icon name="Upload" size={18} className="text-pink-500" />
                Upload Cartoon Image
              </h3>
              
              {!inputImage ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
                    dragActive
                      ? "border-pink-500 bg-pink-50 scale-[1.02]"
                      : "border-border hover:border-pink-300 hover:bg-pink-50/50"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Upload" size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Drop cartoon image here</h4>
                  <p className="text-sm text-text-secondary mb-4">
                    or click to browse cartoon/digital art files
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
                  <p className="text-xs text-text-secondary mt-4">
                    Best results: Cartoon portraits, anime characters, digital art
                    <br />
                    Supports JPG, PNG, WebP up to 15MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-muted">
                    <img
                      src={inputImage.url}
                      alt="Input cartoon"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={resetProcess}
                        iconName="X"
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                      <Icon name="Palette" size={12} className="inline mr-1" />
                      Cartoon Input
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary space-y-1 bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span>File:</span>
                      <span className="truncate max-w-[120px] font-mono">{inputImage.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{(inputImage.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span>{inputImage.width}×{inputImage.height}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Realism Settings */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Icon name="Settings" size={18} className="text-rose-500" />
                Realism Settings
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Realism Level
                  </label>
                  <select
                    value={settings.realismLevel}
                    onChange={(e) => setSettings(prev => ({ ...prev, realismLevel: e.target.value }))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="low">Low - Subtle realistic enhancement</option>
                    <option value="medium">Medium - Balanced cartoon-to-real</option>
                    <option value="high">High - Strong realism transformation</option>
                    <option value="ultra">Ultra - Maximum photorealism</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Skin Smoothing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['natural', 'balanced', 'enhanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSettings(prev => ({ ...prev, skinSmoothing: level }))}
                        disabled={isProcessing}
                        className={cn(
                          "p-2 text-center border rounded-lg transition-all text-sm font-medium",
                          settings.skinSmoothing === level
                            ? "border-pink-500 bg-pink-50 text-pink-700" :"border-border hover:border-pink-300 text-text-secondary hover:bg-pink-50/30"
                        )}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Face Enhancement
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['subtle', 'moderate'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSettings(prev => ({ ...prev, faceEnhancement: level }))}
                        disabled={isProcessing}
                        className={cn(
                          "p-2 text-center border rounded-lg transition-all text-sm font-medium",
                          settings.faceEnhancement === level
                            ? "border-rose-500 bg-rose-50 text-rose-700" :"border-border hover:border-rose-300 text-text-secondary hover:bg-rose-50/30"
                        )}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preservation Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-text-primary">Preserve Features</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.preserveEyes}
                        onChange={(e) => setSettings(prev => ({ ...prev, preserveEyes: e.target.checked }))}
                        disabled={isProcessing}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-text-secondary">Preserve original eye style</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.preserveHair}
                        onChange={(e) => setSettings(prev => ({ ...prev, preserveHair: e.target.checked }))}
                        disabled={isProcessing}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-text-secondary">Preserve hair texture</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Output Quality ({settings.outputQuality}%)
                  </label>
                  <input
                    type="range"
                    min="75"
                    max="100"
                    step="5"
                    value={settings.outputQuality}
                    onChange={(e) => setSettings(prev => ({ ...prev, outputQuality: parseInt(e.target.value) }))}
                    disabled={isProcessing}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>Good</span>
                    <span>Perfect</span>
                  </div>
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
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-lg py-3 shadow-lg"
            >
              {isProcessing ? 'Transforming to Realistic...' : 'Transform to Realistic Skin'}
            </Button>
          </div>

          {/* Center Panel - Comparison & Results */}
          <div className="lg:col-span-6">
            <RealismComparison
              originalImage={inputImage}
              realisticImage={realisticImage}
              isProcessing={isProcessing}
              progress={progress}
              onDownload={handleDownload}
              onReprocess={processImage}
            />
          </div>

          {/* Right Panel - Monitor & Tools */}
          <div className="lg:col-span-3 space-y-6">
            <RunPodGPUMonitor 
              isProcessing={isProcessing} 
              onInstanceManagement={handleInstanceManagement}
            />
            
            {/* Processing History */}
            {processingHistory.length > 0 && (
              <div className="bg-card rounded-xl p-4 border shadow-sm">
                <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Icon name="History" size={16} />
                  Recent Transformations
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {processingHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <img
                        src={item.originalUrl}
                        alt="Original"
                        className="w-10 h-10 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {item.originalName}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {item.settings.realismLevel} • {Math.round(item.processingTime)}s
                        </p>
                      </div>
                      <Icon name="ArrowRight" size={12} className="text-text-secondary" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Tab Navigation */}
          <div className="flex rounded-xl bg-muted p-1 mb-6 shadow-sm">
            {[
              { id: 'transform', label: 'Transform', icon: 'Sparkles' },
              { id: 'batch', label: 'Batch', icon: 'Layers' },
              { id: 'community', label: 'Share', icon: 'Users' },
              { id: 'monitor', label: 'Monitor', icon: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                    : "text-text-secondary hover:text-text-primary hover:bg-background/50"
                )}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Tab Content */}
          <div className="space-y-6">
            {activeTab === 'transform' && (
              <>
                {/* Mobile Upload */}
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="font-semibold text-text-primary mb-4">Upload Cartoon Image</h3>
                  {!inputImage ? (
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon name="Upload" size={24} className="text-white" />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('mobile-file-input').click()}
                        iconName="FolderOpen"
                        iconPosition="left"
                        className="mb-3"
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
                        Best with cartoon portraits & anime characters
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden bg-muted">
                        <img
                          src={inputImage.url}
                          alt="Input"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
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
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="font-semibold text-text-primary mb-4">Quick Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Realism Level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'medium', label: 'Medium' },
                          { value: 'high', label: 'High' }
                        ].map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setSettings(prev => ({ ...prev, realismLevel: level.value }))}
                            disabled={isProcessing}
                            className={cn(
                              "p-3 text-center border rounded-lg transition-all text-sm font-medium",
                              settings.realismLevel === level.value
                                ? "border-pink-500 bg-pink-50 text-pink-700" :"border-border hover:border-pink-300 text-text-secondary"
                            )}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={processImage}
                  disabled={!inputImage || isProcessing}
                  loading={isProcessing}
                  iconName="Sparkles"
                  iconPosition="left"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-lg py-4 shadow-lg"
                >
                  {isProcessing ? 'Transforming...' : 'Transform to Realistic'}
                </Button>

                {/* Mobile Comparison */}
                <RealismComparison
                  originalImage={inputImage}
                  realisticImage={realisticImage}
                  isProcessing={isProcessing}
                  progress={progress}
                  onDownload={handleDownload}
                  onReprocess={processImage}
                />
              </>
            )}

            {activeTab === 'batch' && (
              <RealismBatchProcessor
                onBatchProcess={handleBatchProcess}
                settings={settings}
              />
            )}

            {activeTab === 'community' && (
              <RealismCommunitySharing
                originalImage={inputImage}
                realisticImage={realisticImage}
                onShare={handleCommunityShare}
                settings={communitySettings}
                onSettingsChange={setCommunitySettings}
              />
            )}

            {activeTab === 'monitor' && (
              <RunPodGPUMonitor 
                isProcessing={isProcessing} 
                onInstanceManagement={handleInstanceManagement}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageRealismModel;