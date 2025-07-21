import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const BatchProcessor = ({
  disabled = false,
  onBatchProcess,
  mobile = false
}) => {
  const [batchJobs, setBatchJobs] = useState([
    {
      id: 'batch-1',
      name: 'Social Media Pack',
      status: 'pending',
      images: 12,
      videos: 0,
      progress: 0,
      settings: {
        resolution: '432x768',
        duration: 3,
        preset: 'zoom-in'
      }
    },
    {
      id: 'batch-2',
      name: 'Website Headers',
      status: 'processing',
      images: 8,
      videos: 3,
      progress: 65,
      settings: {
        resolution: '1024x576',
        duration: 5,
        preset: 'pan-right'
      }
    }
  ]);

  const [newBatch, setNewBatch] = useState({
    name: '',
    images: [],
    settings: {
      resolution: '512x512',
      duration: 3,
      preset: 'zoom-in',
      quality: 'standard'
    }
  });

  const [showNewBatch, setShowNewBatch] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'processing': return 'Loader2';
      case 'completed': return 'CheckCircle';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning';
      case 'processing': return 'text-primary';
      case 'completed': return 'text-success';
      case 'failed': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const handleCreateBatch = () => {
    if (!newBatch.name.trim()) return;

    const batch = {
      id: `batch-${Date.now()}`,
      name: newBatch.name,
      status: 'pending',
      images: newBatch.images.length,
      videos: 0,
      progress: 0,
      settings: { ...newBatch.settings }
    };

    setBatchJobs(prev => [...prev, batch]);
    setNewBatch({
      name: '',
      images: [],
      settings: {
        resolution: '512x512',
        duration: 3,
        preset: 'zoom-in',
        quality: 'standard'
      }
    });
    setShowNewBatch(false);
    onBatchProcess?.(batch);
  };

  const handleStartBatch = (batchId) => {
    setBatchJobs(prev => prev.map(job => 
      job.id === batchId 
        ? { ...job, status: 'processing' }
        : job
    ));
    onBatchProcess?.(batchJobs.find(job => job.id === batchId));
  };

  const handleDeleteBatch = (batchId) => {
    setBatchJobs(prev => prev.filter(job => job.id !== batchId));
  };

  const totalPendingImages = batchJobs
    .filter(job => job.status === 'pending')
    .reduce((sum, job) => sum + job.images, 0);

  const totalProcessingJobs = batchJobs.filter(job => job.status === 'processing').length;

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Icon name="Layers" size={14} className="text-primary" />
            <span className="text-xs text-text-secondary">Queued</span>
          </div>
          <p className="text-lg font-semibold text-text-primary">{totalPendingImages}</p>
          <p className="text-xs text-text-secondary">images</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Icon name="Zap" size={14} className="text-success" />
            <span className="text-xs text-text-secondary">Active</span>
          </div>
          <p className="text-lg font-semibold text-text-primary">{totalProcessingJobs}</p>
          <p className="text-xs text-text-secondary">jobs</p>
        </div>
      </div>

      {/* New Batch Button */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNewBatch(!showNewBatch)}
          disabled={disabled}
          iconName="Plus"
          iconPosition="left"
          className="flex-1"
        >
          New Batch
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Start all pending batches
            batchJobs
              .filter(job => job.status === 'pending')
              .forEach(job => handleStartBatch(job.id));
          }}
          disabled={disabled || totalPendingImages === 0}
          iconName="Play"
          iconPosition="left"
        >
          Start All
        </Button>
      </div>

      {/* New Batch Form */}
      {showNewBatch && (
        <div className="bg-card rounded-lg p-4 border">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">Create New Batch</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNewBatch(false)}
                iconName="X"
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-1 block">Batch Name</label>
              <input
                type="text"
                value={newBatch.name}
                onChange={(e) => setNewBatch(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter batch name..."
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Resolution</label>
                <select
                  value={newBatch.settings.resolution}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    settings: { ...prev.settings, resolution: e.target.value }
                  }))}
                  disabled={disabled}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value="512x512">512×512</option>
                  <option value="768x432">768×432</option>
                  <option value="432x768">432×768</option>
                  <option value="1024x576">1024×576</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Duration</label>
                <select
                  value={newBatch.settings.duration}
                  onChange={(e) => setNewBatch(prev => ({
                    ...prev,
                    settings: { ...prev.settings, duration: parseInt(e.target.value) }
                  }))}
                  disabled={disabled}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value={2}>2 seconds</option>
                  <option value={3}>3 seconds</option>
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-1 block">Animation Preset</label>
              <select
                value={newBatch.settings.preset}
                onChange={(e) => setNewBatch(prev => ({
                  ...prev,
                  settings: { ...prev.settings, preset: e.target.value }
                }))}
                disabled={disabled}
                className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
              >
                <option value="none">Static</option>
                <option value="zoom-in">Zoom In</option>
                <option value="zoom-out">Zoom Out</option>
                <option value="pan-left">Pan Left</option>
                <option value="pan-right">Pan Right</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewBatch(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBatch}
                disabled={!newBatch.name.trim() || disabled}
                iconName="Plus"
                iconPosition="left"
                className="flex-1"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Jobs List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-text-primary">Batch Jobs</h4>
        
        {batchJobs.length === 0 ? (
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <Icon name="Layers" size={24} className="text-text-secondary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No batch jobs created yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {batchJobs.map((job) => (
              <div key={job.id} className="bg-card rounded-lg p-3 border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={getStatusIcon(job.status)}
                      size={16}
                      className={cn(
                        getStatusColor(job.status),
                        job.status === 'processing' && 'animate-spin'
                      )}
                    />
                    <div>
                      <h5 className="text-sm font-medium text-text-primary">{job.name}</h5>
                      <p className="text-xs text-text-secondary capitalize">
                        {job.status} • {job.images} images • {job.videos} videos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {job.status === 'pending' && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleStartBatch(job.id)}
                        disabled={disabled}
                        iconName="Play"
                      />
                    )}
                    
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleDeleteBatch(job.id)}
                      disabled={disabled || job.status === 'processing'}
                      iconName="Trash2"
                    />
                  </div>
                </div>

                {/* Progress Bar (if processing) */}
                {job.status === 'processing' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>Processing...</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Job Settings Summary */}
                <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                  <span>{job.settings.resolution}</span>
                  <span>•</span>
                  <span>{job.settings.duration}s</span>
                  <span>•</span>
                  <span className="capitalize">{job.settings.preset}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processing Queue Info */}
      {totalProcessingJobs > 0 && (
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={16} className="text-primary animate-pulse" />
            <div>
              <p className="text-sm font-medium text-primary">Batch Processing Active</p>
              <p className="text-xs text-primary/80">
                {totalProcessingJobs} job{totalProcessingJobs > 1 ? 's' : ''} running on RunPod GPUs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Batch Guidelines */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-primary">Batch Processing Tips</p>
            <ul className="text-xs text-text-secondary space-y-0.5">
              <li>• Group similar settings for efficient processing</li>
              <li>• Large batches are processed in parallel on multiple GPUs</li>
              <li>• Consistent styling across batch maintains quality</li>
              <li>• Monitor GPU usage to optimize batch sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessor;