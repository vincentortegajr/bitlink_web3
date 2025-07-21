import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmailListCard = ({ list, onExport, onEdit, onDelete, onViewContacts }) => {
  const [showActions, setShowActions] = useState(false);

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-success' : 'text-destructive';
  };

  const getEngagementColor = (rate) => {
    if (rate >= 25) return 'text-success';
    if (rate >= 15) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 shadow-subtle hover:shadow-medium transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-text-primary">{list.name}</h3>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              list.status === 'active' ? 'text-success bg-success/10' : 'text-text-secondary bg-muted'
            }`}>
              {list.status}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{list.description}</p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon name="MoreVertical" size={16} />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-surface border border-border rounded-md shadow-prominent z-10">
              <button
                onClick={() => {
                  onViewContacts(list.id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-smooth"
              >
                <Icon name="Users" size={14} />
                <span>View Contacts</span>
              </button>
              <button
                onClick={() => {
                  onEdit(list.id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-smooth"
              >
                <Icon name="Edit" size={14} />
                <span>Edit List</span>
              </button>
              <button
                onClick={() => {
                  onExport(list.id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-smooth"
              >
                <Icon name="Download" size={14} />
                <span>Export CSV</span>
              </button>
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  onDelete(list.id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-smooth"
              >
                <Icon name="Trash2" size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/50 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-text-primary">{list.subscribers.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">Subscribers</p>
            </div>
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <Icon 
              name={list.growth >= 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={12} 
              className={getGrowthColor(list.growth)}
            />
            <span className={`text-xs font-medium ${getGrowthColor(list.growth)}`}>
              {list.growth >= 0 ? '+' : ''}{list.growth}% this month
            </span>
          </div>
        </div>

        <div className="bg-muted/50 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-text-primary">{list.engagementRate}%</p>
              <p className="text-xs text-text-secondary">Engagement</p>
            </div>
            <Icon name="Activity" size={20} className={getEngagementColor(list.engagementRate)} />
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Last campaign: {list.lastCampaign}
          </p>
        </div>
      </div>

      {/* Tags */}
      {list.tags && list.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {list.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {list.tags.length > 3 && (
            <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-md">
              +{list.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onExport(list.id)}
          iconName="Download"
          iconPosition="left"
          className="flex-1"
        >
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewContacts(list.id)}
          iconName="Users"
          iconPosition="left"
          className="flex-1"
        >
          View
        </Button>
      </div>
    </div>
  );
};

export default EmailListCard;