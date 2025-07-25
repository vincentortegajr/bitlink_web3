import React, { useState, useRef } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TimelineEditor = ({ videoFile, audioFile, onSyncAdjustment, disabled = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(30); // Default duration
  const [zoomLevel, setZoomLevel] = useState(1);
  const [syncOffset, setSyncOffset] = useState(0);
  const [selectedKeyframe, setSelectedKeyframe] = useState(null);
  const timelineRef = useRef(null);

  // Mock keyframe data for demonstration
  const mockKeyframes = [
    { id: 1, time: 2.5, type: 'sync', confidence: 0.95 },
    { id: 2, time: 5.8, type: 'sync', confidence: 0.87 },
    { id: 3, time: 9.2, type: 'sync', confidence: 0.92 },
    { id: 4, time: 12.7, type: 'sync', confidence: 0.89 },
    { id: 5, time: 16.3, type: 'sync', confidence: 0.94 },
    { id: 6, time: 20.1, type: 'sync', confidence: 0.88 },
    { id: 7, time: 24.6, type: 'sync', confidence: 0.91 }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In real implementation, would control video/audio playback
  };

  const handleTimelineClick = (e) => {
    if (disabled) return;
    
    const rect = timelineRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      setCurrentTime(newTime);
      onSyncAdjustment?.({ time: newTime, offset: syncOffset });
    }
  };

  const handleKeyframeClick = (keyframe, e) => {
    e.stopPropagation();
    setSelectedKeyframe(keyframe);
    setCurrentTime(keyframe.time);
  };

  const handleSyncOffsetChange = (offset) => {
    setSyncOffset(offset);
    onSyncAdjustment?.({ time: currentTime, offset });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getKeyframeColor = (confidence) => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Timeline Editor</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
              iconName="ZoomOut"
            />
            <span className="text-sm text-text-secondary px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
              iconName="ZoomIn"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            disabled={disabled || (!videoFile && !audioFile)}
            iconName={isPlaying ? "Pause" : "Play"}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentTime(0)}
            disabled={disabled}
            iconName="SkipBack"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentTime(duration)}
            disabled={disabled}
            iconName="SkipForward"
          />
          
          <div className="flex items-center gap-2 ml-4">
            <Icon name="Clock" size={16} className="text-text-secondary" />
            <span className="text-sm font-mono text-text-primary">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Sync Offset Controls */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-text-primary">Sync Offset:</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSyncOffsetChange(syncOffset - 0.1)}
              disabled={disabled}
            >
              -0.1s
            </Button>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded min-w-[60px] text-center">
              {syncOffset >= 0 ? '+' : ''}{syncOffset.toFixed(1)}s
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSyncOffsetChange(syncOffset + 0.1)}
              disabled={disabled}
            >
              +0.1s
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSyncOffsetChange(0)}
              disabled={disabled}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="p-4 space-y-4">
        {/* Time Ruler */}
        <div className="relative h-8 bg-muted/30 rounded">
          <div className="flex items-center h-full px-2">
            {Array.from({ length: Math.ceil(duration / 5) + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: `${(i * 5 / duration) * 100}%` }}
              >
                <div className="w-px h-4 bg-text-secondary"></div>
                <span className="text-xs text-text-secondary mt-1">
                  {formatTime(i * 5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Track */}
        {videoFile && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Video Track</label>
            <div className="relative h-16 bg-blue-100 rounded overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20 flex items-center px-3">
                <Icon name="Video" size={16} className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800 truncate">
                  {videoFile.name}
                </span>
              </div>
              
              {/* Video Keyframes */}
              {mockKeyframes.map((keyframe) => (
                <div
                  key={keyframe.id}
                  className={cn(
                    "absolute top-2 w-2 h-12 rounded cursor-pointer transform -translate-x-1",
                    getKeyframeColor(keyframe.confidence),
                    selectedKeyframe?.id === keyframe.id && "ring-2 ring-primary"
                  )}
                  style={{ left: `${(keyframe.time / duration) * 100}%` }}
                  onClick={(e) => handleKeyframeClick(keyframe, e)}
                  title={`Sync point - ${(keyframe.confidence * 100).toFixed(1)}% confidence`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Audio Track */}
        {audioFile && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Audio Track</label>
            <div className="relative h-16 bg-green-100 rounded overflow-hidden">
              <div className="absolute inset-0 bg-green-500/20 flex items-center px-3">
                <Icon name="Music" size={16} className="text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800 truncate">
                  {audioFile.name}
                </span>
              </div>

              {/* Audio Waveform Visualization (Simplified) */}
              <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end gap-px px-2">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-green-600/40 rounded-t"
                    style={{
                      height: `${20 + Math.random() * 60}%`,
                      minHeight: '2px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Scrubber */}
        <div
          ref={timelineRef}
          className="relative h-8 bg-muted rounded cursor-pointer"
          onClick={handleTimelineClick}
        >
          <div className="absolute inset-0 flex items-center">
            <div
              className="absolute w-0.5 h-full bg-primary z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Keyframe Details Panel */}
        {selectedKeyframe && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-3">Sync Point Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-text-secondary">Time Position</label>
                <p className="font-medium text-text-primary">
                  {formatTime(selectedKeyframe.time)}
                </p>
              </div>
              <div>
                <label className="text-text-secondary">Confidence</label>
                <p className="font-medium text-text-primary">
                  {(selectedKeyframe.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTime(selectedKeyframe.time)}
                iconName="Play"
                iconPosition="left"
              >
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Would fine-tune this keyframe
                }}
                iconName="Settings"
                iconPosition="left"
              >
                Adjust
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium text-text-primary mb-2">Timeline Instructions</h4>
          <div className="text-sm text-text-secondary space-y-1">
            <p>• Click on timeline to scrub through content</p>
            <p>• Green/Yellow/Red markers show sync confidence levels</p>
            <p>• Use sync offset controls to fine-tune audio alignment</p>
            <p>• Click keyframes to inspect sync points in detail</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEditor;