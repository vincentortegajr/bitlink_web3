import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const VoiceSelector = ({
  selectedVoice,
  onVoiceSelect,
  disabled = false
}) => {
  const [isPlaying, setIsPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const audioRef = useRef(null);

  // Mock voice data - would come from API in production
  const voices = [
    {
      id: 'voice-1',
      name: 'Sarah',
      language: 'en-US',
      gender: 'female',
      style: 'conversational',
      category: 'natural',
      preview: '/audio/previews/sarah-preview.mp3',
      accent: 'American',
      age: 'young-adult',
      description: 'Warm, friendly conversational voice'
    },
    {
      id: 'voice-2',
      name: 'Marcus',
      language: 'en-US',
      gender: 'male',
      style: 'professional',
      category: 'business',
      preview: '/audio/previews/marcus-preview.mp3',
      accent: 'American',
      age: 'adult',
      description: 'Clear, authoritative business voice'
    },
    {
      id: 'voice-3',
      name: 'Emma',
      language: 'en-GB',
      gender: 'female',
      style: 'dramatic',
      category: 'entertainment',
      preview: '/audio/previews/emma-preview.mp3',
      accent: 'British',
      age: 'young-adult',
      description: 'Expressive voice perfect for storytelling'
    },
    {
      id: 'voice-4',
      name: 'James',
      language: 'en-GB',
      gender: 'male',
      style: 'narrator',
      category: 'education',
      preview: '/audio/previews/james-preview.mp3',
      accent: 'British',
      age: 'mature',
      description: 'Distinguished narrator voice'
    },
    {
      id: 'voice-5',
      name: 'Luna',
      language: 'en-US',
      gender: 'female',
      style: 'energetic',
      category: 'creative',
      preview: '/audio/previews/luna-preview.mp3',
      accent: 'American',
      age: 'young',
      description: 'Upbeat, enthusiastic creative voice'
    },
    {
      id: 'voice-6',
      name: 'David',
      language: 'en-AU',
      gender: 'male',
      style: 'casual',
      category: 'natural',
      preview: '/audio/previews/david-preview.mp3',
      accent: 'Australian',
      age: 'adult',
      description: 'Relaxed, approachable casual voice'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Voices', icon: 'Users' },
    { id: 'natural', label: 'Natural', icon: 'Heart' },
    { id: 'business', label: 'Business', icon: 'Briefcase' },
    { id: 'entertainment', label: 'Entertainment', icon: 'Drama' },
    { id: 'education', label: 'Education', icon: 'GraduationCap' },
    { id: 'creative', label: 'Creative', icon: 'Palette' }
  ];

  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voice.accent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || voice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const playPreview = async (voiceId, previewUrl) => {
    if (disabled) return;
    
    try {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (isPlaying === voiceId) {
        setIsPlaying(null);
        return;
      }

      setIsPlaying(voiceId);
      
      // In production, this would be the actual preview audio
      // For now, we'll simulate audio playback
      const audio = new Audio(previewUrl);
      audioRef.current = audio;
      
      audio.addEventListener('ended', () => {
        setIsPlaying(null);
        audioRef.current = null;
      });
      
      audio.addEventListener('error', () => {
        setIsPlaying(null);
        audioRef.current = null;
      });
      
      await audio.play();
      
    } catch (error) {
      console.error('Preview playback failed:', error);
      setIsPlaying(null);
      audioRef.current = null;
    }
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(null);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          <input
            type="text"
            placeholder="Search voices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
            className={cn(
              "flex w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-text-secondary hover:text-text-primary hover:bg-muted/70",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon name={category.icon} size={12} />
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredVoices.map((voice) => (
          <div
            key={voice.id}
            className={cn(
              "relative p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm",
              selectedVoice?.id === voice.id
                ? "border-primary bg-primary/5" :"border-border hover:border-border/80",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && onVoiceSelect?.(voice)}
          >
            {/* Voice Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    voice.gender === 'female' 
                      ? "bg-pink-100 text-pink-700" :"bg-blue-100 text-blue-700"
                  )}>
                    {voice.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{voice.name}</h4>
                    <p className="text-xs text-text-secondary">{voice.accent} • {voice.style}</p>
                  </div>
                </div>
                
                {/* Preview Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPlaying === voice.id) {
                      stopPreview();
                    } else {
                      playPreview(voice.id, voice.preview);
                    }
                  }}
                  disabled={disabled}
                >
                  <Icon 
                    name={isPlaying === voice.id ? "Square" : "Play"} 
                    size={14} 
                  />
                </Button>
              </div>

              <p className="text-xs text-text-secondary">{voice.description}</p>

              {/* Voice Attributes */}
              <div className="flex flex-wrap gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-text-secondary">
                  {voice.language}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-text-secondary">
                  {voice.age}
                </span>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedVoice?.id === voice.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-primary-foreground" />
                </div>
              </div>
            )}

            {/* Playing Indicator */}
            {isPlaying === voice.id && (
              <div className="absolute inset-0 bg-primary/5 rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-2 bg-background/90 px-3 py-1 rounded-full">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-3 bg-primary rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-primary">Playing...</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredVoices.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-3 opacity-50" />
          <p className="text-text-secondary">No voices found matching your criteria</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Selected Voice Summary */}
      {selectedVoice && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Volume2" size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Selected Voice</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">{selectedVoice.name}</p>
              <p className="text-xs text-text-secondary">
                {selectedVoice.accent} {selectedVoice.gender} • {selectedVoice.style}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => playPreview(selectedVoice.id, selectedVoice.preview)}
              disabled={disabled}
              iconName={isPlaying === selectedVoice.id ? "Square" : "Play"}
              iconPosition="left"
            >
              {isPlaying === selectedVoice.id ? "Stop" : "Preview"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;