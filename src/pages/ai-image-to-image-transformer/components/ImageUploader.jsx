import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ImageUploader = ({ onImageUpload, onImageRemove, uploadedImage, loading = false }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, []);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        onImageUpload?.({
          file,
          url: imageUrl,
          name: file.name,
          size: file.size,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setCropMode(false);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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
      {!uploadedImage && !imagePreview && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            isDragging 
              ? "border-primary bg-primary/5" :"border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={loading}
          />
          
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Upload" size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-text-primary">Upload an image</p>
              <p className="text-sm text-text-secondary">
                Drag and drop or click to browse
              </p>
            </div>
            <p className="text-xs text-text-secondary">
              Supports: JPG, PNG, WebP (Max 10MB)
            </p>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {(uploadedImage || imagePreview) && (
        <div className="space-y-4">
          <div className="relative bg-card rounded-lg border overflow-hidden">
            <div className="aspect-square bg-muted/30 flex items-center justify-center">
              <img
                src={uploadedImage?.url || imagePreview}
                alt="Uploaded"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Image Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setCropMode(!cropMode)}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
              >
                <Icon name="Crop" size={16} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleRemoveImage}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>

          {/* Image Info */}
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">Image Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Replace
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-text-secondary">Filename</label>
                <p className="font-medium text-text-primary truncate">
                  {uploadedImage?.name || 'uploaded-image'}
                </p>
              </div>
              <div>
                <label className="text-text-secondary">File Size</label>
                <p className="font-medium text-text-primary">
                  {uploadedImage?.size ? formatFileSize(uploadedImage.size) : 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-text-secondary">Type</label>
                <p className="font-medium text-text-primary">
                  {uploadedImage?.type || 'image/*'}
                </p>
              </div>
              <div>
                <label className="text-text-secondary">Status</label>
                <p className="font-medium text-success">Ready</p>
              </div>
            </div>
          </div>

          {/* Crop Tools (if crop mode is active) */}
          {cropMode && (
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text-primary">Crop & Resize</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCropMode(false)}
                  iconName="X"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" iconName="Square">
                  Square
                </Button>
                <Button variant="outline" size="sm" iconName="Rectangle">
                  16:9
                </Button>
                <Button variant="outline" size="sm" iconName="Smartphone">
                  9:16
                </Button>
                <Button variant="outline" size="sm" iconName="Monitor">
                  4:3
                </Button>
              </div>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  Reset
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  Apply Crop
                </Button>
              </div>
            </div>
          )}

          {/* Quick Enhancement */}
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold text-text-primary mb-3">Quick Enhancement</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" iconName="Sun">
                Brightness
              </Button>
              <Button variant="outline" size="sm" iconName="Contrast">
                Contrast
              </Button>
              <Button variant="outline" size="sm" iconName="Palette">
                Saturation
              </Button>
              <Button variant="outline" size="sm" iconName="Focus">
                Sharpen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;