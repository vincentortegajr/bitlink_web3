import React from 'react';
import Button from '../../../components/ui/Button';

import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const QualitySettings = ({ settings, onSettingsChange, loading = false }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const scaleFactors = [
    { value: '2x', label: '2x (Fast)', description: 'Quick enhancement' },
    { value: '4x', label: '4x (Balanced)', description: 'Best quality/speed' },
    { value: '8x', label: '8x (Maximum)', description: 'Highest quality' }
  ];

  const qualityPresets = [
    { value: 'fast', label: 'Fast', description: 'Quick processing' },
    { value: 'balanced', label: 'Balanced', description: 'Optimal quality/speed' },
    { value: 'high_quality', label: 'High Quality', description: 'Maximum enhancement' }
  ];

  const formatOptions = [
    { value: 'png', label: 'PNG', description: 'Lossless quality' },
    { value: 'jpg', label: 'JPEG', description: 'Smaller file size' },
    { value: 'webp', label: 'WebP', description: 'Modern format' }
  ];

  return (
    <div className="space-y-6">
      {/* Scale Factor */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Scale Factor</h4>
        <div className="grid grid-cols-1 gap-2">
          {scaleFactors.map((factor) => (
            <button
              key={factor.value}
              onClick={() => handleSettingChange('scaleFactor', factor.value)}
              disabled={loading}
              className={cn(
                "p-3 text-left border rounded-lg transition-all",
                settings.scaleFactor === factor.value
                  ? "border-primary bg-primary/5 text-primary" :"border-border hover:border-primary/50 text-text-secondary hover:text-text-primary",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{factor.label}</div>
                  <div className="text-xs opacity-75">{factor.description}</div>
                </div>
                {settings.scaleFactor === factor.value && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quality Preset */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Quality Preset</h4>
        <div className="grid grid-cols-1 gap-2">
          {qualityPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleSettingChange('qualityPreset', preset.value)}
              disabled={loading}
              className={cn(
                "p-3 text-left border rounded-lg transition-all",
                settings.qualityPreset === preset.value
                  ? "border-primary bg-primary/5 text-primary" :"border-border hover:border-primary/50 text-text-secondary hover:text-text-primary",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{preset.label}</div>
                  <div className="text-xs opacity-75">{preset.description}</div>
                </div>
                {settings.qualityPreset === preset.value && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Advanced Settings</h4>
        <div className="space-y-4">
          {/* Noise Reduction */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Noise Reduction: {Math.round(settings.noiseReduction * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.noiseReduction}
              onChange={(e) => handleSettingChange('noiseReduction', parseFloat(e.target.value))}
              disabled={loading}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Sharpening */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Sharpening: {Math.round(settings.sharpening * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.sharpening}
              onChange={(e) => handleSettingChange('sharpening', parseFloat(e.target.value))}
              disabled={loading}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Enhancement Options */}
          <div className="space-y-3">
            <Checkbox
              id="artifactRemoval"
              checked={settings.artifactRemoval}
              onCheckedChange={(checked) => handleSettingChange('artifactRemoval', checked)}
              disabled={loading}
            />
            <label htmlFor="artifactRemoval" className="text-sm text-text-primary cursor-pointer">
              Artifact Removal
            </label>
          </div>

          <div className="space-y-3">
            <Checkbox
              id="colorEnhancement"
              checked={settings.colorEnhancement}
              onCheckedChange={(checked) => handleSettingChange('colorEnhancement', checked)}
              disabled={loading}
            />
            <label htmlFor="colorEnhancement" className="text-sm text-text-primary cursor-pointer">
              Color Enhancement
            </label>
          </div>
        </div>
      </div>

      {/* Output Format */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Output Format</h4>
        <div className="grid grid-cols-3 gap-2">
          {formatOptions.map((format) => (
            <button
              key={format.value}
              onClick={() => handleSettingChange('format', format.value)}
              disabled={loading}
              className={cn(
                "p-2 text-center border rounded-lg transition-all text-sm",
                settings.format === format.value
                  ? "border-primary bg-primary/5 text-primary" :"border-border hover:border-primary/50 text-text-secondary hover:text-text-primary",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="font-medium">{format.label}</div>
              <div className="text-xs opacity-75">{format.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* JPEG Compression (only for JPEG) */}
      {settings.format === 'jpg' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            JPEG Quality: {settings.compression}%
          </label>
          <input
            type="range"
            min="60"
            max="100"
            step="5"
            value={settings.compression}
            onChange={(e) => handleSettingChange('compression', parseInt(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}

      {/* Preset Actions */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-medium text-text-primary mb-3">Quick Presets</h4>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              scaleFactor: '2x',
              qualityPreset: 'fast',
              noiseReduction: 0.3,
              sharpening: 0.5,
              artifactRemoval: false,
              colorEnhancement: false,
              format: 'jpg',
              compression: 85
            })}
            disabled={loading}
          >
            Fast
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              scaleFactor: '4x',
              qualityPreset: 'balanced',
              noiseReduction: 0.5,
              sharpening: 0.7,
              artifactRemoval: true,
              colorEnhancement: true,
              format: 'png',
              compression: 85
            })}
            disabled={loading}
          >
            Balanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              scaleFactor: '8x',
              qualityPreset: 'high_quality',
              noiseReduction: 0.8,
              sharpening: 0.9,
              artifactRemoval: true,
              colorEnhancement: true,
              format: 'png',
              compression: 100
            })}
            disabled={loading}
          >
            Maximum
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QualitySettings;