import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const AdvancedSettings = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const updateSetting = (key, value) => {
    onSettingsChange?.({ ...settings, [key]: value });
  };

  const resetSettings = () => {
    onSettingsChange?.({
      speed: 1.0,
      pitch: 1.0,
      emotion: 'neutral',
      pauseDuration: 0.5,
      format: 'mp3',
      quality: 'high',
      addPauses: true,
      pronunciationGuide: false
    });
  };

  const emotionOptions = [
    { value: 'neutral', label: 'Neutral', icon: 'Minus' },
    { value: 'happy', label: 'Happy', icon: 'Smile' },
    { value: 'sad', label: 'Sad', icon: 'Frown' },
    { value: 'excited', label: 'Excited', icon: 'Zap' },
    { value: 'calm', label: 'Calm', icon: 'Leaf' },
    { value: 'serious', label: 'Serious', icon: 'Shield' }
  ];

  const formatOptions = [
    { value: 'mp3', label: 'MP3', description: 'Universal compatibility' },
    { value: 'wav', label: 'WAV', description: 'Uncompressed quality' },
    { value: 'ogg', label: 'OGG', description: 'Open source format' }
  ];

  const qualityOptions = [
    { value: 'standard', label: 'Standard', bitrate: '128 kbps' },
    { value: 'high', label: 'High', bitrate: '192 kbps' },
    { value: 'premium', label: 'Premium', bitrate: '320 kbps' }
  ];

  return (
    <div className="space-y-6">
      {/* Voice Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Icon name="Settings" size={16} />
          Voice Controls
        </h4>
        
        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-primary">Speech Speed</label>
            <span className="text-sm text-text-secondary">{settings.speed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.speed}
            onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
            disabled={disabled}
            className={cn(
              "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Slower</span>
            <span>Normal</span>
            <span>Faster</span>
          </div>
        </div>

        {/* Pitch Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-primary">Pitch</label>
            <span className="text-sm text-text-secondary">
              {settings.pitch > 1 ? '+' : settings.pitch < 1 ? '-' : ''}
              {Math.round((settings.pitch - 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={settings.pitch}
            onChange={(e) => updateSetting('pitch', parseFloat(e.target.value))}
            disabled={disabled}
            className={cn(
              "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Lower</span>
            <span>Normal</span>
            <span>Higher</span>
          </div>
        </div>

        {/* Pause Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-primary">Pause Duration</label>
            <span className="text-sm text-text-secondary">{settings.pauseDuration}s</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={settings.pauseDuration}
            onChange={(e) => updateSetting('pauseDuration', parseFloat(e.target.value))}
            disabled={disabled}
            className={cn(
              "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>
      </div>

      {/* Emotion Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Icon name="Heart" size={16} />
          Emotion
        </h4>
        
        <div className="grid grid-cols-3 gap-2">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => updateSetting('emotion', emotion.value)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                settings.emotion === emotion.value
                  ? "border-primary bg-primary/10 text-primary" :"border-border hover:border-primary/50 text-text-secondary hover:text-text-primary",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon name={emotion.icon} size={16} />
              <span className="text-xs font-medium">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Export Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Icon name="Download" size={16} />
          Export Settings
        </h4>
        
        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Audio Format</label>
          <div className="space-y-2">
            {formatOptions.map((format) => (
              <label
                key={format.value}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors",
                  settings.format === format.value
                    ? "border-primary bg-primary/5" :"border-border hover:border-border/80",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="radio"
                  name="format"
                  value={format.value}
                  checked={settings.format === format.value}
                  onChange={(e) => updateSetting('format', e.target.value)}
                  disabled={disabled}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{format.label}</span>
                  </div>
                  <span className="text-xs text-text-secondary">{format.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Audio Quality</label>
          <div className="space-y-2">
            {qualityOptions.map((quality) => (
              <label
                key={quality.value}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors",
                  settings.quality === quality.value
                    ? "border-primary bg-primary/5" :"border-border hover:border-border/80",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="radio"
                  name="quality"
                  value={quality.value}
                  checked={settings.quality === quality.value}
                  onChange={(e) => updateSetting('quality', e.target.value)}
                  disabled={disabled}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{quality.label}</span>
                  <span className="text-xs text-text-secondary">{quality.bitrate}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Icon name="Sliders" size={16} />
          Advanced Options
        </h4>
        
        <div className="space-y-3">
          <label className={cn(
            "flex items-center gap-3 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}>
            <input
              type="checkbox"
              checked={settings.addPauses}
              onChange={(e) => updateSetting('addPauses', e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-primary rounded"
            />
            <div>
              <span className="text-sm font-medium text-text-primary">Smart Pauses</span>
              <p className="text-xs text-text-secondary">Add natural pauses for punctuation</p>
            </div>
          </label>

          <label className={cn(
            "flex items-center gap-3 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}>
            <input
              type="checkbox"
              checked={settings.pronunciationGuide}
              onChange={(e) => updateSetting('pronunciationGuide', e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-primary rounded"
            />
            <div>
              <span className="text-sm font-medium text-text-primary">Pronunciation Guide</span>
              <p className="text-xs text-text-secondary">Enable phonetic spelling assistance</p>
            </div>
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={resetSettings}
          disabled={disabled}
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

export default AdvancedSettings;