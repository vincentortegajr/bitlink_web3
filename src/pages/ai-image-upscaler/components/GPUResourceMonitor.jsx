import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const GPUResourceMonitor = ({ isProcessing = false }) => {
  const [gpuStats, setGpuStats] = useState({
    gpuUsage: 0,
    vramUsage: 0,
    temperature: 65,
    processingSpeed: 0,
    queuePosition: 0,
    estimatedWait: 0
  });

  const [history, setHistory] = useState([]);

  // Simulate GPU monitoring data
  useEffect(() => {
    const interval = setInterval(() => {
      setGpuStats(prev => {
        const newStats = {
          gpuUsage: isProcessing 
            ? 75 + Math.random() * 20 
            : 5 + Math.random() * 15,
          vramUsage: isProcessing 
            ? 60 + Math.random() * 25 
            : 10 + Math.random() * 20,
          temperature: isProcessing 
            ? 70 + Math.random() * 10 
            : 60 + Math.random() * 10,
          processingSpeed: isProcessing 
            ? 85 + Math.random() * 15 
            : 0,
          queuePosition: isProcessing ? Math.max(0, prev.queuePosition - 1) : 0,
          estimatedWait: isProcessing 
            ? Math.max(0, prev.estimatedWait - 2) 
            : 0
        };

        // Update history (keep last 20 points)
        setHistory(prevHistory => {
          const newHistory = [...prevHistory, {
            timestamp: Date.now(),
            gpuUsage: newStats.gpuUsage,
            vramUsage: newStats.vramUsage
          }];
          return newHistory.slice(-20);
        });

        return newStats;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const getStatusColor = (value, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return 'text-destructive';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUsageBarColor = (value, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return 'bg-destructive';
    if (value >= thresholds.warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Activity" size={16} className="text-primary" />
        <h3 className="font-semibold text-text-primary">GPU Monitor</h3>
        <div className={cn(
          "w-2 h-2 rounded-full",
          isProcessing ? "bg-green-500 animate-pulse" : "bg-muted"
        )} />
      </div>

      {/* GPU Usage */}
      <div className="space-y-4">
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
            <span className={cn("text-sm font-medium", getStatusColor(gpuStats.vramUsage))}>
              {Math.round(gpuStats.vramUsage)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn("rounded-full h-2 transition-all duration-500", getUsageBarColor(gpuStats.vramUsage))}
              style={{ width: `${Math.min(100, gpuStats.vramUsage)}%` }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">Temperature</span>
            <span className={cn("text-sm font-medium", getStatusColor(gpuStats.temperature, { warning: 75, critical: 85 }))}>
              {Math.round(gpuStats.temperature)}°C
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn("rounded-full h-2 transition-all duration-500", getUsageBarColor(gpuStats.temperature, { warning: 75, critical: 85 }))}
              style={{ width: `${Math.min(100, gpuStats.temperature)}%` }}
            />
          </div>
        </div>

        {/* Processing Speed (only when active) */}
        {isProcessing && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-secondary">Processing Speed</span>
              <span className="text-sm font-medium text-text-primary">
                {Math.round(gpuStats.processingSpeed)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${Math.min(100, gpuStats.processingSpeed)}%` }}
              />
            </div>
          </div>
        )}

        {/* Queue Information */}
        {gpuStats.queuePosition > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Icon name="Clock" size={14} />
              <span>Queue position: {gpuStats.queuePosition}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
              <Icon name="Timer" size={14} />
              <span>Est. wait: {Math.ceil(gpuStats.estimatedWait / 60)}m</span>
            </div>
          </div>
        )}

        {/* RunPod Integration Status */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">RunPod GPU</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-500">Connected</span>
            </div>
          </div>
          <div className="text-xs text-text-secondary mt-1">
            Instance: gpu-upscaler-01
          </div>
        </div>

        {/* Performance History (Mini Chart) */}
        {history.length > 5 && (
          <div className="pt-3 border-t border-border">
            <span className="text-sm text-text-secondary mb-2 block">Usage History</span>
            <div className="flex items-end gap-1 h-16">
              {history.slice(-10).map((point, index) => (
                <div
                  key={point.timestamp}
                  className="flex-1 bg-primary/20 rounded-t-sm relative"
                  style={{ height: `${Math.max(4, point.gpuUsage)}%` }}
                >
                  <div
                    className="w-full bg-primary rounded-t-sm absolute bottom-0"
                    style={{ height: `${Math.max(4, point.gpuUsage)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="pt-3 border-t border-border">
          <div className="text-xs text-text-secondary">
            Status: {isProcessing ? 'Processing...' : 'Idle'}
          </div>
          {isProcessing && (
            <div className="text-xs text-text-secondary mt-1">
              Optimized for {gpuStats.vramUsage > 60 ? 'High Quality' : 'Balanced'} upscaling
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPUResourceMonitor;