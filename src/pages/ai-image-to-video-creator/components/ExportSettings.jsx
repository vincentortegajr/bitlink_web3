import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';

const ExportSettings = ({
  videoSettings = {},
  onSettingsChange,
  disabled = false,
  mobile = false
}) => {
  const updateSetting = (key, value) => {
    onSettingsChange?.({
      ...videoSettings,
      [key]: value
    });
  };

  const resolutionOptions = [
    { value: '512x512', label: '512×512 (Square)', ratio: '1:1', size: '~2MB' },
    { value: '768x432', label: '768×432 (16:9)', ratio: '16:9', size: '~3MB' },
    { value: '432x768', label: '432×768 (9:16)', ratio: '9:16', size: '~3MB' },
    { value: '1024x576', label: '1024×576 (16:9 HD)', ratio: '16:9', size: '~6MB' },
    { value: '576x1024', label: '576×1024 (9:16 HD)', ratio: '9:16', size: '~6MB' },
    { value: '1280x720', label: '1280×720 (720p)', ratio: '16:9', size: '~10MB' },
    { value: '1920x1080', label: '1920×1080 (1080p)', ratio: '16:9', size: '~20MB' }
  ];

  const formatOptions = [
    { value: 'mp4', label: 'MP4 (H.264)', description: 'Best compatibility', icon: 'Video' },
    { value: 'webm', label: 'WebM (VP9)', description: 'Smaller file size', icon: 'Globe' },
    { value: 'mov', label: 'MOV (ProRes)', description: 'Professional editing', icon: 'Film' },
    { value: 'gif', label: 'GIF Animation', description: 'Social media ready', icon: 'Image' }
  ];

  const qualityOptions = [
    { value: 'draft', label: 'Draft', description: 'Fast processing', bitrate: '2 Mbps' },
    { value: 'standard', label: 'Standard', description: 'Balanced quality', bitrate: '5 Mbps' },
    { value: 'high', label: 'High', description: 'Best quality', bitrate: '10 Mbps' },
    { value: 'ultra', label: 'Ultra', description: 'Maximum quality', bitrate: '20 Mbps' }
  ];

  const compressionOptions = [
    { value: 'web', label: 'Web Optimized', description: 'For online sharing', icon: 'Globe' },
    { value: 'social', label: 'Social Media', description: 'Platform optimized', icon: 'Share' },
    { value: 'archive', label: 'Archive Quality', description: 'Long-term storage', icon: 'Archive' },
    { value: 'streaming', label: 'Streaming Ready', description: 'Adaptive bitrate', icon: 'Tv' }
  ];

  const estimateFileSize = () => {
    const resolution = videoSettings.resolution || '512x512';
    const duration = videoSettings.duration || 3;
    const quality = videoSettings.quality || 'standard';
    const format = videoSettings.format || 'mp4';

    // Base calculations (rough estimates)
    const resolutionMultiplier = {
      '512x512': 1,
      '768x432': 1.5,
      '432x768': 1.5,
      '1024x576': 2.5,
      '576x1024': 2.5,
      '1280x720': 4,
      '1920x1080': 8
    };

    const qualityMultiplier = {
      'draft': 0.5,
      'standard': 1,
      'high': 2,
      'ultra': 4
    };

    const formatMultiplier = {
      'mp4': 1,
      'webm': 0.7,
      'mov': 2,
      'gif': 0.8
    };

    const baseSizeMB = 2; // Base size for 512x512, 3 seconds, standard quality
    const estimatedSize = baseSizeMB * 
      (resolutionMultiplier[resolution] || 1) * 
      (duration / 3) * 
      (qualityMultiplier[quality] || 1) * 
      (formatMultiplier[format] || 1);

    return Math.round(estimatedSize * 10) / 10; // Round to 1 decimal
  };

  return (
    <div className="space-y-4">
      {/* Resolution Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Resolution</label>
        <Select
          value={videoSettings.resolution || '512x512'}
          onValueChange={(value) => updateSetting('resolution', value)}
          disabled={disabled}
        >
          {resolutionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} • {option.size}
            </option>
          ))}
        </Select>
        <p className="text-xs text-text-secondary">
          Higher resolutions require more processing time and GPU memory
        </p>
      </div>

      {/* Format Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Format</label>
        <div className="grid grid-cols-1 gap-2">
          {formatOptions.map((format) => (
            <button
              key={format.value}
              onClick={() => updateSetting('format', format.value)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                videoSettings.format === format.value
                  ? "border-primary bg-primary/10" :"border-border bg-card hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon name={format.icon} size={16} className={
                videoSettings.format === format.value ? "text-primary" : "text-text-secondary"
              } />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{format.label}</p>
                <p className="text-xs text-text-secondary">{format.description}</p>
              </div>
              {videoSettings.format === format.value && (
                <Icon name="Check" size={16} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Quality</label>
        <div className="grid grid-cols-1 gap-2">
          {qualityOptions.map((quality) => (
            <button
              key={quality.value}
              onClick={() => updateSetting('quality', quality.value)}
              disabled={disabled}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border text-left transition-colors",
                videoSettings.quality === quality.value
                  ? "border-primary bg-primary/10" :"border-border bg-card hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{quality.label}</p>
                <p className="text-xs text-text-secondary">{quality.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary">{quality.bitrate}</p>
                {videoSettings.quality === quality.value && (
                  <Icon name="Check" size={16} className="text-primary mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Compression Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Optimization</label>
        <div className="grid grid-cols-1 gap-2">
          {compressionOptions.map((compression) => (
            <button
              key={compression.value}
              onClick={() => updateSetting('compression', compression.value)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                videoSettings.compression === compression.value
                  ? "border-primary bg-primary/10" :"border-border bg-card hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon name={compression.icon} size={16} className={
                videoSettings.compression === compression.value ? "text-primary" : "text-text-secondary"
              } />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{compression.label}</p>
                <p className="text-xs text-text-secondary">{compression.description}</p>
              </div>
              {videoSettings.compression === compression.value && (
                <Icon name="Check" size={16} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">Additional Options</label>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Include Watermark</p>
              <p className="text-xs text-text-secondary">Add subtle branding</p>
            </div>
            <button
              onClick={() => updateSetting('watermark', !videoSettings.watermark)}
              disabled={disabled}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                videoSettings.watermark ? "bg-primary" : "bg-muted",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  videoSettings.watermark ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Loop Video</p>
              <p className="text-xs text-text-secondary">Seamless playback loop</p>
            </div>
            <button
              onClick={() => updateSetting('loop', !videoSettings.loop)}
              disabled={disabled}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                videoSettings.loop ? "bg-primary" : "bg-muted",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  videoSettings.loop ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Generate Thumbnail</p>
              <p className="text-xs text-text-secondary">Extract preview frame</p>
            </div>
            <button
              onClick={() => updateSetting('thumbnail', !videoSettings.thumbnail)}
              disabled={disabled}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                videoSettings.thumbnail ? "bg-primary" : "bg-muted",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  videoSettings.thumbnail ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* File Size Estimation */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Icon name="HardDrive" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-primary">Estimated Output</p>
            <div className="space-y-0.5">
              <p className="text-xs text-text-secondary">
                File size: ~{estimateFileSize()} MB
              </p>
              <p className="text-xs text-text-secondary">
                Processing time: ~{Math.round((estimateFileSize() / 2) * 30)}s
              </p>
              <p className="text-xs text-text-secondary">
                Resolution: {videoSettings.resolution || '512x512'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Quick Presets</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateSetting('resolution', '768x432');
              updateSetting('format', 'mp4');
              updateSetting('quality', 'standard');
              updateSetting('compression', 'web');
            }}
            disabled={disabled}
            iconName="Globe"
            iconPosition="left"
          >
            Web
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateSetting('resolution', '432x768');
              updateSetting('format', 'mp4');
              updateSetting('quality', 'high');
              updateSetting('compression', 'social');
            }}
            disabled={disabled}
            iconName="Smartphone"
            iconPosition="left"
          >
            Mobile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportSettings;