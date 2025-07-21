import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const BatchProcessor = ({
  texts,
  onTextsChange,
  voice,
  settings,
  onBatchGenerate,
  disabled = false
}) => {
  const [newText, setNewText] = useState('');
  const [processingProgress, setProcessingProgress] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const addText = () => {
    if (!newText.trim()) return;
    
    const newBatchItem = {
      id: `batch-${Date.now()}`,
      text: newText.trim(),
      title: newText.slice(0, 50) + (newText.length > 50 ? '...' : ''),
      status: 'pending', // pending, processing, completed, error
      audio: null,
      progress: 0,
      estimatedTime: Math.ceil(newText.length / 15),
      createdAt: new Date().toISOString()
    };
    
    onTextsChange?.([...texts, newBatchItem]);
    setNewText('');
  };

  const removeText = (id) => {
    onTextsChange?.(texts.filter(text => text.id !== id));
  };

  const updateText = (id, newTextContent) => {
    onTextsChange?.(texts.map(text => 
      text.id === id 
        ? { 
            ...text, 
            text: newTextContent,
            title: newTextContent.slice(0, 50) + (newTextContent.length > 50 ? '...' : ''),
            estimatedTime: Math.ceil(newTextContent.length / 15)
          }
        : text
    ));
  };

  const processBatch = async () => {
    if (texts.length === 0) return;
    
    setIsProcessing(true);
    onBatchGenerate?.(texts);

    // Simulate batch processing
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      
      // Update status to processing
      onTextsChange?.(prev => prev.map(t => 
        t.id === text.id ? { ...t, status: 'processing', progress: 0 } : t
      ));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const currentProgress = prev[text.id] || 0;
          const newProgress = Math.min(100, currentProgress + Math.random() * 15);
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            
            // Mark as completed
            onTextsChange?.(prevTexts => prevTexts.map(t => 
              t.id === text.id 
                ? { 
                    ...t, 
                    status: 'completed', 
                    progress: 100,
                    audio: {
                      id: `audio-${Date.now()}-${t.id}`,
                      url: `/api/placeholder/audio?text=${encodeURIComponent(t.text.slice(0, 50))}`,
                      duration: Math.ceil(t.text.length / 15),
                      format: settings.format || 'mp3',
                      quality: settings.quality || 'high'
                    }
                  }
                : t
            ));
          }
          
          return { ...prev, [text.id]: newProgress };
        });
      }, 500);

      // Wait for completion before starting next
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    setIsProcessing(false);
    setProcessingProgress({});
  };

  const downloadAll = () => {
    const completedTexts = texts.filter(text => text.status === 'completed' && text.audio);
    
    completedTexts.forEach((text, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = text.audio.url;
        link.download = `batch-audio-${index + 1}.${text.audio.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // Stagger downloads
    });
  };

  const clearCompleted = () => {
    onTextsChange?.(texts.filter(text => text.status !== 'completed'));
  };

  const totalEstimatedTime = texts.reduce((sum, text) => sum + text.estimatedTime, 0);
  const completedCount = texts.filter(text => text.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Layers" size={18} />
            Batch Processing
          </h3>
          <p className="text-sm text-text-secondary">Process multiple texts with consistent settings</p>
        </div>
      </div>

      {/* Add New Text */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <textarea
          placeholder="Enter text to add to batch..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          disabled={disabled || isProcessing}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          )}
          rows={3}
        />
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={addText}
            disabled={!newText.trim() || disabled || isProcessing}
            iconName="Plus"
            iconPosition="left"
          >
            Add to Batch
          </Button>
          
          <span className="text-xs text-text-secondary">
            {newText.length} chars • ~{Math.ceil(newText.length / 15)}s audio
          </span>
        </div>
      </div>

      {/* Batch Summary */}
      {texts.length > 0 && (
        <div className="grid grid-cols-3 gap-4 p-3 bg-card rounded-lg border">
          <div className="text-center">
            <p className="text-xs text-text-secondary">Total Items</p>
            <p className="text-lg font-semibold text-text-primary">{texts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Completed</p>
            <p className="text-lg font-semibold text-text-primary">{completedCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Est. Time</p>
            <p className="text-lg font-semibold text-text-primary">{totalEstimatedTime}s</p>
          </div>
        </div>
      )}

      {/* Batch Items List */}
      {texts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-text-primary">Batch Items ({texts.length})</h4>
            
            <div className="flex gap-2">
              {completedCount > 0 && (
                <>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={downloadAll}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Download All
                  </Button>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={clearCompleted}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Clear Completed
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {texts.map((text, index) => (
              <div
                key={text.id}
                className={cn(
                  "p-3 rounded-lg border",
                  text.status === 'completed' && "border-success/50 bg-success/5",
                  text.status === 'processing' && "border-primary/50 bg-primary/5",
                  text.status === 'error' && "border-error/50 bg-error/5",
                  text.status === 'pending' && "border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-text-secondary">
                        #{index + 1}
                      </span>
                      <div className={cn(
                        "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                        text.status === 'pending' && "bg-muted text-text-secondary",
                        text.status === 'processing' && "bg-primary/10 text-primary",
                        text.status === 'completed' && "bg-success/10 text-success",
                        text.status === 'error' && "bg-error/10 text-error"
                      )}>
                        <Icon 
                          name={
                            text.status === 'pending' ? 'Clock' :
                            text.status === 'processing' ? 'Loader' :
                            text.status === 'completed'? 'Check' : 'X'
                          } 
                          size={12} 
                        />
                        {text.status}
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-text-primary truncate mb-1">
                      {text.title}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span>{text.text.length} chars</span>
                      <span>~{text.estimatedTime}s</span>
                      {text.audio && (
                        <span className="text-success">Audio ready</span>
                      )}
                    </div>

                    {/* Progress Bar for Processing */}
                    {text.status === 'processing' && (
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${processingProgress[text.id] || 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {text.status === 'completed' && text.audio && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = text.audio.url;
                          link.download = `audio-${index + 1}.${text.audio.format}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Icon name="Download" size={12} />
                      </Button>
                    )}
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6"
                      onClick={() => removeText(text.id)}
                      disabled={text.status === 'processing'}
                    >
                      <Icon name="X" size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Controls */}
      {texts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
          <Button
            onClick={processBatch}
            disabled={disabled || isProcessing || texts.length === 0}
            loading={isProcessing}
            iconName="Play"
            iconPosition="left"
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : `Process All (${texts.length} items)`}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onTextsChange?.([])}
            disabled={disabled || isProcessing}
            iconName="Trash2"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Empty State */}
      {texts.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-lg flex items-center justify-center">
            <Icon name="Layers" size={24} className="text-muted-foreground" />
          </div>
          <h4 className="font-semibold text-text-primary mb-2">No batch items</h4>
          <p className="text-text-secondary text-sm">
            Add multiple texts to process them with consistent voice and settings
          </p>
        </div>
      )}
    </div>
  );
};

export default BatchProcessor;