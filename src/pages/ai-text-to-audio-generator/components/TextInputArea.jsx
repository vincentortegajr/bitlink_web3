import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const TextInputArea = ({
  text,
  onTextChange,
  disabled = false,
  maxLength = 5000,
  placeholder = "Enter the text you want to convert to speech..."
}) => {
  const [showFormatting, setShowFormatting] = useState(false);

  const formatSuggestions = [
    {
      name: 'Add Pause',
      symbol: '[pause:1s]',
      description: 'Insert a 1-second pause'
    },
    {
      name: 'Emphasis',
      symbol: '*word*',
      description: 'Add emphasis to word'
    },
    {
      name: 'Slow Down',
      symbol: '[slow]text[/slow]',
      description: 'Speak text slowly'
    },
    {
      name: 'Speed Up',
      symbol: '[fast]text[/fast]',
      description: 'Speak text quickly'
    }
  ];

  const handleInsertFormat = (symbol) => {
    const textarea = document.querySelector('#text-input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let newText;
    if (symbol.includes('text')) {
      newText = text.substring(0, start) + symbol.replace('text', selectedText || 'text') + text.substring(end);
    } else {
      newText = text.substring(0, start) + symbol + text.substring(end);
    }
    
    onTextChange?.(newText);
    setShowFormatting(false);
  };

  const estimatedReadingTime = Math.ceil(text.length / 15); // ~15 chars per second
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Text Input */}
      <div className="relative">
        <textarea
          id="text-input"
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            "min-h-[120px]"
          )}
          placeholder={placeholder}
          value={text}
          onChange={(e) => onTextChange?.(e.target.value)}
          disabled={disabled}
          maxLength={maxLength}
          rows={6}
        />
        
        {/* Character count indicator */}
        <div className="absolute bottom-2 right-2 text-xs text-text-secondary bg-background/80 rounded px-2 py-1">
          {text.length}/{maxLength}
        </div>
      </div>

      {/* Text Statistics */}
      <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-text-secondary">Characters</p>
          <p className="text-sm font-semibold text-text-primary">{text.length.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-secondary">Words</p>
          <p className="text-sm font-semibold text-text-primary">{wordCount.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-secondary">Est. Duration</p>
          <p className="text-sm font-semibold text-text-primary">{estimatedReadingTime}s</p>
        </div>
      </div>

      {/* Formatting Tools */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowFormatting(!showFormatting)}
          iconName={showFormatting ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          disabled={disabled}
        >
          Formatting
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onTextChange?.('')}
          iconName="Trash2"
          iconPosition="left"
          disabled={disabled || !text}
        >
          Clear
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            navigator.clipboard.readText().then(clipText => {
              onTextChange?.(text + (text ? '\n\n' : '') + clipText);
            }).catch(() => {
              // Fallback for browsers that don't support clipboard API
              const clipText = prompt('Paste your text here:');
              if (clipText) {
                onTextChange?.(text + (text ? '\n\n' : '') + clipText);
              }
            });
          }}
          iconName="Clipboard"
          iconPosition="left"
          disabled={disabled}
        >
          Paste
        </Button>
      </div>

      {/* Formatting Suggestions */}
      {showFormatting && (
        <div className="bg-card border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Type" size={16} className="text-primary" />
            <h4 className="text-sm font-medium text-text-primary">Speech Formatting</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {formatSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleInsertFormat(suggestion.symbol)}
                disabled={disabled}
                className={cn(
                  "text-left p-2 rounded-md border border-border hover:bg-muted/50 transition-colors",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                    {suggestion.symbol}
                  </code>
                  <span className="text-xs font-medium text-text-primary">{suggestion.name}</span>
                </div>
                <p className="text-xs text-text-secondary">{suggestion.description}</p>
              </button>
            ))}
          </div>
          
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary">Pro Tips</p>
                <ul className="text-xs text-text-secondary mt-1 space-y-0.5">
                  <li>• Use punctuation for natural pauses</li>
                  <li>• Break long sentences into shorter ones</li>
                  <li>• Add phonetic spelling in brackets: [foh-net-ik]</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextInputArea;