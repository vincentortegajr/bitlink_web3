import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const BatchProcessor = ({ 
  onBatchProcess, 
  settings, 
  processingQueue = [] 
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [batchSettings, setBatchSettings] = useState({
    ...settings,
    outputNaming: 'original_upscaled', // original_upscaled, sequential, timestamp
    preserveFolderStructure: true,
    maxConcurrent: 2
  });

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
    });

    setSelectedFiles(validFiles.map((file, index) => ({
      id: `batch-${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      error: null,
      url: URL.createObjectURL(file)
    })));
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleStartBatch = () => {
    if (selectedFiles.length === 0) return;
    
    onBatchProcess?.(selectedFiles, batchSettings);
    
    // Simulate batch processing updates
    selectedFiles.forEach((file, index) => {
      setTimeout(() => {
        setSelectedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' } : f
        ));
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setSelectedFiles(prev => prev.map(f => {
            if (f.id === file.id && f.status === 'processing') {
              const newProgress = Math.min(100, f.progress + Math.random() * 15);
              if (newProgress >= 100) {
                clearInterval(progressInterval);
                return { ...f, status: 'completed', progress: 100 };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          }));
        }, 1000);
      }, index * 2000);
    });
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
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

  return (
    <div className="space-y-6">
      {/* File Selection */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Select Images</h4>
        
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileSelection}
            className="hidden"
            id="batch-files"
            disabled={isUploading}
          />
          
          <label htmlFor="batch-files" className={cn(
            "cursor-pointer block",
            isUploading && "cursor-not-allowed opacity-50"
          )}>
            <Icon name="Upload" size={24} className="text-text-secondary mx-auto mb-2" />
            <p className="text-text-primary font-medium mb-1">
              Choose multiple images
            </p>
            <p className="text-text-secondary text-sm">
              Supports JPG, PNG, WebP up to 10MB each
            </p>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">
                {selectedFiles.length} files selected
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
          </div>
        )}
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Files to Process</h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded border"
                />
                
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
                  </div>
                  
                  <div className="text-xs text-text-secondary">
                    {formatFileSize(file.size)}
                  </div>
                  
                  {file.status === 'processing' && (
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="bg-primary rounded-full h-1 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {file.error && (
                    <div className="text-xs text-destructive mt-1">
                      {file.error}
                    </div>
                  )}
                </div>

                {file.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(file.id)}
                    iconName="X"
                    className="text-text-secondary hover:text-destructive"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Batch Settings */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Batch Settings</h4>
        
        <div className="space-y-4">
          {/* Output Naming */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Output File Naming
            </label>
            <select
              value={batchSettings.outputNaming}
              onChange={(e) => setBatchSettings(prev => ({
                ...prev,
                outputNaming: e.target.value
              }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
            >
              <option value="original_upscaled">original_upscaled.ext</option>
              <option value="sequential">image_001.ext</option>
              <option value="timestamp">timestamp.ext</option>
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
              max="4"
              value={batchSettings.maxConcurrent}
              onChange={(e) => setBatchSettings(prev => ({
                ...prev,
                maxConcurrent: parseInt(e.target.value)
              }))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>1 (Slower)</span>
              <span>4 (Faster)</span>
            </div>
          </div>

          {/* Scale Factor Override */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Scale Factor (applies to all)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['2x', '4x', '8x'].map((scale) => (
                <button
                  key={scale}
                  onClick={() => setBatchSettings(prev => ({
                    ...prev,
                    scaleFactor: scale
                  }))}
                  className={cn(
                    "p-2 text-center border rounded-lg transition-all text-sm",
                    batchSettings.scaleFactor === scale
                      ? "border-primary bg-primary/5 text-primary" :"border-border hover:border-primary/50 text-text-secondary"
                  )}
                >
                  {scale}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedFiles.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleStartBatch}
              disabled={selectedFiles.some(f => f.status === 'processing')}
              iconName="Play"
              iconPosition="left"
              className="flex-1"
            >
              Start Batch Processing
            </Button>
            
            <div className="text-sm text-text-secondary">
              Est. {Math.ceil(selectedFiles.length * 90 / batchSettings.maxConcurrent / 60)}m
            </div>
          </div>
          
          {/* Cost Estimation */}
          <div className="mt-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Processing Cost</span>
              <span className="text-text-primary font-medium">
                ~${(selectedFiles.length * 0.05).toFixed(2)} GPU credits
              </span>
            </div>
            <div className="text-xs text-text-secondary mt-1">
              Based on {selectedFiles.length} images at {batchSettings.scaleFactor} scale
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchProcessor;