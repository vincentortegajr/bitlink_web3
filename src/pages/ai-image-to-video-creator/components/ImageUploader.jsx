import React, { useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ImageUploader = ({
  onImageUpload,
  uploadedImages = [],
  onImageRemove,
  disabled = false,
  maxImages = 10
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImageUpload?.(files.slice(0, maxImages - uploadedImages.length));
    }
    // Reset input
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onImageUpload?.(imageFiles.slice(0, maxImages - uploadedImages.length));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          disabled 
            ? "border-border/50 bg-muted/30 cursor-not-allowed" :"border-border hover:border-primary/50 cursor-pointer",
          uploadedImages.length >= maxImages && "opacity-50 pointer-events-none"
        )}
        onClick={() => !disabled && uploadedImages.length < maxImages && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || uploadedImages.length >= maxImages}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Upload" size={24} className="text-primary" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-text-primary">
              {uploadedImages.length >= maxImages ? 'Maximum images uploaded' : 'Upload Images'}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {uploadedImages.length >= maxImages 
                ? `${uploadedImages.length}/${maxImages} images`
                : `Drop images here or click to browse (${uploadedImages.length}/${maxImages})`
              }
            </p>
          </div>
          
          {uploadedImages.length < maxImages && (
            <Button
              size="sm"
              variant="outline"
              disabled={disabled}
              iconName="ImageIcon"
              iconPosition="left"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose Files
            </Button>
          )}
        </div>
      </div>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-text-primary">
              Uploaded Images ({uploadedImages.length})
            </h4>
            <Button
              size="xs"
              variant="outline"
              onClick={() => uploadedImages.forEach(img => onImageRemove?.(img.id))}
              disabled={disabled}
              iconName="Trash2"
              iconPosition="left"
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {uploadedImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group bg-card rounded-lg border overflow-hidden"
              >
                {/* Image Preview */}
                <div className="aspect-square">
                  <img
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Info */}
                <div className="p-2">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {image.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatFileSize(image.size)}
                  </p>
                </div>
                
                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                  onClick={() => onImageRemove?.(image.id)}
                  disabled={disabled}
                >
                  <Icon name="X" size={12} />
                </Button>
                
                {/* Image Order Indicator */}
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-primary">Upload Guidelines</p>
            <ul className="text-xs text-text-secondary space-y-0.5">
              <li>• Supports JPG, PNG, WebP formats</li>
              <li>• Recommended: 512x512 to 1024x1024 pixels</li>
              <li>• Max file size: 10MB per image</li>
              <li>• Images will be processed in order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;