import React from 'react';

import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const AnimationPresets = ({
  selectedPreset = 'none',
  onPresetSelect,
  disabled = false
}) => {
  const presets = [
    {
      id: 'none',
      name: 'Static',
      description: 'No animation',
      icon: 'Square',
      preview: 'Static image'
    },
    {
      id: 'zoom-in',
      name: 'Zoom In',
      description: 'Gradual zoom into image',
      icon: 'ZoomIn',
      preview: 'Smooth zoom effect'
    },
    {
      id: 'zoom-out',
      name: 'Zoom Out',
      description: 'Pull back from image',
      icon: 'ZoomOut',
      preview: 'Reverse zoom effect'
    },
    {
      id: 'pan-left',
      name: 'Pan Left',
      description: 'Camera moves left',
      icon: 'ArrowLeft',
      preview: 'Horizontal pan left'
    },
    {
      id: 'pan-right',
      name: 'Pan Right',
      description: 'Camera moves right',
      icon: 'ArrowRight',
      preview: 'Horizontal pan right'
    },
    {
      id: 'pan-up',
      name: 'Pan Up',
      description: 'Camera moves upward',
      icon: 'ArrowUp',
      preview: 'Vertical pan up'
    },
    {
      id: 'pan-down',
      name: 'Pan Down',
      description: 'Camera moves down',
      icon: 'ArrowDown',
      preview: 'Vertical pan down'
    },
    {
      id: 'rotate-cw',
      name: 'Rotate CW',
      description: 'Clockwise rotation',
      icon: 'RotateCw',
      preview: 'Clockwise spin'
    },
    {
      id: 'rotate-ccw',
      name: 'Rotate CCW',
      description: 'Counter-clockwise rotation',
      icon: 'RotateCcw',
      preview: 'Counter-clockwise spin'
    },
    {
      id: 'fade-in',
      name: 'Fade In',
      description: 'Gradual appearance',
      icon: 'Eye',
      preview: 'Opacity transition'
    },
    {
      id: 'slide-left',
      name: 'Slide Left',
      description: 'Enter from right side',
      icon: 'MoveLeft',
      preview: 'Slide transition'
    },
    {
      id: 'slide-right',
      name: 'Slide Right',
      description: 'Enter from left side',
      icon: 'MoveRight',
      preview: 'Slide transition'
    }
  ];

  const cameraMovements = [
    {
      id: 'orbit-left',
      name: 'Orbit Left',
      description: 'Circular camera motion',
      icon: 'RefreshCw',
      preview: '3D orbital movement'
    },
    {
      id: 'orbit-right',
      name: 'Orbit Right',
      description: 'Reverse circular motion',
      icon: 'RefreshCcw',
      preview: 'Reverse orbital movement'
    },
    {
      id: 'dolly-in',
      name: 'Dolly In',
      description: 'Camera push forward',
      icon: 'FastForward',
      preview: 'Forward camera movement'
    },
    {
      id: 'dolly-out',
      name: 'Dolly Out',
      description: 'Camera pull back',
      icon: 'Rewind',
      preview: 'Backward camera movement'
    }
  ];

  const objectAnimations = [
    {
      id: 'object-float',
      name: 'Float',
      description: 'Gentle floating motion',
      icon: 'Cloud',
      preview: 'Subtle up-down movement'
    },
    {
      id: 'object-sway',
      name: 'Sway',
      description: 'Side-to-side motion',
      icon: 'Wind',
      preview: 'Gentle swaying motion'
    },
    {
      id: 'object-pulse',
      name: 'Pulse',
      description: 'Scale breathing effect',
      icon: 'Heart',
      preview: 'Rhythmic scaling'
    }
  ];

  const environmentEffects = [
    {
      id: 'particles',
      name: 'Particles',
      description: 'Add floating particles',
      icon: 'Sparkles',
      preview: 'Animated particles overlay'
    },
    {
      id: 'light-rays',
      name: 'Light Rays',
      description: 'Animated light beams',
      icon: 'Sun',
      preview: 'Dynamic lighting effects'
    },
    {
      id: 'depth-blur',
      name: 'Depth Blur',
      description: 'Depth of field effect',
      icon: 'Focus',
      preview: 'Background blur animation'
    }
  ];

  const PresetCard = ({ preset, isSelected, onClick }) => (
    <button
      onClick={() => onClick?.(preset.id)}
      disabled={disabled}
      className={cn(
        "w-full p-3 rounded-lg border transition-all text-left",
        "hover:shadow-medium hover:scale-hover",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none",
        isSelected
          ? "border-primary bg-primary/10 shadow-subtle"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <Icon name={preset.icon} size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-text-primary text-sm">{preset.name}</h3>
            {isSelected && (
              <Icon name="Check" size={14} className="text-primary" />
            )}
          </div>
          <p className="text-xs text-text-secondary">{preset.description}</p>
          <p className="text-xs text-text-secondary/80 mt-1">{preset.preview}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Basic Presets */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Basic Animations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={selectedPreset === preset.id}
              onClick={onPresetSelect}
            />
          ))}
        </div>
      </div>

      {/* Camera Movements */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Camera Movements</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cameraMovements.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={selectedPreset === preset.id}
              onClick={onPresetSelect}
            />
          ))}
        </div>
      </div>

      {/* Object Animations */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Object Animations</h4>
        <div className="grid grid-cols-1 gap-2">
          {objectAnimations.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={selectedPreset === preset.id}
              onClick={onPresetSelect}
            />
          ))}
        </div>
      </div>

      {/* Environment Effects */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Environment Effects</h4>
        <div className="grid grid-cols-1 gap-2">
          {environmentEffects.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={selectedPreset === preset.id}
              onClick={onPresetSelect}
            />
          ))}
        </div>
      </div>

      {/* Custom Preset Info */}
      {selectedPreset !== 'none' && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="Settings" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-primary">Preset Applied</p>
              <p className="text-xs text-text-secondary">
                Use Advanced Controls to fine-tune motion parameters and combine multiple effects.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationPresets;