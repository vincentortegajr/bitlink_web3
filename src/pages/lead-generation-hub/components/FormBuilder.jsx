import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FormBuilder = ({ isOpen, onClose, onSave, editingForm = null }) => {
  const [formData, setFormData] = useState({
    name: editingForm?.name || '',
    description: editingForm?.description || '',
    fields: editingForm?.fields || [
      { id: '1', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' }
    ],
    settings: {
      submitText: editingForm?.settings?.submitText || 'Subscribe',
      successMessage: editingForm?.settings?.successMessage || 'Thank you for subscribing!',
      redirectUrl: editingForm?.settings?.redirectUrl || '',
      collectConsent: editingForm?.settings?.collectConsent || true,
      doubleOptIn: editingForm?.settings?.doubleOptIn || false
    }
  });

  const [activeTab, setActiveTab] = useState('fields');

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: 'Type' },
    { type: 'email', label: 'Email', icon: 'Mail' },
    { type: 'tel', label: 'Phone', icon: 'Phone' },
    { type: 'textarea', label: 'Text Area', icon: 'FileText' },
    { type: 'select', label: 'Dropdown', icon: 'ChevronDown' },
    { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare' }
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: `Enter ${type}...`,
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const moveField = (fieldId, direction) => {
    const currentIndex = formData.fields.findIndex(f => f.id === fieldId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < formData.fields.length) {
      const newFields = [...formData.fields];
      [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
      setFormData(prev => ({ ...prev, fields: newFields }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-prominent w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {editingForm ? 'Edit Form' : 'Create New Form'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Panel - Form Builder */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('fields')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeTab === 'fields' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Fields
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeTab === 'settings' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Settings
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'fields' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <Input
                      label="Form Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter form name"
                      required
                    />
                    <Input
                      label="Description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this form"
                    />
                  </div>

                  {/* Field Types */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">Add Fields</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {fieldTypes.map((fieldType) => (
                        <button
                          key={fieldType.type}
                          onClick={() => addField(fieldType.type)}
                          className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-muted transition-smooth"
                        >
                          <Icon name={fieldType.icon} size={16} />
                          <span className="text-sm">{fieldType.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Fields */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">Form Fields</h3>
                    <div className="space-y-3">
                      {formData.fields.map((field, index) => (
                        <div key={field.id} className="border border-border rounded-md p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Icon name="GripVertical" size={16} className="text-text-secondary" />
                              <span className="text-sm font-medium">{field.type.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => moveField(field.id, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-smooth"
                              >
                                <Icon name="ChevronUp" size={14} />
                              </button>
                              <button
                                onClick={() => moveField(field.id, 'down')}
                                disabled={index === formData.fields.length - 1}
                                className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-smooth"
                              >
                                <Icon name="ChevronDown" size={14} />
                              </button>
                              <button
                                onClick={() => removeField(field.id)}
                                className="p-1 hover:bg-destructive/10 text-destructive rounded transition-smooth"
                              >
                                <Icon name="Trash2" size={14} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              label="Label"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              size="sm"
                            />
                            <Input
                              label="Placeholder"
                              value={field.placeholder}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              size="sm"
                            />
                          </div>
                          
                          <div className="mt-3">
                            <Checkbox
                              label="Required field"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      label="Submit Button Text"
                      value={formData.settings.submitText}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, submitText: e.target.value }
                      }))}
                    />
                    
                    <Input
                      label="Success Message"
                      value={formData.settings.successMessage}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, successMessage: e.target.value }
                      }))}
                    />
                    
                    <Input
                      label="Redirect URL (Optional)"
                      value={formData.settings.redirectUrl}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, redirectUrl: e.target.value }
                      }))}
                      placeholder="https://example.com/thank-you"
                    />
                  </div>

                  <div className="space-y-3">
                    <Checkbox
                      label="Collect GDPR Consent"
                      description="Add a consent checkbox for GDPR compliance"
                      checked={formData.settings.collectConsent}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, collectConsent: e.target.checked }
                      }))}
                    />
                    
                    <Checkbox
                      label="Double Opt-in"
                      description="Send confirmation email before adding to list"
                      checked={formData.settings.doubleOptIn}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, doubleOptIn: e.target.checked }
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-80 border-l border-border bg-muted/30">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-text-primary">Preview</h3>
            </div>
            <div className="p-4">
              <div className="bg-surface border border-border rounded-lg p-4 shadow-subtle">
                <h4 className="font-semibold text-text-primary mb-2">{formData.name || 'Form Name'}</h4>
                {formData.description && (
                  <p className="text-sm text-text-secondary mb-4">{formData.description}</p>
                )}
                
                <div className="space-y-3">
                  {formData.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm"
                          rows={3}
                          disabled
                        />
                      ) : field.type === 'select' ? (
                        <select className="w-full px-3 py-2 border border-border rounded-md text-sm" disabled>
                          <option>{field.placeholder}</option>
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" disabled className="rounded" />
                          <span className="text-sm">{field.placeholder}</span>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm"
                          disabled
                        />
                      )}
                    </div>
                  ))}
                  
                  {formData.settings.collectConsent && (
                    <div className="flex items-start space-x-2 pt-2">
                      <input type="checkbox" disabled className="mt-1 rounded" />
                      <span className="text-xs text-text-secondary">
                        I agree to receive marketing communications
                      </span>
                    </div>
                  )}
                  
                  <button
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium"
                    disabled
                  >
                    {formData.settings.submitText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingForm ? 'Update Form' : 'Create Form'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;