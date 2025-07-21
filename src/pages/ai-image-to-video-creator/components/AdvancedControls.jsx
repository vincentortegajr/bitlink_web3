import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';

const AdvancedControls = ({
  videoSettings = {},
  animationSettings = {},
  onVideoSettingsChange,
  onAnimationSettingsChange,
  disabled = false,
  mobile = false
}) => {
  const [activeSection, setActiveSection] = useState('motion');

  const updateVideoSetting = (key, value) => {
    onVideoSettingsChange?.({
      ...videoSettings,
      [key]: value
    });
  };

  const updateAnimationSetting = (key, value) => {
    onAnimationSettingsChange?.({
      ...animationSettings,
      [key]: value
    });
  };

  const updateCustomMotion = (axis, value) => {
    onAnimationSettingsChange?.({
      ...animationSettings,
      customMotion: {
        ...animationSettings.customMotion,
        [axis]: value
      }
    });
  };

  const SliderControl = ({ label, value, onChange, min = -1, max = 1, step = 0.1, unit = '' }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <label className="text-text-secondary">{label}</label>
        <span className="font-medium text-text-primary">
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value || 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className={cn(
          "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
          "slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4 slider-thumb:rounded-full",
          "slider-thumb:bg-primary slider-thumb:cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
    </div>
  );

  const sections = [
    { id: 'motion', label: 'Motion', icon: 'Move' },
    { id: 'camera', label: 'Camera', icon: 'Camera' },
    { id: 'effects', label: 'Effects', icon: 'Sparkles' },
    { id: 'timing', label: 'Timing', icon: 'Clock' }
  ];

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex rounded-lg bg-muted p-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-md text-xs font-medium transition-colors",
              activeSection === section.id
                ? "bg-primary text-primary-foreground"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Icon name={section.icon} size={14} />
            {!mobile && section.label}
          </button>
        ))}
      </div>

      {/* Motion Controls */}
      {activeSection === 'motion' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <SliderControl
              label="Motion Strength"
              value={videoSettings.motionStrength}
              onChange={(value) => updateVideoSetting('motionStrength', value)}
              min={0}
              max={2}
            />
            
            <SliderControl
              label="X Movement"
              value={animationSettings.customMotion?.x}
              onChange={(value) => updateCustomMotion('x', value)}
            />
            
            <SliderControl
              label="Y Movement"
              value={animationSettings.customMotion?.y}
              onChange={(value) => updateCustomMotion('y', value)}
            />
            
            <SliderControl
              label="Zoom"
              value={animationSettings.customMotion?.zoom}
              onChange={(value) => updateCustomMotion('zoom', value)}
              min={-0.5}
              max={1}
            />
            
            <SliderControl
              label="Rotation"
              value={animationSettings.customMotion?.rotation}
              onChange={(value) => updateCustomMotion('rotation', value)}
              min={-45}
              max={45}
              unit="°"
            />
          </div>
        </div>
      )}

      {/* Camera Controls */}
      {activeSection === 'camera' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">Camera Movement</label>
              <Select
                value={animationSettings.cameraMovement || 'static'}
                onValueChange={(value) => updateAnimationSetting('cameraMovement', value)}
                disabled={disabled}
              >
                <option value="static">Static</option>
                <option value="pan">Pan</option>
                <option value="zoom">Zoom</option>
                <option value="rotate">Rotate</option>
                <option value="orbit">Orbit</option>
                <option value="dolly">Dolly</option>
              </Select>
            </div>

            <SliderControl
              label="Camera Speed"
              value={animationSettings.cameraSpeed || 0.5}
              onChange={(value) => updateAnimationSetting('cameraSpeed', value)}
              min={0.1}
              max={2}
            />

            <SliderControl
              label="Field of View"
              value={animationSettings.fov || 60}
              onChange={(value) => updateAnimationSetting('fov', value)}
              min={30}
              max={120}
              unit="°"
            />

            <div className="flex items-center justify-between">
              <label className="text-sm text-text-secondary">Stabilization</label>
              <button
                onClick={() => updateAnimationSetting('stabilization', !animationSettings.stabilization)}
                disabled={disabled}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  animationSettings.stabilization ? "bg-primary" : "bg-muted",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    animationSettings.stabilization ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Effects Controls */}
      {activeSection === 'effects' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">Environment Effect</label>
              <Select
                value={animationSettings.environmentEffect || 'none'}
                onValueChange={(value) => updateAnimationSetting('environmentEffect', value)}
                disabled={disabled}
              >
                <option value="none">None</option>
                <option value="particles">Particles</option>
                <option value="light-rays">Light Rays</option>
                <option value="depth-blur">Depth Blur</option>
                <option value="chromatic">Chromatic Aberration</option>
                <option value="vignette">Vignette</option>
              </Select>
            </div>

            <SliderControl
              label="Effect Intensity"
              value={animationSettings.effectIntensity || 0.5}
              onChange={(value) => updateAnimationSetting('effectIntensity', value)}
              min={0}
              max={1}
            />

            <SliderControl
              label="Noise Level"
              value={animationSettings.noiseLevel || 0}
              onChange={(value) => updateAnimationSetting('noiseLevel', value)}
              min={0}
              max={0.5}
            />

            <div className="flex items-center justify-between">
              <label className="text-sm text-text-secondary">Color Enhancement</label>
              <button
                onClick={() => updateAnimationSetting('colorEnhancement', !animationSettings.colorEnhancement)}
                disabled={disabled}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  animationSettings.colorEnhancement ? "bg-primary" : "bg-muted",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    animationSettings.colorEnhancement ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timing Controls */}
      {activeSection === 'timing' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <SliderControl
              label="Duration"
              value={videoSettings.duration}
              onChange={(value) => updateVideoSetting('duration', value)}
              min={1}
              max={10}
              step={0.5}
              unit="s"
            />

            <div>
              <label className="text-sm text-text-secondary mb-2 block">Frame Rate</label>
              <Select
                value={videoSettings.fps?.toString() || '30'}
                onValueChange={(value) => updateVideoSetting('fps', parseInt(value))}
                disabled={disabled}
              >
                <option value="24">24 FPS (Cinematic)</option>
                <option value="30">30 FPS (Standard)</option>
                <option value="60">60 FPS (Smooth)</option>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-text-secondary">Frame Interpolation</label>
              <button
                onClick={() => updateVideoSetting('frameInterpolation', !videoSettings.frameInterpolation)}
                disabled={disabled}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  videoSettings.frameInterpolation ? "bg-primary" : "bg-muted",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    videoSettings.frameInterpolation ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <SliderControl
              label="Easing"
              value={animationSettings.easing || 0.5}
              onChange={(value) => updateAnimationSetting('easing', value)}
              min={0}
              max={1}
            />
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onVideoSettingsChange?.({
              duration: 3,
              fps: 30,
              resolution: '512x512',
              motionStrength: 0.7,
              frameInterpolation: true,
              quality: 'high'
            });
            onAnimationSettingsChange?.({
              preset: 'none',
              cameraMovement: 'static',
              customMotion: { x: 0, y: 0, zoom: 0, rotation: 0 }
            });
          }}
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

export default AdvancedControls;