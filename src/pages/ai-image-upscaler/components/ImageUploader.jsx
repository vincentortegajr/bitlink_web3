import React, { useState, useRef, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ImageUploader = ({ 
  onImageSelect, 
  loading = false, 
  maxFileSize = 10 * 1024 * 1024,
  acceptedFormats = ['jpg', 'jpeg', 'png', 'webp']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    setError('');
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Please select a valid image format: ${acceptedFormats.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return false;
    }

    return true;
  }, [acceptedFormats, maxFileSize]);

  const processFile = useCallback((file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const imageData = {
          file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          format: file.type
        };
        onImageSelect?.(imageData);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, validateFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (loading) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processFile(imageFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-3">
      {/* Drag & Drop Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragging && !loading
            ? "border-primary bg-primary/5 scale-105" :"border-border hover:border-primary/50 hover:bg-muted/30",
          loading && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary"
          )}>
            <Icon name={loading ? "Loader2" : "Upload"} size={20} className={loading ? "animate-spin" : ""} />
          </div>
          
          <div>
            <p className="text-text-primary font-medium mb-1">
              {loading ? "Processing..." : "Drop image here or click to browse"}
            </p>
            <p className="text-text-secondary text-sm">
              Supports {acceptedFormats.join(', ').toUpperCase()} up to {Math.round(maxFileSize / 1024 / 1024)}MB
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.map(format => `.${format}`).join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      {/* Quick Actions */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={loading}
          iconName="FolderOpen"
          iconPosition="left"
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;