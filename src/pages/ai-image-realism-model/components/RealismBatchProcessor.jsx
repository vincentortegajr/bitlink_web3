import React, { useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const RealismBatchProcessor = ({ 
  onBatchProcess, 
  settings = {}, 
  processingQueue = [] 
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [batchSettings, setBatchSettings] = useState({
    realismLevel: settings.realismLevel || 'high',
    skinSmoothing: settings.skinSmoothing || 'balanced',
    faceEnhancement: settings.faceEnhancement || 'subtle',
    outputFormat: 'PNG',
    outputQuality: 95,
    outputNaming: 'original_realistic',
    preserveFolderStructure: true,
    maxConcurrent: 2,
    applyWatermark: false
  });

  const handleFileSelection = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isValidType = ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    const processedFiles = validFiles.map((file, index) => ({
      id: `realistic-batch-${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending', // pending, processing, completed, error
      progress: 0,
      error: null,
      url: URL.createObjectURL(file),
      originalDimensions: null,
      estimatedTime: Math.round(85 + Math.random() * 40) // 85-125 seconds estimation
    }));

    setSelectedFiles(prev => [...prev, ...processedFiles]);
  }, []);

  const handleInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files);
    }
  }, [handleFileSelection]);

  const handleRemoveFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleStartBatch = async () => {
    if (selectedFiles.length === 0) return;
    
    const pendingFiles = selectedFiles.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    // Start batch processing
    onBatchProcess?.(pendingFiles, batchSettings);
    
    // Simulate batch processing with more realistic timing
    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i];
      const delay = i * (60000 / batchSettings.maxConcurrent); // Stagger starts based on concurrency
      
      setTimeout(() => {
        // Set to processing
        setSelectedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing', progress: 0 } : f
        ));
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setSelectedFiles(prev => prev.map(f => {
            if (f.id === file.id && f.status === 'processing') {
              const newProgress = Math.min(98, f.progress + Math.random() * 12);
              
              if (newProgress >= 98) {
                clearInterval(progressInterval);
                
                // Complete processing after a short delay
                setTimeout(() => {
                  setSelectedFiles(prev => prev.map(f => 
                    f.id === file.id 
                      ? { 
                          ...f, 
                          status: 'completed', 
                          progress: 100,
                          resultUrl: `/api/placeholder/512/512?text=Realistic+${f.name}`,
                          processingTime: file.estimatedTime + Math.random() * 20 - 10
                        } 
                      : f
                  ));
                }, 2000);
                
                return { ...f, progress: 98 };
              }
              
              return { ...f, progress: newProgress };
            }
            return f;
          }));
        }, 1500);
      }, delay);
    }
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
  };

  const handleDownloadAll = () => {
    const completedFiles = selectedFiles.filter(f => f.status === 'completed' && f.resultUrl);
    
    completedFiles.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file.resultUrl;
        link.download = `realistic-${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // Stagger downloads
    });
  };

  const formatFileSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'processing': return 'Loader2';
      case 'completed': return 'CheckCircle';
      case 'error': return 'XCircle';
      default: return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-text-secondary';
      case 'processing': return 'text-yellow-500';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-destructive';
      default: return 'text-text-secondary';
    }
  };

  const totalFiles = selectedFiles.length;
  const completedFiles = selectedFiles.filter(f => f.status === 'completed').length;
  const processingFiles = selectedFiles.filter(f => f.status === 'processing').length;
  const pendingFiles = selectedFiles.filter(f => f.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Layers" size={18} className="text-pink-500" />
            Batch Realism Processing
          </h4>
          <p className="text-sm text-text-secondary mt-1">
            Transform multiple cartoon images to realistic skin at once
          </p>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="text-right">
            <div className="text-sm font-medium text-text-primary">
              {completedFiles}/{totalFiles} completed
            </div>
            <div className="text-xs text-text-secondary">
              {processingFiles} processing • {pendingFiles} pending
            </div>
          </div>
        )}
      </div>

      {/* File Upload Area */}
      <div>
        <div 
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
            dragActive
              ? "border-pink-500 bg-pink-50 scale-[1.02]"
              : "border-border hover:border-pink-300 hover:bg-pink-50/30"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleInputChange}
            className="hidden"
            id="batch-realism-files"
            disabled={isUploading}
          />
          
          <label htmlFor="batch-realism-files" className={cn(
            "cursor-pointer block",
            isUploading && "cursor-not-allowed opacity-50"
          )}>
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Upload" size={24} className="text-white" />
            </div>
            <h5 className="text-lg font-semibold text-text-primary mb-2">
              Choose Cartoon Images
            </h5>
            <p className="text-text-secondary text-sm mb-4">
              Drop files here or click to browse multiple cartoon/digital art images
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <Icon name="FileImage" size={12} />
                <span>JPG, PNG, WebP</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="HardDrive" size={12} />
                <span>Up to 10MB each</span>
              </div>
            </div>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {selectedFiles.length} files selected ({(selectedFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(1)} MB total)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-text-primary">Files Queue</h5>
            {completedFiles > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                iconName="Download"
                iconPosition="left"
              >
                Download All ({completedFiles})
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-80 overflow-y-auto bg-muted/20 rounded-lg p-2">
            {selectedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                <div className="relative">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  {file.status === 'completed' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="Check" size={10} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon 
                      name={getStatusIcon(file.status)} 
                      size={14} 
                      className={cn(
                        getStatusColor(file.status),
                        file.status === 'processing' && 'animate-spin'
                      )}
                    />
                    <span className="font-medium text-text-primary text-sm truncate">
                      {file.name}
                    </span>
                    {file.status === 'processing' && (
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                        {Math.round(file.progress)}%
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-text-secondary mb-1">
                    {formatFileSize(file.size)} • Est. {file.estimatedTime}s
                  </div>
                  
                  {file.status === 'processing' && (
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full h-1.5 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {file.error && (
                    <div className="text-xs text-destructive mt-1 bg-destructive/10 px-2 py-1 rounded">
                      {file.error}
                    </div>
                  )}

                  {file.status === 'completed' && file.processingTime && (
                    <div className="text-xs text-green-600 mt-1">
                      Completed in {Math.round(file.processingTime)}s
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {file.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                      iconName="X"
                      className="text-text-secondary hover:text-destructive h-8 w-8 p-0"
                    />
                  )}
                  
                  {file.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.resultUrl;
                        link.download = `realistic-${file.name}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      iconName="Download"
                      className="text-text-secondary hover:text-primary h-8 w-8 p-0"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Batch Settings */}
      <div>
        <h5 className="font-medium text-text-primary mb-3">Batch Processing Settings</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Realism Level */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Realism Level
            </label>
            <select
              value={batchSettings.realismLevel}
              onChange={(e) => setBatchSettings(prev => ({
                ...prev,
                realismLevel: e.target.value
              }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
            >
              <option value="low">Low - Subtle realism</option>
              <option value="medium">Medium - Balanced realism</option>
              <option value="high">High - Strong realism</option>
              <option value="ultra">Ultra - Maximum realism</option>
            </select>
          </div>

          {/* Skin Smoothing */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Skin Smoothing
            </label>
            <select
              value={batchSettings.skinSmoothing}
              onChange={(e) => setBatchSettings(prev => ({
                ...prev,
                skinSmoothing: e.target.value
              }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
            >
              <option value="natural">Natural</option>
              <option value="balanced">Balanced</option>
              <option value="enhanced">Enhanced</option>
            </select>
          </div>

          {/* Processing Concurrency */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Concurrent Processing: {batchSettings.maxConcurrent} files
            </label>
            <input
              type="range"
              min="1"
              max="3"
              value={batchSettings.maxConcurrent}
              onChange={(e) => setBatchSettings(prev => ({
                ...prev,
                maxConcurrent: parseInt(e.target.value)
              }))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>1 (Slower, Higher Quality)</span>
              <span>3 (Faster)</span>
            </div>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['PNG', 'JPG'].map((format) => (
                <button
                  key={format}
                  onClick={() => setBatchSettings(prev => ({
                    ...prev,
                    outputFormat: format
                  }))}
                  className={cn(
                    "p-2 text-center border rounded-lg transition-all text-sm",
                    batchSettings.outputFormat === format
                      ? "border-pink-500 bg-pink-50 text-pink-700" :"border-border hover:border-pink-300 text-text-secondary"
                  )}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h6 className="font-medium text-text-primary">Ready to Process</h6>
              <p className="text-sm text-text-secondary">
                {pendingFiles} images ready for realistic transformation
              </p>
            </div>
            
            <div className="text-right text-sm text-text-secondary">
              <div>Est. Time: {Math.ceil(pendingFiles * 90 / batchSettings.maxConcurrent / 60)}m</div>
              <div>GPU Cost: ~${(pendingFiles * 0.08).toFixed(2)}</div>
            </div>
          </div>

          <Button
            onClick={handleStartBatch}
            disabled={pendingFiles === 0 || processingFiles > 0}
            iconName={processingFiles > 0 ? "Loader2" : "Play"}
            iconPosition="left"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            loading={processingFiles > 0}
          >
            {processingFiles > 0 
              ? `Processing ${processingFiles} images...`
              : `Start Batch Processing (${pendingFiles} images)`
            }
          </Button>
        </div>
      )}

      {/* Processing Summary */}
      {totalFiles > 0 && (
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-card border rounded-lg p-3">
            <div className="text-lg font-bold text-text-primary">{totalFiles}</div>
            <div className="text-xs text-text-secondary">Total Files</div>
          </div>
          <div className="bg-card border rounded-lg p-3">
            <div className="text-lg font-bold text-yellow-600">{processingFiles}</div>
            <div className="text-xs text-text-secondary">Processing</div>
          </div>
          <div className="bg-card border rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{completedFiles}</div>
            <div className="text-xs text-text-secondary">Completed</div>
          </div>
          <div className="bg-card border rounded-lg p-3">
            <div className="text-lg font-bold text-text-secondary">{pendingFiles}</div>
            <div className="text-xs text-text-secondary">Pending</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealismBatchProcessor;