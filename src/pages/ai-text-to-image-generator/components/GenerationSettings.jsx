import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { cn } from '../../../utils/cn';

const GenerationSettings = ({
  settings,
  onSettingsChange,
  loading = false
}) => {
  const aspectRatios = [
    { value: '1:1', label: '1:1 (Square)' },
    { value: '16:9', label: '16:9 (Landscape)' },
    { value: '9:16', label: '9:16 (Portrait)' },
    { value: '4:3', label: '4:3 (Classic)' },
    { value: '3:2', label: '3:2 (Photo)' },
    { value: '21:9', label: '21:9 (Ultrawide)' }
  ];

  const qualityLevels = [
    { value: 'draft', label: 'Draft (Fast)', description: '~30s' },
    { value: 'standard', label: 'Standard', description: '~60s' },
    { value: 'high', label: 'High Quality', description: '~90s' },
    { value: 'ultra', label: 'Ultra HD', description: '~120s' }
  ];

  const samplingMethods = [
    { value: 'euler', label: 'Euler' },
    { value: 'euler_a', label: 'Euler A' },
    { value: 'heun', label: 'Heun' },
    { value: 'dpm2', label: 'DPM2' },
    { value: 'ddim', label: 'DDIM' },
    { value: 'plms', label: 'PLMS' }
  ];

  const handleChange = (field, value) => {
    onSettingsChange?.({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aspect Ratio */}
        <Select
          label="Aspect Ratio"
          options={aspectRatios}
          value={settings?.aspectRatio || '1:1'}
          onChange={(value) => handleChange('aspectRatio', value)}
          disabled={loading}
        />

        {/* Quality Level */}
        <Select
          label="Quality Level"
          options={qualityLevels}
          value={settings?.quality || 'standard'}
          onChange={(value) => handleChange('quality', value)}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Steps */}
        <Input
          type="number"
          label="Steps"
          value={settings?.steps || 20}
          onChange={(e) => handleChange('steps', parseInt(e.target.value))}
          min="10"
          max="100"
          step="5"
          disabled={loading}
          description="More steps = better quality, longer time"
        />

        {/* CFG Scale */}
        <Input
          type="number"
          label="CFG Scale"
          value={settings?.cfgScale || 7}
          onChange={(e) => handleChange('cfgScale', parseFloat(e.target.value))}
          min="1"
          max="20"
          step="0.5"
          disabled={loading}
          description="How closely to follow the prompt"
        />
      </div>

      {/* Sampling Method */}
      <Select
        label="Sampling Method"
        options={samplingMethods}
        value={settings?.samplingMethod || 'euler_a'}
        onChange={(value) => handleChange('samplingMethod', value)}
        disabled={loading}
      />

      {/* Negative Prompt */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-2 block">
          Negative Prompt
        </label>
        <textarea
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          )}
          placeholder="Things you don't want in the image (e.g., blurry, low quality, deformed)"
          value={settings?.negativePrompt || ''}
          onChange={(e) => handleChange('negativePrompt', e.target.value)}
          disabled={loading}
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Describe what you want to avoid in the generated image
        </p>
      </div>

      {/* Batch Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label="Batch Size"
          value={settings?.batchSize || 1}
          onChange={(e) => handleChange('batchSize', parseInt(e.target.value))}
          min="1"
          max="4"
          disabled={loading}
          description="Number of images to generate"
        />

        {/* Seed */}
        <Input
          type="number"
          label="Seed (Optional)"
          value={settings?.seed || ''}
          onChange={(e) => handleChange('seed', e.target.value ? parseInt(e.target.value) : '')}
          placeholder="Random"
          disabled={loading}
          description="For reproducible results"
        />
      </div>
    </div>
  );
};

export default GenerationSettings;