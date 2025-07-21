import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const RunPodGPUMonitor = ({ isProcessing = false, onInstanceManagement }) => {
  const [gpuStats, setGpuStats] = useState({
    instanceId: 'realism-gpu-01',
    gpuModel: 'RTX 4090',
    gpuUsage: 0,
    vramUsage: 0,
    vramTotal: 24,
    temperature: 45,
    powerUsage: 0,
    processingSpeed: 0,
    queueLength: 0,
    estimatedWait: 0,
    costPerHour: 0.89,
    sessionCost: 0.00,
    status: 'connected' // connected, connecting, disconnected, error
  });

  const [connectionHistory, setConnectionHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // Simulate RunPod GPU monitoring data
  useEffect(() => {
    const interval = setInterval(() => {
      setGpuStats(prev => {
        const newStats = {
          ...prev,
          gpuUsage: isProcessing 
            ? 88 + Math.random() * 10 
            : 8 + Math.random() * 12,
          vramUsage: isProcessing 
            ? 18 + Math.random() * 4 
            : 2 + Math.random() * 3,
          temperature: isProcessing 
            ? 75 + Math.random() * 8 
            : 45 + Math.random() * 10,
          powerUsage: isProcessing 
            ? 380 + Math.random() * 40 
            : 50 + Math.random() * 30,
          processingSpeed: isProcessing 
            ? 92 + Math.random() * 8 
            : 0,
          queueLength: isProcessing 
            ? Math.max(0, prev.queueLength + (Math.random() > 0.7 ? 1 : -1))
            : 0,
          estimatedWait: Math.max(0, prev.estimatedWait - (isProcessing ? 3 : 1)),
          sessionCost: prev.sessionCost + (prev.costPerHour / 3600 * 2) // Update every 2 seconds
        };

        // Add to connection history
        if (Math.random() > 0.95) { // Occasional updates to history
          setConnectionHistory(prevHistory => {
            const newEntry = {
              timestamp: Date.now(),
              gpuUsage: newStats.gpuUsage,
              vramUsage: (newStats.vramUsage / newStats.vramTotal) * 100,
              temperature: newStats.temperature
            };
            return [...prevHistory, newEntry].slice(-30); // Keep last 30 points
          });
        }

        return newStats;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const getStatusColor = (value, type = 'usage') => {
    const thresholds = {
      usage: { warning: 70, critical: 90 },
      temperature: { warning: 78, critical: 85 },
      vram: { warning: 20, critical: 22 }
    };
    
    const threshold = thresholds[type] || thresholds.usage;
    
    if (value >= threshold.critical) return 'text-red-500';
    if (value >= threshold.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUsageBarColor = (value, type = 'usage') => {
    const thresholds = {
      usage: { warning: 70, critical: 90 },
      temperature: { warning: 78, critical: 85 },
      vram: { warning: 20, critical: 22 }
    };
    
    const threshold = thresholds[type] || thresholds.usage;
    
    if (value >= threshold.critical) return 'bg-red-500';
    if (value >= threshold.warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'Loader2';
      case 'disconnected': return 'WifiOff';
      case 'error': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected to RunPod GPU';
      case 'connecting': return 'Connecting to RunPod...';
      case 'disconnected': return 'Disconnected from RunPod';
      case 'error': return 'RunPod Connection Error';
      default: return 'Unknown Status';
    }
  };

  const vramPercentage = (gpuStats.vramUsage / gpuStats.vramTotal) * 100;

  return (
    <div className="bg-card rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">RunPod GPU Monitor</h3>
              <div className="flex items-center gap-2 text-sm">
                <Icon 
                  name={getStatusIcon(gpuStats.status)} 
                  size={12} 
                  className={cn(
                    gpuStats.status === 'connected' ? 'text-green-500' : 
                    gpuStats.status === 'connecting'? 'text-yellow-500 animate-spin' : 'text-red-500'
                  )} 
                />
                <span className="text-text-secondary">{getStatusText(gpuStats.status)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              iconName={showDetails ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              Details
            </Button>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="p-4 space-y-4">
        {/* Instance Info */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="text-xs text-text-secondary">Instance ID</p>
            <p className="text-sm font-mono font-medium text-text-primary">{gpuStats.instanceId}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">GPU Model</p>
            <p className="text-sm font-medium text-text-primary">{gpuStats.gpuModel}</p>
          </div>
        </div>

        {/* GPU Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">GPU Usage</span>
            <span className={cn("text-sm font-medium", getStatusColor(gpuStats.gpuUsage))}>
              {Math.round(gpuStats.gpuUsage)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn("rounded-full h-2 transition-all duration-500", getUsageBarColor(gpuStats.gpuUsage))}
              style={{ width: `${Math.min(100, gpuStats.gpuUsage)}%` }}
            />
          </div>
        </div>

        {/* VRAM Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">VRAM Usage</span>
            <span className={cn("text-sm font-medium", getStatusColor(vramPercentage, 'vram'))}>
              {gpuStats.vramUsage.toFixed(1)} GB / {gpuStats.vramTotal} GB
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn("rounded-full h-2 transition-all duration-500", getUsageBarColor(vramPercentage, 'vram'))}
              style={{ width: `${Math.min(100, vramPercentage)}%` }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">Temperature</span>
            <span className={cn("text-sm font-medium", getStatusColor(gpuStats.temperature, 'temperature'))}>
              {Math.round(gpuStats.temperature)}°C
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn("rounded-full h-2 transition-all duration-500", getUsageBarColor(gpuStats.temperature, 'temperature'))}
              style={{ width: `${Math.min(100, gpuStats.temperature)}%` }}
            />
          </div>
        </div>

        {/* Processing Info (when active) */}
        {isProcessing && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={14} className="text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Active Processing</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-secondary">Speed:</span>
                <span className="font-medium ml-1">{Math.round(gpuStats.processingSpeed)}%</span>
              </div>
              <div>
                <span className="text-text-secondary">Power:</span>
                <span className="font-medium ml-1">{Math.round(gpuStats.powerUsage)}W</span>
              </div>
            </div>
          </div>
        )}

        {/* Queue Information */}
        {gpuStats.queueLength > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Clock" size={14} className="text-yellow-600" />
              <span className="text-yellow-700">
                {gpuStats.queueLength} jobs in queue • Est. wait: {Math.ceil(gpuStats.estimatedWait / 60)}m
              </span>
            </div>
          </div>
        )}

        {/* Cost Tracking */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Session Cost</p>
              <p className="text-xs text-green-600">${gpuStats.costPerHour}/hour</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-700">${gpuStats.sessionCost.toFixed(4)}</p>
              <p className="text-xs text-green-600">Running total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats (Expandable) */}
      {showDetails && (
        <div className="border-t border-border p-4 space-y-4">
          <h4 className="font-medium text-text-primary">Detailed Metrics</h4>
          
          {/* Performance Chart */}
          {connectionHistory.length > 5 && (
            <div>
              <p className="text-sm text-text-secondary mb-2">Usage History (Last 5 minutes)</p>
              <div className="flex items-end gap-1 h-20 bg-muted/30 rounded p-2">
                {connectionHistory.slice(-15).map((point, index) => (
                  <div key={point.timestamp} className="flex-1 flex flex-col gap-1">
                    <div
                      className="w-full bg-blue-500/20 rounded-t-sm relative"
                      style={{ height: `${Math.max(4, point.gpuUsage)}%` }}
                    >
                      <div
                        className="w-full bg-blue-500 rounded-t-sm absolute bottom-0"
                        style={{ height: `${Math.max(4, point.gpuUsage)}%` }}
                        title={`GPU: ${Math.round(point.gpuUsage)}%`}
                      />
                    </div>
                    <div
                      className="w-full bg-purple-500/20 rounded-t-sm relative"
                      style={{ height: `${Math.max(4, point.vramUsage)}%` }}
                    >
                      <div
                        className="w-full bg-purple-500 rounded-t-sm absolute bottom-0"
                        style={{ height: `${Math.max(4, point.vramUsage)}%` }}
                        title={`VRAM: ${Math.round(point.vramUsage)}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>GPU Usage</span>
                <span>VRAM Usage</span>
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <h5 className="font-medium text-text-primary">Performance</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-secondary">GPU Utilization:</span>
                  <span>{Math.round(gpuStats.gpuUsage)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Memory Clock:</span>
                  <span>1215 MHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Core Clock:</span>
                  <span>2520 MHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Power Limit:</span>
                  <span>450W</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-text-primary">Connection</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Uptime:</span>
                  <span>2h 34m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Region:</span>
                  <span>US-East</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Latency:</span>
                  <span>23ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Bandwidth:</span>
                  <span>1.2 Gbps</span>
                </div>
              </div>
            </div>
          </div>

          {/* RunPod Controls */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Instance Management</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInstanceManagement?.('restart')}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Restart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInstanceManagement?.('stop')}
                  iconName="Square"
                  iconPosition="left"
                >
                  Stop
                </Button>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-text-secondary">
                <Icon name="Info" size={12} className="inline mr-1" />
                Stopping the instance will pause processing but preserve your session. 
                Restarting may take 30-60 seconds.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunPodGPUMonitor;