import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GenerationHistory = ({ onPromptSelect, onImageRegenerate }) => {
  const [history] = useState([
    {
      id: 1,
      prompt: "A futuristic city at sunset with flying cars and neon lights, cyberpunk style, ultra detailed, 8K",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      images: [
        {
          id: 'img-1',
          url: '/api/placeholder/256/256',
          thumbnail: '/api/placeholder/128/128',
          seed: 12345,
          settings: { quality: 'high', steps: 30, cfgScale: 7.5 }
        }
      ],
      status: 'completed',
      processingTime: 95
    },
    {
      id: 2,
      prompt: "Portrait of an elegant woman in vintage clothing, oil painting style, masterpiece",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      images: [
        {
          id: 'img-2',
          url: '/api/placeholder/256/256',
          thumbnail: '/api/placeholder/128/128',
          seed: 67890,
          settings: { quality: 'ultra', steps: 50, cfgScale: 8.0 }
        }
      ],
      status: 'completed',
      processingTime: 142
    },
    {
      id: 3,
      prompt: "Magical forest with glowing mushrooms and fairy lights, fantasy art, highly detailed",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      images: [
        {
          id: 'img-3',
          url: '/api/placeholder/256/256',
          thumbnail: '/api/placeholder/128/128',
          seed: 11111,
          settings: { quality: 'standard', steps: 25, cfgScale: 7.0 }
        }
      ],
      status: 'completed',
      processingTime: 68
    }
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleImageClick = (image, historyItem) => {
    setSelectedImage({ ...image, prompt: historyItem.prompt, processingTime: historyItem.processingTime });
  };

  const handlePromptReuse = (prompt) => {
    onPromptSelect?.(prompt);
  };

  const handleRegenerate = (historyItem, image) => {
    onImageRegenerate?.(historyItem.prompt, image.settings);
  };

  const handleDownload = (imageUrl, prompt) => {
    // Create download link
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Recent Generations</h3>
        <Button variant="ghost" size="sm" iconName="RotateCcw">
          Refresh
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="bg-card rounded-lg p-4 border">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary line-clamp-2 mb-1">
                  {item.prompt}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span>{formatTimeAgo(item.timestamp)}</span>
                  <span>•</span>
                  <span>{item.processingTime}s</span>
                  <span>•</span>
                  <span className={cn(
                    item.status === 'completed' ? 'text-success' : 
                    item.status === 'failed' ? 'text-error' : 'text-warning'
                  )}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="flex gap-2 mb-3">
              {item.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.thumbnail}
                    alt="Generated"
                    className="w-16 h-16 rounded-lg object-cover cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleImageClick(image, item)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                    <Icon 
                      name="ZoomIn" 
                      size={16} 
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handlePromptReuse(item.prompt)}
                iconName="Copy"
                iconPosition="left"
              >
                Reuse Prompt
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleRegenerate(item, item.images[0])}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Regenerate
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleDownload(item.images[0].url, item.prompt)}
                iconName="Download"
                iconPosition="left"
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">Generated Image</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                  iconName="X"
                />
              </div>

              {/* Image */}
              <div className="mb-4">
                <img
                  src={selectedImage.url}
                  alt="Generated"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Prompt</label>
                  <p className="text-sm text-text-primary mt-1">{selectedImage.prompt}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-text-secondary">Seed</label>
                    <p className="text-text-primary">{selectedImage.seed}</p>
                  </div>
                  <div>
                    <label className="font-medium text-text-secondary">Processing Time</label>
                    <p className="text-text-primary">{selectedImage.processingTime}s</p>
                  </div>
                  <div>
                    <label className="font-medium text-text-secondary">Steps</label>
                    <p className="text-text-primary">{selectedImage.settings.steps}</p>
                  </div>
                  <div>
                    <label className="font-medium text-text-secondary">CFG Scale</label>
                    <p className="text-text-primary">{selectedImage.settings.cfgScale}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownload(selectedImage.url, selectedImage.prompt)}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromptReuse(selectedImage.prompt)}
                    iconName="Copy"
                    iconPosition="left"
                  >
                    Reuse Prompt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationHistory;