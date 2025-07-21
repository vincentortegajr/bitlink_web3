import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FormCard = ({ form, onEdit, onDelete, onDuplicate, onToggleStatus }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-success bg-success/10' : 'text-text-secondary bg-muted';
  };

  const getConversionColor = (rate) => {
    if (rate >= 15) return 'text-success';
    if (rate >= 8) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-subtle hover:shadow-medium transition-smooth">
      {/* Form Preview */}
      <div className="relative h-32 bg-muted overflow-hidden">
        <Image
          src={form.thumbnail || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop`}
          alt={`${form.name} preview`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 bg-surface/90 backdrop-blur-sm rounded-md hover:bg-surface transition-smooth"
          >
            <Icon name="MoreVertical" size={16} />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-md shadow-prominent z-10">
              <button
                onClick={() => {
                  onEdit(form.id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-smooth"
              >
                <Icon name="Edit" size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onDuplicate(form.id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-smooth"
              >
                <Icon name="Copy" size={14} />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => {
                  onToggleStatus(form.id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-smooth"
              >
                <Icon name={form.status === 'active' ? 'Pause' : 'Play'} size={14} />
                <span>{form.status === 'active' ? 'Pause' : 'Activate'}</span>
              </button>
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  onDelete(form.id);
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
        
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(form.status)}`}>
            {form.status === 'active' ? 'Active' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Form Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary">{form.name}</h3>
            <p className="text-sm text-text-secondary mt-1">{form.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{form.views.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">Views</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{form.submissions.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">Submissions</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${getConversionColor(form.conversionRate)}`}>
              {form.conversionRate}%
            </p>
            <p className="text-xs text-text-secondary">Conversion</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(form.id)}
            iconName="Edit"
            iconPosition="left"
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            className="px-3"
          >
            <span className="sr-only">View form</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormCard;