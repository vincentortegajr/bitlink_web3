import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Components
import VideoUploader from './components/VideoUploader';
import AudioUploader from './components/AudioUploader';
import TimelineEditor from './components/TimelineEditor';
import ProcessingSettings from './components/ProcessingSettings';
import GPUResourceMonitor from './components/GPUResourceMonitor';
import PreviewPlayer from './components/PreviewPlayer';

const AIVideoToLipsyncGenerator = () => {
  // State management
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // upload, timeline, preview, settings

  // Processing settings
  const [settings, setSettings] = useState({
    lipIntensity: 0.8,
    expressionPreservation: 0.7,
    audioVisualAlignment: 0.9,
    quality: 'high', // low, medium, high, ultra
    resolution: '1080p', // 720p, 1080p, 4k
    frameRate: '30fps', // 24fps, 30fps, 60fps
    format: 'mp4', // mp4, mov, avi
    enableFacialExpressions: true,
    preserveBackground: true,
    noiseReduction: 0.5,
    isPublic: false
  });

  // Processing queue and statistics
  const [processingStats, setProcessingStats] = useState({
    queuePosition: 0,
    currentGPUs: 0,
    totalGPUs: 8,
    estimatedWaitTime: 0,
    processingSpeed: '0.5x',
    gpuUtilization: 0
  });

  // Community sharing state
  const [sharingSettings, setSharingSettings] = useState({
    isPublic: false,
    allowRemix: true,
    tags: [],
    description: ''
  });

  // FastAPI endpoint integration for lip-sync processing
  const generateLipSync = useCallback(async () => {
    if (!videoFile || !audioFile) return;

    setIsProcessing(true);
    setProgress(0);
    setEstimatedTime(120); // Initial estimate in seconds

    try {
      const formData = new FormData();
      formData.append('video_file', videoFile.file);
      formData.append('audio_file', audioFile.file);
      formData.append('settings', JSON.stringify(settings));

      const response = await fetch('/api/v1/video-lipsync/generate', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update processing queue statistics
        setProcessingStats(prev => ({
          ...prev,
          queuePosition: data.queue_position || 3,
          currentGPUs: data.active_gpus || 6,
          estimatedWaitTime: data.estimated_wait || 90
        }));

        // Simulate progress updates (would be replaced by WebSocket/SSE in production)
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(100, prev + Math.random() * 8);
            setEstimatedTime(prev => Math.max(0, prev - 3));
            setProcessingStats(prevStats => ({
              ...prevStats,
              gpuUtilization: Math.min(100, prevStats.gpuUtilization + Math.random() * 10),
              processingSpeed: `${(0.3 + Math.random() * 0.4).toFixed(1)}x`
            }));
            return newProgress;
          });
        }, 2000);

        // Simulate completion after processing
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setEstimatedTime(0);
          
          // Mock processed video result
          setProcessedVideo({
            id: `lipsync-${Date.now()}`,
            url: '/api/placeholder/video/processed-lipsync.mp4',
            thumbnail: '/api/placeholder/400/300?text=Lip+Sync+Result',
            duration: '00:45',
            fileSize: '15.2 MB',
            quality: settings.quality,
            resolution: settings.resolution,
            processingTime: '2m 15s',
            originalVideo: videoFile,
            audioTrack: audioFile,
            settings: { ...settings },
            stats: {
              facesDetected: 1,
              syncAccuracy: '94.8%',
              audioAlignment: '97.2%',
              processingNodes: 4
            }
          });
          
          setIsProcessing(false);
          setActiveTab('preview');
        }, 15000);

      } else {
        throw new Error('Lip-sync processing failed');
      }
    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      setProgress(0);
      // Handle error state
    }
  }, [videoFile, audioFile, settings]);

  const handleVideoUpload = (file) => {
    setVideoFile(file);
  };

  const handleAudioUpload = (file) => {
    setAudioFile(file);
  };

  const handleDownload = () => {
    if (processedVideo?.url) {
      const link = document.createElement('a');
      link.href = processedVideo.url;
      link.download = `lipsync-${processedVideo.id || Date.now()}.${settings.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (sharingSettings.isPublic && processedVideo) {
      // Mock API call to save to community
      try {
        const shareData = {
          video_id: processedVideo.id,
          title: sharingSettings.description || 'Lip Sync Creation',
          description: sharingSettings.description,
          tags: sharingSettings.tags,
          allow_remix: sharingSettings.allowRemix,
          original_video: videoFile.name,
          audio_track: audioFile.name,
          settings: settings
        };

        await fetch('/api/v1/community/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shareData)
        });

        // Success notification would go here
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    }
  };

  const handleNewProject = () => {
    setVideoFile(null);
    setAudioFile(null);
    setProcessedVideo(null);
    setProgress(0);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Mic" size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">AI Video-to-Lipsync Generator</h1>
              <p className="text-text-secondary">Sync lips to audio with precision AI processing</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* File Uploads */}
            {!processedVideo && (
              <>
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-semibold text-text-primary mb-3">Video Upload</h3>
                  <VideoUploader
                    onVideoUpload={handleVideoUpload}
                    uploadedVideo={videoFile}
                    loading={isProcessing}
                  />
                </div>

                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-semibold text-text-primary mb-3">Audio Upload</h3>
                  <AudioUploader
                    onAudioUpload={handleAudioUpload}
                    uploadedAudio={audioFile}
                    loading={isProcessing}
                  />
                </div>
              </>
            )}

            {/* Processing Controls */}
            {videoFile && audioFile && !processedVideo && (
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Ready to Process</h3>
                  <div className="flex items-center gap-1 text-success">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm">Files Ready</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-text-secondary">
                    <p>Video: {videoFile.name}</p>
                    <p>Audio: {audioFile.name}</p>
                  </div>
                  
                  <Button
                    onClick={generateLipSync}
                    disabled={isProcessing}
                    loading={isProcessing}
                    iconName="Play"
                    iconPosition="left"
                    className="w-full"
                  >
                    Generate Lip Sync
                  </Button>
                </div>
              </div>
            )}

            {/* Processing Settings */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Processing Settings</h3>
              <ProcessingSettings
                settings={settings}
                onSettingsChange={setSettings}
                loading={isProcessing}
              />
            </div>

            {/* Community Sharing */}
            {processedVideo && (
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Share Creation</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-primary">Make Public</span>
                    <input
                      type="checkbox"
                      checked={sharingSettings.isPublic}
                      onChange={(e) => setSharingSettings(prev => ({ 
                        ...prev, 
                        isPublic: e.target.checked 
                      }))}
                      className="toggle"
                    />
                  </div>
                  
                  {sharingSettings.isPublic && (
                    <>
                      <textarea
                        placeholder="Describe your creation..."
                        value={sharingSettings.description}
                        onChange={(e) => setSharingSettings(prev => ({ 
                          ...prev, 
                          description: e.target.value 
                        }))}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        rows={3}
                      />
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        iconName="Share2"
                        iconPosition="left"
                        className="w-full"
                      >
                        Share to Community
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Center - Preview/Timeline */}
          <div className="lg:col-span-5">
            {!processedVideo ? (
              <PreviewPlayer
                videoFile={videoFile}
                audioFile={audioFile}
                isProcessing={isProcessing}
                progress={progress}
                estimatedTime={estimatedTime}
              />
            ) : (
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Processing Complete!</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                    <Button
                      onClick={handleNewProject}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      New Project
                    </Button>
                  </div>
                </div>
                
                <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icon name="Play" size={48} className="mx-auto mb-2 opacity-70" />
                    <p>Processed Lip Sync Video</p>
                    <p className="text-sm opacity-70">{processedVideo.duration}</p>
                  </div>
                </div>

                {/* Processing Results */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-text-secondary">Sync Accuracy</label>
                    <p className="font-semibold text-success">{processedVideo.stats?.syncAccuracy}</p>
                  </div>
                  <div>
                    <label className="text-text-secondary">Audio Alignment</label>
                    <p className="font-semibold text-success">{processedVideo.stats?.audioAlignment}</p>
                  </div>
                  <div>
                    <label className="text-text-secondary">File Size</label>
                    <p className="font-semibold text-text-primary">{processedVideo.fileSize}</p>
                  </div>
                  <div>
                    <label className="text-text-secondary">Processing Time</label>
                    <p className="font-semibold text-text-primary">{processedVideo.processingTime}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Editor */}
            {videoFile && audioFile && (
              <div className="mt-6">
                <TimelineEditor
                  videoFile={videoFile}
                  audioFile={audioFile}
                  onSyncAdjustment={() => {}}
                  disabled={isProcessing}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar - Monitor & Queue */}
          <div className="lg:col-span-3 space-y-6">
            <GPUResourceMonitor 
              isProcessing={isProcessing}
              processingStats={processingStats}
            />
            
            {isProcessing && (
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Processing Queue</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Queue Position</span>
                    <span className="font-medium">#{processingStats.queuePosition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Estimated Wait</span>
                    <span className="font-medium">{processingStats.estimatedWaitTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Processing Speed</span>
                    <span className="font-medium">{processingStats.processingSpeed}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2 mt-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted p-1 mb-4 overflow-x-auto">
            {[
              { id: 'upload', label: 'Upload', icon: 'Upload' },
              { id: 'timeline', label: 'Timeline', icon: 'Clock' },
              { id: 'preview', label: 'Preview', icon: 'Play' },
              { id: 'settings', label: 'Settings', icon: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Video File</h3>
                <VideoUploader
                  onVideoUpload={handleVideoUpload}
                  uploadedVideo={videoFile}
                  loading={isProcessing}
                />
              </div>

              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Audio File</h3>
                <AudioUploader
                  onAudioUpload={handleAudioUpload}
                  uploadedAudio={audioFile}
                  loading={isProcessing}
                />
              </div>

              {videoFile && audioFile && (
                <div className="bg-card rounded-lg p-4 border">
                  <Button
                    onClick={generateLipSync}
                    disabled={isProcessing}
                    loading={isProcessing}
                    iconName="Play"
                    iconPosition="left"
                    className="w-full"
                  >
                    Generate Lip Sync
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="bg-card rounded-lg p-4 border">
              <TimelineEditor
                videoFile={videoFile}
                audioFile={audioFile}
                onSyncAdjustment={() => {}}
                disabled={isProcessing}
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div>
              <PreviewPlayer
                videoFile={videoFile}
                audioFile={audioFile}
                processedVideo={processedVideo}
                isProcessing={isProcessing}
                progress={progress}
                estimatedTime={estimatedTime}
              />
              
              {isProcessing && (
                <div className="bg-card rounded-lg p-4 border mt-4">
                  <GPUResourceMonitor 
                    isProcessing={isProcessing}
                    processingStats={processingStats}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Processing Settings</h3>
                <ProcessingSettings
                  settings={settings}
                  onSettingsChange={setSettings}
                  loading={isProcessing}
                />
              </div>

              {processedVideo && (
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-semibold text-text-primary mb-3">Share Creation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-text-primary">Make Public</span>
                      <input
                        type="checkbox"
                        checked={sharingSettings.isPublic}
                        onChange={(e) => setSharingSettings(prev => ({ 
                          ...prev, 
                          isPublic: e.target.checked 
                        }))}
                        className="toggle"
                      />
                    </div>
                    
                    {sharingSettings.isPublic && (
                      <>
                        <textarea
                          placeholder="Describe your creation..."
                          value={sharingSettings.description}
                          onChange={(e) => setSharingSettings(prev => ({ 
                            ...prev, 
                            description: e.target.value 
                          }))}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm"
                          rows={3}
                        />
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          iconName="Share2"
                          iconPosition="left"
                          className="w-full"
                        >
                          Share to Community
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVideoToLipsyncGenerator;