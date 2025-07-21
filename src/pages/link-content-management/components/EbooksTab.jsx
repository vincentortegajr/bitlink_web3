import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const EbooksTab = ({ 
  ebooks, 
  onAddEbook, 
  onEditEbook, 
  onDeleteEbook, 
  onReplaceEbook,
  selectedItems,
  onSelectItem,
  searchQuery,
  onSearchChange 
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [newEbook, setNewEbook] = useState({
    title: '',
    description: '',
    file: null,
    thumbnail: '',
    price: '',
    category: ''
  });

  const categoryOptions = [
    'Web3 & Blockchain',
    'Cryptocurrency',
    'DeFi & Trading',
    'NFTs & Digital Art',
    'Smart Contracts',
    'Business & Marketing',
    'Technology',
    'Education',
    'Other'
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEbook(prev => ({ 
        ...prev, 
        file: file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const handleAddEbook = () => {
    if (newEbook.title && newEbook.file) {
      onAddEbook({
        ...newEbook,
        id: Date.now().toString(),
        fileName: newEbook.file.name,
        fileSize: newEbook.file.size,
        downloads: 0,
        revenue: 0,
        isActive: true,
        uploadedAt: new Date(),
        thumbnail: newEbook.thumbnail || `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center`
      });
      setNewEbook({ title: '', description: '', file: null, thumbnail: '', price: '', category: '' });
      setIsUploadModalOpen(false);
    }
  };

  const handleEditEbook = (ebook) => {
    setEditingEbook(ebook);
    setNewEbook({
      title: ebook.title,
      description: ebook.description,
      file: null,
      thumbnail: ebook.thumbnail,
      price: ebook.price || '',
      category: ebook.category || ''
    });
    setIsUploadModalOpen(true);
  };

  const handleUpdateEbook = () => {
    if (editingEbook && newEbook.title) {
      onEditEbook(editingEbook.id, {
        ...newEbook,
        fileName: newEbook.file ? newEbook.file.name : editingEbook.fileName,
        fileSize: newEbook.file ? newEbook.file.size : editingEbook.fileSize
      });
      setEditingEbook(null);
      setNewEbook({ title: '', description: '', file: null, thumbnail: '', price: '', category: '' });
      setIsUploadModalOpen(false);
    }
  };

  const handleViewAnalytics = (ebook) => {
    setSelectedEbook(ebook);
    setIsAnalyticsModalOpen(true);
  };

  const filteredEbooks = ebooks.filter(ebook =>
    ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ebook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ebook.category && ebook.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="search"
            placeholder="Search ebooks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="default"
          onClick={() => setIsUploadModalOpen(true)}
          iconName="Upload"
          iconPosition="left"
        >
          Upload Ebook
        </Button>
      </div>

      {/* Ebooks Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEbooks.map((ebook) => (
          <div
            key={ebook.id}
            className={`
              bg-card border border-border rounded-lg overflow-hidden transition-all duration-200
              hover:shadow-medium hover:border-primary/20 hover:-translate-y-1
              ${selectedItems.includes(ebook.id) ? 'ring-2 ring-primary bg-primary/5' : ''}
            `}
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-muted overflow-hidden">
              <Image
                src={ebook.thumbnail}
                alt={ebook.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(ebook.id)}
                  onChange={() => onSelectItem(ebook.id)}
                  className="w-4 h-4 text-primary bg-white border-border rounded focus:ring-primary focus:ring-2"
                />
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEditEbook(ebook)}
                  className="p-1.5 bg-white/90 hover:bg-white rounded-md transition-smooth"
                  title="Edit ebook"
                >
                  <Icon name="Edit2" size={14} />
                </button>
                <button
                  onClick={() => onDeleteEbook(ebook.id)}
                  className="p-1.5 bg-white/90 hover:bg-white text-destructive rounded-md transition-smooth"
                  title="Delete ebook"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
              {ebook.price && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
                  ${ebook.price}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-text-primary line-clamp-2 flex-1">
                  {ebook.title}
                </h3>
                {ebook.isActive ? (
                  <div className="w-2 h-2 bg-success rounded-full ml-2 mt-2" title="Active"></div>
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground rounded-full ml-2 mt-2" title="Inactive"></div>
                )}
              </div>

              {ebook.description && (
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {ebook.description}
                </p>
              )}

              {ebook.category && (
                <div className="mb-3">
                  <span className="inline-block bg-accent/10 text-accent px-2 py-1 rounded-md text-xs font-medium">
                    {ebook.category}
                  </span>
                </div>
              )}

              {/* File Info */}
              <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="File" size={14} />
                  <span>{formatFileSize(ebook.fileSize)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Download" size={14} />
                  <span>{ebook.downloads}</span>
                </div>
              </div>

              {/* Revenue */}
              {ebook.revenue > 0 && (
                <div className="flex items-center space-x-1 text-sm text-success mb-3">
                  <Icon name="DollarSign" size={14} />
                  <span>${ebook.revenue.toFixed(2)} earned</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewAnalytics(ebook)}
                  iconName="BarChart3"
                  iconPosition="left"
                  className="flex-1"
                >
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReplaceEbook(ebook.id)}
                  iconName="RefreshCw"
                  className="px-3"
                  title="Replace file"
                >
                </Button>
              </div>

              <div className="mt-2 text-xs text-text-secondary">
                Uploaded {new Date(ebook.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEbooks.length === 0 && (
        <div className="text-center py-12">
          <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {searchQuery ? 'No ebooks found' : 'No ebooks uploaded yet'}
          </h3>
          <p className="text-text-secondary mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms' :'Upload your first ebook to start sharing digital content'
            }
          </p>
          {!searchQuery && (
            <Button
              variant="default"
              onClick={() => setIsUploadModalOpen(true)}
              iconName="Upload"
              iconPosition="left"
            >
              Upload Your First Ebook
            </Button>
          )}
        </div>
      )}

      {/* Upload/Edit Ebook Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  {editingEbook ? 'Edit Ebook' : 'Upload New Ebook'}
                </h3>
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setEditingEbook(null);
                    setNewEbook({ title: '', description: '', file: null, thumbnail: '', price: '', category: '' });
                  }}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {!editingEbook && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Upload File *
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-smooth">
                      <input
                        type="file"
                        accept=".pdf,.epub,.mobi"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="ebook-upload"
                      />
                      <label htmlFor="ebook-upload" className="cursor-pointer">
                        <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-text-secondary">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          PDF, EPUB, MOBI up to 50MB
                        </p>
                      </label>
                    </div>
                    {newEbook.file && (
                      <p className="text-sm text-success mt-2">
                        Selected: {newEbook.file.name}
                      </p>
                    )}
                  </div>
                )}

                <Input
                  label="Title"
                  type="text"
                  placeholder="Enter ebook title"
                  value={newEbook.title}
                  onChange={(e) => setNewEbook(prev => ({ ...prev, title: e.target.value }))}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief description of your ebook"
                    value={newEbook.description}
                    onChange={(e) => setNewEbook(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Category
                  </label>
                  <select
                    value={newEbook.category}
                    onChange={(e) => setNewEbook(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Price (Optional)"
                  type="number"
                  placeholder="0.00"
                  value={newEbook.price}
                  onChange={(e) => setNewEbook(prev => ({ ...prev, price: e.target.value }))}
                />

                <Input
                  label="Thumbnail URL (Optional)"
                  type="url"
                  placeholder="https://..."
                  value={newEbook.thumbnail}
                  onChange={(e) => setNewEbook(prev => ({ ...prev, thumbnail: e.target.value }))}
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="default"
                    onClick={editingEbook ? handleUpdateEbook : handleAddEbook}
                    disabled={!newEbook.title || (!editingEbook && !newEbook.file)}
                    className="flex-1"
                  >
                    {editingEbook ? 'Update Ebook' : 'Upload Ebook'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setEditingEbook(null);
                      setNewEbook({ title: '', description: '', file: null, thumbnail: '', price: '', category: '' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {isAnalyticsModalOpen && selectedEbook && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  Analytics: {selectedEbook.title}
                </h3>
                <button
                  onClick={() => setIsAnalyticsModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Download" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-text-secondary">Downloads</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">{selectedEbook.downloads}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="DollarSign" size={16} className="text-success" />
                      <span className="text-sm font-medium text-text-secondary">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">${selectedEbook.revenue.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Recent Activity</h4>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>• Downloaded 3 times in the last 7 days</p>
                    <p>• Most popular on weekends</p>
                    <p>• Average rating: 4.5/5 stars</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsAnalyticsModalOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbooksTab;