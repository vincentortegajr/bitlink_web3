import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';

const GPUResourceMonitor = ({ isProcessing, processingStats = {} }) => {
  const [gpuMetrics, setGpuMetrics] = useState({
    totalGPUs: 8,
    activeGPUs: 0,
    avgUtilization: 0,
    memoryUsage: 0,
    temperature: 65,
    powerConsumption: 0,
    queueLength: 12,
    estimatedWaitTime: 0,
    processingSpeed: '0x'
  });

  const [realtimeMetrics, setRealtimeMetrics] = useState({
    gpuLoad: Array(8).fill(0),
    memoryLoad: Array(8).fill(0),
    temperatures: Array(8).fill(60)
  });

  // Simulate real-time GPU metrics
  useEffect(() => {
    const interval = setInterval(() => {
      if (isProcessing) {
        setGpuMetrics(prev => ({
          ...prev,
          activeGPUs: processingStats.currentGPUs || 6,
          avgUtilization: Math.min(100, prev.avgUtilization + Math.random() * 15 - 7),
          memoryUsage: Math.min(100, 40 + Math.random() * 30),
          temperature: 65 + Math.random() * 15,
          powerConsumption: 250 + Math.random() * 100,
          queueLength: Math.max(1, prev.queueLength + Math.random() * 3 - 2),
          estimatedWaitTime: processingStats.estimatedWaitTime || prev.estimatedWaitTime,
          processingSpeed: processingStats.processingSpeed || '0.5x'
        }));

        setRealtimeMetrics(prev => ({
          gpuLoad: prev.gpuLoad.map(() => Math.random() * 100),
          memoryLoad: prev.memoryLoad.map(() => 30 + Math.random() * 40),
          temperatures: prev.temperatures.map(() => 60 + Math.random() * 20)
        }));
      } else {
        setGpuMetrics(prev => ({
          ...prev,
          activeGPUs: 0,
          avgUtilization: Math.max(0, prev.avgUtilization - 5),
          memoryUsage: Math.max(0, prev.memoryUsage - 3),
          temperature: Math.max(45, prev.temperature - 2),
          powerConsumption: Math.max(50, prev.powerConsumption - 20),
          processingSpeed: '0x'
        }));

        setRealtimeMetrics(prev => ({
          gpuLoad: prev.gpuLoad.map(load => Math.max(0, load - 10)),
          memoryLoad: prev.memoryLoad.map(mem => Math.max(0, mem - 5)),
          temperatures: prev.temperatures.map(temp => Math.max(45, temp - 1))
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing, processingStats]);

  const getUtilizationColor = (utilization) => {
    if (utilization < 30) return 'text-text-secondary';
    if (utilization < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getTemperatureColor = (temp) => {
    if (temp < 60) return 'text-blue-500';
    if (temp < 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">RunPod GPU Monitor</h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isProcessing ? "bg-green-500 animate-pulse" : "bg-muted"
            )} />
            <span className="text-sm text-text-secondary">
              {isProcessing ? 'Active' : 'Idle'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* GPU Cluster Status */}
        <div>
          <h4 className="font-medium text-text-primary mb-3">Cluster Status</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Active GPUs</span>
                <span className="font-medium text-text-primary">
                  {gpuMetrics.activeGPUs}/{gpuMetrics.totalGPUs}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(gpuMetrics.activeGPUs / gpuMetrics.totalGPUs) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Avg. Utilization</span>
                <span className={cn("font-medium", getUtilizationColor(gpuMetrics.avgUtilization))}>
                  {Math.round(gpuMetrics.avgUtilization)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${gpuMetrics.avgUtilization}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual GPU Status */}
        <div>
          <h4 className="font-medium text-text-primary mb-3">Individual GPUs</h4>
          <div className="grid grid-cols-4 gap-2">
            {realtimeMetrics.gpuLoad.map((load, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 rounded border text-center",
                  load > 70 ? "border-green-500/50 bg-green-500/10" :
                  load > 30 ? "border-yellow-500/50 bg-yellow-500/10": "border-border bg-muted/30"
                )}
              >
                <div className="text-xs text-text-secondary mb-1">GPU {index + 1}</div>
                <div className="text-sm font-medium text-text-primary">
                  {Math.round(load)}%
                </div>
                <div className="text-xs text-text-secondary">
                  {Math.round(realtimeMetrics.temperatures[index])}°C
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Queue */}
        {isProcessing && (
          <div>
            <h4 className="font-medium text-text-primary mb-3">Processing Queue</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Queue Position</span>
                <span className="font-medium text-text-primary">
                  #{processingStats.queuePosition || 1}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Estimated Wait</span>
                <span className="font-medium text-text-primary">
                  {Math.floor((processingStats.estimatedWaitTime || 0) / 60)}m {(processingStats.estimatedWaitTime || 0) % 60}s
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Processing Speed</span>
                <span className="font-medium text-text-primary">
                  {processingStats.processingSpeed || '0x'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Queue Length</span>
                <span className="font-medium text-text-primary">
                  {Math.round(gpuMetrics.queueLength)} jobs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Resource Metrics */}
        <div>
          <h4 className="font-medium text-text-primary mb-3">Resource Metrics</h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={14} className="text-yellow-500" />
                <span className="text-text-secondary">Power Usage</span>
              </div>
              <span className="font-medium text-text-primary">
                {Math.round(gpuMetrics.powerConsumption)}W
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="HardDrive" size={14} className="text-blue-500" />
                <span className="text-text-secondary">VRAM Usage</span>
              </div>
              <span className="font-medium text-text-primary">
                {Math.round(gpuMetrics.memoryUsage)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Thermometer" size={14} className={getTemperatureColor(gpuMetrics.temperature)} />
                <span className="text-text-secondary">Temperature</span>
              </div>
              <span className={cn("font-medium", getTemperatureColor(gpuMetrics.temperature))}>
                {Math.round(gpuMetrics.temperature)}°C
              </span>
            </div>
          </div>
        </div>

        {/* Cost Estimation */}
        <div className="bg-muted/30 rounded-lg p-3">
          <h4 className="font-medium text-text-primary mb-2">Cost Estimation</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">GPU Hours Used</span>
              <span className="font-medium text-text-primary">0.25h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Rate per Hour</span>
              <span className="font-medium text-text-primary">$0.50</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="font-medium text-text-primary">Estimated Cost</span>
              <span className="font-medium text-primary">$0.13</span>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Icon name="Info" size={16} className="text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">
                Processing in progress...
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Your lip-sync video is being generated on high-performance GPU cluster.
            </p>
          </div>
        )}

        {!isProcessing && gpuMetrics.avgUtilization < 10 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-gray-600" />
              <span className="text-sm text-gray-800 font-medium">
                GPUs Ready
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              Processing cluster is available for new lip-sync generations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPUResourceMonitor;