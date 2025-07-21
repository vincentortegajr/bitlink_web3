import React from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';


const ProcessingSettings = ({ settings, onSettingsChange, loading = false }) => {
  const updateSetting = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const qualityOptions = [
    { value: 'low', label: 'Fast (Low Quality)', time: '30-60s', description: 'Quick processing, basic quality' },
    { value: 'medium', label: 'Balanced (Medium)', time: '1-2min', description: 'Good quality, reasonable speed' },
    { value: 'high', label: 'High Quality', time: '2-4min', description: 'Excellent results, slower processing' },
    { value: 'ultra', label: 'Ultra (Best)', time: '4-8min', description: 'Maximum quality, longest processing' }
  ];

  const resolutionOptions = [
    { value: '720p', label: '720p HD', width: 1280, height: 720 },
    { value: '1080p', label: '1080p Full HD', width: 1920, height: 1080 },
    { value: '4k', label: '4K Ultra HD', width: 3840, height: 2160 }
  ];

  const frameRateOptions = [
    { value: '24fps', label: '24 FPS (Cinema)', description: 'Standard film rate' },
    { value: '30fps', label: '30 FPS (Standard)', description: 'Most common rate' },
    { value: '60fps', label: '60 FPS (Smooth)', description: 'High frame rate' }
  ];

  return (
    <div className="space-y-6">
      {/* Quality Settings */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Processing Quality
        </label>
        <div className="space-y-2">
          {qualityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSetting('quality', option.value)}
              disabled={loading}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-colors",
                settings.quality === option.value
                  ? "border-primary bg-primary/10 text-text-primary" :"border-border hover:border-primary/50 hover:bg-muted/50",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-text-secondary">{option.time}</span>
              </div>
              <p className="text-sm text-text-secondary">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution Settings */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Output Resolution
        </label>
        <div className="grid grid-cols-1 gap-2">
          {resolutionOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSetting('resolution', option.value)}
              disabled={loading}
              className={cn(
                "p-3 rounded-lg border text-left transition-colors",
                settings.resolution === option.value
                  ? "border-primary bg-primary/10 text-text-primary" :"border-border hover:border-primary/50 hover:bg-muted/50",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-text-secondary">
                  {option.width} × {option.height}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Rate */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Frame Rate
        </label>
        <div className="space-y-2">
          {frameRateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSetting('frameRate', option.value)}
              disabled={loading}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-colors",
                settings.frameRate === option.value
                  ? "border-primary bg-primary/10 text-text-primary" :"border-border hover:border-primary/50 hover:bg-muted/50",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{option.label}</span>
              </div>
              <p className="text-sm text-text-secondary">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h3 className="font-medium text-text-primary">Advanced Settings</h3>
        
        {/* Lip Movement Intensity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-primary">
              Lip Movement Intensity
            </label>
            <span className="text-sm text-text-secondary">
              {Math.round(settings.lipIntensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.lipIntensity}
            onChange={(e) => updateSetting('lipIntensity', parseFloat(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Subtle</span>
            <span>Natural</span>
            <span>Emphasized</span>
          </div>
        </div>

        {/* Expression Preservation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-primary">
              Expression Preservation
            </label>
            <span className="text-sm text-text-secondary">
              {Math.round(settings.expressionPreservation * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.expressionPreservation}
            onChange={(e) => updateSetting('expressionPreservation', parseFloat(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Minimal</span>
            <span>Balanced</span>
            <span>Maximum</span>
          </div>
        </div>

        {/* Audio-Visual Alignment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-primary">
              Audio-Visual Alignment
            </label>
            <span className="text-sm text-text-secondary">
              {Math.round(settings.audioVisualAlignment * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={settings.audioVisualAlignment}
            onChange={(e) => updateSetting('audioVisualAlignment', parseFloat(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Loose</span>
            <span>Precise</span>
            <span>Perfect</span>
          </div>
        </div>

        {/* Noise Reduction */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-primary">
              Noise Reduction
            </label>
            <span className="text-sm text-text-secondary">
              {Math.round(settings.noiseReduction * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.noiseReduction}
            onChange={(e) => updateSetting('noiseReduction', parseFloat(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>None</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
        </div>
      </div>

      {/* Toggle Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-text-primary">
              Preserve Facial Expressions
            </label>
            <p className="text-xs text-text-secondary">
              Maintain original emotions and expressions
            </p>
          </div>
          <button
            onClick={() => updateSetting('enableFacialExpressions', !settings.enableFacialExpressions)}
            disabled={loading}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors",
              settings.enableFacialExpressions ? "bg-primary" : "bg-muted",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "absolute w-5 h-5 rounded-full bg-white shadow transition-transform",
                settings.enableFacialExpressions ? "translate-x-6" : "translate-x-0.5",
                "top-0.5"
              )}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-text-primary">
              Preserve Background
            </label>
            <p className="text-xs text-text-secondary">
              Keep original background unchanged
            </p>
          </div>
          <button
            onClick={() => updateSetting('preserveBackground', !settings.preserveBackground)}
            disabled={loading}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors",
              settings.preserveBackground ? "bg-primary" : "bg-muted",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "absolute w-5 h-5 rounded-full bg-white shadow transition-transform",
                settings.preserveBackground ? "translate-x-6" : "translate-x-0.5",
                "top-0.5"
              )}
            />
          </button>
        </div>
      </div>

      {/* Output Format */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Output Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['mp4', 'mov', 'avi'].map((format) => (
            <button
              key={format}
              onClick={() => updateSetting('format', format)}
              disabled={loading}
              className={cn(
                "p-2 rounded-lg border text-center transition-colors",
                settings.format === format
                  ? "border-primary bg-primary/10 text-text-primary" :"border-border hover:border-primary/50 hover:bg-muted/50",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="font-medium uppercase">{format}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset to Defaults */}
      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            onSettingsChange({
              lipIntensity: 0.8,
              expressionPreservation: 0.7,
              audioVisualAlignment: 0.9,
              quality: 'high',
              resolution: '1080p',
              frameRate: '30fps',
              format: 'mp4',
              enableFacialExpressions: true,
              preserveBackground: true,
              noiseReduction: 0.5
            });
          }}
          disabled={loading}
          iconName="RotateCcw"
          iconPosition="left"
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default ProcessingSettings;