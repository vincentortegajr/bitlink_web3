import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';

// Components
import TextInputArea from './components/TextInputArea';
import VoiceSelector from './components/VoiceSelector';
import AudioPreview from './components/AudioPreview';
import AdvancedSettings from './components/AdvancedSettings';
import BatchProcessor from './components/BatchProcessor';
import ExportSettings from './components/ExportSettings';
import CommunitySharing from './components/CommunitySharing';

const AITextToAudioGenerator = () => {
  const navigate = useNavigate();
  
  // State management
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [activeTab, setActiveTab] = useState('generate'); // generate, batch, community, export
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Voice and settings state
  const [selectedVoice, setSelectedVoice] = useState({
    id: 'voice-1',
    name: 'Sarah',
    language: 'en-US',
    gender: 'female',
    style: 'conversational',
    preview: '/audio/previews/sarah-preview.mp3'
  });

  const [settings, setSettings] = useState({
    speed: 1.0,
    pitch: 1.0,
    emotion: 'neutral',
    pauseDuration: 0.5,
    format: 'mp3',
    quality: 'high',
    addPauses: true,
    pronunciationGuide: false
  });

  const [batchTexts, setBatchTexts] = useState([]);
  const [communitySettings, setCommunitySettings] = useState({
    isPublic: false,
    title: '',
    description: '',
    tags: []
  });

  // FastAPI endpoint integration
  const generateAudio = useCallback(async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setEstimatedTime(45); // Initial estimate

    try {
      const response = await fetch('/api/v1/text-to-audio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice_id: selectedVoice.id,
          speed: settings.speed,
          pitch: settings.pitch,
          emotion: settings.emotion,
          pause_duration: settings.pauseDuration,
          format: settings.format,
          quality: settings.quality,
          add_pauses: settings.addPauses,
          pronunciation_guide: settings.pronunciationGuide
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(100, prev + Math.random() * 12);
            setEstimatedTime(prev => Math.max(0, prev - 1.5));
            return newProgress;
          });
        }, 800);

        // Simulate completion
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setEstimatedTime(0);
          
          // Mock generated audio
          const newAudio = {
            id: `audio-${Date.now()}`,
            url: `/api/placeholder/audio?text=${encodeURIComponent(text.slice(0, 50))}`,
            duration: Math.floor(text.length / 15), // Rough estimate: 15 chars per second
            waveform: Array.from({ length: 100 }, () => Math.random() * 100),
            voice: selectedVoice,
            settings: { ...settings },
            text: text,
            processingTime: 32 + Math.random() * 20,
            createdAt: new Date().toISOString()
          };

          setGeneratedAudio(newAudio);
          setIsGenerating(false);
        }, 6000);

      } else {
        throw new Error('Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  }, [text, selectedVoice, settings]);

  const handleBatchGeneration = async (texts) => {
    setBatchTexts(texts);
    setActiveTab('batch');
    // Implementation for batch processing
  };

  const handleExport = (format, quality) => {
    if (generatedAudio) {
      // Implementation for audio export
      const link = document.createElement('a');
      link.href = generatedAudio.url;
      link.download = `ai-audio-${generatedAudio.id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCommunityShare = async (shareSettings) => {
    if (generatedAudio) {
      setCommunitySettings(shareSettings);
      // Implementation for community sharing
      console.log('Sharing to community:', shareSettings);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Volume2" size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">AI Text-to-Audio Generator</h1>
              <p className="text-text-secondary">Transform text into natural speech with AI voices</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Text Input & Voice */}
          <div className="lg:col-span-4 space-y-6">
            {/* Text Input */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Text Content</h3>
              <TextInputArea
                text={text}
                onTextChange={setText}
                disabled={isGenerating}
                maxLength={5000}
              />
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-text-secondary">
                  {text.length}/5000 characters • ~{Math.ceil(text.length / 15)}s audio
                </span>
                <Button
                  onClick={generateAudio}
                  disabled={!text.trim() || isGenerating}
                  loading={isGenerating}
                  iconName="Volume2"
                  iconPosition="left"
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Voice Selection */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Voice Selection</h3>
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceSelect={setSelectedVoice}
                disabled={isGenerating}
              />
            </div>

            {/* Advanced Settings */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-text-primary mb-3">Advanced Settings</h3>
              <AdvancedSettings
                settings={settings}
                onSettingsChange={setSettings}
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Center - Audio Preview */}
          <div className="lg:col-span-5">
            <AudioPreview
              isGenerating={isGenerating}
              progress={progress}
              estimatedTime={estimatedTime}
              generatedAudio={generatedAudio}
              onExport={handleExport}
              onRegenerate={() => generateAudio()}
            />
          </div>

          {/* Right Sidebar - Export & Community */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-lg p-4 border">
              <ExportSettings
                audio={generatedAudio}
                onExport={handleExport}
                disabled={!generatedAudio}
              />
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <CommunitySharing
                audio={generatedAudio}
                onShare={handleCommunityShare}
                settings={communitySettings}
                onSettingsChange={setCommunitySettings}
                disabled={!generatedAudio}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-muted p-1 mb-4 overflow-x-auto">
            {[
              { id: 'generate', label: 'Generate', icon: 'Volume2' },
              { id: 'batch', label: 'Batch', icon: 'Layers' },
              { id: 'community', label: 'Share', icon: 'Users' },
              { id: 'export', label: 'Export', icon: 'Download' }
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
          {activeTab === 'generate' && (
            <div className="space-y-4">
              {/* Audio Preview */}
              <AudioPreview
                isGenerating={isGenerating}
                progress={progress}
                estimatedTime={estimatedTime}
                generatedAudio={generatedAudio}
                onExport={handleExport}
                onRegenerate={() => generateAudio()}
              />

              {/* Text Input */}
              <div className="bg-card rounded-lg p-4 border">
                <TextInputArea
                  text={text}
                  onTextChange={setText}
                  disabled={isGenerating}
                  maxLength={5000}
                />
                
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMobileSettings(!showMobileSettings)}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Settings
                  </Button>
                  <Button
                    onClick={generateAudio}
                    disabled={!text.trim() || isGenerating}
                    loading={isGenerating}
                    iconName="Volume2"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Generate
                  </Button>
                </div>
              </div>

              {/* Voice Selection */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-text-primary mb-3">Voice Selection</h3>
                <VoiceSelector
                  selectedVoice={selectedVoice}
                  onVoiceSelect={setSelectedVoice}
                  disabled={isGenerating}
                />
              </div>

              {/* Mobile Settings */}
              {showMobileSettings && (
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-text-primary">Advanced Settings</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileSettings(false)}
                      iconName="X"
                    />
                  </div>
                  <AdvancedSettings
                    settings={settings}
                    onSettingsChange={setSettings}
                    disabled={isGenerating}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'batch' && (
            <div className="bg-card rounded-lg p-4 border">
              <BatchProcessor
                texts={batchTexts}
                onTextsChange={setBatchTexts}
                voice={selectedVoice}
                settings={settings}
                onBatchGenerate={handleBatchGeneration}
                disabled={isGenerating}
              />
            </div>
          )}

          {activeTab === 'community' && (
            <div className="bg-card rounded-lg p-4 border">
              <CommunitySharing
                audio={generatedAudio}
                onShare={handleCommunityShare}
                settings={communitySettings}
                onSettingsChange={setCommunitySettings}
                disabled={!generatedAudio}
              />
            </div>
          )}

          {activeTab === 'export' && (
            <div className="bg-card rounded-lg p-4 border">
              <ExportSettings
                audio={generatedAudio}
                onExport={handleExport}
                disabled={!generatedAudio}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITextToAudioGenerator;