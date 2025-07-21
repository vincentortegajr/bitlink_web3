import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const ProcessingHistory = ({ onImageRestore }) => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // all, 2x, 4x, 8x

  // Mock history data
  useEffect(() => {
    const mockHistory = [
      {
        id: 'hist-1',
        originalName: 'portrait_photo.jpg',
        scaleFactor: '4x',
        qualityPreset: 'balanced',
        processedAt: new Date(Date.now() - 1000 * 60 * 30),
        processingTime: 87,
        originalSize: '512x768',
        enhancedSize: '2048x3072',
        originalUrl: '/api/placeholder/512/768?text=Portrait+Original',
        enhancedUrl: '/api/placeholder/2048/3072?text=Portrait+4x',
        status: 'completed'
      },
      {
        id: 'hist-2',
        originalName: 'landscape_art.png',
        scaleFactor: '2x',
        qualityPreset: 'fast',
        processedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        processingTime: 34,
        originalSize: '1024x768',
        enhancedSize: '2048x1536',
        originalUrl: '/api/placeholder/1024/768?text=Landscape+Original',
        enhancedUrl: '/api/placeholder/2048/1536?text=Landscape+2x',
        status: 'completed'
      },
      {
        id: 'hist-3',
        originalName: 'product_shot.jpg',
        scaleFactor: '8x',
        qualityPreset: 'high_quality',
        processedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        processingTime: 156,
        originalSize: '300x300',
        enhancedSize: '2400x2400',
        originalUrl: '/api/placeholder/300/300?text=Product+Original',
        enhancedUrl: '/api/placeholder/2400/2400?text=Product+8x',
        status: 'completed'
      },
      {
        id: 'hist-4',
        originalName: 'character_design.png',
        scaleFactor: '4x',
        qualityPreset: 'high_quality',
        processedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        processingTime: 124,
        originalSize: '640x640',
        enhancedSize: '2560x2560',
        originalUrl: '/api/placeholder/640/640?text=Character+Original',
        enhancedUrl: '/api/placeholder/2560/2560?text=Character+4x',
        status: 'processing'
      },
      {
        id: 'hist-5',
        originalName: 'texture_sample.jpg',
        scaleFactor: '2x',
        qualityPreset: 'balanced',
        processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        processingTime: 45,
        originalSize: '512x512',
        enhancedSize: '1024x1024',
        originalUrl: '/api/placeholder/512/512?text=Texture+Original',
        enhancedUrl: '/api/placeholder/1024/1024?text=Texture+2x',
        status: 'failed'
      }
    ];

    setHistory(mockHistory);
  }, []);

  const filteredHistory = history.filter(item => 
    filter === 'all' || item.scaleFactor === filter
  );

  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-yellow-500';
      case 'failed': return 'text-destructive';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  const handleDownload = (item) => {
    if (item.status === 'completed' && item.enhancedUrl) {
      const link = document.createElement('a');
      link.href = item.enhancedUrl;
      link.download = `upscaled-${item.scaleFactor}-${item.originalName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReprocess = (item) => {
    // Would trigger reprocessing with same settings
    onImageRestore?.(item);
  };

  const handleDelete = (itemId) => {
    setHistory(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Processing History</h3>
        
        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm px-2 py-1 bg-background border border-border rounded text-text-primary"
        >
          <option value="all">All</option>
          <option value="2x">2x Scale</option>
          <option value="4x">4x Scale</option>
          <option value="8x">8x Scale</option>
        </select>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Clock" size={24} className="text-text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">No processing history yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-muted/50 rounded-lg p-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon 
                    name={getStatusIcon(item.status)} 
                    size={14} 
                    className={getStatusColor(item.status)}
                  />
                  <span className="font-medium text-text-primary text-sm truncate">
                    {item.originalName}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  {formatTime(item.processedAt)}
                </span>
              </div>

              {/* Thumbnail & Info */}
              <div className="flex gap-3 mb-3">
                <div className="flex gap-2">
                  <img
                    src={item.originalUrl}
                    alt="Original"
                    className="w-12 h-12 object-cover rounded border"
                  />
                  {item.status === 'completed' && (
                    <>
                      <Icon name="ArrowRight" size={14} className="text-text-secondary self-center" />
                      <img
                        src={item.enhancedUrl}
                        alt="Enhanced"
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-secondary space-y-1">
                    <div>Scale: {item.scaleFactor} • {item.qualityPreset}</div>
                    <div>{item.originalSize} → {item.enhancedSize}</div>
                    {item.status === 'completed' && (
                      <div>Processed in {item.processingTime}s</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {item.status === 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(item)}
                      iconName="Download"
                      iconPosition="left"
                      className="text-xs"
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReprocess(item)}
                      iconName="RefreshCw"
                      iconPosition="left"
                      className="text-xs"
                    >
                      Reprocess
                    </Button>
                  </>
                )}
                
                {item.status === 'processing' && (
                  <div className="flex items-center gap-2 text-xs text-yellow-500">
                    <Icon name="Loader2" size={12} className="animate-spin" />
                    Processing...
                  </div>
                )}
                
                {item.status === 'failed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReprocess(item)}
                    iconName="RotateCcw"
                    iconPosition="left"
                    className="text-xs"
                  >
                    Retry
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  iconName="Trash2"
                  className="text-xs text-destructive hover:text-destructive"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storage Usage */}
      <div className="mt-6 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Storage Used</span>
          <span className="text-sm text-text-primary">2.4 GB / 10 GB</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2"
            style={{ width: '24%' }}
          />
        </div>
        <div className="text-xs text-text-secondary mt-1">
          History auto-cleanup after 30 days
        </div>
      </div>
    </div>
  );
};

export default ProcessingHistory;