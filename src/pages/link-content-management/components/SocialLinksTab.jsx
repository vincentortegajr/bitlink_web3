import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SocialLinksTab = ({ 
  links, 
  onAddLink, 
  onEditLink, 
  onDeleteLink, 
  onReorderLinks,
  selectedItems,
  onSelectItem,
  searchQuery,
  onSearchChange 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    platform: '',
    description: ''
  });

  const platformOptions = [
    { value: 'twitter', label: 'Twitter', icon: 'Twitter' },
    { value: 'instagram', label: 'Instagram', icon: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' },
    { value: 'youtube', label: 'YouTube', icon: 'Youtube' },
    { value: 'tiktok', label: 'TikTok', icon: 'Music' },
    { value: 'github', label: 'GitHub', icon: 'Github' },
    { value: 'website', label: 'Website', icon: 'Globe' },
    { value: 'discord', label: 'Discord', icon: 'MessageCircle' },
    { value: 'telegram', label: 'Telegram', icon: 'Send' },
    { value: 'custom', label: 'Custom Link', icon: 'Link' }
  ];

  const getPlatformIcon = (platform) => {
    const platformData = platformOptions.find(p => p.value === platform);
    return platformData?.icon || 'Link';
  };

  const getPlatformColor = (platform) => {
    const colorMap = {
      twitter: 'text-blue-500 bg-blue-50',
      instagram: 'text-pink-500 bg-pink-50',
      linkedin: 'text-blue-600 bg-blue-50',
      youtube: 'text-red-500 bg-red-50',
      tiktok: 'text-black bg-gray-50',
      github: 'text-gray-800 bg-gray-50',
      website: 'text-green-500 bg-green-50',
      discord: 'text-indigo-500 bg-indigo-50',
      telegram: 'text-blue-400 bg-blue-50',
      custom: 'text-purple-500 bg-purple-50'
    };
    return colorMap[platform] || 'text-gray-500 bg-gray-50';
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      onAddLink({
        ...newLink,
        id: Date.now().toString(),
        clicks: 0,
        isActive: true,
        createdAt: new Date()
      });
      setNewLink({ title: '', url: '', platform: '', description: '' });
      setIsAddModalOpen(false);
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setNewLink(link);
    setIsAddModalOpen(true);
  };

  const handleUpdateLink = () => {
    if (editingLink && newLink.title && newLink.url) {
      onEditLink(editingLink.id, newLink);
      setEditingLink(null);
      setNewLink({ title: '', url: '', platform: '', description: '' });
      setIsAddModalOpen(false);
    }
  };

  const handleDragStart = (e, link) => {
    setDraggedItem(link);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLink) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== targetLink.id) {
      onReorderLinks(draggedItem.id, targetLink.id);
    }
    setDraggedItem(null);
  };

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="search"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="default"
          onClick={() => setIsAddModalOpen(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Link
        </Button>
      </div>

      {/* Links Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLinks.map((link) => (
          <div
            key={link.id}
            draggable
            onDragStart={(e) => handleDragStart(e, link)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, link)}
            className={`
              bg-card border border-border rounded-lg p-4 transition-all duration-200 cursor-move
              hover:shadow-medium hover:border-primary/20 hover:-translate-y-1
              ${selectedItems.includes(link.id) ? 'ring-2 ring-primary bg-primary/5' : ''}
              ${draggedItem?.id === link.id ? 'opacity-50' : ''}
            `}
          >
            {/* Selection Checkbox */}
            <div className="flex items-start justify-between mb-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(link.id)}
                onChange={() => onSelectItem(link.id)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditLink(link)}
                  className="p-1 hover:bg-muted rounded-md transition-smooth"
                  title="Edit link"
                >
                  <Icon name="Edit2" size={14} />
                </button>
                <button
                  onClick={() => onDeleteLink(link.id)}
                  className="p-1 hover:bg-destructive/10 text-destructive rounded-md transition-smooth"
                  title="Delete link"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>

            {/* Platform Icon & Status */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-md ${getPlatformColor(link.platform)}`}>
                <Icon name={getPlatformIcon(link.platform)} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-text-primary truncate">{link.title}</h3>
                  {link.isActive ? (
                    <div className="w-2 h-2 bg-success rounded-full" title="Active"></div>
                  ) : (
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" title="Inactive"></div>
                  )}
                </div>
                <p className="text-sm text-text-secondary truncate">{link.url}</p>
              </div>
            </div>

            {/* Description */}
            {link.description && (
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {link.description}
              </p>
            )}

            {/* Analytics */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-text-secondary">
                  <Icon name="MousePointer" size={14} />
                  <span>{link.clicks.toLocaleString()} clicks</span>
                </div>
              </div>
              <span className="text-xs text-text-secondary">
                {new Date(link.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLinks.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Link" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {searchQuery ? 'No links found' : 'No social links yet'}
          </h3>
          <p className="text-text-secondary mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms' :'Add your first social media link to get started'
            }
          </p>
          {!searchQuery && (
            <Button
              variant="default"
              onClick={() => setIsAddModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Link
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Link Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingLink(null);
                    setNewLink({ title: '', url: '', platform: '', description: '' });
                  }}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <Select
                  label="Platform"
                  placeholder="Select platform"
                  options={platformOptions.map(p => ({ value: p.value, label: p.label }))}
                  value={newLink.platform}
                  onChange={(value) => setNewLink(prev => ({ ...prev, platform: value }))}
                  required
                />

                <Input
                  label="Link Title"
                  type="text"
                  placeholder="e.g., Follow me on Twitter"
                  value={newLink.title}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  required
                />

                <Input
                  label="URL"
                  type="url"
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  required
                />

                <Input
                  label="Description (Optional)"
                  type="text"
                  placeholder="Brief description of this link"
                  value={newLink.description}
                  onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="default"
                    onClick={editingLink ? handleUpdateLink : handleAddLink}
                    disabled={!newLink.title || !newLink.url || !newLink.platform}
                    className="flex-1"
                  >
                    {editingLink ? 'Update Link' : 'Add Link'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingLink(null);
                      setNewLink({ title: '', url: '', platform: '', description: '' });
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
    </div>
  );
};

export default SocialLinksTab;