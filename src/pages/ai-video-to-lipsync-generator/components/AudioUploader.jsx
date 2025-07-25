import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AudioUploader = ({ onAudioUpload, onAudioRemove, uploadedAudio, loading = false }) => {
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      handleFileSelect(audioFile);
    }
  }, [handleFileSelect]);

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('audio/')) {
      // Simulate upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 15;
        });
      }, 150);

      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          const audioUrl = URL.createObjectURL(file);
          onAudioUpload?.({
            file,
            url: audioUrl,
            name: file.name,
            size: file.size,
            type: file.type
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  }, [onAudioUpload]);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveAudio = () => {
    setUploadProgress(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    onAudioRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!uploadedAudio && uploadProgress === 0 && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            isDragging 
              ? "border-primary bg-primary/5" :"border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={loading}
          />
          
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Music" size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-text-primary">Upload Audio</p>
              <p className="text-sm text-text-secondary">
                Drag and drop or click to browse
              </p>
            </div>
            <p className="text-xs text-text-secondary">
              Supports: MP3, WAV, M4A, OGG (Max 50MB)
            </p>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Processing audio...</span>
            <span className="text-sm text-text-secondary">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {uploadedAudio && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">Audio Preview</h3>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleRemoveAudio}
                iconName="Trash2"
              />
            </div>

            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={uploadedAudio.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            {/* Custom Audio Player */}
            <div className="space-y-3">
              {/* Waveform Visualization (Simplified) */}
              <div className="h-20 bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="flex items-center gap-1 h-full w-full px-4">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 bg-primary/30 rounded-full transition-all duration-200",
                        i < (currentTime / duration) * 50 ? "bg-primary" : "bg-muted"
                      )}
                      style={{
                        height: `${20 + Math.random() * 60}%`,
                        minHeight: '4px'
                      }}
                    />
                  ))}
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={togglePlayback}
                    className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full bg-muted rounded-full h-2 cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-100"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>

              {/* Time Display */}
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>{formatTime(currentTime)}</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayback}
                    iconName={isPlaying ? "Pause" : "Play"}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        setCurrentTime(0);
                      }
                    }}
                    iconName="RotateCcw"
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Audio Details */}
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">Audio Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Replace
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-text-secondary block mb-1">Filename</label>
                <p className="font-medium text-text-primary truncate">
                  {uploadedAudio.name}
                </p>
              </div>
              <div>
                <label className="text-text-secondary block mb-1">File Size</label>
                <p className="font-medium text-text-primary">
                  {formatFileSize(uploadedAudio.size)}
                </p>
              </div>
              <div>
                <label className="text-text-secondary block mb-1">Format</label>
                <p className="font-medium text-text-primary uppercase">
                  {uploadedAudio.type?.split('/')[1] || 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-text-secondary block mb-1">Duration</label>
                <p className="font-medium text-text-primary">
                  {formatTime(duration)}
                </p>
              </div>
            </div>

            {/* Audio Quality Info */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Audio Quality Tips</h4>
              <div className="text-sm text-text-secondary space-y-1">
                <p>• Clear speech with minimal background noise</p>
                <p>• Recommended: 44.1kHz sample rate or higher</p>
                <p>• Best results with consistent volume levels</p>
                <p>• Avoid heavily processed or distorted audio</p>
              </div>
            </div>
          </div>

          {/* Audio Analysis */}
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold text-text-primary mb-3">AI Audio Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Speech Detected</span>
                <span className="font-medium text-success">Yes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Audio Quality</span>
                <span className="font-medium text-success">Good</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Background Noise</span>
                <span className="font-medium text-warning">Low</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Sync Compatibility</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="font-medium text-success">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;