import React, { useState, useCallback, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const TimelineEditor = ({
  timelineData = { keyframes: [], totalDuration: 3, currentTime: 0 },
  onTimelineUpdate,
  videoSettings = { duration: 3, fps: 30 },
  disabled = false,
  mobile = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedKeyframe, setSelectedKeyframe] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef(null);
  const playbackIntervalRef = useRef(null);

  const { keyframes = [], totalDuration = 3, currentTime = 0 } = timelineData;

  // Calculate timeline dimensions
  const timelineWidth = mobile ? 280 : 400;
  const pixelsPerSecond = timelineWidth / totalDuration;

  // Convert time to pixel position
  const timeToPixel = useCallback((time) => {
    return Math.max(0, Math.min(timelineWidth, time * pixelsPerSecond));
  }, [pixelsPerSecond, timelineWidth]);

  // Convert pixel position to time
  const pixelToTime = useCallback((pixel) => {
    return Math.max(0, Math.min(totalDuration, pixel / pixelsPerSecond));
  }, [pixelsPerSecond, totalDuration]);

  // Handle timeline click
  const handleTimelineClick = (e) => {
    if (disabled || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = pixelToTime(clickX);
    
    onTimelineUpdate?.({
      ...timelineData,
      currentTime: newTime
    });
  };

  // Handle keyframe drag
  const handleKeyframeDrag = useCallback((keyframeId, newTime) => {
    const updatedKeyframes = keyframes.map(kf => 
      kf.id === keyframeId 
        ? { ...kf, time: Math.max(0, Math.min(totalDuration, newTime)) }
        : kf
    );

    onTimelineUpdate?.({
      ...timelineData,
      keyframes: updatedKeyframes
    });
  }, [keyframes, timelineData, totalDuration, onTimelineUpdate]);

  // Add new keyframe
  const addKeyframe = () => {
    if (disabled) return;

    const newKeyframe = {
      id: `keyframe-${Date.now()}`,
      time: currentTime,
      type: 'motion',
      properties: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1
      }
    };

    onTimelineUpdate?.({
      ...timelineData,
      keyframes: [...keyframes, newKeyframe]
    });
  };

  // Remove keyframe
  const removeKeyframe = (keyframeId) => {
    if (disabled) return;

    const updatedKeyframes = keyframes.filter(kf => kf.id !== keyframeId);
    onTimelineUpdate?.({
      ...timelineData,
      keyframes: updatedKeyframes
    });
    
    if (selectedKeyframe?.id === keyframeId) {
      setSelectedKeyframe(null);
    }
  };

  // Playback controls
  const togglePlayback = () => {
    if (disabled) return;

    if (isPlaying) {
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    } else {
      setIsPlaying(true);
      playbackIntervalRef.current = setInterval(() => {
        onTimelineUpdate?.(prev => {
          const nextTime = prev.currentTime + (1 / videoSettings.fps);
          if (nextTime >= totalDuration) {
            setIsPlaying(false);
            return { ...prev, currentTime: 0 };
          }
          return { ...prev, currentTime: nextTime };
        });
      }, 1000 / videoSettings.fps);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={togglePlayback}
            disabled={disabled}
            iconName={isPlaying ? "Pause" : "Play"}
          />
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onTimelineUpdate?.({ ...timelineData, currentTime: 0 })}
            disabled={disabled}
            iconName="RotateCcw"
            title="Reset to start"
          />
          
          <span className="text-xs text-text-secondary font-mono">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={addKeyframe}
            disabled={disabled}
            iconName="Plus"
            iconPosition="left"
          >
            Keyframe
          </Button>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="bg-muted rounded-lg p-4">
        <div className="space-y-3">
          {/* Time Ruler */}
          <div className="relative">
            <div className="flex justify-between text-xs text-text-secondary mb-2">
              {Array.from({ length: Math.floor(totalDuration) + 1 }, (_, i) => (
                <span key={i} className="font-mono">{i}s</span>
              ))}
            </div>
            
            {/* Timeline Base */}
            <div
              ref={timelineRef}
              className={cn(
                "relative h-12 bg-card rounded border cursor-pointer overflow-hidden",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={handleTimelineClick}
              style={{ width: timelineWidth }}
            >
              {/* Time Markers */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: Math.floor(totalDuration) + 1 }, (_, i) => (
                  <div
                    key={i}
                    className="border-l border-border/50"
                    style={{ left: `${(i / totalDuration) * 100}%` }}
                  />
                ))}
              </div>
              
              {/* Current Time Indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 transition-all"
                style={{ left: timeToPixel(currentTime) }}
              >
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
              </div>
              
              {/* Keyframes */}
              {keyframes.map((keyframe) => (
                <div
                  key={keyframe.id}
                  className={cn(
                    "absolute top-1 bottom-1 w-2 rounded cursor-move transition-colors z-10",
                    selectedKeyframe?.id === keyframe.id
                      ? "bg-accent border-2 border-accent-foreground"
                      : "bg-warning hover:bg-warning/80"
                  )}
                  style={{ left: timeToPixel(keyframe.time) - 4 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedKeyframe(keyframe);
                  }}
                  title={`Keyframe at ${formatTime(keyframe.time)}`}
                />
              ))}
            </div>
          </div>

          {/* Frame Progression Indicator */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Icon name="Film" size={14} />
            <span>Frame: {Math.floor(currentTime * videoSettings.fps)} / {Math.floor(totalDuration * videoSettings.fps)}</span>
            <span className="mx-2">•</span>
            <span>FPS: {videoSettings.fps}</span>
          </div>
        </div>
      </div>

      {/* Selected Keyframe Properties */}
      {selectedKeyframe && (
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-text-primary">
              Keyframe Properties
            </h4>
            <Button
              size="xs"
              variant="destructive"
              onClick={() => removeKeyframe(selectedKeyframe.id)}
              iconName="Trash2"
              disabled={disabled}
            >
              Remove
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Time (s)</label>
              <input
                type="number"
                min="0"
                max={totalDuration}
                step="0.1"
                value={selectedKeyframe.time.toFixed(1)}
                onChange={(e) => handleKeyframeDrag(selectedKeyframe.id, parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full px-2 py-1 text-xs border rounded bg-background"
              />
            </div>
            
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Type</label>
              <select
                value={selectedKeyframe.type}
                onChange={(e) => {
                  const updatedKeyframes = keyframes.map(kf => 
                    kf.id === selectedKeyframe.id ? { ...kf, type: e.target.value } : kf
                  );
                  onTimelineUpdate?.({ ...timelineData, keyframes: updatedKeyframes });
                  setSelectedKeyframe({ ...selectedKeyframe, type: e.target.value });
                }}
                disabled={disabled}
                className="w-full px-2 py-1 text-xs border rounded bg-background"
              >
                <option value="motion">Motion</option>
                <option value="scale">Scale</option>
                <option value="fade">Fade</option>
                <option value="rotate">Rotate</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Guide */}
      {keyframes.length === 0 && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-primary">Timeline Editor</p>
              <ul className="text-xs text-text-secondary space-y-0.5">
                <li>• Click on timeline to set current time</li>
                <li>• Add keyframes to create motion paths</li>
                <li>• Drag keyframes to adjust timing</li>
                <li>• Use playback controls to preview</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineEditor;