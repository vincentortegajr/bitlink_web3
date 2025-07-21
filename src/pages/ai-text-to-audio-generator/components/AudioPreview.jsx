import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const AudioPreview = ({
  isGenerating,
  progress,
  estimatedTime,
  generatedAudio,
  onExport,
  onRegenerate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [generatedAudio]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(newTime);
  };

  const changePlaybackSpeed = (speed) => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlaybackSpeed(speed);
    audio.playbackRate = speed;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    if (generatedAudio) {
      onExport?.('mp3', 'high');
    }
  };

  // Waveform visualization
  const renderWaveform = () => {
    if (!generatedAudio?.waveform) return null;

    const segments = generatedAudio.waveform.length;
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div className="relative h-16 bg-muted/30 rounded-md flex items-end justify-center gap-0.5 px-2 overflow-hidden">
        {generatedAudio.waveform.map((amplitude, index) => {
          const height = Math.max(2, (amplitude / 100) * 60);
          const isPlayed = (index / segments) * 100 <= progressPercent;
          
          return (
            <div
              key={index}
              className={cn(
                "w-1 rounded-full transition-colors duration-200",
                isPlayed ? "bg-primary" : "bg-muted-foreground/40"
              )}
              style={{ height: `${height}px` }}
            />
          );
        })}
        
        {/* Playhead indicator */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary/80"
            style={{ left: `${progressPercent}%` }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border">
      {/* Generation Progress */}
      {isGenerating && (
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-4 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Volume2" size={20} className="text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Generating Audio</h3>
            <p className="text-text-secondary">Converting your text to speech...</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{progress.toFixed(0)}% complete</span>
              <span className="text-text-secondary">
                {estimatedTime > 0 ? `~${estimatedTime}s remaining` : 'Almost done...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {generatedAudio && !isGenerating && (
        <div className="p-6">
          <div className="space-y-4">
            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={generatedAudio.url}
              preload="metadata"
            />

            {/* Waveform */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Audio Waveform</span>
                <span className="text-text-secondary">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="cursor-pointer"
              >
                {renderWaveform()}
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.currentTime = Math.max(0, currentTime - 10);
                  }
                }}
              >
                <Icon name="RotateCcw" size={16} />
              </Button>

              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-14 h-14 rounded-full"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.currentTime = Math.min(duration, currentTime + 10);
                  }
                }}
              >
                <Icon name="RotateCw" size={16} />
              </Button>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-text-secondary">Speed:</span>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changePlaybackSpeed(speed)}
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium transition-colors",
                    playbackSpeed === speed
                      ? "bg-primary text-primary-foreground"
                      : "text-text-secondary hover:text-text-primary hover:bg-muted"
                  )}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Audio Info */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-text-secondary">Quality</p>
                <p className="text-sm font-semibold text-text-primary">
                  {generatedAudio.settings?.quality || 'High'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary">Voice</p>
                <p className="text-sm font-semibold text-text-primary">
                  {generatedAudio.voice?.name || 'Default'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={onRegenerate}
                iconName="RefreshCw"
                iconPosition="left"
                className="flex-1"
              >
                Regenerate
              </Button>
              
              <Button
                onClick={downloadAudio}
                iconName="Download"
                iconPosition="left"
                className="flex-1"
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!generatedAudio && !isGenerating && (
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <Icon name="Volume2" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Ready to Generate</h3>
          <p className="text-text-secondary mb-4">
            Enter your text and select a voice to create high-quality audio
          </p>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>✓ Natural AI voices</p>
            <p>✓ Multiple format options</p>
            <p>✓ Advanced voice controls</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPreview;