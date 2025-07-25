import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const GPUResourceMonitor = ({ 
  isProcessing = false,
  mobile = false 
}) => {
  const [gpuStats, setGpuStats] = useState({
    utilization: 45,
    memory: 68,
    temperature: 72,
    power: 85,
    queuePosition: 0,
    estimatedWait: 0,
    throughput: 2.3
  });

  const [runpodEndpoints, setRunpodEndpoints] = useState([
    {
      id: 'gpu-1',
      name: 'RTX 4090 #1',
      status: 'active',
      utilization: 45,
      memory: '12/24 GB',
      queue: 0,
      region: 'US-East'
    },
    {
      id: 'gpu-2',
      name: 'RTX 4090 #2',
      status: 'idle',
      utilization: 15,
      memory: '3/24 GB',
      queue: 2,
      region: 'US-West'
    },
    {
      id: 'gpu-3',
      name: 'A100 #1',
      status: 'busy',
      utilization: 95,
      memory: '38/80 GB',
      queue: 5,
      region: 'EU-Central'
    }
  ]);

  // Simulate real-time updates during processing
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setGpuStats(prev => ({
        ...prev,
        utilization: Math.min(100, prev.utilization + Math.random() * 20 - 5),
        memory: Math.min(100, prev.memory + Math.random() * 10 - 3),
        temperature: 70 + Math.random() * 15,
        power: 80 + Math.random() * 20
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10 border-success/20';
      case 'idle': return 'text-warning bg-warning/10 border-warning/20';
      case 'busy': return 'text-error bg-error/10 border-error/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization < 30) return 'bg-success';
    if (utilization < 70) return 'bg-warning';
    return 'bg-error';
  };

  const StatCard = ({ label, value, unit, icon, status }) => (
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <Icon name={icon} size={14} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">{label}</span>
        </div>
        {status && (
          <div className={cn('w-2 h-2 rounded-full', getUtilizationColor(value))} />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold text-text-primary">{value}</span>
        <span className="text-xs text-text-secondary">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">GPU Monitor</h3>
              <p className="text-xs text-text-secondary">RunPod.io Endpoints</p>
            </div>
          </div>
          
          <div className={cn(
            'px-2 py-1 rounded-md text-xs font-medium border',
            connectionStatus === 'connected' ?'text-success bg-success/10 border-success/20' :'text-error bg-error/10 border-error/20'
          )}>
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-2 h-2 rounded-full',
                connectionStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-error'
              )} />
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>

        {/* Current Processing Stats */}
        {isProcessing && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary">Current Task</h4>
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                label="GPU Usage"
                value={Math.round(gpuStats.utilization)}
                unit="%"
                icon="Zap"
                status={true}
              />
              <StatCard
                label="VRAM"
                value={Math.round(gpuStats.memory)}
                unit="%"
                icon="HardDrive"
                status={true}
              />
              <StatCard
                label="Temp"
                value={Math.round(gpuStats.temperature)}
                unit="°C"
                icon="Thermometer"
              />
              <StatCard
                label="Power"
                value={Math.round(gpuStats.power)}
                unit="%"
                icon="Battery"
              />
            </div>
          </div>
        )}

        {/* Queue Status */}
        {gpuStats.queuePosition > 0 && (
          <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">In Queue</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary">
                Position: {gpuStats.queuePosition} • Wait time: ~{Math.round(gpuStats.estimatedWait)}s
              </p>
            </div>
          </div>
        )}

        {/* Available Endpoints */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-text-primary">Available GPUs</h4>
            <Button
              size="xs"
              variant="outline"
              iconName="RefreshCw"
              onClick={() => {
                // Refresh GPU status
                setRunpodEndpoints(prev => prev.map(gpu => ({
                  ...gpu,
                  utilization: Math.random() * 100,
                  queue: Math.floor(Math.random() * 8)
                })));
              }}
            >
              Refresh
            </Button>
          </div>
          
          <div className="space-y-2">
            {runpodEndpoints.map((gpu) => (
              <div
                key={gpu.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('px-2 py-1 rounded-md text-xs font-medium border', getStatusColor(gpu.status))}>
                    {gpu.status}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{gpu.name}</p>
                    <p className="text-xs text-text-secondary">{gpu.region}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-16 bg-muted rounded-full h-1">
                      <div
                        className={cn('h-1 rounded-full transition-all', getUtilizationColor(gpu.utilization))}
                        style={{ width: `${gpu.utilization}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary w-8">{Math.round(gpu.utilization)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span>{gpu.memory}</span>
                    {gpu.queue > 0 && (
                      <span className="text-warning">Q:{gpu.queue}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="BarChart3" size={14} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Usage Stats</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-text-secondary">Throughput</p>
              <p className="text-sm font-medium text-text-primary">{gpuStats.throughput} fps</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Avg Time</p>
              <p className="text-sm font-medium text-text-primary">~2.5min</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Success Rate</p>
              <p className="text-sm font-medium text-success">99.2%</p>
            </div>
          </div>
        </div>

        {/* FastAPI Connection Info */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="Server" size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-primary">FastAPI Integration</p>
              <p className="text-xs text-text-secondary">
                Connected to self-hosted RunPod endpoints • No API keys required
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-success">Endpoint Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPUResourceMonitor;