import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ExportSettings = ({
  audio,
  onExport,
  disabled = false
}) => {
  const [selectedFormats, setSelectedFormats] = useState(['mp3']);
  const [selectedQualities, setSelectedQualities] = useState(['high']);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [addWatermark, setAddWatermark] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    {
      value: 'mp3',
      label: 'MP3',
      icon: 'Music',
      description: 'Universal compatibility',
      size: '~2.5MB',
      compatibility: 'All devices'
    },
    {
      value: 'wav',
      label: 'WAV',
      icon: 'Waveform',
      description: 'Uncompressed quality',
      size: '~15MB',
      compatibility: 'High-end audio'
    },
    {
      value: 'ogg',
      label: 'OGG',
      icon: 'FileAudio',
      description: 'Open source format',
      size: '~2MB',
      compatibility: 'Web/browsers'
    }
  ];

  const qualityOptions = [
    {
      value: 'standard',
      label: 'Standard',
      bitrate: '128 kbps',
      description: 'Good for voice',
      size: '1x'
    },
    {
      value: 'high',
      label: 'High',
      bitrate: '192 kbps',
      description: 'Balanced quality',
      size: '1.5x'
    },
    {
      value: 'premium',
      label: 'Premium',
      bitrate: '320 kbps',
      description: 'Maximum quality',
      size: '2.5x'
    }
  ];

  const toggleFormat = (format) => {
    setSelectedFormats(prev => 
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const toggleQuality = (quality) => {
    setSelectedQualities(prev => 
      prev.includes(quality)
        ? prev.filter(q => q !== quality)
        : [...prev, quality]
    );
  };

  const handleExport = async () => {
    if (!audio || selectedFormats.length === 0 || selectedQualities.length === 0) return;

    setIsExporting(true);

    try {
      // Export for each format and quality combination
      for (const format of selectedFormats) {
        for (const quality of selectedQualities) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
          onExport?.(format, quality, {
            includeMetadata,
            addWatermark,
            filename: `${audio.id}-${quality}.${format}`
          });
        }
      }
    } finally {
      setIsExporting(false);
    }
  };

  const estimatedFileSize = (format, quality) => {
    if (!audio?.duration) return '~0MB';
    
    const baseSizes = { mp3: 2.5, wav: 15, ogg: 2 };
    const qualityMultipliers = { standard: 0.7, high: 1, premium: 1.6 };
    
    const estimatedMB = (baseSizes[format] || 2.5) * 
                       (qualityMultipliers[quality] || 1) * 
                       (audio.duration / 60); // Scale by duration
    
    return `~${estimatedMB.toFixed(1)}MB`;
  };

  const totalExports = selectedFormats.length * selectedQualities.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-1">
          <Icon name="Download" size={18} />
          Export Settings
        </h3>
        <p className="text-sm text-text-secondary">
          {audio ? 'Configure export options for your audio' : 'Generate audio to enable export'}
        </p>
      </div>

      {audio && (
        <>
          {/* Audio Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={14} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">Audio Details</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-secondary">Duration:</span>
                <span className="ml-1 font-medium">{audio.duration}s</span>
              </div>
              <div>
                <span className="text-text-secondary">Voice:</span>
                <span className="ml-1 font-medium">{audio.voice?.name || 'Default'}</span>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Export Formats</h4>
            
            <div className="space-y-2">
              {formatOptions.map((format) => (
                <label
                  key={format.value}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedFormats.includes(format.value)
                      ? "border-primary bg-primary/5" :"border-border hover:border-border/80",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(format.value)}
                    onChange={() => toggleFormat(format.value)}
                    disabled={disabled}
                    className="w-4 h-4 text-primary mt-0.5"
                  />
                  
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-muted/50 rounded-md">
                      <Icon name={format.icon} size={16} className="text-text-secondary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-text-primary">{format.label}</span>
                        <span className="text-xs text-text-secondary">{format.size}</span>
                      </div>
                      <p className="text-xs text-text-secondary mb-1">{format.description}</p>
                      <p className="text-xs text-text-secondary">
                        <Icon name="Smartphone" size={12} className="inline mr-1" />
                        {format.compatibility}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Audio Quality</h4>
            
            <div className="space-y-2">
              {qualityOptions.map((quality) => (
                <label
                  key={quality.value}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedQualities.includes(quality.value)
                      ? "border-primary bg-primary/5" :"border-border hover:border-border/80",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedQualities.includes(quality.value)}
                    onChange={() => toggleQuality(quality.value)}
                    disabled={disabled}
                    className="w-4 h-4 text-primary"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text-primary">{quality.label}</span>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span>{quality.bitrate}</span>
                        <span>•</span>
                        <span>{quality.size} size</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary">{quality.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Additional Options</h4>
            
            <div className="space-y-3">
              <label className={cn(
                "flex items-center gap-3 cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed"
              )}>
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  disabled={disabled}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Include Metadata</span>
                  <p className="text-xs text-text-secondary">Add title, voice info, and generation settings</p>
                </div>
              </label>

              <label className={cn(
                "flex items-center gap-3 cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed"
              )}>
                <input
                  type="checkbox"
                  checked={addWatermark}
                  onChange={(e) => setAddWatermark(e.target.checked)}
                  disabled={disabled}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Add Audio Watermark</span>
                  <p className="text-xs text-text-secondary">Brief audio signature at the end</p>
                </div>
              </label>
            </div>
          </div>

          {/* Export Summary */}
          {totalExports > 0 && (
            <div className="bg-card border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Package" size={14} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">Export Summary</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total files:</span>
                  <span className="font-medium">{totalExports}</span>
                </div>
                
                <div className="space-y-1">
                  {selectedFormats.map(format => 
                    selectedQualities.map(quality => (
                      <div key={`${format}-${quality}`} className="flex justify-between">
                        <span className="text-text-secondary">
                          {format.toUpperCase()} ({quality}):
                        </span>
                        <span className="font-medium">{estimatedFileSize(format, quality)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={disabled || totalExports === 0 || isExporting}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            className="w-full"
          >
            {isExporting 
              ? 'Exporting...' 
              : `Export ${totalExports} File${totalExports !== 1 ? 's' : ''}`
            }
          </Button>
        </>
      )}

      {/* No Audio State */}
      {!audio && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-lg flex items-center justify-center">
            <Icon name="Download" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-text-secondary text-sm">
            Generate audio first to access export options
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportSettings;