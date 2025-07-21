import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LeadMagnetsTab = ({ 
  leadMagnets, 
  onAddLeadMagnet, 
  onEditLeadMagnet, 
  onDeleteLeadMagnet,
  selectedItems,
  onSelectItem,
  searchQuery,
  onSearchChange 
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMagnet, setEditingMagnet] = useState(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedMagnet, setSelectedMagnet] = useState(null);
  const [newMagnet, setNewMagnet] = useState({
    title: '',
    description: '',
    type: '',
    targetAudience: '',
    callToAction: '',
    incentive: ''
  });

  const magnetTypes = [
    { value: 'popup', label: 'Popup Form' },
    { value: 'inline', label: 'Inline Form' },
    { value: 'sidebar', label: 'Sidebar Widget' },
    { value: 'exit-intent', label: 'Exit Intent' },
    { value: 'scroll-trigger', label: 'Scroll Trigger' },
    { value: 'timed', label: 'Timed Popup' }
  ];

  const getTypeIcon = (type) => {
    const iconMap = {
      popup: 'MessageSquare',
      inline: 'FileText',
      sidebar: 'Sidebar',
      'exit-intent': 'MousePointer',
      'scroll-trigger': 'ArrowDown',
      timed: 'Clock'
    };
    return iconMap[type] || 'FormInput';
  };

  const getTypeColor = (type) => {
    const colorMap = {
      popup: 'text-blue-500 bg-blue-50',
      inline: 'text-green-500 bg-green-50',
      sidebar: 'text-purple-500 bg-purple-50',
      'exit-intent': 'text-red-500 bg-red-50',
      'scroll-trigger': 'text-orange-500 bg-orange-50',
      timed: 'text-indigo-500 bg-indigo-50'
    };
    return colorMap[type] || 'text-gray-500 bg-gray-50';
  };

  const handleAddMagnet = () => {
    if (newMagnet.title && newMagnet.type) {
      onAddLeadMagnet({
        ...newMagnet,
        id: Date.now().toString(),
        views: 0,
        conversions: 0,
        conversionRate: 0,
        isActive: true,
        createdAt: new Date(),
        abTestVariants: []
      });
      setNewMagnet({ title: '', description: '', type: '', targetAudience: '', callToAction: '', incentive: '' });
      setIsCreateModalOpen(false);
    }
  };

  const handleEditMagnet = (magnet) => {
    setEditingMagnet(magnet);
    setNewMagnet({
      title: magnet.title,
      description: magnet.description,
      type: magnet.type,
      targetAudience: magnet.targetAudience || '',
      callToAction: magnet.callToAction || '',
      incentive: magnet.incentive || ''
    });
    setIsCreateModalOpen(true);
  };

  const handleUpdateMagnet = () => {
    if (editingMagnet && newMagnet.title && newMagnet.type) {
      onEditLeadMagnet(editingMagnet.id, newMagnet);
      setEditingMagnet(null);
      setNewMagnet({ title: '', description: '', type: '', targetAudience: '', callToAction: '', incentive: '' });
      setIsCreateModalOpen(false);
    }
  };

  const handleViewAnalytics = (magnet) => {
    setSelectedMagnet(magnet);
    setIsAnalyticsModalOpen(true);
  };

  const filteredMagnets = leadMagnets.filter(magnet =>
    magnet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    magnet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    magnet.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="search"
            placeholder="Search lead magnets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="default"
          onClick={() => setIsCreateModalOpen(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Create Lead Magnet
        </Button>
      </div>

      {/* Lead Magnets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMagnets.map((magnet) => (
          <div
            key={magnet.id}
            className={`
              bg-card border border-border rounded-lg p-4 transition-all duration-200
              hover:shadow-medium hover:border-primary/20 hover:-translate-y-1
              ${selectedItems.includes(magnet.id) ? 'ring-2 ring-primary bg-primary/5' : ''}
            `}
          >
            {/* Selection Checkbox & Actions */}
            <div className="flex items-start justify-between mb-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(magnet.id)}
                onChange={() => onSelectItem(magnet.id)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditMagnet(magnet)}
                  className="p-1 hover:bg-muted rounded-md transition-smooth"
                  title="Edit lead magnet"
                >
                  <Icon name="Edit2" size={14} />
                </button>
                <button
                  onClick={() => onDeleteLeadMagnet(magnet.id)}
                  className="p-1 hover:bg-destructive/10 text-destructive rounded-md transition-smooth"
                  title="Delete lead magnet"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>

            {/* Type Icon & Status */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-md ${getTypeColor(magnet.type)}`}>
                <Icon name={getTypeIcon(magnet.type)} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-text-primary truncate">{magnet.title}</h3>
                  {magnet.isActive ? (
                    <div className="w-2 h-2 bg-success rounded-full" title="Active"></div>
                  ) : (
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" title="Inactive"></div>
                  )}
                </div>
                <p className="text-xs text-text-secondary capitalize">
                  {magnet.type.replace('-', ' ')} • {magnetTypes.find(t => t.value === magnet.type)?.label}
                </p>
              </div>
            </div>

            {/* Description */}
            {magnet.description && (
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {magnet.description}
              </p>
            )}

            {/* Incentive */}
            {magnet.incentive && (
              <div className="mb-3">
                <span className="inline-block bg-accent/10 text-accent px-2 py-1 rounded-md text-xs font-medium">
                  {magnet.incentive}
                </span>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Views</span>
                <span className="font-medium text-text-primary">{magnet.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Conversions</span>
                <span className="font-medium text-text-primary">{magnet.conversions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Conversion Rate</span>
                <span className={`font-medium ${magnet.conversionRate > 5 ? 'text-success' : magnet.conversionRate > 2 ? 'text-warning' : 'text-destructive'}`}>
                  {magnet.conversionRate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* A/B Testing Indicator */}
            {magnet.abTestVariants && magnet.abTestVariants.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-primary mb-3">
                <Icon name="TestTube" size={12} />
                <span>A/B Testing ({magnet.abTestVariants.length} variants)</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewAnalytics(magnet)}
                iconName="BarChart3"
                iconPosition="left"
                className="flex-1"
              >
                Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="TestTube"
                className="px-3"
                title="A/B Test"
              >
              </Button>
            </div>

            <div className="mt-2 text-xs text-text-secondary">
              Created {new Date(magnet.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMagnets.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FormInput" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {searchQuery ? 'No lead magnets found' : 'No lead magnets created yet'}
          </h3>
          <p className="text-text-secondary mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms' :'Create your first lead magnet to start capturing leads'
            }
          </p>
          {!searchQuery && (
            <Button
              variant="default"
              onClick={() => setIsCreateModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Create Your First Lead Magnet
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Lead Magnet Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  {editingMagnet ? 'Edit Lead Magnet' : 'Create New Lead Magnet'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingMagnet(null);
                    setNewMagnet({ title: '', description: '', type: '', targetAudience: '', callToAction: '', incentive: '' });
                  }}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Title"
                  type="text"
                  placeholder="e.g., Free Crypto Trading Guide"
                  value={newMagnet.title}
                  onChange={(e) => setNewMagnet(prev => ({ ...prev, title: e.target.value }))}
                  required
                />

                <Select
                  label="Type"
                  placeholder="Select lead magnet type"
                  options={magnetTypes}
                  value={newMagnet.type}
                  onChange={(value) => setNewMagnet(prev => ({ ...prev, type: value }))}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe what this lead magnet offers"
                    value={newMagnet.description}
                    onChange={(e) => setNewMagnet(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <Input
                  label="Incentive"
                  type="text"
                  placeholder="e.g., Free PDF Download, 10% Discount"
                  value={newMagnet.incentive}
                  onChange={(e) => setNewMagnet(prev => ({ ...prev, incentive: e.target.value }))}
                />

                <Input
                  label="Call to Action"
                  type="text"
                  placeholder="e.g., Download Now, Get Free Access"
                  value={newMagnet.callToAction}
                  onChange={(e) => setNewMagnet(prev => ({ ...prev, callToAction: e.target.value }))}
                />

                <Input
                  label="Target Audience"
                  type="text"
                  placeholder="e.g., Crypto beginners, DeFi traders"
                  value={newMagnet.targetAudience}
                  onChange={(e) => setNewMagnet(prev => ({ ...prev, targetAudience: e.target.value }))}
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="default"
                    onClick={editingMagnet ? handleUpdateMagnet : handleAddMagnet}
                    disabled={!newMagnet.title || !newMagnet.type}
                    className="flex-1"
                  >
                    {editingMagnet ? 'Update Lead Magnet' : 'Create Lead Magnet'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingMagnet(null);
                      setNewMagnet({ title: '', description: '', type: '', targetAudience: '', callToAction: '', incentive: '' });
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
      {isAnalyticsModalOpen && selectedMagnet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  Analytics: {selectedMagnet.title}
                </h3>
                <button
                  onClick={() => setIsAnalyticsModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Icon name="Eye" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-text-secondary">Views</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">{selectedMagnet.views.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Icon name="UserPlus" size={16} className="text-success" />
                      <span className="text-sm font-medium text-text-secondary">Conversions</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">{selectedMagnet.conversions.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Icon name="TrendingUp" size={16} className="text-accent" />
                      <span className="text-sm font-medium text-text-secondary">Rate</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">{selectedMagnet.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Performance Insights</h4>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>• Best performing on mobile devices (68% of conversions)</p>
                    <p>• Peak activity between 2-4 PM EST</p>
                    <p>• Higher conversion rate on weekends (+15%)</p>
                    <p>• Average time to conversion: 2.3 minutes</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Recent Activity</h4>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p>• 23 new leads captured in the last 7 days</p>
                    <p>• 156 views with 14.7% conversion rate</p>
                    <p>• Top traffic source: Social media (45%)</p>
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

export default LeadMagnetsTab;