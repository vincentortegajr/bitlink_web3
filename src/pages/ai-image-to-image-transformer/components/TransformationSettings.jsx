import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { cn } from '../../../utils/cn';

const TransformationSettings = ({
  settings,
  onSettingsChange,
  loading = false
}) => {
  const transformationStrengths = [
    { value: '0.3', label: 'Subtle (30%)', description: 'Minor changes' },
    { value: '0.5', label: 'Moderate (50%)', description: 'Balanced' },
    { value: '0.7', label: 'Strong (70%)', description: 'Major changes' },
    { value: '0.9', label: 'Extreme (90%)', description: 'Complete transformation' }
  ];

  const styleTransfers = [
    { value: 'photorealistic', label: 'Photorealistic', icon: 'Camera' },
    { value: 'artistic', label: 'Artistic', icon: 'Palette' },
    { value: 'anime', label: 'Anime Style', icon: 'Sparkles' },
    { value: 'oil-painting', label: 'Oil Painting', icon: 'Paintbrush2' },
    { value: 'watercolor', label: 'Watercolor', icon: 'Droplets' },
    { value: 'digital-art', label: 'Digital Art', icon: 'Monitor' },
    { value: 'sketch', label: 'Pencil Sketch', icon: 'PenTool' },
    { value: 'vintage', label: 'Vintage Photo', icon: 'Clock' }
  ];

  const denoisingLevels = [
    { value: '0.1', label: 'Very Low (10%)', description: 'Minimal cleanup' },
    { value: '0.3', label: 'Low (30%)', description: 'Light cleanup' },
    { value: '0.5', label: 'Medium (50%)', description: 'Standard cleanup' },
    { value: '0.7', label: 'High (70%)', description: 'Heavy cleanup' },
    { value: '0.9', label: 'Very High (90%)', description: 'Maximum cleanup' }
  ];

  const guidanceScales = [
    { value: '5', label: 'Loose (5)', description: 'More creative freedom' },
    { value: '7.5', label: 'Balanced (7.5)', description: 'Recommended' },
    { value: '10', label: 'Strict (10)', description: 'Close to prompt' },
    { value: '15', label: 'Very Strict (15)', description: 'Exact adherence' }
  ];

  const handleChange = (field, value) => {
    onSettingsChange?.({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Transformation Strength */}
      <Select
        label="Transformation Strength"
        options={transformationStrengths}
        value={settings?.strength || '0.7'}
        onChange={(value) => handleChange('strength', value)}
        disabled={loading}
        description="How much the image should change"
      />

      {/* Style Transfer */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-3 block">
          Style Transfer
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styleTransfers.map((style) => (
            <button
              key={style.value}
              onClick={() => handleChange('styleTransfer', style.value)}
              disabled={loading}
              className={cn(
                "p-3 rounded-lg border text-left transition-colors",
                "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                settings?.styleTransfer === style.value
                  ? "border-primary bg-primary/5 text-primary" :"border-border text-text-secondary hover:text-text-primary"
              )}
            >
              <div className="text-sm font-medium">{style.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Denoising Strength */}
        <Select
          label="Denoising Level"
          options={denoisingLevels}
          value={settings?.denoising || '0.5'}
          onChange={(value) => handleChange('denoising', value)}
          disabled={loading}
        />

        {/* Guidance Scale */}
        <Select
          label="Guidance Scale"
          options={guidanceScales}
          value={settings?.guidanceScale || '7.5'}
          onChange={(value) => handleChange('guidanceScale', value)}
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
          description="More steps = better quality"
        />

        {/* Batch Size */}
        <Input
          type="number"
          label="Variations"
          value={settings?.batchSize || 1}
          onChange={(e) => handleChange('batchSize', parseInt(e.target.value))}
          min="1"
          max="4"
          disabled={loading}
          description="Number of variations to create"
        />
      </div>

      {/* Control Prompt */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-2 block">
          Transformation Prompt
        </label>
        <textarea
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          )}
          placeholder="Describe how you want to transform this image..."
          value={settings?.controlPrompt || ''}
          onChange={(e) => handleChange('controlPrompt', e.target.value)}
          disabled={loading}
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Be specific about the changes you want to see
        </p>
      </div>

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
          placeholder="What you want to avoid (e.g., blurry, artifacts, distorted)"
          value={settings?.negativePrompt || ''}
          onChange={(e) => handleChange('negativePrompt', e.target.value)}
          disabled={loading}
          rows={2}
        />
      </div>

      {/* Advanced Settings Toggle */}
      <div className="border-t pt-4">
        <details className="space-y-3">
          <summary className="cursor-pointer text-sm font-medium text-text-primary hover:text-primary">
            Advanced Settings
          </summary>
          
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Mask Strength */}
              <Input
                type="range"
                label="Mask Strength"
                value={settings?.maskStrength || 0.8}
                onChange={(e) => handleChange('maskStrength', parseFloat(e.target.value))}
                min="0.1"
                max="1.0"
                step="0.1"
                disabled={loading}
                description="How precisely to apply changes"
              />
            </div>

            {/* Preserve Original Colors */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="preserveColors"
                checked={settings?.preserveColors || false}
                onChange={(e) => handleChange('preserveColors', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <label htmlFor="preserveColors" className="text-sm text-text-primary">
                Preserve original colors where possible
              </label>
            </div>

            {/* High Quality Mode */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="highQuality"
                checked={settings?.highQuality || false}
                onChange={(e) => handleChange('highQuality', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <label htmlFor="highQuality" className="text-sm text-text-primary">
                High quality mode (slower processing)
              </label>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default TransformationSettings;