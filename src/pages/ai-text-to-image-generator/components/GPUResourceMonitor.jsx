import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';

const GPUResourceMonitor = ({ isGenerating = false }) => {
  const [gpuStats, setGpuStats] = useState({
    usage: 45,
    memory: 68,
    temperature: 72,
    queuePosition: 0,
    estimatedWaitTime: 0,
    availableNodes: 8,
    totalNodes: 12
  });

  const [usageStats] = useState({
    creditsRemaining: 250,
    totalCredits: 500,
    processingTime: 1450, // seconds
    monthlyLimit: 3600,
    generationsToday: 12,
    dailyLimit: 50
  });

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setGpuStats(prev => ({
          ...prev,
          usage: Math.min(95, prev.usage + Math.random() * 10),
          memory: Math.min(90, prev.memory + Math.random() * 5),
          temperature: Math.min(85, prev.temperature + Math.random() * 3)
        }));
      }, 2000);
    } else {
      setGpuStats(prev => ({
        ...prev,
        usage: Math.max(20, prev.usage - 5),
        memory: Math.max(30, prev.memory - 3),
        temperature: Math.max(65, prev.temperature - 2)
      }));
    }

    return () => clearInterval(interval);
  }, [isGenerating]);

  const getStatusColor = (value, thresholds = { warning: 70, danger: 90 }) => {
    if (value >= thresholds.danger) return 'text-error';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-success';
  };

  const getStatusBg = (value, thresholds = { warning: 70, danger: 90 }) => {
    if (value >= thresholds.danger) return 'bg-error/10';
    if (value >= thresholds.warning) return 'bg-warning/10';
    return 'bg-success/10';
  };

  return (
    <div className="space-y-4">
      {/* GPU Status */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Cpu" size={16} />
            RunPod GPU Status
          </h3>
          <div className={cn(
            "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
            isGenerating ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isGenerating ? "bg-primary animate-pulse" : "bg-success"
            )} />
            {isGenerating ? 'Processing' : 'Ready'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* GPU Usage */}
          <div className={cn("p-3 rounded-lg", getStatusBg(gpuStats.usage))}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">GPU Usage</span>
              <Icon name="Activity" size={12} className={getStatusColor(gpuStats.usage)} />
            </div>
            <div className={cn("text-lg font-semibold", getStatusColor(gpuStats.usage))}>
              {Math.round(gpuStats.usage)}%
            </div>
          </div>

          {/* Memory Usage */}
          <div className={cn("p-3 rounded-lg", getStatusBg(gpuStats.memory))}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Memory</span>
              <Icon name="HardDrive" size={12} className={getStatusColor(gpuStats.memory)} />
            </div>
            <div className={cn("text-lg font-semibold", getStatusColor(gpuStats.memory))}>
              {Math.round(gpuStats.memory)}%
            </div>
          </div>

          {/* Temperature */}
          <div className={cn("p-3 rounded-lg", getStatusBg(gpuStats.temperature, { warning: 75, danger: 85 }))}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Temp</span>
              <Icon name="Thermometer" size={12} className={getStatusColor(gpuStats.temperature, { warning: 75, danger: 85 })} />
            </div>
            <div className={cn("text-lg font-semibold", getStatusColor(gpuStats.temperature, { warning: 75, danger: 85 }))}>
              {Math.round(gpuStats.temperature)}°C
            </div>
          </div>

          {/* Available Nodes */}
          <div className="p-3 rounded-lg bg-primary/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Nodes</span>
              <Icon name="Server" size={12} className="text-primary" />
            </div>
            <div className="text-lg font-semibold text-primary">
              {gpuStats.availableNodes}/{gpuStats.totalNodes}
            </div>
          </div>
        </div>

        {/* Queue Status */}
        {gpuStats.queuePosition > 0 && (
          <div className="mt-4 p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Queue Position: #{gpuStats.queuePosition}</span>
              </div>
              <span className="text-sm text-text-secondary">
                Est. wait: {Math.ceil(gpuStats.estimatedWaitTime / 60)}min
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Icon name="BarChart3" size={16} />
          Usage Statistics
        </h3>

        <div className="space-y-4">
          {/* Credits */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Credits Remaining</span>
              <span className="font-medium text-text-primary">
                {usageStats.creditsRemaining} / {usageStats.totalCredits}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(usageStats.creditsRemaining / usageStats.totalCredits) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Processing Time */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Processing Time (Monthly)</span>
              <span className="font-medium text-text-primary">
                {Math.round(usageStats.processingTime / 60)}min / {Math.round(usageStats.monthlyLimit / 60)}min
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(usageStats.processingTime / usageStats.monthlyLimit) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Daily Generations */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Today's Generations</span>
            <span className="text-sm font-medium text-text-primary">
              {usageStats.generationsToday} / {usageStats.dailyLimit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPUResourceMonitor;