import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ComponentLibrary = ({ onDragStart, isVisible, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('social');

  const componentCategories = {
    social: {
      label: 'Social Links',
      icon: 'Share2',
      components: [
        {
          id: 'twitter-link',
          name: 'Twitter Link',
          icon: 'Twitter',
          description: 'Add your Twitter profile link',
          preview: 'twitter.com/username'
        },
        {
          id: 'instagram-link',
          name: 'Instagram Link',
          icon: 'Instagram',
          description: 'Add your Instagram profile link',
          preview: 'instagram.com/username'
        },
        {
          id: 'linkedin-link',
          name: 'LinkedIn Link',
          icon: 'Linkedin',
          description: 'Add your LinkedIn profile link',
          preview: 'linkedin.com/in/username'
        },
        {
          id: 'youtube-link',
          name: 'YouTube Link',
          icon: 'Youtube',
          description: 'Add your YouTube channel link',
          preview: 'youtube.com/@username'
        },
        {
          id: 'discord-link',
          name: 'Discord Link',
          icon: 'MessageCircle',
          description: 'Add your Discord server link',
          preview: 'discord.gg/server'
        }
      ]
    },
    payments: {
      label: 'Crypto Payments',
      icon: 'CreditCard',
      components: [
        {
          id: 'payment-button',
          name: 'Payment Button',
          icon: 'CreditCard',
          description: 'Accept crypto payments',
          preview: 'Pay with Crypto'
        },
        {
          id: 'donation-button',
          name: 'Donation Button',
          icon: 'Heart',
          description: 'Accept crypto donations',
          preview: 'Support Me'
        },
        {
          id: 'subscription-button',
          name: 'Subscription',
          icon: 'Repeat',
          description: 'Monthly crypto subscriptions',
          preview: 'Subscribe Monthly'
        },
        {
          id: 'tip-jar',
          name: 'Tip Jar',
          icon: 'Coffee',
          description: 'Accept crypto tips',
          preview: 'Buy me a coffee'
        }
      ]
    },
    content: {
      label: 'Content & Media',
      icon: 'FileText',
      components: [
        {
          id: 'ebook-download',
          name: 'Ebook Download',
          icon: 'BookOpen',
          description: 'Share downloadable ebooks',
          preview: 'Download Free Guide'
        },
        {
          id: 'video-embed',
          name: 'Video Embed',
          icon: 'Play',
          description: 'Embed YouTube videos',
          preview: 'Watch Video'
        },
        {
          id: 'image-gallery',
          name: 'Image Gallery',
          icon: 'Image',
          description: 'Showcase your work',
          preview: 'View Gallery'
        },
        {
          id: 'text-block',
          name: 'Text Block',
          icon: 'Type',
          description: 'Add custom text content',
          preview: 'Custom text here...'
        }
      ]
    },
    leads: {
      label: 'Lead Generation',
      icon: 'Users',
      components: [
        {
          id: 'email-signup',
          name: 'Email Signup',
          icon: 'Mail',
          description: 'Collect email addresses',
          preview: 'Join Newsletter'
        },
        {
          id: 'contact-form',
          name: 'Contact Form',
          icon: 'MessageSquare',
          description: 'Contact form with fields',
          preview: 'Get in Touch'
        },
        {
          id: 'lead-magnet',
          name: 'Lead Magnet',
          icon: 'Gift',
          description: 'Free resource for emails',
          preview: 'Get Free Resource'
        },
        {
          id: 'waitlist-signup',
          name: 'Waitlist Signup',
          icon: 'Clock',
          description: 'Collect waitlist signups',
          preview: 'Join Waitlist'
        }
      ]
    }
  };

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    onDragStart(component);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-surface border-r border-border h-full overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Layers" size={20} />
            <span>Components</span>
          </h2>
          <p className="text-sm text-text-secondary mt-1">Drag components to your profile</p>
        </div>

        {/* Category Tabs */}
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(componentCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center space-x-2 p-2 rounded-md text-sm font-medium transition-smooth ${
                  activeCategory === key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={category.icon} size={16} />
                <span className="truncate">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Component List */}
        <div className="p-4 space-y-3">
          {componentCategories[activeCategory].components.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              className="p-3 border border-border rounded-lg cursor-grab hover:border-primary hover:shadow-subtle transition-smooth bg-card"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 text-primary rounded-md">
                  <Icon name={component.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text-primary">{component.name}</h3>
                  <p className="text-xs text-text-secondary mt-1">{component.description}</p>
                  <div className="mt-2 p-2 bg-muted rounded text-xs text-text-secondary font-mono">
                    {component.preview}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isVisible && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-surface rounded-t-lg max-h-[80vh] flex flex-col animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                  <Icon name="Layers" size={20} />
                  <span>Components</span>
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
              <p className="text-sm text-text-secondary mt-1">Drag components to your profile</p>
            </div>

            {/* Mobile Category Tabs */}
            <div className="p-4 border-b border-border">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {Object.entries(componentCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-smooth ${
                      activeCategory === key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                    }`}
                  >
                    <Icon name={category.icon} size={16} />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Component List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {componentCategories[activeCategory].components.map((component) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  className="p-3 border border-border rounded-lg cursor-grab hover:border-primary hover:shadow-subtle transition-smooth bg-card"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <Icon name={component.icon} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-text-primary">{component.name}</h3>
                      <p className="text-xs text-text-secondary mt-1">{component.description}</p>
                      <div className="mt-2 p-2 bg-muted rounded text-xs text-text-secondary font-mono">
                        {component.preview}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComponentLibrary;