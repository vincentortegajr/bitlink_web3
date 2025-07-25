import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreviewPlayer = ({ 
  videoFile, 
  audioFile, 
  processedVideo, 
  isProcessing, 
  progress, 
  estimatedTime 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [comparisonMode, setComparisonMode] = useState(false);
  const videoRef = useRef(null);

  const togglePlayback = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Processing state display
  if (isProcessing && !processedVideo) {
    return (
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="aspect-video bg-black flex flex-col items-center justify-center text-white p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-xl font-semibold">Generating Lip Sync...</h3>
            <p className="text-gray-300">AI is processing your video and audio</p>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Progress</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Estimated Time */}
            {estimatedTime > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-400">Estimated time remaining</p>
                <p className="text-lg font-semibold text-primary">
                  {Math.floor(estimatedTime / 60)}m {estimatedTime % 60}s
                </p>
              </div>
            )}

            {/* Processing Steps */}
            <div className="text-left max-w-md mx-auto space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  progress > 20 ? "bg-green-500" : "bg-gray-600"
                )} />
                <span className={progress > 20 ? "text-white" : "text-gray-400"}>
                  Analyzing video content
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  progress > 40 ? "bg-green-500" : progress > 20 ? "bg-yellow-500 animate-pulse" : "bg-gray-600"
                )} />
                <span className={progress > 40 ? "text-white" : progress > 20 ? "text-yellow-300" : "text-gray-400"}>
                  Processing audio features
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  progress > 70 ? "bg-green-500" : progress > 40 ? "bg-yellow-500 animate-pulse" : "bg-gray-600"
                )} />
                <span className={progress > 70 ? "text-white" : progress > 40 ? "text-yellow-300" : "text-gray-400"}>
                  Generating lip movements
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  progress > 90 ? "bg-green-500" : progress > 70 ? "bg-yellow-500 animate-pulse" : "bg-gray-600"
                )} />
                <span className={progress > 90 ? "text-white" : progress > 70 ? "text-yellow-300" : "text-gray-400"}>
                  Rendering final video
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Processed video display
  if (processedVideo) {
    return (
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="relative">
          <div className="aspect-video bg-black">
            <video
              ref={videoRef}
              src={processedVideo.url}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            />
          </div>

          {/* Video Controls Overlay */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div
                className="w-full bg-white/20 rounded-full h-1 mb-4 cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-100"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayback}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Icon name="Volume2" size={16} className="text-white" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 accent-primary"
                    />
                  </div>

                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={playbackRate}
                    onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                    className="bg-black/50 text-white border border-white/20 rounded px-2 py-1 text-sm"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setComparisonMode(!comparisonMode)}
                    className="text-white hover:bg-white/20"
                    title="Compare with original"
                  >
                    <Icon name="GitCompare" size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.requestFullscreen) {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                  >
                    <Icon name="Maximize" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Mode Toggle */}
          {comparisonMode && videoFile && (
            <div className="absolute top-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
                Split View: Original | Processed
              </div>
            </div>
          )}
        </div>

        {/* Video Information */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Processed Video</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-text-secondary">Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-text-secondary block mb-1">Duration</label>
              <p className="font-medium text-text-primary">{processedVideo.duration}</p>
            </div>
            <div>
              <label className="text-text-secondary block mb-1">File Size</label>
              <p className="font-medium text-text-primary">{processedVideo.fileSize}</p>
            </div>
            <div>
              <label className="text-text-secondary block mb-1">Quality</label>
              <p className="font-medium text-text-primary capitalize">{processedVideo.quality}</p>
            </div>
            <div>
              <label className="text-text-secondary block mb-1">Resolution</label>
              <p className="font-medium text-text-primary">{processedVideo.resolution}</p>
            </div>
          </div>

          {/* Processing Statistics */}
          {processedVideo.stats && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Processing Results</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Sync Accuracy</span>
                  <span className="font-medium text-success">{processedVideo.stats.syncAccuracy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Audio Alignment</span>
                  <span className="font-medium text-success">{processedVideo.stats.audioAlignment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Processing Time</span>
                  <span className="font-medium text-text-primary">{processedVideo.processingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">GPU Nodes Used</span>
                  <span className="font-medium text-text-primary">{processedVideo.stats.processingNodes}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default preview state (before processing)
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="aspect-video bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
            <Icon name="Video" size={32} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Preview Area</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Upload both video and audio files to preview and process your lip-sync generation
            </p>
          </div>
          
          {/* Upload Status */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Icon 
                name={videoFile ? "CheckCircle" : "Circle"} 
                size={16} 
                className={videoFile ? "text-green-500" : "text-gray-500"} 
              />
              <span className={videoFile ? "text-green-300" : "text-gray-400"}>
                Video File {videoFile ? "✓" : "Required"}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Icon 
                name={audioFile ? "CheckCircle" : "Circle"} 
                size={16} 
                className={audioFile ? "text-green-500" : "text-gray-500"} 
              />
              <span className={audioFile ? "text-green-300" : "text-gray-400"}>
                Audio File {audioFile ? "✓" : "Required"}
              </span>
            </div>
          </div>

          {videoFile && audioFile && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-green-300">
              <div className="flex items-center gap-2 justify-center">
                <Icon name="CheckCircle" size={16} />
                <span className="font-medium">Ready for Processing</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPlayer;